/**
 * The build engine: a crew of agent cursors that assembles the page on every
 * load, in the hero and then in every section as it scrolls into view. Each
 * named agent drags out a frame; a swarm of small cursors rushes in to help.
 *
 * Everything here is plain DOM + the Web Animations API. Animations only touch
 * `transform` and `opacity` (plus the size of one small frame box), so they run
 * on the compositor and stay smooth while React is busy.
 *
 * Elements opt in with `data-b="<name>"`. Hero elements also carry
 * `data-b-hero="<order>"` so they are drawn first, in order.
 *
 * Cursors and frames live in a layer positioned in document coordinates, so
 * they scroll with the content they are drawing.
 */
import { agents, compactCrew, CURSOR_PATH, CURSOR_TIP, type Agent, type AgentId } from './agents';
import { clamp } from './utils';

export const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';

/** A block that has waited this long is shown without waiting for a cursor. */
const MAX_WAIT = 900;
/** Longest queue the crew keeps when the visitor scrolls fast. */
const MAX_BACKLOG = 7;

const SVG_NS = 'http://www.w3.org/2000/svg';

type Point = { x: number; y: number };

export type BuildEvent = { agent: Agent; name: string; done: boolean };

/* ----------------------------------------------------------------------------
 * Scope: owns every animation, timer and temporary node so the whole build
 * can be cancelled in one call (Skip button, Escape, unmount).
 * ------------------------------------------------------------------------- */

class Aborted extends Error {}

export class Scope {
  aborted = false;
  private animations = new Set<Animation>();
  private sleepers = new Map<number, (reason: Aborted) => void>();
  private nodes = new Set<Element>();

  private check() {
    if (this.aborted) throw new Aborted();
  }

  /** Run a Web Animation and wait for it to finish. */
  async play(el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    this.check();
    const animation = el.animate(keyframes, options);
    this.animations.add(animation);
    try {
      await animation.finished;
    } catch {
      // Cancelled by abort(); check() below turns that into an Aborted.
    }
    this.animations.delete(animation);
    this.check();
  }

  sleep(ms: number) {
    this.check();
    return new Promise<void>((resolve, reject) => {
      const id = window.setTimeout(() => {
        this.sleepers.delete(id);
        resolve();
      }, ms);
      this.sleepers.set(id, reject);
    });
  }

  /** Track a temporary node so abort() removes it. */
  own<T extends Element>(node: T) {
    this.nodes.add(node);
    return node;
  }

  release(node: Element) {
    this.nodes.delete(node);
    node.remove();
  }

  /** Run a task in the background; an abort ends it quietly. */
  spawn(task: () => Promise<unknown>) {
    return task().then(
      () => undefined,
      (error: unknown) => {
        if (!(error instanceof Aborted)) throw error;
      }
    );
  }

  abort() {
    if (this.aborted) return;
    this.aborted = true;
    this.animations.forEach((animation) => animation.cancel());
    this.sleepers.forEach((reject, id) => {
      window.clearTimeout(id);
      reject(new Aborted());
    });
    this.nodes.forEach((node) => node.remove());
    this.animations.clear();
    this.sleepers.clear();
    this.nodes.clear();
  }
}

/* ----------------------------------------------------------------------------
 * DOM helpers
 * ------------------------------------------------------------------------- */

/** A cursor element. Mini cursors are smaller and carry no name tag. */
function cursorNode(agent: Agent, mini = false) {
  const el = document.createElement('span');
  el.className = mini ? 'agent-cursor agent-cursor--mini' : 'agent-cursor';
  el.dataset.agent = agent.id;
  el.setAttribute('aria-hidden', 'true');

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CURSOR_PATH);
  svg.append(path);
  if (mini) {
    el.append(svg);
    return el;
  }

  const tag = document.createElement('span');
  tag.className = 'agent-cursor__tag';
  tag.textContent = agent.name;

  el.append(svg, tag);
  return el;
}

/** A selection frame with four corner handles and a size label. */
function frameNode(agent: Agent) {
  const el = document.createElement('span');
  el.className = 'build-frame';
  el.dataset.agent = agent.id;
  el.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 4; i += 1) el.append(document.createElement('i'));
  const size = document.createElement('span');
  size.className = 'build-frame__size';
  el.append(size);
  return el;
}

