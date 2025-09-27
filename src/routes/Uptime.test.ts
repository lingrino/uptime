import { describe, it, expect } from 'vitest';

describe('Uptime Component Logic', () => {
	it('validates uptime input ranges', () => {
		const isValidUptime = (value: number) => {
			return !Number.isNaN(value) && value >= 0 && value <= 100;
		};

		expect(isValidUptime(99.9)).toBe(true);
		expect(isValidUptime(0)).toBe(true);
		expect(isValidUptime(100)).toBe(true);
		expect(isValidUptime(-1)).toBe(false);
		expect(isValidUptime(101)).toBe(false);
		expect(isValidUptime(NaN)).toBe(false);
	});

	it('calculates downtime periods correctly', () => {
		const uptimePercent = 99.9;
		const yearSeconds = 31557600;

		const daily = Math.floor((yearSeconds / 365) * (1 - uptimePercent / 100));
		const weekly = Math.floor((yearSeconds / 52) * (1 - uptimePercent / 100));
		const monthly = Math.floor((yearSeconds / 12) * (1 - uptimePercent / 100));
		const quarterly = Math.floor((yearSeconds / 4) * (1 - uptimePercent / 100));
		const yearly = Math.floor((yearSeconds / 1) * (1 - uptimePercent / 100));

		expect(daily).toBe(86);
		expect(weekly).toBe(606);
		expect(monthly).toBe(2629);
		expect(quarterly).toBe(7889);
		expect(yearly).toBe(31557);
	});
});
