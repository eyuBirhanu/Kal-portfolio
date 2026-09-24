// src/components/primitives/Button.tsx
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

type Variant = "solid" | "outline" | "accent";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-mono text-meta-lg uppercase " +
  "transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 " +
  // 44px minimum target — the old build had 32px tap targets on mobile
  "min-h-[44px]";

const variants: Record<Variant, string> = {
  // Cream/near-black fill. The primary action.
  solid: "bg-fg text-bg hover:bg-fg/85",
  outline: "border border-line-strong text-fg hover:border-fg hover:bg-fg/5",
  // Bright yellow in BOTH themes — safe because the text on it is on-accent.
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

/** External links get the arrow and the security rel the old build omitted. */
export function ButtonExternal({
  href,
  variant = "outline",
  size = "md",
  className,
  children,
  download,
}: Common & { href: string; download?: boolean }) {
  return (
    <a
      href={href}
      target={download ? undefined : "_blank"}
      rel="noopener noreferrer"
      download={download}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
      <span aria-hidden>{download ? "↓" : "↗"}</span>
    </a>
  );
}
