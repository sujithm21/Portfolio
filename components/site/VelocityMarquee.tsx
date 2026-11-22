'use client';

import { useEffect, useRef } from 'react';
import { clamp, cn } from '@/lib/utils';

/**
 * Rows of oversized words that drift sideways on their own, then speed up,
 * lean and change direction with the visitor's scroll speed.
 */
export default function VelocityMarquee({ rows }: { rows: string[][] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tracks = Array.from(root.querySelectorAll<HTMLElement>('[data-track]'));
    // Each track holds its words twice; one copy's width is the loop length.
    let loops = tracks.map((track) => track.scrollWidth / 2);
    const offsets = tracks.map(() => 0);

    let frame = 0;
    let visible = false;
    let lastTime = 0;
    let lastScroll = window.scrollY;
    let velocity = 0; // smoothed scroll speed, px per ms
    let direction = 1;

    const tick = (time: number) => {
      const elapsed = Math.min(time - lastTime, 50);
      lastTime = time;
      const scroll = window.scrollY;
      const raw = elapsed > 0 ? (scroll - lastScroll) / elapsed : 0;
      lastScroll = scroll;
      velocity += (raw - velocity) * 0.12;
      if (Math.abs(velocity) > 0.03) direction = velocity > 0 ? 1 : -1;

      const speed = 0.05 + Math.abs(velocity) * 0.6;
      const lean = clamp(velocity * -8, -10, 10).toFixed(2);
      tracks.forEach((track, i) => {
        const way = (i % 2 === 0 ? -1 : 1) * direction;
        offsets[i] = (offsets[i] + way * speed * elapsed) % loops[i];
        const x = offsets[i] > 0 ? offsets[i] - loops[i] : offsets[i];
        track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) skewX(${lean}deg)`;
      });

      frame = visible ? requestAnimationFrame(tick) : 0;
    };

    // Only animate while the band is on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) {
          lastTime = performance.now();
          lastScroll = window.scrollY;
          frame = requestAnimationFrame(tick);
        }
      },
      { rootMargin: '15% 0px' }
    );
    observer.observe(root);

    const onResize = () => {
      loops = tracks.map((track) => track.scrollWidth / 2);
    };
    window.addEventListener('resize', onResize);
    document.fonts.ready.then(onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="velocity" aria-hidden="true">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} data-track className="velocity__track">
          {[0, 1].map((copy) =>
            row.map((word, i) => (
              <span
                key={`${copy}-${word}`}
                className={cn('velocity__word', (i + rowIndex) % 3 === 0 && 'is-solid')}
              >
                {word}
              </span>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
