/**
 * Capture the public pages for the README and fail loudly on console errors.
 *
 * Usage: bun scripts/screenshots.mjs [baseUrl]
 * Requires the production server to be running (bun run start in apps/web).
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = "docs/screenshots";

const pages = [
  ["home", "/"],
  ["atlas", "/atlas"],
  ["clock", "/clock"],
  ["raga", "/raga/bhairav"],
  ["compare", "/compare"],
  ["practice", "/practice"],
  ["about", "/about"],
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const problems = [];

const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
});
const page = await context.newPage();

page.on("console", (message) => {
  if (message.type() === "error") problems.push(`console: ${message.text()}`);
});
page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));

for (const [name, path] of pages) {
  const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  if (response && !response.ok()) problems.push(`${path} returned ${response.status()}`);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log(`captured ${path} -> ${outDir}/${name}.png`);
}

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
  isMobile: true,
  hasTouch: true,
});
const mobilePage = await mobile.newPage();
await mobilePage.goto(`${base}/`, { waitUntil: "networkidle" });
await mobilePage.screenshot({ path: `${outDir}/home-mobile.png`, fullPage: true });
console.log(`captured mobile home -> ${outDir}/home-mobile.png`);

const missing = await page.goto(`${base}/this-raga-does-not-exist`, { waitUntil: "networkidle" });
console.log(`404 route status: ${missing?.status()}`);
await page.screenshot({ path: `${outDir}/not-found.png`, fullPage: false });

await browser.close();

if (problems.length > 0) {
  console.error(`\n${problems.length} runtime problem(s):`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log("\nNo console errors.");
