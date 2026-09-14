# Design Document — Philip Lee Portfolio

## Overview

This document describes the technical architecture and component design for Philip Lee's developer portfolio — a TRIONN-inspired, editorial-minimal single-page application (SPA). The application is built with Next.js 14 (App Router), TypeScript, Tailwind CSS v4, Lenis, GSAP + ScrollTrigger, Framer Motion, and React Three Fiber (Phase 3).

The portfolio is a single route (`/`) comprising five progressive build phases:

| Phase | Feature |
|---|---|
| 1 | Foundation layout, design system, static content |
| 2a | Scroll-triggered animations (GSAP + ScrollTrigger) |
| 2b | Horizontal project scroll slider (GSAP pin) |
| 3 | 3D hero accent (React Three Fiber) |
| 4a | Page transitions and micro-interactions (Framer Motion) |
| 4b | Custom cursor |
| 5 | SEO, Open Graph, Twitter Card metadata |

All animation libraries (GSAP, Framer Motion, R3F/Three.js) are loaded via dynamic `import()` with `{ ssr: false }` to protect the critical render path and prevent hydration mismatches.

---

## Architecture

### Rendering Strategy

The portfolio uses the Next.js 14 App Router with a **hybrid SSR + client-side hydration** approach:

- `app/layout.tsx` — Server Component. Defines global metadata, fonts, `<html lang="en">`, and injects the design-system CSS variables.
- `app/page.tsx` — Server Component shell. Renders the static section structure; passes no props to animation wrappers.
- All animation orchestrators (`LenisProvider`, `GSAPAnimator`, `MotionProvider`) are Client Components wrapped in `"use client"`.
- Heavy libraries (GSAP ScrollTrigger, Framer Motion, R3F, Custom Cursor) are lazy-loaded at the boundary where they are first used, using `next/dynamic` with `{ ssr: false }`.

### Phase Feature Flags

Each phase beyond Phase 1 is guarded by a TypeScript constant in `src/lib/features.ts`. This allows incremental activation without branching the codebase:

```ts
export const FEATURES = {
  scrollAnimations: true,   // Phase 2a
  horizontalSlider: true,   // Phase 2b
  r3fHero: true,            // Phase 3
  framerMotion: true,       // Phase 4a
  customCursor: true,       // Phase 4b
  seo: true,                // Phase 5
} as const;
```

Components gate their advanced behaviour by importing these flags.

---

## Components and Interfaces

### Component Hierarchy

```
app/layout.tsx (Server)
└── Providers (Client: LenisProvider, MotionProvider)
    └── app/page.tsx (Server shell)
        ├── SkipNav
        ├── Navigation
        ├── main#main-content
        │   ├── HeroSection
        │   │   └── [Phase 3] HeroR3F (dynamic, ssr:false)
        │   ├── WorkSection
        │   │   ├── [Phase 2b] HorizontalSlider
        │   │   └── ProjectCard × 2
        │   ├── AboutSection
        │   └── ContactSection
        │       └── ContactForm
        └── Footer
└── [Phase 4b] CustomCursor (dynamic, ssr:false)
```

### File and Folder Structure

```
src/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # POST handler — sends email via nodemailer/resend
│   ├── globals.css               # Design system CSS custom properties + Tailwind base
│   ├── layout.tsx                # Metadata, fonts, root HTML
│   └── page.tsx                  # SPA shell — assembles all sections
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── SkipNav.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── WorkSection.tsx
│   │   ├── AboutSection.tsx
│   │   └── ContactSection.tsx
│   ├── ui/
│   │   ├── ProjectCard.tsx
│   │   ├── ContactForm.tsx
│   │   ├── HorizontalSlider.tsx  # Phase 2b
│   │   ├── HeroR3F.tsx           # Phase 3
│   │   └── CustomCursor.tsx      # Phase 4b
│   └── providers/
│       ├── LenisProvider.tsx
│       └── MotionProvider.tsx
├── lib/
│   ├── features.ts               # Phase feature flags
│   ├── projects.ts               # Project data constants (FRACA, Nova)
│   └── animations.ts             # Shared GSAP ease presets and config
├── types/
│   └── index.ts                  # Shared TypeScript types/interfaces
└── hooks/
    ├── useLenis.ts               # Context hook for Lenis instance
    └── useReducedMotion.ts       # Wrapper around window.matchMedia
```

