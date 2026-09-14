'use client';

import { useRef } from 'react';
import { motion, type AnimationDefinition } from 'framer-motion';
import { pageVariants } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const mainRef = useRef<HTMLElement>(null);

  // A CSS transform on any ancestor becomes a new containing block, which
  // breaks `position: fixed` for descendants — including GSAP ScrollTrigger's
  // pinned Work-section slider, which then renders far off-screen. Framer
  // Motion leaves its resolved `transform: translateY(0px)` on this element
  // permanently after the intro finishes, so clear it once the one-off intro
  // animation completes (this page never unmounts, so `exit` never runs).
  const handleAnimationComplete = (definition: AnimationDefinition) => {
    if (definition === 'animate' && mainRef.current) {
      mainRef.current.style.transform = '';
    }
  };

  return (
    <motion.main
      ref={mainRef}
      id="main-content"
      className="pt-16"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onAnimationComplete={handleAnimationComplete}
    >
      {children}
    </motion.main>
  );
}
