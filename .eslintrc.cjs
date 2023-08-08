module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.cjs"],

  env: {
    node: true,
    es2022: true,
    browser: true,
  },

  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    extraFileExtensions: [".svelte"],
  },

  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],

  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },

  rules: {
    "import/first": "off",
    "import/extensions": "off",
    "import/no-duplicates": "off",
    "import/no-unresolved": "off",
    "import/no-mutable-exports": "off",
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["./.eslintrc.js", "./*.config.{js,ts}"] },
    ],
  },
};
