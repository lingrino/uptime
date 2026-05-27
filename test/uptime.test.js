import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Uptime Component Logic", () => {
  it("validates uptime input ranges", () => {
    const isValidUptime = (value) => {
      return !Number.isNaN(value) && value >= 0 && value <= 100;
    };

    assert.equal(isValidUptime(99.9), true);
    assert.equal(isValidUptime(0), true);
    assert.equal(isValidUptime(100), true);
    assert.equal(isValidUptime(-1), false);
    assert.equal(isValidUptime(101), false);
    assert.equal(isValidUptime(NaN), false);
  });

  it("calculates downtime periods correctly", () => {
    const uptimePercent = 99.9;
    const yearSeconds = 31557600;

    const daily = Math.floor((yearSeconds / 365) * (1 - uptimePercent / 100));
    const weekly = Math.floor((yearSeconds / 52) * (1 - uptimePercent / 100));
    const monthly = Math.floor((yearSeconds / 12) * (1 - uptimePercent / 100));
    const quarterly = Math.floor(
      (yearSeconds / 4) * (1 - uptimePercent / 100),
    );
    const yearly = Math.floor((yearSeconds / 1) * (1 - uptimePercent / 100));

    assert.equal(daily, 86);
    assert.equal(weekly, 606);
    assert.equal(monthly, 2629);
    assert.equal(quarterly, 7889);
    assert.equal(yearly, 31557);
  });
});
