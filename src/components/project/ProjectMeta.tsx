// src/components/project/ProjectMeta.tsx
//
// The credits. Still the clapperboard slate in spirit, but laid out across
// the page rather than pinned down one side.
//
// Client and year moved up into the title block, so this component now only
// carries what is genuinely extra: role, tools, and the per-type fields. If
// none of those are filled in — which is currently true for every project —
// it renders nothing rather than a strip of one row. A visitor should never
// be able to tell which fields are still empty.

import type { ResolvedProject } from "../../types";
import { Meta } from "../primitives/Meta";

export function ProjectMeta({ project }: { project: ResolvedProject }) {
  const rows: { label: string; value: React.ReactNode }[] = [];

  if (project.role.length) rows.push({ label: "Role", value: project.role.join(", ") });
  if (project.tools.length) rows.push({ label: "Tools", value: project.tools.join(", ") });

  if (project.type === "video") {
    rows.push({ label: "Format", value: project.media.format });
  } else if (project.type === "social") {
    rows.push({ label: "Platform", value: project.media.platform });
    if (project.media.stats) rows.push({ label: "Results", value: project.media.stats });
  }

  if (rows.length === 0) return null;

  return (
    <dl className="mx-auto flex w-full max-w-3xl flex-col gap-6 border-y border-line py-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-14 sm:gap-y-6">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-col items-center gap-1.5 text-center">
          <Meta as="dt">{r.label}</Meta>
          <dd className="max-w-xs text-body-sm text-fg">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}