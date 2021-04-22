// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  routes: [{ match: "routes", src: ".*", dest: "/index.html" }],
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
    manifest: true,
    minify: true,
    splitting: true,
    target: "es2020",
    treeshake: true,
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
