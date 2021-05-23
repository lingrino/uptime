const forms = require("@tailwindcss/forms");

module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,svelte}"],
  plugins: [forms],
};
