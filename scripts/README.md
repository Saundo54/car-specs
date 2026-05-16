# CarSales Scraper

This script scrapes CarSales `research` pages for vehicle specifications from 2018 through 2026 and writes results to `app/public/data/vehicles.json`.

Key features:
- **Non-interactive**: Runs continuously without user input
- **Smart skipping**: Checks existing vehicles.json and skips already-scraped vehicles to avoid early blocking
- **Auto-recovery**: Detects blocking (403/429 or CloudFront responses) and continues with next items
- **Safety exit**: Exits after 5 consecutive blocks to prevent further blocking
- **Progress tracking**: Resumes from where it left off via `scripts/carsales_progress.json`
- **Detailed reporting**: Shows successful/failed scrapes grouped by make, model, and year
- **Frequent saves**: Saves partial results every 20 vehicles

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
npx ts-node scripts/carsales-scraper.ts
```

Or with tsx (faster):

```bash
npx tsx scripts/carsales-scraper.ts
```

Or compile and run with Node

```bash
./node_modules/.bin/tsc scripts/carsales-scraper.ts --esModuleInterop --module commonjs --outDir dist
node dist/carsales-scraper.js
```

Behavior notes
- The script targets the CarSales research pages and attempts to use the site's internal API endpoint when available
- **Smart skipping**: On startup, loads existing vehicles.json and skips any make/model/year/variant combinations already in the database
- CarSales uses anti-DDoS protections. When blocked, the script logs a warning and continues with the next item
- After 5 consecutive blocks, the script exits with a detailed report to prevent further blocking
- The script writes full results to `app/public/data/vehicles.json` periodically (every 20 vehicles) and on completion
- At the end, prints a comprehensive report showing:
  - Successfully scraped vehicles (grouped by make/model/year)
  - Failed scrapes with reasons (grouped by make/model/year)
  - Total counts and statistics

If you want additional features (proxy list rotation, automatic IP change via VPN integration, or headless browser scraping), the script can be extended.
