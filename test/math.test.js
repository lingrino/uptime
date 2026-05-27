import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { uptimeSeconds, secondsToDhms } from "../public/js/math.js";

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
