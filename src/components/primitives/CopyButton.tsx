// src/components/primitives/CopyButton.tsx
import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

/**
 * Exists because `mailto:` silently does nothing for anyone using webmail with
 * no default handler — they click, nothing happens, and they leave. Showing the
 * address and letting them copy it is the fix.
 */
export function CopyButton({ value, label = "address", className }: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Older Safari and any non-secure context. Select it instead so the
      // person can hit Cmd+C themselves rather than getting nothing.
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } catch {
        /* give up quietly — the address is visible on screen regardless */
      }
      el.remove();
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className={cn(
        "inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-pill border px-4",
        "font-mono text-meta uppercase transition-colors",
        copied
          ? "border-accent text-accent-ink"
          : "border-line text-fg-subtle hover:border-line-strong hover:text-fg",
        className
      )}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="m5 13 4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          Copy
        </>
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
