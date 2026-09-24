// src/components/work/ProjectList.tsx
import { Link } from "react-router-dom";
import type { ResolvedProject } from "../../types";
import { Meta } from "../primitives/Meta";
import { Pill } from "../primitives/Pill";
import { HoverPreview } from "../primitives/HoverPreview";
import { useHoverPreview } from "../../hooks/useHoverPreview";
import { cld } from "../../lib/media";

export function ProjectList({
  projects,
  onOpen,
}: {
  projects: ResolvedProject[];
  onOpen?: (p: ResolvedProject) => void;
}) {
  // The hook is generic now; this view tracks the whole project because it
  // builds the thumbnail URL off it.
  const { active, nodeRef, show, hide } = useHoverPreview<ResolvedProject>();

  return (
    <>
      <ul className="border-t border-line" onMouseLeave={hide}>
        {projects.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i + 1}
            onEnter={() => show(project)}
            onOpen={onOpen}
          />
        ))}
      </ul>
      <HoverPreview
        src={active ? cld(active.thumbnail.url, { width: 600, height: 400, crop: "fill" }) : null}
        nodeRef={nodeRef}
      />
    </>
  );
}

function ProjectRow({
  project,
  index,
  onEnter,
  onOpen,
}: {
  project: ResolvedProject;
  index: number;
  onEnter: () => void;
  onOpen?: (p: ResolvedProject) => void;
}) {
  return (
    <li className="border-b border-line">
      <Link
        to={`/works/${project.slug}`}
        onClick={(e) => {
          if (!onOpen || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          onOpen(project);
        }}
        onMouseEnter={onEnter}
        // Focus fires the preview too, so keyboard users get the same signal
        onFocus={onEnter}
        className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-6 gap-y-3 px-2 py-7 transition-colors duration-300 hover:bg-card md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_auto] md:px-6"
      >
        <Meta className="tabular-nums">
          {String(index).padStart(2, "0")} /
        </Meta>

        <div className="min-w-0">
          <h3 className="truncate text-display-sm transition-colors group-hover:text-accent-ink">
            {project.title}
          </h3>
          <Meta className="mt-2 block md:hidden">
            {[project.client?.name, project.year].filter(Boolean).join(" · ")}
          </Meta>
        </div>

        <p className="col-span-3 hidden max-w-md text-body-sm text-fg-muted md:col-span-1 md:block">
          {project.summary}
        </p>

        <div className="col-span-3 flex items-center justify-between gap-4 md:col-span-1 md:justify-end">
          <div className="hidden flex-wrap gap-2 lg:flex">
            {project.client && <Pill>{project.client.name}</Pill>}
            {project.tags.slice(0, 1).map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>

          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-pill border border-line text-fg-subtle transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </div>
      </Link>
    </li>
  );
}