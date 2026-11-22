'use client';

import { ReactLenis } from 'lenis/react';

/**
 * Inertial page scrolling. Lenis drives the native scroll position, so sticky
 * elements, anchors and IntersectionObserver keep working. It turns itself off
 * for visitors who prefer reduced motion and leaves touch scrolling native.
 */
export default function SmoothScroll() {
  return <ReactLenis root options={{ lerp: 0.11, anchors: true, autoToggle: true }} />;
}
