// src/components/work/WorkSection.tsx
import { Link } from "react-router-dom";
import { projects } from "../../lib/content";
import { ProjectGrid } from "./ProjectGrid";
import { SectionHeader } from "../primitives/SectionHeader";
import { Meta } from "../primitives/Meta";
import { ProjectModal } from "./ProjectModal";
import { useProjectModal } from "../../hooks/useProjectModal";

/**
 * The home-page slice: the six most recent, no filters. Filtering belongs on
 * the archive page — putting controls here invites people to fiddle instead of
 * scrolling on to the rest of the story.
 *
 * The old build showed `slice(0, 3)` of the raw array, which was whichever
 * three happened to be first in the file rather than the three worth showing.
 */
export function WorkSection() {
  const featured = projects.slice(0, 6);
  const modal = useProjectModal(featured);

  return (
    <section id="work" className="scroll-mt-24 px-6 py-section-lg">
      <div className="mx-auto flex max-w-shell flex-col gap-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            index="02"
            label="Selected work"
            before="Things I've"
            emphasis="made"
            after=" & shipped."
          />
          <Link
            to="/works"
            className="group hidden shrink-0 items-center gap-2 pb-2 md:inline-flex"
          >
            <Meta tone="accent">View all {projects.length}</Meta>
            <span aria-hidden className="text-accent-ink transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <ProjectGrid projects={featured} onOpen={modal.open} />

        <Link
          to="/works"
          className="inline-flex items-center justify-center gap-2 border-t border-line pt-8 md:hidden"
        >
          <Meta tone="accent">View all {projects.length} projects →</Meta>
        </Link>
      </div>

      {modal.project && (
        <ProjectModal
          project={modal.project}
          onClose={modal.close}
          onPrev={modal.prev}
          onNext={modal.next}
          hasPrev={modal.hasPrev}
          hasNext={modal.hasNext}
        />
      )}
    </section>
  );
}
