import { uptimeSeconds, secondsToDhms } from "./math.js";

const defaultUptime = 99.9;
const site = "https://uptime.how";

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

// plain decimals from 0 to 100, so "", " 50", "0x10" and "1e1" are rejected
export function isValidUptime(value) {
  if (!/^(\d+\.?\d*|\.\d+)$/.test(String(value))) {
    return false;
  }

  const uptime = Number(value);
  return uptime >= 0 && uptime <= 100;
}

function routeFromPath(pathname) {
  return pathname.replace(/^\/+|\/+$/g, "");
}

// uptime for a URL path like "/five-nines" or "/99.95", or undefined if the
// path isn't an uptime. custom values are returned as typed so the input
// shows them unchanged
export function routeUptime(pathname) {
  const route = routeFromPath(pathname);
  if (presets.has(route)) {
    return presets.get(route);
  }

  try {
    const uptime = decodeURIComponent(route);
    return isValidUptime(uptime) ? uptime : undefined;
  } catch {
    return undefined;
  }
}

export function uptimeFromPath(pathname) {
  return routeUptime(pathname) ?? defaultUptime;
}

function downtime(uptime, divisor) {
  return secondsToDhms(uptimeSeconds(Number(uptime), Number(divisor)));
}

// "five-nines" -> "Five Nines"
function aliasName(route) {
  return route.replace(
    /(^|-)(\w)/g,
    (_, dash, c) => (dash && " ") + c.toUpperCase(),
  );
}

// title for a URL path, e.g. "Five Nines (99.999%) - Uptime Calculator"
export function pageTitle(pathname) {
  const route = routeFromPath(pathname);
  const uptime = routeUptime(pathname);
  if (uptime === undefined || route === "") {
    return "Uptime Calculator";
  }

  const name = presets.has(route)
    ? `${aliasName(route)} (${uptime}%)`
    : `${uptime}%`;
  return `${name} - Uptime Calculator`;
}

// fills in index.html for a URL path so each route's HTML has its values,
// title and description before any JS runs. used by functions/[[path]].js on
// Cloudflare and by scripts/dev.js. the uptime is a preset or a plain decimal
// (see isValidUptime), so it is safe to put in the HTML as-is
export function renderPage(html, pathname) {
  const route = routeFromPath(pathname);
  const found = routeUptime(pathname);
  const uptime = found ?? defaultUptime;

  let description = "Uptime Calculator";
  let canonical = `${site}/`;
  if (found !== undefined && route !== "") {
    description = `${uptime}% uptime allows ${downtime(uptime, 1)} of downtime per year.`;
    canonical = `${site}/${presets.has(route) ? route : uptime}`;
  }

  return {
    status: found === undefined ? 404 : 200,
    html: html
      .replace(/<title>[^<]*/, () => `<title>${pageTitle(pathname)}`)
      .replace(
        /(<meta name="description" content=")[^"]*/,
        (_, start) => start + description,
      )
      .replace(
        /(<link rel="canonical" href=")[^"]*/,
        (_, start) => start + canonical,
      )
      .replace(
        /(<input\s+id="uptime"[^>]*?\svalue=")[^"]*/,
        (_, start) => start + uptime,
      )
      .replace(
        /(<dd data-divisor="(\d+)">)[^<]*/g,
        (_, start, divisor) => start + downtime(uptime, divisor),
      ),
  };
}

export function mount() {
  const input = document.querySelector("#uptime");
  const durations = document.querySelectorAll("[data-divisor]");

  function render(uptime) {
    for (const el of durations) {
      el.textContent = downtime(uptime, el.dataset.divisor);
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
    document.title = pageTitle(`/${input.value}`);
  });
}
