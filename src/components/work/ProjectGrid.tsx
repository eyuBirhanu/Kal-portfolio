// src/components/work/ProjectGrid.tsx
import type { ResolvedProject } from "../../types";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "../primitives/Reveal";

/**
 * A real CSS grid, not the old column-masonry. Each card keeps its own aspect
 * ratio so the page still reads as varied, but rows align and — crucially —
 * nothing reflows as images arrive.
 *
 * Two columns from the smallest screen up, four on wide ones. One card per
 * row on a phone meant a single poster filled the viewport and the archive
 * took fourteen swipes to get through; at two-up you can see the work
 * against itself, which is what a grid is for.
 */
export function ProjectGrid({
  projects,
  onOpen,
}: {
  projects: ResolvedProject[];
  onOpen?: (p: ResolvedProject) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
      {projects.map((p, i) => (
        // Stagger caps out after the first row; beyond that it reads as lag
        <Reveal key={p.id} delay={Math.min(i, 3) * 70}>
          <ProjectCard project={p} onOpen={onOpen} />
        </Reveal>
      ))}
    </div>
  );
}