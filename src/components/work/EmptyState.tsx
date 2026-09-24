// src/components/work/EmptyState.tsx
import { Button } from "../primitives/Button";
import { Meta } from "../primitives/Meta";

export function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-card border border-dashed border-line px-6 py-24 text-center">
      <Meta size="lg">No results</Meta>
      <p className="max-w-sm text-fg-muted">
        {query
          ? `Nothing matches “${query}” in this category.`
          : "There's no work in this category yet."}
      </p>
      <Button onClick={onReset}>Clear filters</Button>
    </div>
  );
}
