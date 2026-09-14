# Requirements Document

## Introduction

This document defines the requirements for Philip Lee's developer portfolio website — a TRIONN-inspired, editorial-minimal single-page application built with Next.js 14 (App Router), TypeScript, Tailwind CSS v4, Lenis, GSAP, and Framer Motion. The portfolio is a phased build targeting hiring managers, technical recruiters, and fellow developers. It communicates Philip's identity as a full-stack developer specialising in Laravel architecture and local AI, through five progressive phases: foundation layout, scroll-based animations, horizontal project scrolling, 3D hero accents, and micro-interactions with custom cursor polish.

---

## Glossary

- **Portfolio**: The single-page Next.js application representing Philip Lee's developer portfolio.
- **App_Router**: The Next.js 14 App Router used as the routing and rendering engine.
- **Design_System**: The set of colour tokens, typography scales, spacing units, and motion constants defined in Section 2 of the content package.
- **Lenis**: The smooth-scroll library wrapping the entire page scroll experience.
- **GSAP**: GreenSock Animation Platform, used for scroll-triggered and timeline-based animations.
- **ScrollTrigger**: The GSAP plugin responsible for scroll-based animation sequencing.
- **Framer_Motion**: The React animation library used for page transitions, gesture interactions, layout animations, and exit animations.
- **R3F**: React Three Fiber — the React renderer for Three.js used in Phase 3.
- **Custom_Cursor**: A minimal amber-accented circular cursor that replaces the OS default on desktop.
- **Hero_Section**: The full-viewport opening section containing the main headline, sub-headline, and CTAs.
- **Work_Section**: The section displaying Philip's project cards, eventually rendered as a horizontal scroll slider.
- **About_Section**: The section containing Philip's biography.
- **Contact_Section**: The section containing the contact form.
- **Project_Card**: A visual card component representing a single project (FRACA or Nova).
- **FRACA**: The FRACA SERVCOM Inventory System — Philip's primary featured project.
- **Nova**: The Nova Terminal AI Assistant — Philip's secondary featured project.
- **Accent_Color**: Warm Amber `#D49B4A`, used for highlights, CTAs, and interactive element accents.
- **Placeholder_Asset**: A graphical stand-in (gradient card, terminal mockup, monogram) used until real assets are available.
- **prefers_reduced_motion**: The CSS/OS media query indicating the user has requested reduced motion.
- **Contact_Form**: The name/email/message form in the Contact_Section that submits to the configured email endpoint.
- **Viewport**: The visible browser window area.
- **CLS**: Cumulative Layout Shift — a Core Web Vitals metric.
- **FCP**: First Contentful Paint — a Core Web Vitals metric.
- **LCP**: Largest Contentful Paint — a Core Web Vitals metric.

---

## Requirements

### Requirement 1: Design System Foundation

**User Story:** As a visitor, I want the portfolio to have a consistent, polished visual identity, so that Philip's attention to craft and detail is immediately apparent.

#### Acceptance Criteria

1. THE Portfolio SHALL apply the Design_System colour tokens globally as CSS custom properties on `:root`: background `#0E0E0E`, surface `#161616`, surface border `rgba(255,255,255,0.06)`, primary text `#EBEBEB`, muted text `#888888`, Accent_Color `#D49B4A`, accent glow `rgba(212,155,74,0.15)`, and white `#FFFFFF`.
2. THE Portfolio SHALL load the display/heading typeface (Host Grotesk or Satoshi) at weights 700 and 800, and the body typeface (Inter or DM Sans) at weights 300, 400, and 500, using Next.js `next/font` variable font optimisation. Heading elements `h1`–`h3` SHALL use the display typeface; all body copy and UI labels SHALL use the body typeface.
3. THE Portfolio SHALL use a 4px base grid with all spacing values as multiples of 8px (e.g. 8, 16, 24, 32, 48, 64, 80, 120px).
4. IF the viewport width is greater than 1024px, THEN THE Portfolio SHALL apply section vertical padding of 80px minimum and 120px maximum. IF the viewport width is between 640px and 1024px, THEN THE Portfolio SHALL apply section vertical padding of 64px. IF the viewport width is less than 640px, THEN THE Portfolio SHALL apply section vertical padding of 48px.
5. THE Portfolio SHALL constrain page content within a maximum container width of 1200px, centred horizontally with auto side margins.
6. THE Portfolio SHALL define all Design_System tokens as CSS custom properties scoped to `:root` so that computed values are observable via browser DevTools and reusable across all components without redefinition.

