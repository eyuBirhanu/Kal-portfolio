// src/pages/WorksPage.tsx
import { useMemo } from "react";
import { projects } from "../lib/content";
import { filterProjects } from "../lib/content";
import { useFilters } from "../hooks/useFilters";
import { FilterBar } from "../components/work/FilterBar";
import { ProjectGrid } from "../components/work/ProjectGrid";
import { ProjectList } from "../components/work/ProjectList";
import { EmptyState } from "../components/work/EmptyState";
import { ProjectModal } from "../components/work/ProjectModal";
import { useProjectModal } from "../hooks/useProjectModal";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Seo } from "../lib/seo";

export default function WorksPage() {
  const { type, view, query, isFiltered, setType, setView, setQuery, reset } =
    useFilters();

  const results = useMemo(
    () => filterProjects(projects, type, query),
    [type, query]
  );

  // Prev/next walk the *filtered* list, so paging matches what's on screen.
  const modal = useProjectModal(results);

  return (
    <div className="px-6 pb-section-lg pt-32">
      <Seo
        title="Work"
        description="Selected video editing, brand design and social campaign work by Kalkidan Birhanu."
        path="/works"
      />
      <div className="mx-auto flex max-w-shell flex-col gap-10">
        <SectionHeader
          index="01"
          label="Archive"
          before="Everything I've"
          emphasis="made"
          after="."
        >
          Video, brand identity and campaign design — {projects.length} projects
          across {new Set(projects.map((p) => p.clientId)).size} clients.
        </SectionHeader>

        <FilterBar
          sticky
          type={type}
          view={view}
          query={query}
          count={results.length}
          onType={setType}
          onView={setView}
          onQuery={setQuery}
        />

        {results.length === 0 ? (
          <EmptyState query={query} onReset={reset} />
        ) : view === "list" ? (
          <ProjectList projects={results} onOpen={modal.open} />
        ) : (
          <ProjectGrid projects={results} onOpen={modal.open} />
        )}

        {isFiltered && results.length > 0 && (
          <button
            type="button"
            onClick={reset}
            className="self-center font-mono text-meta uppercase text-fg-subtle underline-offset-4 hover:text-accent-ink hover:underline"
          >
            Clear filters
          </button>
        )}
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
    </div>
  );
}
