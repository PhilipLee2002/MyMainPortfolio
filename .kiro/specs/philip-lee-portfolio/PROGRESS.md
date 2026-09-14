# Development Progress Log — Philip Lee Portfolio

This file tracks what has been completed, what is in progress, decisions made along the way, and any issues encountered. Update it at the end of every stage.

---

## ⚠️ Standing Warning — Next.js 16

This project uses **Next.js 16** (currently installed: `16.3.0`). This is a newer version than most AI training data covers. Breaking changes may exist.

**Before writing any Next.js-specific code, read the local docs:**
```
node_modules/next/dist/docs/01-app/
```

Key things to verify against the local docs before assuming they work:
- `Metadata` API shape in `layout.tsx`
- `next/font` import paths and configuration
- `next/dynamic` signature
- App Router server vs. client component boundaries
- `NextRequest` / `NextResponse` in API routes

The AGENTS.md at the project root enforces this rule. It is re-generated automatically by `next dev` — do not delete it.

---

## Project Overview

**What:** Philip Lee's developer portfolio — a dark, editorial single-page app.
**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Lenis, GSAP, Framer Motion, React Three Fiber.
**Build approach:** 7 sequential stages, each verified before the next begins.

---

## Stage Status

| Stage | File | Status | Started | Completed |
|-------|------|--------|---------|-----------|
| 1 | `stage-01-scaffolding.md` | ✅ Complete | 2026-08-08 | 2026-08-08 |
| 2 | `stage-02-providers.md` | ✅ Complete | 2026-08-08 | 2026-08-08 |
| 3 | `stage-03-layout.md` | ✅ Complete | 2026-08-08 | 2026-08-08 |
| 4 | `stage-04-sections.md` | ✅ Complete | 2026-08-08 | 2026-08-08 |
| 5 | `stage-05-animations.md` | ✅ Complete | 2026-08-08 | 2026-08-08 |
| 6 | `stage-06-3d-motion.md` | ✅ Complete | 2026-08-08 | 2026-08-08 |
| 7 | `stage-07-polish.md` | ✅ Complete | 2026-08-09 | 2026-08-09 |

**Status key:** ⬜ Not started · 🔄 In progress · ✅ Complete · ❌ Blocked

---

## Package State (confirmed 2026-08-08, updated after Stage 01)

### Installed
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.3.0 | Framework |
| `react` | 19.2.8 | UI library |
| `react-dom` | 19.2.8 | DOM renderer |
| `tailwindcss` | ^4 | Utility CSS |
| `typescript` | ^5 | Type safety |
| `eslint` | ^9 | Linting |
| `lenis` | ^1.3.26 | Smooth scroll |
| `gsap` | ^3.15.0 | Scroll animations + horizontal slider |
| `framer-motion` | ^13.0.0 | Page transitions, hover effects |
| `@react-three/fiber` | ^9.7.0 | React renderer for Three.js |
| `@react-three/drei` | ^10.7.8 | R3F helpers |
| `three` | ^0.185.1 | 3D engine |
| `resend` | ^6.18.1 | Contact form email sending |
| `vitest` | ^4.1.10 | Test runner |
| `@testing-library/react` | ^16.3.2 | Component testing |
| `@testing-library/user-event` | ^14.6.3 | User interaction simulation |
| `@testing-library/jest-dom` | ^7.0.0 | Custom jest-dom matchers |
| `@vitejs/plugin-react` | ^6.0.5 | Vite React plugin for Vitest |
| `fast-check` | ^4.9.0 | Property-based testing |
| `jsdom` | ^29.1.1 | DOM environment for tests |
| `@types/three` | ^0.185.4 | TypeScript types for Three.js |

---

## Stage 01 — Scaffolding

**Status:** ✅ Complete (2026-08-08)

### Files to create / modify
- `src/types/index.ts` — Project, ContactFormData, ContactFormState interfaces ✅
- `src/lib/features.ts` — Phase feature flags ✅
- `src/lib/projects.ts` — FRACA and Nova project data ✅
- `src/lib/animations.ts` — Shared GSAP/Framer Motion constants ✅
- `src/app/globals.css` — Design system CSS tokens + Tailwind v4 theme ✅
- `src/app/layout.tsx` — Fonts (Host Grotesk + Inter), base HTML shell ✅
- `.env.example` + `.env.local` — CONTACT_EMAIL and NEXT_PUBLIC_SITE_URL placeholders ✅
- `vitest.config.ts` — Test runner configuration ✅
- `vitest.setup.ts` — jest-dom setup ✅

Verified: `npx tsc --noEmit` clean, `npx vitest --run` exits 0, `npm run dev` serves HTTP 200.

### Issues encountered

### Issue: Corrupted native SWC binary on dev server start
- **Symptom:** `npm run dev` failed with `Error: Turbopack is not supported on this platform (win32/x64) because native bindings are not available` after a preceding warning that `@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node is not a valid Win32 application`.
- **Root cause:** This project directory lives inside a OneDrive-synced folder. OneDrive's file sync corrupted the native `.node` binary during the initial `create-next-app` install (the file had a normal-looking size on disk but was not valid binary content).
- **Fix:** Removed `node_modules/@next/swc-win32-x64-msvc` and reinstalled it directly (`npm install @next/swc-win32-x64-msvc@16.3.0 --no-save`). Dev server started cleanly afterward.
- **Affects:** No source files — `node_modules` only. Flagging here in case it recurs in a later stage after further OneDrive syncs.

