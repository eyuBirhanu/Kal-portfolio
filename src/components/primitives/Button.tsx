// src/components/primitives/Button.tsx
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { isRemoteHref } from "../../lib/links";
import { ArrowDown, ArrowUpRight } from "./Icon";

type Variant = "solid" | "outline" | "accent";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-mono text-meta-lg uppercase " +
  "transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 " +
  // 44px minimum target — the old build had 32px tap targets on mobile
  "min-h-[44px]";

const variants: Record<Variant, string> = {
  // Cream/near-black fill. The primary action.
  //
  // Built from fg/bg rather than a fixed colour, so it inverts with the
  // theme: a cream pill on the dark ground, a near-black pill on the cream
  // one. Both sit at roughly 16:1 against the page, which is why this is the
  // right variant for a header CTA and the accent fill is not.
  solid: "bg-fg text-bg hover:bg-fg/85",
  // line-control, not line-strong: a button's border is what identifies it as
  // a control, so it needs 3:1 against the page. line-strong measures 1.55:1
  // in dark and 1.59:1 in light — fine for a divider, not for an edge that
  // has to say "this is clickable".
  outline: "border border-line-control text-fg hover:border-fg hover:bg-fg/5",
  // Bright yellow in BOTH themes. The text on it is on-accent so it always
  // reads, but the FILL barely separates from the cream ground in light mode
  // — keep this for moments that genuinely want to shout, not for standing
  // furniture like the nav.
  accent: "bg-accent text-on-accent hover:bg-accent-hover",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5",
  md: "px-7 py-3.5",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

export function Button({
  variant = "outline",
  size = "md",
  className,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

/** Internal navigation. Renders a real <a> so Tab and middle-click work. */
export function ButtonLink({
  to,
  variant = "outline",
  size = "md",
  className,
  children,
}: Common & { to: string }) {
  return (
    <Link to={to} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}

/**
 * External links get the arrow and the security rel the old build omitted.
 *
 * `download` is honoured only for a same-origin href. Browsers ignore the
 * attribute cross-origin, so asking for it on a Drive or Dropbox URL used to
 * produce a link that neither downloaded nor opened in a new tab — it just
 * navigated the page away. Here that case falls back to a new tab and the ↗
 * glyph, which is what actually happens, so the label never promises
 * something the browser won't do.
 */
export function ButtonExternal({
  href,
  variant = "outline",
  size = "md",
  className,
  children,
  download,
}: Common & { href: string; download?: boolean }) {
  const canDownload = Boolean(download) && !isRemoteHref(href);

  return (
    <a
      href={href}
      target={canDownload ? undefined : "_blank"}
      rel="noopener noreferrer"
      download={canDownload || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
      {canDownload ? <ArrowDown /> : <ArrowUpRight />}
    </a>
  );
}