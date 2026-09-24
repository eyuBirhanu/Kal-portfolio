// src/components/project/RelatedWork.tsx
import type { ResolvedProject } from "../../types";
import { ProjectCard } from "../work/ProjectCard";
import { Meta } from "../primitives/Meta";

export function RelatedWork({
  projects,
  clientName,
}: {
  projects: ResolvedProject[];
  clientName?: string;
}) {
  if (projects.length === 0) return null;

  return (
    <section className="flex flex-col gap-8 border-t border-line pt-14">
      <Meta size="lg">{clientName ? `More for ${clientName}` : "Related work"}</Meta>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
