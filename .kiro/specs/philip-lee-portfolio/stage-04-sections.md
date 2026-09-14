# Stage 04 — Static Sections & Contact API

> **Instructions for Claude Code:** Read and implement every step in this file in order. Do not skip ahead. When you reach the "Done when" checklist at the bottom, verify every item before stopping. The next file to work on after this one is `stage-05-animations.md`.

---

## What this stage does

Builds all five page sections (Hero, Work, About, Contact, Footer integration) plus the contact form backend. After this stage the portfolio is fully readable and functional as a static site — no animations yet, but all real content is in place.

---

## Step 1 — Create `src/components/sections/HeroSection.tsx`

Full-viewport opening section. The 3D shape slot is a CSS gradient for now — the R3F component gets wired in at Stage 06.

```tsx
// src/components/sections/HeroSection.tsx
'use client';

import { useLenis } from '@/hooks/useLenis';

export function HeroSection() {
  const lenisRef = useLenis();

  function scrollTo(id: string) {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(id, { duration: 1.0 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)]"
    >
      <div className="max-w-[1200px] mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

        {/* Text content */}
        <div>
          <p className="text-[var(--muted)] text-sm font-body mb-4 tracking-wide uppercase">
            Full-Stack Software Developer | Laravel &amp; AI Specialist
          </p>

          <h1
            className="font-display font-bold text-[var(--text)] leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
          >
            Building systems that think.
          </h1>

          <p className="text-[var(--muted)] font-body font-light text-lg mb-10 max-w-xl">
            Full-stack developer specialising in Laravel architecture and local AI.
            I turn complex business problems into clean, scalable solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('#work')}
              data-cursor-hover
              className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] font-medium rounded hover:opacity-90 transition-opacity"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollTo('#contact')}
              data-cursor-hover
              className="px-6 py-3 border border-[var(--border)] text-[var(--text)] font-medium rounded hover:border-[var(--accent)] transition-colors"
            >
              Get in Touch
            </button>
          </div>
        </div>

        {/* Visual accent — gradient placeholder; replaced with 3D in Stage 06 */}
        <div
          className="hidden lg:block rounded-2xl w-full aspect-square max-w-md mx-auto"
          style={{
            background: 'radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%)',
            border: '1px solid var(--border)',
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
```

---

## Step 2 — Create `src/components/ui/ProjectCard.tsx`

Renders a single project. Shows a gradient placeholder for FRACA and a terminal mockup for Nova. The image will be replaced with real screenshots later — comments in the code mark exactly where.

```tsx
// src/components/ui/ProjectCard.tsx

import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index: number;
  framerEnabled: boolean;
}

function GradientPlaceholder() {
  return (
    <div
      className="w-full aspect-video rounded-lg flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, var(--surface) 0%, var(--accent-glow) 100%)', border: '1px solid var(--border)' }}
    >
      {/* REPLACE WITH FRACA SCREENSHOT */}
      <span className="text-[var(--muted)] text-xs">Project preview</span>
    </div>
  );
}

function TerminalMockup() {
  return (
    <div
      className="w-full aspect-video rounded-lg p-4 font-mono text-xs"
      style={{ background: '#0a0a0a', border: '1px solid var(--border)' }}
    >
      {/* REPLACE WITH NOVA SCREENSHOT */}
      <p className="text-green-400">$ nova</p>
      <p className="text-[var(--muted)] mt-1">Nova Terminal AI — ready</p>
    </div>
  );
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      data-cursor-hover
      className="rounded-xl p-6 flex flex-col gap-6"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Image area */}
      {project.imagePlaceholderType === 'gradient'
        ? <GradientPlaceholder />
        : <TerminalMockup />
      }

      {/* Meta */}
      <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
        <span>{project.category}</span>
        <span aria-hidden="true">·</span>
        <span>{project.year}</span>
      </div>

      <h3 className="font-display font-bold text-[var(--text)] text-xl">{project.title}</h3>

      {/* Tech stack chips */}
      <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
        {project.techStack.map((tech) => (
          <li
            key={tech}
            className="px-3 py-1 rounded-full text-xs text-[var(--muted)]"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            {tech}
          </li>
        ))}
      </ul>

      {/* Features */}
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Features</p>
        <ul className="space-y-1">
          {project.features.map((f) => (
            <li key={f} className="text-sm text-[var(--text)] flex gap-2">
              <span className="text-[var(--accent)]" aria-hidden="true">—</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Outcome metrics */}
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Outcomes</p>
        <ul className="space-y-1">
          {project.outcomeMetrics.map((m) => (
            <li key={m} className="text-sm text-[var(--accent)]">{m}</li>
          ))}
        </ul>
      </div>

      {/* Repo link — only shown if repoUrl is defined */}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="text-sm text-[var(--accent)] hover:underline self-start"
        >
          View Repository {project.repoLabel && <span className="text-[var(--muted)]">{project.repoLabel}</span>}
        </a>
      )}

      {/* Reflection — only shown if reflectionText is defined */}
      {project.reflectionText && (
        <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Reflection</p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{project.reflectionText}</p>
        </div>
      )}
    </article>
  );
}
```

