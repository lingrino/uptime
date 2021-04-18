<script lang="typescript">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ update: number }>();

  export let uptime: number = 99.9;

  let bordercolor: string = "green-900";
  function handleInput() {
    if (Number.isNaN(+uptime) || uptime < 0 || uptime > 100) {
      bordercolor = "red-500";
      return;
    }

    bordercolor = "green-900";
    dispatch("update", uptime);
  }
</script>

<div class="flex justify-center mb-10">
  <div class="relative rounded-lg mx-4 w-full max-w-md shadow-md">
    <input
      type="text"
      class="py-3 pr-10 text-xl w-full focus:ring-{bordercolor} focus:border-{bordercolor} rounded-lg"
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
