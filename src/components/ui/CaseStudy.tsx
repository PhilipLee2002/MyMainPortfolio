'use client';

import { useEffect, useRef } from 'react';
import type { Project, ProjectImage } from '@/types';
import { FEATURES } from '@/lib/features';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface CaseStudyProps {
  project: Project;
  framerEnabled: boolean;
  index: number;
  /** Full entries keep a large visual column. Compact entries are the same
   *  fields, set in a shorter measure for work that is still early. */
  density: 'full' | 'short';
  /** Turn off scroll-tied fades when this study sits inside the project scroller.
   *  That scroller moves the copy with a transform, so a document scroll trigger
   *  would leave the title invisible. */
  reveal?: boolean;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-3">{children}</p>
  );
}

function hostLabel(href: string) {
  try {
    return new URL(href).host.replace(/^www\./, '');
  } catch {
    return href;
  }
}

function ImageStack({ images }: { images: ProjectImage[] }) {
  return (
    <div className="flex flex-col gap-8">
      {images.map((image, index) => (
        <figure
          key={image.src}
          className="overflow-hidden"
          style={{
            background: '#101010',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 22px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <figcaption
            className="flex items-center gap-3 px-3.5 h-9"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <span className="text-[10px] tabular-nums tracking-[0.14em] text-[var(--accent)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              {image.label}
            </span>
          </figcaption>
          <img
            src={image.src}
            alt={image.alt}
            draggable={false}
            decoding="async"
            className="block w-full h-auto"
          />
        </figure>
      ))}
    </div>
  );
}

function TerminalStage({ caption }: { caption: string }) {
  return (
    <figure className="flex flex-col gap-3">
      <div
        className="relative w-full aspect-[16/10] overflow-hidden flex flex-col"
        style={{
          background: '#0a0a0a',
          border: '1px solid var(--border)',
        }}
      >
        <div
          className="h-8 flex items-center gap-1.5 px-3 shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(212,155,74,0.45)' }} />
          <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
          <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
          <span className="ml-3 text-[10px] tracking-wide uppercase text-[var(--muted)] font-mono">
            nova — local session
          </span>
        </div>
        <div className="flex-1 px-6 sm:px-8 py-8 font-mono text-sm leading-relaxed">
          <p className="text-[var(--accent)]">$ nova</p>
          <p className="text-[var(--muted)] mt-3">offline · this machine</p>
        </div>
      </div>
      <figcaption className="text-sm font-light text-[var(--muted)]">
        {caption}
      </figcaption>
    </figure>
  );
}

function StudyBody({ project, dense }: { project: Project; dense: boolean }) {
  return (
    <div className={dense ? 'flex flex-col gap-6' : 'flex flex-col gap-8'}>
      <div>
        <Label>Problem</Label>
        <p className={`text-[var(--text)] font-light leading-relaxed ${dense ? 'text-sm' : 'text-base'}`}>
          {project.problem}
        </p>
      </div>

      <div>
        <Label>{project.contributionLabel}</Label>
        <p className={`text-[var(--text)] font-light leading-relaxed ${dense ? 'text-sm' : 'text-base'}`}>
          {project.contribution}
        </p>
        {project.highlights.length > 0 && (
          <div className="mt-6">
            <Label>Features</Label>
            <ul className="space-y-3">
              {project.highlights.map((item) => (
                <li key={item} className={`text-[var(--text)] flex gap-2 font-light leading-relaxed ${dense ? 'text-sm' : 'text-base'}`}>
                  <span className="text-[var(--accent)] shrink-0" aria-hidden="true">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {project.note && (
        <div className="pl-4" style={{ borderLeft: '2px solid var(--accent)' }}>
          <Label>{project.note.label}</Label>
          <p className={`text-[var(--muted)] font-light leading-relaxed ${dense ? 'text-sm' : 'text-base'}`}>
            {project.note.body}
          </p>
        </div>
      )}

      <div>
        <Label>Stack</Label>
        {project.techStack.length > 0 && (
          <ul className="tech-list" aria-label="Tech stack">
            {project.techStack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        )}
        {project.stackNote && (
          <p className="text-sm text-[var(--muted)] font-light">{project.stackNote}</p>
        )}
      </div>

      <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
        <Label>What I&apos;d point to</Label>
        <p className={`text-[var(--muted)] font-light leading-relaxed ${dense ? 'text-sm' : 'text-base'}`}>
          {project.pointTo}
        </p>
      </div>
    </div>
  );
}

export function CaseStudy({ project, framerEnabled, index, density, reveal = true }: CaseStudyProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const full = density === 'full';
  const shots = project.images ?? [];
  const showTerminal = shots.length === 0 && project.imagePlaceholderType === 'terminal';
  const hasVisual = full && (shots.length > 0 || showTerminal);
  const number = String(index + 1).padStart(2, '0');

  useEffect(() => {
    if (!reveal || !hasVisual) return;
    if (!FEATURES.scrollAnimations || reducedMotion) return;
    if (!visualRef.current) return;

    let cancelled = false;
    let tweenRef: gsap.core.Tween | undefined;

    const run = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        tweenRef = gsap.fromTo(
          visualRef.current,
          { scale: 1.06, opacity: 0.55 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: visualRef.current!,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 1,
            },
          },
        );
      } catch (err) {
        console.warn('[CaseStudy] GSAP setup failed:', err);
      }
    };

    run();

    return () => {
      cancelled = true;
      tweenRef?.scrollTrigger?.kill();
    };
  }, [reducedMotion, hasVisual, reveal]);

  const headerBody = (
    <>
      <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
        <span className="tabular-nums">{number}</span>
        <span aria-hidden="true">·</span>
        <span>{project.category}</span>
      </div>
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)] mt-4">
        {project.status}
      </p>
      <h3
        id={`${project.id}-title`}
        className={`font-display font-bold text-[var(--text)] leading-[1.08] tracking-tight mt-3 ${
          full ? 'text-3xl sm:text-4xl lg:text-[2.75rem]' : 'text-2xl sm:text-3xl'
        }`}
      >
        {project.title}
      </h3>
      <p className={`font-light leading-relaxed mt-4 ${full ? 'text-base sm:text-lg text-[var(--text)]' : 'text-sm sm:text-base text-[var(--muted)]'}`}>
        {project.tagline}
      </p>
      {project.role && (
        <p className="text-sm text-[var(--muted)] font-light mt-3">{project.role}</p>
      )}
      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="inline-block mt-4 text-sm text-[var(--accent)] hover:underline"
        >
          {hostLabel(project.href)}
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="inline-block mt-4 text-sm text-[var(--accent)] hover:underline"
        >
          {project.repoLabel ?? 'Repository'}
        </a>
      )}
    </>
  );

  const header = reveal ? <ScrollReveal y={24}>{headerBody}</ScrollReveal> : headerBody;

  return (
    <article
      aria-labelledby={`${project.id}-title`}
      data-cursor-hover={framerEnabled ? true : undefined}
      className={
        hasVisual
          ? 'grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] gap-10 lg:gap-16 items-start border-t border-[var(--border)] pt-12 lg:pt-16'
          : full
            ? 'max-w-3xl border-t border-[var(--border)] pt-12 lg:pt-16'
            : 'max-w-3xl border-t border-[var(--border)] pt-10'
      }
    >
      {hasVisual && (
        <div
          ref={visualRef}
          className={shots.length > 1 ? 'origin-center' : 'lg:sticky lg:top-24 origin-center'}
          style={{ willChange: 'transform, opacity' }}
        >
          {shots.length > 0 ? (
            <ImageStack images={shots} />
          ) : (
            <TerminalStage caption={project.imageNotes.join(' · ')} />
          )}
        </div>
      )}

      <div className="flex flex-col gap-8 lg:gap-10">
        {header}
        <StudyBody project={project} dense={!full} />
        {!full && (
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            {project.imageNotes.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>
    </article>
  );
}
