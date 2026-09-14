# Development Guide — Philip Lee Portfolio

This folder contains everything needed to build this project from scratch.

---

## How to use these files

The build is split into 7 stages. Work through them **in order, one at a time**.

Do not start the next stage until the current stage's "Done when" checklist is fully complete.

## Current project state

The project was bootstrapped with `create-next-app`. As of the start of Stage 01, the following are already installed:

- Next.js 16
- React 19
- Tailwind CSS v4
- TypeScript

Everything else (Lenis, GSAP, Framer Motion, React Three Fiber, Resend, Vitest, fast-check, etc.) is **not yet installed**. Stage 01 handles all of that.

---

| Stage | File | What gets built |
|-------|------|-----------------|
| 1 | `stage-01-scaffolding.md` | Packages, types, CSS tokens, fonts, env setup |
| 2 | `stage-02-providers.md` | Smooth scroll (Lenis) + animation (Framer Motion) providers |
| 3 | `stage-03-layout.md` | Navigation bar, footer, accessibility skip link |
| 4 | `stage-04-sections.md` | All page sections, contact form, contact API route |
| 5 | `stage-05-animations.md` | GSAP scroll animations + horizontal project slider |
| 6 | `stage-06-3d-motion.md` | 3D hero shape (React Three Fiber) + Framer Motion polish |
| 7 | `stage-07-polish.md` | Custom cursor, SEO metadata, final build and accessibility checks |

---

## Reference documents

These files describe the full intended design and requirements. Read them if a stage instruction is unclear or you need more context on why something is built a certain way.

- `requirements.md` — what the portfolio must do (written from the user's point of view)
- `design.md` — how it is built (architecture, component design, data models, animation patterns)
- `tasks.md` — a flat checklist of every implementation task across all stages

---

## Progress tracking

Update `PROGRESS.md` at the end of every stage:
- Mark the stage as complete in the status table
- Document any issues encountered using the issue format at the bottom of that file
- Note any decisions that deviated from the stage instructions

---

## Important rules

1. **Work one stage at a time.** Each stage builds on the one before it.
2. **Check TypeScript after every stage.** Run `npx tsc --noEmit` — zero errors required before moving on.
3. **Run tests after every stage.** Run `npx vitest --run` — all tests must pass before moving on.
4. **Never import GSAP, Framer Motion, or Three.js outside a `"use client"` component or `useEffect`.** These are browser-only libraries. Importing them at the module level will break server rendering.
5. **Never commit `.env.local`.** It contains real credentials. Only `.env.example` (with placeholder values) is safe to commit.
6. **Placeholder comments in the code mark assets to replace later.** Search for `REPLACE WITH` to find them all. A full list is at the bottom of `stage-07-polish.md`.

---

## Placeholder assets to replace after launch

| What | Where in code | What to do |
|------|--------------|------------|
| CV PDF | `Navigation.tsx` — `{/* REPLACE WITH ACTUAL CV PDF */}` | Upload `/public/cv-philip-lee.pdf` and update the `href` |
| Profile photo | `AboutSection.tsx` — `{/* REPLACE WITH PROFILE PHOTO */}` | Add `/public/profile.jpg` and use `<Image>` |
| FRACA screenshot | `ProjectCard.tsx` — `{/* REPLACE WITH FRACA SCREENSHOT */}` | Add `/public/fraca-preview.jpg` |
| Nova screenshot | `ProjectCard.tsx` — `{/* REPLACE WITH NOVA SCREENSHOT */}` | Add `/public/nova-preview.jpg` |
| OG image | `layout.tsx` — `{/* REPLACE WITH REAL OG IMAGE */}` | Add 1200×630 branded image at `/public/og-image.jpg` |
| Social URLs | `Footer.tsx` — `{/* UPDATE WITH REAL URLs */}` | Replace `href="/"` with real GitHub, LinkedIn, X URLs |
