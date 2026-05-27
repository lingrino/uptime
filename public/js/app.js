import { uptimeSeconds, secondsToDhms } from "./math.js";

const ROUTE_PRESETS = {
  "two-nines": 99,
  "three-nines": 99.9,
  "four-nines": 99.99,
  "five-nines": 99.999,
  "six-nines": 99.9999,
  "seven-nines": 99.99999,
  "eight-nines": 99.999999,
  "nine-nines": 99.9999999,
  "nine-fives": 55.5555555,
};

function parseUptimeFromPath(pathname) {
  const path = pathname.replace(/^\/+|\/+$/g, "");
  if (!path) return 99.9;
  if (path in ROUTE_PRESETS) return ROUTE_PRESETS[path];
  const value = Number(path);
  if (!Number.isNaN(value) && value >= 0 && value <= 100) return value;
  return 99.9;
}

function isValidUptime(value) {
  return !Number.isNaN(value) && value >= 0 && value <= 100;
}

function buildDowntimeRows(uptime) {
  return [
    { name: "Daily", value: secondsToDhms(uptimeSeconds(uptime, 365)) },
    { name: "Weekly", value: secondsToDhms(uptimeSeconds(uptime, 52)) },
    { name: "Monthly", value: secondsToDhms(uptimeSeconds(uptime, 12)) },
    { name: "Quarterly", value: secondsToDhms(uptimeSeconds(uptime, 4)) },
    { name: "Yearly", value: secondsToDhms(uptimeSeconds(uptime, 1)) },
  ];
}

function renderDowntime(container, rows) {
  container.innerHTML = rows
    .map(
      ({ name, value }) => `
    <div class="downtime-row">
      <div class="downtime-label">${name}</div>
      <div class="downtime-value">${value}</div>
    </div>`,
    )
    .join("");
}

function init() {
  const input = document.getElementById("uptime-input");
  const list = document.getElementById("downtime-list");
  if (!input || !list) return;

  let uptime = parseUptimeFromPath(window.location.pathname);
  input.value = String(uptime);
  renderDowntime(list, buildDowntimeRows(uptime));

  input.addEventListener("input", () => {
    uptime = Number(input.value);
    if (!isValidUptime(uptime)) {
      input.classList.add("input-invalid");
      input.classList.remove("input-valid");
      return;
    }

    input.classList.remove("input-invalid");
    input.classList.add("input-valid");
    renderDowntime(list, buildDowntimeRows(uptime));
    const path = `/${input.value}`;
    if (window.location.pathname !== path) {
      window.history.replaceState(null, "", path);
    }
  });
}

init();
