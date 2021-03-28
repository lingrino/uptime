const sveltepreprocess = require("svelte-preprocess");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  preprocess: sveltepreprocess({
    defaults: {
      script: "typescript",
    },
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  }),
};
