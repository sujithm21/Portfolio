'use client';

import { useEffect, useRef } from 'react';

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#/<>_';
const DURATION = 700;

/**
 * Text that decodes itself, left to right, when its surrounding block is
 * revealed. The real text is what gets server-rendered.
 */
export default function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest<HTMLElement>('[data-b]');
    const mode = document.documentElement.dataset.build;
    if (!el || !host || (mode !== 'first' && mode !== 'return')) return;
    if (host.hasAttribute('data-built')) return;

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION, 1);
        const settled = Math.floor(progress * text.length);
        el.textContent = text
          .split('')
          .map((char, i) =>
            i < settled || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join('');
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    host.addEventListener('b:built', run, { once: true });
    return () => {
      host.removeEventListener('b:built', run);
      cancelAnimationFrame(frame);
      el.textContent = text;
    };
  }, [text]);

  return <span ref={ref}>{text}</span>;
}
