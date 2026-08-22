'use client';

import { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { primaryResume, profile } from '@/lib/data';
import { GlassCard, Reveal, Section, SectionHeading } from './primitives';
import { cn } from '@/lib/utils';

const channels = [
  {
    icon: Mail,
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    tone: 'cyan',
    wide: true,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, '')}`,
    tone: 'emerald',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: '/in/makamsujith',
    href: profile.socials.linkedin,
    tone: 'cyan',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: '@sujithm21',
    href: profile.socials.github,
    tone: 'violet',
  },
  {
    icon: Code2,
    label: 'LeetCode',
    value: '@msujith21',
    href: profile.socials.leetcode,
    tone: 'violet',
  },
  {
    icon: MapPin,
    label: 'Based in',
    value: profile.location,
    tone: 'emerald',
  },
];

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [touched, setTouched] = useState(false);

  const valid =
    form.name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.message.trim().length > 9;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;

    // Static site — hand the message off to the visitor's mail client.
    const subject = form.subject.trim() || `Hello from ${form.name}`;
    const body = `${form.message}\n\n—\n${form.name}\n${form.email}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    'w-full rounded-md border border-hairline bg-background/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-[hsl(var(--cyan)/0.55)] focus:bg-background/80';

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="kicker mb-2 block">
            Name
          </label>
          <input
            id="name"
            className={field}
            placeholder="Ada Lovelace"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email" className="kicker mb-2 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={field}
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="kicker mb-2 block">
          Subject <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="subject"
          className={field}
          placeholder="Role, project or collaboration"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="message" className="kicker mb-2 block">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className={cn(field, 'resize-none')}
          placeholder="Tell me what you are building…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {touched && !valid && (
        <p className="font-mono text-xs text-[hsl(var(--destructive))]">
          Add your name, a valid email and a message of at least 10 characters.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-[hsl(var(--background))] shadow-glow transition-transform duration-300 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(100deg, hsl(var(--cyan)), hsl(var(--violet)))' }}
        >
          <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          Send message
        </button>
        <span className="font-mono text-[11px] text-muted-foreground">
          opens your mail client
        </span>
      </div>
    </form>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto links still work */
    }
  };

  return (
    <Section id="contact">
      <SectionHeading
        index="07"
        kicker="Contact"
        title={
          <>
            Let us build something <span className="accent-text">that ships</span>
          </>
        }
        intro="Open to AI and cloud engineering roles, and always happy to talk about agentic systems, IaC or reliability."
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <GlassCard className="h-full p-6 sm:p-8" interactive={false}>
            <ContactForm />
          </GlassCard>
        </Reveal>

        <div className="space-y-5">
          <Reveal delay={0.08}>
            <GlassCard className="p-6 sm:p-7">
              <p className="kicker mb-4">Direct channels</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {channels.map((channel) => {
                  const inner = (
                    <>
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md"
                        style={{
                          background: `hsl(var(--${channel.tone}) / 0.12)`,
                          border: `1px solid hsl(var(--${channel.tone}) / 0.26)`,
                          color: `hsl(var(--${channel.tone}))`,
                        }}
                      >
                        <channel.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          {channel.label}
                        </span>
                        <span className="block truncate text-sm">{channel.value}</span>
                      </span>
                      {channel.href && (
                        <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </>
                  );

                  const className = cn(
                    'group flex items-center gap-3 rounded-md border border-hairline bg-secondary/30 p-3 transition-colors hover:border-[hsl(var(--cyan)/0.4)] hover:bg-[hsl(var(--cyan)/0.06)]',
                    'wide' in channel && channel.wide && 'sm:col-span-2'
                  );

                  return channel.href ? (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target={channel.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className={className}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={channel.label} className={className}>
                      {inner}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2.5 text-sm transition-colors hover:border-[hsl(var(--cyan)/0.5)]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[hsl(var(--emerald))]" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy email
                    </>
                  )}
                </button>
                <a
                  href={primaryResume}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--cyan)/0.35)] bg-[hsl(var(--cyan)/0.08)] px-4 py-2.5 text-sm transition-colors hover:bg-[hsl(var(--cyan)/0.16)]"
                >
                  <Download className="h-3.5 w-3.5 text-[hsl(var(--cyan))]" />
                  Download resume
                </a>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.14}>
            <GlassCard className="relative overflow-hidden p-6 sm:p-7">
              <div
                aria-hidden
                className="aurora animate-float-b right-[-30%] top-[-60%] h-[240px] w-[240px]"
                style={{ background: 'hsl(var(--violet) / 0.35)' }}
              />
              <p className="kicker mb-3">Currently</p>
              <p className="font-display text-xl font-semibold leading-snug">
                Software Engineer at CGI, Bengaluru
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Building enterprise agentic-AI platforms and the AWS infrastructure underneath them.
                {' '}
                {profile.availability}.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