### Decisions made
- Added `test.passWithNoTests: true` to `vitest.config.ts` (not specified verbatim in `stage-01-scaffolding.md`). Without it, `vitest --run` exits with code 1 when no test files exist yet, which fails the "exits cleanly" done-when criterion since Stage 01 doesn't add any test files (those start in Stage 3/4).
- Cross-checked `layout.tsx`'s `Metadata` export and `next/font/google` usage against the local docs at `node_modules/next/dist/docs/01-app/` per the standing Next.js 16 warning below — both match current API shape, no changes needed.

---

## Stage 02 — Providers

**Status:** ✅ Complete (2026-08-08)

### Files to create / modify
- `src/hooks/useReducedMotion.ts` ✅
- `src/hooks/useLenis.ts` ✅
- `src/components/providers/LenisProvider.tsx` ✅
- `src/components/providers/MotionProvider.tsx` ✅
- `src/app/layout.tsx` — wrap children in `<LenisProvider><MotionProvider>` ✅

Verified: `npx tsc --noEmit` clean, `npx vitest --run` exits 0, dev server compiles `/` with no errors and correct `<title>`.

### Issues encountered

### Issue: Stale dev server from Stage 01 blocked port 3000
- **Symptom:** Running `npm run dev` to verify Stage 02 printed `⨯ Another next dev server is already running` and fell back to port 3001.
- **Root cause:** The Stage 01 verification's `npm run dev` background process (PID 16936) was still alive; the earlier `TaskStop` on its shell wrapper didn't kill the underlying `next dev` process.
- **Fix:** Confirmed the still-running instance had already hot-reloaded the Stage 02 changes correctly (checked its dev log and page `<title>`), then `taskkill /PID 16936 /F` to clean it up.
- **Affects:** No source files — process/tooling only.

### Decisions made
_None beyond what stage-02-providers.md specifies._

---

## Stage 03 — Layout Shell

**Status:** ✅ Complete (2026-08-08)

### Files to create / modify
- `src/components/layout/SkipNav.tsx` ✅
- `src/components/layout/Navigation.tsx` ✅
- `src/components/layout/Footer.tsx` ✅
- `src/components/layout/__tests__/Footer.test.tsx` ✅
- `src/app/page.tsx` — nav + footer shell ✅

Verified: `npx tsc --noEmit` clean, `npx vitest --run` passes (Footer social-link test, 1/1), dev server renders the fixed nav (wordmark, Work/About/Contact, Download CV, hamburger `aria-expanded`/`aria-controls`) and footer (copyright + 3 social icons with correct `aria-label`/`target`/`rel`) with no runtime errors.

### Issues encountered

### Issue: `TaskStop` didn't kill the underlying `next dev` process (recurring)
- **Symptom:** After stopping the background shell task running `npm run dev`, port 3000 was still serving the old page.
- **Root cause:** `next dev` (Turbopack) spawns a detached child process; stopping the wrapper shell task doesn't send a signal to that child.
- **Fix:** Look up the PID via `netstat -ano | grep :3000` and `taskkill /PID <pid> /F` directly. Same pattern as the Stage 02 issue — noting it again since it recurred.
- **Affects:** No source files — process/tooling only.

### Decisions made
_None beyond what stage-03-layout.md specifies._

---

## Stage 04 — Static Sections

**Status:** ✅ Complete (2026-08-08)

