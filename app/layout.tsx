import './globals.css';
import 'lenis/dist/lenis.css';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import Backdrop from '@/components/site/Backdrop';
import Pointer from '@/components/site/Pointer';
import BuildDirector from '@/components/build/BuildDirector';
import SmoothScroll from '@/components/site/SmoothScroll';
import { education, featuredCertifications, profile, skillBuckets } from '@/lib/data';

// Italic serif used for the accent words in headings. Bundled locally so the
// build never depends on a font CDN.
const instrumentSerif = localFont({
  src: './fonts/InstrumentSerif-Italic.woff2',
  variable: '--font-instrument-serif',
  weight: '400',
  style: 'italic',
  display: 'swap',
});

// Pinned to the production domain so canonical/OG URLs never point at a
// per-deployment hostname.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sujithmakam.vercel.app';

const title = `${profile.name} — ${profile.role}`;
const description =
  'Sujith Makam is an AI Engineer and Cloud Engineer who builds and ships LLM, agentic and generative-AI systems into production on Azure and AWS. 4 IEEE publications in ML and network security.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${profile.name}` },
  description,
  keywords: [
    'Sujith Makam',
    'AI Engineer',
    'Cloud Engineer',
    'Agentic AI',
    'Generative AI',
    'Conversational AI',
    'LLM',
    'AWS CDK',
    'Azure AI Foundry',
    'Amazon Bedrock',
    'Cognigy',
    'RAG',
    'Multi-Agent Systems',
    'Infrastructure as Code',
    'Bengaluru',
  ],
  authors: [{ name: profile.name, url: profile.socials.github }],
  creator: profile.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title,
    description,
    siteName: `${profile.name} · Portfolio`,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true },
};

/** Machine-readable profile (schema.org Person) for search engines and parsers. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  description,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
  worksFor: { '@type': 'Organization', name: 'CGI' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: education.institution },
  sameAs: Object.values(profile.socials),
  knowsAbout: Array.from(new Set(skillBuckets.flatMap((bucket) => bucket.items))),
  hasCredential: featuredCertifications.map((cert) => ({
    '@type': 'EducationalOccupationalCredential',
    name: cert.name,
    recognizedBy: { '@type': 'Organization', name: cert.issuer },
  })),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f5f1' },
    { media: '(prefers-color-scheme: dark)', color: '#08080a' },
  ],
};

/**
 * Runs before first paint. It applies the saved theme and sets the build mode:
 * "first" (the cursors build the page, on every load) or "off" (reduced
 * motion). If the page script never starts, it falls back to "off" so content
 * can never stay hidden.
 */
const bootScript = `(function(){var d=document.documentElement;try{if(localStorage.getItem('theme')==='light')d.classList.remove('dark')}catch(e){}d.dataset.build=matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'first';setTimeout(function(){if(!window.__buildReady)d.dataset.build='off'},4000)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll />
        <Backdrop />
        {children}
        <BuildDirector />
        <Pointer />
      </body>
    </html>
  );
}
