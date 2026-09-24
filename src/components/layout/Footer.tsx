// src/components/layout/Footer.tsx
import profile from "../../data/profile.json";
import { Meta } from "../primitives/Meta";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-shell flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <Meta>
          © {year} · {profile.name}
        </Meta>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {profile.socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-meta uppercase text-fg-subtle transition-colors hover:text-accent-ink"
            >
              {s.name}
            </a>
          ))}
          <a
            href="#top"
            className="font-mono text-meta uppercase text-fg-subtle transition-colors hover:text-accent-ink"
          >
            Back to top ↑
          </a>
        </nav>

        <Meta>Designed &amp; built in Addis Ababa</Meta>
      </div>
    </footer>
  );
}
