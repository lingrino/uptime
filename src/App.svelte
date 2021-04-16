<script lang="typescript">
  import "./Styles.svelte";

  import Title from "./components/Title.svelte";
  import Input from "./components/Input.svelte";
  import Downtime from "./components/Downtime.svelte";
  // import Footer from "./components/Footer.svelte";

  let uptime: number = 99.9;
</script>

<div class="w-full h-screen bg-gray-100">
  <Title />
  <Input
    {uptime}
    on:update={(event) => {
      uptime = event.detail;
    }}
  />
  <Downtime {uptime} />
  <!-- <Footer /> -->
</div>