---

### Requirement 2: Responsive Layout

**User Story:** As a visitor on any device, I want the portfolio to be fully usable and visually correct, so that I can comfortably explore Philip's work regardless of screen size.

#### Acceptance Criteria

1. THE Portfolio SHALL implement a mobile-first responsive layout targeting three breakpoints: mobile (< 640px), tablet (640–1024px), and desktop (> 1024px).
2. WHEN the viewport width is less than 640px, THE Portfolio SHALL stack the navigation, Hero_Section, Work_Section, About_Section, and Contact_Section into single-column layouts with no horizontal overflow.
3. WHEN the viewport width is between 640px and 1024px, THE Portfolio SHALL display the navigation as a single row with visible links (no hamburger), render the Hero_Section in a single centred column, and display Work_Section project cards in a two-column grid.
4. THE Portfolio SHALL pass a Lighthouse mobile accessibility audit with a score ≥ 90.
5. THE Portfolio SHALL maintain a CLS score < 0.1 across all breakpoints.
6. THE Portfolio SHALL ensure all interactive touch targets (links, buttons, form elements) have a minimum tap target size of 44×44px on viewport widths < 1024px.

---

### Requirement 3: Navigation

**User Story:** As a visitor, I want a clear, responsive navigation bar, so that I can jump to any section of the portfolio quickly.

#### Acceptance Criteria

1. THE Portfolio SHALL render a fixed top navigation bar with a height of 64px, a z-index sufficient to overlay all page content, containing the site identity ("Philip Lee" wordmark or "PL" monogram) and four links: Work, About, Contact, and a CV download link.
2. WHEN a navigation anchor link is clicked, THE Portfolio SHALL smooth-scroll to the corresponding section using Lenis, completing the scroll within 0.8–1.2s.
3. WHEN the CV download link is clicked, THE Portfolio SHALL initiate a file download of `/cv-placeholder.pdf` and include an inline JSX code comment `{/* REPLACE WITH ACTUAL CV PDF */}` adjacent to the link element.
4. WHEN the viewport width is less than 640px, THE Portfolio SHALL collapse the navigation links into a hamburger toggle button that reveals a full-screen or dropdown menu. The toggle button SHALL include `aria-expanded` (set to `true` when open, `false` when closed) and `aria-controls` pointing to the menu container's `id`.
5. WHILE the page is rendered, THE Portfolio SHALL maintain keyboard navigability through the navigation bar, with each interactive element reachable via Tab and activatable via Enter or Space, and a visible focus indicator styled with the Accent_Color outline.
6. WHERE the Phase 4a Framer_Motion feature is enabled, IF a navigation link is focused or hovered, THEN THE Navigation SHALL animate an underline into view using Framer_Motion completing in 0.3–0.4s with ease-out easing.

---

### Requirement 4: Hero Section

**User Story:** As a visitor landing on the portfolio, I want a bold, memorable opening section, so that Philip's identity and specialisation are communicated immediately.

#### Acceptance Criteria

