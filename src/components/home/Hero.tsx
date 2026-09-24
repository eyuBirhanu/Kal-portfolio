// src/components/home/Hero.tsx
import profile from "../../data/profile.json";
import { ReelPlayer } from "./ReelPlayer";
import { Meta } from "../primitives/Meta";
import { ButtonLink, ButtonExternal } from "../primitives/Button";
import { HoverPreview } from "../primitives/HoverPreview";
import { useHoverPreview } from "../../hooks/useHoverPreview";
import { cld } from "../../lib/media";

/**
 * Name split across two lines: given name in cream roman, surname in the
 * accent italic. That contrast is the whole identity of the page — strip it
 * out and this is an ordinary hero.
 *
 * Hovering the name brings up the portrait on the cursor, the same
 * interaction the archive list uses for project thumbnails. It reads well
 * here for the same reason it does there: the image appears at the moment
 * someone is reading the thing it belongs to.
 *
 * It is decorative and additive — mouse only, aria-hidden, and absent
 * entirely when `portraitUrl` is null — so the hero is unchanged for anyone
 * on a phone, a keyboard or a screen reader.
 */
export function Hero() {
  const [given, ...rest] = profile.name.split(" ");
  const family = rest.join(" ");

  const portrait = profile.portraitUrl as string | null;
  const preview = useHoverPreview<string>();

  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden pt-24 pb-16">
      <ReelPlayer
        videoUrl={profile.reel.videoUrl}
        posterUrl={profile.reel.posterUrl}
      />

      <div className="relative z-10 mx-auto w-full max-w-shell px-6">
        {/* Availability, as a statement rather than a blinking badge */}
        <div className="mb-8 inline-flex items-center gap-3 rounded-pill border border-line bg-bg/50 px-4 py-2 backdrop-blur-sm">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          <Meta tone="muted">{profile.headline}</Meta>
        </div>

        <h1 className="text-display-xl">
          {/* inline-flex so the hover target is the width of the letters,
              not the width of the page — a block <h1> would fire the
              preview from anywhere on the line. */}
          <span
            className="inline-flex flex-col"
            onMouseEnter={() => portrait && preview.show(portrait)}
            onMouseLeave={preview.hide}
          >
            <span className="block text-fg">{given}</span>
            <span className="accent-italic -mt-[0.08em] block">{family}</span>
          </span>
        </h1>

        <hr className="my-10 border-line" />

        <dl className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="flex items-baseline gap-3">
            <Meta as="dt" tone="accent">
              Role
            </Meta>
            <Meta as="dd" tone="fg">
              {profile.role}
            </Meta>
          </div>
          <div className="flex items-baseline gap-3">
            <Meta as="dt" tone="accent">
              Based in
            </Meta>
            <Meta as="dd" tone="fg">
              {profile.basedIn}
            </Meta>
          </div>
        </dl>

        <div className="mt-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-prose text-body-lg text-fg-muted">
            <strong className="font-medium text-fg">
              I cut video and design brand systems
            </strong>{" "}
            for teams that need their work to be recognised, not just seen.
            Seven years of tools, and one question every time: what is this
            supposed to make someone feel?
          </p>

          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/works" variant="solid">
              See the work <span aria-hidden>↗</span>
            </ButtonLink>
            <ButtonExternal href={profile.resumeUrl} download>
              Download CV
            </ButtonExternal>
          </div>
        </div>
      </div>

      {/* Portrait-shaped rather than the landscape card the list view uses. */}
      <HoverPreview
        src={preview.active ? cld(preview.active, { width: 480, height: 600, crop: "fill" }) : null}
        nodeRef={preview.nodeRef}
        width={240}
        height={300}
      />
    </section>
  );
}