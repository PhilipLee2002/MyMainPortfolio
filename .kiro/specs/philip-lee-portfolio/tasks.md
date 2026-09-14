# Implementation Plan: Philip Lee Portfolio

## Overview

Five-phase build of a TRIONN-inspired, editorial-minimal SPA. Tasks follow the phase order: Foundation → Scroll Animations → Horizontal Slider → 3D Hero → Micro-interactions / Custom Cursor → SEO. Each task builds on the previous so every new piece integrates immediately rather than accumulating orphaned code.

## Tasks

- [ ] 1. Project scaffolding, design system, and core types
  - Install all required dependencies: `lenis`, `gsap`, `framer-motion`, `@react-three/fiber`, `@react-three/drei`, `three`, `@types/three`, `nodemailer` or `resend`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `fast-check`, `jsdom`
  - Create `src/types/index.ts` — define `Project`, `ContactFormData`, and `ContactFormState` interfaces
  - Create `src/lib/features.ts` — export `FEATURES` const with all phase flags (all `true`)
  - Create `src/lib/projects.ts` — export `FRACA`, `NOVA`, and `PROJECTS` typed constants
  - Create `src/lib/animations.ts` — export shared GSAP ease presets and duration constants
  - Update `src/app/globals.css` — define all Design_System CSS custom properties on `:root`, add Tailwind base imports with `@theme` directives for Tailwind v4 tokens
  - Update `src/app/layout.tsx` — configure `next/font` for Host Grotesk + Inter with CSS variables, set `<html lang="en">`, apply font variables to `<body>`, add Phase 5 `Metadata` export (title, description, OG, Twitter Card, canonical)
  - Create `.env.example` with `CONTACT_EMAIL` and `NEXT_PUBLIC_SITE_URL` placeholder entries
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 17.1, 17.5, 18.1, 18.2_

- [ ] 2. Hooks and provider infrastructure
  - [ ] 2.1 Create `src/hooks/useReducedMotion.ts` — `useEffect`-based hook that reads `window.matchMedia('(prefers-reduced-motion: reduce)')` and subscribes to changes
    - _Requirements: 11.5, 12.5, 13.5, 14.2, 16.5_
  - [ ] 2.2 Create `src/hooks/useLenis.ts` — create `LenisContext` and export a `useLenis` hook that returns the context ref
    - _Requirements: 10.1_
  - [ ] 2.3 Create `src/components/providers/LenisProvider.tsx` — `"use client"` provider that initialises Lenis with `lerp: 0.09`, registers GSAP ticker sync, calls `ScrollTrigger.refresh()`, and destroys on unmount; skips Lenis when `reducedMotion === true`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [ ] 2.4 Create `src/components/providers/MotionProvider.tsx` — `"use client"` wrapper with `MotionConfig` and `AnimatePresence`; sets `reducedMotion="always"` when `useReducedMotion()` is true
    - _Requirements: 13.5, 16.5_
  - [ ] 2.5 Update `src/app/layout.tsx` — wrap children in `<LenisProvider>` and `<MotionProvider>`
    - _Requirements: 10.1, 13.1_

- [ ] 3. Layout shell components
  - [ ] 3.1 Create `src/components/layout/SkipNav.tsx` — visually hidden skip link as the first focusable DOM element, labelled "Skip to main content", visible on focus, moves focus to `#main-content`
    - _Requirements: 16.7, 16.8_
  - [ ] 3.2 Create `src/components/layout/Navigation.tsx` — fixed 64px top bar, `z-50`; left wordmark "Philip Lee"; right links: Work, About, Contact (smooth-scroll via `useLenis`), CV download (`href="/cv-placeholder.pdf"` with `{/* REPLACE WITH ACTUAL CV PDF */}` comment); hamburger toggle on mobile (`<640px`) with `aria-expanded`/`aria-controls`; keyboard focus rings in Accent_Color
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 19.5_
  - [ ] 3.3 Create `src/components/layout/Footer.tsx` — copyright text "© 2026 Philip Lee. Built with Next.js & ☕"; GitHub, LinkedIn, X/Twitter icon links with `href="/"`, `{/* UPDATE WITH REAL URLs */}` comment, `aria-label` per pattern, `target="_blank"`, `rel="noopener noreferrer"`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 19.4_
  - [ ] 3.4 Write property test for Footer social links (Property 6)
    - **Property 6: Footer Social Links Have All Required Attributes**
    - **Validates: Requirements 9.3, 9.4**
    - Test that every rendered social link anchor has a matching `aria-label` pattern, `target="_blank"`, and `rel` containing `"noopener"` and `"noreferrer"`

