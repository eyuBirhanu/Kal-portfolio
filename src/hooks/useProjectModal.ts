// src/hooks/useProjectModal.ts
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ResolvedProject } from "../types";

/**
 * The open project lives in `?p=<slug>`, not in component state.
 *
 * That gives us three things for free: the back button (and Android's system
 * back) closes the modal, the open view is a shareable URL, and a reload keeps
 * it open. Prev/next use `replace` so paging through ten projects doesn't
 * leave ten entries in the history stack to walk back through.
 */
export function useProjectModal(list: ResolvedProject[]) {
  const [params, setParams] = useSearchParams();
  const slug = params.get("p");

  const index = useMemo(
    () => (slug ? list.findIndex((p) => p.slug === slug) : -1),
    [slug, list]
  );
  const project = index >= 0 ? list[index] : null;

  const goTo = useCallback(
    (next: string | null, replace: boolean) => {
      const q = new URLSearchParams(params);
      if (next) q.set("p", next);
      else q.delete("p");
      setParams(q, { replace, preventScrollReset: true });
    },
    [params, setParams]
  );

  return {
    project,
    open: (p: ResolvedProject) => goTo(p.slug, false),
    close: () => goTo(null, false),
    prev: () => index > 0 && goTo(list[index - 1].slug, true),
    next: () => index < list.length - 1 && goTo(list[index + 1].slug, true),
    hasPrev: index > 0,
    hasNext: index >= 0 && index < list.length - 1,
  };
}
