# SETUP GUIDE

Everything needed to run, edit and deploy the portfolio. Read this first; `README.md` is the day-to-day reference once you're running.

---

## 1. What you need

- **Node.js 20.19+ or 22+** — check with `node -v`. Download at [nodejs.org](https://nodejs.org)
- A code editor (VS Code is fine)
- A terminal

That's it. No database, no server, no backend.

---

## 2. First run

```bash
cd kalkidan-portfolio
npm install
npm run dev
```

Open **http://localhost:5173**.

Fonts are already included — nothing to download. If the site loads and looks right, you're done with setup.

---

## 3. Environment variables

There is **one** optional `.env`, and it's only used by the upload tool in development.

```bash
cp .env.example .env
```

Then fill in:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

**Where to find these:** Cloudinary dashboard → Settings → Upload → Upload presets. Create an unsigned preset if you don't have one. The cloud name is at the top of the dashboard.

### Important: these are not secrets, and that's by design

Vite inlines every `VITE_*` variable into the JavaScript bundle at build time. Anything prefixed `VITE_` is visible to every visitor.

That's why the upload tool is wrapped in `import.meta.env.DEV`. In a production build the route is removed and the module is dropped entirely by tree-shaking, so these values never reach the deployed site.

The previous version of this site had a `VITE_PIN` "password gate" on that page. It was readable in browser devtools in about ten seconds. It has been **removed, not replaced** — the fix is not shipping the tool at all.

**Still lock the preset down in Cloudinary:** restrict it to one folder, set a max file size, allow only image and video formats. Then the worst case is someone dumping junk into a folder you can purge.

You do **not** need a `.env` on your hosting provider. Leave the environment variables section empty there.

---

## 4. Adding your content

### Add a project

With `npm run dev` running, open **http://localhost:5173/upload**. That page exists only in development.

1. Drop in an image or video — dimensions are read automatically
2. Fill in title, client, type, tags
3. Copy the generated entry into `src/data/projects.json`

Or edit `src/data/projects.json` by hand. Every field is validated on startup: if something's wrong, the dev server names the exact field instead of showing a blank page.

### Add your showreel

In `src/data/profile.json`:

```json
"reel": {
  "videoUrl": "https://res.cloudinary.com/YOUR_CLOUD/video/upload/v123/reel.mp4",
  "posterUrl": null,
  "fullVideoUrl": null
}
```

Upload the reel to Cloudinary and paste the URL. The poster frame is generated automatically. Until then the hero falls back gracefully — nothing breaks.

### Add WhatsApp

In `src/data/profile.json`, find the WhatsApp channel and set:

```json
"url": "https://wa.me/251911234567"
```

Country code, no `+`, no spaces. The card appears automatically. Leave it `null` and the card stays hidden.

### Fill in the credits

Every project has `role` and `tools` arrays, currently empty:

```json
"role": ["Editor", "Colourist"],
"tools": ["Premiere Pro", "After Effects"]
```

These render as the metadata slate on the project page. Empty rows are hidden, so right now the slate shows two rows instead of four.

---

## 5. Before you deploy

Run these in order.

```bash
npm run backfill   # fills image dimensions from Cloudinary — stops grid jump
npm run audit      # lists everything unfinished
```

`npm run audit` is the important one. It reports two groups: **⚠ fix before sharing** and **ℹ nice to have**. Work through the ⚠ list. It currently flags placeholder titles, unfilled case studies and the timeline descriptions.

Then replace `REPLACE-WITH-YOUR-DOMAIN` in these **three** files:

| File | What it affects |
|---|---|
| `src/lib/seo.tsx` | Link previews, canonical URLs |
| `public/robots.txt` | Search engine crawling |
| `scripts/postbuild.mjs` | sitemap.xml |

Pick a favicon — there are two in `public/`. Rename the one you want to `favicon.svg`:

- `favicon.svg` — yellow square, black **K**
- `favicon-play.svg` — yellow square, play triangle

Then:

```bash
npm run build
```

Output lands in `dist/`. 19 pages, about 1.3 MB.

---

## 6. Deploying

Config files for both hosts are already included. Every route is prerendered to a real HTML file, so **no SPA rewrite rules are needed**.

### Vercel (easiest)

1. Push the folder to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new), import the repo
3. Framework preset: **Vite**. Build command and output directory are detected.
4. Leave environment variables empty
5. Deploy

`vercel.json` handles caching and security headers.

### Netlify

