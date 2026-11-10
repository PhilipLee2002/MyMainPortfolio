'use client';

import { PROJECTS, PROJECT_STAGES } from '@/lib/projects';
import { FEATURES } from '@/lib/features';
import { CaseStudy } from '@/components/ui/CaseStudy';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ProjectScroller } from '@/components/ui/ProjectScroller';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function WorkSection() {
  const reducedMotion = useReducedMotion();
  const groups = PROJECT_STAGES.map((stage) => ({
    ...stage,
    projects: PROJECTS.filter((project) => project.stage === stage.id),
  })).filter((group) => group.projects.length > 0);
  const sideways = PROJECTS.filter((project) => project.stage !== 'planning');
  const planning = groups.find((group) => group.id === 'planning');

  return (
    <section id="work">
      <div className="px-6 pt-[var(--spacing-section-mobile)] sm:pt-[var(--spacing-section-tablet)] lg:pt-[var(--spacing-section-desktop-min)]">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal y={24}>
            <h2 className="font-display font-bold text-[var(--text)] text-5xl sm:text-6xl mb-4 tracking-tight">
              Selected Work
            </h2>
            <p className="text-[var(--muted)] font-light mb-12 max-w-xl">
              Live work, finished work that is not online yet, and what is still being built or planned.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {reducedMotion ? (
        <div className="px-6 pb-[var(--spacing-section-mobile)] sm:pb-[var(--spacing-section-tablet)] lg:pb-[var(--spacing-section-desktop-min)]">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-28 lg:gap-40">
            {groups.map((group) => (
              <div key={group.id}>
                <ScrollReveal y={24}>
                  <h3 className="font-display font-bold text-[var(--text)] text-3xl sm:text-4xl mb-12 tracking-tight">
                    {group.label}
                  </h3>
                </ScrollReveal>
                <div className="flex flex-col gap-24 lg:gap-36">
                  {group.projects.map((project) => (
                    <CaseStudy
                      key={project.id}
                      project={project}
                      index={PROJECTS.findIndex((item) => item.id === project.id)}
                      density={project.stage === 'planning' ? 'short' : 'full'}
                      framerEnabled={FEATURES.framerMotion}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <ProjectScroller projects={sideways} framerEnabled={FEATURES.framerMotion} />
          {planning && (
            <div className="px-6 pt-20 pb-[var(--spacing-section-mobile)] sm:pb-[var(--spacing-section-tablet)] lg:pb-[var(--spacing-section-desktop-min)]">
              <div className="max-w-[1200px] mx-auto">
                <ScrollReveal y={24}>
                  <h3 className="font-display font-bold text-[var(--text)] text-3xl sm:text-4xl mb-12 tracking-tight">
                    {planning.label}
                  </h3>
                </ScrollReveal>
                <div className="flex flex-col gap-16">
                  {planning.projects.map((project) => (
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
            </div>
          )}
        </>
      )}
    </section>
  );
}
