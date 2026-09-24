// src/components/primitives/Reveal.tsx
import { useReveal } from "../../hooks/useReveal";
import { cn } from "../../lib/cn";

/** Fades and rises its children into view once. No-ops under reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Stagger in ms — keep under ~250 or it reads as sluggish. */
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(visible ? "animate-rise" : "opacity-0", className)}
    >
      {children}
    </div>
  );
}
