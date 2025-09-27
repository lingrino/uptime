import { describe, it, expect } from 'vitest';
import { uptimeSeconds, secondsToDhms } from './Math.svelte';

describe('uptimeSeconds', () => {
	it('calculates downtime seconds for yearly period', () => {
		expect(uptimeSeconds(99.9, 1)).toBe(31557);
		expect(uptimeSeconds(99.99, 1)).toBe(3155);
		expect(uptimeSeconds(99.999, 1)).toBe(315);
	});

	it('calculates downtime seconds for monthly period', () => {
		expect(uptimeSeconds(99.9, 12)).toBe(2629);
		expect(uptimeSeconds(99.99, 12)).toBe(262);
	});

	it('calculates downtime seconds for daily period', () => {
		expect(uptimeSeconds(99.9, 365)).toBe(86);
		expect(uptimeSeconds(99.99, 365)).toBe(8);
	});

	it('handles 100% uptime', () => {
		expect(uptimeSeconds(100, 1)).toBe(0);
		expect(uptimeSeconds(100, 365)).toBe(0);
	});

	it('handles 0% uptime', () => {
		expect(uptimeSeconds(0, 1)).toBe(31557600);
	});
});

describe('secondsToDhms', () => {
	it('formats seconds into human readable format', () => {
		expect(secondsToDhms(0)).toBe('0 seconds');
		expect(secondsToDhms(1)).toBe('1 second');
		expect(secondsToDhms(2)).toBe('2 seconds');
		expect(secondsToDhms(60)).toBe('1 minute, 0 seconds');
		expect(secondsToDhms(61)).toBe('1 minute, 1 second');
		expect(secondsToDhms(120)).toBe('2 minutes, 0 seconds');
		expect(secondsToDhms(3600)).toBe('1 hour, 0 seconds');
		expect(secondsToDhms(3661)).toBe('1 hour, 1 minute, 1 second');
		expect(secondsToDhms(86400)).toBe('1 day, 0 seconds');
		expect(secondsToDhms(90061)).toBe('1 day, 1 hour, 1 minute, 1 second');
	});

	it('handles pluralization correctly', () => {
		expect(secondsToDhms(86401)).toBe('1 day, 1 second');
		expect(secondsToDhms(172800)).toBe('2 days, 0 seconds');
		expect(secondsToDhms(7200)).toBe('2 hours, 0 seconds');
		expect(secondsToDhms(7320)).toBe('2 hours, 2 minutes, 0 seconds');
	});

	it('handles common uptime scenarios', () => {
		expect(secondsToDhms(31557)).toBe('8 hours, 45 minutes, 57 seconds');
		expect(secondsToDhms(3155)).toBe('52 minutes, 35 seconds');
		expect(secondsToDhms(315)).toBe('5 minutes, 15 seconds');
	});
});