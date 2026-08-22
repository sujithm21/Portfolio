'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MapPin, Terminal } from 'lucide-react';
import { profile, stats } from '@/lib/data';
import { Reveal, spotlightProps } from './primitives';

/* ---------------- Rotating role typewriter ---------------- */

function Typewriter({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    const done = !deleting && text === word;
    const cleared = deleting && text === '';

    if (done) {
      const hold = setTimeout(() => setDeleting(true), 1900);
      return () => clearTimeout(hold);
    }
    if (cleared) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const tick = setTimeout(
      () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      deleting ? 34 : 62
    );
    return () => clearTimeout(tick);
  }, [text, deleting, index, words]);

  return (
    <span className="caret accent-text font-display">
      {text || ' '}
    </span>
  );
}

/* ---------------- Animated metric ---------------- */

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const isDecimal = !Number.isInteger(value);
  const shown = isDecimal
    ? display.toFixed(1)
    : Math.round(display).toLocaleString('en-US');

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
      {suffix}
    </span>
  );
}

/* ---------------- Stack panel ---------------- */

const stack = [
  { layer: 'Agent layer', items: 'CrewAI · Google ADK · MCP · A2A' },
  { layer: 'Orchestration', items: 'Azure AI Foundry · Agent Gateway' },
  { layer: 'Retrieval', items: 'RAG · Vector search · Embeddings' },
  { layer: 'Infrastructure', items: 'AWS CDK · Lambda · Step Functions' },
  { layer: 'Reliability', items: 'Multi-region DR · Observability' },
];

function StackPanel() {
  return (
    <div
      {...spotlightProps()}
      className="glass spotlight relative w-full rounded-lg p-1.5 shadow-soft"
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--violet)/0.7)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--cyan)/0.7)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--emerald)/0.7)]" />
        </span>
        <span className="ml-1 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Terminal className="h-3 w-3" />
          production-stack.yaml
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-[hsl(var(--emerald)/0.35)] bg-[hsl(var(--emerald)/0.1)] px-2 py-0.5 font-mono text-[10px] text-[hsl(var(--emerald))]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--emerald))] opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--emerald))]" />
          </span>
          deployed
        </span>
      </div>

      <div className="rounded-md border border-hairline bg-background/40 p-4 sm:p-5">
        <ul className="space-y-0">
          {stack.map((row, i) => (
            <motion.li
              key={row.layer}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.11, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex gap-4 pb-5 last:pb-0"
            >
              {/* connector rail */}
              <div className="relative flex w-4 shrink-0 flex-col items-center">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4 transition-all duration-300"
                  style={{
                    background: `hsl(var(--${i < 3 ? 'violet' : 'cyan'}))`,
                    boxShadow: `0 0 12px hsl(var(--${i < 3 ? 'violet' : 'cyan'}) / 0.8)`,
                    // @ts-expect-error CSS custom property for ring colour
                    '--tw-ring-color': `hsl(var(--${i < 3 ? 'violet' : 'cyan'}) / 0.12)`,
                  }}
                />
                {i < stack.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-gradient-to-b from-hairline to-transparent" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {row.layer}
                </p>
                <p className="mt-1 truncate font-mono text-[13px] text-foreground/90 transition-colors group-hover:text-[hsl(var(--cyan))]">
                  {row.items}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Hero ---------------- */

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-[0.55]" />
        <div
          className="aurora animate-float-a left-[-10%] top-[-12%] h-[46vw] w-[46vw] max-h-[560px] max-w-[560px]"
          style={{ background: 'hsl(var(--glow-a) / 0.5)' }}
        />
        <div
          className="aurora animate-float-b right-[-12%] top-[6%] h-[44vw] w-[44vw] max-h-[540px] max-w-[540px]"
          style={{ background: 'hsl(var(--glow-b) / 0.45)' }}
        />
        <div
          className="aurora animate-float-a bottom-[-20%] left-[28%] h-[36vw] w-[36vw] max-h-[420px] max-w-[420px]"
          style={{ background: 'hsl(var(--emerald) / 0.22)', animationDelay: '-6s' }}
        />
      </div>

      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* ---- copy ---- */}
          <div>
            <Reveal>
              <span className="glass inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5 font-mono text-[11px] tracking-wide text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--emerald))] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--emerald))]" />
                </span>
                {profile.availability}
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display text-[clamp(2.6rem,7.5vw,4.75rem)] font-bold leading-[0.98] tracking-tight">
                <span className="gradient-text">{profile.name}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3 text-[clamp(1.1rem,3.2vw,1.6rem)] font-semibold">
                <span className="text-muted-foreground">I build</span>
                <Typewriter words={profile.roles} />
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-[1.0625rem]">
                {profile.tagline}
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[hsl(var(--cyan))]" />
                  {profile.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[hsl(var(--violet))]" />
                  Software Engineer @ CGI
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-[hsl(var(--background))] shadow-glow transition-transform duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(100deg, hsl(var(--cyan)), hsl(var(--violet)))',
                  }}
                >
                  View my work
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#contact"
                  className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-[hsl(var(--cyan)/0.5)]"
                >
                  <Mail className="h-4 w-4 text-[hsl(var(--cyan))]" />
                  Get in touch
                </a>

                <div className="ml-1 flex items-center gap-1.5">
                  {[
                    { href: profile.socials.github, icon: Github, label: 'GitHub' },
                    { href: profile.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
                  ].map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-hairline text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-[hsl(var(--cyan)/0.5)] hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* ---- stack panel ---- */}
          <Reveal delay={0.24} y={30}>
            <StackPanel />
          </Reveal>
        </div>

        {/* ---- metrics ---- */}
        <Reveal delay={0.4}>
          <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                {...spotlightProps()}
                className="spotlight group bg-background/60 p-5 backdrop-blur-sm sm:p-6"
              >
                <p className="font-display text-3xl font-bold sm:text-4xl">
                  <span className="accent-text">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </span>
                </p>
                <p className="mt-2 text-sm font-medium leading-snug">{stat.label}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{stat.hint}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 flex justify-center">
          <motion.a
            href="#about"
            aria-label="Scroll to about"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="grid h-10 w-10 place-items-center rounded-full border border-hairline text-muted-foreground transition-colors hover:border-[hsl(var(--cyan)/0.5)] hover:text-foreground"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
