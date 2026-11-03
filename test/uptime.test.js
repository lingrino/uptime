import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { uptimeSeconds, secondsToDhms } from "../public/math.js";
import {
  isValidUptime,
  mount,
  presets,
  uptimeFromPath,
} from "../public/uptime.js";

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
    assert.equal(isValidUptime(""), true); // treated as 0%
    assert.equal(isValidUptime("abc"), false);
    assert.equal(isValidUptime("101"), false);
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
  });
});

describe("index.html", () => {
  it("prefills the default uptime so nothing shifts before JS runs", async () => {
    const html = await readFile(
      new URL("../public/index.html", import.meta.url),
      "utf8",
    );
    const uptime = presets.get("");

    assert.match(html, new RegExp(`value="${uptime}"`));

    const rows = [...html.matchAll(/<dd data-divisor="(\d+)">([^<]*)<\/dd>/g)];
    assert.equal(rows.length, 5);
    for (const [, divisor, value] of rows) {
      assert.equal(value, secondsToDhms(uptimeSeconds(uptime, divisor)));
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
    assert.equal(values()[0], "7 minutes, 12 seconds");
    assert.equal(input.classes.has("invalid"), false);
  });

  it("flags invalid input and leaves the table and URL alone", () => {
    input.type("abc");

    assert.equal(location.pathname, "/five-nines");
    assert.equal(values()[0], "1 second");
    assert.equal(input.classes.has("invalid"), true);

    input.type("99");
    assert.equal(input.classes.has("invalid"), false);
  });
});
