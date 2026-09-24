/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Absolute origin of the deployed site, e.g. "https://kalkidanbirhanu.com".
   * Read at BUILD time by src/lib/seo.tsx — Vite inlines it, and the
   * prerenderer writes the resulting og:url / og:image into the static HTML.
   * Optional: falls back to FALLBACK_SITE_URL in seo.tsx.
   */
  readonly VITE_SITE_URL?: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}