---

## Data Models

### Project Data

All project content lives as typed constants in `src/lib/projects.ts`. There is no remote CMS — data is build-time static.

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
  repoUrl?: string;            // optional — absence means link is omitted
  repoLabel?: string;          // e.g. "(Private Repository)"
  reflectionText?: string;     // optional — absence means subsection is omitted
  imagePlaceholderType: 'gradient' | 'terminal';
}

export interface ContactFormData {
  name: string;   // max 100 chars
  email: string;  // RFC 5322
  message: string; // max 2000 chars
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

### Project Constants

```ts
// src/lib/projects.ts (abbreviated)

export const FRACA: Project = {
  id: 'fraca',
  title: 'FRACA SERVCOM Inventory System',
  category: 'Web Application',
  year: 2024,
  techStack: ['Laravel 12', 'PHP 8.1+', 'MySQL', 'Blade', 'Bootstrap 5', 'JavaScript/Axios', 'Vite', 'Spatie Media Library'],
  features: ['Multi-supplier management', 'Real-time stock tracking', 'Media uploads', 'Role-based access control'],
  outcomeMetrics: ['99.9% data integrity', '500+ products', '20+ suppliers', 'Stock accuracy improved from 75% to 99%'],
  repoUrl: 'https://github.com/PhilipLee2002/fraca-inventory-system',
  repoLabel: '(Private Repository)',
  reflectionText: 'This project taught me the value of designing for real operational constraints...',
  imagePlaceholderType: 'gradient',
};

export const NOVA: Project = {
  id: 'nova',
  title: 'Nova Terminal AI Assistant',
  category: 'CLI Tool / AI',
  year: 2024,
  techStack: ['Python 3.8+', 'LM Studio', 'Qwen2.5-Coder-1.5B', 'Requests', 'Typer', 'Rich'],
  features: ['Fully offline AI inference', 'Streaming responses', '/scaffold code generation', 'Terminal-first UX'],
  outcomeMetrics: ['Fully offline', '<8s response times', '/scaffold speeds up boilerplate generation by ~70%'],
  repoUrl: undefined,
  reflectionText: 'Nova emerged from a desire to keep AI tooling entirely local...',
  imagePlaceholderType: 'terminal',
};

export const PROJECTS: Project[] = [FRACA, NOVA];
```

---

## Key Component Designs

### Navigation

```ts
// No external props — reads route state internally
export interface NavigationProps {}
```

- Fixed top bar, `h-16` (64px), `z-50`.
- Contains: "Philip Lee" wordmark (left), anchor links Work/About/Contact + CV download (right).
- Mobile (`< 640px`): hamburger toggle, full-screen overlay menu. Toggle sets `aria-expanded` and `aria-controls="mobile-menu"`.
- Hover underline: Phase 4a — `motion.span` with `scaleX: 0 → 1`, `transformOrigin: "left"`, duration 0.35s.
- Lenis scroll: calls `lenis.scrollTo('#section-id', { duration: 1.0 })` on anchor click.

### HeroSection

```ts
export interface HeroSectionProps {
  r3fEnabled: boolean;  // from FEATURES.r3fHero
}
```

- `min-h-screen flex items-center`.
- `h1` headline: `clamp(2.5rem, 6vw, 5rem)` desktop, `clamp(2rem, 8vw, 3rem)` mobile.
- Phase 3 branch: if `r3fEnabled && viewport >= 768` → render `<HeroR3FDynamic />` (dynamic import). Else → render `<HeroGradientFallback />`.
- Suspense fallback for R3F: `<HeroGradientFallback />` (same bounding box, CSS gradient only — no CLS).

### ProjectCard

```ts
export interface ProjectCardProps {
  project: Project;
  index: number;           // for stagger animation delay
  framerEnabled: boolean;  // from FEATURES.framerMotion
}
```

- Renders category, year, tech stack chips, features list, outcome metrics, and optional reflection.
- Image area: if `imagePlaceholderType === 'gradient'` → `<GradientPlaceholder />` with `{/* REPLACE WITH FRACA SCREENSHOT */}`. If `'terminal'` → `<TerminalMockup />` with `{/* REPLACE WITH NOVA SCREENSHOT */}`.
- Repo link: only rendered if `project.repoUrl` is defined.
- Phase 4a hover: `whileHover={{ scale: 1.03 }}` on the card wrapper, image area gets `whileHover={{ scale: 1.05 }}` with amber glow overlay.

### HorizontalSlider (Phase 2b)

```ts
export interface HorizontalSliderProps {
  projects: Project[];
  reducedMotion: boolean;
}
```

- If `reducedMotion` → renders vertical stack.
- Otherwise: pinned GSAP ScrollTrigger panel. Container ref attached; on mount:
  ```ts
  gsap.to(containerRef.current, {
    x: () => -(containerRef.current.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: wrapperRef.current,
      start: 'top top',
      end: () => `+=${containerRef.current.scrollWidth - window.innerWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });
  ```
- CSS on slider container: `scroll-snap-type: x mandatory`, each panel: `scroll-snap-align: start`.

### ContactForm

```ts
export interface ContactFormProps {
  contactEmailConfigured: boolean; // from env check in Server Component
  framerEnabled: boolean;
}
```

- Controlled form using `useReducer` for `ContactFormState`.
- Validation: runs on blur and on submit. Name/message: reject whitespace-only. Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (RFC 5322 practical subset).
- On submit: sets `status: 'loading'`, disables button, POSTs to `/api/contact`, then transitions to `success` or `error`.
- Phase 4a success: `<AnimatePresence>` swaps form fields out (`opacity: 0`, 0.5s) and animates in checkmark + message.

### HeroR3F (Phase 3)

```ts
export interface HeroR3FProps {
  reducedMotion: boolean;
}
```

- Dynamic import wrapper: `next/dynamic(() => import('./HeroR3FInner'), { ssr: false, loading: () => <HeroGradientFallback /> })`.
- Inner component: `<Canvas>` with `<IcosahedronGeometry args={[1, 1]} />`, `<MeshStandardMaterial wireframe />`, ambient + point lights in amber.
- Mouse tracking: `useRef` on mouse position, `useFrame` lerps rotation ±15° and position ±20px.
- If `reducedMotion` → static position, no `useFrame` updates.

### CustomCursor (Phase 4b)

- Dynamic import: `next/dynamic(() => import('./CustomCursor'), { ssr: false })`.
- Only rendered when `FEATURES.customCursor && viewport > 1024`.
- `useEffect` attaches `mousemove` listener, updates `translate(x, y)` via CSS transform on a `div` with `pointer-events: none; position: fixed; z-index: 9999`.
- Hover detection: `mouseover` on `[data-cursor-hover]` elements sets scale to 2.5× via Framer Motion `useSpring`.

---

## Animation Architecture

### Library Roles

| Library | Role | Load strategy |
|---|---|---|
| Lenis | Smooth scroll — replaces native `window.scroll` | Client-side `useEffect`, destroyed on unmount |
| GSAP + ScrollTrigger | Scroll-triggered entry animations, parallax, horizontal pin | `dynamic(() => import('gsap/ScrollTrigger'), { ssr: false })` |
| Framer Motion | Page transitions, hover micro-interactions, form success swap | `dynamic()` wrapper component; `MotionConfig` in Provider |
| React Three Fiber | 3D hero accent canvas | `dynamic(() => import('./HeroR3FInner'), { ssr: false })` |

### Lenis + GSAP Synchronisation

The key integration point is the GSAP ticker sync. Without it, ScrollTrigger reads the wrong scroll position:

```ts
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
    if (reducedMotion) return;  // skip Lenis — use native scroll

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;

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