- [ ] 4. Static section components (Phase 1 content)
  - [ ] 4.1 Create `src/components/sections/HeroSection.tsx` — `min-h-screen flex items-center`; `h1` "Building systems that think." with `clamp` sizing; sub-headline with body font weight 300–400; metadata line in muted colour; "View My Work" CTA (smooth-scroll to `#work`); "Get in Touch" CTA (smooth-scroll to `#contact`); accepts `r3fEnabled` prop (Phase 3 branch added later)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.9_
  - [ ] 4.2 Create `src/components/ui/ProjectCard.tsx` — renders category, year, tech stack chips, features list, outcome metrics, optional reflection text, image area with gradient/terminal placeholder components, optional repo link; accepts `project`, `index`, `framerEnabled` props
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.8, 19.2, 19.3_
  - [ ] 4.3 Write property test for ProjectCard required fields (Property 1)
    - **Property 1: ProjectCard Required Fields Completeness**
    - **Validates: Requirements 6.2**
    - Use `fc.record` to generate arbitrary valid `Project` objects; assert `category`, `year`, all `techStack` and `features` items appear in rendered output
  - [ ] 4.4 Write property test for ProjectCard conditional content (Property 2)
    - **Property 2: ProjectCard Conditional Content Matches Data**
    - **Validates: Requirements 6.6, 6.8**
    - Generate `Project` objects with arbitrary `repoUrl` (defined/undefined) and `reflectionText` (defined/empty/undefined); assert link presence/absence and reflection section presence/absence accordingly
  - [ ] 4.5 Create `src/components/sections/WorkSection.tsx` — renders heading, maps `PROJECTS` to `<ProjectCard>` components; conditional `HorizontalSlider` branch when `FEATURES.horizontalSlider` (adds slider later); passes `framerEnabled`
    - _Requirements: 6.1, 7.1_
  - [ ] 4.6 Create `src/components/sections/AboutSection.tsx` — verbatim biography text; "PL" monogram ≥ 80×80px with `{/* REPLACE WITH PROFILE PHOTO */}` comment; tech area tag group (Laravel, PHP, MySQL, Python, AI tooling, Next.js); university status line in muted colour
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 19.1_
  - [ ] 4.7 Create `src/components/sections/ContactSection.tsx` — `h2` heading and sub-heading; renders `<ContactForm>` passing `contactEmailConfigured` (read from `process.env.CONTACT_EMAIL` check server-side) and `framerEnabled`
    - _Requirements: 8.1_
  - [ ] 4.8 Create `src/components/ui/ContactForm.tsx` — controlled form with `useReducer` for `ContactFormState`; Name, Email, Message fields each with `<label htmlFor>`; blur + submit validation (whitespace-only rejection, RFC 5322 email check, max lengths); loading/success/error states; POST to `/api/contact`; disabled state when `contactEmailConfigured={false}`
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.10, 16.6, 18.3_
  - [ ] 4.9 Write property test for whitespace-only field rejection (Property 3)
    - **Property 3: Form Required Fields Reject Whitespace-Only Input**
    - **Validates: Requirements 8.4, 8.6**
    - Use `fc.stringMatching(/^\s+$/)` for name and message; assert inline error shown and submission blocked on blur
  - [ ] 4.10 Write property test for invalid email rejection (Property 4)
    - **Property 4: Form Email Validation Rejects Non-RFC-5322 Strings**
    - **Validates: Requirements 8.5**
    - Use `fc.oneof` to generate strings without `@`, starting with `@`, ending with `@`, or containing `@@`; assert error shown and submission blocked
  - [ ] 4.11 Write property test for form field max-length enforcement (Property 5)
    - **Property 5: Form Field Maximum Length Is Enforced**
    - **Validates: Requirements 8.10**
    - Generate `name` strings > 100 chars and `message` strings > 2000 chars; assert submission is blocked
  - [ ] 4.12 Write property test for form input label association (Property 8)
    - **Property 8: Form Inputs Have Associated Visible Labels**
    - **Validates: Requirements 16.6**
    - Assert every `<input>` and `<textarea>` in `ContactForm` has a `<label>` whose `htmlFor` matches the input's `id`, and the label is not `aria-hidden`
  - [ ] 4.13 Create `src/app/api/contact/route.ts` — `POST` handler; reads `CONTACT_EMAIL`; server-side validation (name ≤ 100, email RFC 5322, message ≤ 2000); returns 503 if `CONTACT_EMAIL` unset; calls `sendEmail`; returns 200/400/500 as appropriate
    - _Requirements: 8.7, 18.1, 18.3, 18.6_
  - [ ] 4.14 Update `src/app/page.tsx` — assemble all sections in correct landmark order; `<SkipNav>`, `<Navigation>`, `<main id="main-content">` containing `<HeroSection>`, `<WorkSection>`, `<AboutSection>`, `<ContactSection>`, `<Footer>`
    - _Requirements: 4.9, 16.1, 16.7_
  - [ ] 4.15 Write property test for exactly one H1 (Property 7)
    - **Property 7: Exactly One H1 Per Page**
    - **Validates: Requirements 16.1**
    - Render the full `<Page>` component and assert `container.querySelectorAll('h1')` has length exactly 1 across all feature flag configurations
  - [ ] 4.16 Write property test for icon-only aria-label (Property 9)
    - **Property 9: Icon-Only Interactive Elements Have Non-Empty aria-label**
    - **Validates: Requirements 16.2**
    - Assert all buttons and anchors whose visible text is empty or solely SVG have a non-empty `aria-label`
  - [ ] 4.17 Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Scroll-triggered animations (Phase 2a — GSAP + ScrollTrigger)
  - [ ] 5.1 Create `src/components/ui/GSAPAnimator.tsx` (or inline into each section) — `"use client"` component; import GSAP and ScrollTrigger inside `useEffect`; guard with `FEATURES.scrollAnimations` and `useReducedMotion()`; implement:
    - Hero background parallax (`y: 0 → 80px`, scrub, no `ease`)
    - Section heading fade-up (`opacity: 0, y: 24 → opacity: 1, y: 0`, trigger at 85%, `power2.out`, 0.85s)
    - Project card stagger entry (`opacity: 0, y: 40 → opacity: 1, y: 0`, trigger at 80%, `power2.out`, 1.0s, stagger 0.15s)
    - Project detail timeline (≤ 1.2s total)
    - Cleanup: `ScrollTrigger.kill()` on unmount
    - Wrap all `useEffect` logic in try/catch; fall back to final visible state on error
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 6. Horizontal project slider (Phase 2b — GSAP ScrollTrigger pin)
  - [ ] 6.1 Create `src/components/ui/HorizontalSlider.tsx` — accepts `projects` and `reducedMotion` props; if `reducedMotion` renders vertical stack; otherwise: pinned ScrollTrigger that translates `containerRef` by `-(scrollWidth - innerWidth)`, `scrub: 1`, `anticipatePin: 1`; CSS `scroll-snap-type: x mandatory` on container, `scroll-snap-align: start` on each panel; slide-in animation for panels on snap (0.4–0.6s ease-out); destroy ScrollTrigger on unmount
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [ ] 6.2 Wire `HorizontalSlider` into `WorkSection` — conditional on `FEATURES.horizontalSlider`; pass `PROJECTS` and `reducedMotion` result from `useReducedMotion()`
    - _Requirements: 7.1_
  - [ ] 6.3 Checkpoint — Verify horizontal scroll behaviour and reduced-motion fallback; ensure all existing tests still pass.

