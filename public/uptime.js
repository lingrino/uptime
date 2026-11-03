import { uptimeSeconds, secondsToDhms } from "./math.js";

const defaultUptime = 99.9;

// SEO-friendly aliases that load a preset uptime
export const presets = new Map([
  ["", defaultUptime],
  ["two-nines", 99],
  ["three-nines", 99.9],
  ["four-nines", 99.99],
  ["five-nines", 99.999],
  ["six-nines", 99.9999],
  ["seven-nines", 99.99999],
  ["eight-nines", 99.999999],
  ["nine-nines", 99.9999999],
  ["nine-fives", 55.5555555],
]);

export function isValidUptime(value) {
  return !Number.isNaN(Number(value)) && value >= 0 && value <= 100;
}

// initial uptime for a URL path like "/five-nines" or "/99.95"
// custom values are returned as typed so the input shows them unchanged
export function uptimeFromPath(pathname) {
  const route = pathname.replace(/^\/+|\/+$/g, "");
  if (presets.has(route)) {
    return presets.get(route);
  }

  try {
    const uptime = decodeURIComponent(route);
    return isValidUptime(uptime) ? uptime : defaultUptime;
  } catch {
    return defaultUptime;
  }
}

export function mount() {
  const input = document.querySelector("#uptime");
  const durations = document.querySelectorAll("[data-divisor]");

  function render(uptime) {
    for (const el of durations) {
      el.textContent = secondsToDhms(
        uptimeSeconds(Number(uptime), Number(el.dataset.divisor)),
      );
    }
  }

  input.value = uptimeFromPath(location.pathname);
  render(input.value);

  input.addEventListener("input", () => {
    const valid = isValidUptime(input.value);
    input.classList.toggle("invalid", !valid);
    if (!valid) {
      return;
    }

    render(input.value);
    history.replaceState(history.state, "", `/${input.value}`);
  });
}
