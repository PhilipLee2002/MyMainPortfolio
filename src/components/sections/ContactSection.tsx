import { ContactForm } from '@/components/ui/ContactForm';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FEATURES } from '@/lib/features';
import { SOCIALS } from '@/lib/socials';

export function ContactSection() {
  const contactEmailConfigured = Boolean(process.env.CONTACT_EMAIL);

  return (
    <section
      id="contact"
      className="px-6 py-[var(--spacing-section-mobile)] sm:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop-max)]"
    >
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

        <div className="flex flex-col gap-10 lg:max-w-md lg:pt-2">
          <div>
            <ScrollReveal y={24}>
              <h2 className="font-display font-bold text-[var(--text)] text-5xl sm:text-6xl mb-5 leading-[0.95] tracking-tight">
                Let&apos;s build something together.
              </h2>
            </ScrollReveal>
            <p className="text-[var(--muted)] leading-relaxed font-light text-base sm:text-lg">
              Have a project in mind or want to collaborate? I&apos;d love to hear from you.
            </p>
          </div>

          <div className="pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-4">Find me elsewhere</p>
            <div className="flex items-center gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Philip Lee's ${s.platform} profile`}
                  data-cursor-hover
                  className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors min-h-11 min-w-11 flex items-center justify-center"
                >
                  {/* UPDATE WITH REAL URLs */}
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <ContactForm
          contactEmailConfigured={contactEmailConfigured}
          framerEnabled={FEATURES.framerMotion}
        />
      </div>
    </section>
  );
}
