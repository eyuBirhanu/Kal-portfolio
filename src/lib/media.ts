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
  /**
   * Delivery format. Defaults to `auto`, which negotiates WebP/AVIF off the
   * browser's Accept header — right for everything a real browser renders.
   *
   * Social scrapers are the exception. They send generic Accept headers and
   * their format support is inconsistent and badly documented, so an OG image
   * behind f_auto is a coin flip. Pass "jpg" for anything a crawler reads.
   */
  format?: "auto" | "jpg" | "png";
};

/**
 * Insert a transform chain into a Cloudinary URL.
 * Non-Cloudinary URLs (placeholders, third-party logos) pass through untouched.
 */
export function cld(url: string, opts: TransformOpts = {}): string {
  const match = url.match(CLOUDINARY);
  if (!match) return url;

  const [, base, rest] = match;
  const { width, height, crop = "limit", quality = "auto", format = "auto" } = opts;

  const parts = [`f_${format}`, `q_${quality}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (width || height) parts.push(`c_${crop}`);
  if (crop === "fill") parts.push("g_auto"); // content-aware cropping

  // Strip any transform chain already present so calls don't stack.
  const cleaned = rest.replace(/^[a-z]{1,3}_[^/]*\//, "");
  return `${base}/${parts.join(",")}/${cleaned}`;
}

/**
 * A responsive srcset at sensible breakpoints.
 *
 * Pass a ratio and every entry is cropped server-side to that shape with
 * g_auto, so the browser receives an image already the right size rather than
 * a larger one it has to crop with object-fit. Fewer bytes, and the crop is
 * chosen by content rather than by the geometric centre.
 */
export function cldSrcSet(
  url: string,
  widths = [400, 600, 900, 1200],
  ratio?: [number, number]
): string {
  if (!CLOUDINARY.test(url)) return "";
  return widths
    .map((w) => {
      const opts: TransformOpts = ratio
        ? { width: w, height: Math.round((w * ratio[1]) / ratio[0]), crop: "fill" }
        : { width: w };
      return `${cld(url, opts)} ${w}w`;
    })
    .join(", ");
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

/** True when a URL will actually be rewritten by `cld`. */
export const isCloudinary = (url: string) => CLOUDINARY.test(url);

// ── YouTube ──────────────────────────────────────────────────────────────────

/**
 * Build a clean embed URL from ANY YouTube link shape.
 *
 * The id is extracted and the /embed/ URL rebuilt, so projects.json can hold
 * whatever you copied out of the address bar — a /watch?v= link, a /shorts/
 * link, a youtu.be link — and the iframe still works. Pasting a /shorts/ URL
 * straight into an iframe does not embed at all, and that is exactly the URL
 * YouTube hands you when you share a Short.
 *
 * The old build appended `autoplay=1` without `mute=1`, which browsers block,
 * so autoplay silently failed.
 */
export function youTubeEmbed(
  embedUrl: string,
  opts: { autoplay?: boolean } = {}
): string {
  const id = youTubeId(embedUrl);
  const u = new URL(id ? `https://www.youtube.com/embed/${id}` : embedUrl);
  u.searchParams.set("rel", "0");
  u.searchParams.set("modestbranding", "1");
  u.searchParams.set("playsinline", "1");
  if (opts.autoplay) {
    u.searchParams.set("autoplay", "1");
    u.searchParams.set("mute", "1"); // required, or autoplay is refused
  }
  return u.toString();
}

/**
 * The 11-character video id out of any YouTube URL shape we might store —
 * /embed/, /watch?v= or youtu.be. Returns null for anything else.
 */
const YOUTUBE_ID =
  /(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export function youTubeId(url: string): string | null {
  return url.match(YOUTUBE_ID)?.[1] ?? null;
}

/**
 * YouTube already renders a still for every video, so there is no reason to
 * upload one by hand.
 *
 * `maxresdefault` is the only variant that is both high resolution and a true
 * 16:9 frame — hqdefault and sddefault are 4:3 with the video letterboxed
 * inside, which would sit in a 16:9 card surrounded by black bars. The
 * trade-off is that it only exists when the source was uploaded in HD; if one
 * of yours 404s, set `thumbnail` explicitly on that project and it wins.
 */
export function youTubeThumbnail(
  embedUrl: string,
  quality: "max" | "hq" | "mq" = "max"
): string | null {
  const id = youTubeId(embedUrl);
  if (!id) return null;
  const file = { max: "maxresdefault", hq: "hqdefault", mq: "mqdefault" }[quality];
  return `https://img.youtube.com/vi/${id}/${file}.jpg`;
}

/** Intrinsic size of a maxresdefault still — lets the grid reserve the box. */
export const YOUTUBE_THUMB_SIZE = { width: 1280, height: 720 } as const;

/** Aspect-ratio class for a video project's format. */
export const VIDEO_ASPECT: Record<string, string> = {
  widescreen: "aspect-video",
  portrait: "aspect-[9/16]",
  square: "aspect-square",
};

/** The same ratios as numbers, for sizing a box against available height in
 *  a style attribute — a Short in a 16:9 frame is mostly empty screen. */
export const VIDEO_RATIO: Record<string, number> = {
  widescreen: 16 / 9,
  portrait: 9 / 16,
  square: 1,
};