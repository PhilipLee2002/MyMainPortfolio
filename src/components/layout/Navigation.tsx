'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';
import { FEATURES } from '@/lib/features';

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenisRef = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const lenis = lenisRef?.current;
    const onLenisScroll = () => setScrolled((lenis?.scroll ?? window.scrollY) > 24);
    lenis?.on('scroll', onLenisScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      lenis?.off('scroll', onLenisScroll);
    };
  }, [lenisRef]);

  function scrollTo(id: string) {
    setMenuOpen(false);
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(id, { duration: 1.0 });
    } else {
      // Fallback if Lenis hasn't initialised (reduced motion / SSR)
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const links = [
    { label: 'Work',    target: '#work'    },
    { label: 'About',   target: '#about'   },
    { label: 'Contact', target: '#contact' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-50 transition-[background-color,border-color,backdrop-filter] duration-300"
      style={{
        background: scrolled ? 'rgba(14, 14, 14, 0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">

        {/* Wordmark — secondary to hero brand scale */}
        <button
          onClick={() => scrollTo('#main-content')}
          data-cursor-hover
          className="font-display font-bold text-base text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          aria-label="Philip Lee — scroll to top"
        >
          Philip Lee
        </button>

        {/* Desktop links */}
        <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-8">
          {links.map((link) =>
            FEATURES.framerMotion ? (
              <motion.button
                key={link.label}
                onClick={() => scrollTo(link.target)}
                data-cursor-hover
                initial="rest"
                animate="rest"
                whileHover="hover"
                className="relative text-[var(--muted)] hover:text-[var(--text)] transition-colors text-sm font-medium min-h-11 flex items-center"
              >
                {link.label}
                {/* Variants propagate down from the button's whileHover state,
                    so the whole link — not just this 1px strip — is the hover target. */}
                <motion.span
                  className="absolute bottom-2 left-0 h-px bg-[var(--accent)]"
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{ originX: 0, width: '100%' }}
                  aria-hidden="true"
                />
              </motion.button>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollTo(link.target)}
                data-cursor-hover
                className="text-[var(--muted)] hover:text-[var(--text)] transition-colors text-sm font-medium min-h-11"
              >
                {link.label}
              </button>
            )
          )}

          <a
            href="/cv-philip-lee.pdf"
            download
            data-cursor-hover
            className="
              px-4 py-2 rounded border border-[var(--accent)]
              text-[var(--accent)] text-sm font-medium
              hover:bg-[var(--accent)] hover:text-[var(--bg)]
              transition-colors min-h-11 flex items-center
            "
          >
            Download CV
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-[var(--text)] p-2 min-h-11 min-w-11 flex items-center justify-center"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden border-b border-[var(--border)] px-6 py-6 flex flex-col gap-6"
          style={{ background: 'rgba(22, 22, 22, 0.98)', backdropFilter: 'blur(12px)' }}
        >
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.target)}
              className="text-left text-[var(--text)] text-lg font-medium hover:text-[var(--accent)] transition-colors min-h-11"
            >
              {link.label}
            </button>
          ))}

          <a
            href="/cv-philip-lee.pdf"
            download
            onClick={() => setMenuOpen(false)}
            className="text-[var(--accent)] text-lg font-medium min-h-11 flex items-center"
          >
            Download CV
          </a>
        </div>
      )}
    </header>
  );
}
