'use client';

import { useEffect, useRef } from 'react';

type Props = { value: number; decimals?: number; prefix?: string; suffix?: string };

const format = (value: number, decimals: number) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Counts up to `value` when its surrounding block is revealed. The final
 * number is what gets server-rendered, so it is correct without JavaScript.
 */
export default function CountUp({ value, decimals = 0, prefix = '', suffix = '' }: Props) {
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
      const duration = 1400;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = `${prefix}${format(value * eased, decimals)}${suffix}`;
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    host.addEventListener('b:built', run, { once: true });
    return () => {
      host.removeEventListener('b:built', run);
      cancelAnimationFrame(frame);
    };
  }, [value, decimals, prefix, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {format(value, decimals)}
      {suffix}
    </span>
  );
}
