// src/components/primitives/Icon.tsx
import { cn } from "../../lib/cn";

/**
 * Inline SVG, not typographic arrows.
 *
 * The site was using ↗ ↓ → as glyphs. They are real Unicode characters
 * rather than emoji, but several platforms — iOS and some Android builds in
 * particular — have no arrow in the text font and silently substitute an
 * emoji one, so the same link renders as a thin outlined arrow on a laptop
 * and a fat blue-and-white tile on a phone. They also inherit font metrics,
 * so they sit on the baseline at a size and weight nobody chose.
 *
 * These are stroked paths on a 24-box: they take colour from currentColor,
 * scale with the class you pass, and look identical everywhere.
 *
 * Every icon is aria-hidden. They sit beside a real text label in all cases,
 * so announcing them would only duplicate it.
 */

type IconProps = { className?: string };

const BASE = "shrink-0";

function Stroke({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn(BASE, "size-3.5", className)}
    >
      {children}
    </svg>
  );
}

/** Leaves the site / opens a new tab. */
export function ArrowUpRight({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </Stroke>
  );
}

/** Downloads a file. */
export function ArrowDown({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 5v14" />
      <path d="m5 12 7 7 7-7" />
    </Stroke>
  );
}

/** Continues within the site. */
export function ArrowRight({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Stroke>
  );
}

/** A document — the CV. */
export function DocumentIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </Stroke>
  );
}

/**
 * LinkedIn's mark, drawn locally rather than fetched.
 *
 * Same reasoning as ToolIcon: the previous build pulled brand marks from a
 * third-party CDN and most of them 404'd. A filled path, so it takes
 * currentColor as a solid shape instead of a hairline outline.
 */
export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={cn(BASE, "size-4", className)}
    >
      <path d="M6.94 5.5a2.44 2.44 0 1 1-4.88 0 2.44 2.44 0 0 1 4.88 0ZM2.4 21.5h4.2V8.9H2.4v12.6Zm7.02-12.6h4.02v1.72h.06c.56-1.02 1.93-2.1 3.97-2.1 4.24 0 5.03 2.66 5.03 6.12v6.86h-4.2v-6.08c0-1.45-.03-3.32-2.08-3.32-2.08 0-2.4 1.58-2.4 3.21v6.19h-4.2V8.9Z" />
    </svg>
  );
}