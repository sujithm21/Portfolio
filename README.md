# Sujith Makam — Portfolio

Personal site of **Sujith Makam**, AI & Cloud Engineer. A single-page portfolio styled as a
design-tool canvas: every time it loads, a crew of agent cursors draws the page in front of
you, section by section.

**Live site:** https://sujithmakam.vercel.app

## Highlights

- **Built by cursors.** Eight named agents (Planner, Researcher, Architect, Designer, Builder,
  Reviewer, QA, Deployer) drag out a glowing frame for each block while a swarm of smaller
  cursors rushes in to help. They draw the hero first, then keep working down the page as you
  scroll. Each block is drawn once per load; reload, or use "Replay the build" in the footer,
  to watch it again. Skip (or Escape) ends it at once.
- **A live agent log.** A small console shows which agent is drawing which block, with a
  progress bar.
- **An agent loop you can watch.** An animated graph and trace show how an agent run flows
  from orchestrator to specialists, guardrails and a human approval gate.
- **A background that reacts.** Drifting colour washes, a dot grid, and a mesh of bubbles that
  the pointer pushes around.
- **Motion everywhere.** Headings arrive word by word, labels decode themselves, cards lean
  towards the pointer, buttons are magnetic, About text lights up as you scroll through it,
  and bands of oversized words speed up and lean with your scroll speed.
- **Fully static and safe to turn off.** Every section is rendered to HTML at build time. The
  content is readable with JavaScript disabled, and nothing animates for visitors who prefer
  reduced motion.
- **One content file.** All text, links and numbers live in [`lib/data.ts`](lib/data.ts).
- **Light and dark themes**, light by default, with a circular reveal when you switch.

## Tech stack

| Layer     | Choice                                                                               |
| --------- | ------------------------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, static export) with React 19                                 |
| Language  | TypeScript                                                                           |
| Styling   | Tailwind CSS 4, design tokens as CSS variables                                       |
| Motion    | Web Animations API, CSS scroll-driven animations, View Transitions, one small canvas |
| Scrolling | Lenis                                                                                |
| Icons     | lucide-react                                                                         |
| Fonts     | Geist Sans and Geist Mono, Instrument Serif italic for accents                       |
| Tooling   | ESLint 9, Prettier with the Tailwind class-sorting plugin                            |
| Hosting   | Vercel                                                                               |

There is no animation library. Cursor movement and reveals only animate `transform` and
`opacity`, so they stay off the main thread.

## Getting started

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/sujithm21/Portfolio.git
cd Portfolio
npm install
npm run dev
```

The site runs at http://localhost:3000.

## Scripts

| Command                | What it does                           |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start the dev server                   |
| `npm run build`        | Build the static site into `out/`      |
| `npm run preview`      | Serve the built `out/` folder locally  |
| `npm run lint`         | Run ESLint                             |
| `npm run typecheck`    | Type-check with `tsc --noEmit`         |
| `npm run format`       | Format every file with Prettier        |
| `npm run format:check` | Check formatting without writing files |

## Project structure

```
app/
  layout.tsx             Fonts, metadata, and the inline script that sets the build mode
  page.tsx               Section order
  globals.css            Design tokens and component styles
  fonts/                 Instrument Serif italic (bundled)
components/
  build/
    BuildDirector.tsx    Runs the cursor build and the agent log
  site/
    Nav.tsx              Floating nav, scrollspy, scroll progress, résumé menu, mobile menu
    Hero.tsx             Headline, actions, headline numbers, stack ticker
    About.tsx · Experience.tsx · Projects.tsx · Skills.tsx
    Research.tsx · Credentials.tsx · Contact.tsx · Footer.tsx
    AgentLoop.tsx        Animated agent-run graph and trace
    VelocityMarquee.tsx  Bands of oversized words driven by scroll speed
    Backdrop.tsx         Colour washes and the dot grid
    Bubbles.tsx          Pointer-reactive bubble mesh (canvas)
    Pointer.tsx          "You" tag, card tilt and magnetic buttons
    Scramble.tsx         Text that decodes itself
    ui.tsx               Section, Kinetic headings, Rich text, AgentCursor, `b()` helper
    ThemeToggle.tsx · CountUp.tsx · ReplayButton.tsx · SmoothScroll.tsx
lib/
  data.ts                All site content
  agents.ts              The cursor crew
  build.ts               Build engine: crew, cursors, frames and the swarm
  utils.ts               Small helpers
public/
  resume/                Résumé PDFs
  *.png                  Certification badges
```

## Editing content

Everything shown on the site comes from [`lib/data.ts`](lib/data.ts). Edit that file and the
matching section updates. Wrap a phrase in `**double asterisks**` to emphasise it in the
About and Experience text. In section titles, `*single asterisks*` mark the accent words.

| Export                                                     | Used for                            |
| ---------------------------------------------------------- | ----------------------------------- |
| `profile`, `stats`, `stackTicker`                          | Hero copy, headline numbers, ticker |
| `pillars`, `education`, `beyondWork`                       | About section                       |
| `experience`                                               | Work history                        |
| `projects`, `projectCategories`                            | Project cards and their filters     |
| `skillBuckets`                                             | Grouped skills                      |
| `publications`                                             | Research papers                     |
| `featuredCertifications`, `certifications`, `achievements` | Credentials section                 |
| `marqueeRows`, `marqueePlatforms`, `marqueeClosing`        | The three scrolling word bands      |
| `resumeVariants`, `primaryResume`                          | Résumé downloads                    |
| `navSections`                                              | Nav links and scrollspy targets     |

### Updating a résumé

Replace the PDF in `public/resume/` and keep the same filename. To add a version, drop in a
new PDF and add an entry to `resumeVariants`.

## How the cursor build works

1. An inline script in `app/layout.tsx` runs before first paint and sets `html[data-build]`
   to `first`, or to `off` for visitors who prefer reduced motion.
2. Any element tagged with `data-b` starts hidden. The `b('name')` helper in
   `components/site/ui.tsx` adds the attribute.
3. `BuildDirector` creates a `Crew` (see `lib/build.ts`): a pool of agent cursors sharing a
   queue of blocks. Hero elements carry `data-b-hero="<order>"` and are queued first. Every
   other block joins the queue when it scrolls into view.
4. For each block, an agent drags a frame from corner to corner, the block fades in, and a
   swarm of small cursors flies in, clicks and leaves.
5. If the crew cannot reach a block within about a second (fast scrolling), the block simply
   appears, so content is never held back.
6. Skip sets the mode to `return`: whatever is left fades in on scroll with no cursors.

To make a new element part of the build, spread `{...b('section/name')}` onto it. To change
the crew, edit `lib/agents.ts` and the matching `[data-agent]` colours in `globals.css`.

## Deployment

The site deploys to Vercel on every push to `main`. `npm run build` writes a static export to
`out/`, which any static host can serve.

Set `NEXT_PUBLIC_SITE_URL` to override the canonical URL used in metadata. It defaults to
`https://sujithmakam.vercel.app`.

## Notes

- The contact form has no backend. It opens the visitor's mail app with a pre-filled message.
  Swap in a service such as Formspree or Resend for direct inbox delivery.
- The agent-loop trace is a simulation, labelled as such on the page.
- On a network that inspects HTTPS traffic, `npm install` can fail with
  `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`. Running it with `NODE_OPTIONS=--use-system-ca` makes
  Node trust the operating system's certificate store.

## Contact

- GitHub: [sujithm21](https://github.com/sujithm21)
- LinkedIn: [makamsujith](https://www.linkedin.com/in/makamsujith/)
