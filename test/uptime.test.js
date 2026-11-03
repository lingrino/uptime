import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { uptimeSeconds, secondsToDhms } from "../public/math.js";
import {
  isValidUptime,
  mount,
  presets,
  renderPage,
  routeUptime,
  uptimeFromPath,
} from "../public/uptime.js";

const template = await readFile(
  new URL("../public/index.html", import.meta.url),
  "utf8",
);

describe("Uptime Component Logic", () => {
  it("validates uptime input ranges", () => {
    assert.equal(isValidUptime(99.9), true);
    assert.equal(isValidUptime(0), true);
    assert.equal(isValidUptime(100), true);
    assert.equal(isValidUptime(-1), false);
    assert.equal(isValidUptime(101), false);
    assert.equal(isValidUptime(NaN), false);
  });

  it("validates uptime typed as text", () => {
    assert.equal(isValidUptime("99.95"), true);
    assert.equal(isValidUptime("99."), true); // on the way to 99.9
    assert.equal(isValidUptime(".5"), true);
    assert.equal(isValidUptime("abc"), false);
    assert.equal(isValidUptime("101"), false);
  });

  it("only accepts plain decimals", () => {
    assert.equal(isValidUptime(""), false);
    assert.equal(isValidUptime("  "), false);
    assert.equal(isValidUptime(" 50"), false);
    assert.equal(isValidUptime("0x10"), false);
    assert.equal(isValidUptime("1e1"), false);
    assert.equal(isValidUptime("-0"), false);
  });

  it("calculates downtime periods correctly", () => {
    const uptimePercent = 99.9;

    assert.equal(uptimeSeconds(uptimePercent, 365), 86);
    assert.equal(uptimeSeconds(uptimePercent, 52), 605);
    assert.equal(uptimeSeconds(uptimePercent, 12), 2630);
    assert.equal(uptimeSeconds(uptimePercent, 4), 7889);
    assert.equal(uptimeSeconds(uptimePercent, 1), 31558);
  });
});

describe("uptimeFromPath", () => {
  it("defaults the root path to 99.9", () => {
    assert.equal(uptimeFromPath("/"), 99.9);
  });

  it("loads named routes", () => {
    assert.equal(uptimeFromPath("/two-nines"), 99);
    assert.equal(uptimeFromPath("/five-nines"), 99.999);
    assert.equal(uptimeFromPath("/nine-nines"), 99.9999999);
    assert.equal(uptimeFromPath("/nine-fives"), 55.5555555);
    assert.equal(uptimeFromPath("/five-nines/"), 99.999);
    assert.equal(presets.size, 10);
  });

  it("loads custom uptime as typed", () => {
    assert.equal(uptimeFromPath("/99.95"), "99.95");
    assert.equal(uptimeFromPath("/99.950"), "99.950");
    assert.equal(uptimeFromPath("/0"), "0");
    assert.equal(uptimeFromPath("/100"), "100");
  });

  it("falls back to 99.9 for invalid uptime", () => {
    assert.equal(uptimeFromPath("/garbage"), 99.9);
    assert.equal(uptimeFromPath("/150"), 99.9);
    assert.equal(uptimeFromPath("/-1"), 99.9);
    assert.equal(uptimeFromPath("/constructor"), 99.9);
    assert.equal(uptimeFromPath("/%E0%A4%A"), 99.9);
    assert.equal(uptimeFromPath("/0x10"), 99.9);
  });
});

describe("routeUptime", () => {
  it("is undefined for paths that aren't an uptime", () => {
    assert.equal(routeUptime("/five-nines"), 99.999);
    assert.equal(routeUptime("/99.95"), "99.95");
    assert.equal(routeUptime("/wp-admin"), undefined);
    assert.equal(routeUptime("/a/b"), undefined);
    assert.equal(routeUptime("/150"), undefined);
  });
});

