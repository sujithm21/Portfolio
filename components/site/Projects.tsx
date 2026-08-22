'use client';

import { forwardRef, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Github, Lock, Sparkles } from 'lucide-react';
import { projectCategories, projects, type Project } from '@/lib/data';
import { Pill, Reveal, Section, SectionHeading, spotlightProps } from './primitives';
import { cn } from '@/lib/utils';

const badgeTone: Record<NonNullable<Project['badge']>, string> = {
  Enterprise: 'cyan',
  Research: 'violet',
  Hackathon: 'emerald',
  'Open Source': 'cyan',
};

const ProjectCard = forwardRef<
  HTMLDivElement,
  { project: Project; index: number }
>(function ProjectCard({ project, index }, ref) {
  const [open, setOpen] = useState(false);
  const tone = project.badge ? badgeTone[project.badge] : 'cyan';

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      {...spotlightProps()}
      className={cn(
        'glass spotlight group flex h-full flex-col rounded-lg p-6',
        project.featured && 'border-[hsl(var(--cyan)/0.28)]'
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {project.badge && (
            <span
              className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{
                background: `hsl(var(--${tone}) / 0.1)`,
                border: `1px solid hsl(var(--${tone}) / 0.3)`,
                color: `hsl(var(--${tone}))`,
              }}
            >
              {project.badge}
            </span>
          )}
          {project.featured && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-[hsl(var(--cyan))]" />
              Featured
            </span>
          )}
        </div>

        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} on GitHub`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline text-muted-foreground transition-colors hover:border-[hsl(var(--cyan)/0.5)] hover:text-[hsl(var(--cyan))]"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span
            title="Internal / proprietary work"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline text-muted-foreground/60"
          >
            <Lock className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-[hsl(var(--cyan))]">
        {project.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
        {project.blurb}
      </p>

      {project.metric && (
        <div className="mt-4 flex items-baseline gap-2 rounded-md border border-hairline bg-secondary/40 px-3 py-2">
          <span className="accent-text font-display text-lg font-bold">{project.metric.value}</span>
          <span className="font-mono text-[11px] text-muted-foreground">{project.metric.label}</span>
        </div>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-4 space-y-2.5 border-l border-[hsl(var(--cyan)/0.3)] pl-4">
              {project.points.map((point) => (
                <li key={point} className="text-[13px] leading-relaxed text-muted-foreground">
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 5).map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-5 inline-flex items-center gap-1.5 self-start font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-[hsl(var(--cyan))]"
      >
        {open ? 'Hide details' : 'What I built'}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
    </motion.article>
  );
});

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((p) => p.categories.includes(filter)),
    [filter]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    projectCategories.slice(1).forEach((cat) => {
      map[cat] = projects.filter((p) => p.categories.includes(cat)).length;
    });
    return map;
  }, []);

  return (
    <Section id="projects">
      <SectionHeading
        index="03"
        kicker="Projects"
        title={
          <>
            Things I have <span className="accent-text">built and shipped</span>
          </>
        }
        intro="Enterprise platforms, published research and side projects — filtered by the bucket they belong to."
      />

      <Reveal>
        <div className="no-scrollbar -mx-6 mb-10 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {projectCategories.map((category) => {
            const active = filter === category;
            return (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                  'relative shrink-0 rounded-full border px-4 py-2 text-sm transition-colors duration-200',
                  active
                    ? 'border-[hsl(var(--cyan)/0.45)] text-foreground'
                    : 'border-hairline text-muted-foreground hover:border-[hsl(var(--cyan)/0.3)] hover:text-foreground'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-[hsl(var(--cyan)/0.1)]"
                  />
                )}
                {category}
                <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                  {counts[category]}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
