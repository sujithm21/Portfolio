'use client';

import { ArrowUp, Code2, Github, Linkedin, Mail } from 'lucide-react';
import { navSections, profile } from '@/lib/data';

const marqueeItems = [
  'Agentic AI',
  'AWS CDK',
  'Azure AI Foundry',
  'RAG',
  'Multi-Agent Systems',
  'Infrastructure-as-Code',
  'Disaster Recovery',
  'Microsoft Fabric',
  'MCP',
  'Serverless',
  'Observability',
];

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-hairline">
      {/* tech marquee */}
      <div className="relative flex overflow-hidden border-b border-hairline py-4">
        <div className="flex shrink-0 animate-marquee gap-8 pr-8">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex shrink-0 items-center gap-8 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground/60"
            >
              {item}
              <span className="h-1 w-1 rounded-full bg-[hsl(var(--cyan)/0.6)]" />
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, hsl(var(--background)) 0%, transparent 12%, transparent 88%, hsl(var(--background)) 100%)',
          }}
        />
      </div>

      <div className="container py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[hsl(var(--cyan))] to-[hsl(var(--violet))] font-display text-sm font-bold text-[hsl(var(--background))]">
                SM
              </span>
              <span className="font-display text-base font-semibold">{profile.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {profile.role} in {profile.location}. Building agentic AI systems and the cloud
              infrastructure that keeps them running.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { href: profile.socials.github, icon: Github, label: 'GitHub' },
                { href: profile.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: profile.socials.leetcode, icon: Code2, label: 'LeetCode' },
                { href: `mailto:${profile.email}`, icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted-foreground transition-colors hover:border-[hsl(var(--cyan)/0.5)] hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-2">
            <div>
              <p className="kicker mb-3">Navigate</p>
              <ul className="space-y-2">
                {navSections.slice(0, 4).map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="kicker mb-3">More</p>
              <ul className="space-y-2">
                {navSections.slice(4).map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} {profile.name} · Built with Next.js, Tailwind CSS &
            Framer Motion
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-[hsl(var(--cyan)/0.5)] hover:text-foreground"
          >
            Back to top
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
