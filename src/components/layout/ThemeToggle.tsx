// src/components/layout/ThemeToggle.tsx
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="flex size-10 items-center justify-center rounded-pill border border-line text-fg-subtle transition-colors hover:border-line-strong hover:text-fg sm:size-9"
    >
      {/* Half-filled circle: one glyph for both states, no icon swap flicker */}
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
      </svg>
    </button>
  );
}
