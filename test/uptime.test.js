import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { uptimeSeconds } from "../public/math.js";
import { isValidUptime, presets, uptimeFromPath } from "../public/uptime.js";

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
