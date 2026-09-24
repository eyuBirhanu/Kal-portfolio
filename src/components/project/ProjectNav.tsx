// src/components/project/ProjectNav.tsx
import { Link } from "react-router-dom";
import type { ResolvedProject } from "../../types";
import { Meta } from "../primitives/Meta";
import { cn } from "../../lib/cn";

export function ProjectNav({
  prev,
  next,
}: {
  prev: ResolvedProject | null;
  next: ResolvedProject | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Project navigation" className="grid gap-px border-t border-line sm:grid-cols-2">
      <Side project={prev} direction="prev" />
      <Side project={next} direction="next" />
    </nav>
  );
}

function Side({
  project,
  direction,
}: {
  project: ResolvedProject | null;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";
  if (!project) return <span className="hidden sm:block" />;

  return (
    <Link
      to={`/works/${project.slug}`}
      className={cn(
        "group flex flex-col gap-2 py-8 transition-colors hover:bg-card",
        isNext ? "sm:items-end sm:pl-8 sm:text-right" : "sm:pr-8"
      )}
    >
      <Meta>{isNext ? "Next project →" : "← Previous project"}</Meta>
      <span className="text-display-xs text-fg transition-colors group-hover:text-accent-ink">
        {project.title}
      </span>
      <Meta tone="subtle">
        {[project.client?.name, project.year].filter(Boolean).join(" · ")}
      </Meta>
    </Link>
  );
}
