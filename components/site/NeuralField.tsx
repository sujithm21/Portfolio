'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
};

/**
 * Canvas "neural cloud": drifting nodes wired together when close enough,
 * with packets travelling the links and a cursor that pushes the mesh around.
 * Deliberately dependency-free so it stays cheap on the main thread.
 */
export default function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let raf = 0;
    let running = true;
    let t = 0;

    const pointer = { x: -9999, y: -9999, active: false };

    const linkDistance = () => (width < 640 ? 110 : width < 1100 ? 130 : 155);

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = width < 640 ? 15000 : 11000;
      const count = Math.min(96, Math.max(26, Math.round((width * height) / density)));

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.9,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const palette = () => {
      const dark = themeRef.current !== 'light';
      return dark
        ? { node: '150, 230, 255', link: '120, 190, 255', accent: '167, 139, 250', linkAlpha: 0.5, nodeAlpha: 0.75 }
        : { node: '8, 145, 178', link: '30, 110, 180', accent: '109, 40, 217', linkAlpha: 0.34, nodeAlpha: 0.55 };
    };

    const draw = () => {
      if (!running) return;
      t += 1;
      const c = palette();
      const maxDist = linkDistance();

      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // Cursor pushes nodes away, then they drift back on their own.
        if (pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 19000 && d2 > 0.01) {
            const f = (19000 - d2) / 19000;
            const d = Math.sqrt(d2);
            n.vx += (dx / d) * f * 0.16;
            n.vy += (dy / d) * f * 0.16;
          }
        }

        // Gentle damping keeps velocities from running away.
        n.vx *= 0.992;
        n.vy *= 0.992;
        const speed = Math.hypot(n.vx, n.vy);
        if (speed < 0.06) {
          n.vx += (Math.random() - 0.5) * 0.03;
          n.vy += (Math.random() - 0.5) * 0.03;
        }

        if (n.x < -40) n.x = width + 40;
        if (n.x > width + 40) n.x = -40;
        if (n.y < -40) n.y = height + 40;
        if (n.y > height + 40) n.y = -40;
      }

      // Links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > maxDist) continue;

          const strength = 1 - dist / maxDist;
          ctx.strokeStyle = `rgba(${c.link}, ${strength * c.linkAlpha * 0.55})`;
          ctx.lineWidth = strength * 1.05;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          // Data packet sliding along the strongest links
          if (!reduced && strength > 0.74) {
            const p = ((t * 0.006 + (i * 7 + j * 13) * 0.11) % 1);
            const px = a.x + (b.x - a.x) * p;
            const py = a.y + (b.y - a.y) * p;
            ctx.fillStyle = `rgba(${c.accent}, ${strength * 0.75})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        n.pulse += 0.014;
        const glow = (Math.sin(n.pulse) + 1) / 2;
        const radius = n.r + glow * 0.7;

        ctx.fillStyle = `rgba(${c.node}, ${c.nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${c.node}, ${0.1 + glow * 0.09})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 180);
    };

    build();
    if (reduced) {
      // Render a single static frame instead of animating.
      running = true;
      draw();
      running = false;
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70 dark:opacity-80"
    />
  );
}
