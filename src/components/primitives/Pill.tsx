// src/components/primitives/Pill.tsx
import { cn } from "../../lib/cn";

/** Static tag chip — tools, categories, tags. */
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

/** Selectable filter chip. A real <button> with aria-pressed, not a div. */
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
          : "border border-line text-fg-subtle hover:border-line-strong hover:text-fg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
