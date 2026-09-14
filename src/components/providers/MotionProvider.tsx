'use client';

import { MotionConfig, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </MotionConfig>
  );
}
