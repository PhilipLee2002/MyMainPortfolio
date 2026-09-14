'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/types';
import { FEATURES } from '@/lib/features';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface CaseStudyProps {
  project: Project;
  framerEnabled: boolean;
}

function TerminalStage() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: '#0a0a0a',
        border: '1px solid var(--border)',
        aspectRatio: '16 / 9',
        maxHeight: 360,
      }}
    >
      {/* REPLACE WITH NOVA SCREENSHOT */}
      <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-1.5 px-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(212,155,74,0.45)' }} />
        <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
        <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
        <span className="ml-3 text-[10px] tracking-wide uppercase text-[var(--muted)] font-mono">nova — local session</span>
      </div>
      <div className="pt-10 px-5 pb-5 font-mono text-xs leading-relaxed">
        <p className="text-[var(--accent)]">$ nova</p>
        <p className="text-[var(--muted)] mt-2">Nova Terminal AI — ready</p>
        <p className="text-[var(--text)] mt-4 opacity-80">/scaffold api/users</p>
        <p className="text-[var(--muted)] mt-2">generating · offline · no api key</p>
        <p className="text-[var(--accent)] mt-4">done in 6.4s</p>
      </div>
    </div>
  );
}

export function CaseStudy({ project, framerEnabled }: CaseStudyProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
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
  }, [reducedMotion]);

  return (
    <article
      data-cursor-hover={framerEnabled ? true : undefined}
      className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-start"
    >
      <div
        ref={visualRef}
        className="lg:sticky lg:top-24 origin-center"
        style={{ willChange: 'transform, opacity' }}
      >
        {project.imagePlaceholderType === 'terminal' ? (
          <TerminalStage />
        ) : (
          <div
            className="w-full"
            style={{
              aspectRatio: '16 / 10',
              maxHeight: 480,
              background: 'linear-gradient(135deg, var(--surface) 0%, var(--accent-glow) 100%)',
              border: '1px solid var(--border)',
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-8">
        <ScrollReveal y={24}>
          <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </div>
          <h3 className="font-display font-bold text-[var(--text)] text-3xl lg:text-[2.35rem] leading-tight mt-3">
            {project.title}
          </h3>
          {project.outcomeMetrics[0] && (
            <p className="text-[var(--accent)] font-body font-medium text-base leading-snug mt-4">
              {project.outcomeMetrics[0]}
            </p>
          )}
        </ScrollReveal>

        <ul className="tech-list" aria-label="Tech stack">
          {project.techStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">Features</p>
            <ul className="space-y-2">
              {project.features.map((f) => (
                <li key={f} className="text-sm text-[var(--text)] flex gap-2 font-light">
                  <span className="text-[var(--accent)] shrink-0" aria-hidden="true">—</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">Outcomes</p>
            <ul className="space-y-2">
              {project.outcomeMetrics.map((m) => (
                <li key={m} className="text-sm text-[var(--accent)] font-light">{m}</li>
              ))}
            </ul>
          </div>
        </div>

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

        {project.reflectionText && (
          <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Reflection</p>
            <p className="text-sm text-[var(--muted)] leading-relaxed font-light">{project.reflectionText}</p>
          </div>
        )}
      </div>
    </article>
  );
}
