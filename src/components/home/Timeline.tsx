// src/components/home/Timeline.tsx
import { Link } from "react-router-dom";
import profile from "../../data/profile.json";
import { projects } from "../../lib/content";
import { isRemoteHref } from "../../lib/links";
import { Meta } from "../primitives/Meta";
import { Pill } from "../primitives/Pill";
import { Reveal } from "../primitives/Reveal";
import { SectionHeader } from "../primitives/SectionHeader";
import { ArrowDown, ArrowRight, ArrowUpRight } from "../primitives/Icon";
import { cn } from "../../lib/cn";

/** How many projects sit behind each credit — drives the "see the work" link. */
function workCount(clientId: string | null) {
  if (!clientId) return 0;
  return projects.filter((p) => p.clientId === clientId).length;
}

type Entry = (typeof profile.experience)[number];

/** One grid, shared by the header row and the body, so the description always
 *  lines up under the role rather than under the year gutter. */
const GRID =
  "grid grid-cols-1 gap-6 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:gap-10";

export function Timeline() {
  const entries = profile.experience;
  const cvRemote = isRemoteHref(profile.resumeUrl);

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
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className={cn(
                "border-t border-line",
                i === 0 && "rounded-card border-transparent bg-card"
              )}
            >
              <Reveal delay={Math.min(i, 3) * 80}>
                {i === 0 ? (
                  <CurrentRole entry={entry} index={i} />
                ) : (
                  <PastRole entry={entry} index={i} />
                )}
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="border-t border-line pt-8">
          <a
            href={profile.resumeUrl}
            {...(cvRemote
              ? { target: "_blank", rel: "noopener noreferrer" }
              : { download: true })}
            className="group inline-flex items-center gap-2"
          >
            <Meta tone="accent">Full history on the CV</Meta>
            <span
              className={cn(
                "text-accent-ink transition-transform",
                cvRemote ? "group-hover:translate-x-0.5" : "group-hover:translate-y-0.5"
              )}
            >
              {cvRemote ? <ArrowUpRight /> : <ArrowDown />}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** The current role. No toggle, no hover behaviour — it is simply always open. */
function CurrentRole({ entry, index }: { entry: Entry; index: number }) {
  return (
    <div className="px-6 md:px-8">
      <div className={cn(GRID, "pt-10")}>
        <YearGutter entry={entry} current />
        <RoleHeading entry={entry} />
        <Meta className="hidden self-start tabular-nums md:block">
          / {String(index + 1).padStart(2, "0")}
        </Meta>
      </div>
      <Body entry={entry} className="pb-10" />
    </div>
  );
}

/**
 * Past roles: the body opens on hover, with no control to click.
 *
 * <details> is gone. A disclosure element that opens on hover is lying about
 * itself — it would keep announcing "collapsed" to a screen reader while the
 * content sits open on screen — so this is now a plain CSS reveal instead:
 * grid-template-rows 0fr -> 1fr, which animates and needs no state.
 *
 * TWO THINGS KEEP THIS REACHABLE, and the pattern falls apart without them:
 *
 *  1. `hoverable:` gates the collapsing behind (hover: hover) and
 *     (pointer: fine). It is opt-in, so the default — phones, tablets, and
 *     the prerendered HTML before any JS runs — is fully expanded. Hover is
 *     an enhancement for people who have a cursor, never the only way in.
 *     Without this the About section is blank on every phone, and most of
 *     this site's traffic arrives from Telegram and LinkedIn on a phone.
 *
 *  2. `group-focus-within` opens the row too. The archive link inside a
 *     closed row is still in the tab order, so a keyboard user tabbing to it
 *     expands the row rather than chasing focus into a clipped box.
 */
function PastRole({ entry, index }: { entry: Entry; index: number }) {
  return (
    <div className="group/row">
      <div className={cn(GRID, "py-10 transition-colors hoverable:group-hover/row:bg-card/40")}>
        <YearGutter entry={entry} />
        {/* The heading shifting to accent is the only affordance left now the
            chevron is gone — on a touch device there is nothing to signal
            anyway, because nothing is hidden there. */}
        <RoleHeading entry={entry} hoverAccent />
        <Meta className="hidden self-start tabular-nums md:block">
          / {String(index + 1).padStart(2, "0")}
        </Meta>
      </div>

      <div
        className={cn(
          "grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out",
          "hoverable:grid-rows-[0fr]",
          "hoverable:group-hover/row:grid-rows-[1fr]",
          "hoverable:group-focus-within/row:grid-rows-[1fr]"
        )}
      >
        {/* overflow-hidden is what makes the 0fr row actually clip, and it
            takes the padding so the spacing collapses with the content. */}
        <div className="overflow-hidden">
          <Body entry={entry} className="pb-10" />
        </div>
      </div>
    </div>
  );
}

function RoleHeading({ entry, hoverAccent = false }: { entry: Entry; hoverAccent?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <h3
        className={cn(
          "text-display-xs transition-colors",
          hoverAccent && "hoverable:group-hover/row:text-accent-ink"
        )}
      >
        {entry.role}
      </h3>
      <Meta tone="accent">— {entry.company}</Meta>
    </div>
  );
}

function YearGutter({ entry, current = false }: { entry: Entry; current?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className={cn(
          "mt-4 size-2 shrink-0 rounded-full",
          current ? "bg-accent" : "bg-line-strong"
        )}
      />
      <div className="flex flex-col gap-1">
        <span className="font-display text-display-sm font-bold text-fg">{entry.start}</span>
        <Meta>{entry.dateLabel}</Meta>
      </div>
    </div>
  );
}

/** Description, tags and the cross-link into the archive. Re-uses GRID with an
 *  empty first cell so it sits under the role, not under the year. */
function Body({ entry, className }: { entry: Entry; className?: string }) {
  const count = workCount(entry.clientId);

  return (
    <div className={cn(GRID, "md:gap-y-0", className)}>
      <span aria-hidden className="hidden md:block" />
      <div className="flex flex-col gap-3">
        <p className="max-w-prose text-body-sm text-fg-muted">{entry.description}</p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {entry.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}

          {count > 0 && (
            <Link
              to={`/works?q=${encodeURIComponent(entry.company)}`}
              className="group/link ml-1 inline-flex items-center gap-1.5 font-mono text-meta uppercase text-accent-ink underline-offset-4 hover:underline"
            >
              See the {count} {count === 1 ? "project" : "projects"}
              <ArrowRight className="size-3 transition-transform duration-300 group-hover/link:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
      <span aria-hidden className="hidden md:block" />
    </div>
  );
}