---

## Step 3 — Create `src/components/sections/WorkSection.tsx`

```tsx
// src/components/sections/WorkSection.tsx

import { PROJECTS } from '@/lib/projects';
import { FEATURES } from '@/lib/features';
import { ProjectCard } from '@/components/ui/ProjectCard';

export function WorkSection() {
  return (
    <section
      id="work"
      className="px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)]"
    >
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-display font-bold text-[var(--text)] text-4xl mb-12">
          Selected Work
        </h2>

        {/* HorizontalSlider wired in Stage 05 — vertical grid for now */}
        <div className="grid sm:grid-cols-2 gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              framerEnabled={FEATURES.framerMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Step 4 — Create `src/components/sections/AboutSection.tsx`

```tsx
// src/components/sections/AboutSection.tsx

const skills = ['Laravel', 'PHP', 'MySQL', 'Python', 'AI tooling', 'Next.js'];

export function AboutSection() {
  return (
    <section
      id="about"
      className="px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)]"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-start">

        {/* Monogram */}
        <div className="flex justify-center lg:justify-start">
          <div
            className="w-32 h-32 rounded-2xl flex items-center justify-center font-display font-bold text-4xl text-[var(--accent)]"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', minWidth: 80, minHeight: 80 }}
            aria-label="PL monogram — profile photo placeholder"
          >
            {/* REPLACE WITH PROFILE PHOTO */}
            PL
          </div>
        </div>

        {/* Bio */}
        <div>
          <h2 className="font-display font-bold text-[var(--text)] text-4xl mb-6">About</h2>

          <p className="text-[var(--text)] font-body font-light leading-relaxed mb-6">
            I&apos;m Philip Lee, a full-stack developer who builds practical, high-impact digital solutions.
            Currently in my final year at KCA University, I specialize in architecting robust systems with
            Laravel and exploring the cutting edge of local AI. From automating inventory for furniture SMEs
            to creating offline terminal-based AI assistants, I thrive at the intersection of system-thinking
            and user experience. I don&apos;t just write code—I solve real business problems with clean, scalable architecture.
          </p>

          <p className="text-[var(--muted)] text-sm mb-8">
            Final-year Software Development student at KCA University (Graduating December 2026)
          </p>

          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">Technologies</p>
            <ul className="flex flex-wrap gap-2" aria-label="Key technologies">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="px-3 py-1 rounded-full text-sm text-[var(--text)]"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## Step 5 — Create `src/components/ui/ContactForm.tsx`

Handles all form state, validation, and the API call. Uses `useReducer` so the loading/success/error states are predictable.

```tsx
// src/components/ui/ContactForm.tsx
'use client';

import { useReducer } from 'react';
import type { ContactFormState } from '@/types';

type Action =
  | { type: 'SET_FIELD_ERROR'; field: keyof ContactFormState['errors']; message: string }
  | { type: 'CLEAR_ERROR'; field: keyof ContactFormState['errors'] }
  | { type: 'SUBMITTING' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; message: string };

function reducer(state: ContactFormState, action: Action): ContactFormState {
  switch (action.type) {
    case 'SET_FIELD_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.message } };
    case 'CLEAR_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: undefined } };
    case 'SUBMITTING':
      return { status: 'loading', errors: {} };
    case 'SUCCESS':
      return { status: 'success', errors: {} };
    case 'ERROR':
      return { status: 'error', errors: { server: action.message } };
    default:
      return state;
  }
}

const initialState: ContactFormState = { status: 'idle', errors: {} };

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

interface ContactFormProps {
  contactEmailConfigured: boolean;
  framerEnabled: boolean;
}

export function ContactForm({ contactEmailConfigured }: ContactFormProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function validateName(value: string) {
    if (!value.trim()) dispatch({ type: 'SET_FIELD_ERROR', field: 'name', message: 'Name is required.' });
    else dispatch({ type: 'CLEAR_ERROR', field: 'name' });
  }

  function validateEmail(value: string) {
    if (!isValidEmail(value)) dispatch({ type: 'SET_FIELD_ERROR', field: 'email', message: 'Enter a valid email address.' });
    else dispatch({ type: 'CLEAR_ERROR', field: 'email' });
  }

  function validateMessage(value: string) {
    if (!value.trim()) dispatch({ type: 'SET_FIELD_ERROR', field: 'message', message: 'Message is required.' });
    else dispatch({ type: 'CLEAR_ERROR', field: 'message' });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name    = (form.elements.namedItem('name')    as HTMLInputElement).value;
    const email   = (form.elements.namedItem('email')   as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    // Run all validations first
    validateName(name);
    validateEmail(email);
    validateMessage(message);
    if (!name.trim() || !isValidEmail(email) || !message.trim()) return;

    dispatch({ type: 'SUBMITTING' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        dispatch({ type: 'SUCCESS' });
      } else {
        const data = await res.json();
        dispatch({ type: 'ERROR', message: data.error ?? 'Something went wrong. Please try again.' });
      }
    } catch {
      dispatch({ type: 'ERROR', message: 'Network error. Please check your connection and try again.' });
    }
  }

  if (state.status === 'success') {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4" aria-label="Success">✓</p>
        <p className="text-[var(--text)] font-medium text-lg">Message sent!</p>
        <p className="text-[var(--muted)] text-sm mt-2">Thanks for reaching out. I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {state.errors.server && (
        <p role="alert" className="text-red-400 text-sm p-3 rounded" style={{ background: 'var(--surface)' }}>
          {state.errors.server}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm text-[var(--muted)]">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          onBlur={(e) => validateName(e.target.value)}
          className="bg-[var(--surface)] border rounded px-4 py-3 text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)]"
          style={{ borderColor: state.errors.name ? '#f87171' : 'var(--border)' }}
        />
        {state.errors.name && <p className="text-red-400 text-xs">{state.errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-[var(--muted)]">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          onBlur={(e) => validateEmail(e.target.value)}
          className="bg-[var(--surface)] border rounded px-4 py-3 text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)]"
          style={{ borderColor: state.errors.email ? '#f87171' : 'var(--border)' }}
        />
        {state.errors.email && <p className="text-red-400 text-xs">{state.errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm text-[var(--muted)]">Message</label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={2000}
          rows={5}
          placeholder="Tell me about your project..."
          onBlur={(e) => validateMessage(e.target.value)}
          className="bg-[var(--surface)] border rounded px-4 py-3 text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)] resize-none"
          style={{ borderColor: state.errors.message ? '#f87171' : 'var(--border)' }}
        />
        {state.errors.message && <p className="text-red-400 text-xs">{state.errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={!contactEmailConfigured || state.status === 'loading'}
        aria-label="Send message to Philip Lee"
        data-cursor-hover
        className="px-6 py-3 rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        style={{ background: 'var(--accent)', color: 'var(--bg)' }}
      >
        {!contactEmailConfigured
          ? 'Contact unavailable'
          : state.status === 'loading'
          ? 'Sending…'
          : 'Send Message'}
      </button>
    </form>
  );
}
```

---

## Step 6 — Create `src/components/sections/ContactSection.tsx`

This is a Server Component — it reads the environment variable server-side and passes the result down to the form.

```tsx
// src/components/sections/ContactSection.tsx

import { ContactForm } from '@/components/ui/ContactForm';
import { FEATURES } from '@/lib/features';

export function ContactSection() {
  const contactEmailConfigured = Boolean(process.env.CONTACT_EMAIL);

  return (
    <section
      id="contact"
      className="px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)]"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-start">

        <div>
          <h2 className="font-display font-bold text-[var(--text)] text-4xl mb-4">
            Let&apos;s build something together.
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
          </p>
        </div>

        <ContactForm
          contactEmailConfigured={contactEmailConfigured}
          framerEnabled={FEATURES.framerMotion}
        />
      </div>
    </section>
  );
}
```

---

## Step 7 — Create `src/app/api/contact/route.ts`

The backend handler. Validates the data again server-side (never trust client-only validation) and returns appropriate error codes.

```ts
// src/app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!contactEmail) {
    console.warn('[portfolio] CONTACT_EMAIL is not set — contact form disabled');
    return NextResponse.json({ error: 'Contact form is not configured.' }, { status: 503 });
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name?.trim() || name.trim().length > 100) {
    return NextResponse.json({ error: 'Invalid name.' }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }
  if (!message?.trim() || message.trim().length > 2000) {
    return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
  }

  try {
    // Using Resend — swap for nodemailer if preferred
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: contactEmail,
      subject: `Portfolio contact from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email}\n\n${message.trim()}`,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[portfolio] Failed to send email:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
```

> Note: Add `RESEND_API_KEY=your_key` to `.env.local`. Get a free key at resend.com. If you prefer nodemailer, swap the send block — the validation logic stays identical.

---

## Step 8 — Update `src/app/page.tsx` with all sections

```tsx
// src/app/page.tsx

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
      <main id="main-content" className="pt-16">
        <HeroSection />
        <WorkSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

---

## Step 9 — Write property tests

Create `src/components/ui/__tests__/ProjectCard.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ProjectCard } from '../ProjectCard';
import type { Project } from '@/types';

