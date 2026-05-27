# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**uptime.how** converts uptime percentages (e.g., 99.99%) into allowed downtime durations (e.g., 53 minutes/year). It is a static site in plain JavaScript with no npm dependencies, deployed to Cloudflare Pages.

## Commands

```bash
npm run dev    # Local static server (public/) on port 5173
npm run build  # Verify static assets exist
npm test       # Node built-in test runner
```

## Architecture

### Core logic (`public/js/math.js`)

- `uptimeSeconds(percent, divisor)` — downtime in seconds for a uptime % and period (365=daily, 52=weekly, 12=monthly, 4=quarterly, 1=yearly)
- `secondsToDhms(seconds)` — human-readable duration string

### UI (`public/js/app.js`)

- Reads initial uptime from the URL path or named presets (`five-nines`, `four-nines`, etc.)
- Updates the downtime table on input and syncs the URL with `history.replaceState`
- Invalid input (outside 0–100) shows a red focus ring without updating values

### Static hosting

- Site root: `public/`
- `public/_redirects` — SPA fallback so paths like `/99.99` and `/five-nines` serve `index.html`
- Tests live in `test/` and import from `public/js/math.js`
