import { ScrollReveal } from '@/components/ui/ScrollReveal';

const skills = ['Laravel', 'PHP', 'MySQL', 'Python', 'AI tooling', 'Next.js'];

export function AboutSection() {
  return (
    <section
      id="about"
      className="px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)]"
    >
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[auto_1fr] gap-12 lg:gap-20 items-start">

        {/* Portrait slot — monogram until real photo at /public/profile.jpg */}
        <div className="flex justify-center lg:justify-start">
          {/* REPLACE WITH PROFILE PHOTO */}
          <div
            className="relative w-36 h-36 sm:w-40 sm:h-40 overflow-hidden flex items-center justify-center font-display font-bold text-4xl text-[var(--accent)]"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', minWidth: 80, minHeight: 80 }}
            aria-label="PL monogram — profile photo placeholder"
          >
            PL
          </div>
        </div>

        {/* Bio */}
        <div className="max-w-2xl">
          <ScrollReveal y={24}>
            <h2 className="font-display font-bold text-[var(--text)] text-4xl mb-6">About</h2>
          </ScrollReveal>

          <p className="text-[var(--text)] font-body font-light leading-relaxed mb-6 text-base sm:text-lg">
            I&apos;m Philip Lee, a full-stack developer who builds practical, high-impact digital solutions.
            Currently in my final year at KCA University, I specialize in architecting robust systems with
            Laravel and exploring the cutting edge of local AI. From automating inventory for furniture SMEs
            to creating offline terminal-based AI assistants, I thrive at the intersection of system-thinking
            and user experience. I don&apos;t just write code—I solve real business problems with clean, scalable architecture.
          </p>

          <p className="text-[var(--muted)] text-sm mb-10 font-light">
            Final-year Software Development student at KCA University (Graduating December 2026)
          </p>

          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">Technologies</p>
            <ul className="tech-list" aria-label="Key technologies">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