- [ ] 7. 3D Hero accent (Phase 3 — React Three Fiber)
  - [ ] 7.1 Create `src/components/ui/HeroGradientFallback.tsx` — static CSS gradient shape occupying the same bounding box as the R3F canvas; used as Suspense fallback and on mobile/SSR
    - _Requirements: 12.3, 12.4_
  - [ ] 7.2 Create `src/components/ui/HeroR3FInner.tsx` — `"use client"` inner R3F component; `<Canvas>` with `<IcosahedronGeometry args={[1, 1]} />`, `<MeshStandardMaterial wireframe />`, ambient + amber point lights; `useRef` for mouse position; `useFrame` lerps X/Y rotation ±15° and position ±20px based on cursor; wraps in `React.ErrorBoundary` falling back to `<HeroGradientFallback />`; if `reducedMotion` skips `useFrame` updates
    - _Requirements: 12.2, 12.5_
  - [ ] 7.3 Create `src/components/ui/HeroR3F.tsx` — `next/dynamic` wrapper: `dynamic(() => import('./HeroR3FInner'), { ssr: false, loading: () => <HeroGradientFallback /> })`
    - _Requirements: 12.1, 12.4, 15.6, 15.8_
  - [ ] 7.4 Update `HeroSection.tsx` — add `r3fEnabled` prop branch: if `FEATURES.r3fHero && viewport >= 768` render `<HeroR3FDynamic />`; else render `<HeroGradientFallback />`; use `next/image` with `priority` on the hero monogram element
    - _Requirements: 4.7, 4.8, 12.2, 12.3, 15.7_
  - [ ] 7.5 Checkpoint — Confirm 3D canvas loads on desktop, gradient fallback appears on mobile/SSR, no CLS; ask the user if questions arise.

