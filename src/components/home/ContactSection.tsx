// src/components/home/ContactSection.tsx
import profile from "../../data/profile.json";
import { Meta } from "../primitives/Meta";
import { SectionHeader } from "../primitives/SectionHeader";
import { isRemoteHref } from "../../lib/links";

type Channel = {
  id: string;
  name: string;
  handle: string | null;
  url: string | null;
  purpose: string;
  primary: boolean;
};

/**
 * One action, not seven.
 *
 * This used to render a copy button, an email card and a grid of channel
 * cards for Telegram, LinkedIn and YouTube — every one of which is already a
 * link in the footer, further down the same page. Repeating them didn't give
 * anyone a second way to get in touch; it spread one decision across five
 * controls and made the closing section of the site look like a settings
 * screen.
 *
 * What's left: the address, big enough to read and to be the thing you click,
 * and two quiet links under it. Telegram and YouTube still live in the
 * footer, which is where a secondary channel belongs.
 *
 * The address stays as plain selectable text inside the mailto, deliberately.
 * That was the copy button's whole justification — mailto: does nothing for
 * someone on webmail with no handler registered, and if the address is only
 * ever an href they leave with nothing. Showing the characters means they can
 * select them by hand. It just doesn't need its own control to do that.
 */
export function ContactSection() {
  const channels = profile.channels as Channel[];
  const linkedin = channels.find((c) => c.id === "linkedin" && c.url);
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Project enquiry")}`;
  const cvRemote = isRemoteHref(profile.resumeUrl);
  const cvLabel = cvRemote ? "View CV" : "Download CV";

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line px-6 py-section-lg">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10">
        <SectionHeader
          index="05"
          label="Contact"
          before="Let's make something"
          emphasis="worth watching."
          align="center"
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <Meta size="lg" tone="muted">
            {profile.available}
          </Meta>
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            <Meta>{profile.responseTime}</Meta>
          </span>
        </div>

        {/* The point of the section. Mono, large, and the only thing here
            carrying any visual weight. `break-all` keeps a long address
            inside the column on a narrow phone. */}
        <a href={mailto} className="group flex flex-col items-center gap-2 text-center">
          <span className="break-all font-mono text-body-lg text-fg underline decoration-line-strong decoration-1 underline-offset-[6px] transition-colors group-hover:text-accent-ink group-hover:decoration-accent sm:text-display-xs">
            {profile.email}
          </span>
          <Meta tone="subtle">Write to me</Meta>
        </a>

        {/* Secondary, and styled to stay that way. */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {linkedin && (
            <a
              href={linkedin.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2"
            >
              <Meta tone="muted" className="transition-colors group-hover:text-accent-ink">
                LinkedIn
              </Meta>
              <span
                aria-hidden
                className="text-fg-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-accent-ink"
              >
                ↗
              </span>
            </a>
          )}

          <a
            href={profile.resumeUrl}
            {...(cvRemote
              ? { target: "_blank", rel: "noopener noreferrer" }
              : { download: true })}
            className="group inline-flex items-center gap-2"
          >
            <Meta tone="muted" className="transition-colors group-hover:text-accent-ink">
              {cvLabel}
            </Meta>
            <span
              aria-hidden
              className="text-fg-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-accent-ink"
            >
              {cvRemote ? "↗" : "↓"}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}