// src/components/primitives/Pill.tsx
import { cn } from "../../lib/cn";

/** Static tag chip — tools, categories, tags. Decorative, so it keeps the
 *  quiet hairline: nothing here is clickable, and 1.4.11 doesn't apply. */
export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border border-line px-3 py-1",
        "font-mono text-meta uppercase text-fg-subtle",
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Selectable filter chip. A real <button> with aria-pressed, not a div.
 *
 * The unselected state is where contrast actually matters: it's the one that
 * has to read as a control at all. Its border moves to line-control (3:1) and
 * its label rides the corrected fg-subtle, so an unselected filter is no
 * longer a grey word floating on a grey hairline.
 */
export function TogglePill({
  active,
  children,
  className,
  ...props
}: { active: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-[44px] items-center rounded-pill px-5 font-mono text-meta-lg uppercase",
        "transition-colors duration-200 ease-out",
        active
          ? "bg-accent text-on-accent"
          : "border border-line-control text-fg-subtle hover:border-fg hover:text-fg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}