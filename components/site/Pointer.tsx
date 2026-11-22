'use client';

import { useEffect, useRef } from 'react';
import { clamp } from '@/lib/utils';

/** What the pointer tag says for the element under it. */
function labelFor(target: Element | null) {
  const hinted = target?.closest<HTMLElement>('[data-cursor]');
  if (hinted?.dataset.cursor) return hinted.dataset.cursor;
  const link = target?.closest('a[href]');
  if (link?.hasAttribute('download')) return 'Download';
  if (link?.getAttribute('target') === '_blank') return 'Open ↗';
  return 'You';
}

/**
 * Everything that follows the visitor's pointer, driven by one listener:
 *
 *  - a "You" tag, so the visitor appears on the canvas next to the agents; it
 *    renames itself for what is under the pointer (Open, Download, Inspect…)
 *  - [data-tilt] cards lean towards the pointer and catch a soft glare
 *  - [data-magnetic] buttons are pulled a little towards it
 *
 * Mouse-only: none of this runs on touch screens.
 */
export default function Pointer() {
  const tagRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tag = tagRef.current;
    if (!tag) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frame = 0;
    let idleTimer = 0;
    let shown = false;
    let label = 'You';
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    let tilted: HTMLElement | null = null;
    let tiltRect: DOMRect | null = null;
    let pulled: HTMLElement | null = null;
    let pullRect: DOMRect | null = null;

    const tick = () => {
      x += (targetX - x) * 0.3;
      y += (targetY - y) * 0.3;
      tag.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.2;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const hideTag = () => {
      shown = false;
      delete tag.dataset.on;
    };

    const untilt = () => {
      if (!tilted) return;
      tilted.style.transform = '';
      tilted.removeAttribute('data-tilting');
      tilted = null;
      tiltRect = null;
    };

    const release = () => {
      if (!pulled) return;
      pulled.style.translate = '';
      pulled = null;
      pullRect = null;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const target = event.target instanceof Element ? event.target : null;

      // The tag.
      targetX = event.clientX;
      targetY = event.clientY;
      if (!shown) {
        shown = true;
        x = targetX;
        y = targetY;
        tag.dataset.on = '';
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(hideTag, 2600);
      const nextLabel = labelFor(target);
      if (nextLabel !== label) {
        label = nextLabel;
        tag.textContent = nextLabel;
      }
      if (!frame) frame = requestAnimationFrame(tick);
      if (reduceMotion) return;

      // Card tilt.
      const card = target?.closest<HTMLElement>('[data-tilt]') ?? null;
      if (card !== tilted) {
        untilt();
        tilted = card;
        tiltRect = card?.getBoundingClientRect() ?? null;
        card?.setAttribute('data-tilting', '');
      }
      if (tilted && tiltRect) {
        const px = clamp((event.clientX - tiltRect.left) / tiltRect.width, 0, 1);
        const py = clamp((event.clientY - tiltRect.top) / tiltRect.height, 0, 1);
        // Large cards lean less, so their text stays easy to read.
        const max = clamp(2600 / Math.max(tiltRect.width, tiltRect.height), 1.5, 7);
        const rotateX = ((0.5 - py) * max).toFixed(2);
        const rotateY = ((px - 0.5) * max).toFixed(2);
        tilted.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        tilted.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        tilted.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      }

      // Magnetic buttons.
      const magnet = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (magnet !== pulled) {
        release();
        pulled = magnet;
        pullRect = magnet?.getBoundingClientRect() ?? null;
      }
      if (pulled && pullRect) {
        const dx = event.clientX - (pullRect.left + pullRect.width / 2);
        const dy = event.clientY - (pullRect.top + pullRect.height / 2);
        pulled.style.translate = `${(dx * 0.3).toFixed(1)}px ${(dy * 0.3).toFixed(1)}px`;
      }
    };

    // Measurements go stale when the page scrolls, so let go and re-measure.
    const onScroll = () => {
      untilt();
      release();
    };
    const onLeave = () => {
      untilt();
      release();
      hideTag();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      untilt();
      release();
    };
  }, []);

  return (
    <span ref={tagRef} className="you-tag" aria-hidden="true">
      You
    </span>
  );
}
