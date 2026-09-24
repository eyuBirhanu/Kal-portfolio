// src/components/home/ReelPlayer.tsx
import { useEffect, useRef, useState } from "react";
import { cld, cldVideoPoster } from "../../lib/media";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { Meta } from "../primitives/Meta";
import { cn } from "../../lib/cn";

type Props = {
  videoUrl: string | null;
  posterUrl: string | null;
  className?: string;
};

/**
 * The hero background. A video editor whose hero isn't video is a tell.
 *
 * Behaviour:
 *  - muted + loop + playsInline, which is the only combination browsers
 *    will autoplay. The old build appended autoplay=1 without mute and it
 *    silently never worked.
 *  - a poster frame paints first so nothing flashes black
 *  - under prefers-reduced-motion the video never loads at all — just the
 *    poster. That also saves the bandwidth on metered connections.
 *  - with no reel configured it degrades to the poster, and with neither it
 *    degrades to a plain warm ground. The hero never breaks.
 */
export function ReelPlayer({ videoUrl, posterUrl, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  const poster = posterUrl ?? (videoUrl ? cldVideoPoster(videoUrl) : null);
  const showVideo = Boolean(videoUrl) && !reduced;

  // Don't keep decoding frames while the hero is off screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showVideo]);

  const toggleSound = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted) void el.play().catch(() => {});
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {poster && (
        <img
          src={cld(poster, { width: 1920, quality: "auto" })}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {showVideo && (
        <video
          ref={ref}
          src={videoUrl!}
          poster={poster ?? undefined}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onCanPlay={() => setReady(true)}
          aria-label="Showreel, playing silently"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Legibility scrim. Without it the hero type sits on moving footage and
          contrast is whatever the current frame happens to be. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-bg/85 via-bg/70 to-bg"
      />

      {showVideo && (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-6 right-6 z-10 inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-line-strong bg-bg/70 px-5 backdrop-blur-md transition-colors hover:border-fg"
        >
          <span aria-hidden className="text-accent-ink">
            {muted ? "◁" : "◀"}
          </span>
          <Meta tone="fg">{muted ? "Sound off" : "Sound on"}</Meta>
        </button>
      )}
    </div>
  );
}
