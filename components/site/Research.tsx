'use client';

import { ArrowUpRight, BookOpen } from 'lucide-react';
import { publications } from '@/lib/data';
import { Pill, Reveal, Section, SectionHeading, spotlightProps } from './primitives';

export default function Research() {
  return (
    <Section id="research">
      <SectionHeading
        index="05"
        kicker="Research"
        title={
          <>
            Four <span className="accent-text">IEEE publications</span>
          </>
        }
        intro="Federated learning, explainable AI and network security — published and presented at IEEE conferences. Each card opens the paper on IEEE Xplore."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {publications.map((paper, i) => (
          <Reveal key={paper.title} delay={i * 0.07}>
            <a
              href={paper.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${paper.title} — read on IEEE Xplore`}
              {...spotlightProps()}
              className="glass spotlight lift group flex h-full flex-col rounded-lg p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--violet)/0.3)] bg-[hsl(var(--violet)/0.1)] px-3 py-1 font-mono text-[11px] tracking-wide text-[hsl(var(--violet))]">
                  <BookOpen className="h-3 w-3" />
                  {paper.venue}
                </span>
                <span className="font-mono text-2xl font-bold text-muted-foreground/25 transition-colors group-hover:text-[hsl(var(--cyan)/0.5)]">
                  {paper.year}
                </span>
              </div>

              <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-pretty transition-colors group-hover:text-[hsl(var(--cyan))] sm:text-[17px]">
                {paper.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                {paper.summary}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
                {paper.topics.map((topic) => (
                  <Pill key={topic}>{topic}</Pill>
                ))}
                <span className="ml-auto inline-flex items-center gap-1 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-[hsl(var(--cyan))]">
                  IEEE Xplore
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
