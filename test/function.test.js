import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { onRequest } from "../functions/[[path]].js";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const template = await readFile(join(publicDir, "index.html"), "utf8");

// what Cloudflare passes the function: the request and a binding that serves
// files from public/
function call(path) {
  return onRequest({
    request: new Request(`https://uptime.how${path}`),
    env: {
      ASSETS: {
        fetch: async (url) => {
          assert.equal(new URL(url).pathname, "/");
          return new Response(template);
        },
      },
    },
  });
}

describe("Pages Function", () => {
  it("renders uptime routes", async () => {
    const res = await call("/five-nines");

    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), "text/html; charset=utf-8");
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.match(await res.text(), /<dd data-divisor="365">1 second<\/dd>/);
  });

  it("returns 404 for other paths", async () => {
    const res = await call("/wp-admin");

    assert.equal(res.status, 404);
    assert.equal(await res.text(), template);
  });

  it("never runs for static files", async () => {
    const routes = JSON.parse(
      await readFile(join(publicDir, "_routes.json"), "utf8"),
    );
    const excluded = (path) =>
      routes.exclude.some((rule) =>
        rule.endsWith("/*")
          ? path.startsWith(rule.slice(0, -1))
          : rule === path,
      );

    const files = (
      await readdir(publicDir, { recursive: true, withFileTypes: true })
    )
      .filter((entry) => entry.isFile())
      .map(
        (entry) =>
          `/${relative(publicDir, join(entry.parentPath, entry.name))}`,
      )
      .filter((path) => !/\/[._]/.test(path)); // dotfiles and Pages config

    assert.equal(excluded("/"), true); // index.html is already the root page
    for (const file of files.filter((path) => path !== "/index.html")) {
      assert.equal(excluded(file), true, `${file} is not in _routes.json`);
    }
  });
});
