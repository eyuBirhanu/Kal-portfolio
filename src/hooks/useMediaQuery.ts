// src/hooks/useMediaQuery.ts
import { useEffect, useState } from "react";

/** SSR-safe media query hook. Returns false during prerender. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True only on devices with a real cursor — gates the hover preview. */
export const useHasPointer = () => useMediaQuery("(pointer: fine)");

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
