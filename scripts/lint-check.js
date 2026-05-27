import { execFileSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const ignoredDirectories = new Set([
  ".git",
  ".wrangler",
  "dist",
  "node_modules",
]);
const files = [];

async function collectJavaScriptFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        await collectJavaScriptFiles(join(directory, entry.name));
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(join(directory, entry.name));
    }
  }
}

await collectJavaScriptFiles(root);

for (const file of files) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}

console.log(`Checked syntax for ${files.length} JavaScript files`);