1. Push to GitHub
2. [app.netlify.com](https://app.netlify.com) → Add new site → Import
3. Build command `npm run build`, publish directory `dist`
4. Deploy

`netlify.toml` handles the rest.

### Anywhere else

`npm run build`, then upload the contents of `dist/` to any static host. Cloudflare Pages, GitHub Pages and Render all work unchanged.

### After deploying

- Test a link preview by pasting a project URL into Telegram or LinkedIn. You should see a title, description and image — not a blank rectangle.
- Submit `https://yourdomain.com/sitemap.xml` to Google Search Console.

---

## 7. Upgrading the display font (optional)

The site ships with **Epilogue**, self-hosted. It works out of the box.

The face originally chosen was **Satoshi**, which has slightly more character. To swap:

1. Download from [fontshare.com/fonts/satoshi](https://www.fontshare.com/fonts/satoshi)
2. Rename the two variable `.woff2` files to:
   - `Display-Variable.woff2`
   - `Display-VariableItalic.woff2`
3. Replace the files in `public/fonts/`

Nothing else changes. Same filenames, same tokens, same CSS.

**The italic file is not optional.** The accent word in every section heading uses a true italic, and a browser-faked slant looks wrong at display sizes.

---

## 7b. How project viewing works

Clicking a project opens a **lightbox over the grid**, not a new page. Under the hood it sets `?p=<slug>` in the URL, which means:

- the back button (and Android's system back) closes it
- the open view is a shareable link
- reloading keeps it open
- arrow keys page through, Escape closes

`/works/<slug>` still exists as a full prerendered page. Direct visits, link previews and search engines land there, and the lightbox has a **Full details** link into it. Cmd-click or middle-click a card to open that page in a new tab.

Images inside the lightbox — and on the full page — are capped to the viewport height, so you never scroll to see a whole poster.

---

## 7c. Tuning sizes

All type sizes live in `src/index.css` inside `@theme`. Nothing else in the codebase declares a font size.

The navbar has **its own tokens**, deliberately separate from the page scale, so the bar can be adjusted without touching headings or body copy:

```css
--text-nav: 0.6875rem;       /* nav links */
--text-wordmark: 1.0625rem;  /* the KB wordmark */
```

Page scale, largest to smallest: `--text-display-xl` (hero name) → `display-lg` → `display-md` → `display-sm` → `display-xs` → `body-lg` → `body` → `body-sm` → `meta`.

**If you change the nav height**, four things follow it and will leave gaps otherwise:
`scroll-padding-top` in `index.css`, `scroll-mt-*` on the home sections, `sticky top-*` on the filter bar, and the `pt-*` on the Works and Project pages.

---

## 8. The rules that keep this clean

Four conventions. Follow them and the codebase stays maintainable.

1. **Nothing imports the JSON directly.** Everything goes through `src/lib/content.ts`, which validates it.
2. **No raw hex colours outside `src/index.css`.** If a colour isn't a token, it doesn't exist.
3. **`components/primitives/` are dumb.** Everything else composes them.
4. **Folders map to where things appear.** `home/` renders on home, `work/` is shared, `project/` is the detail page.

### The one colour rule to remember

```
text-accent-ink   for text
bg-accent         for fills
```

**Never `text-accent`.** Bright yellow is 1.5:1 contrast on the light theme's cream background — literally unreadable. `accent-ink` automatically becomes a deep amber in light mode and stays bright yellow in dark.

---

## 9. Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server. `/upload` exists here only. |
| `npm run audit` | Content health check. **Run before sharing.** |
| `npm run backfill` | One-off: fills image dimensions from Cloudinary. |
| `npm run build` | Typecheck → prerender → sitemap + 404. |
| `npm run typecheck` | Types only. |
| `npm run preview` | Serve the built `dist/` locally. |

---

## 10. Troubleshooting

**`npm install` fails with a peer dependency error**
React Router is pinned to v6 on purpose — `vite-react-ssg` doesn't support v7 yet. Don't upgrade it.

**Blank page, console error mentioning a field name**
A project in `projects.json` has a bad field. The error names it. That's the validation working.

**Fonts look wrong / fall back to system**
Check that all five `.woff2` files are in `public/fonts/`.

**Images don't load**
Check the Cloudinary URL in `projects.json` opens in a browser. Non-Cloudinary URLs pass through untransformed and still work.

**Theme flashes white on load**
The inline script in `index.html` must stay in `<head>`. It applies the saved theme before first paint — React runs too late to prevent the flash.

**A project page 404s after deploy**
Run `npm run build` again. Routes are generated from `projects.json` at build time, so a new project needs a rebuild.

---

## 11. What's still yours to write

The code is finished. These are content, and only you can write them:

- `role` and `tools` on all 14 projects
- The two case studies on your featured videos (`projects.json`, look for `[bracketed]` text)
- Five weak titles — `Akil Oct`, `Grace Africa`, `Efoy`, `Yemuya Weg`, and the Canva filename on `img-12`
- Both AfroChat projects share a title
- The four timeline descriptions in `profile.json` (flagged `needsRewrite: true`)
- The hero paragraph and `aboutIntro` in `profile.json` — currently my words, not yours
- The showreel

`npm run audit` lists all of it any time you want to check.
