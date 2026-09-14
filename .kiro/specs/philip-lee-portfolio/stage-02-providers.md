# Stage 02 — Hooks & Providers

> **Instructions for Claude Code:** Read and implement every step in this file in order. Do not skip ahead. When you reach the "Done when" checklist at the bottom, verify every item before stopping. The next file to work on after this one is `stage-03-layout.md`.

---

## What this stage does

Creates the two custom hooks (`useReducedMotion` and `useLenis`) and the two provider components (`LenisProvider` and `MotionProvider`), then wires them into `layout.tsx`. After this stage the app still looks the same, but smooth scrolling and animation infrastructure are ready for every later stage.

---

## Step 1 — Create `src/hooks/useReducedMotion.ts`

This hook checks if the user has turned on "reduce motion" in their OS settings. Every animation system reads this and either skips or simplifies animations accordingly.

```ts
// src/hooks/useReducedMotion.ts
'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);

    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

---

## Step 2 — Create `src/hooks/useLenis.ts`

This creates a React Context that holds the Lenis scroll instance, so any component can access it to trigger smooth scrolling to a section.

```ts
// src/hooks/useLenis.ts
'use client';

import { createContext, useContext, MutableRefObject } from 'react';
import type Lenis from 'lenis';

export const LenisContext = createContext<MutableRefObject<Lenis | null> | null>(null);

export function useLenis(): MutableRefObject<Lenis | null> | null {
  return useContext(LenisContext);
}
```

---

## Step 3 — Create `src/components/providers/LenisProvider.tsx`

This sets up smooth scrolling for the whole page. The critical detail here is the GSAP ticker sync — without it, scroll-triggered animations fire at the wrong position.

Rules:
- If the user has "reduce motion" on → skip Lenis entirely, let the browser handle scrolling normally.
- On unmount → always clean up (destroy Lenis, remove the ticker callback).

```tsx
// src/components/providers/LenisProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { LenisContext } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip smooth scroll entirely if user prefers reduced motion
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.09,        // smoothness — lower = smoother but slower
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP so ScrollTrigger reads the correct scroll position
    const tickerCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}
```

---

## Step 4 — Create `src/components/providers/MotionProvider.tsx`

This wraps the app in Framer Motion's global config. It automatically disables all Framer Motion animations if "reduce motion" is on.

```tsx
// src/components/providers/MotionProvider.tsx
'use client';

import { MotionConfig, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </MotionConfig>
  );
}
```

---

## Step 5 — Update `src/app/layout.tsx`

Wrap the page children in both providers. The order matters: `LenisProvider` is outer (scroll), `MotionProvider` is inner (animation).

```tsx
// src/app/layout.tsx

import type { Metadata } from 'next';
import { Host_Grotesk, Inter } from 'next/font/google';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';
import './globals.css';

const displayFont = Host_Grotesk({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
  description:
    'Full-stack developer specialising in Laravel architecture and local AI. Building clean, scalable solutions for complex business problems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <LenisProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
```

---

## Done when

Before moving to Stage 03, confirm all of these:

- [ ] `src/hooks/useReducedMotion.ts` exists and exports `useReducedMotion`
- [ ] `src/hooks/useLenis.ts` exists and exports `LenisContext` and `useLenis`
- [ ] `src/components/providers/LenisProvider.tsx` exists
- [ ] `src/components/providers/MotionProvider.tsx` exists
- [ ] `layout.tsx` wraps children in `<LenisProvider><MotionProvider>`
- [ ] `npm run dev` still runs without errors
- [ ] No TypeScript errors (`npx tsc --noEmit`)

---

> ✅ All boxes checked — proceed to `stage-03-layout.md`.
