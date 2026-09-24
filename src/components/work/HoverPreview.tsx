// src/components/work/HoverPreview.tsx
import type { ResolvedProject } from "../../types";
import { cld } from "../../lib/media";
import { cn } from "../../lib/cn";

/**
 * The floating card that trails the cursor in list view.
 *
 * This interaction works better here than on the site it came from: there the
 * previews were screenshots of web apps, here they're the actual posters and
 * frames — the work itself, shown at the moment someone reads its name.
 *
 * pointer-events-none is essential, or the card sits under the cursor and
 * steals the hover from the row that spawned it.
 */
export function HoverPreview({
  project,
  nodeRef,
}: {
  project: ResolvedProject | null;
  nodeRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={nodeRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 hidden sm:block"
    >
      <div
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card border border-line-strong",
          "bg-card shadow-2xl transition-all duration-300 ease-out",
          project ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
        style={{ width: 300, height: 200 }}
      >
        {project && (
          <img
            src={cld(project.thumbnail.url, { width: 600, height: 400, crop: "fill" })}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
