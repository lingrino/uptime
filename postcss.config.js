const postcssimport = require("postcss-import");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [postcssimport, tailwindcss, autoprefixer],
};