### GSAP ScrollTrigger Animation Patterns

All GSAP animations are initialised inside `useEffect` hooks with proper cleanup (`ScrollTrigger.kill()` on return). They are wrapped in a `useReducedMotion` check — if `true`, elements are shown in their final state immediately.

**Card entry (Phase 2a):**
```ts
gsap.fromTo(cards, 
  { opacity: 0, y: 40 },
  {
    opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', stagger: 0.15,
    scrollTrigger: { trigger: section, start: 'top 80%' },
  }
);
```

**Section heading entry (Phase 2a):**
```ts
gsap.fromTo(heading,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
    scrollTrigger: { trigger: heading, start: 'top 85%' },
  }
);
```

**Hero parallax (Phase 2a):**
```ts
gsap.to(heroBg, {
  y: 80,
  ease: 'none',
  scrollTrigger: {
    trigger: heroSection,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});
```

### Framer Motion Configuration

The `MotionProvider` wraps the app in `MotionConfig`:

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

**Page transition variants:**
```ts
export const pageVariants = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: 16,  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};
```

**Card hover:**
```ts
whileHover={{ scale: 1.03 }}
transition={{ duration: 0.35, ease: 'easeOut' }}
```

### Reduced Motion Strategy

All three animation systems respect `prefers-reduced-motion` via `useReducedMotion()`:

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

