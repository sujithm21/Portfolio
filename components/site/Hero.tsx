import type { CSSProperties } from 'react';
import { ArrowDown, Code, Download, Mail } from 'lucide-react';
import { agents } from '@/lib/agents';
import { primaryResume, profile, stackTicker, stats } from '@/lib/data';
import CountUp from './CountUp';
import { GitHubIcon, LinkedInIcon } from './icons';
import { AgentCursor, b, Kinetic } from './ui';

const socials = [
  { label: 'GitHub', href: profile.socials.github, icon: GitHubIcon },
  { label: 'LinkedIn', href: profile.socials.linkedin, icon: LinkedInIcon },
  { label: 'LeetCode', href: profile.socials.leetcode, icon: Code },
  { label: 'Email', href: `mailto:${profile.email}`, icon: Mail },
];

function Ticker() {
  // Two identical tracks, each sliding one full width, make a seamless loop.
  return [0, 1].map((copy) => (
    <ul key={copy} className="marquee__track" aria-hidden={copy === 1}>
      {stackTicker.map((item) => (
        <li key={item} className="flex items-center gap-11 font-mono text-[13px] text-ink-faint">
          {item}
          <span className="size-1 rotate-45 bg-line-strong" />
        </li>
      ))}
    </ul>
  ));
}

/**
 * Every element tagged with data-b-hero is drawn by an agent cursor on a first
 * visit, in that order. The two highlighted words are then "selected" by the
 * agents whose cursors stay parked beside them.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-x-clip pt-28 pb-10"
    >
      <div className="hero-glow" aria-hidden="true" />

      <div className="wrap flex flex-col items-center text-center">
        <p {...b('hero/status', 2)} data-b-hero="2" className="status">
          <span className="pulse" />
          {profile.availability}
        </p>

        <h1
          {...b('hero/name', 3)}
          data-b-hero="3"
          className="mt-7 font-mono text-[13px] font-medium tracking-[0.16em] text-ink-soft uppercase"
        >
          {profile.name} <span className="text-select">/</span> {profile.role}
        </h1>

        <p className="display mt-4">
          <span {...b('hero/headline-1', 4)} data-b-hero="4" className="block">
            <Kinetic text="AI agents that" />
            <mark className="sel word" data-agent="planner" style={{ '--w': 3 } as CSSProperties}>
              think.
              <AgentCursor agent="planner" className="parked" data-pos="top" />
            </mark>
          </span>
          <span {...b('hero/headline-2', 5)} data-b-hero="5" className="mt-1 block">
            <Kinetic text="Cloud that doesn’t" from={2} />
            <mark className="sel word" data-agent="deployer" style={{ '--w': 5 } as CSSProperties}>
              blink.
              <AgentCursor agent="deployer" className="parked" data-pos="bottom" />
            </mark>
          </span>
        </p>

        <p
          {...b('hero/intro', 6)}
          data-b-hero="6"
          className="mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-ink-soft sm:text-xl sm:leading-relaxed"
        >
          {profile.tagline}
        </p>

        <div
          {...b('hero/actions', 7)}
          data-b-hero="7"
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#projects" data-magnetic className="btn btn-primary group h-12 px-6">
            See the work
            <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
          <a href={primaryResume} download data-magnetic className="btn btn-ghost h-12 px-6">
            <Download className="size-4" />
            Download résumé
          </a>
          <span className="mx-1 hidden h-6 w-px bg-line-strong sm:block" />
          <div className="flex gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={social.label}
                data-magnetic
                className="icon-btn size-12"
              >
                <social.icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <dl className="wrap mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            {...b(`hero/metric-${i + 1}`, 8 + i)}
            data-b-hero={8 + i}
            data-frame={`metric-${i + 1}`}
            data-agent={agents[(i * 2) % agents.length].id}
            data-tilt
            className="card selectable flex flex-col p-5 sm:p-6"
          >
            <dt className="order-2 mt-3 text-sm leading-snug font-medium">{stat.label}</dt>
            <dd className="stat-number order-1 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              {stat.display ?? (
                <CountUp
                  value={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              )}
            </dd>
            <dd className="order-3 mt-1.5 font-mono text-[11px] leading-snug text-ink-faint">
              {stat.hint}
            </dd>
          </div>
        ))}
      </dl>

      <div {...b('hero/stack', 12)} data-b-hero="12" className="marquee mt-12">
        <Ticker />
      </div>
    </section>
  );
}
