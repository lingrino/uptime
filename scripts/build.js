import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");

await rm(dist, { force: true, recursive: true });
await mkdir(dist, { recursive: true });
await cp(join(root, "index.html"), join(dist, "index.html"));
await cp(join(root, "src"), join(dist, "src"), { recursive: true });
await cp(join(root, "static"), dist, { recursive: true });

// Serve all calculator paths from the single static entrypoint on Cloudflare.
await writeFile(join(dist, "_redirects"), "/* /index.html 200\n");

console.log("Built static site to dist/");
