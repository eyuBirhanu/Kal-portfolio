// src/components/layout/Logo.tsx

/**
 * The wordmark is TEXT, not SVG.
 *
 * The old mark was 1.4kb of path data spelling out a full wordmark with two
 * orbital arcs behind it — illegible at 32px in a nav bar. This inherits the
 * theme colour automatically, scales perfectly, and weighs nothing.
 * The only place an actual drawn mark is needed is the favicon, where the
 * browser can't render our font.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="inline-flex items-center gap-2 font-display text-wordmark font-bold text-fg">
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        KB
      </span>
      <span className="sr-only">Kalkidan Birhanu — home</span>
    </span>
  );
}
