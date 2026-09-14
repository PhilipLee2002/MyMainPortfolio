# Stage 03 — Layout Shell (SkipNav, Navigation, Footer)

> **Instructions for Claude Code:** Read and implement every step in this file in order. Do not skip ahead. When you reach the "Done when" checklist at the bottom, verify every item before stopping. The next file to work on after this one is `stage-04-sections.md`.

---

## What this stage does

Builds the three layout components that appear on every page: the accessibility skip link, the top navigation bar, and the footer. After this stage you'll see a working nav and footer when you run the app.

---

## Step 1 — Create `src/components/layout/SkipNav.tsx`

A hidden link that appears only when a keyboard user presses Tab as their very first action. It lets them jump straight to the main content, skipping the nav bar.

```tsx
// src/components/layout/SkipNav.tsx

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[9999]
        px-4 py-2 rounded
        bg-[var(--accent)] text-[var(--bg)]
        font-semibold text-sm
        focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
      "
    >
      Skip to main content
    </a>
  );
}
```

---

## Step 2 — Create `src/components/layout/Navigation.tsx`

Fixed top bar, 64px tall. Contains the "Philip Lee" wordmark on the left and nav links on the right. Collapses to a hamburger menu on mobile (screen width under 640px).

Important details:
- Clicking a nav link uses `lenis.scrollTo()` for smooth scrolling — NOT `<a href>` native scroll.
- The hamburger button must have `aria-expanded` and `aria-controls` for accessibility.
- The CV download link has a comment placeholder reminding you to replace the file later.

```tsx
// src/components/layout/Navigation.tsx
'use client';

import { useState } from 'react';
import { useLenis } from '@/hooks/useLenis';

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const lenisRef = useLenis();

  function scrollTo(id: string) {
    setMenuOpen(false);
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(id, { duration: 1.0 });
    } else {
      // Fallback if Lenis hasn't initialised (reduced motion / SSR)
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const links = [
    { label: 'Work',    target: '#work'    },
    { label: 'About',   target: '#about'   },
    { label: 'Contact', target: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[var(--bg)] border-b border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">

        {/* Wordmark */}
        <button
          onClick={() => scrollTo('#main-content')}
          className="font-display font-bold text-lg text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          aria-label="Philip Lee — scroll to top"
        >
          Philip Lee
        </button>

        {/* Desktop links */}
        <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.target)}
              className="text-[var(--muted)] hover:text-[var(--text)] transition-colors text-sm font-medium"
            >
              {link.label}
            </button>
          ))}

          {/* CV download — replace the file when ready */}
          <a
            href="/cv-placeholder.pdf"
            download
            className="
              px-4 py-2 rounded border border-[var(--accent)]
              text-[var(--accent)] text-sm font-medium
              hover:bg-[var(--accent)] hover:text-[var(--bg)]
              transition-colors
            "
          >
            {/* REPLACE WITH ACTUAL CV PDF */}
            Download CV
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-[var(--text)] p-2"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            /* X icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden bg-[var(--surface)] border-b border-[var(--border)] px-6 py-6 flex flex-col gap-6"
        >
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.target)}
              className="text-left text-[var(--text)] text-lg font-medium hover:text-[var(--accent)] transition-colors"
            >
              {link.label}
            </button>
          ))}

          <a
            href="/cv-placeholder.pdf"
            download
            onClick={() => setMenuOpen(false)}
            className="text-[var(--accent)] text-lg font-medium"
          >
            {/* REPLACE WITH ACTUAL CV PDF */}
            Download CV
          </a>
        </div>
      )}
    </header>
  );
}
```

---

## Step 3 — Create `src/components/layout/Footer.tsx`

Simple footer with copyright text and three social icon links. The URLs are placeholders for now — each one has a comment telling you to update them.

Note: every icon link must have an `aria-label` so screen readers can describe them. The pattern is: `"Visit Philip Lee's [Platform] profile"`.

```tsx
// src/components/layout/Footer.tsx

export function Footer() {
  const socials = [
    {
      platform: 'GitHub',
      href: '/', // UPDATE WITH REAL URLs
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
    {
      platform: 'LinkedIn',
      href: '/', // UPDATE WITH REAL URLs
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      platform: 'X',
      href: '/', // UPDATE WITH REAL URLs
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        <p className="text-[var(--muted)] text-sm">
          © 2026 Philip Lee. Built with Next.js &amp; ☕
        </p>

        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.platform}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Philip Lee's ${s.platform} profile`}
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
              {/* UPDATE WITH REAL URLs */}
              {s.icon}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}
```

---

## Step 4 — Write the Footer social links property test

Create `src/components/layout/__tests__/Footer.test.tsx`:

```tsx
// src/components/layout/__tests__/Footer.test.tsx

import { render } from '@testing-library/react';
import { Footer } from '../Footer';
import { describe, it, expect } from 'vitest';

describe('Footer — social links', () => {
  it('every social link has a matching aria-label, target=_blank, and rel=noopener noreferrer', () => {
    const { container } = render(<Footer />);
    const links = Array.from(container.querySelectorAll('a[target="_blank"]'));

    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      const label = link.getAttribute('aria-label') ?? '';
      expect(label).toMatch(/^Visit Philip Lee's .+ profile$/);

      expect(link.getAttribute('target')).toBe('_blank');

      const rel = link.getAttribute('rel') ?? '';
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    });
  });
});
```

---

## Step 5 — Update `src/app/page.tsx` with the shell

Replace the default page with the navigation and footer wired up. The section content comes in Stage 04 — for now use placeholder divs so the layout is visible.

```tsx
// src/app/page.tsx

import { SkipNav } from '@/components/layout/SkipNav';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export default function Page() {
  return (
    <>
      <SkipNav />
      <Navigation />

      <main id="main-content" className="pt-16">
        {/* Sections added in Stage 04 */}
        <div className="min-h-screen flex items-center justify-center text-[var(--muted)]">
          Stage 03 complete — sections coming in Stage 04
        </div>
      </main>

      <Footer />
    </>
  );
}
```

---

## Done when

Before moving to Stage 04, confirm all of these:

- [ ] `npm run dev` runs — you see a dark page with a top nav bar and footer
- [ ] The nav links (Work, About, Contact, Download CV) are visible on desktop
- [ ] On a narrow window (under 640px) the nav collapses to a hamburger
- [ ] Hamburger opens and closes a dropdown with the nav links
- [ ] Footer shows copyright text and three social icons
- [ ] `npx vitest --run` passes the Footer social link test
- [ ] No TypeScript errors (`npx tsc --noEmit`)

---

> ✅ All boxes checked — proceed to `stage-04-sections.md`.