When `reduced === true`:
- Lenis is not initialised (native scroll used)
- GSAP ScrollTrigger animations are skipped; elements render at final opacity/transform
- `MotionConfig reducedMotion="always"` suppresses all Framer Motion animations
- R3F geometry is static (no `useFrame` rotation or mouse tracking)
- Custom cursor scale transition uses `duration: 0`

---

## API Route — Contact Form

```
POST /api/contact
```

### Request

```ts
// Body (JSON)
{
  name: string;    // validated server-side: non-empty, ≤ 100 chars
  email: string;   // validated server-side: RFC 5322
  message: string; // validated server-side: non-empty, ≤ 2000 chars
}
```

### Implementation

```ts
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!contactEmail) {
    console.warn('[portfolio] CONTACT_EMAIL is not set — contact form disabled');
    return NextResponse.json({ error: 'Contact form is not configured.' }, { status: 503 });
  }

  const body = await req.json();
  const { name, email, message } = body;

  // Server-side validation
  if (!name?.trim() || name.trim().length > 100) {
    return NextResponse.json({ error: 'Invalid name.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }
  if (!message?.trim() || message.trim().length > 2000) {
    return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
  }

  // Send email — using Resend or Nodemailer (swap transport here)
  await sendEmail({ to: contactEmail, from: email, name, message });

  return NextResponse.json({ success: true }, { status: 200 });
}
```

### Response Codes

| Code | Meaning |
|---|---|
| 200 | Message sent successfully |
| 400 | Client validation error (invalid fields) |
| 503 | `CONTACT_EMAIL` not configured |
| 500 | Unexpected server error |

---

## Environment Configuration

### Variables

```ini
# .env.example

# Email address that receives contact form submissions
CONTACT_EMAIL=your-email@example.com

# Base URL of the deployed site (used for OG canonical tag — no trailing slash)
NEXT_PUBLIC_SITE_URL=https://philip-lee.vercel.app
```

`CONTACT_EMAIL` is server-side only (no `NEXT_PUBLIC_` prefix). It is never serialised into the client bundle.

`NEXT_PUBLIC_SITE_URL` is used in `layout.tsx` to construct absolute URLs for Open Graph and canonical tags.

### Missing Config Behaviour

At server startup (or first request), if `CONTACT_EMAIL` is `undefined`:
1. The API route returns HTTP 503.
2. The `ContactSection` Server Component passes `contactEmailConfigured={false}` to `ContactForm`.
3. `ContactForm` renders the submit button as `<button disabled>Contact unavailable</button>`.

---

## Performance Strategy

### Code Splitting via Dynamic Imports

