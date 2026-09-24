// src/components/home/KeywordMarquee.tsx
import profile from "../../data/profile.json";
import { cn } from "../../lib/cn";

/**
 * Capability strip under the hero. Alternates accent italic and muted roman so
 * it reads as rhythm rather than a list.
 *
 * The second copy is aria-hidden — the old ClientMarquee duplicated its list
 * without that, so screen readers announced every logo twice.
 */
export function KeywordMarquee() {
  const items = profile.keywords;

  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((word, i) => (
        <span key={`${word}-${i}`} className="flex items-center">
          <span
            className={cn(
              "whitespace-nowrap px-8 font-display text-display-sm sm:text-display-md",
              i % 2 === 0
                ? "accent-italic"
                : "font-bold text-fg-subtle"
            )}
          >
            {word}
          </span>
          <span aria-hidden className="text-accent-ink">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="border-y border-line bg-surface py-6">
      <div className="edge-fade pause-on-hover relative flex overflow-hidden">
        <div className="flex animate-marquee">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
