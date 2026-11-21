'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type AssemblyTarget = {
  reveal: string;
  select: string;
};

type CursorAgent = {
  id: number;
  targetIndex: number;
  tone: 'cyan' | 'violet' | 'emerald' | 'orange' | 'pink' | 'blue';
  name?: string;
};

type AgentMotion = {
  at: number;
  duration: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

type CursorPaint = {
  x: number;
  y: number;
  tone: CursorAgent['tone'];
  opacity: number;
  name?: string;
  clicking?: boolean;
};

type ScrollMotion = {
  startX: number;
  startY: number;
  controlX: number;
  controlY: number;
  endX: number;
  endY: number;
  delay: number;
  duration: number;
  componentIndex: number;
  offsetX: number;
  offsetY: number;
};

const targetKeys: AssemblyTarget[] = [
  { reveal: 'navigation', select: 'navigation' },
  { reveal: 'brand', select: 'brand' },
  { reveal: 'resume', select: 'resume' },
  { reveal: 'hero-background', select: 'hero-background' },
  { reveal: 'availability', select: 'availability' },
  { reveal: 'hero-title', select: 'hero-title' },
  { reveal: 'hero-role', select: 'hero-role' },
  { reveal: 'hero-copy', select: 'hero-copy' },
  { reveal: 'hero-stack', select: 'hero-stack' },
  { reveal: 'hero-actions', select: 'hero-actions' },
  { reveal: 'hero-metrics', select: 'hero-metrics' },
];

const tones: CursorAgent['tone'][] = ['cyan', 'violet', 'emerald', 'orange', 'pink', 'blue'];
const teamNames = ['Alex', 'Maya', 'Noah', 'Ivy', 'Kai', 'Sam', 'Jules', 'Ari'];
const cursorAgents: CursorAgent[] = Array.from({ length: 48 }, (_, id) => {
  const team = id % teamNames.length;
  return {
    id,
    targetIndex: id % targetKeys.length,
    tone: tones[team % tones.length],
    name: id < teamNames.length ? teamNames[team] : undefined,
  };
});

const firstTargetAt = 180;
const finishAt = 3200;
const scrollSectionAgents = 32;
const scrollSelectionFrames = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDistantRandomPoint(destinationX: number, destinationY: number) {
  const minDistance = Math.min(320, Math.hypot(window.innerWidth, window.innerHeight) * 0.42);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const x = Math.random() * (window.innerWidth + 160) - 80;
    const y = Math.random() * (window.innerHeight + 160) - 80;
    if (Math.hypot(x - destinationX, y - destinationY) >= minDistance) return { x, y };
  }

  const corners = [
    { x: -24, y: -24 },
    { x: window.innerWidth + 24, y: -24 },
    { x: -24, y: window.innerHeight + 24 },
    { x: window.innerWidth + 24, y: window.innerHeight + 24 },
  ];
  return corners.reduce((farthest, point) =>
    Math.hypot(point.x - destinationX, point.y - destinationY) >
    Math.hypot(farthest.x - destinationX, farthest.y - destinationY)
      ? point
      : farthest
  );
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeInOutSmoother(value: number) {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

function quadraticPoint(start: number, control: number, end: number, progress: number) {
  const inverse = 1 - progress;
  return inverse * inverse * start + 2 * inverse * progress * control + progress * progress * end;
}

function getTarget(name: string) {
  return document.querySelector<HTMLElement>(`[data-assembly="${name}"]`);
}

function getVisibleAssemblyComponents(section: HTMLElement) {
  return Array.from(
    section.querySelectorAll<HTMLElement>('[data-assembly-block], article, [data-assembly="footer"]')
  )
    .filter((component) => {
      const rect = component.getBoundingClientRect();
      const hasCandidateAncestor = component.parentElement?.closest(
        '[data-assembly-block], article, [data-assembly="footer"]'
      );
      return !hasCandidateAncestor && rect.bottom > 0 && rect.top < window.innerHeight;
    })
    .slice(0, scrollSelectionFrames);
}

function getCursorColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    cyan: `hsl(${styles.getPropertyValue('--cyan').trim()})`,
    violet: `hsl(${styles.getPropertyValue('--violet').trim()})`,
    emerald: `hsl(${styles.getPropertyValue('--emerald').trim()})`,
    orange: '#ffad73',
    pink: '#fa7eb7',
    blue: '#72a8ff',
  };
}

function resizeCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  const ratio = 1;
  canvas.width = Math.round(window.innerWidth * ratio);
  canvas.height = Math.round(window.innerHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function setAssemblyActivity(active: boolean) {
  document.dispatchEvent(new CustomEvent('portfolio:assembly', { detail: active }));
}

function createCursorPainter(colors: Record<CursorAgent['tone'], string>) {
  const opacityLevels = 5;
  const cursorPaths = Array.from({ length: tones.length * opacityLevels }, () => [] as CursorPaint[]);
  const clickPaths = Array.from({ length: tones.length * opacityLevels }, () => [] as CursorPaint[]);
  const toneIndexes = new Map(tones.map((tone, index) => [tone, index]));

  return (context: CanvasRenderingContext2D, paints: CursorPaint[]) => {
    cursorPaths.forEach((group) => {
      group.length = 0;
    });
    clickPaths.forEach((group) => {
      group.length = 0;
    });

    for (const cursor of paints) {
      if (cursor.opacity <= 0.01) continue;
      const opacityLevel = clamp(
        Math.round(cursor.opacity * (opacityLevels - 1)),
        1,
        opacityLevels - 1
      );
      const groupIndex = (toneIndexes.get(cursor.tone) ?? 0) * opacityLevels + opacityLevel;
      cursorPaths[groupIndex].push(cursor);
      if (cursor.clicking) clickPaths[groupIndex].push(cursor);
    }

    for (let groupIndex = 0; groupIndex < cursorPaths.length; groupIndex += 1) {
      const group = cursorPaths[groupIndex];
      if (group.length === 0) continue;
      const color = colors[group[0].tone];
      context.globalAlpha = (groupIndex % opacityLevels) / (opacityLevels - 1);
      context.fillStyle = color;
      context.strokeStyle = 'rgba(4, 9, 20, 0.9)';
      context.lineWidth = 1.15;
      context.beginPath();

      for (const cursor of group) {
        const size = cursor.name ? 13 : 7;
        context.moveTo(cursor.x, cursor.y);
        context.lineTo(cursor.x, cursor.y + size);
        context.lineTo(cursor.x + size * 0.31, cursor.y + size * 0.76);
        context.lineTo(cursor.x + size * 0.55, cursor.y + size * 1.1);
        context.lineTo(cursor.x + size * 0.77, cursor.y + size);
        context.lineTo(cursor.x + size * 0.53, cursor.y + size * 0.69);
        context.lineTo(cursor.x + size * 0.98, cursor.y + size * 0.67);
        context.closePath();
      }

      context.fill();
      context.stroke();
    }

    for (let groupIndex = 0; groupIndex < clickPaths.length; groupIndex += 1) {
      const group = clickPaths[groupIndex];
      if (group.length === 0) continue;
      context.globalAlpha = ((groupIndex % opacityLevels) / (opacityLevels - 1)) * 0.55;
      context.strokeStyle = colors[group[0].tone];
      context.lineWidth = 1;
      context.beginPath();

      for (const cursor of group) {
        const size = cursor.name ? 13 : 7;
        context.moveTo(cursor.x + size * 1.15, cursor.y + size * 0.35);
        context.arc(cursor.x + size * 0.35, cursor.y + size * 0.35, size * 0.8, 0, Math.PI * 2);
      }

      context.stroke();
    }

    context.font = '600 9px ui-monospace, SFMono-Regular, monospace';
    for (const cursor of paints) {
      if (!cursor.name || cursor.opacity <= 0.01) continue;
      const color = colors[cursor.tone];
      context.globalAlpha = cursor.opacity;

      const labelWidth = context.measureText(cursor.name).width + 10;
      context.fillStyle = color;
      context.beginPath();
      context.roundRect(cursor.x + 11, cursor.y + 13, labelWidth, 16, 3);
      context.fill();
      context.fillStyle = '#071019';
      context.fillText(cursor.name, cursor.x + 16, cursor.y + 24);
    }

    context.globalAlpha = 1;
  };
}

function paintSelectionFrames(
  context: CanvasRenderingContext2D,
  motions: ScrollMotion[],
  rects: DOMRect[],
  elapsed: number,
  color: string
) {
  for (let index = 0; index < motions.length; index += 1) {
    const motion = motions[index];
    const rect = rects[index];
    const progress = clamp((elapsed - motion.delay) / motion.duration, 0, 1);
    if (progress <= 0) continue;

    const eased = easeInOutSmoother(progress);
    const startSize = 34;
    const width = Math.max(startSize, rect.width + 10);
    const height = Math.max(startSize, rect.height + 10);
    const destinationX = clamp(rect.left - 5, -width + 20, window.innerWidth - 20);
    const destinationY = clamp(rect.top - 5, -height + 20, window.innerHeight - 20);
    const scaleX = startSize / width + (1 - startSize / width) * eased;
    const scaleY = startSize / height + (1 - startSize / height) * eased;
    const fadeIn = clamp(progress / 0.14, 0, 1);
    const settledAt = motion.delay + motion.duration + 320;
    const fadeOut = elapsed > settledAt ? clamp(1 - (elapsed - settledAt) / 480, 0, 1) : 1;
    const alpha = 0.82 * fadeIn * fadeOut;
    const x = quadraticPoint(motion.startX, motion.controlX, destinationX, eased);
    const y = quadraticPoint(motion.startY, motion.controlY, destinationY, eased);

    context.globalAlpha = alpha;
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.setLineDash([4, 4]);
    context.strokeRect(x, y, width * scaleX, height * scaleY);
    context.setLineDash([]);

    if (progress > 0.84 && progress < 1) {
      context.globalAlpha = alpha * 0.8;
      context.font = '9px ui-monospace, SFMono-Regular, monospace';
      context.fillStyle = color;
      context.fillText(`${Math.round(rect.width)} × ${Math.round(rect.height)}`, x + 5, y - 4);
    }
  }
  context.globalAlpha = 1;
}

export default function WebsiteAssembly({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const selectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const guideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopAnimationRef = useRef<() => void>(() => {});
  const [active, setActive] = useState(true);
  const [complete, setComplete] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const simplified = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 640;
    if (reducedMotion || simplified) {
      setAssemblyActivity(false);
      setActive(false);
      setScrollEnabled(!reducedMotion && !simplified);
      return;
    }

    let frame = 0;
    let previousFrame = 0;
    let elapsed = 0;
    let finished = false;
    let paused: boolean = document.hidden;
    const cleanupTimers: ReturnType<typeof setTimeout>[] = [];
    const revealed = new Set<string>();
    const selectionTimers = new Map<number, ReturnType<typeof setTimeout>>();
    const canvas = cursorCanvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      setAssemblyActivity(false);
      setActive(false);
      setScrollEnabled(true);
      return;
    }
    const colors = getCursorColors();
    const paint = createCursorPainter(colors);
    resizeCanvas(canvas, context);
    setAssemblyActivity(true);
    const paints: CursorPaint[] = cursorAgents.map((agent) => ({
      x: 0,
      y: 0,
      tone: agent.tone,
      opacity: 0,
      name: agent.name,
    }));
    const targets = targetKeys.map((target, index) => ({
      reveal: getTarget(target.reveal),
      select: getTarget(target.select),
      selection: selectionRefs.current[index],
      guides: guideRefs.current[index],
    }));
    let targetRects = targets.map((target) => target.select?.getBoundingClientRect());

    const motions: AgentMotion[] = cursorAgents.map((agent) => {
      const rect = targetRects[agent.targetIndex];
      const destinationX = rect
        ? clamp(rect.left + rect.width * (0.5 + (Math.random() - 0.5) * 0.68), 12, window.innerWidth - 22)
        : window.innerWidth / 2;
      const destinationY = rect
        ? clamp(rect.top + rect.height * (0.5 + (Math.random() - 0.5) * 0.58), 20, window.innerHeight - 28)
        : window.innerHeight / 2;
      const start = getDistantRandomPoint(destinationX, destinationY);
      return {
        at: firstTargetAt + Math.random() * 760,
        duration: 760 + Math.random() * 420,
        startX: start.x,
        startY: start.y,
        offsetX: (destinationX - (rect?.left ?? 0)) / (rect?.width || 1) - 0.5,
        offsetY: (destinationY - (rect?.top ?? 0)) / (rect?.height || 1) - 0.5,
      };
    });

    const hideSelection = (index: number) => {
      const target = targets[index];
      target.select?.classList.remove('assembly-target-active');
      target.select?.style.removeProperty('--assembly-selection');
      if (target.selection) target.selection.style.opacity = '0';
      if (target.guides) target.guides.style.opacity = '0';
      selectionTimers.delete(index);
    };

    const showTarget = (index: number) => {
      if (revealed.has(targetKeys[index].reveal)) return;
      const target = targets[index];
      if (!target.reveal || !target.select) return;
      revealed.add(targetKeys[index].reveal);
      target.reveal.style.visibility = 'visible';
      target.reveal.animate(
        [
          { opacity: 0.72, transform: 'translateY(7px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );

      const rect = targetRects[index] ?? target.select.getBoundingClientRect();
      target.select.style.setProperty('--assembly-selection', `var(--${cursorAgents[index].tone})`);
      target.select.classList.add('assembly-target-active');
      if (target.selection) {
        target.selection.style.left = `${rect.left}px`;
        target.selection.style.top = `${rect.top}px`;
        target.selection.style.width = `${rect.width}px`;
        target.selection.style.height = `${rect.height}px`;
        target.selection.style.setProperty('--selection-width', `${Math.round(rect.width)}px`);
        target.selection.style.setProperty('--selection-height', `${Math.round(rect.height)}px`);
        target.selection.style.opacity = '0.88';
      }
      if (target.guides) {
        target.guides.style.setProperty('--guide-x', `${rect.left + rect.width / 2}px`);
        target.guides.style.setProperty('--guide-y', `${rect.top + rect.height / 2}px`);
        target.guides.style.opacity = '0.45';
      }

      const timer = setTimeout(() => hideSelection(index), 760);
      selectionTimers.set(index, timer);
      cleanupTimers.push(timer);
    };

    const stopAnimation = () => {
      finished = true;
      cancelAnimationFrame(frame);
      context.clearRect(0, 0, canvas.width, canvas.height);
      setAssemblyActivity(false);
      cleanupTimers.forEach(clearTimeout);
      targets.forEach((target) => {
        target.select?.classList.remove('assembly-target-active');
        target.select?.style.removeProperty('--assembly-selection');
        if (target.selection) target.selection.style.opacity = '0';
        if (target.guides) target.guides.style.opacity = '0';
      });
    };
    stopAnimationRef.current = stopAnimation;

    const animate = (time: number) => {
      if (paused || finished) return;
      if (previousFrame) elapsed += time - previousFrame;
      previousFrame = time;
      cursorAgents.forEach((agent, index) => {
        const motion = motions[index];
        const paint = paints[index];
        paint.opacity = 0;
        if (elapsed < motion.at || elapsed > motion.at + motion.duration) return;

        const target = targets[agent.targetIndex];
        if (!target.select || !target.reveal) return;

        const rect = targetRects[agent.targetIndex];
        if (!rect) return;
        const pointX = rect.left + rect.width * (0.5 + motion.offsetX);
        const pointY = rect.top + rect.height * (0.5 + motion.offsetY);
        const destinationX =
          rect.right < 0
            ? -24
            : rect.left > window.innerWidth
              ? window.innerWidth + 24
              : clamp(pointX, 12, window.innerWidth - 22);
        const destinationY =
          rect.bottom < 0
            ? -24
            : rect.top > window.innerHeight
              ? window.innerHeight + 24
              : clamp(pointY, 20, window.innerHeight - 28);
        const progress = clamp((elapsed - motion.at) / motion.duration, 0, 1);
        const eased = easeInOutCubic(progress);
        const x = motion.startX + (destinationX - motion.startX) * eased;
        const y = motion.startY + (destinationY - motion.startY) * eased;
        const opacity =
          clamp(progress * 5, 0, 1) * (progress > 0.78 ? (1 - progress) / 0.22 : 1);
        paint.x = x;
        paint.y = y;
        paint.opacity = opacity;
        paint.clicking = progress >= 0.82 && progress < 0.94;

        if (progress >= 0.62) showTarget(agent.targetIndex);
      });
      context.clearRect(0, 0, canvas.width, canvas.height);
      paint(context, paints);

      if (elapsed < finishAt) {
        frame = requestAnimationFrame(animate);
      } else {
        finished = true;
        targets.forEach((target) => {
          if (target.reveal) target.reveal.style.visibility = 'visible';
        });
        overlayRef.current?.classList.add('is-finishing');
        const timer = setTimeout(() => {
          setActive(false);
          setScrollEnabled(true);
          setComplete(true);
          setAssemblyActivity(false);
          completionTimerRef.current = setTimeout(() => setComplete(false), 1250);
        }, 450);
        cleanupTimers.push(timer);
      }
    };

    const onVisibilityChange = () => {
      paused = document.hidden;
      previousFrame = 0;
      if (paused) {
        cancelAnimationFrame(frame);
      } else if (!finished) {
        frame = requestAnimationFrame(animate);
      }
    };
    const onResize = () => {
      resizeCanvas(canvas, context);
      targetRects = targets.map((target) => target.select?.getBoundingClientRect());
    };

    frame = requestAnimationFrame(animate);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('resize', onResize);

    return () => {
      stopAnimation();
      cleanupTimers.forEach(clearTimeout);
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
      stopAnimationRef.current = () => {};
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const skip = () => {
    stopAnimationRef.current();
    overlayRef.current?.classList.add('is-finishing');
    skipTimerRef.current = setTimeout(() => {
      setActive(false);
      setScrollEnabled(true);
    }, 180);
  };

  return (
    <div className="portfolio-stage" data-assembly-state={active ? 'building' : 'ready'}>
      <div className="portfolio-content">{children}</div>
      {active && (
        <div ref={overlayRef} className="assembly-overlay" aria-hidden="true">
          <div className="assembly-status">
            <span className="assembly-status-dot" />
            <span>Assembling your experience</span>
            <span className="assembly-status-divider">/</span>
            <span className="assembly-status-meta">48 cursors at work</span>
          </div>

          <canvas ref={cursorCanvasRef} className="assembly-cursor-canvas" />

          {targetKeys.map((target, index) => (
            <div
              key={`${target.reveal}-selection`}
              ref={(element) => {
                selectionRefs.current[index] = element;
              }}
              className="assembly-selection"
              data-tone={cursorAgents[index].tone}
            />
          ))}

          {targetKeys.map((target, index) => (
            <div
              key={`${target.reveal}-guides`}
              ref={(element) => {
                guideRefs.current[index] = element;
              }}
              className="assembly-guides"
              data-tone={cursorAgents[index].tone}
            />
          ))}
        </div>
      )}
      {active && (
        <div className="assembly-controls">
          <span className="assembly-progress" aria-live="polite">
            Collaborative build · live
          </span>
          <button type="button" className="assembly-skip" onClick={skip}>
            Skip animation <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}
      {complete && (
        <div className="assembly-complete" role="status">
          <span className="assembly-status-dot" />
          Experience assembled
        </div>
      )}
      <ScrollAssembly enabled={scrollEnabled} />
    </div>
  );
}

function ScrollAssembly({ enabled }: { enabled: boolean }) {
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const guidesRef = useRef<HTMLDivElement | null>(null);
  const pendingRef = useRef<HTMLElement[]>([]);
  const runningRef = useRef(false);
  const launchNextRef = useRef<() => boolean>(() => false);
  const [section, setSection] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const seen = new WeakSet<HTMLElement>();
    const queued = new WeakSet<HTMLElement>();
    let disposed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          if (seen.has(target) || queued.has(target)) return;
          queued.add(target);
          pendingRef.current.push(target);
        });
        launchNextRef.current();
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    const startNext = () => {
      if (runningRef.current || disposed) return false;
      let next: HTMLElement | undefined;
      const deferred: HTMLElement[] = [];

      while (pendingRef.current.length > 0) {
        const candidate = pendingRef.current.shift()!;
        queued.delete(candidate);
        const rect = candidate.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

        if (!isVisible || seen.has(candidate)) continue;
        if (getVisibleAssemblyComponents(candidate).length === 0) {
          deferred.push(candidate);
          queued.add(candidate);
          continue;
        }

        next = candidate;
        break;
      }
      pendingRef.current.unshift(...deferred);

      if (!next) {
        setAssemblyActivity(false);
        return false;
      }
      seen.add(next);
      runningRef.current = true;
      setAssemblyActivity(true);
      next.setAttribute('data-assembly-building', 'true');
      setSection(next);
      return true;
    };
    launchNextRef.current = startNext;
    const retryVisibleSections = () => launchNextRef.current();

    document
      .querySelectorAll<HTMLElement>('[data-assembly-section]')
      .forEach((target) => observer.observe(target));
    window.addEventListener('scroll', retryVisibleSections, { passive: true });
    window.addEventListener('resize', retryVisibleSections);

    return () => {
      disposed = true;
      launchNextRef.current = () => false;
      pendingRef.current = [];
      runningRef.current = false;
      observer.disconnect();
      window.removeEventListener('scroll', retryVisibleSections);
      window.removeEventListener('resize', retryVisibleSections);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !section) return;

    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let finishTimer: ReturnType<typeof setTimeout>;
    const revealAnimations: Animation[] = [];
    const revealedComponents = new Set<number>();
    const guidesElement = guidesRef.current;
    const canvas = cursorCanvasRef.current;
    const context = canvas?.getContext('2d');
    const header = section.querySelector<HTMLElement>('[data-assembly]');
    if (!header || !canvas || !context) {
      setSection(null);
      return;
    }
    const colors = getCursorColors();
    const paint = createCursorPainter(colors);
    resizeCanvas(canvas, context);
    const paints: CursorPaint[] = cursorAgents.map((agent) => ({
      x: 0,
      y: 0,
      tone: agent.tone,
      opacity: 0,
      name: agent.name,
    }));

    const toneIndex = Array.from(document.querySelectorAll('[data-assembly-section]')).indexOf(section);
    const accentTone = tones[toneIndex % tones.length];
    const components = getVisibleAssemblyComponents(section);
    if (components.length === 0) {
      setSection(null);
      return;
    }
    let componentRects = components.map((component) => component.getBoundingClientRect());
    const makeMotion = (rect: DOMRect, componentIndex: number): ScrollMotion => {
      const offsetX = (Math.random() - 0.5) * 0.7;
      const offsetY = (Math.random() - 0.5) * 0.65;
      const endX = clamp(rect.left + rect.width * (0.5 + offsetX), 10, window.innerWidth - 20);
      const endY = clamp(rect.top + rect.height * (0.5 + offsetY), 20, window.innerHeight - 28);
      const start = getDistantRandomPoint(endX, endY);
      const dx = endX - start.x;
      const dy = endY - start.y;
      const distance = Math.hypot(dx, dy) || 1;
      const curve = (Math.random() - 0.5) * Math.min(distance * 0.3, 210);
      return {
        startX: start.x,
        startY: start.y,
        controlX: (start.x + endX) / 2 - (dy / distance) * curve,
        controlY: (start.y + endY) / 2 + (dx / distance) * curve,
        endX,
        endY,
        delay: Math.random() * 700,
        duration: 1700 + Math.random() * 500,
        componentIndex,
        offsetX,
        offsetY,
      };
    };
    const frameMotions = componentRects.map((rect, index) => makeMotion(rect, index));
    const motions = cursorAgents.slice(0, scrollSectionAgents).map((_, index) => {
      const componentIndex =
        index < components.length ? index : Math.floor(Math.random() * components.length);
      return index < components.length
        ? frameMotions[componentIndex]
        : makeMotion(componentRects[componentIndex], componentIndex);
    });
    const finishAt = Math.max(
      ...frameMotions.map((motion) => motion.delay + motion.duration + 800),
      ...motions.map((motion) => motion.delay + motion.duration)
    );
    const revealComponent = (index: number) => {
      if (revealedComponents.has(index)) return;
      revealedComponents.add(index);
      const component = components[index];
      component.setAttribute('data-assembly-built-block', 'true');
      component.style.visibility = 'visible';
      const animation = component.animate(
        [
          { opacity: 0.35, transform: 'translateY(9px) scale(0.985)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        { duration: 340, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
      revealAnimations.push(animation);
    };
    components.forEach((component) => {
      component.style.visibility = 'hidden';
      component.style.setProperty('--assembly-selection', `var(--${accentTone})`);
    });
    const refreshTargets = () => {
      const nextRects = components.map((component) => component.getBoundingClientRect());
      const updatedMotions = new Set([...frameMotions, ...motions]);

      updatedMotions.forEach((motion) => {
        const rect = nextRects[motion.componentIndex];
        const endX = clamp(
          rect.left + rect.width * (0.5 + motion.offsetX),
          10,
          window.innerWidth - 20
        );
        const endY = clamp(
          rect.top + rect.height * (0.5 + motion.offsetY),
          20,
          window.innerHeight - 28
        );
        const deltaX = endX - motion.endX;
        const deltaY = endY - motion.endY;
        motion.startX += deltaX;
        motion.controlX += deltaX;
        motion.endX = endX;
        motion.startY += deltaY;
        motion.controlY += deltaY;
        motion.endY = endY;
      });

      componentRects = nextRects;
    };
    const onViewportChange = () => {
      resizeCanvas(canvas, context);
      refreshTargets();
    };
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', refreshTargets, { passive: true });

    const draw = (time: number) => {
      if (lastTime) elapsed += time - lastTime;
      lastTime = time;

      for (let index = 0; index < scrollSectionAgents; index += 1) {
        const motion = motions[index];
        const paint = paints[index];
        paint.opacity = 0;
        const progress = clamp((elapsed - motion.delay) / motion.duration, 0, 1);
        if (progress === 0) continue;
        const eased = easeInOutSmoother(progress);
        const fadeIn = clamp(progress / 0.12, 0, 1);
        const fadeOut = progress > 0.94 ? clamp((1 - progress) / 0.06, 0, 1) : 1;
        const x = quadraticPoint(motion.startX, motion.controlX, motion.endX, eased);
        const y = quadraticPoint(motion.startY, motion.controlY, motion.endY, eased);

        paint.x = x;
        paint.y = y;
        paint.opacity = fadeIn * fadeOut * (motion === frameMotions[index] ? 0.95 : 0.78);
        paint.clicking = progress > 0.92 && progress < 1 && index % 6 === 0;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      paintSelectionFrames(
        context,
        frameMotions,
        componentRects,
        elapsed,
        colors[tones[toneIndex % tones.length]]
      );
      paint(context, paints);
      frameMotions.forEach((motion, index) => {
        const progress = clamp((elapsed - motion.delay) / motion.duration, 0, 1);
        if (progress >= 0.92) revealComponent(index);
      });

      if (elapsed < finishAt) {
        frame = requestAnimationFrame(draw);
      } else {
        finishTimer = setTimeout(() => {
          section.setAttribute('data-assembly-built', 'true');
          section.removeAttribute('data-assembly-building');
          section.style.removeProperty('--assembly-selection');
          components.forEach((component) => {
            component.style.removeProperty('--assembly-selection');
            component.style.removeProperty('visibility');
            component.removeAttribute('data-assembly-built-block');
          });
          runningRef.current = false;
          setSection(null);
          if (!launchNextRef.current()) setAssemblyActivity(false);
        }, 480);
      }
    };

    section.style.setProperty('--assembly-selection', `var(--${accentTone})`);
    if (guidesElement) {
      guidesElement.style.opacity = '0';
    }
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(finishTimer);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', refreshTargets);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      setAssemblyActivity(false);
      revealAnimations.forEach((animation) => animation.cancel());
      section.removeAttribute('data-assembly-building');
      section.style.removeProperty('--assembly-selection');
      components.forEach((component) => {
        component.style.removeProperty('--assembly-selection');
        component.style.removeProperty('visibility');
        component.removeAttribute('data-assembly-built-block');
      });
      if (guidesElement) guidesElement.style.opacity = '0';
    };
  }, [enabled, section]);

  if (!enabled) return null;

  return (
    <>
      {section && (
        <div className="assembly-overlay assembly-scroll-overlay" aria-hidden="true">
          <div className="assembly-status">
            <span className="assembly-status-dot" />
            <span>Assembling {section.getAttribute('data-assembly-section')}</span>
            <span className="assembly-status-divider">/</span>
            <span className="assembly-status-meta">32 cursors, first visit</span>
          </div>
          <canvas ref={cursorCanvasRef} className="assembly-cursor-canvas" />
          <div
            ref={guidesRef}
            className="assembly-guides"
            data-tone={tones[0]}
          />
        </div>
      )}
    </>
  );
}
