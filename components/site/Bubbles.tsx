'use client';

import { useEffect, useRef } from 'react';

type Bubble = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  /** How strongly the bubble shifts with page scroll (parallax depth). */
  depth: number;
  colour: number;
  phase: number;
};

const COLOUR_VARS = ['--violet', '--pink', '--blue', '--amber', '--green'];
const PUSH_RADIUS = 190;
const LINK_DISTANCE = 150;

/** "#a78bfa" -> "167, 139, 250" */
function toRgb(hex: string) {
  const value = hex.trim().replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function readPalette() {
  const style = getComputedStyle(document.documentElement);
  return {
    colours: COLOUR_VARS.map((name) => toRgb(style.getPropertyValue(name))),
    ink: toRgb(style.getPropertyValue('--ink')),
    select: toRgb(style.getPropertyValue('--select')),
  };
}

/**
 * The floating mesh behind the page: drifting bubbles in the agent colours,
 * linked when they are close, with small packets travelling the links.
 *
 * The pointer pushes bubbles away and drags them along as it moves, and the
 * whole field shifts with scroll for depth. It is one canvas with a few dozen
 * points, so a frame costs a fraction of a millisecond.
 */
export default function Bubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0, lastX: 0, lastY: 0, active: false };
    let palette = readPalette();
    let bubbles: Bubble[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let lastScroll = window.scrollY;
    let tick = 0;

    const build = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(72, Math.max(18, Math.round((width * height) / 21000)));
      bubbles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 1.2 + Math.random() * 2.2,
        depth: 0.06 + Math.random() * 0.22,
        colour: i % COLOUR_VARS.length,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (time: number) => {
      // Step size relative to a 60fps frame, so speed is the same on any display.
      const step = lastTime ? Math.min((time - lastTime) / 16.67, 3) : 1;
      lastTime = time;
      tick += step;

      const scrollDelta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      const pointerVx = pointer.x - pointer.lastX;
      const pointerVy = pointer.y - pointer.lastY;
      pointer.lastX = pointer.x;
      pointer.lastY = pointer.y;

      context.clearRect(0, 0, width, height);

      for (const bubble of bubbles) {
        bubble.y -= scrollDelta * bubble.depth;

        if (pointer.active) {
          const dx = bubble.x - pointer.x;
          const dy = bubble.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < PUSH_RADIUS && distance > 0.01) {
            const force = 1 - distance / PUSH_RADIUS;
            // Pushed away from the pointer…
            bubble.vx += (dx / distance) * force * 0.5 * step;
            bubble.vy += (dy / distance) * force * 0.5 * step;
            // …and dragged along in the direction it is moving.
            bubble.vx += pointerVx * force * 0.03;
            bubble.vy += pointerVy * force * 0.03;
          }
        }

        const damping = Math.pow(0.97, step);
        bubble.vx *= damping;
        bubble.vy *= damping;
        if (Math.hypot(bubble.vx, bubble.vy) < 0.12) {
          bubble.vx += (Math.random() - 0.5) * 0.04;
          bubble.vy += (Math.random() - 0.5) * 0.04;
        }
        bubble.x += bubble.vx * step;
        bubble.y += bubble.vy * step;

        if (bubble.x < -40) bubble.x += width + 80;
        if (bubble.x > width + 40) bubble.x -= width + 80;
        if (bubble.y < -40) bubble.y += height + 80;
        if (bubble.y > height + 40) bubble.y -= height + 80;
      }

      // Links between neighbours, with a packet travelling the strong ones.
      context.lineWidth = 1;
      for (let i = 0; i < bubbles.length; i += 1) {
        const a = bubbles[i];
        for (let j = i + 1; j < bubbles.length; j += 1) {
          const b = bubbles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > LINK_DISTANCE) continue;
          const strength = 1 - distance / LINK_DISTANCE;

          context.strokeStyle = `rgba(${palette.ink}, ${strength * 0.16})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();

          if (strength > 0.62) {
            const progress = (tick * 0.007 + (i * 7 + j * 13) * 0.11) % 1;
            context.fillStyle = `rgba(${palette.colours[a.colour]}, ${strength * 0.9})`;
            context.beginPath();
            context.arc(
              a.x + (b.x - a.x) * progress,
              a.y + (b.y - a.y) * progress,
              1.6,
              0,
              Math.PI * 2
            );
            context.fill();
          }
        }
      }

      // The pointer joins the mesh: links to whatever is within reach.
      if (pointer.active) {
        for (const bubble of bubbles) {
          const distance = Math.hypot(bubble.x - pointer.x, bubble.y - pointer.y);
          if (distance > PUSH_RADIUS) continue;
          context.strokeStyle = `rgba(${palette.select}, ${(1 - distance / PUSH_RADIUS) * 0.55})`;
          context.beginPath();
          context.moveTo(pointer.x, pointer.y);
          context.lineTo(bubble.x, bubble.y);
          context.stroke();
        }
      }

      for (const bubble of bubbles) {
        bubble.phase += 0.016 * step;
        const glow = (Math.sin(bubble.phase) + 1) / 2;
        const radius = bubble.radius + glow * 0.8;
        const colour = palette.colours[bubble.colour];

        context.fillStyle = `rgba(${colour}, ${0.09 + glow * 0.08})`;
        context.beginPath();
        context.arc(bubble.x, bubble.y, radius * 5, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = `rgba(${colour}, 0.85)`;
        context.beginPath();
        context.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      frame = reduceMotion ? 0 : requestAnimationFrame(draw);
    };

    const start = () => {
      if (frame || document.hidden) return;
      lastTime = 0;
      lastScroll = window.scrollY;
      frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      if (!pointer.active) {
        pointer.lastX = event.clientX;
        pointer.lastY = event.clientY;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!reduceMotion) {
        start();
      }
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (reduceMotion) draw(0);
      }, 180);
    };

    // Re-read the colours when the theme changes.
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      if (reduceMotion) draw(0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    build();
    if (reduceMotion) draw(0);
    else start();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="backdrop__bubbles" />;
}
