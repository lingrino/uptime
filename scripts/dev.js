// Serves public/ the way Cloudflare Pages does: files are served as-is and
// any other path falls back to index.html so the app can route client-side.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/", import.meta.url));
const port = Number(process.env.PORT) || 5173;

const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".js": "text/javascript",
  ".png": "image/png",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
};

async function resolve(pathname) {
  try {
    const file = join(root, decodeURIComponent(pathname));
    if (file.startsWith(root) && (await stat(file)).isFile()) {
      return file;
    }
  } catch {
    // missing or malformed paths fall through to the app
  }
  return join(root, "index.html");
}

createServer(async (req, res) => {
  const file = await resolve(new URL(req.url, "http://localhost").pathname);
  res.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": types[extname(file)] ?? "application/octet-stream",
  });
  res.end(await readFile(file));
}).listen(port, () => {
  console.log(`serving public/ at http://localhost:${port}`);
});
