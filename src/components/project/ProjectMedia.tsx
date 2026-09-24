// src/components/project/ProjectMedia.tsx
import type { ResolvedProject } from "../../types";
import { cld, cldSrcSet } from "../../lib/media";
import { youTubeEmbed, VIDEO_ASPECT } from "../../lib/media";

/** The hero media. One component, three shapes, chosen by project type. */
export function ProjectMedia({ project }: { project: ResolvedProject }) {
  if (project.type === "video") {
    return (
      <div
        className={`overflow-hidden rounded-card border border-line bg-card ${VIDEO_ASPECT[project.media.format]}`}
      >
        <iframe
          src={youTubeEmbed(project.media.embedUrl)}
          title={`${project.title} — video`}
          // The old embed omitted most of these, and appended autoplay without
          // mute, which browsers refuse outright.
          allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    );
  }

  const src = project.type === "graphic" ? project.media.fullUrl : project.thumbnail.url;

  // Capped so a tall poster is visible in one screen rather than forcing a
  // scroll just to see the whole thing.
  return (
    <div className="flex justify-center">
      <img
        src={cld(src, { width: 1600 })}
        srcSet={cldSrcSet(src, [800, 1200, 1600])}
        sizes="(min-width: 1280px) 72rem, 100vw"
        alt={project.title}
        width={project.thumbnail.width ?? undefined}
        height={project.thumbnail.height ?? undefined}
        fetchPriority="high"
        decoding="async"
        className="fit-screen rounded-card border border-line bg-card"
      />
    </div>
  );
}
