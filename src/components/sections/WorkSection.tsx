'use client';

import { PROJECTS } from '@/lib/projects';
import { FEATURES } from '@/lib/features';
import { CaseStudy } from '@/components/ui/CaseStudy';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function WorkSection() {
  return (
    <section
      id="work"
      className="px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)]"
    >
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal y={24}>
          <h2 className="font-display font-bold text-[var(--text)] text-4xl mb-4">
            Selected Work
          </h2>
          <p className="text-[var(--muted)] font-light mb-14 max-w-xl">
            Case studies in systems that solve real operational and creative constraints.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-24 lg:gap-32">
          {PROJECTS.map((project) => (
            <CaseStudy
              key={project.id}
              project={project}
              framerEnabled={FEATURES.framerMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
