// src/components/project/CaseStudy.tsx
import type { CaseStudy as CaseStudyType } from "../../types";
import { Meta } from "../primitives/Meta";

/**
 * Featured work only. Three beats — what was needed, what you did, what
 * happened — because that's the shape a client reads a portfolio in.
 * Outcome is optional: a made-up number is worse than no number.
 */
export function CaseStudy({ data }: { data: CaseStudyType }) {
  const sections = [
    { label: "The brief", body: data.brief },
    { label: "The approach", body: data.approach },
    ...(data.outcome ? [{ label: "The outcome", body: data.outcome }] : []),
  ];

  return (
    <div className="flex flex-col gap-10">
      {sections.map((s) => (
        <section key={s.label} className="flex flex-col gap-3">
          <Meta tone="accent">{s.label}</Meta>
          <p className="max-w-prose text-body-lg text-fg-muted">{s.body}</p>
        </section>
      ))}
    </div>
  );
}
