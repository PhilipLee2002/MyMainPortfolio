'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { LenisContext } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip smooth scroll entirely if user prefers reduced motion
    if (reducedMotion) return;

    // Cancellation guard: if this effect is torn down (e.g. React Strict
    // Mode's dev-only double-invoke) before the dynamic imports below
    // resolve, `cancelled` prevents the in-flight setup from creating a
    // Lenis instance that would never get cleaned up.
    let cancelled = false;
    let tickerCallback: ((time: number) => void) | undefined;
    let gsapRef: typeof import('gsap').default | undefined;

    const run = async () => {
      const { default: gsap } = await import('gsap');
      const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsapRef = gsap;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        lerp: 0.09,        // smoothness — lower = smoother but slower
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      // Sync Lenis with GSAP so ScrollTrigger reads the correct scroll position.
      // Without this, ScrollTrigger's pin/scrub math desyncs from Lenis's actual
      // (eased) scroll position — e.g. pinned sections end up positioned way off
      // the visible viewport mid-scroll.
      lenis.on('scroll', ScrollTrigger.update);
      tickerCallback = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();
    };

    run();

    return () => {
      cancelled = true;
      lenisRef.current?.destroy();
      if (tickerCallback) gsapRef?.ticker.remove(tickerCallback);
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}
