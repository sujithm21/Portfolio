import {
  Brain,
  Cloud,
  Code,
  Database,
  Layers,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { agents } from '@/lib/agents';
import { skillBuckets } from '@/lib/data';
import { slugify } from '@/lib/utils';
import { b, IconTile, Section } from './ui';

const icons = {
  brain: Brain,
  sparkles: Sparkles,
  cloud: Cloud,
  shield: ShieldCheck,
  server: Server,
  database: Database,
  layers: Layers,
  code: Code,
  wrench: Wrench,
} as const;

export default function Skills() {
  return (
    <Section
      id="skills"
      index="04"
      label="Technical Skills"
      title="The *toolkit.*"
      intro="Everything here has shipped or been published, grouped the way I actually reach for it."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillBuckets.map((bucket, i) => {
          const Icon = icons[bucket.icon as keyof typeof icons];
          const slug = slugify(bucket.name);
          return (
            <div
              key={bucket.name}
              {...b(`skills/${slug}`, i % 3)}
              data-frame={`skills/${slug}`}
              data-tilt
              className="card selectable p-6"
            >
              <div className="flex items-center gap-3.5">
                <IconTile agent={agents[i % agents.length].id}>
                  <Icon className="size-5" />
                </IconTile>
                <h3 className="font-semibold tracking-tight">{bucket.name}</h3>
                <span className="ml-auto font-mono text-xs text-ink-faint">
                  {String(bucket.items.length).padStart(2, '0')}
                </span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {bucket.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