1. THE Hero_Section SHALL occupy 100% of the initial Viewport height (`100vh`) with no vertical overflow at load time.
2. THE Hero_Section SHALL display the headline "Building systems that think." as an `h1` element using the display typeface at weight 700–800, sized via `clamp(2.5rem, 6vw, 5rem)` on desktop and `clamp(2rem, 8vw, 3rem)` on mobile.
3. THE Hero_Section SHALL display the sub-headline "Full-stack developer specialising in Laravel architecture and local AI. I turn complex business problems into clean, scalable solutions." using the body typeface at weight 300–400, sized at `1.125rem` on desktop and `1rem` on mobile.
4. WHEN the "View My Work" primary CTA button is clicked, THE Portfolio SHALL smooth-scroll to the Work_Section using Lenis within 0.8–1.2s.
5. WHEN the "Get in Touch" secondary CTA button is clicked, THE Portfolio SHALL smooth-scroll to the Contact_Section using Lenis within 0.8–1.2s.
6. THE Hero_Section SHALL display the text "Full-Stack Software Developer | Laravel & AI Specialist" as metadata using the body typeface at weight 400 and the Design_System muted text colour token (`#888888`).
7. WHERE the Phase 3 R3F feature is enabled AND the viewport width is ≥ 768px, THE Hero_Section SHALL render a lazy-loaded low-poly 3D geometry accent that rotates ±15° per axis and shifts ±20px in response to mouse position.
8. WHERE the Phase 3 R3F feature is enabled AND the viewport width is less than 768px, THE Hero_Section SHALL render a static gradient shape occupying the same bounding box as the R3F canvas, with zero Three.js JavaScript loaded.
9. THE Hero_Section headline SHALL be rendered as the page's sole `h1` element to satisfy the heading hierarchy requirement in Requirement 16.

---

### Requirement 5: About Section

**User Story:** As a hiring manager, I want to read a concise, compelling biography of Philip, so that I can quickly assess his background, skills, and focus areas.

#### Acceptance Criteria

1. THE About_Section SHALL display the following biography text verbatim: "I'm Philip Lee, a full-stack developer who builds practical, high-impact digital solutions. Currently in my final year at KCA University, I specialize in architecting robust systems with Laravel and exploring the cutting edge of local AI. From automating inventory for furniture SMEs to creating offline terminal-based AI assistants, I thrive at the intersection of system-thinking and user experience. I don't just write code—I solve real business problems with clean, scalable architecture." using the body typeface at weight 300–400.
2. THE About_Section SHALL render a "PL" typographic monogram in the display typeface at weight 700–800 in all locations where a profile photo would appear, with an adjacent JSX code comment `{/* REPLACE WITH PROFILE PHOTO */}`. The monogram SHALL be at minimum 80×80px.
3. THE About_Section SHALL list Philip's key technology areas as a visible rendered list or tag group containing at minimum: Laravel, PHP, MySQL, Python, AI tooling, and Next.js.
4. THE About_Section SHALL display the text "Final-year Software Development student at KCA University (Graduating December 2026)" in the body typeface using the muted text colour token (`#888888`).

---

### Requirement 6: Work Section — Project Cards

**User Story:** As a visitor, I want to browse Philip's featured projects with clear descriptions and technical detail, so that I can evaluate the quality and breadth of his work.

#### Acceptance Criteria

1. THE Work_Section SHALL display two Project_Cards: one for FRACA and one for Nova.
2. EACH Project_Card SHALL display the project category, year, full tech stack list, and a list of key features as specified in the content package (FRACA: Laravel 12, PHP 8.1+, MySQL, Blade, Bootstrap 5, JavaScript/Axios, Vite, Spatie Media Library; Nova: Python 3.8+, LM Studio, Qwen2.5-Coder-1.5B, Requests, Typer, Rich).
3. THE FRACA Project_Card SHALL display the outcome metrics: "99.9% data integrity, 500+ products, 20+ suppliers, stock accuracy improved from 75% to 99%". THE Nova Project_Card SHALL display the outcome metrics: "Fully offline, <8s response times, /scaffold speeds up boilerplate generation by ~70%".
4. THE FRACA Project_Card SHALL render a gradient placeholder card in the image area with the inline JSX code comment `{/* REPLACE WITH FRACA SCREENSHOT */}`.
5. THE Nova Project_Card SHALL render a terminal-style mockup placeholder in the image area with the inline JSX code comment `{/* REPLACE WITH NOVA SCREENSHOT */}`.
6. THE FRACA Project_Card SHALL include a link to `https://github.com/PhilipLee2002/fraca-inventory-system` with a visible "(Private Repository)" text label. WHERE Nova's repository URL is not available, THE Nova Project_Card SHALL omit the repository link rather than display a broken or placeholder URL.
7. WHERE the Phase 4a Framer_Motion feature is enabled AND the viewport width is greater than 1024px, WHEN a Project_Card image area is hovered, THE Project_Card SHALL apply a zoom (scale 1.05) and Accent_Color glow overlay transition completing in 0.3–0.4s with ease-out easing.
8. WHERE the project's personal reflection text is non-empty as defined in the content package, THE Project_Card SHALL include a dedicated personal reflection subsection displaying that text.

