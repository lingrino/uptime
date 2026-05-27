import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  downtimeFor,
  isValidUptime,
  secondsToDhms,
  uptimeFromPath,
  uptimeSeconds,
} from "../src/math.js";

describe("uptimeSeconds", () => {
  it("calculates downtime seconds for yearly period", () => {
    assert.equal(uptimeSeconds(99.9, 1), 31558);
    assert.equal(uptimeSeconds(99.99, 1), 3156);
    assert.equal(uptimeSeconds(99.999, 1), 316);
  });

  it("calculates downtime seconds for monthly period", () => {
    assert.equal(uptimeSeconds(99.9, 12), 2630);
    assert.equal(uptimeSeconds(99.99, 12), 263);
  });

  it("calculates downtime seconds for daily period", () => {
    assert.equal(uptimeSeconds(99.9, 365), 86);
    assert.equal(uptimeSeconds(99.99, 365), 9);
  });

  it("handles 100% uptime", () => {
    assert.equal(uptimeSeconds(100, 1), 0);
    assert.equal(uptimeSeconds(100, 365), 0);
  });

  it("handles 0% uptime", () => {
    assert.equal(uptimeSeconds(0, 1), 31557600);
    assert.equal(uptimeSeconds(0, 365), 86400);
    assert.equal(uptimeSeconds(0, 52), 604800);
    assert.equal(uptimeSeconds(0, 12), 2629800);
    assert.equal(uptimeSeconds(0, 4), 7889400);
  });
});

describe("secondsToDhms", () => {
  it("formats seconds into human readable format", () => {
    assert.equal(secondsToDhms(0), "0 seconds");
    assert.equal(secondsToDhms(1), "1 second");
    assert.equal(secondsToDhms(2), "2 seconds");
    assert.equal(secondsToDhms(60), "1 minute, 0 seconds");
    assert.equal(secondsToDhms(61), "1 minute, 1 second");
    assert.equal(secondsToDhms(120), "2 minutes, 0 seconds");
    assert.equal(secondsToDhms(3600), "1 hour, 0 seconds");
    assert.equal(secondsToDhms(3661), "1 hour, 1 minute, 1 second");
    assert.equal(secondsToDhms(86400), "1 day, 0 seconds");
    assert.equal(secondsToDhms(90061), "1 day, 1 hour, 1 minute, 1 second");
  });

  it("handles pluralization correctly", () => {
    assert.equal(secondsToDhms(86401), "1 day, 1 second");
    assert.equal(secondsToDhms(172800), "2 days, 0 seconds");
    assert.equal(secondsToDhms(7200), "2 hours, 0 seconds");
    assert.equal(secondsToDhms(7320), "2 hours, 2 minutes, 0 seconds");
  });

  it("handles common uptime scenarios", () => {
    assert.equal(secondsToDhms(31557), "8 hours, 45 minutes, 57 seconds");
    assert.equal(secondsToDhms(3155), "52 minutes, 35 seconds");
    assert.equal(secondsToDhms(315), "5 minutes, 15 seconds");
  });
});

describe("calculator logic", () => {
  it("validates uptime input ranges", () => {
    assert.equal(isValidUptime(99.9), true);
    assert.equal(isValidUptime(0), true);
    assert.equal(isValidUptime(100), true);
    assert.equal(isValidUptime(-1), false);
    assert.equal(isValidUptime(101), false);
    assert.equal(isValidUptime(NaN), false);
  });

  it("calculates downtime periods correctly", () => {
    assert.deepEqual(downtimeFor(99.9), [
      { name: "Daily", value: "1 minute, 26 seconds" },
      { name: "Weekly", value: "10 minutes, 5 seconds" },
      { name: "Monthly", value: "43 minutes, 50 seconds" },
      { name: "Quarterly", value: "2 hours, 11 minutes, 29 seconds" },
      { name: "Yearly", value: "8 hours, 45 minutes, 58 seconds" },
    ]);
  });

  it("loads uptime values from static route aliases", () => {
    assert.equal(uptimeFromPath("/"), 99.9);
    assert.equal(uptimeFromPath("/two-nines"), 99);
    assert.equal(uptimeFromPath("/three-nines"), 99.9);
    assert.equal(uptimeFromPath("/four-nines"), 99.99);
    assert.equal(uptimeFromPath("/five-nines"), 99.999);
    assert.equal(uptimeFromPath("/six-nines"), 99.9999);
    assert.equal(uptimeFromPath("/seven-nines"), 99.99999);
    assert.equal(uptimeFromPath("/eight-nines"), 99.999999);
    assert.equal(uptimeFromPath("/nine-nines"), 99.9999999);
    assert.equal(uptimeFromPath("/nine-fives"), 55.5555555);
  });

  it("loads uptime values from numeric routes and falls back when invalid", () => {
    assert.equal(uptimeFromPath("/99.95"), "99.95");
    assert.equal(uptimeFromPath("/99.95/"), "99.95");
    assert.equal(uptimeFromPath("/five-nines/"), 99.999);
    assert.equal(uptimeFromPath("/0"), "0");
    assert.equal(uptimeFromPath("/100"), "100");
    assert.equal(uptimeFromPath("/101"), 99.9);
    assert.equal(uptimeFromPath("/not-a-number"), 99.9);
  });
});