- [ ] 8. Page transitions, micro-interactions, and contact form success animation (Phase 4a — Framer Motion)
  - [ ] 8.1 Export `pageVariants` from `src/lib/animations.ts` — `initial: { opacity: 0, y: -16 }`, `animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }`, `exit` inverse; wrap `app/page.tsx` content in a `motion.div` using these variants
    - _Requirements: 13.1_
  - [ ] 8.2 Update `Navigation.tsx` — add `motion.span` underline on nav links when `FEATURES.framerMotion`; `scaleX: 0 → 1`, `transformOrigin: "left"`, 0.35s ease-out; guarded by `framerEnabled`
    - _Requirements: 3.6, 13.3_
  - [ ] 8.3 Update `ProjectCard.tsx` — add `whileHover={{ scale: 1.03 }}` on card wrapper and `whileHover={{ scale: 1.05 }}` with amber glow overlay on image area when `framerEnabled && FEATURES.framerMotion`; `transition: { duration: 0.35, ease: 'easeOut' }`
    - _Requirements: 6.7, 13.2_
  - [ ] 8.4 Update `ContactForm.tsx` — add `<AnimatePresence>` around form fields; on `status === 'success'`, animate fields out (`opacity: 1 → 0`) and animate in checkmark icon + confirmation message using Framer Motion over 0.4–0.6s; guard with `framerEnabled`
    - _Requirements: 8.9, 13.4_
  - [ ] 8.5 Checkpoint — Verify page transition, card hover, nav underline, and success animation; check `reducedMotion="always"` suppresses all; ask the user if questions arise.

- [ ] 9. Custom cursor (Phase 4b)
  - [ ] 9.1 Create `src/components/ui/CustomCursorInner.tsx` — `"use client"` inner component; `useEffect` attaches `mousemove` listener, updates `translate(x, y)` via CSS transform on a `pointer-events: none; position: fixed; z-index: 9999` div; 12px amber circle; `mouseover` on `[data-cursor-hover]` sets Framer Motion `useSpring` scale to 2.5×; hides OS cursor via `document.body.style.cursor = 'none'`; restores cursor on unmount; skip spring transition if `reducedMotion`
    - _Requirements: 14.1, 14.2_
  - [ ] 9.2 Create `src/components/ui/CustomCursor.tsx` — `next/dynamic` wrapper: `dynamic(() => import('./CustomCursorInner'), { ssr: false })`; only rendered when `FEATURES.customCursor && viewport > 1024`
    - _Requirements: 14.3, 14.4, 15.8_
  - [ ] 9.3 Add `data-cursor-hover` attribute to all interactive elements: nav links, CTA buttons, project cards, social links, contact form submit button
    - _Requirements: 14.2_
  - [ ] 9.4 Checkpoint — Confirm custom cursor renders and scales on hover on desktop; confirm absent on mobile/tablet; ask the user if questions arise.

