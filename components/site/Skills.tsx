'use client';

import {
  Brain,
  Cloud,
  Code2,
  Database,
  Layers,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { skillBuckets } from '@/lib/data';
import { Reveal, Section, SectionHeading, spotlightProps } from './primitives';

const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  sparkles: Sparkles,
  cloud: Cloud,
  shield: ShieldCheck,
  server: Server,
  database: Database,
  layers: Layers,
  code: Code2,
  wrench: Wrench,
};

// Alternating accent so the grid reads as a system rather than a list.
const tones = ['violet', 'cyan', 'cyan', 'emerald', 'cyan', 'violet', 'cyan', 'violet', 'emerald'];

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        index="04"
        kicker="Skills"
        title={
          <>
            The <span className="accent-text">toolkit</span>, by bucket
          </>
        }
        intro="Everything below is something I have used to ship or publish — grouped the way I actually reach for it."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillBuckets.map((bucket, i) => {
          const Icon = iconMap[bucket.icon] ?? Code2;
          const tone = tones[i % tones.length];

          return (
            <Reveal key={bucket.name} delay={Math.min(i * 0.05, 0.35)}>
              <div
                {...spotlightProps()}
                className="glass spotlight group flex h-full flex-col rounded-lg p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `hsl(var(--${tone}) / 0.12)`,
                      border: `1px solid hsl(var(--${tone}) / 0.28)`,
                      color: `hsl(var(--${tone}))`,
                    }}
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </span>
                  <h3 className="font-display text-[15px] font-semibold leading-tight">
                    {bucket.name}
                  </h3>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    {String(bucket.items.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {bucket.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-hairline bg-secondary/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors duration-200 hover:border-[hsl(var(--cyan)/0.4)] hover:bg-[hsl(var(--cyan)/0.08)] hover:text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