describe("renderPage", () => {
  const field = (html, re) => html.match(re)[1];
  const title = (html) => field(html, /<title>([^<]*)/);
  const canonical = (html) => field(html, /rel="canonical" href="([^"]*)/);
  const value = (html) => field(html, /id="uptime"[^>]*\svalue="([^"]*)/);
  const rows = (html) =>
    [...html.matchAll(/<dd data-divisor="(\d+)">([^<]*)</g)].map((m) => [
      Number(m[1]),
      m[2],
    ]);

  it("leaves index.html as the rendered root page", () => {
    // / is served straight from public/index.html, so it must already match
    assert.deepEqual(renderPage(template, "/"), {
      status: 200,
      html: template,
    });
    assert.equal(value(template), String(presets.get("")));
    for (const [divisor, text] of rows(template)) {
      assert.equal(text, secondsToDhms(uptimeSeconds(99.9, divisor)));
    }
  });

  it("renders named routes", () => {
    const { status, html } = renderPage(template, "/five-nines");

    assert.equal(status, 200);
    assert.equal(title(html), "Five Nines (99.999%) - Uptime Calculator");
    assert.match(
      html,
      /content="99.999% uptime allows 5 minutes, 16 seconds of downtime per year."/,
    );
    assert.equal(canonical(html), "https://uptime.how/five-nines");
    assert.equal(value(html), "99.999");
    assert.deepEqual(rows(html), [
      [365, "1 second"],
      [52, "6 seconds"],
      [12, "26 seconds"],
      [4, "1 minute, 19 seconds"],
      [1, "5 minutes, 16 seconds"],
    ]);
  });

  it("renders custom uptime", () => {
    const { status, html } = renderPage(template, "/99.95");

    assert.equal(status, 200);
    assert.equal(title(html), "99.95% - Uptime Calculator");
    assert.equal(canonical(html), "https://uptime.how/99.95");
    assert.equal(value(html), "99.95");
    assert.equal(rows(html)[0][1], "43 seconds");
  });

  it("returns 404 with the default page for other paths", () => {
    for (const path of ["/wp-admin", "/a/b", "/150", "/<script>"]) {
      assert.deepEqual(renderPage(template, path), {
        status: 404,
        html: template,
      });
    }
  });
});

// just enough of an <input> for mount()
class FakeInput extends EventTarget {
  #value = "";
  classes = new Set();
  classList = {
    toggle: (name, force) =>
      force ? this.classes.add(name) : this.classes.delete(name),
  };

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = String(value);
  }

  type(value) {
    this.value = value;
    this.dispatchEvent(new Event("input"));
  }
}

describe("mount", () => {
  let input;
  let durations;

  function load(pathname) {
    input = new FakeInput();
    durations = [365, 52, 12, 4, 1].map((divisor) => ({
      dataset: { divisor: String(divisor) },
      textContent: "",
    }));
    globalThis.document = {
      title: "",
      querySelector: () => input,
      querySelectorAll: () => durations,
    };
    globalThis.location = { pathname };
    globalThis.history = {
      state: null,
      replaceState: (state, unused, url) => (location.pathname = url),
    };
    mount();
  }

  const values = () => durations.map((el) => el.textContent);

  beforeEach(() => load("/five-nines"));

  afterEach(() => {
    delete globalThis.document;
    delete globalThis.location;
    delete globalThis.history;
  });

  it("renders the uptime from the URL", () => {
    assert.equal(input.value, "99.999");
    assert.deepEqual(values(), [
      "1 second",
      "6 seconds",
      "26 seconds",
      "1 minute, 19 seconds",
      "5 minutes, 16 seconds",
    ]);
  });

  it("updates the table and URL as the user types", () => {
    input.type("99.5");

    assert.equal(location.pathname, "/99.5");
    assert.equal(document.title, "99.5% - Uptime Calculator");
    assert.equal(values()[0], "7 minutes, 12 seconds");
    assert.equal(input.classes.has("invalid"), false);
  });

  it("flags invalid input and leaves the table and URL alone", () => {
    input.type("abc");

    assert.equal(location.pathname, "/five-nines");
    assert.equal(document.title, "");
    assert.equal(values()[0], "1 second");
    assert.equal(input.classes.has("invalid"), true);

    input.type("");
    assert.equal(location.pathname, "/five-nines");
    assert.equal(values()[0], "1 second");

    input.type("99");
    assert.equal(input.classes.has("invalid"), false);
  });
});
