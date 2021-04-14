<script>
  export let daily: string = "0 seconds";
  export let weekly: string = "0 seconds";
  export let monthly: string = "0 seconds";
  export let quarterly: string = "0 seconds";
  export let yearly: string = "0 seconds";
</script>

<div class="flex justify-center">
  <div class="grid grid-cols-3 gap-x-5 gap-y-2">
    <div class="text-right">
      <p class="text-2xl">Daily:</p>
    </div>
    <div class="col-span-2 text-left">
      <p class="text-2xl">{daily}</p>
    </div>
    <div class="text-right">
      <p class="text-2xl">Weekly:</p>
    </div>
    <div class="col-span-2 text-left">
      <p class="text-2xl">{weekly}</p>
    </div>
    <div class="text-right">
      <p class="text-2xl">Monthly:</p>
    </div>
    <div class="col-span-2 text-left">
      <p class="text-2xl">{monthly}</p>
    </div>
    <div class="text-right">
      <p class="text-2xl">Quarterly:</p>
    </div>
    <div class="col-span-2 text-left">
      <p class="text-2xl">{quarterly}</p>
    </div>
    <div class="text-right">
      <p class="text-2xl">Yearly:</p>
    </div>
    <div class="col-span-2 text-left">
      <p class="text-2xl">{yearly}</p>
    </div>
  </div>
</div>
