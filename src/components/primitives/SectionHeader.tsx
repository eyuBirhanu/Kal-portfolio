// src/components/primitives/SectionHeader.tsx
import { Meta } from "./Meta";
import { cn } from "../../lib/cn";

/**
 * "— 02 · SELECTED WORK" above a display heading with one italic accent word.
 *
 * `emphasis` is rendered in Satoshi's true italic, which is why the display
 * face had to change: a browser-faked oblique looks wrong at this size.
 */
export function SectionHeader({
  index,
  label,
  before,
  emphasis,
  after,
  align = "left",
  children,
  className,
}: {
  index: string;
  label: string;
  before?: string;
  emphasis?: string;
  after?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-line-strong" />
        <Meta>
          {index} · {label}
        </Meta>
      </div>

      <h2 className="max-w-3xl text-display-lg">
        {before}
        {emphasis && (
          <>
            {before ? " " : ""}
            <em className="accent-italic not-italic [font-style:italic]">{emphasis}</em>
          </>
        )}
        {after}
      </h2>

      {children && <div className="max-w-prose text-fg-muted">{children}</div>}
    </header>
  );
}
