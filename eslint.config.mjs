import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import parser from "svelte-eslint-parser";
import js from "@eslint/js";
import sveltePlugin from "eslint-plugin-svelte";

export default [
  {
    ignores: [
      "**/*.cjs",
      "**/.DS_Store",
      "**/node_modules",
      "build",
      ".svelte-kit",
      "package",
      "**/.env",
      "**/.env.*",
      "!**/.env.example",
      "**/package-lock.json",
      "**/yarn.lock",
    ],
  },
  js.configs.recommended,
  ...sveltePlugin.configs["flat/recommended"],
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: "module",

      parserOptions: {
        extraFileExtensions: [".svelte"],
      },
    },

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
    },
  },
  {
    files: ["**/*.svelte"],

    languageOptions: {
      parser: parser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  },
];
