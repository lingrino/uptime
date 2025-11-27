<script lang="ts">
import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { secondsToDhms, uptimeSeconds } from "$lib/Math.svelte";

const { uptime } = page.data;
let borderstyle = "focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400";
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

  borderstyle = "focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400";
  downtime = [
    { name: "Daily", value: secondsToDhms(uptimeSeconds(uptime, 365)) },
    { name: "Weekly", value: secondsToDhms(uptimeSeconds(uptime, 52)) },
    { name: "Monthly", value: secondsToDhms(uptimeSeconds(uptime, 12)) },
    { name: "Quarterly", value: secondsToDhms(uptimeSeconds(uptime, 4)) },
    { name: "Yearly", value: secondsToDhms(uptimeSeconds(uptime, 1)) },
  ];

  if (browser) {
    replaceState(resolve(`/${uptime}`), {});
  }
}
</script>

<div class="max-w-2xl mx-auto px-4">
  <div class="mb-12">
    <div class="flex justify-center">
      <div class="relative w-full max-w-xs">
        <input
          type="text"
          class="w-full py-4 pr-12 text-2xl text-center bg-white border border-zinc-300 rounded-lg shadow-sm {borderstyle} placeholder-zinc-400"
          placeholder="99.9"
          aria-label="uptime percentage"
          bind:value={uptime}
          on:input={handleInput}
        />
        <div
          class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
        >
          <span class="text-zinc-500 text-2xl">%</span>
        </div>
      </div>
    </div>
  </div>

  <div
    class="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden"
  >
    <div class="divide-y divide-zinc-100">
      {#each downtime as { name, value } (name)}
        <div class="flex justify-between items-center px-6 py-4">
          <div
            class="text-zinc-500 text-sm font-medium uppercase tracking-wide"
          >
            {name}
          </div>
          <div class="text-zinc-900 font-mono text-lg">{value}</div>
        </div>
      {/each}
    </div>
  </div>
</div>
