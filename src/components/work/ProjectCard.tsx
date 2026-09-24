// src/components/work/ProjectCard.tsx
import { Link } from "react-router-dom";
import type { ResolvedProject } from "../../types";
import { Image } from "../primitives/Image";
import { Meta } from "../primitives/Meta";

/**
 * Tile ratio used until real dimensions are backfilled into projects.json.
 * 3:4 rather than 4:5 — a shorter tile fits more work on a screen, and the
 * grid reads as an index instead of a stack of posters.
 */
const FALLBACK_ASPECT: Record<ResolvedProject["type"], [number, number]> = {
  video: [16, 9],
  graphic: [3, 4],
  social: [1, 1],
};

/**
 * A real <Link>, not a <div onClick>. The old card was a div, so it was
 * invisible to keyboards and to screen readers — the whole gallery was
 * unreachable without a mouse.
 *
 * The frame contains rather than crops. Every graphic in the archive is a
 * poster or a social tile in its own ratio, and cropping them all to one
 * shape cut the artwork — the type at the top or the logo at the bottom.
 * Containing costs a little breathing room at the edges, which the blurred
 * backdrop in <Image> fills.
 */
export function ProjectCard({
  project,
  onOpen,
}: {
  project: ResolvedProject;
  /** When supplied, a plain click opens the lightbox instead of navigating. */
  onOpen?: (p: ResolvedProject) => void;
}) {
  const [fw, fh] = FALLBACK_ASPECT[project.type];
  const width = project.thumbnail.width ?? fw;
  const height = project.thumbnail.height ?? fh;

  return (
    <Link
      to={`/works/${project.slug}`}
      onClick={(e) => {
        // Let modifier-clicks and middle-clicks open the real page in a tab.
        if (!onOpen || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onOpen(project);
      }}
      className="group block focus-visible:ring-offset-4"
    >
      <div className="relative overflow-hidden rounded-card border border-line transition-colors duration-300 group-hover:border-line-strong">
        <Image
          src={project.thumbnail.url}
          alt={project.title}
          width={width}
          height={height}
          fit="contain"
          crop="limit"
          targetWidth={600}
          // Tiles are roughly a quarter of the shell on large screens and
          // half on phones, so ask for far less pixel data than before.
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 48vw"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-bg/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span className="flex size-11 items-center justify-center rounded-pill bg-accent text-on-accent">
            {project.type === "video" ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            )}
          </span>
        </div>
      </div>

      {/* Caption scaled to the smaller tile — display-xs was set for a card
          half again as wide and wrapped to three lines at this size. */}
      <div className="mt-3 flex flex-col gap-1">
        <Meta className="truncate">
          {[project.client?.name, project.year, project.type].filter(Boolean).join(" · ")}
        </Meta>
        <h3 className="truncate font-display text-body font-bold leading-snug text-fg transition-colors group-hover:text-accent-ink sm:text-body-lg">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}