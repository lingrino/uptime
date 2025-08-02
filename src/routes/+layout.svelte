<script lang="ts">
  import "../app.css";
  import Uptime from "./Uptime.svelte";
</script>

<svelte:head>
  <title>Uptime Calculator</title>
  <meta name="description" content="Uptime Calculator" />
</svelte:head>

<div class="main flex flex-col min-h-screen bg-zinc-50">
  <div class="grow">
    <div class="pt-16 pb-12">
      <header>
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl text-zinc-900 font-medium tracking-tight">Uptime Calculator</h1>
        </div>
      </header>
    </div>
    <main class="pb-16">
      <slot />
      <Uptime />
    </main>
  </div>
  <div class="border-t border-zinc-200 bg-white">
    <footer>
      <div class="py-8 text-center text-sm text-zinc-500">
        Made by <a
          href="https://lingrino.com"
          target="_blank"
          rel="noopener"
          class="text-zinc-700 hover:text-zinc-900 transition-colors">Sean Lingren</a
        >&nbsp;•&nbsp;<a
          href="https://github.com/lingrino/uptime"
          target="_blank"
          rel="noopener"
          class="text-zinc-700 hover:text-zinc-900 transition-colors">Source Code</a
        >
      </div>
    </footer>
  </div>
</div>
