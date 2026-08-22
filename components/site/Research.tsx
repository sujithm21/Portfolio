'use client';

import { BookOpen } from 'lucide-react';
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
        intro="Federated learning, explainable AI and network security — published and presented at IEEE conferences."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {publications.map((paper, i) => (
          <Reveal key={paper.title} delay={i * 0.07}>
            <article
              {...spotlightProps()}
              className="glass spotlight group flex h-full flex-col rounded-lg p-6"
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

              <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-pretty sm:text-[17px]">
                {paper.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                {paper.summary}
              </p>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {paper.topics.map((topic) => (
                  <Pill key={topic}>{topic}</Pill>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
