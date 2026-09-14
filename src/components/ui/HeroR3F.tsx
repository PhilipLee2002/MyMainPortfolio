'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HeroGradientFallback } from './HeroGradientFallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const HeroR3FDynamic = dynamic(() => import('./HeroR3FInner'), {
  ssr: false,
  loading: () => <HeroGradientFallback fullBleed />,
});

// Simple error boundary to catch WebGL failures
class R3FErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <HeroGradientFallback fullBleed />;
    return this.props.children;
  }
}

export function HeroR3F() {
  const reducedMotion = useReducedMotion();
  return (
    <R3FErrorBoundary>
      <HeroR3FDynamic reducedMotion={reducedMotion} />
    </R3FErrorBoundary>
  );
}
