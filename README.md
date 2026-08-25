# Sujith Makam — Portfolio

Personal site for **Sujith Makam**, AI & Cloud Engineer. Single-page, dark-first, statically
exported and deployed on Vercel.

**Live:** https://sujithmakam.vercel.app  
**Repo:** https://github.com/sujithm21/Portfolio

---

## Stack

| Layer      | Choice                                                            |
| ---------- | ----------------------------------------------------------------- |
| Framework  | Next.js 13 (App Router, `output: 'export'` → fully static)          |
| Styling    | Tailwind CSS with an HSL design-token palette (light + dark)        |
| Motion     | Framer Motion (scroll reveals, layout transitions, shared nav pill) |
| Background | Hand-rolled `<canvas>` neural mesh — no 3D or particle libraries    |
| Icons      | lucide-react                                                        |
| Fonts      | Space Grotesk (display) · Inter (body) · JetBrains Mono (accents)   |

Everything renders to static HTML at build time, so the full résumé content is in the initial
payload for SEO and works with JS disabled.

## Content model

All site content lives in **[`lib/data.ts`](lib/data.ts)** — one file, typed, no CMS. Edit that
file and every section updates. Buckets:

- `profile` · `stats` — identity, contact links, headline metrics
- `experience` — CGI, IISc Bangalore
- `projects` — tagged into `Agentic AI` / `Cloud & IaC` / `Data & Analytics` / `ML & Research` / `Full-Stack`
- `skillBuckets` — nine grouped capability sets
- `publications` — four IEEE papers
- `certifications` · `achievements` · `education`
- `resumeVariants` — role-specific PDFs served from `public/resume/`

## Résumés

`public/resume/` holds the downloadable PDFs. `Sujith_Makam_Resume.pdf` is the default the nav
button serves; the dropdown offers two role-targeted variants (Cloud & AI, AI Developer).
To refresh one, drop a new PDF in with the same filename.

## Structure

```
app/
  layout.tsx          fonts, metadata, theme provider
  page.tsx            section composition
  globals.css         design tokens + component classes
components/site/
  NeuralField.tsx     animated canvas background
  primitives.tsx      Reveal, Section, SectionHeading, GlassCard, Pill, spotlight
  Nav.tsx             sticky nav, scrollspy, résumé menu, theme toggle, mobile sheet
  Hero.tsx            headline, typewriter, stack panel, animated metrics
  About / Experience / Projects / Skills / Research / Credentials / Contact / Footer
lib/data.ts           all content
public/resume/        résumé PDFs
```

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → out/
```

## Notes

- Dark mode is the default and intended look; the toggle switches to a light palette.
- The contact form is client-only (static export has no backend) — it composes a `mailto:`
  with the visitor's message. Swap in Formspree/Resend if you want inbox delivery without
  the user's mail client.
- Motion respects `prefers-reduced-motion`; the canvas renders a single static frame and
  pauses entirely when the tab is hidden.
