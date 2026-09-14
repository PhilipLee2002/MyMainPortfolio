'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { FEATURES } from '@/lib/features';
import { EASE, DURATION } from '@/lib/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // stagger offset in seconds
  y?: number;     // starting y offset in px (default 40)
}

export function ScrollReveal({ children, className, delay = 0, y = 40 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!FEATURES.scrollAnimations || reducedMotion) return;
    if (!ref.current) return;

    // Cancellation guard: if this effect is torn down (e.g. React Strict
    // Mode's dev-only double-invoke) before the dynamic imports below
    // resolve, `cancelled` prevents the in-flight setup from creating a
    // ScrollTrigger instance that would never get cleaned up.
    let cancelled = false;
    let tweenRef: gsap.core.Tween | undefined;

    const run = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        tweenRef = gsap.fromTo(
          ref.current,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.card,
            ease: EASE.smooth,
            delay,
            scrollTrigger: {
              trigger: ref.current!,
              start: 'top 80%',
            },
          },
        );
      } catch (err) {
        // If GSAP fails, make element visible immediately
        if (ref.current) {
          ref.current.style.opacity = '1';
          ref.current.style.transform = 'none';
        }
        console.warn('[ScrollReveal] GSAP setup failed:', err);
      }
    };

    run();

    return () => {
      cancelled = true;
      tweenRef?.scrollTrigger?.kill();
    };
  }, [reducedMotion, delay, y]);

  return (
    <div
      ref={ref}
      className={className}
      style={!reducedMotion && FEATURES.scrollAnimations ? { opacity: 0 } : undefined}
    >
      {children}
    </div>
  );
}
