# Stage 01 — Scaffolding, Design System & Core Types

> **Instructions for Claude Code:** Read and implement every step in this file in order. Do not skip ahead. When you reach the "Done when" checklist at the bottom, verify every item before stopping. The next file to work on after this one is `stage-02-providers.md`.

---

## What this stage does

Sets up the project foundation. After this stage the app will run (`npm run dev`) and show the default Next.js page, but all the file structure, colours, fonts, types, and data constants will already be in place for every later stage to build on.

---

## Step 1 — Install packages

The project currently only has Next.js, React, Tailwind, and TypeScript installed. All animation, 3D, email, and testing libraries still need to be added.

Run these two commands in the project root:

```bash
npm install lenis gsap framer-motion @react-three/fiber @react-three/drei three resend
npm install --save-dev vitest @testing-library/react @testing-library/user-event @vitejs/plugin-react fast-check jsdom @types/three
```

After running, confirm `package.json` now lists all of the above under `dependencies` and `devDependencies` before continuing.

---

## Step 2 — Create `src/types/index.ts`

This file defines the shape of all shared data used across the app.

```ts
// src/types/index.ts

export interface Project {
  id: string;
  title: string;
  category: string;
  year: number;
  techStack: string[];
  features: string[];
  outcomeMetrics: string[];
  repoUrl?: string;
  repoLabel?: string;
  reflectionText?: string;
  imagePlaceholderType: 'gradient' | 'terminal';
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  errors: {
    name?: string;
    email?: string;
    message?: string;
    server?: string;
  };
}
```

---

## Step 3 — Create `src/lib/features.ts`

Feature flags — set to `true` to enable each phase. Leave all `true` for now; individual stages will use them.

```ts
// src/lib/features.ts

export const FEATURES = {
  scrollAnimations: true,   // Phase 2a — GSAP scroll animations
  horizontalSlider: true,   // Phase 2b — horizontal project slider
  r3fHero: true,            // Phase 3  — 3D hero shape
  framerMotion: true,       // Phase 4a — page transitions & hover effects
  customCursor: true,       // Phase 4b — custom amber cursor
  seo: true,                // Phase 5  — Open Graph / Twitter Card
} as const;
```

---

## Step 4 — Create `src/lib/projects.ts`

All project content as static TypeScript constants. No CMS needed.

```ts
// src/lib/projects.ts

import type { Project } from '@/types';

export const FRACA: Project = {
  id: 'fraca',
  title: 'FRACA SERVCOM Inventory System',
  category: 'Web Application',
  year: 2024,
  techStack: [
    'Laravel 12',
    'PHP 8.1+',
    'MySQL',
    'Blade',
    'Bootstrap 5',
    'JavaScript/Axios',
    'Vite',
    'Spatie Media Library',
  ],
  features: [
    'Multi-supplier management',
    'Real-time stock tracking',
    'Media uploads',
    'Role-based access control',
  ],
  outcomeMetrics: [
    '99.9% data integrity',
    '500+ products managed',
    '20+ suppliers tracked',
    'Stock accuracy improved from 75% to 99%',
  ],
  repoUrl: 'https://github.com/PhilipLee2002/fraca-inventory-system',
  repoLabel: '(Private Repository)',
  reflectionText:
    'This project taught me the value of designing for real operational constraints. Working directly with the client revealed how much the final product depends on understanding the humans using it daily.',
  imagePlaceholderType: 'gradient',
};

export const NOVA: Project = {
  id: 'nova',
  title: 'Nova Terminal AI Assistant',
  category: 'CLI Tool / AI',
  year: 2024,
  techStack: [
    'Python 3.8+',
    'LM Studio',
    'Qwen2.5-Coder-1.5B',
    'Requests',
    'Typer',
    'Rich',
  ],
  features: [
    'Fully offline AI inference',
    'Streaming responses',
    '/scaffold code generation',
    'Terminal-first UX',
  ],
  outcomeMetrics: [
    'Fully offline — no API keys required',
    '<8s response times on consumer hardware',
    '/scaffold speeds up boilerplate generation by ~70%',
  ],
  repoUrl: undefined,
  reflectionText:
    'Nova emerged from a desire to keep AI tooling entirely local. Privacy and speed were the primary constraints — and they shaped every design decision from the ground up.',
  imagePlaceholderType: 'terminal',
};

export const PROJECTS: Project[] = [FRACA, NOVA];
```

