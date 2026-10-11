'use client';

import { Award, BadgeCheck, Medal, Microscope, Star, Trophy, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { achievements, certifications, featuredCertifications } from '@/lib/data';
import { GlassCard, Reveal, Section, SectionHeading } from './primitives';

const achievementIcons: Record<string, LucideIcon> = {
  trophy: Trophy,
  microscope: Microscope,
  medal: Medal,
  star: Star,
};

export default function Credentials() {
  return (
    <Section id="credentials">
      <SectionHeading
        index="06"
        kicker="Credentials"
        title={
          <>
            Certifications & <span className="accent-text">achievements</span>
          </>
        }
      />

      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        {/* ---- Achievements ---- */}
        <div>
          <Reveal>
            <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-semibold">
              <Trophy className="h-4 w-4 text-[hsl(var(--emerald))]" />
              Highlights
            </h3>
          </Reveal>

          <div className="space-y-3">
            {achievements.map((item, i) => {
              const Icon = achievementIcons[item.icon] ?? Award;
              return (
                <Reveal key={item.title} delay={i * 0.07}>
                  <GlassCard className="flex gap-4 p-5">
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[hsl(var(--emerald)/0.28)] bg-[hsl(var(--emerald)/0.1)] text-[hsl(var(--emerald))]">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <h4 className="font-display text-[15px] font-semibold leading-snug">
                          {item.title}
                        </h4>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {item.year}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                        {item.detail}
                      </p>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* ---- Certifications ---- */}
        <div>
          <Reveal>
            <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-semibold">
              <BadgeCheck className="h-4 w-4 text-[hsl(var(--cyan))]" />
              Certifications
            </h3>
          </Reveal>

          <div className="mb-5 grid gap-3">
            {featuredCertifications.map((certification, ci) => (
              <Reveal key={certification.exam} delay={ci * 0.08}>
                <GlassCard
                  className="overflow-hidden border-[hsl(var(--cyan)/0.35)] bg-[linear-gradient(135deg,hsl(var(--cyan)/0.08),transparent_58%,hsl(var(--violet)/0.08))] p-5"
                  interactive={false}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Image
                        src={certification.badge}
                        alt={`${certification.name} certification badge`}
                        width={160}
                        height={160}
                        className="h-20 w-20 shrink-0 rounded-md object-contain"
                      />
                      <div className="min-w-0">
                        <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--cyan)/0.3)] bg-[hsl(var(--cyan)/0.1)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--cyan))]">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          AWS Certified
                        </span>
                        <h4 className="font-display text-base font-semibold leading-snug">
                          {certification.name}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {certification.issuer}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md border border-[hsl(var(--violet)/0.3)] bg-[hsl(var(--violet)/0.1)] px-2.5 py-1.5 font-mono text-xs font-semibold text-[hsl(var(--violet))]">
                      {certification.exam}
                    </span>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Associated skills">
                    {certification.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] text-muted-foreground"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <div className="space-y-4">
            {certifications.map((group, gi) => (
              <Reveal key={group.issuer} delay={gi * 0.08}>
                <GlassCard className="overflow-hidden p-0" interactive={false}>
                  <div className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
                    <span className="font-display text-sm font-semibold tracking-tight">
                      {group.issuer}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {String(group.items.length).padStart(2, '0')} programs
                    </span>
                  </div>
                  <ul className="divide-y divide-[hsl(var(--hairline))]">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-[hsl(var(--cyan)/0.06)]"
                      >
                        <BadgeCheck className="h-4 w-4 shrink-0 text-[hsl(var(--cyan)/0.8)]" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
