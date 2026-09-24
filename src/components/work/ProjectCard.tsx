// src/components/work/ProjectCard.tsx
import { Link } from "react-router-dom";
import type { ResolvedProject } from "../../types";
import { Image } from "../primitives/Image";
import { Meta } from "../primitives/Meta";

/**
 * ONE tile shape for every card, whatever the file behind it.
 *
 * Per-type ratios looked reasonable in isolation and fell apart in a mixed
 * grid: a 16:9 video tile next to a 3:4 poster is roughly half its height,
 * and because a CSS grid row is as tall as its tallest cell, the video left
 * a block of dead space beneath it and the captions stopped lining up.
 *
 * Square is the best compromise for this archive. Against a 3:4 tile it
 * gives a 16:9 still 56% of the height instead of 42%, and a square poster
 * fills it completely. Nothing is cropped — the image is still contained and
 * the blurred backdrop in <Image> fills whatever is left over.
 */
/**
 * Tile shape. 4:5 — upright, not square.
 *
 * Most of the archive is posters and social tiles, which are portrait or
 * square, so an upright tile wastes less of itself on them than a square
 * did. A 16:9 video still fills 45% of its height rather than 56%, which is
 * the trade; the blurred backdrop carries the rest.
 */
const TILE: [number, number] = [4, 5];

/**
 * THE ONE KNOB. "cover" fills the tile, "contain" shows the whole file.
 *
 * Set to "contain": nothing is ever cropped. Whatever shape a poster is, all
 * of it is on the card, centred, with the blurred backdrop filling the rest
 * of the tile — so the leftover space reads as scenery drawn from the
 * artwork's own colours rather than as an empty bar.
 *
 * In a grid whose rows align, these are the only two options and they trade
 * directly against each other:
 *
 *   cover   — every tile full-bleed, no bars, nothing ragged. The edges of a
 *             poster can be cropped. Mitigated below.
 *   contain — nothing is ever cropped. Anything whose shape differs from the
 *             tile sits inside bars, and the artwork renders smaller than
 *             the space it occupies.
 *
 * "cover" remains a one-word switch if you change your mind. It crops via
 * Cloudinary's g_auto, which picks the region with the content in it rather
 * than the geometric centre, so it loses far less than the old CSS crop did.
 */
const FIT: "cover" | "contain" = "contain";

/**
 * A real <Link>, not a <div onClick>. The old card was a div, so it was
 * invisible to keyboards and to screen readers — the whole gallery was
 * unreachable without a mouse.
 *
 * The tile shape and the fit are the two constants above — they are the
 * whole of the grid's visual behaviour, and they are meant to be edited.
 */
export function ProjectCard({
  project,
  onOpen,
}: {
  project: ResolvedProject;
  /** When supplied, a plain click opens the lightbox instead of navigating. */
  onOpen?: (p: ResolvedProject) => void;
}) {
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
          width={project.thumbnail.width}
          height={project.thumbnail.height}
          ratio={TILE}
          fit={FIT}
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