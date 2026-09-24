// src/components/layout/Nav.tsx
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ButtonLink } from "../primitives/Button";
import { cn } from "../../lib/cn";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/works", label: "Work", end: false },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the drawer is open, restoring whatever was there before
  // rather than blindly setting "auto" — the old build fought its own lightbox.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Keyboard users land here first */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-accent focus:px-5 focus:py-3 focus:font-mono focus:text-meta-lg focus:uppercase focus:text-on-accent"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-2.5">
        <div
          className={cn(
            "pointer-events-auto flex h-[52px] w-full max-w-shell items-center justify-between",
            // Always blurred. It was transparent until scroll, which let the
            // hero type run underneath it unreadably.
            "rounded-pill border px-3 backdrop-blur-xl sm:px-4",
            "transition-colors duration-300 ease-out",
            scrolled
              ? "border-line bg-bg/85 shadow-lg shadow-black/20"
              : "border-line/60 bg-bg/55"
          )}
        >
          <Link to="/" onClick={() => setOpen(false)} className="shrink-0">
            <Logo />
          </Link>

          {/* Desktop: the centred link capsule */}
          <nav className="hidden items-center gap-0.5 rounded-pill border border-line bg-card/60 p-0.5 sm:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-pill px-4 py-1.5 font-mono text-nav uppercase transition-colors",
                    isActive ? "bg-bg text-accent-ink" : "text-fg-subtle hover:text-fg"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink
              to="/#contact"
              variant="accent"
              size="sm"
              className="hidden h-9 min-h-0 px-4 text-nav sm:inline-flex"
            >
              Contact <span aria-hidden>↗</span>
            </ButtonLink>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex size-10 items-center justify-center rounded-pill border border-line text-fg sm:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-0 z-40 sm:hidden",
          open ? "visible" : "invisible pointer-events-none"
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-bg/70 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex flex-col gap-2 rounded-b-3xl border-b border-line",
            "bg-surface px-6 pb-8 pt-24 transition-transform duration-300 ease-out",
            open ? "translate-y-0" : "-translate-y-full"
          )}
        >
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "border-b border-line py-4 font-display text-display-xs",
                  isActive ? "text-accent-ink" : "text-fg"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/#contact"
            onClick={() => setOpen(false)}
            className="border-b border-line py-4 font-display text-display-xs text-fg"
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  );
}
