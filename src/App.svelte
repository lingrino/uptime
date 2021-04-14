<script lang="typescript">
  import "./Styles.svelte";

  import Title from "./components/meta/Title.svelte";
  // import Footer from "./components/meta/Footer.svelte";
  import Downtime from "./components/layout/Downtime.svelte";
  import { uptimeSeconds, secondsToDhms } from "./components/math/Math.svelte";

  let uptime: number = 99.9;
  $: daily = secondsToDhms(uptimeSeconds(uptime, 365));
  $: weekly = secondsToDhms(uptimeSeconds(uptime, 52));
  $: monthly = secondsToDhms(uptimeSeconds(uptime, 12));
  $: quarterly = secondsToDhms(uptimeSeconds(uptime, 4));
  $: yearly = secondsToDhms(uptimeSeconds(uptime, 1));
</script>

<div class="w-full h-screen p-10 bg-gray-100">
  <Title />

  <div class="flex justify-center mb-10">
    <div class="relative rounded-lg shadow-md">
      <input
        class="py-3 pr-10 text-xl border-gray-600 focus:ring-green-900 focus:border-green-900 rounded-lg"
        type="text"
        id="uptime"
        name="uptime"
        min="0"
        max="100"
        bind:value={uptime}
      />
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <span class="text-gray-700 text-xl"> % </span>
      </div>
    </div>
  </div>

  <Downtime {daily} {weekly} {monthly} {quarterly} {yearly} />

  <!-- <Footer /> -->
</div>
