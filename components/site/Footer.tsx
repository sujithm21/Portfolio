import type { CSSProperties } from 'react';
import { ArrowUp } from 'lucide-react';
import { agents } from '@/lib/agents';
import { navSections, profile } from '@/lib/data';
import ReplayButton from './ReplayButton';

export default function Footer() {
  return (
    <footer className="overflow-x-clip border-t border-line">
      <div className="wrap flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-ink-soft">
            {profile.role} · {profile.location}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
            {navSections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="transition-colors hover:text-ink">
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2.5">
          <ReplayButton />
          <a href="#top" aria-label="Back to top" data-magnetic className="icon-btn">
            <ArrowUp className="size-[18px]" />
          </a>
        </div>
      </div>

      {/* Oversized name: each letter lifts and fills in an agent colour on hover. */}
      <p className="wrap wordmark" aria-label={profile.name}>
        {profile.name.split('').map((letter, i) => (
          <span
            key={i}
            aria-hidden="true"
            data-agent={agents[i % agents.length].id}
            style={{ '--n': i } as CSSProperties}
          >
            {letter === ' ' ? ' ' : letter}
          </span>
        ))}
      </p>

      <div className="wrap">
        <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}. Drawn on a canvas, assembled by{' '}
            {agents.length} agents.
          </p>
          <ul className="flex items-center gap-1.5" aria-label="Build crew">
            {agents.map((agent) => (
              <li
                key={agent.id}
                data-agent={agent.id}
                title={agent.name}
                className="size-2.5 rounded-full bg-agent"
              />
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
