'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { FEATURES } from '@/lib/features';
import { HeroAtmosphere } from '@/components/ui/HeroAtmosphere';
import { WordTicker } from '@/components/ui/WordTicker';

export function HeroSection() {
  const lenisRef = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!FEATURES.scrollAnimations || reducedMotion) return;
    if (!sectionRef.current || !bgRef.current) return;

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
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      <HeroAtmosphere parallaxRef={bgRef} />

      <div className="relative z-10 flex-1 flex items-center px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)]">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="max-w-4xl">
            <p className="font-display font-bold text-[var(--muted)] tracking-tight mb-5 text-lg sm:text-xl">
              Philip Lee
            </p>

            <p className="text-[var(--muted)] text-xs sm:text-sm font-body mb-6 tracking-[0.14em] uppercase">
              Full-stack · UI/UX · Laravel &amp; local AI
            </p>

            <h1
              className="font-display font-bold text-[var(--text)] leading-[0.92] tracking-tight mb-8"
              style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)' }}
            >
              Building systems that think.
            </h1>

            <p className="text-[var(--muted)] font-body font-light text-base sm:text-lg mb-10 max-w-md">
              Interfaces and architecture for problems that need both.
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
      </div>

      <div className="relative z-10">
        <WordTicker />
      </div>
    </section>
  );
}