---

## Step 5 — Create `src/lib/animations.ts`

Shared animation constants used by GSAP and Framer Motion.

```ts
// src/lib/animations.ts

// Framer Motion page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: -16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// GSAP ease strings
export const EASE = {
  smooth: 'power2.out',
  strong: 'power3.out',
} as const;

// GSAP animation durations (seconds)
export const DURATION = {
  heading: 0.85,
  card: 1.0,
  cardStagger: 0.15,
} as const;
```

---

## Step 6 — Update `src/app/globals.css`

Replace the existing file content entirely. This sets up all design tokens and Tailwind v4 theme.

```css
/* src/app/globals.css */

@import "tailwindcss";

@theme {
  --color-bg:            #0E0E0E;
  --color-surface:       #161616;
  --color-border:        rgba(255, 255, 255, 0.06);
  --color-text:          #EBEBEB;
  --color-muted:         #888888;
  --color-accent:        #D49B4A;
  --color-accent-glow:   rgba(212, 155, 74, 0.15);
  --color-white:         #FFFFFF;

  --font-display: var(--font-display);
  --font-body:    var(--font-body);

  --spacing-section-mobile: 48px;
  --spacing-section-tablet: 64px;
  --spacing-section-desktop-min: 80px;
  --spacing-section-desktop-max: 120px;
}

:root {
  --bg:            #0E0E0E;
  --surface:       #161616;
  --border:        rgba(255, 255, 255, 0.06);
  --text:          #EBEBEB;
  --muted:         #888888;
  --accent:        #D49B4A;
  --accent-glow:   rgba(212, 155, 74, 0.15);
  --white:         #FFFFFF;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: auto; /* Lenis overrides this at runtime */
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-body), sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3 {
  font-family: var(--font-display), sans-serif;
}

/* Focus ring — amber outline for accessibility */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
```

---

## Step 7 — Update `src/app/layout.tsx`

Sets up fonts, basic metadata, and the HTML shell. Animation providers will be added in Stage 02.

```tsx
// src/app/layout.tsx

import type { Metadata } from 'next';
import { Host_Grotesk, Inter } from 'next/font/google';
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
      <body>{children}</body>
    </html>
  );
}
```

---

## Step 8 — Create `.env.example`

```ini
# .env.example

# The email address that receives contact form submissions
CONTACT_EMAIL=your-email@example.com

# The full URL of the deployed site — no trailing slash
# Used for Open Graph canonical tags
NEXT_PUBLIC_SITE_URL=https://philip-lee.vercel.app
```

Also create a `.env.local` file (not committed) with real values if you want the contact form to work locally:

```ini
CONTACT_EMAIL=your-real-email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Step 9 — Verify vitest is configured

Create `vitest.config.ts` in the project root:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
// vitest.setup.ts
import '@testing-library/jest-dom';
```

Install the jest-dom matcher types:

```bash
npm install --save-dev @testing-library/jest-dom
```

---

## Done when

Before moving to Stage 02, confirm all of these:

- [ ] `npm run dev` starts without errors
- [ ] Browser shows the default Next.js page (no crashes)
- [ ] `src/types/index.ts` exists with `Project`, `ContactFormData`, `ContactFormState`
- [ ] `src/lib/features.ts` exists with all 6 flags set to `true`
- [ ] `src/lib/projects.ts` exists with `FRACA`, `NOVA`, `PROJECTS`
- [ ] `src/lib/animations.ts` exists with `pageVariants`, `EASE`, `DURATION`
- [ ] `globals.css` has all CSS custom properties on `:root`
- [ ] `layout.tsx` loads Host Grotesk + Inter via `next/font`
- [ ] `.env.example` exists at the project root
- [ ] `vitest.config.ts` exists and `npx vitest --run` exits cleanly (no test files yet is fine)

---

> ✅ All boxes checked — proceed to `stage-02-providers.md`.
