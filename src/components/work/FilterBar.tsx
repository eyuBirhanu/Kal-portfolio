// src/components/work/FilterBar.tsx
import { FILTERS, FILTER_LABELS, type Filter } from "../../types";
import { TogglePill } from "../primitives/Pill";
import { Meta } from "../primitives/Meta";
import { cn } from "../../lib/cn";
import type { ViewMode } from "../../hooks/useFilters";

export function FilterBar({
  type,
  view,
  query,
  count,
  onType,
  onView,
  onQuery,
  sticky = false,
}: {
  type: Filter;
  view: ViewMode;
  query: string;
  count: number;
  onType: (t: Filter) => void;
  onView: (v: ViewMode) => void;
  onQuery: (q: string) => void;
  sticky?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between",
        // top-24, not top-0 — the old build's filter bar slid under the fixed
        // header because it was pinned to the viewport edge
        sticky && "sticky top-20 z-30 -mx-6 border-y border-line bg-bg/85 px-6 backdrop-blur-xl"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          role="group"
          aria-label="Filter by type"
          className="scrollbar-hide flex gap-2 overflow-x-auto"
        >
          {FILTERS.map((f) => (
            <TogglePill key={f} active={type === f} onClick={() => onType(f)}>
              {FILTER_LABELS[f]}
            </TogglePill>
          ))}
        </div>

        <div
          role="group"
          aria-label="Layout"
          className="hidden shrink-0 items-center gap-1 rounded-pill border border-line p-1 sm:flex"
        >
          <ViewButton
            active={view === "grid"}
            onClick={() => onView("grid")}
            label="Grid view"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </ViewButton>
          <ViewButton
            active={view === "list"}
            onClick={() => onView("list")}
            label="List view"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </ViewButton>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Meta className="hidden shrink-0 sm:block">
          {count} {count === 1 ? "project" : "projects"}
        </Meta>

        <div className="relative w-full lg:w-72">
          <label htmlFor="work-search" className="sr-only">
            Search projects
          </label>
          <svg
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            id="work-search"
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search by title, client or tag"
            className="h-11 w-full rounded-pill border border-line bg-card pl-11 pr-4 font-mono text-meta-lg text-fg placeholder:text-fg-subtle focus:border-line-strong"
          />
        </div>
      </div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-9 items-center justify-center rounded-pill transition-colors",
        active ? "bg-fg text-bg" : "text-fg-subtle hover:text-fg"
      )}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
