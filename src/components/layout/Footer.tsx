import { SOCIALS } from '@/lib/socials';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        <p className="text-[var(--muted)] text-sm">
          © 2026 Philip Lee. Built with Next.js &amp; ☕
        </p>

        <div className="flex items-center gap-5">
          {SOCIALS.map((s) => (
            <a
              key={s.platform}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Philip Lee's ${s.platform} profile`}
              data-cursor-hover
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