const arbProject = fc.record<Project>({
  id:                  fc.string({ minLength: 1 }),
  title:               fc.string({ minLength: 1 }),
  category:            fc.string({ minLength: 1 }),
  year:                fc.integer({ min: 2000, max: 2099 }),
  techStack:           fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  features:            fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  outcomeMetrics:      fc.array(fc.string()),
  imagePlaceholderType: fc.constantFrom('gradient' as const, 'terminal' as const),
  repoUrl:             fc.option(fc.webUrl(), { nil: undefined }),
  repoLabel:           fc.option(fc.string(), { nil: undefined }),
  reflectionText:      fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
});

describe('ProjectCard', () => {
  it('always renders category, year, all tech stack and feature items (P1)', () => {
    fc.assert(fc.property(arbProject, (project) => {
      const { getByText, getAllByText } = render(
        <ProjectCard project={project} index={0} framerEnabled={false} />
      );
      expect(() => getByText(project.category)).not.toThrow();
      expect(() => getAllByText(String(project.year))).not.toThrow();
      project.techStack.forEach((t) => expect(() => getByText(t)).not.toThrow());
      project.features.forEach((f) => expect(() => getByText(f)).not.toThrow());
    }));
  });

  it('only shows repo link when repoUrl is defined (P2)', () => {
    fc.assert(fc.property(arbProject, (project) => {
      const { container } = render(
        <ProjectCard project={project} index={0} framerEnabled={false} />
      );
      const links = Array.from(container.querySelectorAll('a[href]'));
      const repoLinks = links.filter((a) => a.getAttribute('href') === project.repoUrl);
      if (project.repoUrl) {
        expect(repoLinks.length).toBeGreaterThan(0);
      } else {
        expect(repoLinks.length).toBe(0);
      }
    }));
  });
});
```

Create `src/components/ui/__tests__/ContactForm.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ContactForm } from '../ContactForm';

