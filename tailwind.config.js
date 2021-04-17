const forms = require("@tailwindcss/forms");

module.exports = {
  // mode: "jit", Enable after https://github.com/tailwindlabs/tailwindcss/issues/3950
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,svelte}"],
  plugins: [forms],
};