```ts
// All in their respective parent components:

// Phase 3 — R3F (Three.js ~600KB)
const HeroR3FDynamic = dynamic(() => import('@/components/ui/HeroR3F'), {
  ssr: false,
  loading: () => <HeroGradientFallback />,
});

// Phase 4b — Custom Cursor
const CustomCursorDynamic = dynamic(() => import('@/components/ui/CustomCursor'), {
  ssr: false,
});

// Phase 2a/2b — GSAP (loaded inside useEffect, not via dynamic())
// GSAP is imported at the top of the component file but inside a
// "use client" + useEffect so it never appears in the SSR bundle.
// ScrollTrigger is registered via gsap.registerPlugin() at runtime only.
```

### Image Optimisation

- `<Image priority />` on the Hero section monogram/image (LCP element).
- All other images use `loading="lazy"` (Next.js default).
- `next/image` handles WebP conversion and responsive `srcSet` automatically.

### Font Loading

```ts
// src/app/layout.tsx
import { Host_Grotesk, Inter } from 'next/font/google';

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
```

CSS custom properties `--font-display` and `--font-body` are applied to `:root` and referenced throughout Tailwind config via `fontFamily` extension.

### Bundle Budget

Target: initial JS < 200KB gzip. Strategy:
- R3F/Three.js: loaded only when `FEATURES.r3fHero && viewport >= 768`.
- Framer Motion: tree-shaken; only `motion`, `AnimatePresence`, `MotionConfig` imported by name.
- GSAP: only `gsap` core + `ScrollTrigger` plugin; no other GSAP modules.
- Lenis: ~8KB gzip; always loaded but deferred to `useEffect`.

### Tailwind CSS v4

Tailwind v4 uses a CSS-first configuration with `@theme` directives. Design token CSS variables are defined once in `globals.css` and referenced in `tailwind.config.ts` as `theme.extend` values. This eliminates duplicate token declarations.

---

## SEO Architecture (Phase 5)

```ts
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
  description: 'Full-stack developer specialising in Laravel architecture and local AI. Building clean, scalable solutions for complex business problems.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philip-lee.vercel.app'),
  openGraph: {
    type: 'website',
    title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
    description: 'Full-stack developer specialising in Laravel architecture and local AI.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
    description: 'Full-stack developer specialising in Laravel architecture and local AI.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};
```

The `metadataBase` ensures all relative image paths are resolved to absolute HTTPS URLs automatically.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The following properties were derived from acceptance criteria that are suitable for property-based testing. Criteria involving pure rendering logic, data-driven conditional rendering, input validation, and accessibility invariants are well-suited because: (a) behaviour varies meaningfully with input, (b) the logic is entirely in our code, and (c) 100+ iterations with generated inputs will expose edge cases that hand-written examples would miss.

### Property 1: ProjectCard Required Fields Completeness

*For any* `Project` data object, when `ProjectCard` is rendered with that data, the rendered output SHALL contain the project's category, year, every item in the `techStack` array, and every item in the `features` array.

**Validates: Requirements 6.2**

---

### Property 2: ProjectCard Conditional Content Matches Data

*For any* `Project` data object:
- If `repoUrl` is `undefined` or absent, the rendered output SHALL contain no anchor element whose `href` matches a repository URL pattern.
- If `repoUrl` is a non-empty string, the rendered output SHALL contain an anchor element with `href` equal to that `repoUrl`.
- If `reflectionText` is `undefined` or empty, the rendered output SHALL not contain a personal reflection subsection.
- If `reflectionText` is a non-empty string, the rendered output SHALL contain a personal reflection subsection displaying that text.

**Validates: Requirements 6.6, 6.8**

---

### Property 3: Form Required Fields Reject Whitespace-Only Input

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines) submitted as the `name` field or the `message` field, the `ContactForm` SHALL prevent form submission and SHALL display an inline validation error for that field.

**Validates: Requirements 8.4, 8.6**

---

### Property 4: Form Email Validation Rejects Non-RFC-5322 Strings

*For any* string that does not match the RFC 5322 practical email format (i.e., lacks an `@` symbol, has no domain part, has consecutive `@` symbols, or begins/ends with `@`), when submitted as the `email` field value, the `ContactForm` SHALL prevent form submission and SHALL display an inline validation error below the email field.

**Validates: Requirements 8.5**

---

### Property 5: Form Field Maximum Length Is Enforced

