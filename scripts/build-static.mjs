import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

const copyTargets = [
  "public",
];

const fileTargets = [
  ["career-materials/raehdojhn_resume_template.docx"],
  ["career-materials/raehdojhn_cover_letter_template.docx"],
  ["nodear/nodear_brand_system/index.html"],
  ["nodear/nodear_brand_system/NODEAR_EPK_website.html"],
  ["nodear/nodear_brand_system/NODEAR_Cross_Medium_Identity_Board.html"],
  ["nodear/nodear_brand_system/nodear_epk_website_home.html"],
  ["nodear/nodear_brand_system/nodear_logo_white_transparent.png"],
  [
    "nodear/nodear_brand_system/nodear_logo_white_transparent.png",
    "nodear/nodear_brand_system/nodear_brand_system/nodear_logo_white_transparent.png",
  ],
  ["nodear/nodear_brand_system/central_logo/nodear_central_logo.png"],
  [
    "nodear/nodear_brand_system/NODEAR_EPK_chatgpt_upload_pack/central_logo/nodear_central_logo.png",
  ],
];

async function copyIfExists(target) {
  const source = path.join(root, target);
  if (!existsSync(source)) return false;
  await cp(source, path.join(dist, target), {
    recursive: true,
    force: true,
    errorOnExist: false,
  });
  return true;
}

async function copyFileIfExists(target) {
  const [sourceTarget, destinationTarget = sourceTarget] = target;
  const source = path.join(root, sourceTarget);
  if (!existsSync(source)) return false;
  const destination = path.join(dist, destinationTarget);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { force: true });
  return true;
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(path.join(root, "portfolio.html"), path.join(dist, "index.html"));
await cp(path.join(root, "portfolio.html"), path.join(dist, "portfolio.html"));
await cp(path.join(root, "v4.html"), path.join(dist, "v4.html"));
await cp(path.join(root, "nodear.html"), path.join(dist, "nodear.html"));
await writeFile(path.join(dist, ".nojekyll"), "");
await writeFile(
  path.join(dist, "404.html"),
  '<!doctype html><meta http-equiv="refresh" content="0; url=./index.html"><title>Raehdojhn</title>'
);

const copied = [];
for (const target of copyTargets) {
  if (await copyIfExists(target)) copied.push(target);
}

for (const target of fileTargets) {
  if (await copyFileIfExists(target)) copied.push(target[1] || target[0]);
}

console.log(`Static portfolio build complete: ${path.relative(root, dist)}`);
console.log(`Copied assets: ${copied.join(", ") || "none"}`);
