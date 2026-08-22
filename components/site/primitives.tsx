'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'span';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px -60px 0px' });
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.66, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* Cursor spotlight                                                    */
/* ------------------------------------------------------------------ */

export function spotlightProps() {
  return {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Section shell + heading                                             */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('relative scroll-mt-24 py-20 sm:py-28', className)}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeading({
  index,
  kicker,
  title,
  intro,
  align = 'left',
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  intro?: string;
  align?: 'left' | 'center';
}) {
  return (
    <Reveal className={cn('mb-12 max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <div
        className={cn(
          'mb-4 flex items-center gap-3',
          align === 'center' && 'justify-center'
        )}
      >
        <span className="kicker">
          {index} / {kicker}
        </span>
        <span
          className="h-px w-16 sm:w-24"
          style={{
            background:
              'linear-gradient(90deg, hsl(var(--cyan) / 0.8), hsl(var(--violet) / 0.35), transparent)',
          }}
        />
      </div>
      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          {intro}
        </p>
      )}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Glass card                                                          */
/* ------------------------------------------------------------------ */

export function GlassCard({
  children,
  className,
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      {...(interactive ? spotlightProps() : {})}
      className={cn(
        'glass rounded-lg',
        interactive && 'spotlight lift',
        className
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tag pill                                                            */
/* ------------------------------------------------------------------ */

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('pill', className)}>{children}</span>;
}
