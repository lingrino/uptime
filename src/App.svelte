<script lang="typescript">
  import "./TailwindStyles.svelte";

  let uptime: number = 99.9;

  function uptimeSeconds(uptimePercent: number, divisor: number): number {
    const yearSeconds: number = 31556952;
    return Math.floor((yearSeconds / divisor) * (1 - uptimePercent / 100));
  }

  // https://tc39.es/proposal-temporal/docs/duration.html#toLocaleString
  function secondsToDhms(seconds: number): string {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds / 3600) % 24);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";

    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  $: daily = secondsToDhms(uptimeSeconds(uptime, 365));
  $: weekly = secondsToDhms(uptimeSeconds(uptime, 52));
  $: monthly = secondsToDhms(uptimeSeconds(uptime, 12));
  $: quarterly = secondsToDhms(uptimeSeconds(uptime, 4));
  $: yearly = secondsToDhms(uptimeSeconds(uptime, 1));
</script>

<div class="text-center w-full h-screen p-10">
  <div class="pb-20">
    <p class="text-9xl">Uptime Calculator</p>
  </div>

  <input class="" type="number" min="0" max="100" bind:value={uptime} />

  <div class="flex justify-center">
    <div class="grid grid-cols-3 gap-x-5 gap-y-2 bg-red-500">
      <div class="text-right">
        <p class="text-2xl">Daily:</p>
      </div>
      <div class="col-span-2 text-left">
        <p class="text-2xl">{daily}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl">Weekly:</p>
      </div>
      <div class="col-span-2 text-left">
        <p class="text-2xl">{weekly}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl">Monthly:</p>
      </div>
      <div class="col-span-2 text-left">
        <p class="text-2xl">{monthly}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl">Quarterly:</p>
      </div>
      <div class="col-span-2 text-left">
        <p class="text-2xl">{quarterly}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl">Yearly:</p>
      </div>
      <div class="col-span-2 text-left">
        <p class="text-2xl">{yearly}</p>
      </div>
    </div>
  </div>
</div>
