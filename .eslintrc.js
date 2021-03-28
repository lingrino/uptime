const typescript = require("typescript");

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["svelte3", "@typescript-eslint"],
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  settings: {
    "svelte3/typescript": typescript,
  },
  rules: {
    "import/first": "off",
    "import/no-duplicates": "off",
    "import/no-mutable-exports": "off",
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["./.eslintrc.js", "./*.config.js"] },
    ],
  },
};
