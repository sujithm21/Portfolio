'use client';

import { Briefcase, Code2, FlaskConical } from 'lucide-react';
import { experience } from '@/lib/data';
import { GlassCard, Pill, Reveal, Section, SectionHeading } from './primitives';

const icons = [Briefcase, FlaskConical, Code2];

export default function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        index="02"
        kicker="Experience"
        title={
          <>
            Where I have <span className="accent-text">shipped</span>
          </>
        }
        intro="Enterprise AI platforms in production, and systems research on how models actually execute."
      />

      <div className="relative">
        {/* timeline rail */}
        <span
          aria-hidden
          className="absolute left-[19px] top-2 hidden w-px sm:block"
          style={{
            height: 'calc(100% - 2rem)',
            background:
              'linear-gradient(180deg, hsl(var(--cyan) / 0.6), hsl(var(--violet) / 0.4), transparent)',
          }}
        />

        <div className="space-y-8">
          {experience.map((job, i) => {
            const Icon = icons[i] ?? Briefcase;
            return (
              <Reveal key={job.company} delay={i * 0.1}>
                <div className="relative sm:pl-[62px]">
                  {/* node */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-3 hidden h-10 w-10 place-items-center rounded-full border border-hairline bg-background sm:grid"
                    style={{ boxShadow: '0 0 0 6px hsl(var(--background))' }}
                  >
                    <span
                      className="grid h-full w-full place-items-center rounded-full"
                      style={{
                        background: `hsl(var(--${['cyan', 'violet', 'emerald'][i] ?? 'cyan'}) / 0.12)`,
                        color: `hsl(var(--${['cyan', 'violet', 'emerald'][i] ?? 'cyan'}))`,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  </span>

                  <GlassCard className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                      <div>
                        <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                          {job.company}
                        </h3>
                        <p className="mt-1 text-[15px] font-medium text-[hsl(var(--cyan))]">
                          {job.role}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-mono text-xs text-muted-foreground">{job.period}</p>
                        <p className="mt-1 font-mono text-[11px] text-muted-foreground/80">
                          {job.location} · {job.kind}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-3">
                      {job.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span
                            aria-hidden
                            className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45"
                            style={{ background: 'hsl(var(--cyan) / 0.75)' }}
                          />
                          <span className="text-sm leading-relaxed text-muted-foreground text-pretty">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {job.stack.map((tech) => (
                        <Pill key={tech}>{tech}</Pill>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
