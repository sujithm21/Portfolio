'use client';

import { Moon, Sun } from 'lucide-react';

/**
 * Light/dark switch. Where the browser supports view transitions the new theme
 * spreads out in a circle from the button; elsewhere it just switches.
 */
export default function ThemeToggle() {
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const apply = () => {
      const dark = root.classList.toggle('dark');
      try {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
      } catch {
        // Storage unavailable: the choice lasts for this page view only.
      }
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    const { clientX: x, clientY: y } = event;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    root.setAttribute('data-vt', 'theme');
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 560,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
    transition.finished.finally(() => {
      root.removeAttribute('data-vt');
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className="icon-btn size-10 border-transparent"
    >
      <Sun className="hidden size-[18px] dark:block" />
      <Moon className="size-[18px] dark:hidden" />
    </button>
  );
}
