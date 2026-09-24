// scripts/backfill-dimensions.mjs
//
// Fills the null thumbnail width/height on existing projects so the grid stops
// reserving guessed aspect ratios. One-off; the upload tool fills them for
// anything added afterwards.
//
//   node scripts/backfill-dimensions.mjs
//
// Uses Cloudinary's fl_getinfo transform, which returns the asset's metadata as
// JSON. No API key, no SDK — it's a plain GET on a public delivery URL.

import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/data/projects.json";
const RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)\/(.*)$/;

const projects = JSON.parse(readFileSync(FILE, "utf8"));
let filled = 0;
let skipped = 0;

for (const p of projects) {
  if (p.thumbnail.width && p.thumbnail.height) continue;

  const m = p.thumbnail.url.match(RE);
  if (!m) {
    console.log(`  skip  ${p.id} — not a Cloudinary image`);
    skipped++;
    continue;
  }

  const [, base, rest] = m;
  const clean = rest.replace(/^[a-z]{1,3}_[^/]*\//, "");

  try {
    const res = await fetch(`${base}/fl_getinfo/${clean}`);
    if (!res.ok) throw new Error(String(res.status));
    const info = await res.json();
    const { width, height } = info.input ?? info;
    if (!width || !height) throw new Error("no dimensions in response");
    p.thumbnail.width = width;
    p.thumbnail.height = height;
    console.log(`  ok    ${p.id} — ${width}x${height}`);
    filled++;
  } catch (e) {
    console.log(`  fail  ${p.id} — ${e.message}`);
    skipped++;
  }
}

writeFileSync(FILE, JSON.stringify(projects, null, 2) + "\n");
console.log(`\n${filled} filled, ${skipped} skipped.`);
