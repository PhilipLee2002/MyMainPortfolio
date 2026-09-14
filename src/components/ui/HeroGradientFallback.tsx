interface HeroGradientFallbackProps {
  /** When true, fills the parent instead of an inset square card. */
  fullBleed?: boolean;
}

export function HeroGradientFallback({ fullBleed = false }: HeroGradientFallbackProps) {
  if (fullBleed) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 45%, var(--accent-glow) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="hidden lg:block rounded-2xl w-full aspect-square max-w-md mx-auto"
      style={{
        background: 'radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%)',
        border: '1px solid var(--border)',
      }}
      aria-hidden="true"
    />
  );
}
