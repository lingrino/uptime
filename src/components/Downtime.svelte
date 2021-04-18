<script lang="typescript">
  import { uptimeSeconds, secondsToDhms } from "./Math.svelte";

  export let uptime: number = 99.9;
  $: downtime = [
    { name: 'Daily', value: secondsToDhms(uptimeSeconds(uptime, 365)) },
    { name: 'Weekly', value: secondsToDhms(uptimeSeconds(uptime, 52)) },
    { name: 'Monthly', value: secondsToDhms(uptimeSeconds(uptime, 12)) },
    { name: 'Quarterly', value: secondsToDhms(uptimeSeconds(uptime, 4)) },
    { name: 'Yearly', value: secondsToDhms(uptimeSeconds(uptime, 1)) },
  ];
</script>

<div class="flex justify-center">
  <table class="table-auto">
    {#each downtime as { name, value }}
      <div class="table-row">
        <div class="table-cell text-right pr-1 py-0.5">
          <p class="sm:text-2xl">{name}:</p>
        </div>
        <div class="table-cell text-left pl-2 py-0.5">
          <p class="sm:text-2xl">{value}</p>
        </div>
      </div>
    {/each}
  </table>
</div>
