import Image from 'next/image';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const skills = ['UI/UX', 'Laravel', 'PHP', 'MySQL', 'Python', 'AI tooling', 'Next.js'];

export function AboutSection() {
  return (
    <section
      id="about"
      className="px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-min)]"
    >
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[auto_1fr] gap-12 lg:gap-20 items-center">

        <div className="flex justify-center lg:justify-start">
          <div className="relative mr-3.5 mb-3.5">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 translate-x-3.5 translate-y-3.5"
              style={{ border: '1px solid rgba(212, 155, 74, 0.6)' }}
            />
            <div
              className="relative z-10 p-2"
              style={{
                background: '#1a1a1a',
                boxShadow: '0 22px 48px rgba(0, 0, 0, 0.5), 0 0 32px rgba(212, 155, 74, 0.12)',
              }}
            >
              <div
                className="p-[2px]"
                style={{
                  background:
                    'linear-gradient(145deg, #f0d7a2 0%, #d49b4a 38%, rgba(255,255,255,0.35) 62%, #b67d32 100%)',
                }}
              >
                <div
                  className="relative w-64 h-80 sm:w-72 sm:h-[22rem] lg:w-80 lg:h-[26rem] overflow-hidden"
                  style={{ background: 'var(--surface)' }}
                >
                  <Image
                    src="/profile.jpg"
                    alt="Philip Lee"
                    fill
                    sizes="(min-width: 1024px) 320px, 288px"
                    className="object-cover object-[center_22%]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="max-w-2xl">
          <ScrollReveal y={24}>
            <h2 className="font-display font-bold text-[var(--text)] text-5xl sm:text-6xl mb-6 tracking-tight">About</h2>
          </ScrollReveal>

          <p className="text-[var(--text)] font-body font-light leading-relaxed mb-6 text-base sm:text-lg">
            I&apos;m Philip Lee, a full-stack developer who builds practical, high-impact digital solutions.
            Currently in my final year at KCA University, I specialize in architecting robust systems with
            Laravel and a small local model for short replies. From a staff inventory system for a furniture shop
            to a terminal tool that measures the machine in Python, I thrive at the intersection of system-thinking
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
