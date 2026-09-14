'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { FEATURES } from '@/lib/features';
import { HeroAtmosphere } from '@/components/ui/HeroAtmosphere';

export function HeroSection() {
  const lenisRef = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!FEATURES.scrollAnimations || reducedMotion) return;
    if (!sectionRef.current || !bgRef.current) return;

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

        tweenRef = gsap.to(bgRef.current, {
          y: 80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      } catch (err) {
        console.warn('[HeroSection] Parallax setup failed:', err);
      }
    };

    run();

    return () => {
      cancelled = true;
      tweenRef?.scrollTrigger?.kill();
    };
  }, [reducedMotion]);

  function scrollTo(id: string) {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(id, { duration: 1.0 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)] overflow-hidden"
    >
      <HeroAtmosphere parallaxRef={bgRef} />

      <div className="relative z-10 max-w-[1200px] mx-auto w-full">
        <div className="max-w-3xl">
          {/* Brand wordmark — display scale, not h1 (sole h1 is the tagline below) */}
          <p
            className="font-display font-extrabold text-[var(--text)] leading-none mb-6 tracking-tight"
            style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)' }}
          >
            Philip Lee
          </p>

          <p className="text-[var(--muted)] text-sm font-body mb-5 tracking-wide uppercase">
            Full-Stack Software Developer | Laravel &amp; AI Specialist
          </p>

          <h1
            className="font-display font-bold text-[var(--text)] leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.75rem)' }}
          >
            Building systems that think.
          </h1>

          <p className="text-[var(--muted)] font-body font-light text-lg mb-10 max-w-xl">
            Full-stack developer specialising in Laravel architecture and local AI.
            I turn complex business problems into clean, scalable solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('#work')}
              data-cursor-hover
              className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] font-medium rounded hover:opacity-90 transition-opacity min-h-11"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollTo('#contact')}
              data-cursor-hover
              className="px-6 py-3 border border-[var(--border)] text-[var(--text)] font-medium rounded hover:border-[var(--accent)] transition-colors min-h-11"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
