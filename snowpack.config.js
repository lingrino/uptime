// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  plugins: [
    "@snowpack/plugin-svelte",
    "@snowpack/plugin-dotenv",
    [
      "@snowpack/plugin-build-script",
      { cmd: "postcss", input: [".css"], output: [".css"] },
    ],
    "@snowpack/plugin-typescript",
  ],
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    target: "es2020",
  },
  packageOptions: {
    installTypes: true,
    polyfillNode: true,
  },
  devOptions: {
    port: 5000,
  },
  buildOptions: {
    clean: true,
  },
};
