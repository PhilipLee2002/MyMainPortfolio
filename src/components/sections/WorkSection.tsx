'use client';

import { PROJECTS } from '@/lib/projects';
import { FEATURES } from '@/lib/features';
import { CaseStudy } from '@/components/ui/CaseStudy';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ProjectScroller } from '@/components/ui/ProjectScroller';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function WorkSection() {
  const reducedMotion = useReducedMotion();
  const featured = PROJECTS.filter((project) => project.weight === 'featured');
  const compact = PROJECTS.filter((project) => project.weight === 'compact');

  return (
    <section id="work">
      <div className="px-6 pt-[var(--spacing-section-mobile)] sm:pt-[var(--spacing-section-tablet)] lg:pt-[var(--spacing-section-desktop-min)]">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal y={24}>
            <h2 className="font-display font-bold text-[var(--text)] text-5xl sm:text-6xl mb-4 tracking-tight">
              Selected Work
            </h2>
            <p className="text-[var(--muted)] font-light mb-12 max-w-xl">
              Work that&apos;s live, ready, or finished.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {reducedMotion ? (
        <div className="px-6 pb-[var(--spacing-section-mobile)] sm:pb-[var(--spacing-section-tablet)] lg:pb-[var(--spacing-section-desktop-min)]">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col gap-24 lg:gap-36">
              {featured.map((project) => (
                <CaseStudy
                  key={project.id}
                  project={project}
                  index={PROJECTS.findIndex((item) => item.id === project.id)}
                  density="full"
                  framerEnabled={FEATURES.framerMotion}
                />
              ))}
            </div>

            {compact.length > 0 && (
              <div className="mt-28 lg:mt-40">
                <ScrollReveal y={24}>
                  <h3 className="font-display font-bold text-[var(--text)] text-3xl sm:text-4xl mb-12 tracking-tight">
                    In development
                  </h3>
                </ScrollReveal>
                <div className="flex flex-col gap-16">
                  {compact.map((project) => (
                    <CaseStudy
                      key={project.id}
                      project={project}
                      index={PROJECTS.findIndex((item) => item.id === project.id)}
                      density="short"
                      framerEnabled={FEATURES.framerMotion}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ProjectScroller projects={PROJECTS} framerEnabled={FEATURES.framerMotion} />
      )}
    </section>
  );
}
