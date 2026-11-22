'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { agents, type Agent } from '@/lib/agents';
import {
  buildHero,
  Crew,
  fadeBlock,
  onScreen,
  reveal,
  Scope,
  settleHero,
  type BuildEvent,
} from '@/lib/build';
import { cn } from '@/lib/utils';

type Line = { id: number; agent: Agent; text: string; done: boolean };
type Panel = 'hidden' | 'building' | 'done';

declare global {
  interface Window {
    __buildReady?: boolean;
  }
}

/**
 * Decides how the page appears.
 *
 *  - On every load: a crew of agent cursors draws the hero, then keeps working
 *    down the page, drawing each block as it scrolls into view. A small log
 *    shows what each agent is doing. Skip (or Escape) ends the build and shows
 *    everything at once.
 *  - After Skip: whatever is left simply fades up as it enters the viewport.
 *  - Reduced motion: nothing is hidden and nothing animates.
 *
 * The mode is chosen by the inline script in app/layout.tsx.
 */
export default function BuildDirector() {
  const layerRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const [panel, setPanel] = useState<Panel>('hidden');
  const [lines, setLines] = useState<Line[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const mode = root.dataset.build;
    const layer = layerRef.current;
    window.__buildReady = true;
    if (!layer || (mode !== 'first' && mode !== 'return')) return;

    const scope = new Scope();
    let building = mode === 'first';
    let crew: Crew | null = null;
    let lineId = 0;
    let hideTimer = 0;
    let decorTimer = 0;

    const showPanel = (next: Panel, hideAfter: number) => {
      window.clearTimeout(hideTimer);
      setPanel(next);
      hideTimer = window.setTimeout(() => setPanel('hidden'), hideAfter);
    };

    const addLine = (agent: Agent, text: string, done: boolean) => {
      const id = lineId;
      lineId += 1;
      setLines((current) => [...current, { id, agent, text, done }].slice(-4));
    };

    // Called by the crew whenever an agent starts or finishes drawing a block.
    const report = ({ agent, name, done }: BuildEvent) => {
      if (!done) {
        addLine(agent, name, false);
        showPanel('building', 3200);
        return;
      }
      setLines((current) =>
        current.map((line) => (line.text === name ? { ...line, done: true } : line))
      );
      // Cards hidden by the project filter are not part of the build.
      const total = document.querySelectorAll('[data-b]:not([hidden])').length;
      const built = document.querySelectorAll('[data-b][data-built]:not([hidden])').length;
      setProgress(Math.round((built / total) * 100));
      if (built >= total) showPanel('done', 2800);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const els = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement);
        els.forEach((el) => observer.unobserve(el));

        if (building && crew) {
          crew.enqueue(els.filter((el) => !el.hasAttribute('data-built')));
          return;
        }

        els.forEach((el, order) => {
          if (!reveal(el)) return;
          // Siblings stagger by their --i index. Hero elements use it for the
          // top-of-page cascade only; further down they follow arrival order.
          const cascade = !el.hasAttribute('data-b-hero') || window.scrollY < 40;
          const index = cascade ? Number(el.style.getPropertyValue('--i')) || order : order;
          fadeBlock(el, Math.min(index, 8) * 70);
        });
      },
      { rootMargin: '0px 0px -6% 0px' }
    );

    const observe = (selector: string) =>
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => observer.observe(el));

    // End the build: show what is on screen now, fade the rest in on scroll.
    const skip = () => {
      if (!building) return;
      building = false;
      scope.abort();
      window.removeEventListener('keydown', onKey);
      settleHero();
      root.setAttribute('data-build', 'return');
      root.setAttribute('data-hero-done', '');
      document.querySelectorAll<HTMLElement>('[data-b]').forEach((el) => {
        if (onScreen(el) && reveal(el)) fadeBlock(el, 0);
      });
      observe('[data-b]:not([data-built])');
      window.clearTimeout(hideTimer);
      setPanel('hidden');
    };

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') skip();
    }

    if (mode === 'return') {
      observe('[data-b]:not([data-built])');
      // Highlight the key words once the headline has faded in.
      decorTimer = window.setTimeout(settleHero, 700);
    } else {
      const team = new Crew(scope, layer, report);
      crew = team;
      skipRef.current = skip;
      window.addEventListener('keydown', onKey);
      // Sections are drawn as they scroll in, even while the hero is in progress.
      observe('[data-b]:not([data-built]):not([data-b-hero])');

      scope.spawn(async () => {
        // Wait for fonts so every frame is measured against final layout.
        await document.fonts.ready;
        if (window.scrollY < 80) {
          const startedAt = performance.now();
          showPanel('building', 8000);
          await buildHero(team);
          const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);
          addLine(agents[agents.length - 1], `hero shipped in ${seconds}s`, true);
          showPanel('building', 3200);
        }
        settleHero();
        root.setAttribute('data-hero-done', '');
        // Hero elements that were below the fold join the scroll queue.
        observe('[data-b-hero]:not([data-built])');
      });
    }

    return () => {
      building = false;
      observer.disconnect();
      scope.abort();
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(hideTimer);
      window.clearTimeout(decorTimer);
    };
  }, []);

  return (
    <>
      <div ref={layerRef} className="build-layer" aria-hidden="true" />

      {panel !== 'hidden' && (
        <div
          role="status"
          className="fixed inset-x-3 bottom-3 z-[70] animate-[rise-in_0.4s_var(--ease-out-quint)_both] overflow-hidden rounded-2xl border border-line-strong bg-surface font-mono text-xs shadow-[0_18px_50px_-16px_rgb(0_0_0/0.55)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[22rem]"
        >
          <div className="flex h-10 items-center gap-2.5 border-b border-line pr-1.5 pl-3.5">
            {panel === 'done' ? (
              <span className="grid size-4 place-items-center rounded-full bg-green text-canvas">
                <Check className="size-3" strokeWidth={3} />
              </span>
            ) : (
              <span className="pulse" />
            )}
            <span className="text-ink">
              {panel === 'done' ? `Built by ${agents.length} agents` : 'agents.log'}
            </span>
            <span className="ml-auto text-ink-faint tabular-nums">{progress}%</span>
            {panel === 'building' && (
              <button
                type="button"
                onClick={() => skipRef.current()}
                className="h-7 rounded-full bg-ink px-3 font-sans text-xs font-medium text-canvas transition-transform active:scale-95"
              >
                Skip
              </button>
            )}
          </div>

          <ol className="space-y-1.5 px-3.5 py-3">
            {lines.map((line, index) => (
              <li
                key={line.id}
                data-agent={line.agent.id}
                className={cn(
                  'flex animate-[rise-in_0.3s_var(--ease-out-quint)_both] items-center gap-2',
                  index < lines.length - 1 && 'max-sm:hidden'
                )}
              >
                <span className="w-3 shrink-0 text-agent">{line.done ? '✓' : '›'}</span>
                <span className="w-[4.25rem] shrink-0 text-agent">
                  {line.agent.name.toLowerCase()}
                </span>
                <span className="truncate text-ink-soft">{line.text}</span>
              </li>
            ))}
          </ol>

          <div className="h-0.5 bg-line">
            <div
              className="h-full origin-left bg-select transition-transform duration-500 ease-out-quint"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        </div>
      )}
    </>
  );
}
