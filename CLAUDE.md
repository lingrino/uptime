# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **uptime.how**, a simple web calculator that converts uptime percentages (e.g., 99.99%) into allowed downtime durations (e.g., 53 minutes/year). Built with plain HTML, CSS, and JavaScript with no dependencies and no build step, and deployed to Cloudflare Pages.

## Commands

```bash
npm run dev          # Serve public/ at http://localhost:5173
npm run test         # Run tests once (node --test)
npm run test:watch   # Run tests in watch mode
npm run lint         # Syntax check all JS with node --check
npm run format       # Format with Prettier (pinned, fetched via npx)
npm run format:check # Check formatting
```

Do not add npm dependencies. The point of this project's setup is that there is nothing to install or upgrade.

## Architecture

Cloudflare Pages has no build command and uses `public` as the output directory, so `public/` is deployed as-is. Static files are served directly. Every other path goes to the Pages Function in `functions/[[path]].js`, which renders `index.html` with that route's values filled in (200) or the default page (404) for paths that aren't an uptime. `public/_routes.json` lists the static files the function skips, including `/`, since `index.html` is already the rendered root page. `scripts/dev.js` does the same locally with the same code.

### Core Logic (`public/math.js`)

- `uptimeSeconds(percent, divisor)` - Calculates allowed downtime in seconds for a given uptime percentage and time period (365=daily, 52=weekly, 12=monthly, 4=quarterly, 1=yearly)
- `secondsToDhms(seconds)` - Formats seconds into human-readable duration string

### App (`public/uptime.js`, `public/index.html`)

- `presets` - SEO-friendly named routes (`/five-nines`, `/four-nines`, etc.) and the uptime they load
- `isValidUptime(value)` - Accepts plain decimals from 0 to 100 (not `""`, whitespace, `0x10` or `1e1`)
- `routeUptime(pathname)` - Uptime for a URL path, or `undefined` if the path isn't one; custom values are returned as typed
- `uptimeFromPath(pathname)` - `routeUptime` falling back to 99.9
- `pageTitle(pathname)` - Per-route `<title>`, e.g. `Five Nines (99.999%) - Uptime Calculator`
- `renderPage(html, pathname)` - Fills `index.html` with a route's value, durations, title, description and canonical URL; returns `{ status, html }`. Used by the Pages Function and the dev server
- `mount()` - Wires up the page in the browser. Called from an inline module script in `index.html`
- `index.html` is both the template and the rendered root page: a test checks that `renderPage(index.html, "/")` returns it unchanged. It also has a `<noscript>` fallback table for visitors without JavaScript
- `public/_headers` sets response headers for static files. The function sets its own, and HSTS comes from the Cloudflare zone

### Key Patterns

- URL and title update client-side via `history.replaceState()` as the user types
- Invalid input turns the focus ring red and leaves the table and URL unchanged
- Use absolute asset paths (`/app.css`, `/uptime.js`) since the page is served at arbitrary paths
- When adding a file to `public/`, add it to `public/_routes.json` (a test fails otherwise)
