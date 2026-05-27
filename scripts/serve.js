import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.argv[2] ?? ".";
const port = Number(process.env.PORT ?? 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff2": "font/woff2",
};

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname.split("?")[0]);
  return normalize(decoded).replace(/^(\.\.[/\\])+/, "");
}

async function fileForRequest(requestUrl) {
  const pathname = safePath(new URL(requestUrl, "http://localhost").pathname);
  const requested = join(root, pathname);

  if (existsSync(requested) && (await stat(requested)).isFile()) {
    return requested;
  }

  return join(root, "index.html");
}

createServer(async (request, response) => {
  try {
    const file = await fileForRequest(request.url ?? "/");
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream",
    });
    createReadStream(file).pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Unknown error");
  }
}).listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}`);
});