*For any* `name` string of length greater than 100 characters, the `name` input SHALL not allow submission (either via `maxLength` attribute capping at 100 or validation rejection). *For any* `message` string of length greater than 2000 characters, the `message` textarea SHALL not allow submission (either via `maxLength` attribute capping at 2000 or validation rejection).

**Validates: Requirements 8.10**

---

### Property 6: Footer Social Links Have All Required Attributes

*For every* social link rendered in the `Footer`, the following SHALL hold:
- The element has an `aria-label` attribute that matches the pattern `"Visit Philip Lee's [Platform] profile"` where `[Platform]` is the platform name.
- The element has `target="_blank"`.
- The element has a `rel` attribute that includes both `"noopener"` and `"noreferrer"`.

**Validates: Requirements 9.3, 9.4**

---

### Property 7: Exactly One H1 Per Page

*For any* render state of the portfolio page (regardless of which sections are visible, whether animations have completed, or which phase features are enabled), the rendered DOM SHALL contain exactly one `<h1>` element.

**Validates: Requirements 16.1**

---

### Property 8: Form Inputs Have Associated Visible Labels

*For every* `<input>` and `<textarea>` element rendered within `ContactForm`, there SHALL exist a `<label>` element in the DOM whose `htmlFor` attribute equals the input's `id` attribute. The label SHALL be visible (not `aria-hidden`).

**Validates: Requirements 16.6**

---

### Property 9: Icon-Only Interactive Elements Have Non-Empty aria-label

*For any* interactive element (button or anchor) whose visible text content is solely an SVG or empty string, the element SHALL have an `aria-label` attribute with a non-empty string value.

**Validates: Requirements 16.2**

---

## Error Handling

### Contact Form

| Scenario | Client Behaviour | API Response |
|---|---|---|
| Empty required field | Inline error on blur/submit, submission blocked | — |
| Invalid email format | Inline error on blur/submit, submission blocked | — |
| Field exceeds max length | Field constrained by `maxLength` attr, submit blocked | 400 |
| Network timeout / fetch failure | Error banner above submit button, fields preserved, button re-enabled | — |
| API 500 error | Error banner above submit button, fields preserved, button re-enabled | 500 |
| `CONTACT_EMAIL` not set | Submit button rendered as `disabled`, label "Contact unavailable" | 503 |

### R3F Component Errors

- If `HeroR3FInner` throws (WebGL not supported, etc.), the `Suspense` fallback (`HeroGradientFallback`) is displayed. The canvas error does not propagate to the page.
- A `React.ErrorBoundary` wraps the R3F dynamic import to catch render errors and fall back gracefully.

### Animation Library Errors

- GSAP / ScrollTrigger errors are non-fatal. If the ScrollTrigger setup fails (e.g., element refs are null), the `useEffect` is wrapped in a try/catch that logs a warning and renders elements in their final visible state.
- All animation `useEffect` hooks guard against null refs before calling GSAP APIs.

### Build / Environment

- TypeScript strict mode is enforced (`"strict": true` in `tsconfig.json`). Zero TS errors are required for `next build` to succeed.
- If `CONTACT_EMAIL` is missing at runtime, the API route returns 503 and logs a console warning — it never attempts to send to `undefined`.

---

## Testing Strategy

### Overview

This feature uses a **dual testing approach**:
1. **Property-based tests** — verify universal correctness properties derived from acceptance criteria.
2. **Example-based unit tests** — verify specific interactions, edge cases, static content, and accessibility behaviours.

Integration-level checks (Lighthouse scores, Core Web Vitals, `next build`) are run in CI and are not unit-testable.

### Property-Based Testing Library

