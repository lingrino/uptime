import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const write = process.argv.includes("--write");
const ignoredDirectories = new Set([
  ".git",
  ".wrangler",
  "dist",
  "node_modules",
]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".txt",
  ".webmanifest",
  ".yml",
  ".yaml",
]);
const failures = [];

function hasTextExtension(file) {
  return [...textExtensions].some((extension) => file.endsWith(extension));
}

function format(content) {
  return `${content.replace(/[ \t]+$/gm, "").replace(/\n*$/u, "")}\n`;
}

async function checkFile(file) {
  const content = await readFile(file, "utf8");
  const formatted = format(content);

  if (content === formatted) {
    return;
  }

  if (write) {
    await writeFile(file, formatted);
  } else {
    failures.push(file);
  }
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        await walk(file);
      }
      continue;
    }

    if (entry.isFile() && hasTextExtension(file)) {
      await checkFile(file);
    }
  }
}

await walk(root);

if (failures.length > 0) {
  console.error("Formatting issues found:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(write ? "Formatted text files" : "Formatting check passed");
