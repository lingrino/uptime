<script lang="typescript">
  import "./TailwindStyles.svelte";

  let uptime: number = 99.9;
  $: daily = secondsToDhms(uptimeSeconds(uptime, 365));
  $: weekly = secondsToDhms(uptimeSeconds(uptime, 52));
  $: monthly = secondsToDhms(uptimeSeconds(uptime, 12));
  $: quarterly = secondsToDhms(uptimeSeconds(uptime, 4));
  $: yearly = secondsToDhms(uptimeSeconds(uptime, 1));

  function uptimeSeconds(uptime: number, divisor: number): number {
    const yearSeconds: number = 31556952;
    return Math.floor((yearSeconds / divisor) * (1 - uptime / 100));
  }

  // https://tc39.es/proposal-temporal/docs/duration.html#toLocaleString
  function secondsToDhms(seconds: number): string {
    var d = Math.floor(seconds / 86400);
    var h = Math.floor((seconds / 3600) % 24);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor((seconds % 3600) % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    return dDisplay + hDisplay + mDisplay + sDisplay;
  }
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
