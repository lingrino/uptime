<script lang="ts">
  import "../app.css";
  import Uptime from "./Uptime.svelte";
</script>

<svelte:head>
  <title>Uptime Calculator</title>
  <meta name="description" content="Uptime Calculator" />
</svelte:head>

<div class="flex flex-col min-h-screen bg-gray-100">
  <div class="flex-grow">
    <div class="my-10 sm:mb-14 lg:mb-20">
      <header>
        <div class="text-center">
          <p class="text-6xl sm:text-9xl text-green-900">Uptime Calculator</p>
        </div>
      </header>
    </div>
    <main>
      <slot />
      <Uptime />
    </main>
  </div>
  <div class="mx-4 mt-10">
    <footer>
      <div class="py-4 text-center text-lg">
        Made by <a
          href="https://lingrino.com"
          target="_blank"
          rel="noopener"
          class="text-blue-600">Sean Lingren</a
        >&nbsp;&nbsp;•&nbsp;&nbsp;<a
          href="https://github.com/lingrino/uptime"
          target="_blank"
          rel="noopener"
          class="text-blue-600">Source Code</a
        >
      </div>
    </footer>
  </div>
</div>
