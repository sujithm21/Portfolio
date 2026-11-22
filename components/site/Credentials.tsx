import Image from 'next/image';
import { Check, Medal, Microscope, Star, Trophy } from 'lucide-react';
import { achievements, certifications, featuredCertifications } from '@/lib/data';
import { slugify } from '@/lib/utils';
import { b, Section } from './ui';

const icons = { trophy: Trophy, microscope: Microscope, medal: Medal, star: Star } as const;

export default function Credentials() {
  return (
    <Section
      id="credentials"
      index="06"
      label="Certifications & Achievements"
      title="Badges, courses and *awards.*"
      intro="Certifications earned and moments that mattered along the way."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {featuredCertifications.map((cert, i) => (
            <div
              key={cert.name}
              {...b(`credentials/${slugify(cert.name)}`, i)}
              data-frame={`cert/${slugify(cert.name)}`}
              data-tilt
              className="card selectable flex items-center gap-5 p-5"
            >
              <Image
                src={cert.badge}
                alt={`${cert.name} badge`}
                width={84}
                height={84}
                className="size-[84px] shrink-0"
              />
              <div>
                <p className="eyebrow">{cert.issuer}</p>
                <h3 className="mt-1.5 text-lg leading-snug font-semibold tracking-tight">
                  {cert.name}
                </h3>
                <p className="mt-2">
                  <span className="tag">{cert.exam}</span>
                </p>
              </div>
            </div>
          ))}

          <div {...b('credentials/courses', 2)} className="card p-6">
            {certifications.map((group) => (
              <div key={group.issuer} className="not-first:mt-6">
                <p className="eyebrow">
                  {group.issuer} · {group.items.length}
                </p>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                      <Check className="mt-0.5 size-4 shrink-0 text-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <ol className="space-y-4 lg:col-span-7">
          {achievements.map((item, i) => {
            const Icon = icons[item.icon as keyof typeof icons];
            return (
              <li
                key={item.title}
                {...b(`credentials/achievement-${i + 1}`, i)}
                data-frame={`achievement-${i + 1}`}
                data-tilt
                className="card selectable flex gap-5 p-6"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line-strong bg-raised text-amber">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg leading-snug font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs text-ink-faint">{item.year}</span>
                  </div>
                  <p className="mt-2 leading-relaxed text-pretty text-ink-soft">{item.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
