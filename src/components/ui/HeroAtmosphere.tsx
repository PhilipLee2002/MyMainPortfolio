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
 * Full-bleed hero atmosphere — CSS washes on all breakpoints;
 * R3F form sits as a background accent on lg+ when enabled.
 * A pointer-follow wash (CSS only) makes the room react even if WebGL is off.
 */
export function HeroAtmosphere({ parallaxRef }: HeroAtmosphereProps) {
  const washRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = washRef.current;
    if (!el) return;
    if (reducedMotion) return;

    let raf = 0;
    let x = 75;
    let y = 38;
    let tx = 75;
    let ty = 38;

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
      {/* Base radial atmosphere — always present (no CLS when R3F loads) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 75% 40%, var(--accent-glow) 0%, transparent 65%),' +
            'radial-gradient(ellipse 50% 45% at 20% 80%, rgba(212, 155, 74, 0.06) 0%, transparent 55%)',
        }}
      />

      {/* Pointer-follow wash — interpolates independently of the 3D canvas */}
      <div ref={washRef} className="absolute inset-0" />

      {/* Soft vignette so text stays readable over the accent */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--bg) 92%, transparent) 0%, color-mix(in srgb, var(--bg) 55%, transparent) 45%, color-mix(in srgb, var(--bg) 32%, transparent) 100%)',
        }}
      />

      {/* Desktop 3D accent — full-bleed, behind copy */}
      <div className="absolute inset-0 hidden lg:block opacity-55">
        {FEATURES.r3fHero ? <HeroR3F /> : <HeroGradientFallback fullBleed />}
      </div>
    </div>
  );
}
