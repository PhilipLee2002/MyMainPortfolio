# Stage 06 — 3D Hero & Framer Motion

> **Instructions for Claude Code:** Read and implement every step in this file in order. Do not skip ahead. When you reach the "Done when" checklist at the bottom, verify every item before stopping. The next file to work on after this one is `stage-07-polish.md`.

---

## What this stage does

Adds the 3D wireframe shape in the hero that follows the mouse (React Three Fiber), then adds all Framer Motion polish: page fade-in transition, card hover scale, nav link underline animation, and the contact form success swap animation.

---

## Step 1 — Create `src/components/ui/HeroGradientFallback.tsx`

The static gradient used when: (a) the 3D component is loading, (b) the user is on mobile, or (c) WebGL fails.

```tsx
// src/components/ui/HeroGradientFallback.tsx

export function HeroGradientFallback() {
  return (
    <div
      className="hidden lg:block rounded-2xl w-full aspect-square max-w-md mx-auto"
      style={{
        background: 'radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%)',
        border: '1px solid var(--border)',
      }}
      aria-hidden="true"
    />
  );
}
```

---

## Step 2 — Create `src/components/ui/HeroR3FInner.tsx`

The actual Three.js canvas. This file is **never server-rendered** — it's always loaded by the dynamic wrapper in Step 3.

```tsx
// src/components/ui/HeroR3FInner.tsx
'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type * as THREE from 'three';
import { HeroGradientFallback } from './HeroGradientFallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SceneProps {
  reducedMotion: boolean;
}

function Scene({ reducedMotion }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalise to -1..1
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    if (!meshRef.current || reducedMotion) return;
    // Lerp rotation toward mouse
    meshRef.current.rotation.x += (mouse.current.y * 0.26 - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (mouse.current.x * 0.26 - meshRef.current.rotation.y) * 0.05;
    // Lerp position
    meshRef.current.position.x += (mouse.current.x * viewport.width  * 0.1 - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (-mouse.current.y * viewport.height * 0.1 - meshRef.current.position.y) * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#D49B4A"
        wireframe
        opacity={0.85}
        transparent
      />
    </mesh>
  );
}

interface HeroR3FInnerProps {
  reducedMotion: boolean;
}

export default function HeroR3FInner({ reducedMotion }: HeroR3FInnerProps) {
  return (
    <div className="hidden lg:block w-full aspect-square max-w-md mx-auto">
      <Canvas camera={{ position: [0, 0, 3.5] }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} color="#D49B4A" intensity={1.2} />
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
```

---

## Step 3 — Create `src/components/ui/HeroR3F.tsx`

The dynamic import wrapper. This is what `HeroSection` actually imports — Three.js is never included in the initial page bundle.

```tsx
// src/components/ui/HeroR3F.tsx

import dynamic from 'next/dynamic';
import { HeroGradientFallback } from './HeroGradientFallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const HeroR3FDynamic = dynamic(() => import('./HeroR3FInner'), {
  ssr: false,
  loading: () => <HeroGradientFallback />,
});

// Simple error boundary to catch WebGL failures
import React from 'react';
class R3FErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <HeroGradientFallback />;
    return this.props.children;
  }
}

export function HeroR3F() {
  const reducedMotion = useReducedMotion();
  return (
    <R3FErrorBoundary>
      <HeroR3FDynamic reducedMotion={reducedMotion} />
    </R3FErrorBoundary>
  );
}
```

---

## Step 4 — Update `HeroSection.tsx` to use the 3D component

Replace the gradient placeholder div in `HeroSection.tsx` with a conditional:

```tsx
// Replace the <div aria-hidden="true" ...> placeholder block with:

import { FEATURES } from '@/lib/features';
import { HeroR3F } from '@/components/ui/HeroR3F';
import { HeroGradientFallback } from '@/components/ui/HeroGradientFallback';

// Inside the JSX, replace the gradient div with:
{FEATURES.r3fHero ? <HeroR3F /> : <HeroGradientFallback />}
```

Also add `priority` to the hero image (the "PL" monogram is text, so no `<Image>` needed here — this applies if a real photo is added later):