---

### Requirement 7: Horizontal Project Slider (Phase 2b)

**User Story:** As a visitor, I want a TRIONN-style horizontal scroll experience in the Work section, so that browsing projects feels distinctive and immersive.

#### Acceptance Criteria

1. WHERE the Phase 2b horizontal scroll feature is enabled, THE Work_Section SHALL replace the vertical card layout with a horizontally scrolling container pinned to the viewport while the user scrolls through its full scroll distance.
2. WHERE the Phase 2b horizontal scroll feature is enabled, WHEN the user scrolls vertically while the Work_Section is pinned in view, THE Work_Section SHALL translate the horizontal container leftward at a 1:1 ratio to the vertical scroll progress, driven by GSAP ScrollTrigger scrub.
3. WHERE the Phase 2b horizontal scroll feature is enabled, THE Work_Section horizontal container SHALL apply `scroll-snap-type: x mandatory` with `scroll-snap-align: start` on each project panel so that each panel snaps to the left edge of the container.
4. WHERE the Phase 2b horizontal scroll feature is enabled, WHEN a project panel scrolls into the snapped position, THE Work_Section SHALL reveal the corresponding project detail panel with a slide-in animation completing in 0.4–0.6s with ease-out easing.
5. WHERE the Phase 2b horizontal scroll feature is enabled AND `prefers_reduced_motion` is active, THE Work_Section SHALL display project panels in a static vertical stack without horizontal scroll or pin behaviour.

---

### Requirement 8: Contact Section and Form

**User Story:** As a recruiter or collaborator, I want to send Philip a message directly from the portfolio, so that I can initiate contact without switching to email.

#### Acceptance Criteria

1. THE Contact_Section SHALL display the heading "Let's build something together." as an `h2` element, and the sub-heading "Have a project in mind or want to collaborate? I'd love to hear from you." as body text.
2. THE Contact_Form SHALL contain three fields: Name (`type="text"`, required), Email (`type="email"`, required), and Message (`<textarea>`, required, placeholder: "Tell me about your project...").
3. THE Contact_Form SHALL display a submit button labelled "Send Message" styled with the Accent_Color `#D49B4A` as background, with an `aria-label="Send message to Philip Lee"`.
4. WHEN the Contact_Form is submitted and the Name field is empty, THE Contact_Form SHALL display an inline validation error below the Name field and prevent form submission. Validation SHALL trigger on both blur and submit events.
5. WHEN the Contact_Form is submitted and the Email field contains a value that does not match the RFC 5322 email format, THE Contact_Form SHALL display an inline validation error below the Email field and prevent form submission.
6. WHEN the Contact_Form is submitted and the Message field is empty, THE Contact_Form SHALL display an inline validation error below the Message field and prevent form submission.
7. WHEN the Contact_Form is submitted with all fields valid, THE Contact_Form SHALL disable the submit button and display a loading indicator, then send the message to the `CONTACT_EMAIL` environment variable via the API route, then display a visible success confirmation message to the user within the form area.
8. IF a form submission network or server error occurs, THEN THE Contact_Form SHALL display a user-facing error message above the submit button and restore the submit button to its active state, preserving all entered field values.
9. WHERE the Phase 4a Framer_Motion feature is enabled, WHEN the Contact_Form is successfully submitted, THE Contact_Form SHALL animate the form fields out and replace them with a checkmark icon and success confirmation message over 0.4–0.6s.
10. THE Name field length SHALL be constrained to a maximum of 100 characters. THE Message field length SHALL be constrained to a maximum of 2000 characters.

---

### Requirement 9: Footer

