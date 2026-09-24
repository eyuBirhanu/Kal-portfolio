// src/lib/seo.tsx
import { Head } from "vite-react-ssg";
import { projects } from "./content";
import { cld } from "./media";

/** Falls back to the newest featured project, cropped to 1200x630. Replace with
 *  a designed asset at /og/default.png when there is one. */
const defaultOg = (() => {
  const hero = projects.find((p) => p.featured) ?? projects[0];
  return hero
    ? cld(hero.thumbnail.url, { width: 1200, height: 630, crop: "fill" })
    : "/og/default.png";
})();

export const SITE = {
  url: "https://REPLACE-WITH-YOUR-DOMAIN",
  name: "Kalkidan Birhanu",
  title: "Kalkidan Birhanu — Video Editor & Graphic Designer",
  description:
    "Video editor, graphic designer and social strategist based in Addis Ababa. Selected work in brand identity, motion and campaign design.",
  ogImage: defaultOg,
} as const;

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
  path = "/",
  type = "website",
  jsonLd,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article";
  jsonLd?: string;
}) {
  const fullTitle = title ? `${title} — ${SITE.name}` : SITE.title;
  const url = `${SITE.url}${path}`;
  const img = image.startsWith("http") ? image : `${SITE.url}${image}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
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
