import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const portfolioPath = path.join(root, "portfolio.html");
const includeRoots = [
  "",
  "public",
  "nodear/nodear_brand_system",
];
const excludedRootEntries = new Set([
  ".claude",
  ".git",
  "dist",
  "node_modules",
  "src",
  "scripts",
  "RAE FILES FR",
  "RANAAN CCCC",
  "aurea",
  "jiayou",
  "nodear",
  "Seoulstice (설스티스)",
  "graphic posters",
]);

function labelFromPath(relativePath) {
  const base = path.basename(relativePath, ".html");
  const cleaned = base
    .replace(/\s*\(\d+\)$/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (relativePath === "index.html") return "React Source Entry";
  if (relativePath === "portfolio.html") return "Portfolio Site";
  if (relativePath === "v4.html") return "V4 Archive Site";
  if (relativePath === "nodear.html") return "Nodear Portal";
  if (/ranaan-ccc\/index\.html$/i.test(relativePath)) return "RANAAN CCC — Future Archives";
  if (/nodear_brand_system\/index\.html$/i.test(relativePath)) return "NODEAR — Brand System";
  if (/NODEAR_EPK_website\.html$/i.test(relativePath)) return "NODEAR — EPK Website";
  if (/NODEAR_Cross_Medium_Identity_Board\.html$/i.test(relativePath)) return "NODEAR — Cross Medium Identity";
  if (/public\/projects\/([^/]+)\/index\.html$/i.test(relativePath)) {
    const slug = relativePath.match(/public\/projects\/([^/]+)\/index\.html$/i)?.[1] || cleaned;
    return slug
      .split("-")
      .map(part => part ? part[0].toUpperCase() + part.slice(1) : "")
      .join(" ");
  }
  return cleaned || relativePath;
}

async function walk(dir, base = dir) {
  const entries = [];
  const names = await readdir(dir);
  for (const name of names) {
    if (base === root && excludedRootEntries.has(name)) continue;
    if (name === ".DS_Store") continue;
    const full = path.join(dir, name);
    const info = await stat(full);
    if (info.isDirectory()) {
      entries.push(...await walk(full, base));
    } else if (name.toLowerCase().endsWith(".html")) {
      entries.push(path.relative(root, full).split(path.sep).join("/"));
    }
  }
  return entries;
}

const htmlFiles = new Set();
for (const includeRoot of includeRoots) {
  const full = path.join(root, includeRoot);
  try {
    const info = await stat(full);
    if (info.isDirectory()) {
      for (const file of await walk(full)) htmlFiles.add(file);
    }
  } catch {}
}

const priority = [
  "portfolio.html",
  "v4.html",
  "nodear.html",
  "public/projects/ranaan-ccc/index.html",
  "public/projects/aurea/index.html",
  "public/projects/jiayou/index.html",
  "public/projects/ranaan-bks-drop-shop/index.html",
  "nodear/nodear_brand_system/index.html",
  "nodear/nodear_brand_system/NODEAR_EPK_website.html",
  "nodear/nodear_brand_system/NODEAR_Cross_Medium_Identity_Board.html",
];

const sorted = [...htmlFiles].sort((a, b) => {
  const ai = priority.indexOf(a);
  const bi = priority.indexOf(b);
  if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  return a.localeCompare(b, undefined, { sensitivity: "base" });
});

const archiveEntries = sorted.map(file => ({
  name: labelFromPath(file),
  path: file,
}));

let portfolio = await readFile(portfolioPath, "utf8");
const replacement = `const allFiles = ${JSON.stringify(archiveEntries, null, 2)};`;
if (!/const allFiles = \[[\s\S]*?\];/.test(portfolio)) {
  console.log("Archive manifest not present; skipping HTML archive sync");
  process.exit(0);
}
portfolio = portfolio.replace(/const allFiles = \[[\s\S]*?\];/, replacement);
await writeFile(portfolioPath, portfolio);

console.log(`Synced ${archiveEntries.length} HTML archive links into portfolio.html`);
