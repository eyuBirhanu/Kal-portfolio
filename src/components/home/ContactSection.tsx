// src/components/home/ContactSection.tsx
import profile from "../../data/profile.json";
import { Meta } from "../primitives/Meta";
import { CopyButton } from "../primitives/CopyButton";
import { ButtonExternal } from "../primitives/Button";
import { SectionHeader } from "../primitives/SectionHeader";

type Channel = {
  id: string;
  name: string;
  handle: string | null;
  url: string | null;
  purpose: string;
  primary: boolean;
};

/**
 * No form. A freelance creative's inbound comes through Telegram, WhatsApp and
 * email — a form is the least likely path that audience takes, and every field
 * is friction on the one action this whole page exists to produce.
 *
 * Structure: email as one full-width row (it's the address people copy), then
 * ONE uniform grid for everything else. An earlier version split primary and
 * secondary channels into two grids, which left Telegram sitting alone in a
 * two-column row whenever WhatsApp had no number set.
 *
 * Channels with a null url are dropped, so WhatsApp appears the moment a
 * number is added and stays hidden until then.
 */
export function ContactSection() {
  const channels = (profile.channels as Channel[]).filter(
    (c) => c.url && c.id !== "email"
  );
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Project enquiry")}`;

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

        {/* The address, shown rather than hidden behind a mailto that may not
            resolve on webmail. Mono at body size — display size overflowed on
            phones. `break-all` keeps a long address inside the card. */}
        <div className="flex w-full flex-col gap-4 rounded-card border border-line-strong bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <span className="flex min-w-0 flex-col gap-1.5">
            <Meta tone="accent">Email</Meta>
            <a
              href={mailto}
              className="break-all font-mono text-body-sm text-fg transition-colors hover:text-accent-ink sm:text-body"
            >
              {profile.email}
            </a>
          </span>
          <CopyButton value={profile.email} label="email address" className="self-start sm:self-auto" />
        </div>

        {/* One grid, uniform cards, no orphan row */}
        <ul className="grid w-full gap-3 sm:grid-cols-2">
          {channels.map((c) => (
            <li key={c.id}>
              <a
                href={c.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-center justify-between gap-4 rounded-card border border-line px-5 py-4 transition-colors hover:border-line-strong hover:bg-card"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-body font-bold text-fg">{c.name}</span>
                    {c.handle && <Meta>{c.handle}</Meta>}
                  </span>
                  <span className="text-body-sm text-fg-muted">{c.purpose}</span>
                </span>
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-pill border border-line text-fg-subtle transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <ButtonExternal href={profile.resumeUrl} download>
          Download CV
        </ButtonExternal>
      </div>
    </section>
  );
}
