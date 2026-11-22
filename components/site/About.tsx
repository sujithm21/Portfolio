import { Bot, ChartLine, Cloud, GraduationCap, ShieldCheck } from 'lucide-react';
import type { AgentId } from '@/lib/agents';
import { beyondWork, education, pillars, profile } from '@/lib/data';
import { b, IconTile, Rich, Section } from './ui';

const pillarIcons = { bot: Bot, cloud: Cloud, shield: ShieldCheck, chart: ChartLine } as const;

export default function About() {
  return (
    <Section
      id="about"
      index="01"
      label="About"
      title="LLM, agentic and GenAI systems, *in production.*"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-6 lg:col-span-7">
          {profile.summary.map((paragraph, i) => (
            <p
              key={i}
              {...b(`about/summary-${i + 1}`, i)}
              className="scrub text-xl leading-relaxed text-pretty text-ink-soft sm:text-[1.4rem] sm:leading-[1.6]"
            >
              <Rich text={paragraph} scrub />
            </p>
          ))}
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div
            {...b('about/education', 1)}
            data-frame="about/education"
            className="card selectable p-6"
          >
            <div className="flex items-start gap-4">
              <IconTile agent="builder">
                <GraduationCap className="size-5" />
              </IconTile>
              <div>
                <p className="eyebrow">Education</p>
                <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight">
                  {education.institution}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">{education.degree}</p>
                <p className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs text-ink-faint">
                  {education.period}
                  <span className="tag">{education.score}</span>
                </p>
              </div>
            </div>
          </div>

          <div {...b('about/now', 2)} data-frame="about/now" className="card selectable p-6">
            <p className="eyebrow">Right now</p>
            <p className="mt-2 text-lg font-semibold tracking-tight">{profile.currently}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              Building enterprise agentic-AI platforms and the AWS infrastructure underneath them,
              from {profile.location}.
            </p>
          </div>

          <div {...b('about/beyond', 3)} data-frame="about/beyond" className="card selectable p-6">
            <p className="eyebrow">Beyond the terminal</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{beyondWork}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, i) => {
          const Icon = pillarIcons[pillar.icon as keyof typeof pillarIcons];
          return (
            <div
              key={pillar.title}
              {...b(`about/pillar-${i + 1}`, i)}
              data-frame={`pillar-${i + 1}`}
              data-tilt
              className="card selectable p-6"
            >
              <IconTile agent={pillar.agent as AgentId}>
                <Icon className="size-5" />
              </IconTile>
              <h3 className="mt-5 font-semibold tracking-tight">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{pillar.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