### Files to create / modify
- `src/components/sections/HeroSection.tsx` ✅
- `src/components/ui/ProjectCard.tsx` ✅
- `src/components/sections/WorkSection.tsx` ✅
- `src/components/sections/AboutSection.tsx` ✅
- `src/components/ui/ContactForm.tsx` ✅
- `src/components/sections/ContactSection.tsx` ✅
- `src/app/api/contact/route.ts` ✅ (verified `NextRequest`/`NextResponse` route handler shape and `resend`'s `emails.send` types against `node_modules/next/dist/docs` and `node_modules/resend/dist/index.d.mts` before writing — both match, no changes needed)
- `src/app/page.tsx` — full section assembly ✅
- `src/components/ui/__tests__/ProjectCard.test.tsx` ✅ (fixed — see issues below)
- `src/components/ui/__tests__/ContactForm.test.tsx` ✅ (fixed — see issues below)

Verified: `npx tsc --noEmit` clean, `npx vitest --run` passes all 5 tests (Footer, ProjectCard ×2, ContactForm ×2), dev server renders all sections with correct content — Hero CTAs, FRACA repo link present, Nova has none, contact form submit button enabled (since `.env.local` has `CONTACT_EMAIL` set).

### Issues encountered

### Issue: Property tests as written in stage-04-sections.md failed for reasons unrelated to component correctness
- **Symptom:** After creating `ProjectCard.test.tsx` and `ContactForm.test.tsx` verbatim from the stage doc, `npx vitest --run` failed 3 of 5 tests: the two `ContactForm` property tests timed out at 5000ms, and the `ProjectCard` "required fields" test failed on a whitespace-only counterexample.
- **Root cause:** Three separate bugs in the example test code itself (not in `ProjectCard.tsx` or `ContactForm.tsx`):
  1. Neither property test called RTL's `cleanup()` between the ~100 generated iterations inside a single `it()` block, so each iteration's `render()` call accumulated DOM nodes on top of the last, making `getByLabelText`/`getByText` progressively slower until the whole test blew past the 5s default timeout.
  2. The `ProjectCard` arbitrary used plain `fc.string({ minLength: 1 })` for `category`/`title`/`techStack`/`features`, which permits whitespace-only strings (e.g. `" "`). RTL's `getByText` normalizes (trims/collapses whitespace on) both the query and the DOM text before comparing, so a whitespace-only value can never match — a false failure, not a real rendering bug.
  3. Independently-generated fields can coincidentally produce the same string (e.g. `category === "!" === title === a tech-stack entry`), and `getByText` throws when more than one element matches — again a query problem, not a component bug.
- **Fix:** Added `cleanup()` at the start of each property-test iteration in both files, bumped those four `it()` blocks to a 20000ms timeout (100 jsdom renders per test is inherently slower than the 5s default), constrained the `ProjectCard` string arbitrary to `fc.string({minLength:1}).filter(s => s.trim().length > 0)` for text fields that get asserted on, and replaced the RTL `getByText`/`getAllByText` assertions in the P1 test with a plain `container.textContent.toContain(...)` substring check — which matches the property's actual intent ("value appears somewhere in rendered output") without RTL's normalization/uniqueness semantics getting in the way.
- **Affects:** `src/components/ui/__tests__/ProjectCard.test.tsx`, `src/components/ui/__tests__/ContactForm.test.tsx`. No production component code changed.

### Decisions made
_None beyond what stage-04-sections.md specifies, aside from the test fixes above._

---

## Stage 05 — Scroll Animations

**Status:** ✅ Complete (2026-08-08)

### Files to create / modify
- `src/components/ui/ScrollReveal.tsx` ✅
- `src/components/ui/HorizontalSlider.tsx` ✅
- `src/components/sections/WorkSection.tsx` — wire in slider + ScrollReveal ✅
- `src/components/sections/HeroSection.tsx` — add parallax background ✅
- `src/components/sections/AboutSection.tsx` — add heading reveal ✅
- `src/components/sections/ContactSection.tsx` — add heading reveal ✅

Verified: `npx tsc --noEmit` clean, `npx vitest --run` passes all 5 tests unchanged, dev server compiles with no errors, `GET /` returns 200, and rendered HTML confirms all four section IDs plus the horizontal slider's `scroll-snap` markup are present. Animation behavior itself (fade-in timing, parallax offset, pinned scroll) was not visually verified in a live browser — no browser-automation tool was available in this session, so this was confirmed via clean compilation, markup inspection, and code review against the stage spec rather than an on-screen check. Recommend a manual scroll-through before shipping.

### Issues encountered

### Issue: `TaskStop` didn't kill the underlying `next dev` process (recurring, 3rd occurrence)
- **Symptom:** After `TaskStop` on the background shell running `npm run dev`, `netstat -ano | grep :3000` still showed a `LISTENING` process.
- **Root cause:** Same as Stage 02/03 — Turbopack's `next dev` spawns a detached child process that the shell wrapper's stop doesn't reach.
- **Fix:** `netstat -ano | grep :3000` to find the PID, then `taskkill //PID <pid> //F` (Git Bash requires `//` to stop MSYS from rewriting the flag as a path).
- **Affects:** No source files — process/tooling only.

### Decisions made
- Dropped the unused `import { FEATURES } from '@/lib/features'` from `HorizontalSlider.tsx` that appears in the stage doc's example — the component never references `FEATURES` (the parent `WorkSection` already gates on `FEATURES.horizontalSlider` before rendering it), so keeping the import would just be dead code.

---

## Stage 06 — 3D Hero & Framer Motion

**Status:** ✅ Complete (2026-08-08)

### Files to create / modify
- `src/components/ui/HeroGradientFallback.tsx` ✅
- `src/components/ui/HeroR3FInner.tsx` ✅
- `src/components/ui/HeroR3F.tsx` ✅ (added `'use client'` — required since the file uses hooks, an error-boundary class with state, and `dynamic(..., { ssr: false })`, none of which the stage doc's example directive-less version would satisfy per Next's own docs: "`ssr: false` option will only work for Client Components")
- `src/components/sections/HeroSection.tsx` — swapped in `{FEATURES.r3fHero ? <HeroR3F /> : <HeroGradientFallback />}`, kept the existing Stage 05 parallax `bgRef` on a wrapping div around the conditional so the GSAP scroll parallax still applies to whichever visual is shown ✅
- `src/components/providers/PageTransition.tsx` ✅ (new — not in the stage doc's file list; see decision below)
- `src/app/page.tsx` — added the page-fade transition via `PageTransition`, kept as a Server Component ✅
- `src/components/ui/ProjectCard.tsx` — hover scale on card + image via `framerEnabled` branch ✅
- `src/components/layout/Navigation.tsx` — underline animation on desktop nav links ✅
- `src/components/ui/ContactForm.tsx` — animated success checkmark ✅

Verified: `npx tsc --noEmit` clean, `npx vitest --run` passes all 5 tests unchanged, dev server compiles with no errors, `GET /` returns 200. Rendered HTML confirms: no `<canvas>` in the initial SSR payload (correct — `HeroR3FInner` loads via `dynamic(..., { ssr: false })`), the SSR/loading state renders `HeroGradientFallback`'s exact markup in its place, the contact submit button renders "Send Message" (not "Contact unavailable"), confirming `CONTACT_EMAIL` is still read server-side correctly after the `PageTransition` refactor, and `motion.main` renders its SSR `initial` state (`opacity:0`, `translateY(-16px)`) inline. Hover-driven interactions (3D shape following the mouse, card hover scale, nav underline, success-state animation) were **not** visually verified in a live browser — no browser-automation tool was available this session, same constraint as Stage 05. Recommend a manual check (mouse over the hero shape, a project card, and a nav link; submit the contact form) before shipping.

### Issues encountered

### Issue: Stage doc's `page.tsx` example would silently break the contact form
- **Symptom:** N/A — caught during implementation, before it could manifest. Would have shown "Contact unavailable" on the deployed contact form even with `CONTACT_EMAIL` correctly set.
- **Root cause:** The stage doc's Step 5 has `page.tsx` itself declare `'use client'` at the top and directly import/render `ContactSection` (a Server Component that reads the server-only `CONTACT_EMAIL` env var via `Boolean(process.env.CONTACT_EMAIL)`). Per Next.js's own docs (`node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`): once a file has `'use client'`, everything it directly imports and renders joins the client module graph — and non-`NEXT_PUBLIC_` env vars are replaced with an empty string in client bundles. `ContactSection` would have been silently pulled into the client bundle, making `contactEmailConfigured` always evaluate to `false` in the browser. This exact risk is already called out in this file's own "Known Decisions & Constraints" table (#6).
- **Fix:** Kept `src/app/page.tsx` as a Server Component (no `'use client'`) and extracted the motion wrapper into `src/components/providers/PageTransition.tsx` (Client Component, accepts `children`). `page.tsx` passes `<HeroSection /><WorkSection /><AboutSection /><ContactSection />` as `children` into `<PageTransition>` — the documented "Interleaving Server and Client Components" slot pattern, where Server Component children are rendered server-side and passed as already-rendered output, never entering the client's module graph. Same visual page-fade result, no env var regression.
- **Affects:** `src/app/page.tsx`, `src/components/providers/PageTransition.tsx` (new file, not in the stage doc's list).

### Issue: Stage doc's nav underline example binds `whileHover` to the underline itself, not the link
- **Symptom:** N/A — caught during implementation via code review, before manual testing.
- **Root cause:** The stage doc's Step 7 puts `whileHover={{ scaleX: 1 }}` directly on the absolutely-positioned `motion.span` underline (a 1px-tall strip pinned to the bottom of the button), rather than on the button itself. Framer Motion's `whileHover` only fires for pointer events on that exact element, so a user would have to hover the literal 1px sliver at the bottom of the link — not the link text — for the animation to trigger, which fails the stage's own "Done when" checklist item ("Hovering a nav link shows an amber underline that animates from left to right").
- **Fix:** Made the desktop nav link itself a `motion.button` with `initial="rest" animate="rest" whileHover="hover"`, and gave the underline `motion.span` matching `variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}` instead of its own `whileHover`. Framer Motion propagates an ancestor's active variant down to descendant `motion` components that share a variant key and don't define their own `animate`/`while*` — so hovering anywhere on the link now drives the underline.
- **Affects:** `src/components/layout/Navigation.tsx`.

### Issue: `TaskStop` didn't kill the underlying `next dev` process (recurring, 4th occurrence)
- **Symptom:** After `TaskStop` on the background shell running `npm run dev`, `netstat -ano | grep :3000` still showed a `LISTENING` process (PID 85836).
- **Root cause:** Same as Stages 02/03/05 — Turbopack's `next dev` spawns a detached child process that the shell wrapper's stop doesn't reach.
- **Fix:** `netstat -ano | grep :3000` to find the PID, then `taskkill //PID <pid> //F`.
- **Affects:** No source files — process/tooling only.

### Decisions made
- Dropped the stage doc's unused imports (`HeroGradientFallback`, `useReducedMotion`) from `HeroR3FInner.tsx` — that file receives `reducedMotion` as a prop and never renders the fallback itself (the dynamic wrapper's `loading` option handles that), so both imports were dead code. Same category of cleanup as the Stage 05 `HorizontalSlider.tsx` decision.
- In `ProjectCard.tsx` and `ContactForm.tsx`, used explicit `if (framerEnabled) { return <motion.../> } return <plain />` branches (or a `Wrapper = framerEnabled ? motion.div : 'div'` local for the simpler single-element cases) rather than trying to make one JSX tree conditionally polymorphic — keeps prop types unambiguous for TypeScript and matches the branch style the stage doc itself uses for `HorizontalSlider`/`WorkSection`.

---

## Stage 07 — Polish & SEO

**Status:** ✅ Complete (2026-08-09)

### Files to create / modify
- `src/components/ui/CustomCursorInner.tsx` ✅
- `src/components/ui/CustomCursor.tsx` ✅
- `src/app/layout.tsx` — full SEO metadata (Open Graph, Twitter Card, canonical), added `<CustomCursor />` outside the provider tree ✅
- `public/og-image.jpg` — real 1200×630 baseline JPEG (dark bg + amber blocky "PL" wordmark) ✅
- `src/components/layout/Navigation.tsx` — added `data-cursor-hover` to wordmark, desktop nav links (both `FEATURES.framerMotion` branches), CV download link ✅
- `src/components/layout/Footer.tsx` — added `data-cursor-hover` to the three social icon links ✅
- `src/components/providers/LenisProvider.tsx` — switched GSAP/ScrollTrigger from a static top-level import to the dynamic `await import('gsap')` pattern already used by `ScrollReveal`/`HorizontalSlider`/`HeroSection` (see issue below) ✅
- `src/hooks/useReducedMotion.ts` — rewritten with `useSyncExternalStore` instead of `useState` + `useEffect` (see issue below) ✅
- `src/components/ui/ProjectCard.tsx`, `src/components/sections/WorkSection.tsx`, `src/components/ui/HorizontalSlider.tsx`, `src/components/ui/__tests__/ProjectCard.test.tsx` — removed the unused `index` prop from `ProjectCard` (see issue below) ✅

Verified: `npx tsc --noEmit` clean, `npx eslint src` zero errors/warnings, `npx vitest --run` passes all 5 tests, `npm run build` exits 0 (zero TS errors, zero ESLint errors). Confirmed via a real `npm run start` + `curl` against the production server: rendered `<title>`, `og:*`, `twitter:*`, and `<link rel="canonical">` tags all match the spec; `/og-image.jpg` serves `HTTP 200` with `content-type: image/jpeg` at the correct 1200×630 dimensions; no `CONTACT_EMAIL` string or its `.env.local` value appears anywhere under `.next/static/` (client bundle); the `three.js`/R3F chunk (~868KB raw) is absent from the initial page's `<script>` tags (only loads via the `next/dynamic({ssr:false})` wrapper on desktop); the GSAP chunk is likewise absent from the initial script list after the `LenisProvider` fix. Summed gzip size of every `<script>` tag actually present in the initial HTML is ~221KB, but one of those (`noModule=""`, the `core-js`-based legacy-browser polyfill Next.js auto-injects) is never fetched by any evergreen browser (Chrome/Firefox/Safari/Edge — Next's entire supported-browser baseline); excluding that nomodule-only chunk, real-world initial JS is ~183KB gzip, under the stage's 200KB budget. Cursor motion and the Work-section horizontal slider were **not** visually verified in a live browser during this stage's own implementation pass — no browser-automation tool was available in the same session, the same recurring constraint noted in Stages 05 and 06. **That gap was closed in a follow-up session the same day** — see "Post-Stage-07 QA: live-browser bug hunt" below, which found and fixed real bugs in exactly the two areas that had only been code-reviewed, not watched. The screen-reader/keyboard-tab-order checklist from Step 7 of `stage-07-polish.md` is still unverified and worth a manual pass before shipping.

### Issues encountered

### Issue: `LenisProvider.tsx` statically imported GSAP, pulling it into the initial JS bundle
- **Symptom:** After the first `npm run build`, summing the gzip size of every script tag Next.js actually references in the initial `/` page HTML came to ~265KB — over the stage's 200KB budget — and a GSAP-identifying string (`"gsap"`) was present in one of those initial chunks even though `HeroSection.tsx`, `HorizontalSlider.tsx`, and `ScrollReveal.tsx` all correctly load GSAP via `await import('gsap')` inside an effect.
- **Root cause:** `LenisProvider.tsx` (written in Stage 02, before this dynamic-import convention was established in Stage 05) had `import gsap from 'gsap'` and `import ScrollTrigger from 'gsap/ScrollTrigger'` as static top-level imports. Since `LenisProvider` wraps the entire app unconditionally in `layout.tsx`, this pulled GSAP into the app's main bundle regardless of route or feature flag — exactly the regression the stage doc's own "Step 8" bundle-size check step exists to catch.
- **Fix:** Rewrote `LenisProvider.tsx` to dynamically `await import('gsap')` / `await import('gsap/ScrollTrigger')` inside the effect, matching the pattern already used in the other three GSAP call sites. Held the resolved `gsap` module and ticker callback in effect-scoped variables so the cleanup function (which needs to call `gsap.ticker.remove(...)`) still has access to them despite the async initialization.
- **Affects:** `src/components/providers/LenisProvider.tsx`. Rebuilding after the fix dropped the GSAP chunk out of the initial script list entirely and reduced the (nomodule-inclusive) gzip sum to ~221KB.

### Issue: `useReducedMotion.ts` failed the `react-hooks/set-state-in-effect` ESLint rule
- **Symptom:** `npx eslint src` reported an **error** (not a warning) on `setReduced(mq.matches)` inside the hook's `useEffect` body: "Calling setState synchronously within an effect can trigger cascading renders."
- **Root cause:** The Stage 02 implementation read the initial `matchMedia` value and pushed it into state from inside the effect body (rather than an event-driven callback), which is exactly the anti-pattern this fairly new ESLint rule (part of the React Compiler-era `eslint-plugin-react-hooks` rules) flags — it's a synchronous derive-and-setState-on-mount, not a subscription callback.
- **Fix:** Rewrote the hook using `useSyncExternalStore` — React's dedicated API for exactly this case (subscribing to an external browser API like `matchMedia`). `getSnapshot` reads `window.matchMedia(...).matches` directly (called during render, not inside an effect, so the lint rule doesn't apply), `subscribe` attaches/detaches the `change` listener, and `getServerSnapshot` returns `false` for SSR. The hook's public signature (`(): boolean`) is unchanged, so no call site (`LenisProvider`, `MotionProvider`, `ScrollReveal`, `HorizontalSlider`, `HeroSection`, `HeroR3FInner`, `CustomCursorInner`, `ContactForm`) needed changes.
- **Affects:** `src/hooks/useReducedMotion.ts` only.

