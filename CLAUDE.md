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

`public/` is the deployed site, served as-is. Cloudflare Pages has no build command and uses `public` as the output directory. Because there is no top-level `404.html`, Pages serves `index.html` for any path that isn't a file, which is how `/99.95` and `/five-nines` reach the app. `scripts/dev.js` mimics this locally.

### Core Logic (`public/math.js`)

- `uptimeSeconds(percent, divisor)` - Calculates allowed downtime in seconds for a given uptime percentage and time period (365=daily, 52=weekly, 12=monthly, 4=quarterly, 1=yearly)
- `secondsToDhms(seconds)` - Formats seconds into human-readable duration string

### App (`public/uptime.js`, `public/index.html`)

- `presets` - SEO-friendly named routes (`/five-nines`, `/four-nines`, etc.) and the uptime they load
- `uptimeFromPath(pathname)` - Initial uptime for a URL path; custom values are returned as typed, invalid values fall back to 99.9
- `isValidUptime(value)` - Accepts 0-100
- `mount()` - Wires up the page. Called from an inline module script in `index.html`
- `index.html` holds the markup, including one row per period with a `data-divisor` that `mount()` fills in, and a `<noscript>` fallback table for visitors without JavaScript

### Key Patterns

- URL updates happen client-side via `history.replaceState()` as the user types
- Invalid input turns the focus ring red and leaves the table and URL unchanged
- Use absolute asset paths (`/app.css`, `/uptime.js`) since the page is served at arbitrary paths
