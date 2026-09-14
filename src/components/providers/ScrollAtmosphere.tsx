'use client';

import { useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Palette = {
  bg: [number, number, number];
  glow: number;
};

const PALETTES: Palette[] = [
  { bg: [14, 14, 14], glow: 0.15 },  // hero
  { bg: [22, 17, 12], glow: 0.28 },  // work — warmer amber cast
  { bg: [18, 21, 26], glow: 0.10 },  // about — slightly cooler
  { bg: [14, 14, 14], glow: 0.12 },  // contact — calm near-black
];

const SECTION_IDS = ['hero', 'work', 'about', 'contact'] as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function mix(a: Palette, b: Palette, t: number): Palette {
  const u = clamp(t, 0, 1);
  return {
    bg: [
      a.bg[0] + (b.bg[0] - a.bg[0]) * u,
      a.bg[1] + (b.bg[1] - a.bg[1]) * u,
      a.bg[2] + (b.bg[2] - a.bg[2]) * u,
    ],
    glow: a.glow + (b.glow - a.glow) * u,
  };
}

function applyPalette(palette: Palette) {
  const [r, g, b] = palette.bg;
  const root = document.documentElement;
  root.style.setProperty('--bg', `rgb(${r.toFixed(1)}, ${g.toFixed(1)}, ${b.toFixed(1)})`);
  root.style.setProperty('--accent-glow', `rgba(212, 155, 74, ${palette.glow.toFixed(3)})`);
}

function sampleAtmosphere() {
  const view = window.innerHeight * 0.38;
  const tops = SECTION_IDS.map((id) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
  });

  let i = 0;
  for (let k = 0; k < tops.length - 1; k++) {
    if (tops[k + 1] <= view) i = k + 1;
  }

  const next = Math.min(i + 1, tops.length - 1);
  if (i === next || !Number.isFinite(tops[i]) || !Number.isFinite(tops[next])) {
    applyPalette(PALETTES[i]);
    return;
  }

  const span = tops[next] - tops[i];
  const t = span === 0 ? 0 : (view - tops[i]) / span;
  applyPalette(mix(PALETTES[i], PALETTES[next], t));
}

/**
 * Tweens page atmosphere (background + accent glow) as sections cross the viewport.
 * Stays inside the black / amber family — no rainbow section colors.
 */
export function ScrollAtmosphere() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    applyPalette(PALETTES[0]);
    if (reducedMotion) return;

    let cancelled = false;
    let trigger: { kill: () => void } | undefined;

    const run = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        trigger = ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: sampleAtmosphere,
          onRefresh: sampleAtmosphere,
        });

        sampleAtmosphere();
        ScrollTrigger.refresh();
      } catch (err) {
        console.warn('[ScrollAtmosphere] setup failed:', err);
      }
    };

    run();

    return () => {
      cancelled = true;
      trigger?.kill();
      applyPalette(PALETTES[0]);
    };
  }, [reducedMotion]);

  return null;
}
