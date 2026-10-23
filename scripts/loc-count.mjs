#!/usr/bin/env node
/**
 * Honest line count across the source tree (no vendored/generated files).
 * Run with: bun run loc
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const INCLUDE = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".css", ".json", ".md", ".yml", ".yaml", ".py", ".rs", ".toml"]);
const EXCLUDE_DIRS = new Set(["node_modules", ".next", ".turbo", "dist", "coverage", "test-results", "playwright-report", ".git", ".pytest_cache", "__pycache__", ".venv", "public/fonts"]);
const EXCLUDE_FILES = new Set(["package-lock.json", "bun.lockb"]);

let files = 0;
let lines = 0;
let byExt = {};

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry)) continue;
      walk(full);
    } else {
      const dot = entry.lastIndexOf(".");
      const ext = dot >= 0 ? entry.slice(dot) : "";
      if (!INCLUDE.has(ext)) continue;
      if (EXCLUDE_FILES.has(entry)) continue;
      const content = readFileSync(full, "utf8");
      const count = content.split(/\r?\n/).length;
      files++;
      lines += count;
      byExt[ext] = (byExt[ext] || 0) + count;
    }
  }
}

walk(ROOT);

console.log(`Swarmandala source: ${files} files, ${lines.toLocaleString()} lines`);
console.log("");
for (const [ext, count] of Object.entries(byExt).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${ext.padEnd(6)} ${count.toLocaleString()}`);
}