const translate = (p: Point) => `translate3d(${p.x - CURSOR_TIP}px, ${p.y - CURSOR_TIP}px, 0)`;

/** The visible part of the page, in document coordinates. */
const viewport = () => ({
  left: window.scrollX,
  top: window.scrollY,
  right: window.scrollX + window.innerWidth,
  bottom: window.scrollY + window.innerHeight,
});

/** Mark a block as built. Returns false if it already was. */
export function reveal(el: HTMLElement) {
  if (el.hasAttribute('data-built')) return false;
  el.setAttribute('data-built', '');
  el.dispatchEvent(new CustomEvent('b:built'));
  return true;
}

const heroParts = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-b-hero]')).sort(
    (a, b) => Number(a.dataset.bHero) - Number(b.dataset.bHero)
  );

export const onScreen = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight - 24;
};

/**
 * Put the hero in its finished state: everything on screen visible, key words
 * selected. Hero elements below the fold are left for the scroll reveals.
 */
export function settleHero() {
  heroParts().filter(onScreen).forEach(reveal);
  document.querySelectorAll('mark.sel').forEach((mark) => mark.classList.add('is-selected'));
  document.querySelectorAll('.parked').forEach((cursor) => cursor.classList.add('is-in'));
}

/** Show a block without a cursor: instantly, or with a quick pop. */
function popIn(el: HTMLElement, instant: boolean) {
  if (!reveal(el) || instant) return;
  el.animate(
    [
      { opacity: 0, transform: 'scale(0.97)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
    { duration: 360, easing: EASE_OUT }
  );
}

/** Return visits: a plain, quick fade-up. */
export function fadeBlock(el: HTMLElement, delay: number) {
  el.animate(
    [
      { opacity: 0, transform: 'translate3d(0, 18px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    ],
    { duration: 720, delay, easing: EASE_OUT, fill: 'backwards' }
  );
}

/* ----------------------------------------------------------------------------
 * Swarm: small unnamed cursors that rush to a block while it is being drawn,
 * click on it, and drift away.
 * ------------------------------------------------------------------------- */

const random = (min: number, max: number) => min + Math.random() * (max - min);

function swarm(
  scope: Scope,
  layer: HTMLElement,
  box: { x: number; y: number; w: number; h: number }
) {
  const view = viewport();
  const narrow = window.innerWidth < 640;
  const count = narrow ? 2 : clamp(Math.round((box.w * box.h) / 40000), 3, 6);
  // Aim only at the part of the block that is on screen.
  const reach = clamp(view.bottom - box.y, 40, box.h);

  for (let i = 0; i < count; i += 1) {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const target = {
      x: box.x + box.w * random(0.1, 0.9),
      y: box.y + reach * random(0.12, 0.88),
    };
    const start =
      Math.random() < 0.7
        ? {
            x: Math.random() < 0.5 ? view.left - 30 : view.right + 30,
            y: clamp(target.y + random(-260, 260), view.top, view.bottom),
          }
        : { x: clamp(target.x + random(-320, 320), view.left, view.right), y: view.bottom + 30 };
    const exit = { x: target.x + random(-140, 140), y: target.y + random(-110, 110) };
    const duration = random(900, 1350);
    const delay = random(0, 280);

    const cursor = scope.own(cursorNode(agent, true));
    const ring = scope.own(document.createElement('span'));
    ring.className = 'click-ring';
    ring.dataset.agent = agent.id;
    layer.append(ring, cursor);

    scope.spawn(async () => {
      await Promise.all([
        scope.play(
          cursor,
          [
            { transform: translate(start), opacity: 0, easing: 'cubic-bezier(0.3, 0, 0.15, 1)' },
            { opacity: 1, offset: 0.14 },
            { transform: translate(target), opacity: 1, offset: 0.55 },
            { transform: translate(target), opacity: 1, offset: 0.72, easing: 'ease-in' },
            { transform: translate(exit), opacity: 0 },
          ],
          { duration, delay, fill: 'both' }
        ),
        // The click: a ring that expands from the point the cursor lands on.
        scope.play(
          ring,
          [
            { transform: `${translate(target)} scale(0.3)`, opacity: 0 },
            { opacity: 0.9, offset: 0.08 },
            { transform: `${translate(target)} scale(1.9)`, opacity: 0 },
          ],
          { duration: 480, delay: delay + duration * 0.56, easing: EASE_OUT, fill: 'both' }
        ),
      ]);
      scope.release(cursor);
      scope.release(ring);
    });
  }
}

/* ----------------------------------------------------------------------------
 * Easing for cursor travel, sampled in JS so the path can curve.
 * ------------------------------------------------------------------------- */

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i += 1) {
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= (sampleX(t) - x) / slope;
    }
    return sampleY(clamp(t, 0, 1));
  };
}

const travelEase = cubicBezier(0.3, 0, 0.15, 1);
const TRAVEL_STEPS = 20;

/* ----------------------------------------------------------------------------
 * Cursor
 * ------------------------------------------------------------------------- */

class Cursor {
  readonly el: HTMLElement;
  /** True while the cursor is parked off screen, waiting for work. */
  away = true;
  private x = 0;
  private y = 0;

  constructor(
    private scope: Scope,
    layer: HTMLElement,
    readonly agent: Agent,
    private slot: number
  ) {
    this.el = scope.own(cursorNode(agent));
    this.el.style.opacity = '0';
    layer.append(this.el);
  }

  private set(p: Point) {
    this.x = p.x;
    this.y = p.y;
    this.el.style.transform = translate(p);
  }

  /**
   * Make sure the cursor is on screen before it starts work. If it was away,
   * or the page scrolled it out of view, it re-enters from an edge near `target`.
   */
  summon(target: Point) {
    const view = viewport();
    const visible =
      !this.away &&
      this.x > view.left - 40 &&
      this.x < view.right + 40 &&
      this.y > view.top - 40 &&
      this.y < view.bottom + 40;
    if (visible) return;

    const spread = (this.slot - 2) * 70;
    const x = clamp(target.x + spread, view.left + 60, view.right - 60);
    const y = clamp(target.y + spread, view.top + 90, view.bottom - 60);
    const entrances = [
      { x: view.left - 48, y },
      { x: view.right + 48, y },
      { x, y: view.bottom + 48 },
    ];
    this.set(entrances[this.slot % entrances.length]);
    this.el.style.opacity = '1';
    this.away = false;
  }

  /**
   * Move the pointer tip to `to`. With `easing` the path is a straight line that
   * uses that CSS easing (so it can stay in sync with another animation);
   * otherwise the cursor travels along a gentle arc.
   */
  moveTo(to: Point, { duration, easing }: { duration?: number; easing?: string } = {}) {
    const from = { x: this.x, y: this.y };
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const ms = duration ?? clamp(150 + Math.hypot(dx, dy) * 0.3, 200, 440);
    this.set(to);

    if (easing) {
      return this.scope.play(
        this.el,
        [{ transform: translate(from) }, { transform: translate(to) }],
        { duration: ms, easing }
      );
    }

    const bend = 0.16;
    const mid = { x: from.x + dx / 2 - dy * bend, y: from.y + dy / 2 + dx * bend };
    const frames = Array.from({ length: TRAVEL_STEPS + 1 }, (_, i) => {
      const k = travelEase(i / TRAVEL_STEPS);
      const inv = 1 - k;
      return {
        transform: translate({
          x: inv * inv * from.x + 2 * inv * k * mid.x + k * k * to.x,
          y: inv * inv * from.y + 2 * inv * k * mid.y + k * k * to.y,
        }),
      };
    });
    return this.scope.play(this.el, frames, { duration: ms, easing: 'linear' });
  }

  /** Slide off the nearest side of the screen and wait there. */
  async leave() {
    const view = viewport();
    const toLeft = this.x - view.left < window.innerWidth / 2;
    await this.moveTo(
      { x: toLeft ? view.left - 48 : view.right + 48, y: this.y + 70 },
      { duration: 420 }
    );
    this.hide();
  }

  hide() {
    this.el.style.opacity = '0';
    this.away = true;
  }
}

/* ----------------------------------------------------------------------------
 * The two gestures: drawing a block, and selecting a word.
 * ------------------------------------------------------------------------- */

/** Drag a frame around `el`, then let the real element fade in inside it. */
async function drawPart(scope: Scope, layer: HTMLElement, cursor: Cursor, el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const pad = 6;
  const x = rect.left + window.scrollX - pad;
  const y = rect.top + window.scrollY - pad;
  const w = rect.width + pad * 2;
  const h = rect.height + pad * 2;

  swarm(scope, layer, { x, y, w, h });
  cursor.summon({ x, y });
  await cursor.moveTo({ x, y });

  const frame = scope.own(frameNode(cursor.agent));
  frame.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  frame.style.width = `${w}px`;
  frame.style.height = `${h}px`;
  layer.append(frame);

  const drag = clamp(190 + Math.hypot(w, h) * 0.09, 240, 340);
  cursor.el.classList.add('is-down');
  await Promise.all([
    scope.play(
      frame,
      [
        { width: '0px', height: '0px' },
        { width: `${w}px`, height: `${h}px` },
      ],
      { duration: drag, easing: EASE_IN_OUT }
    ),
    cursor.moveTo({ x: x + w, y: y + h }, { duration: drag, easing: EASE_IN_OUT }),
  ]);
  cursor.el.classList.remove('is-down');

  frame.querySelector('.build-frame__size')!.textContent =
    `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
  frame.classList.add('is-set');
  reveal(el);

  // The element fades in and the frame fades out while the cursor moves on.
  scope.spawn(() =>
    Promise.all([
      scope.play(
        el,
        [
          { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        { duration: 440, easing: EASE_OUT }
      ),
      scope
        .play(frame, [{ opacity: 1 }, { opacity: 1, offset: 0.55 }, { opacity: 0 }], {
          duration: 560,
          fill: 'forwards',
        })
        .then(() => scope.release(frame)),
    ])
  );

  await scope.sleep(50);
}

/** Drag across a highlighted word, then hand over to its parked cursor. */
async function selectWord(cursor: Cursor, mark: HTMLElement) {
  const rect = mark.getBoundingClientRect();
  const parked = mark.querySelector<HTMLElement>('.parked');
  const parkedRect = parked?.getBoundingClientRect();
  const end = parkedRect
    ? { x: parkedRect.left + CURSOR_TIP, y: parkedRect.top + CURSOR_TIP }
    : { x: rect.right, y: rect.bottom };
  const toDoc = (p: Point) => ({ x: p.x + window.scrollX, y: p.y + window.scrollY });
  const start = toDoc({ x: rect.left, y: rect.top + rect.height * 0.6 });

  cursor.summon(start);
  await cursor.moveTo(start);
  cursor.el.classList.add('is-down');
  mark.classList.add('is-selected');
  await cursor.moveTo(toDoc(end), { duration: 420, easing: EASE_IN_OUT });
  cursor.el.classList.remove('is-down');
  parked?.classList.add('is-in');
  cursor.hide();
}

/* ----------------------------------------------------------------------------
 * Crew: a pool of agent cursors working through a shared queue of blocks.
 * ------------------------------------------------------------------------- */

type QueueItem = { el: HTMLElement; at: number; patient: boolean };
type Job = (cursor: Cursor) => Promise<void>;

export class Crew {
  readonly roster: Agent[];
  private queue: QueueItem[] = [];
  private jobs = new Map<AgentId, Job>();
  private busy = 0;
  private wakers: (() => void)[] = [];
  private idlers: (() => void)[] = [];

  constructor(
    private scope: Scope,
    private layer: HTMLElement,
    private report: (event: BuildEvent) => void
  ) {
    // Fewer cursors on narrow screens so they do not crowd the content.
    this.roster =
      window.innerWidth < 640 ? agents.filter((agent) => compactCrew.includes(agent.id)) : agents;
    this.roster.forEach((agent, slot) => {
      const cursor = new Cursor(scope, layer, agent, slot);
      scope.spawn(() => this.work(cursor));
    });
  }

  /**
   * Add blocks to draw. "Patient" blocks (the hero) always wait for a cursor;
   * the rest are shown on their own if the crew cannot get to them in time.
   */
  enqueue(els: HTMLElement[], patient = false) {
    const at = performance.now();
    els.forEach((el) => this.queue.push({ el, at, patient }));
    this.wake();
    if (!patient) {
      this.scope.spawn(async () => {
        await this.scope.sleep(MAX_WAIT + 30);
        this.prune();
      });
    }
  }

  /** Give one agent a specific job to do before it returns to the queue. */
  assign(id: AgentId, job: Job) {
    if (!this.roster.some((agent) => agent.id === id)) return;
    this.jobs.set(id, job);
    this.wake();
  }

  /** Resolves once the queue is empty and every agent has finished. */
  whenIdle() {
    if (this.isIdle()) return Promise.resolve();
    return new Promise<void>((resolve) => this.idlers.push(resolve));
  }

  private isIdle() {
    return this.busy === 0 && this.queue.length === 0 && this.jobs.size === 0;
  }

  private wake() {
    const wakers = this.wakers;
    this.wakers = [];
    wakers.forEach((resolve) => resolve());
  }

  private nextWake() {
    return new Promise<void>((resolve) => this.wakers.push(resolve));
  }

  private finish() {
    this.busy -= 1;
    this.settle();
  }

  /** Tell anyone waiting on whenIdle() if there is nothing left to do. */
  private settle() {
    if (!this.isIdle()) return;
    const idlers = this.idlers;
    this.idlers = [];
    idlers.forEach((resolve) => resolve());
  }

  /** Drop blocks that no longer need a cursor, showing them straight away. */
  private prune() {
    const now = performance.now();
    this.queue = this.queue.filter((item) => {
      if (item.el.hasAttribute('data-built')) return false;
      const rect = item.el.getBoundingClientRect();
      const gone = rect.bottom < 0 || rect.top > window.innerHeight;
      const stale = !item.patient && now - item.at > MAX_WAIT;
      if (!gone && !stale) return true;
      popIn(item.el, gone);
      return false;
    });

    // Fast scrolling: keep only the most recent blocks for the cursors.
    while (this.queue.length > MAX_BACKLOG) {
      const index = this.queue.findIndex((item) => !item.patient);
      if (index < 0) break;
      popIn(this.queue.splice(index, 1)[0].el, false);
    }
    this.settle();
  }

  private take() {
    this.prune();
    return this.queue.shift()?.el;
  }

  /** One agent's loop: special jobs first, then the queue, then wait. */
  private async work(cursor: Cursor) {
    const { agent } = cursor;
    for (;;) {
      const job = this.jobs.get(agent.id);
      if (job) {
        this.jobs.delete(agent.id);
        this.busy += 1;
        await job(cursor);
        this.finish();
        continue;
      }

      const el = this.take();
      if (el) {
        const name = el.dataset.b || 'block';
        this.busy += 1;
        this.report({ agent, name, done: false });
        await drawPart(this.scope, this.layer, cursor, el);
        this.report({ agent, name, done: true });
        this.finish();
        continue;
      }

      if (cursor.away) {
        await this.nextWake();
        continue;
      }

      // Nothing to do: linger for a moment, then get out of the way.
      const lingered = await Promise.race([
        this.nextWake().then(() => false),
        this.scope.sleep(480).then(() => true),
      ]);
      if (lingered) await cursor.leave();
    }
  }
}

/**
 * The opening sequence: the crew draws every hero element that is on screen,
 * then the agents that own a highlighted word select it and stay beside it.
 */
export async function buildHero(crew: Crew) {
  crew.enqueue(
    heroParts().filter((part) => onScreen(part) && !part.hasAttribute('data-built')),
    true
  );
  await crew.whenIdle();

  document.querySelectorAll<HTMLElement>('mark.sel[data-agent]').forEach((mark) => {
    crew.assign(mark.dataset.agent as AgentId, (cursor) => selectWord(cursor, mark));
  });
  await crew.whenIdle();
}
