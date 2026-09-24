// scripts/clean-icons.mjs
//
// Strips C2PA provenance metadata from the SVGs in /public/icons.
//
// Any SVG that has passed through a file-transfer pipeline tends to arrive
// carrying a base64 provenance manifest. It is inert — browsers ignore it —
// but on an icon whose real content is under 2kb it can be 80% of the file,
// and it ships to every visitor.
//
// Safe to run repeatedly. Files with no metadata are left untouched.
//
// Run with:  node scripts/clean-icons.mjs
// On a custom directory:  node scripts/clean-icons.mjs public/some-other-dir

import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2] ?? "public/icons";

if (!fs.existsSync(dir)) {
  console.error(`No such directory: ${dir}`);
  process.exit(1);
}

const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".svg"));

if (files.length === 0) {
  console.log(`No .svg files in ${dir}`);
  process.exit(0);
}

let before = 0;
let after = 0;
let touched = 0;

for (const file of files) {
  const full = path.join(dir, file);
  const original = fs.readFileSync(full, "utf-8");

  const cleaned = original
    .replace(/<metadata>[\s\S]*?<\/metadata>/g, "")
    .replace(/\s*xmlns:c2pa="[^"]*"/g, "");

  before += Buffer.byteLength(original);
  after += Buffer.byteLength(cleaned);

  if (cleaned !== original) {
    fs.writeFileSync(full, cleaned);
    touched += 1;
    const saved = Buffer.byteLength(original) - Buffer.byteLength(cleaned);
    console.log(
      `  cleaned  ${file.padEnd(26)} -${(saved / 1024).toFixed(1)}kb`
    );
  } else {
    console.log(`  already clean  ${file}`);
  }
}

const kb = (n) => `${(n / 1024).toFixed(1)}kb`;
console.log(
  `\n${touched} of ${files.length} file(s) changed — ${kb(before)} to ${kb(after)}.`
);
