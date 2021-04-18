<script lang="typescript">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ update: number }>();

  export let uptime: number = 99.9;

  let borderstyle: string = "focus:ring-green-900 focus:border-green-900";
  function handleInput() {
    if (Number.isNaN(+uptime) || uptime < 0 || uptime > 100) {
      borderstyle = "focus:ring-red-500 focus:border-red-500";
      return;
    }

    borderstyle = "focus:ring-green-900 focus:border-green-900";
    dispatch("update", uptime);
  }
</script>

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
