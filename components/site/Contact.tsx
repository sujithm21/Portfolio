'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, Code, Copy, Mail, MapPin, Phone, Send } from 'lucide-react';
import { profile } from '@/lib/data';
import { cn } from '@/lib/utils';
import { GitHubIcon, LinkedInIcon } from './icons';
import { b, Section } from './ui';

const channels = [
  {
    icon: Phone,
    label: 'Phone',
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, '')}`,
  },
  {
    icon: LinkedInIcon,
    label: 'LinkedIn',
    value: '/in/makamsujith',
    href: profile.socials.linkedin,
  },
  { icon: GitHubIcon, label: 'GitHub', value: '@sujithm21', href: profile.socials.github },
  { icon: Code, label: 'LeetCode', value: '@msujith21', href: profile.socials.leetcode },
  { icon: MapPin, label: 'Based in', value: profile.location },
];

const emptyForm = { name: '', email: '', subject: '', message: '' };

function ContactForm() {
  const [form, setForm] = useState(emptyForm);
  const [showErrors, setShowErrors] = useState(false);

  const valid =
    form.name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.message.trim().length > 9;

  const update =
    (key: keyof typeof emptyForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowErrors(true);
    if (!valid) return;

    // The site is static, so the message is handed to the visitor's mail client.
    const subject = form.subject.trim() || `Hello from ${form.name}`;
    const body = `${form.message}\n\n—\n${form.name}\n${form.email}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow mb-2 block">Name</span>
          <input
            className="field"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={form.name}
            onChange={update('name')}
          />
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block">Email</span>
          <input
            type="email"
            className="field"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={update('email')}
          />
        </label>
      </div>

      <label className="block">
        <span className="eyebrow mb-2 block">Subject (optional)</span>
        <input
          className="field"
          placeholder="Role, project or collaboration"
          value={form.subject}
          onChange={update('subject')}
        />
      </label>

      <label className="block">
        <span className="eyebrow mb-2 block">Message</span>
        <textarea
          rows={5}
          className="field resize-none"
          placeholder="Tell me what you are building…"
          value={form.message}
          onChange={update('message')}
        />
      </label>

      {showErrors && !valid && (
        <p role="alert" className="text-sm text-pink">
          Add your name, a valid email and a message of at least 10 characters.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" data-magnetic className="btn btn-primary group h-12 px-6">
          <Send className="size-4 transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          Send message
        </button>
        <span className="font-mono text-xs text-ink-faint">Opens your mail app</span>
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
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable: the mailto link next to this button still works.
    }
  };

  return (
    <Section
      id="contact"
      index="07"
      label="Contact"
      title="Let’s build something *that ships.*"
      intro="Open to AI and cloud engineering roles, and always up for a conversation about agentic systems, infrastructure-as-code or reliability."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <div {...b('contact/form')} className="card p-6 sm:p-8 lg:col-span-7">
          <ContactForm />
        </div>

        <div className="space-y-5 lg:col-span-5">
          <div
            {...b('contact/email', 1)}
            data-frame="contact/email"
            className="card selectable p-6"
          >
            <p className="eyebrow">Fastest way to reach me</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 flex items-center gap-2.5 text-lg font-semibold tracking-tight break-all transition-colors hover:text-select sm:text-xl"
            >
              <Mail className="size-5 shrink-0 text-select" />
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              data-cursor="Copy"
              className="btn btn-ghost mt-5 h-10 text-sm"
            >
              {copied ? <Check className="size-4 text-green" /> : <Copy className="size-4" />}
              {copied ? 'Copied' : 'Copy email'}
            </button>
          </div>

          <ul {...b('contact/channels', 2)} className="card divide-y divide-line px-2">
            {channels.map((channel) => {
              const row = (
                <>
                  <channel.icon className="size-[18px] shrink-0 text-ink-faint" />
                  <span className="eyebrow w-20 shrink-0">{channel.label}</span>
                  <span className="min-w-0 truncate text-sm font-medium">{channel.value}</span>
                  {channel.href && (
                    <ArrowUpRight className="ml-auto size-4 shrink-0 text-ink-faint transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-select" />
                  )}
                </>
              );
              const rowClass = 'group flex items-center gap-3.5 px-4 py-4';
              return (
                <li key={channel.label}>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      target={channel.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className={cn(rowClass, 'transition-colors hover:text-select')}
                    >
                      {row}
                    </a>
                  ) : (
                    <div className={rowClass}>{row}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
