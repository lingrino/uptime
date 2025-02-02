<script lang="ts">
  import { page } from "$app/state";
  import { replaceState } from "$app/navigation";
  import { browser } from "$app/environment";
  import { uptimeSeconds, secondsToDhms } from "$lib/Math.svelte";

  let { uptime } = page.data;
  let borderstyle = "focus:ring-2 focus:ring-green-900 focus:border-green-900";
  let downtime = [
    { name: "Daily", value: secondsToDhms(uptimeSeconds(uptime, 365)) },
    { name: "Weekly", value: secondsToDhms(uptimeSeconds(uptime, 52)) },
    { name: "Monthly", value: secondsToDhms(uptimeSeconds(uptime, 12)) },
    { name: "Quarterly", value: secondsToDhms(uptimeSeconds(uptime, 4)) },
    { name: "Yearly", value: secondsToDhms(uptimeSeconds(uptime, 1)) },
  ];

  function handleInput() {
    if (Number.isNaN(+uptime) || uptime < 0 || uptime > 100) {
      borderstyle = "focus:ring-2 focus:ring-red-500 focus:border-red-500";
      return;
    }

    borderstyle = "focus:ring-2 focus:ring-green-900 focus:border-green-900";
    downtime = [
      { name: "Daily", value: secondsToDhms(uptimeSeconds(uptime, 365)) },
      { name: "Weekly", value: secondsToDhms(uptimeSeconds(uptime, 52)) },
      { name: "Monthly", value: secondsToDhms(uptimeSeconds(uptime, 12)) },
      { name: "Quarterly", value: secondsToDhms(uptimeSeconds(uptime, 4)) },
      { name: "Yearly", value: secondsToDhms(uptimeSeconds(uptime, 1)) },
    ];

    if (browser) {
      replaceState(new URL(`${window.location.origin}/${uptime}`), {});
    }
  }
</script>

<div class="mx-4 mb-10">
  <div class="flex justify-center">
    <div class="relative rounded-lg w-full max-w-md shadow-md">
      <input
        type="text"
        class="py-3 pr-10 text-xl w-full rounded-lg {borderstyle}"
        aria-label="uptime percentage"
        bind:value={uptime}
        on:input={handleInput}
      />
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <span class="text-gray-700 text-xl"> % </span>
      </div>
    </div>
  </div>
</div>
<div class="flex justify-center">
  <div>
    <table class="table-auto">
      <tbody>
        {#each downtime as { name, value }}
          <tr class="table-row">
            <td class="table-cell text-right pr-1 py-0.5">
              <p class="sm:text-2xl">{name}:</p>
            </td>
            <td class="table-cell text-left pl-2 py-0.5">
              <p class="sm:text-2xl">{value}</p>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
