// src/components/work/ProjectModal.tsx
import { useCallback, useEffect, useRef } from "react";
import type { ResolvedProject } from "../../types";
import { cld, youTubeEmbed } from "../../lib/media";
import { Meta } from "../primitives/Meta";

/**
 * Opens over the grid instead of navigating to a page.
 *
 * It's driven by a `?p=<slug>` search param rather than component state, so:
 *  - the back button closes it (including Android's system back)
 *  - the open view is a real, shareable URL
 *  - reloading keeps it open
 *
 * /works/<slug> still exists as a prerendered page — it's what link previews
 * and search engines read, and what a Cmd-click on a card opens — but it is
 * deliberately not surfaced from here. Everything a visitor needs is in this
 * view.
 *
 * LAYOUT: the work gets the screen, the chrome gets what's left.
 * Two slim bars only — a control row and a one-line caption, roughly 7rem
 * together. Images size themselves off the flex row (`max-h-full` +
 * object-contain) so there is no magic height constant to keep in sync; the
 * iframe can't do that, so its width is capped by the height available,
 * which keeps 16:9 exact instead of letting max-height squash it.
 */

/** Chrome above and below the media. Keep in step with the two bars below. */
const CHROME = "7rem";

export function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  project: ResolvedProject;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowLeft" && hasPrev) return onPrev();
      if (e.key === "ArrowRight" && hasNext) return onNext();
      if (e.key !== "Tab") return;

      // Focus trap. The old lightbox had none, so Tab wandered into the page
      // behind the overlay.
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    restoreTo.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreTo.current?.focus?.();
    };
  }, [onKey]);

  const meta = [project.client?.name, project.year, project.type].filter(Boolean).join(" · ");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[60] flex animate-fade flex-col bg-bg/95 backdrop-blur-xl"
    >
      {/* Backdrop click closes. A real button so it isn't a click handler on a div. */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div ref={panelRef} className="relative flex h-full flex-col">
        {/* Control row. Slimmer buttons and padding than before — this bar
            carries no content, so it should cost as little height as it can
            while keeping the 36px targets reachable. */}
        <div className="flex shrink-0 items-center justify-between gap-3 px-3 py-2 sm:px-5">
          <Meta tone="accent" className="min-w-0 truncate">
            {meta}
          </Meta>
          <div className="flex shrink-0 items-center gap-1.5">
            <NavBtn onClick={onPrev} disabled={!hasPrev} label="Previous project">
              <path d="M15 5 8 12l7 7" />
            </NavBtn>
            <NavBtn onClick={onNext} disabled={!hasNext} label="Next project">
              <path d="m9 5 7 7-7 7" />
            </NavBtn>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-9 items-center justify-center rounded-pill border border-line bg-card text-fg transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Media — takes every pixel the two bars don't. */}
        <div className="flex min-h-0 flex-1 items-center justify-center px-3 sm:px-6">
          {project.type === "video" ? (
            <div
              className="aspect-video w-full overflow-hidden rounded-card border border-line bg-card"
              // Cap the width by the height that's actually free, so the box
              // shrinks to fit a short viewport without distorting.
              style={{ maxWidth: `min(64rem, calc((100svh - ${CHROME}) * 16 / 9))` }}
            >
              <iframe
                src={youTubeEmbed(project.media.embedUrl)}
                title={project.title}
                allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <img
              src={cld(
                project.type === "graphic" ? project.media.fullUrl : project.thumbnail.url,
                { width: 1400 }
              )}
              alt={project.title}
              // Sized off the flex row rather than the `fit-screen` constant,
              // so it always fills the space the chrome leaves.
              className="max-h-full min-h-0 w-auto max-w-full rounded-card object-contain"
            />
          )}
        </div>

        {/* Caption — one line. Title and summary share a row, and the tags
            moved out entirely: they're on the project page, and three pills
            were costing a whole band of height the work could use. */}
        <div className="shrink-0 border-t border-line bg-bg/80 px-3 py-2.5 sm:px-6">
          <div className="mx-auto flex max-w-5xl items-baseline gap-3">
            <h2 className="min-w-0 max-w-[60%] truncate font-display text-body font-bold text-fg sm:text-body-lg">
              {project.title}
            </h2>
            {project.summary && (
              <p className="hidden min-w-0 flex-1 truncate text-body-sm text-fg-subtle sm:block">
                {project.summary}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-pill border border-line text-fg-subtle transition-colors hover:border-line-strong hover:text-fg disabled:opacity-30"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {children}
      </svg>
    </button>
  );
}