The project uses **[fast-check](https://github.com/dubzzz/fast-check)** (TypeScript-native PBT library) with **Vitest** as the test runner.

```json
// devDependencies
"vitest": "^1.6.0",
"@testing-library/react": "^14",
"@testing-library/user-event": "^14",
"fast-check": "^3.18.0",
"jsdom": "^24"
```

Each property test runs a minimum of **100 iterations** (fast-check default). Tags reference the design property number.

### Property-Based Tests

**P1 — ProjectCard Required Fields:**
```ts
// Feature: philip-lee-portfolio, Property 1: ProjectCard renders all required fields
test.prop([fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  category: fc.string({ minLength: 1 }),
  year: fc.integer({ min: 2000, max: 2099 }),
  techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  features: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  outcomeMetrics: fc.array(fc.string()),
  imagePlaceholderType: fc.constantFrom('gradient', 'terminal'),
})])('renders category, year, all tech stack and feature items', (project) => {
  const { getByText } = render(<ProjectCard project={project} index={0} framerEnabled={false} />);
  expect(getByText(project.category)).toBeInTheDocument();
  expect(getByText(String(project.year))).toBeInTheDocument();
  project.techStack.forEach(t => expect(getByText(t)).toBeInTheDocument());
  project.features.forEach(f => expect(getByText(f)).toBeInTheDocument());
});
```

**P3 — Whitespace-Only Field Rejection:**
```ts
// Feature: philip-lee-portfolio, Property 3: whitespace-only required fields are rejected
test.prop([fc.stringMatching(/^\s+$/)])('whitespace-only name is rejected', async (ws) => {
  const user = userEvent.setup();
  const { getByLabelText, getByText } = render(<ContactForm contactEmailConfigured framerEnabled={false} />);
  await user.type(getByLabelText('Name'), ws);
  await user.tab(); // trigger blur validation
  expect(getByText(/name is required/i)).toBeInTheDocument();
});
```

**P4 — Invalid Email Rejection:**
```ts
// Feature: philip-lee-portfolio, Property 4: invalid emails are rejected
const invalidEmail = fc.oneof(
  fc.string().filter(s => !s.includes('@')),
  fc.string().map(s => '@' + s),
  fc.string().map(s => s + '@'),
  fc.tuple(fc.string({ minLength:1 }), fc.string({ minLength:1 })).map(([a,b]) => `${a}@@${b}`),
);
test.prop([invalidEmail])('invalid email triggers error', async (email) => {
  // ... render ContactForm, type email, blur, assert error shown
});
```

**P7 — Exactly One H1:**
```ts
// Feature: philip-lee-portfolio, Property 7: exactly one h1 per page
test('page render contains exactly one h1', () => {
  const { container } = render(<Page />);
  expect(container.querySelectorAll('h1')).toHaveLength(1);
});
// Note: this is a single deterministic test (no input variation) but is included as
// a property because it must hold across ALL phase configurations.
```

### Unit / Example-Based Tests

- **Navigation:** hamburger toggle sets `aria-expanded`, Lenis `scrollTo` called on anchor click.
- **HeroSection:** h1 text matches expected content, metadata text present.
- **About Section:** biography text verbatim, monogram present, tech list items present.
- **WorkSection:** two `ProjectCard` components rendered.
- **ContactForm:** valid submission flow (mock API → loading → success), error preserves values, disabled state when `contactEmailConfigured={false}`.
- **API route:** returns 503 when `CONTACT_EMAIL` undefined, returns 200 on valid body, returns 400 on invalid fields.
- **LenisProvider:** Lenis not instantiated when `prefers-reduced-motion` is active.
- **Accessibility:** skip-nav link is first focusable element, focus rings styled correctly, contrast ratios (checked via `color-contrast` utility against design tokens).
- **SEO:** `layout.tsx` exports correct metadata title, description length ≤ 155 chars, `og:image` and `twitter:image` present.

### Integration / CI Tests

| Check | Tool |
|---|---|
| Lighthouse Performance ≥ 90 | Lighthouse CI (`lhci autorun`) |
| FCP < 1.5s, LCP < 2.5s, CLS < 0.1 | Lighthouse CI |
| Bundle size < 200KB gzip | `next build` + `@next/bundle-analyzer` |
| `next build` exit code 0 | CI pipeline |
| TypeScript strict: zero errors | Part of `next build` |
| No literal email in source | `grep -r "reignortwist@gmail.com" src/` returning empty |
| `.env.example` contains `CONTACT_EMAIL` | Shell assertion in CI |
