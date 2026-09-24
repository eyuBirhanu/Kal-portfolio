// src/hooks/useReveal.ts
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./useMediaQuery";

/**
 * Scroll-triggered reveal. Fires once, then disconnects — the old build ran six
 * animations permanently, which is what made it read as cheap.
 * Returns visible=true immediately when reduced motion is requested.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const { threshold = 0.15, rootMargin = "0px 0px -10% 0px" } = options;
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, threshold, rootMargin]);

  return { ref, visible };
}