describe('ContactForm validation', () => {
  it('rejects whitespace-only name on blur (P3)', () => {
    fc.assert(fc.property(fc.stringMatching(/^\s+$/), (whitespace) => {
      const { getByLabelText, getByText } = render(
        <ContactForm contactEmailConfigured framerEnabled={false} />
      );
      const input = getByLabelText(/name/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: whitespace } });
      fireEvent.blur(input);
      expect(() => getByText(/name is required/i)).not.toThrow();
    }));
  });

  it('rejects invalid email formats on blur (P4)', () => {
    const invalidEmails = fc.oneof(
      fc.string({ maxLength: 10 }).filter((s) => !s.includes('@')),
      fc.constant('@nodomain'),
      fc.constant('noatsign'),
      fc.constant('double@@at.com'),
    );
    fc.assert(fc.property(invalidEmails, (bad) => {
      const { getByLabelText, getByText } = render(
        <ContactForm contactEmailConfigured framerEnabled={false} />
      );
      const input = getByLabelText(/email/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: bad } });
      fireEvent.blur(input);
      expect(() => getByText(/valid email/i)).not.toThrow();
    }));
  });
});
```

---

## Done when

Before moving to Stage 05, confirm all of these:

- [ ] `npm run dev` — all five sections are visible and styled correctly
- [ ] Hero "View My Work" and "Get in Touch" buttons scroll smoothly to the right sections
- [ ] FRACA card shows the GitHub link; Nova card has no repo link
- [ ] Contact form shows validation errors on blur for empty or invalid fields
- [ ] Contact form submit button is disabled if `CONTACT_EMAIL` is not set
- [ ] `npx vitest --run` — all tests pass (Footer + ProjectCard + ContactForm)
- [ ] No TypeScript errors (`npx tsc --noEmit`)

---

> ✅ All boxes checked — proceed to `stage-05-animations.md`.