### Issue: `ProjectCard`'s `index` prop was declared, threaded through three call sites, and never used
- **Symptom:** `npx eslint src` reported a warning: `'index' is defined but never used` in `ProjectCard.tsx`.
- **Root cause:** Pre-existing from Stage 04/05 — `WorkSection.tsx` and `HorizontalSlider.tsx` both pass `index={i}` into `ProjectCard`, and the prop is typed in `ProjectCardProps`, but the component body never reads it (no stagger delay or numbering is derived from it inside the card itself — `WorkSection`'s own `ScrollReveal` already computes its stagger delay from `i` independently).
- **Fix:** Removed the `index` prop from `ProjectCardProps`, the destructured parameter, and all three call sites (`WorkSection.tsx`, both `ProjectCard` usages in `HorizontalSlider.tsx`, and `ProjectCard.test.tsx`), dropping the now-unused `i` map parameter in `HorizontalSlider.tsx` where it had no other use.
- **Affects:** `src/components/ui/ProjectCard.tsx`, `src/components/sections/WorkSection.tsx`, `src/components/ui/HorizontalSlider.tsx`, `src/components/ui/__tests__/ProjectCard.test.tsx`.

### Issue: `TaskStop`/background-shell cleanup for the two `npm run start` verification servers (recurring pattern, not `next dev` this time)
- **Symptom:** Two separate `npm run start` production servers were launched in the background (once before, once after the `LenisProvider` fix) to `curl` the real rendered HTML/headers for verification.
- **Root cause:** Same underlying pattern as the recurring `next dev` issue in Stages 02/03/05/06 — a backgrounded `npm run start`/`next start` process isn't reachable via the shell wrapper alone.
- **Fix:** `netstat -ano | grep :3000` to find the PID, `taskkill //PID <pid> //F` after each verification pass, before starting the next one and before ending the session.
- **Affects:** No source files — process/tooling only.

### Decisions made
- Generated `public/og-image.jpg` as a genuinely-encoded baseline JPEG (not a mislabeled PNG) since Next.js's static file server sets `Content-Type: image/jpeg` from the `.jpg` extension regardless of actual file contents — a byte/extension mismatch could cause strict OG crawlers to reject the image. No image-editing tool or ImageMagick was available (`npm view jpeg-js version` confirmed npm registry access), so `jpeg-js` was installed with `--no-save`, used from a throwaway script to encode a hand-drawn 1200×630 raster (dark `#0E0E0E` background, blocky amber `#D49B4A` "PL" wordmark built from filled rectangles — real text rendering wasn't available without a canvas/font-rasterization library), then immediately `npm uninstall`ed so it never entered `package.json`. This is a placeholder per the stage doc's own "Assets Pending Replacement" table — real branded artwork replaces it before launch.
- Did not attempt to further shrink the initial JS bundle below the ~221KB (curl-measured) / ~183KB (real-browser, excluding the `nomodule` legacy-polyfill chunk) figures. The remaining weight is React/React-DOM + Next's own runtime (framework baseline, not reducible without ejecting defaults), Framer Motion (a core, spec-required dependency used across page transitions, hover states, and the cursor), and Lenis — none of which the stage doc's three named suspects (Three.js, Framer Motion, GSAP) actually implicated once GSAP was fixed.
- Added `data-cursor-hover` to the Navigation wordmark and CV-download link in addition to the doc's explicitly-listed six items, since both are real interactive click targets and the doc's list wasn't exhaustive by design (it says "Check these are present... If any are missing, add").