**User Story:** As a visitor reaching the end of the page, I want to see Philip's copyright notice and social links, so that I can find his online profiles.

#### Acceptance Criteria

1. THE Portfolio SHALL render a footer at the bottom of the page content displaying the text "© 2026 Philip Lee. Built with Next.js & ☕".
2. THE Footer SHALL display social link icons for GitHub, LinkedIn, and X/Twitter, each pointing to `href="/"` with an adjacent JSX code comment `{/* UPDATE WITH REAL URLs */}`.
3. THE Footer social links SHALL include accessible `aria-label` attributes following the pattern `"Visit Philip Lee's [Platform] profile"` (e.g. `aria-label="Visit Philip Lee's GitHub profile"`).
4. THE Footer social links that open in a new tab SHALL include `target="_blank"` and `rel="noopener noreferrer"` to prevent reverse tabnapping.

---

### Requirement 10: Smooth Scroll (Lenis)

**User Story:** As a visitor, I want silky-smooth page scrolling, so that navigating the portfolio feels premium and intentional.

#### Acceptance Criteria

1. THE Portfolio SHALL initialise a single Lenis instance client-side (not during SSR) on page mount, targeting the root `<html>` scroll container, so that native `window.scrollY` is replaced by Lenis-managed scroll position. The Lenis instance SHALL be destroyed on component unmount.
2. WHEN Lenis is initialised, THE Portfolio SHALL register a GSAP ticker callback (`gsap.ticker.add`) that calls `lenis.raf(time)` on each animation frame, so that GSAP ScrollTrigger scroll positions remain synchronised with the Lenis scroll position.
3. WHILE the user is scrolling, THE Portfolio SHALL apply a Lenis `lerp` value between 0.06 and 0.12, producing a smooth deceleration that brings scroll momentum to rest within 300ms of pointer release.
4. IF the `prefers_reduced_motion` media query is active, THEN THE Portfolio SHALL skip Lenis initialisation and allow native browser scroll behaviour.

---

### Requirement 11: Scroll-Triggered Animations (Phase 2a — GSAP/ScrollTrigger)

**User Story:** As a visitor scrolling through the portfolio, I want content to animate into view with purposeful timing, so that the experience feels dynamic and polished.

#### Acceptance Criteria

1. WHERE the Phase 2a scroll animation feature is enabled, THE Portfolio SHALL animate each Project_Card from `opacity: 0` and `translateY: 40px` to `opacity: 1` and `translateY: 0` using GSAP ScrollTrigger with `power2.out` or `power3.out` easing over 0.8–1.2s, with a stagger delay of 0.15s between cards. The trigger SHALL fire when the card's top edge crosses 80% from the top of the Viewport.
2. WHERE the Phase 2a scroll animation feature is enabled, THE Hero_Section background element SHALL translate vertically from 0px to 80px relative to scroll progress through the Hero_Section, driven by a GSAP ScrollTrigger scrub on the Hero_Section's scroll range.
3. WHERE the Phase 2a scroll animation feature is enabled, THE Portfolio SHALL animate each section header text from `opacity: 0` and `translateY: 24px` to `opacity: 1` and `translateY: 0` using GSAP ScrollTrigger with `power2.out` easing over 0.7–1.0s. The trigger SHALL fire when the header's top edge crosses 85% from the top of the Viewport.
4. WHERE the Phase 2a scroll animation feature is enabled, THE Portfolio SHALL run timeline-based GSAP animations for project detail entry sequences, triggered when the project detail section top edge crosses 80% from the top of the Viewport, with a total timeline duration not exceeding 1.2s.
5. IF the `prefers_reduced_motion` media query is active, THEN THE Portfolio SHALL skip all GSAP ScrollTrigger animations and render all elements in their fully visible final state (`opacity: 1`, `translateY: 0`) so no content is hidden or inaccessible.

---

### Requirement 12: 3D Hero Accent (Phase 3 — React Three Fiber)

**User Story:** As a visitor on desktop, I want a subtle 3D element in the hero that reacts to my mouse, so that the opening section feels alive and technically impressive.

#### Acceptance Criteria

