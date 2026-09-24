// src/lib/seo.tsx
import { Head } from "vite-react-ssg";
import profile from "../data/profile.json";
import { cld, isCloudinary } from "./media";

/**
 * ────────────────────────────────────────────────────────────────────────────
 *  SET THIS. Nothing below works without it.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Every og:image, og:url and canonical is built by prefixing this string.
 * While it read "https://REPLACE-WITH-YOUR-DOMAIN" the site advertised a
 * hostname that does not resolve, so scrapers had nothing to fetch and fell
 * back to a bare link.
 *
 * Either edit the fallback below, or set VITE_SITE_URL in your host's
 * environment. Vite inlines it at build time, which is when the prerenderer
 * writes these tags into the static HTML.
 */
const FALLBACK_SITE_URL = "https://kalkidanbirhanu.com";

/** Trailing slashes stripped, or every path becomes example.com//works. */
const BASE = (import.meta.env.VITE_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/+$/, "");

/** 1200x630 is the one size that renders on every platform that unfurls links. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * An OG derivative of a Cloudinary asset.
 *
 * Forced to JPEG rather than f_auto. Scrapers send generic Accept headers, so
 * f_auto's negotiation is a guess on their behalf — and reports on WebP
 * support in LinkedIn's scraper flatly contradict each other, which is reason
 * enough not to bet a link preview on it. q_80 keeps the file well under
 * WhatsApp's ~300KB budget, past which it drops the preview silently.
 */
export function ogImage(src: string) {
  return cld(src, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    crop: "fill",
    format: "jpg",
    quality: 80,
  });
}

/**
 * The default share card, resolved from the HERO — never from a project.
 *
 * A project thumbnail makes the whole site look like one poster, and which
 * poster depends on whatever happens to sort first in projects.json. The card
 * that represents the site should be the hero, the way someone arriving at
 * the top of the page sees it.
 *
 * Order of preference, first non-null wins:
 *   1. profile.ogImage      — a designed 1200x630 card, or a hero screenshot
 *   2. profile.reel.posterUrl — the hero's own poster frame, once a reel exists
 *   3. profile.portraitUrl  — the portrait, cropped to the card with g_auto
 *
 * All three are null in the data today, so there is nothing to show yet and
 * the image tags are omitted rather than pointed at a 404. Fill any one of
 * them in and every page picks it up.
 */
const heroOgSource: string | null =
  (profile.ogImage as string | null) ??
  (profile.reel.posterUrl as string | null) ??
  (profile.portraitUrl as string | null) ??
  null;

const defaultOg = heroOgSource ? ogImage(heroOgSource) : null;

if (import.meta.env.DEV && !defaultOg) {
  console.warn(
    "[seo] No share image. Add a 1200x630 card at public/og/default.png and " +
      'set "ogImage": "/og/default.png" in src/data/profile.json.'
  );
}

export const SITE = {
  url: BASE,
  name: "Kalkidan Birhanu",
  title: "Kalkidan Birhanu — Video Editor & Graphic Designer",
  description:
    "Video editor, graphic designer and social strategist based in Addis Ababa. Selected work in brand identity, motion and campaign design.",
  ogImage: defaultOg,
} as const;

/** Anything Cloudinary serves is JPEG here; a local file goes by extension. */
function imageMimeType(src: string) {
  if (isCloudinary(src)) return "image/jpeg";
  return /\.png$/i.test(src) ? "image/png" : "image/jpeg";
}

/**
 * Rendered inside a page component. vite-react-ssg collects it during
 * prerendering and bakes the tags into that route's static HTML — which is the
 * whole point, since LinkedIn, Telegram and WhatsApp don't run JavaScript and
 * never see client-set meta tags.
 */
export function Seo({
  title,
  description = SITE.description,
  image = SITE.ogImage,
  imageAlt,
  path = "/",
  type = "website",
  jsonLd,
}: {
  title?: string;
  description?: string;
  image?: string | null;
  imageAlt?: string;
  path?: string;
  type?: "website" | "article";
  jsonLd?: string;
}) {
  const fullTitle = title ? `${title} — ${SITE.name}` : SITE.title;
  const url = `${SITE.url}${path}`;
  // Must be absolute and https — a relative og:image is simply ignored.
  // Null means no source is configured yet; emitting a broken URL is worse
  // than emitting nothing, so the image tags drop out entirely.
  const img = image ? (image.startsWith("http") ? image : `${SITE.url}${image}`) : null;
  const alt = imageAlt ?? fullTitle;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />

      {/* One og:image only — several makes the choice unpredictable, and
          WhatsApp just takes whichever it meets first.

          Written as separate conditionals rather than one fragment: Head
          collects its children, and a fragment in the middle of that list is
          not worth risking for the sake of three fewer lines. */}
      {img ? <meta property="og:image" content={img} /> : null}
      {img ? <meta property="og:image:secure_url" content={img} /> : null}
      {/* Without the dimensions the scraper has to fetch and measure the file
          before it can lay the card out, so the first person to share a link
          often gets a preview with an empty image well. */}
      {img ? <meta property="og:image:width" content={String(OG_WIDTH)} /> : null}
      {img ? <meta property="og:image:height" content={String(OG_HEIGHT)} /> : null}
      {img ? <meta property="og:image:type" content={imageMimeType(img)} /> : null}
      {img ? <meta property="og:image:alt" content={alt} /> : null}

      {/* X needs its own card tag; without it many clients show no image even
          when og:image is set. It drops to the small "summary" card when
          there is no image, because summary_large_image with nothing to show
          renders as an empty slab. twitter:image otherwise mirrors og:image
          rather than maintaining two sets of creative. */}
      <meta name="twitter:card" content={img ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {img ? <meta name="twitter:image" content={img} /> : null}
      {img ? <meta name="twitter:image:alt" content={alt} /> : null}

      {jsonLd && <script type="application/ld+json">{jsonLd}</script>}
    </Head>
  );
}

/** CreativeWork schema for a project page. */
export function creativeWorkJsonLd(p: {
  title: string;
  summary: string;
  date: string;
  slug: string;
  thumbnail: { url: string };
  client: { name: string } | null;
}) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.summary,
    dateCreated: p.date,
    url: `${SITE.url}/works/${p.slug}`,
    image: p.thumbnail.url,
    creator: { "@type": "Person", name: SITE.name, url: SITE.url },
    ...(p.client ? { sourceOrganization: { "@type": "Organization", name: p.client.name } } : {}),
  });
}

/** Person schema for the home page — helps Google build a knowledge panel. */
export function personJsonLd(profile: {
  name: string;
  headline: string;
  email: string;
  socialLinks: { url: string }[];
}) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.headline,
    email: profile.email,
    url: SITE.url,
    address: { "@type": "PostalAddress", addressLocality: "Addis Ababa", addressCountry: "ET" },
    sameAs: profile.socialLinks.map((s) => s.url),
  });
}