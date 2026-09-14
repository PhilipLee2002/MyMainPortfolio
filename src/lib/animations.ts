// Framer Motion page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: -16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// GSAP ease strings
export const EASE = {
  smooth: 'power2.out',
  strong: 'power3.out',
} as const;

// GSAP animation durations (seconds)
export const DURATION = {
  heading: 0.85,
  card: 1.0,
  cardStagger: 0.15,
} as const;
