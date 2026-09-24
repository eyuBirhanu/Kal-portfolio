// src/components/home/Timeline.tsx
import { Link } from "react-router-dom";
import profile from "../../data/profile.json";
import { projects } from "../../lib/content";
import { Meta } from "../primitives/Meta";
import { Pill } from "../primitives/Pill";
import { Reveal } from "../primitives/Reveal";
import { SectionHeader } from "../primitives/SectionHeader";
import { cn } from "../../lib/cn";

/** How many projects sit behind each credit — drives the "see the work" link. */
function workCount(clientId: string | null) {
  if (!clientId) return 0;
  return projects.filter((p) => p.clientId === clientId).length;
}

export function Timeline() {
  const entries = profile.experience;

  return (
    <section id="about" className="scroll-mt-24 px-6 py-section-lg">
      <div className="mx-auto flex max-w-shell flex-col gap-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="03"
            label="About"
            before="Short story of"
            emphasis="where I've been."
          />
          <p className="max-w-md text-fg-muted lg:pb-3">{profile.aboutIntro}</p>
        </div>

        <ol className="flex flex-col">
          {entries.map((entry, i) => {
            const count = workCount(entry.clientId);
            const isFirst = i === 0;

            return (
              <Reveal key={entry.id} delay={Math.min(i, 3) * 80}>
                <li
                  className={cn(
                    "grid grid-cols-1 gap-6 border-t border-line py-10 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:gap-10",
                    // Only the current role gets a lifted surface. Everything
                    // else stays flat, so the eye knows where "now" is.
                    isFirst && "rounded-card border-transparent bg-card px-6 md:px-8"
                  )}
                >
                  {/* Year gutter */}
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        "mt-4 size-2 shrink-0 rounded-full",
                        isFirst ? "bg-accent" : "bg-line-strong"
                      )}
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-display text-display-sm font-bold text-fg">
                        {entry.start}
                      </span>
                      <Meta>{entry.dateLabel}</Meta>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-display-xs">{entry.role}</h3>
                    <Meta tone="accent">— {entry.company}</Meta>
                    <p className="max-w-prose text-body-sm text-fg-muted">
                      {entry.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {entry.tags.map((t) => (
                        <Pill key={t}>{t}</Pill>
                      ))}

                      {/*
                        The thing the site this is modelled on can't do: a
                        credit that opens the work behind it. Turns a résumé
                        into an index of the portfolio.
                      */}
                      {count > 0 && (
                        <Link
                          to={`/works?q=${encodeURIComponent(entry.company)}`}
                          className="ml-1 font-mono text-meta uppercase text-accent-ink underline-offset-4 hover:underline"
                        >
                          See the {count} {count === 1 ? "project" : "projects"} →
                        </Link>
                      )}
                    </div>
                  </div>

                  <Meta className="hidden self-start tabular-nums md:block">
                    / {String(i + 1).padStart(2, "0")}
                  </Meta>
                </li>
              </Reveal>
            );
          })}
        </ol>

        <div className="border-t border-line pt-8">
          <a
            href={profile.resumeUrl}
            download
            className="group inline-flex items-center gap-2"
          >
            <Meta tone="accent">Full history on the CV</Meta>
            <span aria-hidden className="text-accent-ink transition-transform group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
