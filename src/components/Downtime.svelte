<script lang="typescript">
  import { uptimeSeconds, secondsToDhms } from "./Math.svelte";

  export let uptime: number = 99.9;
  $: daily = secondsToDhms(uptimeSeconds(uptime, 365));
  $: weekly = secondsToDhms(uptimeSeconds(uptime, 52));
  $: monthly = secondsToDhms(uptimeSeconds(uptime, 12));
  $: quarterly = secondsToDhms(uptimeSeconds(uptime, 4));
  $: yearly = secondsToDhms(uptimeSeconds(uptime, 1));
</script>

<div class="flex justify-center">
  <table class="table-auto">
    <div class="table-row">
      <div class="table-cell text-right pr-1 py-0.5">
        <p class="sm:text-2xl">Daily:</p>
      </div>
      <div class="table-cell text-left pl-2 py-0.5">
        <p class="sm:text-2xl">{daily}</p>
      </div>
    </div>
    <div class="table-row">
      <div class="table-cell text-right pr-1 py-0.5">
        <p class="sm:text-2xl">Weekly:</p>
      </div>
      <div class="table-cell text-left pl-2 py-0.5">
        <p class="sm:text-2xl">{weekly}</p>
      </div>
    </div>
    <div class="table-row">
      <div class="table-cell text-right pr-1 py-0.5">
        <p class="sm:text-2xl">Monthly:</p>
      </div>
      <div class="table-cell text-left pl-2 py-0.5">
        <p class="sm:text-2xl">{monthly}</p>
      </div>
    </div>
    <div class="table-row">
      <div class="table-cell text-right pr-1 py-0.5">
        <p class="sm:text-2xl">Quarterly:</p>
      </div>
      <div class="table-cell text-left pl-2 py-0.5">
        <p class="sm:text-2xl">{quarterly}</p>
      </div>
    </div>
    <div class="table-row">
      <div class="table-cell text-right pr-1 py-0.5">
        <p class="sm:text-2xl">Yearly:</p>
      </div>
      <div class="table-cell text-left pl-2 py-0.5">
        <p class="sm:text-2xl">{yearly}</p>
      </div>
    </div>
  </table>
</div>
