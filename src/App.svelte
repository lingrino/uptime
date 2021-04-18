<script lang="typescript">
  import "./Styles.svelte";
  import Title from "./components/Title.svelte";
  import Input from "./components/Input.svelte";
  import Downtime from "./components/Downtime.svelte";
  import Footer from "./components/Footer.svelte";
  import { pathNumber } from "./components/Math.svelte";

  let uptime = pathNumber(99.9);
</script>

<div class="flex flex-col min-h-screen bg-gray-100">
  <div class="flex-grow">
    <div class="my-10 sm:mb-14 lg:mb-20"><Title /></div>
    <main>
      <div class="mx-4 mb-10">
        <Input
          {uptime}
          on:update={(event) => {
            uptime = event.detail;
          }}
        />
      </div>
      <Downtime {uptime} />
    </main>
  </div>
  <div class="mx-4 mt-10"><Footer /></div>
</div>
