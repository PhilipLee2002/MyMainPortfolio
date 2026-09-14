# Stage 05 — Scroll Animations & Horizontal Slider

> **Instructions for Claude Code:** Read and implement every step in this file in order. Do not skip ahead. When you reach the "Done when" checklist at the bottom, verify every item before stopping. The next file to work on after this one is `stage-06-3d-motion.md`.

---

## What this stage does

Adds two GSAP features: scroll-triggered fade-in animations for sections and cards (Phase 2a), and the horizontal pinned slider for the Work section (Phase 2b). After this stage the page feels dynamic as you scroll through it.

Key rule: **all GSAP code runs inside `useEffect` only** — never at the module level or during server rendering.

---

## Step 1 — Add scroll animations to each section

Create `src/components/ui/ScrollReveal.tsx` — a reusable wrapper that fades + slides its children in when they scroll into view.

```tsx
// src/components/ui/ScrollReveal.tsx
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

    let st: ReturnType<typeof import('gsap/ScrollTrigger').default.create> | undefined;

    const run = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
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
      st?.kill();
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
```

---

## Step 2 — Add heading animation to each section

Wrap the `<h2>` headings in `WorkSection`, `AboutSection`, and `ContactSection` with `<ScrollReveal>`:

In `WorkSection.tsx`, change:
```tsx
<h2 className="font-display font-bold text-[var(--text)] text-4xl mb-12">
  Selected Work
</h2>
```
to:
```tsx
<ScrollReveal y={24}>
  <h2 className="font-display font-bold text-[var(--text)] text-4xl mb-12">
    Selected Work
  </h2>
</ScrollReveal>
```

Repeat the same pattern for the `<h2>` in `AboutSection` and `ContactSection`.

---

## Step 3 — Add card stagger animation to WorkSection

Wrap each `<ProjectCard>` in `<ScrollReveal>` with a stagger delay:

In `WorkSection.tsx`, change the card mapping to:
```tsx
<div className="grid sm:grid-cols-2 gap-8">
  {PROJECTS.map((project, i) => (
    <ScrollReveal key={project.id} delay={i * 0.15}>
      <ProjectCard
        project={project}
        index={i}
        framerEnabled={FEATURES.framerMotion}
      />
    </ScrollReveal>
  ))}
</div>
```

---

## Step 4 — Add Hero parallax background

Update `src/components/sections/HeroSection.tsx`. Add a background layer that moves at a slower rate than the scroll, creating depth.

Add a `useEffect` inside `HeroSection` that sets up the parallax:

```tsx
// Add these imports at the top of HeroSection.tsx
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { FEATURES } from '@/lib/features';
```

Add refs to the section and background div:
```tsx
const sectionRef = useRef<HTMLElement>(null);
const bgRef = useRef<HTMLDivElement>(null);
const reducedMotion = useReducedMotion();
```

Add the parallax `useEffect` inside the component (before the return):
```tsx
useEffect(() => {
  if (!FEATURES.scrollAnimations || reducedMotion) return;
  if (!sectionRef.current || !bgRef.current) return;

  const run = async () => {
    try {
      const { default: gsap } = await import('gsap');
      const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.to(bgRef.current, {
        y: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      return () => tween.scrollTrigger?.kill();
    } catch (err) {
      console.warn('[HeroSection] Parallax setup failed:', err);
    }
  };

  const cleanup = run();
  return () => { cleanup.then((fn) => fn?.()); };
}, [reducedMotion]);
```

Attach `ref={sectionRef}` to the `<section>` element and `ref={bgRef}` to the gradient background `<div>`.

---

## Step 5 — Create `src/components/ui/HorizontalSlider.tsx`

The Work section's horizontal pinned scroll experience. When `reducedMotion` is true, it falls back to a simple vertical stack.

```tsx
// src/components/ui/HorizontalSlider.tsx
'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/types';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { FEATURES } from '@/lib/features';

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

    let tweenRef: gsap.core.Tween | undefined;

    const run = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        tweenRef = gsap.to(containerRef.current, {
          x: () => -(containerRef.current!.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current!,
            start: 'top top',
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
      tweenRef?.scrollTrigger?.kill();
    };
  }, [reducedMotion]);

  // Reduced motion fallback — plain vertical stack
  if (reducedMotion) {
    return (
      <div className="grid sm:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} framerEnabled={framerEnabled} />
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
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="w-screen flex-shrink-0 px-6 flex items-center"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="max-w-[1200px] mx-auto w-full">
              <ProjectCard project={project} index={i} framerEnabled={framerEnabled} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Step 6 — Wire `HorizontalSlider` into `WorkSection.tsx`

Update `WorkSection` to use the slider when the feature flag is on:

```tsx
// src/components/sections/WorkSection.tsx
'use client';

import { PROJECTS } from '@/lib/projects';
import { FEATURES } from '@/lib/features';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { HorizontalSlider } from '@/components/ui/HorizontalSlider';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function WorkSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="work"
      className="px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)]"
    >
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal y={24}>
          <h2 className="font-display font-bold text-[var(--text)] text-4xl mb-12">
            Selected Work
          </h2>
        </ScrollReveal>

        {FEATURES.horizontalSlider ? (
          <HorizontalSlider
            projects={PROJECTS}
            reducedMotion={reducedMotion}
            framerEnabled={FEATURES.framerMotion}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-8">
            {PROJECTS.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.15}>
                <ProjectCard
                  project={project}
                  index={i}
                  framerEnabled={FEATURES.framerMotion}
                />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

---

## Done when

Before moving to Stage 06, confirm all of these:

- [ ] Cards and headings fade + slide in as you scroll down
- [ ] Hero background moves at a slower rate than the page scroll (parallax)
- [ ] The Work section shows a horizontal pinned scroll on desktop
- [ ] On mobile or with "reduce motion" on, the Work section shows a vertical stack
- [ ] Disabling `FEATURES.scrollAnimations` makes all content visible immediately (no hidden elements)
- [ ] `npx vitest --run` still passes all tests
- [ ] No TypeScript errors (`npx tsc --noEmit`)

---

> ✅ All boxes checked — proceed to `stage-06-3d-motion.md`.
