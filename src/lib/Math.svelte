<script lang="ts" context="module">
  // allowed uptime in seconds given a percent and portion of the year
  export function uptimeSeconds(
    uptimePercent: number,
    divisor: number,
  ): number {
    const yearSeconds = 31557600;
    return Math.floor((yearSeconds / divisor) * (1 - uptimePercent / 100));
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
