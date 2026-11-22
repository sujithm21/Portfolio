import { Fragment, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { agentById, CURSOR_PATH, type AgentId } from '@/lib/agents';
import { cn } from '@/lib/utils';
import Scramble from './Scramble';

/**
 * Registers an element with the build director (see lib/build.ts).
 * `name` shows up in the build log; `index` staggers siblings.
 */
export function b(name: string, index = 0) {
  return { 'data-b': name, style: { '--i': index } as CSSProperties };
}

type Token = { text: string; strong: boolean; index: number };

/** Split text into words, remembering which sit between `marker` pairs. */
function tokenize(text: string, marker: string) {
  const tokens: Token[] = [];
  text.split(marker).forEach((chunk, part) => {
    chunk
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => tokens.push({ text: word, strong: part % 2 === 1, index: tokens.length }));
  });
  return tokens;
}

/**
 * Renders text, turning **double-asterisk** spans into emphasised ones.
 * With `scrub`, each word starts dim and lights up as the paragraph scrolls
 * through the viewport (see `.scrub` in globals.css).
 */
export function Rich({ text, scrub = false }: { text: string; scrub?: boolean }) {
  if (!scrub) {
    return (
      <>
        {text.split('**').map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-medium text-ink">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </>
    );
  }

  const tokens = tokenize(text, '**');
  return (
    <>
      {tokens.map((token) => (
        <Fragment key={token.index}>
          <span
            className={cn('w', token.strong && 'font-medium text-ink')}
            style={{ '--k': (token.index / tokens.length).toFixed(3) } as CSSProperties}
          >
            {token.text}
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}

/**
 * A heading whose words rise into place one after another when it is revealed.
 * Wrap words in *single asterisks* to set them in the italic serif accent.
 */
export function Kinetic({ text, from = 0 }: { text: string; from?: number }) {
  return (
    <>
      {tokenize(text, '*').map((token) => (
        <Fragment key={token.index}>
          <span
            className={cn('word', token.strong && 'accent')}
            style={{ '--w': token.index + from } as CSSProperties}
          >
            {token.text}
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}

/** Colour of the soft glow behind each section heading, in page order. */
const glows = ['violet', 'blue', 'pink', 'amber', 'green', 'cyan', 'orange'];

type SectionProps = {
  id: string;
  index: string;
  label: string;
  /** Heading text; *asterisks* mark the accent words. */
  title: string;
  intro?: string;
  children: ReactNode;
};

export function Section({ id, index, label, title, intro, children }: SectionProps) {
  return (
    <section id={id} className="section" data-glow={glows[(Number(index) - 1) % glows.length]}>
      <div className="wrap">
        <header {...b(`${id}/heading`)} className="mb-12 max-w-3xl sm:mb-16">
          <p className="frame-label">
            <Scramble text={`${index} / ${label}`} />
          </p>
          <h2 className="h2 mt-5">
            <Kinetic text={title} />
          </h2>
          {intro && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-ink-soft">
              {intro}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}

type AgentCursorProps = { agent: AgentId } & HTMLAttributes<HTMLSpanElement>;

/** A named, coloured pointer — the same one the build crew uses. */
export function AgentCursor({ agent, className, ...rest }: AgentCursorProps) {
  return (
    <span className={cn('agent-cursor', className)} data-agent={agent} aria-hidden="true" {...rest}>
      <svg viewBox="0 0 20 20">
        <path d={CURSOR_PATH} />
      </svg>
      <span className="agent-cursor__tag" data-name={agentById(agent).name} />
    </span>
  );
}

/** Coloured icon tile used at the top of cards. */
export function IconTile({ agent, children }: { agent: AgentId; children: ReactNode }) {
  return (
    <span
      data-agent={agent}
      className="grid size-10 place-items-center rounded-xl border border-agent/30 bg-agent/10 text-agent"
    >
      {children}
    </span>
  );
}
