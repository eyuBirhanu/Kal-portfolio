// src/lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The type scale lives in @theme in index.css, which means tailwind-merge has
 * never heard of it. Its fallback for an unrecognised `text-*` class is the
 * text-COLOUR group, so every custom size was being treated as a colour and
 * silently discarded whenever a real colour sat beside it:
 *
 *   twMerge("bg-fg text-bg", "text-nav")            -> "bg-fg text-nav"
 *                                                       ^ text-bg deleted
 *   twMerge("uppercase text-meta", "text-fg-subtle") -> "uppercase text-fg-subtle"
 *                                                                  ^ text-meta deleted
 *
 * Whichever came last won, so the Contact button lost its text colour and
 * inherited the body grey (2.22:1 on the cream fill), while every <Meta>
 * label lost its 11px size and rendered at body size instead.
 *
 * Declaring the scale as font-size puts each class in the right group. Real
 * conflicts still collapse — text-meta + text-meta-lg resolves to the second,
 * and a size and a colour now coexist instead of fighting.
 */
const FONT_SIZES = [
  "meta",
  "meta-lg",
  "body-sm",
  "body",
  "body-lg",
  "display-xs",
  "display-sm",
  "display-md",
  "display-lg",
  "display-xl",
  "nav",
  "wordmark",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
    },
  },
});

/** Merge class names, with later Tailwind utilities winning over earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}