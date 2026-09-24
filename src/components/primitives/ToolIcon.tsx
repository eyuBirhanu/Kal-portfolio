// src/components/primitives/ToolIcon.tsx
//
// Replaces the two cross-fading cdn.simpleicons.org requests per tile.
//
// Simple Icons carries no Adobe, Canva or CapCut mark — six of the seven
// slugs 404'd, hit onError, and rendered a grey letter square. That is why
// the toolbox had no icons and no colour, on any device.
//
// Icons are now local files at /public/icons/<slug>.svg, in full brand
// colour at rest. Nothing is fetched from a third party, which matches how
// the fonts are already handled.
//
// Three sizes. "sm" (32px) is the timeline clip, where the mark sits beside
// the tool's name and only has to carry colour and shape. "md" and "lg" are
// for anywhere the mark stands alone and has to be read on its own — below
// about 48px Canva's wordmark stops resolving.
//
// When a file is missing the fallback is a brand-tinted monogram in the
// site's own display face, not a grey letter on grey. It reads as a
// deliberate tile rather than a broken image, and it upgrades to the real
// mark the moment the file exists.

import { useState } from "react";
import { cn } from "../../lib/cn";

type Size = "sm" | "md" | "lg";

const BOX: Record<Size, string> = {
  sm: "size-8",
  md: "size-12",
  lg: "size-20",
};

const PX: Record<Size, number> = {
  sm: 32,
  md: 48,
  lg: 80,
};

const FALLBACK_TYPE: Record<Size, string> = {
  sm: "rounded-[0.3rem] text-[0.6875rem]",
  md: "rounded-[0.45rem] text-sm",
  lg: "rounded-[0.7rem] text-display-xs",
};

type Props = {
  /** File name under /public/icons, without the extension. */
  slug: string;
  name: string;
  /** Brand hex, e.g. "#31A8FF". Drives the fallback tile and the hover edge. */
  color: string;
  /** Two-letter monogram for the fallback. Defaults to the first two initials. */
  mono?: string;
  size?: Size;
  /**
   * Optional, and off for every tool at the moment.
   *
   * Some brand colours are drawn for a dark ground and go pale on cream.
   * Adobe's #9999FF is the clear case, but only when the mark is used as a
   * bare glyph — the full app tiles carry their own dark background, so they
   * hold on both themes and need nothing here.
   */
  dimOnLight?: boolean;
  className?: string;
};

/** "Adobe Premiere Pro" → "PP", "Figma" → "FI". */
function initials(name: string) {
  const words = name.replace(/^Adobe\s+/i, "").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0]?.slice(0, 2) ?? "??").toUpperCase();
}

export function ToolIcon({
  slug,
  name,
  color,
  mono,
  size = "md",
  dimOnLight,
  className,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center border",
          "font-display font-bold leading-none tracking-tight",
          BOX[size],
          FALLBACK_TYPE[size],
          className
        )}
        style={{
          // Tinted, not solid: a saturated block per tool would shout over a
          // palette built on one accent.
          backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`,
          borderColor: `color-mix(in srgb, ${color} 34%, transparent)`,
          color,
        }}
      >
        {mono ?? initials(name)}
      </span>
    );
  }

  return (
    <img
      src={`/icons/${slug}.svg`}
      alt=""
      aria-hidden
      width={PX[size]}
      height={PX[size]}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 object-contain",
        BOX[size],
        dimOnLight && "light:brightness-[0.72] light:saturate-150",
        className
      )}
    />
  );
}