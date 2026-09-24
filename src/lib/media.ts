// src/lib/media.ts
//
// Every image in the old build was served at full resolution, including 600px
// grid thumbnails. These helpers rewrite Cloudinary delivery URLs to request
// the size and format actually needed. Expect an 80–90% weight reduction with
// no visible difference. Costs nothing and requires no backend.

const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload)\/(.*)$/;

type TransformOpts = {
  /** Target width in CSS pixels. */
  width?: number;
  /** Target height — only set when cropping to a fixed box. */
  height?: number;
  /** 'fill' crops to the box, 'limit' scales down without cropping. */
  crop?: "fill" | "limit";
  /** Override automatic quality, e.g. 80. */
  quality?: number | "auto";
};

/**
 * Insert a transform chain into a Cloudinary URL.
 * Non-Cloudinary URLs (placeholders, third-party logos) pass through untouched.
 */
export function cld(url: string, opts: TransformOpts = {}): string {
  const match = url.match(CLOUDINARY);
  if (!match) return url;

  const [, base, rest] = match;
  const { width, height, crop = "limit", quality = "auto" } = opts;

  const parts = ["f_auto", `q_${quality}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (width || height) parts.push(`c_${crop}`);
  if (crop === "fill") parts.push("g_auto"); // content-aware cropping

  // Strip any transform chain already present so calls don't stack.
  const cleaned = rest.replace(/^[a-z]{1,3}_[^/]*\//, "");
  return `${base}/${parts.join(",")}/${cleaned}`;
}

/** A responsive srcset at sensible breakpoints. */
export function cldSrcSet(url: string, widths = [400, 600, 900, 1200]): string {
  if (!CLOUDINARY.test(url)) return "";
  return widths.map((w) => `${cld(url, { width: w })} ${w}w`).join(", ");
}

/** A tiny blurred placeholder to show while the real image decodes. */
export function cldBlurUrl(url: string): string {
  const match = url.match(CLOUDINARY);
  if (!match) return "";
  const [, base, rest] = match;
  const cleaned = rest.replace(/^[a-z]{1,3}_[^/]*\//, "");
  return `${base}/f_auto,q_30,w_24,e_blur:400/${cleaned}`;
}

/** Poster frame for a Cloudinary-hosted showreel. */
export function cldVideoPoster(videoUrl: string, width = 1600): string {
  const match = videoUrl.match(CLOUDINARY);
  if (!match) return "";
  const [, base, rest] = match;
  const cleaned = rest.replace(/^[a-z]{1,3}_[^/]*\//, "").replace(/\.(mp4|webm|mov)$/i, ".jpg");
  return `${base}/f_auto,q_auto,w_${width}/${cleaned}`;
}

// ── YouTube ──────────────────────────────────────────────────────────────────

/**
 * Build a clean embed URL. The old build appended `autoplay=1` without `mute=1`,
 * which browsers block, so autoplay silently failed.
 */
export function youTubeEmbed(
  embedUrl: string,
  opts: { autoplay?: boolean } = {}
): string {
  const u = new URL(embedUrl);
  u.searchParams.set("rel", "0");
  u.searchParams.set("modestbranding", "1");
  u.searchParams.set("playsinline", "1");
  if (opts.autoplay) {
    u.searchParams.set("autoplay", "1");
    u.searchParams.set("mute", "1"); // required, or autoplay is refused
  }
  return u.toString();
}

/** Aspect-ratio class for a video project's format. */
export const VIDEO_ASPECT: Record<string, string> = {
  widescreen: "aspect-video",
  portrait: "aspect-[9/16]",
  square: "aspect-square",
};
