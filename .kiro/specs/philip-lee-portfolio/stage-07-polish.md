# Stage 07 — Custom Cursor, SEO & Final Checks

> **Instructions for Claude Code:** Read and implement every step in this file in order. This is the final stage. When you reach the "Done when" checklist at the bottom, verify every item. When complete, the portfolio is ready to deploy.

---

## What this stage does

Adds the custom amber cursor for desktop, fills in all SEO metadata (Open Graph, Twitter Card), and runs a final accessibility + build check. After this stage the portfolio is production-ready.

---

## Step 1 — Create `src/components/ui/CustomCursorInner.tsx`

The actual cursor implementation. Never server-rendered — loaded only on desktop via the dynamic wrapper.

```tsx
// src/components/ui/CustomCursorInner.tsx
'use client';

import { useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CustomCursorInner() {
  const reducedMotion = useReducedMotion();

  const x = useSpring(0, { stiffness: 500, damping: 40 });
  const y = useSpring(0, { stiffness: 500, damping: 40 });
  const scale = useSpring(1, {
    stiffness: 400,
    damping: 30,
    duration: reducedMotion ? 0 : undefined,
  });

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide the OS cursor
    document.body.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 6); // offset by half diameter (12px / 2)
      y.set(e.clientY - 6);
    };

    const onEnter = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-cursor-hover]')) {
        scale.set(2.5);
      }
    };

    const onLeave = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-cursor-hover]')) {
        scale.set(1);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onEnter);
    window.addEventListener('mouseout', onLeave);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onEnter);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [x, y, scale]);

  return (
    <motion.div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        pointerEvents: 'none',
        zIndex: 9999,
        x,
        y,
        scale,
      }}
    />
  );
}
```

---

## Step 2 — Create `src/components/ui/CustomCursor.tsx`

The dynamic wrapper. Only rendered on desktop (viewport > 1024px).

```tsx
// src/components/ui/CustomCursor.tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { FEATURES } from '@/lib/features';

const CustomCursorInner = dynamic(() => import('./CustomCursorInner'), {
  ssr: false,
});

export function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!FEATURES.customCursor || !isDesktop) return null;

  return <CustomCursorInner />;
}
```

---

## Step 3 — Add CustomCursor to `layout.tsx`

Update `src/app/layout.tsx` to render the cursor outside the page content so it always floats on top:

```tsx
// Add import:
import { CustomCursor } from '@/components/ui/CustomCursor';

// Add inside <body>, after MotionProvider closes:
<body>
  <LenisProvider>
    <MotionProvider>
      {children}
    </MotionProvider>
  </LenisProvider>
  <CustomCursor />
</body>
```

---

## Step 4 — Verify `data-cursor-hover` attributes

The cursor scales up when it enters any element with `data-cursor-hover`. Check these are present (they were added in Stage 04):

- [ ] "View My Work" button in `HeroSection`
- [ ] "Get in Touch" button in `HeroSection`
- [ ] Each `<ProjectCard>` outer wrapper
- [ ] Contact form submit button in `ContactForm`
- [ ] Social icon links in `Footer`
- [ ] Nav links in `Navigation`

If any are missing, add `data-cursor-hover` to the element.

---

## Step 5 — Update `layout.tsx` with full SEO metadata

Replace the minimal metadata with the complete production version:

```tsx
// src/app/layout.tsx — updated metadata export

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
  description:
    'Full-stack developer specialising in Laravel architecture and local AI. Building clean, scalable solutions for complex business problems.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philip-lee.vercel.app'
  ),
  openGraph: {
    type: 'website',
    title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
    description:
      'Full-stack developer specialising in Laravel architecture and local AI.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philip Lee — Full-Stack Developer | Laravel & AI Specialist',
    description:
      'Full-stack developer specialising in Laravel architecture and local AI.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};
```

---

## Step 6 — Create the OG image placeholder

