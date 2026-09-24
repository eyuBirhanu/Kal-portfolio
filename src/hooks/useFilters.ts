// src/hooks/useFilters.ts
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FILTERS, type Filter } from "../types";

export type ViewMode = "grid" | "list";

const isFilter = (v: string | null): v is Filter =>
  !!v && (FILTERS as readonly string[]).includes(v);

/**
 * Filter state lives in the URL, not in useState.
 *
 * The old build kept it in component state, which meant a filtered view
 * couldn't be shared, the back button skipped past every filter change, and
 * reloading the page threw the selection away. ?type=video&view=list&q=poster
 * fixes all three for free.
 *
 * Grid is the default — unlike the site this is modelled on, the work here is
 * visual, and hiding it behind a text row would be the wrong trade.
 */
export function useFilters() {
  const [params, setParams] = useSearchParams();

  const type: Filter = isFilter(params.get("type")) ? (params.get("type") as Filter) : "all";
  const view: ViewMode = params.get("view") === "list" ? "list" : "grid";
  const query = params.get("q") ?? "";

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params);
      for (const [k, v] of Object.entries(patch)) {
        // Defaults are omitted so the canonical URL stays clean
        if (!v || v === "all" || (k === "view" && v === "grid")) next.delete(k);
        else next.set(k, v);
      }
      // replace, so typing in the search box doesn't fill the history stack
      setParams(next, { replace: true, preventScrollReset: true });
    },
    [params, setParams]
  );

  const isFiltered = type !== "all" || query.trim() !== "";

  return useMemo(
    () => ({
      type,
      view,
      query,
      isFiltered,
      setType: (t: Filter) => update({ type: t }),
      setView: (v: ViewMode) => update({ view: v }),
      setQuery: (q: string) => update({ q }),
      reset: () => update({ type: null, q: null }),
    }),
    [type, view, query, isFiltered, update]
  );
}