1. WHERE the Phase 3 R3F feature is enabled, THE Portfolio SHALL load the React Three Fiber canvas component via `dynamic(() => import(...), { ssr: false })` so that Three.js does not appear in the initial JavaScript bundle delivered to the browser.
2. WHERE the Phase 3 R3F feature is enabled AND the viewport width is ≥ 768px, THE Hero_Section R3F component SHALL render a low-poly 3D geometry that rotates up to ±15° on the X and Y axes and shifts up to ±20px on X and Y in response to full cursor travel across the Viewport.
3. WHERE the Phase 3 R3F feature is enabled AND the viewport width is less than 768px, THE Hero_Section SHALL render a static CSS gradient shape occupying the same bounding box as the R3F canvas, with no Three.js or R3F JavaScript loaded on that viewport.
4. WHEN the Phase 3 R3F component is loading (Suspense boundary active), THE Hero_Section SHALL display a static CSS gradient shape occupying the same bounding box as the R3F canvas to prevent layout shift contributing to CLS.
5. IF the `prefers_reduced_motion` media query is active, THEN THE Phase 3 R3F component SHALL render the geometry with constant position and rotation regardless of mouse movement or elapsed time.

---

### Requirement 13: Page Transitions and Micro-interactions (Phase 4a — Framer Motion)

**User Story:** As a visitor navigating between states, I want smooth transitions and tactile micro-interactions, so that every interaction feels considered and refined.

#### Acceptance Criteria

1. WHERE the Phase 4a Framer_Motion feature is enabled, THE Portfolio SHALL apply page transition animations on route entry (`opacity: 0, translateY: -16px` → `opacity: 1, translateY: 0`) and exit (`opacity: 1, translateY: 0` → `opacity: 0, translateY: 16px`) with duration 0.8–1.2s using `cubic-bezier(0.16, 1, 0.3, 1)` easing.
2. WHERE the Phase 4a Framer_Motion feature is enabled, WHEN a Project_Card is hovered, THE Project_Card SHALL scale to `1.03` and reveal project metadata overlay using a Framer_Motion layout animation completing in 0.3–0.4s.
3. WHERE the Phase 4a Framer_Motion feature is enabled, WHEN a navigation link is hovered, THE Navigation SHALL animate an underline (width 0% → 100%) into view using Framer_Motion completing in 0.3–0.4s with ease-out easing.
4. WHERE the Phase 4a Framer_Motion feature is enabled, WHEN the Contact_Form is successfully submitted, THE Contact_Form SHALL animate the form fields out (opacity 1 → 0) and replace them with a checkmark icon and confirmation message via Framer_Motion over 0.4–0.6s.
5. IF the `prefers_reduced_motion` media query is active, THEN THE Portfolio SHALL suppress all Framer_Motion animations by setting `reducedMotion: "always"` in the `MotionConfig` component wrapping the application.

---

### Requirement 14: Custom Cursor (Phase 4b)

**User Story:** As a desktop visitor, I want a custom minimal cursor that reflects the portfolio's design language, so that even pointer interactions feel on-brand.

#### Acceptance Criteria

1. WHERE the Phase 4b custom cursor feature is enabled AND the viewport width is greater than 1024px, THE Portfolio SHALL render a Custom_Cursor as a filled circle with a diameter of 12px, styled with the Accent_Color `#D49B4A`, positioned absolutely and following the pointer via `mousemove` event. The OS default cursor SHALL be hidden (`cursor: none`) on the `body` element.
2. WHERE the Phase 4b custom cursor feature is enabled AND the viewport width is greater than 1024px, WHEN the Custom_Cursor enters a hoverable element (link, button, Project_Card), THE Custom_Cursor SHALL scale to 2.5× its resting diameter (30px) over 0.15–0.25s with ease-out easing. IF `prefers_reduced_motion` is active, the scale transition SHALL be instant (duration 0s).
3. WHEN the viewport width is less than or equal to 1024px, THE Portfolio SHALL not render the Custom_Cursor component and SHALL not apply `cursor: none` to the body, restoring the OS default cursor.
4. THE Custom_Cursor component SHALL be loaded via `dynamic(() => import(...), { ssr: false })` so that it does not block the initial page render or contribute to the server-rendered HTML.

