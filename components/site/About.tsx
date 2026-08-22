'use client';

import { Bot, Cloud, GraduationCap, LineChart, ShieldCheck } from 'lucide-react';
import { education, profile } from '@/lib/data';
import { GlassCard, Reveal, Section, SectionHeading } from './primitives';

const pillars = [
  {
    icon: Bot,
    title: 'Agentic AI systems',
    body: 'Multi-agent orchestration, MCP tooling and A2A messaging — with evaluation and guardrails baked in, not bolted on.',
    tone: 'violet',
  },
  {
    icon: Cloud,
    title: 'Cloud infrastructure',
    body: 'AWS CDK and Infrastructure-as-Code for contact-center platforms — repeatable, reviewable, multi-region by default.',
    tone: 'cyan',
  },
  {
    icon: ShieldCheck,
    title: 'Reliability engineering',
    body: 'Disaster recovery, automated failover, alerting and observability that keeps production honest.',
    tone: 'emerald',
  },
  {
    icon: LineChart,
    title: 'Data platforms',
    body: 'Governed Medallion Lakehouses on Microsoft Fabric feeding real-time analytics and Power BI.',
    tone: 'cyan',
  },
];

export default function About() {
  return (
    <Section id="about">
      <SectionHeading
        index="01"
        kicker="About"
        title={
          <>
            Applied AI, running on <span className="accent-text">infrastructure I own</span>
          </>
        }
      />

      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          {profile.summary.map((para, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="mb-5 text-base leading-[1.75] text-muted-foreground text-pretty sm:text-[1.0625rem]">
                {para}
              </p>
            </Reveal>
          ))}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={0.1 + i * 0.07}>
                <GlassCard className="h-full p-5">
                  <span
                    className="mb-3 grid h-10 w-10 place-items-center rounded-md"
                    style={{
                      background: `hsl(var(--${pillar.tone}) / 0.12)`,
                      border: `1px solid hsl(var(--${pillar.tone}) / 0.28)`,
                      color: `hsl(var(--${pillar.tone}))`,
                    }}
                  >
                    <pillar.icon className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="font-display text-[15px] font-semibold">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Reveal delay={0.12}>
            <GlassCard className="overflow-hidden p-0">
              <div className="border-b border-hairline px-6 py-4">
                <p className="kicker">Education</p>
              </div>
              <div className="p-6">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-md border border-[hsl(var(--cyan)/0.28)] bg-[hsl(var(--cyan)/0.1)] text-[hsl(var(--cyan))]">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold leading-snug">
                  {education.institution}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{education.degree}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                  <span>{education.period}</span>
                  <span className="rounded-full border border-[hsl(var(--emerald)/0.3)] bg-[hsl(var(--emerald)/0.1)] px-2 py-0.5 text-[hsl(var(--emerald))]">
                    {education.score}
                  </span>
                </div>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.18}>
            <GlassCard className="p-6" interactive={false}>
              <p className="kicker mb-4">Beyond the terminal</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Outside work I read widely, play badminton, and sing — music has been the constant
                counterweight to engineering for as long as I have been writing code.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
