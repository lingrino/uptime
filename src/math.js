const YEAR_SECONDS = 31_557_600;

const PERIOD_SECONDS = {
  365: 86_400,
  52: 604_800,
  12: 2_629_800,
  4: 7_889_400,
  1: YEAR_SECONDS,
};

export function uptimeSeconds(uptimePercent, divisor) {
  const periodDuration = PERIOD_SECONDS[divisor] ?? YEAR_SECONDS / divisor;
  return Math.round(periodDuration * (1 - uptimePercent / 100));
}

export function secondsToDhms(seconds) {
  const d = Math.floor(seconds / 86_400);
  const h = Math.floor((seconds / 3_600) % 24);
  const m = Math.floor((seconds % 3_600) / 60);
  const s = Math.floor((seconds % 3_600) % 60);

  const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  const sDisplay = s >= 0 ? s + (s === 1 ? " second" : " seconds") : "";

  return dDisplay + hDisplay + mDisplay + sDisplay;
}

export function isValidUptime(value) {
  return !Number.isNaN(value) && value >= 0 && value <= 100;
}

export function downtimeFor(uptimePercent) {
  return [
    { name: "Daily", value: secondsToDhms(uptimeSeconds(uptimePercent, 365)) },
    { name: "Weekly", value: secondsToDhms(uptimeSeconds(uptimePercent, 52)) },
    { name: "Monthly", value: secondsToDhms(uptimeSeconds(uptimePercent, 12)) },
    { name: "Quarterly", value: secondsToDhms(uptimeSeconds(uptimePercent, 4)) },
    { name: "Yearly", value: secondsToDhms(uptimeSeconds(uptimePercent, 1)) },
  ];
}

export const routeUptimes = {
  "/": 99.9,
  "/two-nines": 99,
  "/three-nines": 99.9,
  "/four-nines": 99.99,
  "/five-nines": 99.999,
  "/six-nines": 99.9999,
  "/seven-nines": 99.99999,
  "/eight-nines": 99.999999,
  "/nine-nines": 99.9999999,
  "/nine-fives": 55.5555555,
};

export function uptimeFromPath(pathname) {
  const route = pathname === "/" ? pathname : pathname.replace(/\/+$/u, "");

  if (routeUptimes[route] !== undefined) {
    return routeUptimes[route];
  }

  const routeValue = route.replace(/^\/+/g, "");
  const uptime = Number(routeValue);
  return isValidUptime(uptime) ? routeValue : 99.9;
}
