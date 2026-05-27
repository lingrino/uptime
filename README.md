# Uptime

A simple site useful for calculating how expected uptime (eg: `99.99%`) translates to allowed downtime in a period (eg: `53 minutes/year`).

Plain HTML, CSS, and JavaScript — no build step or npm packages. Deployed on [Cloudflare Pages](https://pages.cloudflare.com/).

## Contributing

Contributions are welcome! This site should remain simple and so anything that reduces complexity is most appreciated. Please open an issue if you have a question or you are unsure about an idea.

## Development

### Start dev server

```shell
npm run dev
```

### Run tests

```shell
npm test
```

### Build (verify static assets)

```shell
npm run build
```

The `public/` directory is deployed as-is to Cloudflare Pages.