- [ ] 10. SEO, Open Graph, and final accessibility pass
  - [ ] 10.1 Finalize `layout.tsx` metadata — confirm `title`, `description` (≤ 155 chars), `og:type`, `og:title`, `og:description`, `og:image` (1200×630 absolute HTTPS URL), `og:url`; add `twitter:card: "summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`; set `metadataBase` to `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philip-lee.vercel.app')`; add `alternates: { canonical: '/' }`
    - _Requirements: 17.1, 17.2, 17.3, 17.4_
  - [ ] 10.2 Add a placeholder `public/og-image.jpg` (1200×630 amber-tinted image or solid colour) so OG/Twitter image tag resolves without a broken URL; add JSX comment `{/* REPLACE WITH REAL OG IMAGE */}` near the metadata declaration
    - _Requirements: 17.2, 17.3_
  - [ ] 10.3 Run accessibility audit — verify: one `h1`, `aria-label` on all icon-only elements, all form inputs have visible `<label>` with matching `htmlFor`/`id`, skip-nav is first focusable element, keyboard tab order matches visual order, focus rings visible in Accent_Color
    - _Requirements: 16.1, 16.2, 16.4, 16.6, 16.7, 16.8_
  - [ ] 10.4 Verify responsive layout — confirm single-column mobile stack, two-column tablet, desktop layout at all three breakpoints; verify all touch targets ≥ 44×44px on mobile
    - _Requirements: 2.1, 2.2, 2.3, 2.6_
  - [ ] 10.5 Final checkpoint — Run `next build`; confirm exit code 0, zero TypeScript errors, zero ESLint errors; confirm `CONTACT_EMAIL` not present in any source file; ask the user if questions arise.
    - _Requirements: 18.4, 18.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The design uses TypeScript throughout — all code must pass `"strict": true` type checking
- Checkpoints at the end of each phase ensure incremental validation before moving to the next animation layer
- Property tests use `fast-check` + `vitest`; run with `npx vitest --run`
- GSAP, Framer Motion, and R3F are never imported outside `"use client"` + `useEffect` boundaries to avoid SSR/hydration issues
- All feature flags live in `src/lib/features.ts`; toggling a flag enables/disables that phase without branching the codebase
- Real assets (profile photo, project screenshots, OG image, CV PDF, social URLs) are all marked with JSX comments for easy find-and-replace

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "2.2"] },
    { "id": 1, "tasks": ["2.3", "2.4"] },
    { "id": 2, "tasks": ["2.5", "3.1", "3.2", "3.3"] },
    { "id": 3, "tasks": ["3.4", "4.1", "4.2", "4.6", "4.7", "4.13"] },
    { "id": 4, "tasks": ["4.3", "4.4", "4.5", "4.8", "4.12", "4.16"] },
    { "id": 5, "tasks": ["4.9", "4.10", "4.11", "4.14", "4.15"] },
    { "id": 6, "tasks": ["4.17", "5.1"] },
    { "id": 7, "tasks": ["6.1", "7.1", "7.2"] },
    { "id": 8, "tasks": ["6.2", "6.3", "7.3"] },
    { "id": 9, "tasks": ["7.4"] },
    { "id": 10, "tasks": ["7.5", "8.1"] },
    { "id": 11, "tasks": ["8.2", "8.3", "8.4"] },
    { "id": 12, "tasks": ["8.5", "9.1"] },
    { "id": 13, "tasks": ["9.2"] },
    { "id": 14, "tasks": ["9.3"] },
    { "id": 15, "tasks": ["9.4", "10.1", "10.2"] },
    { "id": 16, "tasks": ["10.3", "10.4"] },
    { "id": 17, "tasks": ["10.5"] }
  ]
}
```