---

## Post-Stage-07 QA: live-browser bug hunt (2026-08-09)

**Status:** ✅ Complete (2026-08-09) — same-day follow-up session after the user reported "the cursor and the Work section aren't tweaked well, the image sections are way too above scale."

No stage doc drove this — it's a live-browser QA pass prompted by user feedback on the running dev server, made possible because `npx playwright install chromium` (via a `--no-save` `playwright` install) succeeded this session where it hadn't in any earlier one. This is the **first session with real browser screenshots** of this app; everything back through Stage 06 had only been verified via compile/markup checks. It surfaced bugs no amount of code review had caught, including one that had been silently broken since Stage 02.

### Issue: Custom cursor fully obscured the link/button text it hovered over
- **Symptom:** Screenshot showed the amber cursor, scaled to 2.5× (30px) on hover, rendered as a solid filled disc directly over the "Philip Lee" nav wordmark — blotting out the middle letters entirely.
- **Root cause:** `CustomCursorInner.tsx` only ever scaled the same solid-fill 12px dot; nothing changed its fill on hover, so scaling it up just made the obscuring blob bigger.
- **Fix:** Added a `hovering` state toggled alongside the existing `scale` spring; on hover the dot becomes a hollow ring (`backgroundColor: transparent`, `borderColor: var(--accent)`) instead of a bigger solid disc, so text underneath stays fully legible. Border width is held constant (`1.5px solid`, only `borderColor` transitions) to avoid an unanimatable `none`↔`1.5px` jump.
- **Affects:** `src/components/ui/CustomCursorInner.tsx`.

