'use client';

import { useEffect, useRef } from 'react';
import Bubbles from './Bubbles';

const RADIUS = 280; // half the spotlight size set in globals.css

/**
 * The canvas behind the page: slow-drifting colour washes, a dot grid with a
 * spotlight that brightens the dots around the pointer, and the floating bubble
 * mesh on top.
 *
 * The spotlight moves with one transform and its dots counter-move with
 * another, so nothing is repainted while the pointer moves.
 */
export default function Backdrop() {
  const spotRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    const dots = dotsRef.current;
    if (!spot || !dots) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let targetX = x;
    let targetY = y;

    const tick = () => {
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      spot.style.transform = `translate3d(${x - RADIUS}px, ${y - RADIUS}px, 0)`;
      dots.style.transform = `translate3d(${RADIUS - x}px, ${RADIUS - y}px, 0)`;
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.3;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      spot.style.opacity = '1';
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="aurora">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="backdrop__dots" />
      <div ref={spotRef} className="backdrop__spot">
        <div ref={dotsRef} className="backdrop__dots backdrop__dots--hot" />
      </div>
      <Bubbles />
    </div>
  );
}
