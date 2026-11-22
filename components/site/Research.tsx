import { ArrowUpRight } from 'lucide-react';
import { publications } from '@/lib/data';
import { b, Section } from './ui';

export default function Research() {
  return (
    <Section
      id="research"
      index="05"
      label="Publications"
      title="Peer-reviewed, *four times.*"
      intro="IEEE papers across federated learning, IoT security and applied machine learning."
    >
      <ol className="border-t border-line">
        {publications.map((paper, i) => (
          <li key={paper.url} {...b(`research/paper-${i + 1}`, i)} className="border-b border-line">
            <a
              href={paper.url}
              target="_blank"
              rel="noreferrer"
              className="group grid gap-4 rounded-2xl px-1 py-8 transition-colors duration-300 hover:bg-surface sm:px-5 md:grid-cols-[150px_minmax(0,1fr)_auto] md:gap-10"
            >
              <p className="font-mono text-sm">
                {paper.venue}
                <span className="mt-1 block text-xs text-ink-faint">{paper.year}</span>
              </p>
              <div>
                <h3 className="text-xl leading-snug font-semibold tracking-[-0.025em] text-balance transition-colors duration-300 group-hover:text-select sm:text-2xl">
                  {paper.title}
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-pretty text-ink-soft">
                  {paper.summary}
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {paper.topics.map((topic) => (
                    <li key={topic} className="tag">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="icon-btn hidden transition-all duration-300 ease-out-quint group-hover:border-select group-hover:bg-select group-hover:text-white md:grid">
                <ArrowUpRight className="size-[18px] transition-transform duration-300 ease-out-quint group-hover:rotate-45" />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </Section>
  );
}
