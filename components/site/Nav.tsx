'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  ChevronDown,
  Download,
  FileText,
  Github,
  Linkedin,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { navSections, primaryResume, profile, resumeVariants } from '@/lib/data';
import { cn } from '@/lib/utils';

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== 'light';

  return (
    <button
      type="button"
      aria-label="Toggle colour theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative grid h-9 w-9 place-items-center rounded-full border border-hairline bg-secondary/60 text-muted-foreground transition-colors hover:border-[hsl(var(--cyan)/0.5)] hover:text-foreground"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}

function ResumeMenu({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-stretch overflow-hidden rounded-full border border-[hsl(var(--cyan)/0.35)] bg-[hsl(var(--cyan)/0.08)]">
        <a
          href={primaryResume}
          download
          className={cn(
            'flex items-center gap-2 py-2 pl-4 pr-3 font-mono text-xs font-medium tracking-wide text-foreground transition-colors hover:bg-[hsl(var(--cyan)/0.16)]',
            compact && 'flex-1 justify-center'
          )}
        >
          <Download className="h-3.5 w-3.5 text-[hsl(var(--cyan))]" />
          Resume
        </a>
        <button
          type="button"
          aria-label="Choose a resume variant"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="border-l border-[hsl(var(--cyan)/0.3)] px-2 text-muted-foreground transition-colors hover:bg-[hsl(var(--cyan)/0.16)] hover:text-foreground"
        >
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="glass absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-lg p-1.5 shadow-soft"
          >
            <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Role-specific versions
            </p>
            {resumeVariants.map((variant) => (
              <a
                key={variant.file}
                href={variant.file}
                download
                onClick={() => setOpen(false)}
                className="group flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-[hsl(var(--cyan)/0.1)]"
              >
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[hsl(var(--cyan))]" />
                <span>
                  <span className="block text-sm font-medium">{variant.label}</span>
                  <span className="block text-xs leading-snug text-muted-foreground">
                    {variant.description}
                  </span>
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scrollspy: highlight whichever section owns the upper third of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const go = useCallback((id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(90deg, hsl(var(--cyan)), hsl(var(--violet)), hsl(var(--emerald)))',
          }}
        />
      </motion.div>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled ? 'py-2' : 'py-4'
        )}
      >
        <div className="container">
          <nav
            className={cn(
              'flex items-center justify-between rounded-full px-3 py-2 transition-all duration-300 sm:px-4',
              scrolled ? 'glass shadow-soft' : 'border border-transparent'
            )}
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2.5 pl-1 pr-2"
              aria-label="Back to top"
            >
              <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[hsl(var(--cyan))] to-[hsl(var(--violet))] font-display text-sm font-bold text-[hsl(var(--background))] shadow-glow">
                SM
              </span>
              <span className="hidden whitespace-nowrap font-display text-sm font-semibold tracking-tight sm:block">
                {profile.name}
                <span className="ml-2 hidden font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground xl:inline">
                  {profile.role}
                </span>
              </span>
            </button>

            <div className="hidden items-center gap-0.5 lg:flex">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => go(section.id)}
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-sm transition-colors',
                    active === section.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {active === section.id && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full border border-[hsl(var(--cyan)/0.3)] bg-[hsl(var(--cyan)/0.1)]"
                    />
                  )}
                  {section.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="hidden h-9 w-9 place-items-center rounded-full border border-hairline bg-secondary/60 text-muted-foreground transition-colors hover:border-[hsl(var(--cyan)/0.5)] hover:text-foreground sm:grid"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="hidden h-9 w-9 place-items-center rounded-full border border-hairline bg-secondary/60 text-muted-foreground transition-colors hover:border-[hsl(var(--cyan)/0.5)] hover:text-foreground sm:grid"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <ThemeToggle />
              <div className="hidden sm:block">
                <ResumeMenu />
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="grid h-9 w-9 place-items-center rounded-full border border-hairline bg-secondary/60 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/85 backdrop-blur-xl lg:hidden"
          >
            <div className="container flex h-full flex-col py-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold">{profile.name}</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-full border border-hairline"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 flex flex-col gap-1">
                {navSections.map((section, i) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    onClick={() => go(section.id)}
                    className="flex items-baseline gap-4 border-b border-hairline py-4 text-left"
                  >
                    <span className="font-mono text-xs text-[hsl(var(--cyan))]">
                      0{i + 1}
                    </span>
                    <span className="font-display text-2xl font-semibold">{section.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-auto space-y-4">
                <ResumeMenu compact />
                <div className="flex gap-2">
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="glass flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm"
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="glass flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