Create a 1200×630px placeholder image at `public/og-image.jpg`. The easiest approach is to create a simple SVG converted to JPG, or use any dark image with the amber colour. Mark it for replacement:

```
public/og-image.jpg    ← 1200×630 placeholder (dark background + amber "PL")
```

Add a comment in `layout.tsx` above the OG image line:
```ts
images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
// {/* REPLACE WITH REAL OG IMAGE */}
```

If you don't have an image tool available, you can generate one quickly with this command (requires ImageMagick, skip if unavailable — just place any 1200×630 JPG file):
```bash
# Optional — only if ImageMagick is installed
magick -size 1200x630 xc:#0E0E0E -fill '#D49B4A' -font Helvetica -pointsize 120 -gravity center -annotate 0 'PL' public/og-image.jpg
```

---

## Step 7 — Final accessibility checks

Run through this manually or with a screen reader:

- [ ] Tab through the page from top to bottom — focus order: skip-nav → nav → hero buttons → work cards → about → contact form fields → footer social links
- [ ] Press Tab with keyboard only — every interactive element gets a visible amber focus ring
- [ ] Skip-nav link appears on first Tab press and moves focus to `#main-content`
- [ ] Open DevTools → Accessibility panel → confirm exactly one `<h1>` on the page
- [ ] Check all icon-only elements (social links, hamburger) have non-empty `aria-label`
- [ ] Contact form: every `<input>` and `<textarea>` has a visible `<label>` (not hidden)

---

## Step 8 — Final build check

Run the production build. It must exit cleanly:

```bash
npx tsc --noEmit        # zero TypeScript errors
npx eslint src          # zero ESLint errors
npx vitest --run        # all tests pass
npm run build           # next build exits with code 0
```

Check the build output for bundle sizes. The initial JS should be under 200KB gzip. If it isn't, check:
- Three.js is only in the R3F dynamic chunk (not the main bundle)
- Framer Motion is only imported by `motion.*` named imports
- GSAP is only imported inside `useEffect` blocks

---

## Done when

All of the following:

- [ ] Custom amber cursor appears on desktop and follows the mouse
- [ ] Cursor scales up to 2.5× when hovering links, buttons, and project cards
- [ ] On mobile/tablet (≤ 1024px) the custom cursor does not render and `cursor: none` is not applied
- [ ] Page title in browser tab reads "Philip Lee — Full-Stack Developer | Laravel & AI Specialist"
- [ ] Sharing the URL on LinkedIn or Twitter shows the correct title, description, and OG image preview
- [ ] `public/og-image.jpg` exists at 1200×630px
- [ ] `npx vitest --run` passes all tests
- [ ] `npm run build` exits with code 0, zero TS errors, zero ESLint errors
- [ ] No `CONTACT_EMAIL` value appears anywhere in the built JavaScript (it's server-only)

---

## Asset replacement checklist (do after launch)

These items are marked with comments in the code — find them with a search for `REPLACE WITH`:

| Comment | File | What to do |
|---|---|---|
| `REPLACE WITH ACTUAL CV PDF` | `Navigation.tsx` | Upload your real CV as `/public/cv-philip-lee.pdf` and update the href |
| `REPLACE WITH PROFILE PHOTO` | `AboutSection.tsx` | Add your photo as `/public/profile.jpg` and use `<Image>` |
| `REPLACE WITH FRACA SCREENSHOT` | `ProjectCard.tsx` | Add screenshot as `/public/fraca-preview.jpg` |
| `REPLACE WITH NOVA SCREENSHOT` | `ProjectCard.tsx` | Add screenshot as `/public/nova-preview.jpg` |
| `REPLACE WITH REAL OG IMAGE` | `layout.tsx` | Design a 1200×630 branded image and place at `/public/og-image.jpg` |
| `UPDATE WITH REAL URLs` | `Footer.tsx` | Replace `href="/"` with your actual GitHub, LinkedIn, and X profile URLs |

---

> 🎉 All stages complete. The portfolio is ready to deploy.