```tsx
{/* When you replace the monogram with a real photo, use:
  <Image src="/profile.jpg" alt="Philip Lee" width={400} height={400} priority />
*/}
```

---

## Step 5 — Add Framer Motion page transition

Update `src/app/page.tsx` to wrap the main content in a motion div:

```tsx
// src/app/page.tsx
'use client';

import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';
import { FEATURES } from '@/lib/features';
import { SkipNav } from '@/components/layout/SkipNav';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Page() {
  return (
    <>
      <SkipNav />
      <Navigation />
      {FEATURES.framerMotion ? (
        <motion.main
          id="main-content"
          className="pt-16"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <HeroSection />
          <WorkSection />
          <AboutSection />
          <ContactSection />
        </motion.main>
      ) : (
        <main id="main-content" className="pt-16">
          <HeroSection />
          <WorkSection />
          <AboutSection />
          <ContactSection />
        </main>
      )}
      <Footer />
    </>
  );
}
```

---

## Step 6 — Add hover animations to `ProjectCard.tsx`

Update `ProjectCard` to scale on hover when `framerEnabled` is true:

```tsx
// Replace the outer <article> in ProjectCard.tsx with:
import { motion } from 'framer-motion';

// Use motion.article when framerEnabled, plain article otherwise
const Wrapper = framerEnabled ? motion.article : 'article';
const imageWrapper = framerEnabled ? motion.div : 'div';

// On the outer element:
<Wrapper
  data-cursor-hover
  className="rounded-xl p-6 flex flex-col gap-6"
  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
  {...(framerEnabled ? { whileHover: { scale: 1.03 }, transition: { duration: 0.35, ease: 'easeOut' } } : {})}
>

// Wrap the image area div with:
<imageWrapper
  {...(framerEnabled ? { whileHover: { scale: 1.05 }, transition: { duration: 0.35, ease: 'easeOut' } } : {})}
>
  {project.imagePlaceholderType === 'gradient' ? <GradientPlaceholder /> : <TerminalMockup />}
</imageWrapper>
```

---

## Step 7 — Add nav link underline animation to `Navigation.tsx`

Update the desktop nav link buttons to include a `motion.span` underline:

```tsx
// Replace each desktop nav <button> with:
import { motion } from 'framer-motion';
import { FEATURES } from '@/lib/features';

{links.map((link) => (
  <button
    key={link.label}
    onClick={() => scrollTo(link.target)}
    className="relative text-[var(--muted)] hover:text-[var(--text)] transition-colors text-sm font-medium group"
  >
    {link.label}
    {FEATURES.framerMotion && (
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-[var(--accent)]"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ originX: 0, width: '100%' }}
        aria-hidden="true"
      />
    )}
  </button>
))}
```

---

## Step 8 — Add success animation to `ContactForm.tsx`

The current success state shows text. Wrap it in a `motion.div` for an animated entrance:

```tsx
// Replace the success return block with:
import { motion, AnimatePresence } from 'framer-motion';

// Success state:
if (state.status === 'success') {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <p className="text-4xl mb-4" aria-label="Success">✓</p>
      <p className="text-[var(--text)] font-medium text-lg">Message sent!</p>
      <p className="text-[var(--muted)] text-sm mt-2">Thanks for reaching out. I&apos;ll get back to you soon.</p>
    </motion.div>
  );
}
```

---

## Done when

Before moving to Stage 07, confirm all of these:

- [ ] On desktop, the hero section shows the amber wireframe 3D shape
- [ ] Moving the mouse makes the 3D shape rotate and shift
- [ ] On mobile (or with "reduce motion" on), the hero shows the gradient fallback — no 3D JavaScript loads
- [ ] The page fades in smoothly on first load
- [ ] Hovering a project card scales it up slightly
- [ ] Hovering a nav link shows an amber underline that animates from left to right
- [ ] Submitting the contact form successfully shows an animated checkmark
- [ ] `npx vitest --run` still passes all tests
- [ ] No TypeScript errors (`npx tsc --noEmit`)

---

> ✅ All boxes checked — proceed to `stage-07-polish.md`.
