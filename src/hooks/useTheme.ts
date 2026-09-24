// src/hooks/useTheme.ts
import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const KEY = "theme";

function current(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

/**
 * Reads whatever the inline script in index.html already applied, so the hook
 * never fights it and there is no flash. Writes go to both the DOM and storage.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(current);

  // Re-sync if the attribute is changed elsewhere (another tab, devtools).
  useEffect(() => {
    const observer = new MutationObserver(() => setThemeState(current()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable — the theme still applies for this session */
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme]
  );

  return { theme, setTheme, toggle };
}
