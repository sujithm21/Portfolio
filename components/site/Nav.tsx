'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Download, Menu, X } from 'lucide-react';
import { CURSOR_PATH } from '@/lib/agents';
import { navSections, primaryResume, profile, resumeVariants } from '@/lib/data';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import { b } from './ui';

/** Résumé download with a menu of role-specific versions. */
function ResumeMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden sm:flex">
      <a
        href={primaryResume}
        download
        className="btn btn-primary h-10 rounded-r-none pr-3 pl-4 text-[13px]"
      >
        <Download className="size-4" />
        Résumé
      </a>
      <button
        type="button"
        aria-label="Choose a résumé version"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="btn btn-primary h-10 rounded-l-none border-l border-canvas/25 px-2.5"
      >
        <ChevronDown
          className={cn('size-4 transition-transform duration-300', open && 'rotate-180')}
        />
      </button>

      <div
        inert={!open}
        className={cn(
          'absolute top-[calc(100%+12px)] right-0 w-72 origin-top-right rounded-2xl border border-line-strong bg-surface p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)] transition duration-200 ease-out-quint',
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        )}
      >
        <p className="eyebrow px-3 pt-2.5 pb-1.5">Role-specific versions</p>
        {resumeVariants.map((variant) => (
          <a
            key={variant.file}
            href={variant.file}
            download
            onClick={() => setOpen(false)}
            className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-raised"
          >
            <Download className="mt-0.5 size-4 shrink-0 text-select" />
            <span>
              <span className="block text-sm font-medium">{variant.label}</span>
              <span className="mt-0.5 block text-xs text-ink-soft">{variant.description}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Nav() {
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  // Scrollspy: the section crossing the middle of the viewport is the active one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id === 'top' ? '' : entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ['top', ...navSections.map((section) => section.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Slide the highlight pill under the active link.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const place = () => {
      const link = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
      list.style.setProperty('--o', link ? '1' : '0');
      if (!link) return;
      list.style.setProperty('--x', `${link.offsetLeft}px`);
      list.style.setProperty('--w', `${link.offsetWidth}px`);
    };
    place();
    document.fonts.ready.then(place);
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  // Lock page scroll and allow Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:px-5">
      <div
        {...b('nav/bar', 1)}
        data-b-hero="1"
        className="relative mx-auto flex h-14 max-w-[1180px] items-center gap-1 rounded-full border border-line-strong bg-surface/95 pr-2 pl-2.5 shadow-[0_10px_40px_-18px_rgb(0_0_0/0.45)]"
      >
        <span className="nav-progress" aria-hidden="true" />
        <a href="#top" className="flex items-center gap-2.5 rounded-full pr-3">
          <span className="grid size-9 place-items-center rounded-full bg-ink">
            <svg viewBox="0 0 20 20" className="size-4 fill-canvas" aria-hidden="true">
              <path d={CURSOR_PATH} />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight">{profile.name}</span>
        </a>

        <nav aria-label="Sections" className="mx-auto hidden lg:block">
          <ul ref={listRef} className="relative flex items-center">
            <li aria-hidden="true" className="nav-pill" />
            {navSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  data-id={section.id}
                  aria-current={active === section.id ? 'true' : undefined}
                  className={cn(
                    'relative block rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200',
                    active === section.id ? 'text-ink' : 'text-ink-soft hover:text-ink'
                  )}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <ThemeToggle />
          <ResumeMenu />
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="icon-btn size-10 border-transparent lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          inert={!menuOpen}
          data-lenis-prevent
          className={cn(
            'absolute inset-x-0 top-[calc(100%+10px)] origin-top rounded-3xl border border-line-strong bg-surface p-2.5 shadow-[0_30px_80px_-24px_rgb(0_0_0/0.6)] transition duration-300 ease-out-quint lg:hidden',
            menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
          )}
        >
          <ul>
            {navSections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-4 rounded-2xl px-4 py-3 text-xl font-medium tracking-tight transition-colors hover:bg-raised"
                >
                  <span className="font-mono text-xs text-ink-faint">0{i + 1}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={primaryResume}
            download
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary mt-2 w-full"
          >
            <Download className="size-4" />
            Download résumé
          </a>
        </div>
      </div>
    </header>
  );
}
