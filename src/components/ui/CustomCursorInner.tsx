'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CustomCursorInner() {
  const reducedMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);

  const x = useSpring(0, { stiffness: 500, damping: 40 });
  const y = useSpring(0, { stiffness: 500, damping: 40 });
  const scale = useSpring(1, {
    stiffness: 400,
    damping: 40, // near-critical — avoids the wobble a lighter damping causes on a 12px→30px hop
    duration: reducedMotion ? 0 : undefined,
  });
  // Starts at 0 so the dot doesn't flash at the top-left corner (its default
  // fixed position) before the first real mousemove places it under the cursor.
  const opacity = useSpring(0, { stiffness: 400, damping: 40 });

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.cursor = 'none';

    let hasMoved = false;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 6);
      y.set(e.clientY - 6);
      if (!hasMoved) {
        hasMoved = true;
        opacity.set(1);
      }
    };

    const onEnter = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-cursor-hover]')) {
        scale.set(2.5);
        setHovering(true);
      }
    };

    const onLeave = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-cursor-hover]')) {
        scale.set(1);
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onEnter);
    window.addEventListener('mouseout', onLeave);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onEnter);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [x, y, scale, opacity]);

  return (
    <motion.div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: '50%',
        // Hollow ring on hover instead of a bigger solid disc — a solid dot at
        // 2.5x scale (30px) fully blots out the link/button text it's over.
        // Border width stays constant so only color transitions (avoids a
        // none↔length jump, which doesn't animate smoothly).
        backgroundColor: hovering ? 'transparent' : 'var(--accent)',
        border: '1.5px solid',
        borderColor: hovering ? 'var(--accent)' : 'transparent',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        pointerEvents: 'none',
        zIndex: 9999,
        x,
        y,
        scale,
        opacity,
      }}
    />
  );
}
