import fs from "fs";
import path from "path";

const ignoredDirs = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".DS_Store",
];

const allowedExtensions = [
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".json",
  ".css",
  ".scss",
];

const ignoredFiles = ["package-lock.json"];

const outputFile = "output-frontend.txt";

// Reset output file
fs.writeFileSync(outputFile, "");

function shouldIncludeFile(fileName) {
  const ext = path.extname(fileName).toLowerCase();

  if (ignoredFiles.includes(fileName)) return false;
  if (ext === ".md") return false;

  return allowedExtensions.includes(ext);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip ignored directories
    if (entry.isDirectory()) {
      if (ignoredDirs.includes(entry.name)) continue;
      walk(fullPath);
      continue;
    }

    // Process files
    if (entry.isFile() && shouldIncludeFile(entry.name)) {
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        const header = `\n\n===== FILE: ${fullPath} =====\n\n`;

        fs.appendFileSync(outputFile, header + content);
        console.log("Added:", fullPath);
      } catch (err) {
        console.error("Error reading:", fullPath, err.message);
      }
    }
  }
}

walk(".");
console.log(`\nDone! All frontend code saved to ${outputFile}`);