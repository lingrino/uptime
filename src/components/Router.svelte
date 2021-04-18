<script lang="typescript" context="module">
  const vanityPaths = new Map<string, number>([
    ['/nine-fives', 55.5555555],
    ['/three-nines', 99.9],
    ['/four-nines', 99.99],
    ['/five-nines', 99.999],
    ['/six-nines', 99.9999],
    ['/seven-nines', 99.99999],
    ['/eight-nines', 99.999999],
    ['/nine-nines', 99.9999999],
  ]);

  // get a number from the provided path or return default on failure
  export function pathNumber(def: number): number {
    const path = window.location.pathname;
    if (path === "/") {
      return def;
    }

    if (vanityPaths.has(path)) {
      return vanityPaths.get(path) as number
    }

    const pn = Number(path.replace(/^\/+/g, ""));
    if (!Number.isNaN(pn) && pn >= 0 && pn <= 100) {
      return pn;
    }

    return def;
  }
</script>
