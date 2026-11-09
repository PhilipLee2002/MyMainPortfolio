'use client';

import { TICKER_LABEL, TICKER_WORDS } from '@/lib/ticker';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function Segment() {
  return (
    <span className="inline-flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10">
      {TICKER_WORDS.map((word) => (
        <span key={word} className="inline-flex items-center gap-6 sm:gap-10">
          <span className="font-display font-bold tracking-tight text-[clamp(1.75rem,4vw,3.25rem)] text-[var(--text)]">
            {word}
          </span>
          <span className="text-[var(--accent)]" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
    </span>
  );
}

export function WordTicker() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="relative overflow-hidden border-y border-[var(--border)] py-5"
      style={{ background: 'color-mix(in srgb, var(--bg) 70%, transparent)' }}
    >
      <p className="sr-only">{TICKER_LABEL}</p>
      <div
        className={`flex w-max whitespace-nowrap${reducedMotion ? '' : ' word-ticker-track'}`}
        aria-hidden="true"
      >
        <span className="flex">
          <Segment />
          <Segment />
        </span>
        <span className="flex">
          <Segment />
          <Segment />
        </span>
      </div>
    </div>
  );
}
