// src/components/primitives/HoverPreview.tsx
import { cn } from "../../lib/cn";

/**
 * The floating card that trails the cursor.
 *
 * Moved out of components/work — it's no longer a work-only interaction. It
 * now takes a finished image URL rather than a project, so the caller decides
 * what it's previewing and what transform to request.
 *
 * pointer-events-none is essential, or the card sits under the cursor and
 * steals the hover from the element that spawned it.
 */
export function HoverPreview({
  src,
  nodeRef,
  width = 300,
  height = 200,
  className,
}: {
  /** Null hides the card. Pass an already-transformed URL. */
  src: string | null;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      ref={nodeRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 hidden sm:block"
    >
      <div
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card border border-line-strong",
          "bg-card shadow-2xl transition-all duration-300 ease-out",
          src ? "scale-100 opacity-100" : "scale-90 opacity-0",
          className
        )}
        style={{ width, height }}
      >
        {src && <img src={src} alt="" className="h-full w-full object-cover" />}
      </div>
    </div>
  );
}