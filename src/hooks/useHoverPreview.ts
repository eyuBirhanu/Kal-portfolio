// src/hooks/useHoverPreview.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useHasPointer } from "./useMediaQuery";

/**
 * Drives a floating preview that follows the cursor.
 *
 * Position is written straight to the element's transform inside a rAF loop
 * rather than through React state — re-rendering on every mousemove would
 * drop frames. Only the active item is state.
 *
 * Returns nothing on touch devices: there is no hover to hang this on, and
 * the underlying content has to stand on its own there anyway.
 *
 * Generic over what's being previewed. The list view tracks a whole
 * ResolvedProject because it needs the thumbnail off it; the hero tracks a
 * single image URL. Neither cares how the other uses it.
 */
export function useHoverPreview<T>() {
  const hasPointer = useHasPointer();
  const [active, setActive] = useState<T | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number>(0);

  useEffect(() => {
    if (!hasPointer || !active) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      // Lerp toward the cursor so the card trails slightly instead of snapping
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      if (nodeRef.current) {
        nodeRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame.current);
    };
  }, [hasPointer, active]);

  const show = useCallback(
    (item: T) => {
      if (hasPointer) setActive(item);
    },
    [hasPointer]
  );

  const hide = useCallback(() => setActive(null), []);

  return { enabled: hasPointer, active, nodeRef, show, hide };
}