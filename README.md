# Uptime

A simple site useful for calculating how expected uptime (eg: `99.99%`) translates to allowed downtime in a period (eg: `53 minutes/year`).

This site is plain HTML, CSS, and JavaScript with no dependencies and no build step. The `public/` directory is deployed as-is to [Cloudflare Pages](https://pages.cloudflare.com/), which serves `index.html` for any path that isn't a file so routes like `/99.95` and `/five-nines` work.

## Contributing

Contributions are welcome! This site should remain simple and so anything that reduces complexity is most appreciated. Please open an issue if you have a question or you are unsure about an idea.

I would like to add an API to this site. If the user appends `.json` to any url or `/api` before any query then the app should return json that represents the daily/weekly/etc... duration in seconds. That can be challenging with a static site but either a build-time script that generates json for every possible input (cloudflare limits to 20k files) or a cloudflare worker that generates responses dynamically would work.

## Development

All you need is a recent version of [Node.js](https://nodejs.org/). There is nothing to install.

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

Formatting uses a pinned version of [Prettier](https://prettier.io/) through `npx`, so it is fetched on demand rather than installed.