---

### Requirement 15: Performance and Core Web Vitals

**User Story:** As a visitor on any connection, I want the portfolio to load quickly and feel responsive, so that slow load times don't create a negative first impression.

#### Acceptance Criteria

1. THE Portfolio SHALL achieve a Lighthouse performance score ≥ 90 on desktop, measured using Lighthouse 11+ in a Chrome browser against the production build.
2. THE Portfolio SHALL maintain FCP < 1.5s on a simulated Fast 4G connection (40 Mbps down, 10ms RTT) as measured by Lighthouse.
3. THE Portfolio SHALL maintain LCP < 2.5s on a simulated Fast 4G connection as measured by Lighthouse.
4. THE Portfolio SHALL maintain CLS < 0.1 across all pages as measured by Lighthouse.
5. THE Portfolio SHALL keep the initial JavaScript bundle (all chunks loaded on first render) below 200KB compressed (gzip or Brotli), as measured by `next build` output.
6. THE Portfolio SHALL load the R3F 3D component, GSAP ScrollTrigger, and Framer_Motion code via dynamic `import()` with `{ ssr: false }` so that none of these libraries appear in the critical render path bundle.
7. THE Portfolio SHALL apply the `priority` prop to the Next.js `<Image>` component rendering the Hero_Section monogram or image to ensure it is preloaded and contributes to LCP optimisation.
8. WHEN an animation library (GSAP, Framer_Motion, R3F/Three.js) is imported in any component, THE Portfolio SHALL use `dynamic(() => import(...), { ssr: false })` to prevent server-side rendering of browser-only animation code and avoid hydration mismatches.

---

### Requirement 16: Accessibility

**User Story:** As a visitor using assistive technology or keyboard navigation, I want the portfolio to be fully accessible, so that I am not excluded from the experience.

#### Acceptance Criteria

1. THE Portfolio SHALL maintain a logical heading hierarchy (`h1` → `h2` → `h3`) with exactly one `h1` per page (the Hero_Section headline).
2. THE Portfolio SHALL include `aria-label` attributes on all icon-only interactive elements: social link icons, hamburger menu toggle, and any button or link whose visible label is solely an SVG or image.
3. THE Portfolio SHALL ensure all foreground text and background colour combinations meet WCAG 2.1 AA contrast ratios: ≥ 4.5:1 for normal text (< 18pt / < 14pt bold) and ≥ 3:1 for large text (≥ 18pt / ≥ 14pt bold).
4. THE Portfolio SHALL provide visible keyboard focus indicators on all interactive elements. Focus rings SHALL have a minimum offset of 2px and a minimum contrast ratio of 3:1 against adjacent colours, per WCAG 2.2 SC 2.4.11.
5. IF the `prefers_reduced_motion` media query is active, THEN THE Portfolio SHALL: disable Lenis smooth scroll (use native scroll), skip all GSAP ScrollTrigger animations (render elements in final state), set Framer_Motion `reducedMotion: "always"`, and render the R3F geometry as a static shape without rotation or mouse tracking.
6. THE Contact_Form SHALL associate every input field with a visible `<label>` element using the `htmlFor`/`id` attribute pair. Labels SHALL be rendered in the DOM (not `aria-label` only) and remain visible at all viewport sizes.
7. THE Portfolio SHALL be operable via keyboard-only navigation from top to bottom in logical DOM order (matching visual order) without any unintended focus traps. Tab order SHALL follow: skip-nav link → navigation → Hero_Section → Work_Section → About_Section → Contact_Section → Footer.
8. THE Portfolio SHALL include a visually hidden skip navigation link as the first focusable element in the DOM, labelled "Skip to main content", that becomes visible on focus and moves keyboard focus to the main content landmark.

---

### Requirement 17: SEO and Social Sharing (Phase 5)

**User Story:** As someone who receives a link to Philip's portfolio, I want rich social sharing previews, so that the link looks professional and informative on LinkedIn, Twitter, and WhatsApp.

