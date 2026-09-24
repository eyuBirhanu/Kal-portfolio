// scripts/audit.mjs — content health check.  node scripts/audit.mjs
//
// Catches the things that make a portfolio look unfinished but that no
// type-checker can see: placeholder titles, missing credits, unlinked clients.

import { readFileSync } from "node:fs";

const projects = JSON.parse(readFileSync("src/data/projects.json", "utf8"));
const clients = JSON.parse(readFileSync("src/data/clients.json", "utf8"));
const profile = JSON.parse(readFileSync("src/data/profile.json", "utf8"));

const warn = [];
const info = [];

const clientNames = new Set(clients.map((c) => c.name.toLowerCase()));
const titles = new Map();

for (const p of projects) {
  if (clientNames.has(p.title.toLowerCase()))
    warn.push(`${p.id}: title "${p.title}" is just the client name`);
  if (/^(blue|green|red|modern|simple|minimalist|white)\s/i.test(p.title))
    warn.push(`${p.id}: title "${p.title}" looks like a Canva template name`);
  if (!p.role.length) info.push(`${p.id}: no role — the metadata slate hides the row`);
  if (!p.tools.length) info.push(`${p.id}: no tools`);
  if (!p.summary) warn.push(`${p.id}: no summary — shows as an empty paragraph`);
  if (!p.thumbnail.width) info.push(`${p.id}: no dimensions — run backfill-dimensions`);
  if (p.featured && p.caseStudy) {
    const unfilled = Object.values(p.caseStudy).filter((v) => /^\[.*\]$/.test(v ?? ""));
    if (unfilled.length) warn.push(`${p.id}: case study has ${unfilled.length} placeholder field(s)`);
  }
  titles.set(p.title, (titles.get(p.title) ?? 0) + 1);
}

for (const [t, n] of titles) if (n > 1) warn.push(`duplicate title: "${t}" ×${n}`);

const used = new Set(projects.map((p) => p.clientId));
for (const c of clients)
  if (!used.has(c.id)) info.push(`client "${c.name}" has no work attached`);

for (const e of profile.experience)
  if (e.needsRewrite) warn.push(`timeline "${e.company}": description still needs rewriting`);

if (!profile.reel.videoUrl) info.push("no showreel set — hero falls back to the poster/ground");
if (!profile.channels.find((c) => c.id === "whatsapp")?.url)
  info.push("WhatsApp has no url — card is hidden");

console.log(`\n⚠  ${warn.length} to fix before sharing\n`);
warn.forEach((w) => console.log(`   ${w}`));
console.log(`\nℹ  ${info.length} nice to have\n`);
info.forEach((i) => console.log(`   ${i}`));
console.log();
