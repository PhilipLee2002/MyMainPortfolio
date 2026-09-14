'use client';

import { createContext, useContext, MutableRefObject } from 'react';
import type Lenis from 'lenis';

export const LenisContext = createContext<MutableRefObject<Lenis | null> | null>(null);

export function useLenis(): MutableRefObject<Lenis | null> | null {
  return useContext(LenisContext);
}
