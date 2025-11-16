<script lang="ts" context="module">
  // allowed uptime in seconds given a percent and portion of the year
  export function uptimeSeconds(
    uptimePercent: number,
    divisor: number,
  ): number {
    // Use exact period durations to avoid rounding issues
    // Year constant: 365.25 days = 31557600 seconds (accounts for leap years)
    const yearSeconds = 31557600;

    // Define exact period durations in seconds
    const periodSeconds: Record<number, number> = {
      365: 86400, // Daily: exactly 24 hours
      52: 604800, // Weekly: exactly 7 days
      12: 2629800, // Monthly: average month (31557600 / 12)
      4: 7889400, // Quarterly: average quarter (31557600 / 4)
      1: 31557600, // Yearly: 365.25 days
    };

    // Use exact duration if available, otherwise fall back to division
    const periodDuration = periodSeconds[divisor] ?? yearSeconds / divisor;
    return Math.floor(periodDuration * (1 - uptimePercent / 100));
  }

  // friendly format seconds
  // can be simplified once browsers support duration.toLocaleString
  // https://tc39.es/proposal-temporal/docs/duration.html#toLocaleString
  export function secondsToDhms(seconds: number): string {
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
</script>
