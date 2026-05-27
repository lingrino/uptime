import { downtimeFor, isValidUptime, uptimeFromPath } from "./math.js";

const input = document.querySelector("#uptime-input");
const rows = document.querySelector("#downtime-rows");

function renderDowntime(uptime) {
  rows.replaceChildren(
    ...downtimeFor(Number(uptime)).map(({ name, value }) => {
      const row = document.createElement("div");
      row.className = "downtime-row";

      const label = document.createElement("div");
      label.className = "downtime-label";
      label.textContent = name;

      const duration = document.createElement("div");
      duration.className = "downtime-value";
      duration.textContent = value;

      row.append(label, duration);
      return row;
    }),
  );
}

function updateFromInput() {
  const uptime = Number(input.value);

  if (!isValidUptime(uptime)) {
    input.classList.add("is-invalid");
    return;
  }

  input.classList.remove("is-invalid");
  renderDowntime(input.value);
  window.history.replaceState({}, "", `/${input.value}`);
}

const initialUptime = uptimeFromPath(window.location.pathname);
input.value = initialUptime;
renderDowntime(initialUptime);
input.addEventListener("input", updateFromInput);