#### Acceptance Criteria

1. THE Portfolio SHALL define a Next.js `Metadata` object in `layout.tsx` with `title: "Philip Lee — Full-Stack Developer | Laravel & AI Specialist"` and a `description` of no more than 155 characters summarising Philip's specialisation.
2. THE Portfolio SHALL include Open Graph meta tags: `og:type` (set to `"website"`), `og:title`, `og:description` (≤ 155 characters), `og:image` (absolute HTTPS URL pointing to a 1200×630px JPEG or PNG image), and `og:url` (absolute HTTPS URL of the deployed site).
3. THE Portfolio SHALL include Twitter Card meta tags: `twitter:card` (set to `"summary_large_image"`), `twitter:title`, `twitter:description`, and `twitter:image` (absolute HTTPS URL of the same 1200×630px image used for `og:image`).
4. THE Portfolio SHALL include a `<link rel="canonical">` tag with an `href` set to the absolute HTTPS URL of the deployed Vercel domain (e.g. `https://philip-lee.vercel.app`).
5. THE Portfolio SHALL set `lang="en"` on the root `<html>` element via the Next.js `layout.tsx` `<html lang="en">` attribute.

---

### Requirement 18: Environment Configuration and Deployment

**User Story:** As Philip deploying the portfolio to Vercel, I want the application to read sensitive configuration from environment variables, so that secrets are never committed to source control.

#### Acceptance Criteria

1. THE Portfolio SHALL read the contact form destination email exclusively from the `CONTACT_EMAIL` environment variable (server-side only, prefixed without `NEXT_PUBLIC_`). The string `reignortwist@gmail.com` SHALL NOT appear in any source file committed to version control.
2. THE Portfolio SHALL include a `.env.example` file at the project root listing each required environment variable with a placeholder value and a one-line comment explaining its purpose (e.g. `# Email address that receives contact form submissions`).
3. IF the `CONTACT_EMAIL` environment variable is absent at server startup or request time, THEN THE Portfolio SHALL log a console warning (`[portfolio] CONTACT_EMAIL is not set — contact form disabled`), and THE Contact_Form submit button SHALL be rendered as `disabled` with the visible label "Contact unavailable" so the user is not silently blocked.
4. THE Portfolio SHALL produce a successful `next build` output (exit code 0, zero TypeScript errors, zero ESLint errors) without requiring any changes to source files beyond setting environment variables in the Vercel dashboard.
5. THE Portfolio SHALL have `"strict": true` set in `tsconfig.json` and SHALL produce zero TypeScript errors under strict mode as part of the `next build` step.
6. THE Portfolio API route handling contact form submission SHALL return HTTP 503 with a JSON body `{ "error": "Contact form is not configured." }` if `CONTACT_EMAIL` is undefined at request time, rather than attempting to send to an undefined address.

---

### Requirement 19: Placeholder Asset Management

**User Story:** As Philip building the portfolio iteratively, I want all placeholder assets clearly marked in code, so that I can find and replace them with real assets at the appropriate phase.

#### Acceptance Criteria

1. THE Portfolio SHALL render a "PL" typographic monogram in all locations where a profile photo would appear, with an adjacent JSX code comment `{/* REPLACE WITH PROFILE PHOTO */}` on the line immediately before or after the monogram element.
2. THE FRACA Project_Card image area SHALL render a CSS gradient placeholder card with the JSX code comment `{/* REPLACE WITH FRACA SCREENSHOT */}` on the line immediately before or after the placeholder element.
3. THE Nova Project_Card image area SHALL render a terminal-style mockup placeholder with the JSX code comment `{/* REPLACE WITH NOVA SCREENSHOT */}` on the line immediately before or after the placeholder element.
4. THE Footer social link anchor elements SHALL each have `href="/"` and include a JSX code comment `{/* UPDATE WITH REAL URLs */}` on the line immediately before or after the anchor element.
5. THE CV download link SHALL have `href="/cv-placeholder.pdf"` and include a JSX code comment `{/* REPLACE WITH ACTUAL CV PDF */}` on the line immediately before or after the anchor element.
