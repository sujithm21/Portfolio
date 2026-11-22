/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site is fully static: `next build` writes plain HTML/CSS/JS to `out/`.
  output: 'export',
  images: { unoptimized: true },
  // Do not write an AGENTS.md into the repo when the dev server starts.
  agentRules: false,
};

export default nextConfig;