### Issue: Custom cursor flashed at the top-left corner on every page load
- **Symptom:** Screenshot taken immediately after `page.goto()` (before any mouse movement) showed nothing stray — but code inspection showed the dot's `x`/`y` springs default to `(0,0)`, i.e. the fixed-position dot's un-offset home square, so on a real page load (before the user's first mouse move) it would sit visibly pinned at the top-left corner.
- **Root cause:** No initial "hidden until first real cursor position" state existed.
- **Fix:** Added an `opacity` spring starting at `0`, flipped to `1` on the first `mousemove` event.
- **Affects:** `src/components/ui/CustomCursorInner.tsx`.

### Issue: Work-section image scale — three different fixes attempted before finding the real cause
This was the deepest rabbit hole of the session; documenting the dead ends because they're informative.

1. **First (wrong) fix:** Assumed the bug was `HorizontalSlider.tsx` giving each project's slide the full `max-w-[1200px]` page-container width for a single card, making its `aspect-video` image balloon to ~650px tall. Shrank the slide's card wrapper to `max-w-[600px]`.
   - **Result when screenshotted mid-scroll:** Fixed the image's own proportions, but introduced a *worse* bug — a ~840px-wide empty gutter on each slide (the 1440px-wide slide minus the now-narrow 600px card) meant that during the pinned horizontal-scroll transition, the viewport showed **solid black with nothing visible at all** for a large fraction of the scroll distance.
2. **Second (better, but insufficient) fix:** Reverted the card to `max-w-[1100px]` (small gutter) and instead capped the image itself with `max-h-[380px]` alongside the existing `aspect-video w-full` on both `GradientPlaceholder` and `TerminalMockup` in `ProjectCard.tsx` — decoupling the image's height from the card's width entirely, so the image can't balloon regardless of how wide the card is.
   - **Result:** Correctly fixed the image proportions without the gutter problem *in principle*, but a diagnostic scroll trace showed the empty-viewport bug was **still there, identical, unchanged** — proving the gutter/width theory had been wrong all along; something else was hiding the content.
3. **Actual root cause, found via direct DOM/GSAP-instance inspection:** `window.__ST.getAll()` (GSAP ScrollTrigger's own registry, temporarily exposed on `window` for debugging) showed **duplicate ScrollTrigger instances with identical start/end values** — the Work-section pin existed twice, and one of the four `ScrollReveal` instances did too. Two GSAP pins fighting to control `position: fixed` + a compensating transform on the *same* DOM element corrupted the computed position: the pinned wrapper ended up rendered with `transform: translateY(1440px)` (an entire viewport-width's worth of vertical offset, pushing the whole section below the visible viewport for most of the scroll) and the pin-spacer's reserved scroll distance was inflated to ~2× what it should have been.
   - **Why duplicates existed:** `HorizontalSlider.tsx`, `ScrollReveal.tsx`, and `HeroSection.tsx` all set up GSAP inside `useEffect` via an async `run()` function (`await import('gsap')` etc.), with the returned cleanup function closing over a `let tweenRef` variable assigned only *after* the awaits resolve. If the effect is torn down before those awaits settle (React Strict Mode's dev-only double-invoke does exactly this), the cleanup fires while `tweenRef` is still `undefined` — a no-op — and the original async `run()` call, unaware it's already "cancelled," goes ahead and creates its ScrollTrigger instance anyway once the imports resolve. The next effect invocation does the same, and now two independent pins/tweens are both alive and fighting over the same trigger element, forever (no further cleanup ever reaches the first one).
   - **Compounding, separate bug found in the same file:** `ScrollReveal.tsx`'s cleanup already looked like it guarded against this (`st?.kill()`), but `st` was declared and never actually assigned — `gsap.fromTo(...)`'s return value was discarded, so that cleanup call had *always* been a silent no-op, independent of the Strict Mode race. Harmless on a page that never unmounts its sections, but real dead code.
   - **Fix:** Added a `let cancelled = false` flag to all four affected async-GSAP-setup effects (`HorizontalSlider.tsx`, `ScrollReveal.tsx`, `HeroSection.tsx`, and defensively `LenisProvider.tsx` for the same shape of race around Lenis instance creation), checked immediately after the last `await` and before creating any GSAP/Lenis instance, set to `true` at the top of the cleanup function. Also fixed `ScrollReveal.tsx` to actually capture and kill its tween (`tweenRef = gsap.fromTo(...)`, `tweenRef?.scrollTrigger?.kill()`).
   - **Verification:** Re-ran the same `window.__ST.getAll()` inspection post-fix — exactly one instance per component, no duplicates. The pinned wrapper's computed `transform` became the identity matrix and its `top` landed at ~0px (correct). A full scroll-through screenshot trace confirmed both project cards are now visible and legible throughout the horizontal-scroll transition, with no empty-viewport dead zone.
   - **A red herring worth recording:** Partway through, `lenis.on('scroll', ScrollTrigger.update)` was added to `LenisProvider.tsx` (a genuinely-missing line per Lenis's own official GSAP integration recipe in its README) and, separately, `PageTransition.tsx` was changed to clear its `motion.main`'s inline `transform` via `onAnimationComplete` (since a transformed ancestor breaks `position: fixed` on descendants per the CSS spec, and `PageTransition` wraps the entire page including the pinned Work section). **Neither of these fixed the bug** — both are still worth keeping as independently-correct improvements (the Lenis line is Lenis's documented requirement regardless; the transform-clearing avoids a separate, real CSS containing-block hazard for any future `position: fixed` descendant of the page transition) — but don't mistake them for what actually fixed this issue if debugging something similar later.
- **Affects:** `src/components/ui/HorizontalSlider.tsx`, `src/components/ui/ScrollReveal.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/providers/LenisProvider.tsx` (cancellation guards); `src/components/providers/LenisProvider.tsx` (Lenis→ScrollTrigger sync line); `src/components/providers/PageTransition.tsx` (transform clear); `src/components/ui/ProjectCard.tsx` (image `max-h-[380px]` cap, kept); `src/components/ui/HorizontalSlider.tsx` (card wrapper settled at `max-w-[1100px]`).

### Decisions made
- Used a throwaway `npm install playwright@1.62.1 --no-save` + `npx playwright install chromium` to get a real headless browser this session, then `npm uninstall playwright` once done — same "borrow a dev tool, don't let it touch `package.json`" pattern as the Stage 07 `jpeg-js` OG-image generation. The downloaded Chromium browser binary itself was left in the global `~/AppData/Local/ms-playwright` cache (outside the repo) so a future session doesn't have to re-download ~430MB.
- Chose to fix the GSAP-duplication race with a `cancelled` flag guard (the standard React pattern for async effects) rather than removing React Strict Mode or trying to force synchronous GSAP setup — Strict Mode's double-invoke is a dev-only diagnostic behavior catching a real bug in our cleanup logic; disabling it would have hidden the symptom without fixing the actual defect, and the same race could in principle be hit in production by any other remount trigger (fast refresh, a future conditional-render change, etc.).

---

## Known Decisions & Constraints

| # | Decision | Reason |
|---|----------|--------|
| 1 | Email sending via `resend` (not nodemailer) | Simpler setup, no SMTP config needed |
| 2 | All GSAP/R3F/Framer Motion loaded inside `useEffect` or `next/dynamic({ ssr: false })` | Prevents server-render crashes; required by Next.js App Router |
| 3 | Project data is static TypeScript constants, no CMS | Portfolio content doesn't change frequently; avoids external dependency |
| 4 | Tailwind v4 CSS-first config via `@theme` in `globals.css` | v4 doesn't use `tailwind.config.js` the same way; all tokens live in CSS |
| 5 | Feature flags in `src/lib/features.ts` for each phase | Allows toggling phases on/off without branching code |
| 6 | `CONTACT_EMAIL` is server-only (no `NEXT_PUBLIC_` prefix) | Must never appear in the client JS bundle |

---

## Assets Pending Replacement

These are placeholder values in the code — search for `REPLACE WITH` or `UPDATE WITH` to find all of them.

| Asset | Location | Status |
|-------|----------|--------|
| CV PDF | `Navigation.tsx` | ⬜ Pending |
| Profile photo | `AboutSection.tsx` | ⬜ Pending |
| FRACA screenshot | `ProjectCard.tsx` | ⬜ Pending |
| Nova screenshot | `ProjectCard.tsx` | ⬜ Pending |
| OG image | `layout.tsx` + `public/og-image.jpg` | ⬜ Pending |
| GitHub URL | `Footer.tsx` | ⬜ Pending |
| LinkedIn URL | `Footer.tsx` | ⬜ Pending |
| X/Twitter URL | `Footer.tsx` | ⬜ Pending |

---

## How to update this file

At the end of each stage, update:

1. The **Stage Status** table — change the emoji and fill in the date
2. The **stage section** — fill in any issues encountered and decisions made
3. The **Assets Pending Replacement** table if any were resolved

If an issue blocked a stage or required a workaround, document it under that stage's "Issues encountered" section with enough detail that it can be understood later.

**Format for issues:**
```
### Issue: [short title]
- **Symptom:** What went wrong or what error appeared
- **Root cause:** Why it happened
- **Fix:** What was done to resolve it
- **Affects:** Which files were changed
```
