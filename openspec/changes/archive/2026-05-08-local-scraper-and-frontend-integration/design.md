## Context

The user wants to transition from mock data to real scraped data for the 2018 model year. This involves running a local scraper script and integrating the resulting JSON and image assets into the frontend prototype.

## Goals / Non-Goals

**Goals:**
- Implement a local Node.js scraper using the "Taco" API discovery.
- Target all car brands for the year 2018.
- Store specifications and images locally.
- Update the frontend to consume these local assets.

**Non-Goals:**
- Running the scraper in AWS Lambda (this change is for local execution).
- Implementing a live backend API (data is served from a static JSON file).
- Supporting other years than 2018 in this specific run.

## Decisions

### 1. Local Scraper Script
We will use a standalone Node.js script (leveraging `axios`, `fast-xml-parser`, and `fs`) to perform the scraping.
- **Rationale**: Local execution is simpler for initial data seeding and avoids AWS costs during the development phase.

### 2. File-Based Storage
Data will be stored in `app/public/data/vehicles.json` and images in `app/public/images/vehicles/`.
- **Rationale**: Storing assets in the `public` directory allows the frontend (Vite) to serve them easily without complex backend logic.

### 3. Deduplication and "Single Vehicles"
We will use a Map to store vehicles during scraping, using the variant ID as the key to ensure no duplicates.
- **Rationale**: Sitemaps often contain redundant or overlapping URLs; a Map-based approach ensures a clean final dataset.

### 4. Image Scraping Logic
We will use `axios` with `responseType: 'arraybuffer'` to download images and save them using `fs.writeFileSync`.
- **Rationale**: Simple and effective for bulk downloading images during a local run.

## Risks / Trade-offs

- **[Risk]**: 2018 sitemap might contain thousands of entries.
  - **Mitigation**: Implement a concurrency-limited batching strategy (e.g., using a simple queue or `p-limit`) to avoid overwhelming the Carsales API and getting IP-blocked.
- **[Risk]**: Disk space for images.
  - **Mitigation**: Only download the "Hero" image for each variant.
