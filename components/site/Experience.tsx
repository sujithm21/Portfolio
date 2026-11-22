import { MapPin } from 'lucide-react';
import { experience } from '@/lib/data';
import { slugify } from '@/lib/utils';
import { b, Rich, Section } from './ui';

export default function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      label="Experience"
      title="Where the work *shipped.*"
      intro="Enterprise AI platforms running in production, and research into how models actually execute."
    >
      <div className="space-y-5">
        {experience.map((job, i) => {
          const slug = slugify(job.company.split(' (')[0]);
          return (
            <article
              key={job.company}
              {...b(`experience/${slug}`, i)}
              data-frame={`experience/${slug}`}
              className="card selectable grid gap-8 p-6 sm:p-9 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-5">
                <p className="eyebrow">{job.period}</p>
                <h3 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.035em]">
                  {job.company}
                </h3>
                <p className="mt-2 text-ink-soft">
                  {job.role} · {job.kind}
                </p>
                <p className="serif grad-text mt-7 text-2xl leading-snug sm:text-[1.7rem]">
                  {job.headline}
                </p>
                <p className="mt-7 flex items-center gap-1.5 font-mono text-xs text-ink-faint">
                  <MapPin className="size-3.5" />
                  {job.location}
                </p>
              </div>

              <div className="lg:col-span-7">
                <ul className="space-y-4">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="relative pl-7 leading-relaxed text-ink-soft before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-3.5 before:bg-select"
                    >
                      <Rich text={point} />
                    </li>
                  ))}
                </ul>
                <ul className="mt-8 flex flex-wrap gap-1.5">
                  {job.stack.map((item) => (
                    <li key={item} className="tag">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
