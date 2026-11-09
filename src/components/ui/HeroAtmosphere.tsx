'use client';

import { useEffect, useRef } from 'react';
import { FEATURES } from '@/lib/features';
import { HeroR3F } from '@/components/ui/HeroR3F';
import { HeroGradientFallback } from '@/components/ui/HeroGradientFallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroAtmosphereProps {
  /** Ref for GSAP parallax scrub on the atmosphere plane. */
  parallaxRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Full-bleed hero atmosphere. The sphere is a sculpture in the room
 * (md+, high opacity), not a faint corner accent.
 */
export function HeroAtmosphere({ parallaxRef }: HeroAtmosphereProps) {
  const washRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = washRef.current;
    if (!el) return;
    if (reducedMotion) return;

    let raf = 0;
    let x = 72;
    let y = 42;
    let tx = 72;
    let ty = 42;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
    };

    const loop = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      el.style.background =
        `radial-gradient(ellipse 55% 50% at ${x}% ${y}%, var(--accent-glow) 0%, transparent 62%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={parallaxRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 72% 42%, var(--accent-glow) 0%, transparent 65%),' +
            'radial-gradient(ellipse 50% 45% at 18% 82%, rgba(212, 155, 74, 0.05) 0%, transparent 55%)',
        }}
      />

      <div ref={washRef} className="absolute inset-0" />

      {/* Light vignette — keeps type readable without burying the sphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--bg) 88%, transparent) 0%, color-mix(in srgb, var(--bg) 45%, transparent) 38%, transparent 68%)',
        }}
      />

      <div className="absolute inset-0 hidden md:block opacity-[0.85]">
        {FEATURES.r3fHero ? <HeroR3F /> : <HeroGradientFallback fullBleed />}
      </div>
    </div>
  );
}
