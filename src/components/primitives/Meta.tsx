// src/components/primitives/Meta.tsx
import { cn } from "../../lib/cn";

/**
 * The mono label. Used for section eyebrows, dates, clients, formats, roles —
 * the connective tissue of the whole design. Exists once so it can never drift.
 */
export function Meta({
  children,
  as: Tag = "span",
  size = "sm",
  tone = "subtle",
  className,
}: {
  children: React.ReactNode;
  as?: "span" | "p" | "div" | "dt" | "dd";
  size?: "sm" | "lg";
  tone?: "subtle" | "muted" | "accent" | "fg";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-mono uppercase",
        size === "sm" ? "text-meta" : "text-meta-lg",
        {
          subtle: "text-fg-subtle",
          muted: "text-fg-muted",
          accent: "text-accent-ink",
          fg: "text-fg",
        }[tone],
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** A labelled pair, as in ROLE — Editor · Designer. */
export function MetaPair({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <Meta tone="accent">{label}</Meta>
      <Meta tone="fg">{value}</Meta>
    </div>
  );
}
