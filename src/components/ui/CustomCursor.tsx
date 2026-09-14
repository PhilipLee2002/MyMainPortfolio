'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { FEATURES } from '@/lib/features';

const CustomCursorInner = dynamic(() => import('./CustomCursorInner'), {
  ssr: false,
});

export function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!FEATURES.customCursor || !isDesktop) return null;

  return <CustomCursorInner />;
}
