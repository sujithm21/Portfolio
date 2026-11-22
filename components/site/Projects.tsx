'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { Plus } from 'lucide-react';
import type { AgentId } from '@/lib/agents';
import { projectCategories, projects, type Project, type ProjectBadge } from '@/lib/data';
import { cn, slugify } from '@/lib/utils';
import { GitHubIcon } from './icons';
import { Section } from './ui';

const badgeAgent: Record<ProjectBadge, AgentId> = {
  Enterprise: 'builder',
  Research: 'planner',
  Hackathon: 'qa',
  'Open Source': 'deployer',
};

/** The tab the section opens on: a hand-picked set rather than everything. */
const FEATURED = 'Featured';

const matches = (project: Project, category: string) => {
  if (category === 'All') return true;
  if (category === FEATURED) return Boolean(project.featured);
  return project.categories.includes(category);
};

const countFor = (category: string) =>
  projects.filter((project) => matches(project, category)).length;

export default function Projects() {
  const [active, setActive] = useState(FEATURED);
  const [expanded, setExpanded] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const select = (category: string) => {
    if (category === active) return;

    // Cards that have not scrolled into view yet must not stay hidden once the
    // grid is rearranged, so mark them all as built.
    gridRef.current
      ?.querySelectorAll('[data-b]')
      .forEach((card) => card.setAttribute('data-built', ''));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduceMotion) {
      setActive(category);
      return;
    }

    // Let the browser animate each card from its old position to its new one.
    const root = document.documentElement;
    root.setAttribute('data-vt', 'filter');
    const transition = document.startViewTransition(() => {
      flushSync(() => setActive(category));
    });
    transition.finished.finally(() => {
      root.removeAttribute('data-vt');
    });
  };

  const toggle = (slug: string) =>
    setExpanded((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    );

  return (
    <Section
      id="projects"
      index="03"
      label="Projects"
      title="Built, shipped, *measured.*"
      intro="Featured builds first. Switch to All for published research and side projects, or filter by the kind of problem."
    >
      <div
        data-b="projects/filters"
        role="group"
        aria-label="Filter projects"
        className="-mx-5 mb-8 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {projectCategories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={active === category}
            data-cursor="Filter"
            onClick={() => select(category)}
            className={cn(
              'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200',
              active === category
                ? 'border-ink bg-ink text-canvas'
                : 'border-line-strong text-ink-soft hover:border-ink-faint hover:text-ink'
            )}
          >
            {category}
            <span className="font-mono text-[11px] opacity-60">{countFor(category)}</span>
          </button>
        ))}
      </div>

      <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {projects.map((project, i) => {
          const slug = slugify(project.title);
          const visible = matches(project, active);
          const wide = project.featured && (active === 'All' || active === FEATURED);
          const open = project.featured || expanded.includes(slug);

          return (
            <article
              key={slug}
              hidden={!visible}
              data-b={`projects/${slug}`}
              data-frame={`projects/${slug}`}
              data-tilt
              data-cursor="Inspect"
              style={{ '--i': i % 3, '--vt': `project-${slug}` } as CSSProperties}
              className={cn(
                'project-card card selectable flex flex-col p-6 sm:p-7',
                project.featured && 'is-featured',
                // Featured cards are wide in the Featured and All views; a category is an even grid.
                wide ? 'lg:col-span-3' : 'lg:col-span-2'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  data-agent={badgeAgent[project.badge]}
                  className="inline-flex h-6 items-center rounded-full border border-agent/30 bg-agent/10 px-2.5 font-mono text-[10px] font-medium tracking-wider text-agent uppercase"
                >
                  {project.badge}
                </span>
                {project.featured && active !== FEATURED && (
                  <span className="eyebrow">Featured</span>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} on GitHub`}
                    className="ml-auto text-ink-faint transition-colors hover:text-ink"
                  >
                    <GitHubIcon className="size-[18px]" />
                  </a>
                )}
              </div>

              <h3
                className={cn(
                  'mt-5 leading-tight font-semibold tracking-[-0.03em] text-balance',
                  project.featured ? 'text-2xl sm:text-[1.75rem]' : 'text-xl'
                )}
              >
                {project.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-pretty text-ink-soft">{project.blurb}</p>

              {project.metric && (
                <p
                  data-agent={badgeAgent[project.badge]}
                  className="mt-5 flex items-baseline gap-2.5"
                >
                  <span className="stat-number text-3xl font-semibold tracking-[-0.045em]">
                    {project.metric.value}
                  </span>
                  <span className="font-mono text-xs text-ink-faint">{project.metric.label}</span>
                </p>
              )}

              {/* Details: always open on featured cards, collapsible elsewhere. */}
              <div
                className={cn(
                  'grid transition-[grid-template-rows,opacity] duration-500 ease-out-quint',
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <ul inert={!open} className="space-y-2.5 overflow-hidden">
                  {project.points.map((point, index) => (
                    <li
                      key={point}
                      className={cn(
                        'relative pl-5 text-sm leading-relaxed text-ink-soft before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-2.5 before:bg-select',
                        index === 0 && 'mt-5'
                      )}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {project.tags.map((tag) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>

              {!project.featured && (
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => toggle(slug)}
                  className="mt-5 flex items-center gap-2 self-start font-mono text-xs text-ink-faint transition-colors hover:text-ink"
                >
                  <Plus
                    className={cn(
                      'size-3.5 transition-transform duration-300 ease-out-quint',
                      open && 'rotate-45'
                    )}
                  />
                  {open ? 'Hide details' : 'How it was built'}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
