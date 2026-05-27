// Allowed downtime in seconds given a percent and portion of the year
export function uptimeSeconds(uptimePercent, divisor) {
  const yearSeconds = 31557600;

  const periodSeconds = {
    365: 86400,
    52: 604800,
    12: 2629800,
    4: 7889400,
    1: 31557600,
  };

  const periodDuration = periodSeconds[divisor] ?? yearSeconds / divisor;
  return Math.round(periodDuration * (1 - uptimePercent / 100));
}

export function secondsToDhms(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds / 3600) % 24);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  const sDisplay = s >= 0 ? s + (s === 1 ? " second" : " seconds") : "";

  return dDisplay + hDisplay + mDisplay + sDisplay;
}
