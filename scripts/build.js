// Static site — nothing to compile. Verify required files exist.
import { access } from "node:fs/promises";
import { constants } from "node:fs";

const required = [
  "public/index.html",
  "public/js/math.js",
  "public/js/app.js",
  "public/css/styles.css",
];

for (const file of required) {
  await access(file, constants.R_OK);
}

console.log("Build OK: static site ready in public/");
