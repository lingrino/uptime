# Uptime

A simple site useful for calculating how expected uptime (eg: `99.99%`) translates to allowed downtime in a period (eg: `53 minutes/year`).

This site is built with the following technologies. I chose them because they're new and I wanted to try them out.

- [Svelte](https://svelte.dev)
- [Tailwind](https://tailwindcss.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## Contributing

Contributions are welcome! This site should remain simple and so anything that reduces complexity is most appreciated. Please open an issue if you have a question or you are unsure about an idea.

I would like to add an API to this site. If the user appends `.json` to any url or `/api` before any query then the app should return json that represents the daily/weekly/etc... duration in seconds. That can be challenging with a static site but either a build-time script that generates json for every possible input (cloudflare limits to 20k files) or a cloudflare worker that generates responses dynamically would work.

## Development

### Start Dev Server

```shell
npm run dev
```

### Run Tests

```shell
npm run test
```

### Run Linting

```shell
npm run lint
```

### Run Formatting

```shell
npm run format
```
