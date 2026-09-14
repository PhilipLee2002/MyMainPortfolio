'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/types';
import { ProjectCard } from '@/components/ui/ProjectCard';

interface HorizontalSliderProps {
  projects: Project[];
  reducedMotion: boolean;
  framerEnabled: boolean;
}

export function HorizontalSlider({ projects, reducedMotion, framerEnabled }: HorizontalSliderProps) {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!wrapperRef.current || !containerRef.current) return;

    // Cancellation guard: if this effect is torn down (e.g. React Strict
    // Mode's dev-only double-invoke) before the dynamic imports below
    // resolve, `cancelled` prevents the in-flight setup from creating a
    // ScrollTrigger pin that would never get cleaned up — two pins fighting
    // over the same element corrupts its computed position.
    let cancelled = false;
    let tweenRef: gsap.core.Tween | undefined;

    const run = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        tweenRef = gsap.to(containerRef.current, {
          x: () => -(containerRef.current!.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current!,
            // Offset by the fixed nav's height (h-16 = 64px) — pinning flush
            // to the viewport top would park the slide permanently behind
            // the nav bar for the whole pinned scroll range.
            start: 'top 64px',
            end: () => `+=${containerRef.current!.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
      } catch (err) {
        console.warn('[HorizontalSlider] GSAP setup failed:', err);
      }
    };

    run();

    return () => {
      cancelled = true;
      tweenRef?.scrollTrigger?.kill();
    };
  }, [reducedMotion]);

  // Reduced motion fallback — plain vertical stack
  if (reducedMotion) {
    return (
      <div className="grid sm:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} framerEnabled={framerEnabled} />
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="overflow-hidden">
      <div
        ref={containerRef}
        className="flex"
        style={{ scrollSnapType: 'x mandatory', width: `${projects.length * 100}vw` }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-screen flex-shrink-0 px-6 sm:px-10 lg:px-16 flex items-center"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="max-w-[1200px] mx-auto w-full border-t border-[var(--border)] pt-10">
              <ProjectCard project={project} framerEnabled={framerEnabled} layout="split" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
