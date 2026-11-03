import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("../scripts/dev.js", import.meta.url));

describe("dev server", { timeout: 10_000 }, () => {
  let server;
  let base;

  before(async () => {
    server = spawn(process.execPath, [script], {
      env: { ...process.env, PORT: "0" },
    });
    const [line] = await once(server.stdout, "data");
    base = String(line).match(/http:\S+/)[0];
  });

  after(() => server.kill());

  async function get(path) {
    const res = await fetch(base + path);
    return {
      status: res.status,
      type: res.headers.get("content-type"),
      body: await res.text(),
    };
  }

  it("serves files from public/", async () => {
    assert.equal((await get("/app.css")).type, "text/css");
    assert.equal((await get("/uptime.js")).type, "text/javascript");
  });

  it("renders app routes with their uptime", async () => {
    for (const [path, uptime] of [
      ["/", "99.9"],
      ["/five-nines", "99.999"],
      ["/99.95", "99.95"],
    ]) {
      const { status, type, body } = await get(path);
      assert.equal(status, 200);
      assert.equal(type, "text/html");
      assert.match(body, new RegExp(`\\svalue="${uptime}"`));
    }
  });

  it("returns 404 with the app for other paths", async () => {
    for (const path of ["/wp-admin", "/a/b", "/missing.png"]) {
      const { status, body } = await get(path);
      assert.equal(status, 404);
      assert.match(body, /id="uptime"/);
    }
  });

  it("does not serve files outside public/", async () => {
    for (const path of ["/..%2fpackage.json", "/%2e%2e/package.json"]) {
      const { status, body } = await get(path);
      assert.equal(status, 404);
      assert.doesNotMatch(body, /"name": "uptime"/);
    }
  });
});
