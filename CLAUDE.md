# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **uptime.how**, a simple web calculator that converts uptime percentages (e.g., 99.99%) into allowed downtime durations (e.g., 53 minutes/year). It is a dependency-free static site built with plain HTML, CSS, and JavaScript, then deployed to Cloudflare Pages.

## Commands

```bash
npm run dev          # Start local static development server
npm run build        # Copy static site into dist/
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode using node --watch
npm run lint         # Run lint check
npm run lint:check   # Lint check only
npm run format       # Remove trailing whitespace and ensure final newlines
npm run format:check # Check formatting
npm run check        # Run lint and tests
```

## Architecture

### Core Logic (`src/math.js`)

Contains the key calculator helpers:

- `uptimeSeconds(percent, divisor)` - Calculates allowed downtime in seconds for a given uptime percentage and time period (365=daily, 52=weekly, 12=monthly, 4=quarterly, 1=yearly)
- `secondsToDhms(seconds)` - Formats seconds into human-readable duration string
- `downtimeFor(percent)` - Returns formatted daily/weekly/monthly/quarterly/yearly rows
- `uptimeFromPath(pathname)` - Resolves named aliases and numeric URL paths to an initial uptime value

### Static Site Structure

- **`index.html`** - App shell and calculator markup
- **`src/app.js`** - Browser controller that updates the table and URL as the user types
- **`src/styles.css`** - Hand-written styles
- **`scripts/build.js`** - Copies `index.html`, `src/`, and `static/` into `dist/`, plus a Cloudflare Pages `_redirects` fallback so routes like `/99.95` and `/five-nines` serve the app

### Key Patterns

- Named routes are resolved client-side in `uptimeFromPath()`
- URL updates happen client-side via `history.replaceState()` as user types
- Input validation accepts 0-100 range; invalid values fall back to 99.9
