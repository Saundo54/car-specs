# Interactive CarSales Scraper

This script scrapes CarSales `research` pages for vehicle specifications from 2018 through 2026 and writes results to `app/public/data/vehicles.json`.

Key features:
- Resumes progress if interrupted via `scripts/carsales_progress.json`.
- Detects blocking (403/429 or CloudFront responses) and pauses; you can change IP/proxy and press ENTER to continue.
- Saves partial results frequently.

Requirements
- Node 18+ (for native fetch/modern async behavior)
- The project already uses these packages; if not installed, run:

```bash
npm install axios fs-extra p-limit
# optional: npx ts-node for running TypeScript directly
npm install -D ts-node typescript @types/node
```

Run (TypeScript)

```bash
npx ts-node scripts/interactive-carsales-scraper.ts
```

Or compile and run with Node

```bash
./node_modules/.bin/tsc scripts/interactive-carsales-scraper.ts --esModuleInterop --module commonjs --outDir dist
node dist/interactive-carsales-scraper.js
```

Behavior notes
- The script targets the CarSales research pages and attempts to use the site's internal API endpoint when available. The scraping logic mirrors the other `scripts/*.ts` scrapers in this repo.
- CarSales uses anti-DDoS protections. Expect blocks after several hundred requests; when blocked the script will save its state and wait for you to change IP/proxy and press ENTER.
- The script writes full results to `app/public/data/vehicles.json` when it completes and writes partial results periodically to the same file while running.

If you want additional features (proxy list rotation, automatic IP change via VPN integration, or headless browser scraping), I can extend the script.
