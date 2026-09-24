// scripts/postbuild.mjs — runs after the prerender.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

// Vercel and Netlify both serve dist/404.html for unmatched paths, but the
// prerenderer emits dist/404/index.html. Copy it up.
if (existsSync("dist/404/index.html")) {
  copyFileSync("dist/404/index.html", "dist/404.html");
  console.log("404.html written");
} else {
  console.warn("no 404/index.html — check the /404 route");
}

// Sitemap
const SITE = "https://REPLACE-WITH-YOUR-DOMAIN";
const projects = JSON.parse(readFileSync("src/data/projects.json", "utf8"));
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: "/", priority: "1.0" },
  { loc: "/works", priority: "0.9" },
  ...projects.map((p) => ({ loc: `/works/${p.slug}`, priority: "0.7", lastmod: p.date })),
];
writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod ?? today}</lastmod><priority>${u.priority}</priority></url>`
  )
  .join("\n")}
</urlset>
`
);
console.log(`sitemap.xml — ${urls.length} urls`);
