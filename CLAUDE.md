# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **uptime.how**, a simple web calculator that converts uptime percentages (e.g., 99.99%) into allowed downtime durations (e.g., 53 minutes/year). Built with SvelteKit 2, Svelte 5, Tailwind CSS 4, and deployed to Cloudflare Pages.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run lint         # Lint and fix
npm run lint:check   # Lint check only
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run check        # TypeScript/Svelte type checking
```

## Architecture

### Core Logic (`src/lib/Math.svelte`)

Contains the two key functions exported as a module context:

- `uptimeSeconds(percent, divisor)` - Calculates allowed downtime in seconds for a given uptime percentage and time period (365=daily, 52=weekly, 12=monthly, 4=quarterly, 1=yearly)
- `secondsToDhms(seconds)` - Formats seconds into human-readable duration string

### Routing Structure (`src/routes/`)

- **Dynamic route** `[uptime]/+page.ts` - Handles any numeric uptime value (e.g., `/99.95`)
- **Named routes** (`five-nines/`, `four-nines/`, etc.) - SEO-friendly aliases that load preset uptime values
- **`Uptime.svelte`** - Main UI component with input field and downtime display table
- **`+layout.svelte`** - App shell that renders `Uptime.svelte` directly (all routes share the same UI)

### Key Patterns

- Route `+page.ts` files only provide the initial `uptime` value via `PageLoad`
- URL updates happen client-side via `replaceState()` as user types
- Input validation accepts 0-100 range; invalid values fall back to 99.9
