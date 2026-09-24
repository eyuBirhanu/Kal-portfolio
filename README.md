# Kalkidan Birhanu — Portfolio

Static React site. No backend. All content lives in three JSON files.

---

## Setup

```bash
npm install
npm run dev
```

### Fonts — one manual step

Satoshi is self-hosted rather than loaded from a CDN, so it has to be downloaded once.

1. Go to <https://www.fontshare.com/fonts/satoshi> and download the family
2. Copy these two files into `public/fonts/`:
   - `Satoshi-Variable.woff2`
   - `Satoshi-VariableItalic.woff2`

The italic file is **not optional** — the accent word in every section heading uses a true italic. Without it the browser fakes a slant, which looks wrong at display sizes.

DM Sans and Space Mono load from Google Fonts and need no setup.

### Before deploying

Replace `REPLACE-WITH-YOUR-DOMAIN` in three places:

- `src/lib/seo.ts`
- `public/robots.txt`
- `scripts/generate-sitemap.mjs`

---

## Adding a project

Run `npm run dev` and open `/upload`. That route exists **only in development** — it is stripped from production builds, so the Cloudinary credentials never reach a visitor.

1. Drop the image or video in
2. Fill in title, client, tags
3. Copy the generated entry into `src/data/projects.json`

Editing `projects.json` by hand also works. Every field is validated on startup: if something is wrong, the dev server names the exact field instead of white-screening.

### Fields that matter

| Field | Why |
|---|---|
| `featured` | `true` gives the project the large case-study layout on the home page. Keep this to 3–4. |
| `order` | Lower sorts first. Controls display order everywhere. |
| `clientId` | Must match an `id` in `clients.json`. This is what links a timeline entry to the work. |
| `role` | What you actually did. Renders as the credits line. |
| `tools` | Software used. Renders as the metadata slate. |
| `thumbnail.width/height` | Reserves space so the grid doesn't jump. The upload tool fills these. |

---

## Architecture

```
src/
├── index.css     The entire theme (Tailwind v4 @theme) — all tokens live here
├── data/         The only files edited by hand
├── types/        Zod schemas — the JSON is validated, not cast
├── lib/          content.ts (loaders) · media.ts (Cloudinary) · seo.ts
├── hooks/        theme · reveal · media queries
├── components/
│   ├── primitives/   Design system. Dumb, reusable.
│   ├── layout/       Nav, footer, shell
│   ├── home/ work/ project/ forms/
└── pages/
```

### Four rules

1. **Nothing imports the JSON directly.** Everything goes through `lib/content.ts`, which validates.
2. **No raw hex outside `index.css`.** If a colour isn't a token, it doesn't exist.
3. **`primitives/` are dumb.** Everything else composes them.
4. **Folders map to where things appear.**

---

## Theming — Tailwind v4

There is **no `tailwind.config.js`**. The theme lives in `src/index.css` inside `@theme`,
which emits both Tailwind utilities and real CSS custom properties. The light theme is
an override block on `[data-theme="light"]` in the same file.

The accent has **two** tokens, and this matters:

- `accent` — bright yellow `#FFC800`. Safe as text on dark. **Fills only on light**, because it is ~1.5:1 on cream and unreadable.
- `accent-ink` — always safe as text. Bright yellow in dark, deep amber `#8A5A00` (~5.4:1) in light.

Use `text-accent-ink` for text and `bg-accent` for fills. Never `text-accent`.

An inline script in `index.html` applies the saved theme **before first paint**. Don't remove it — React runs too late, and without it every load flashes.

---

## Build

```bash
npm run build
```

Prerenders every route to static HTML via `vite-react-ssg`, then writes `sitemap.xml`.

Prerendering isn't optional here. LinkedIn, Telegram, WhatsApp and X don't run JavaScript, so a plain SPA previews as a blank rectangle no matter what meta tags it sets. Prerendering is what gives each project a real title, description and share image. It also means `/works/some-project` is an actual file, so no host rewrite rules are needed.

Output is `dist/`. Deploy anywhere static.

---

## Commands

| | |
|---|---|
| `npm run dev` | Dev server. `/upload` exists here only. |
| `npm run audit` | Content health check — placeholder titles, missing credits, unfilled case studies. **Run this before sharing the site.** |
| `npm run backfill` | One-off: fills the null thumbnail dimensions from Cloudinary. |
| `npm run build` | Typecheck, prerender every route, write the sitemap. |
| `npm run typecheck` | Types only. |

---

## Before you deploy

1. `npm run backfill` — fills the image dimensions, kills the grid layout shift
2. `npm run audit` — fix everything under the ⚠ heading
3. Replace `REPLACE-WITH-YOUR-DOMAIN` in `src/lib/seo.ts`, `public/robots.txt`, `scripts/generate-sitemap.mjs`
4. Download the two Satoshi `.woff2` files into `public/fonts/`
5. Pick a favicon — rename `favicon.svg` or `favicon-play.svg`
6. `npm run build`, then deploy `dist/` anywhere static

`vercel.json` and `netlify.toml` are both included. Every route is prerendered
to a real file, so no SPA fallback rewrite is needed on either host.

---

## Accessibility

Checked and in place: skip link, visible focus rings on every interactive
element, real `<button>` and `<a>` throughout (no clickable divs), `aria-pressed`
on toggles, labels on every input, `aria-hidden` on duplicated marquee rows,
44px minimum tap targets, `prefers-reduced-motion` honoured including marquees,
and a contrast floor of 4.5:1 for body text in both themes.

The one rule to remember when adding components: **`text-accent-ink` for text,
`bg-accent` for fills. Never `text-accent`.** Bright yellow is 1.5:1 on the
light theme's cream and unreadable there.

---

## Security

The upload tool is mounted only when `import.meta.env.DEV` is true. That's a
compile-time constant, so in a production build the route array is empty and the
module — along with the Cloudinary values it reads — is dropped entirely.

The previous build's `VITE_PIN` gate was removed rather than replaced. Vite
inlines every `VITE_*` variable into the client bundle at build time, so that
PIN was readable in devtools in about ten seconds. The fix is not shipping the
tool, not guarding it.

Lock the Cloudinary preset down anyway: restrict it to one folder, cap the file
size, and allow only image and video formats.
