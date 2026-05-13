## 1. Local Scraper Setup

- [x] 1.1 Create `scripts/local-scraper.ts` and setup dependencies (`axios`, `fast-xml-parser`, `fs-extra`).
- [x] 1.2 Implement Sitemap discovery for 2018 vehicles only.
- [x] 1.3 Implement "Taco" API retrieval logic with whitelisted User-Agent.

## 2. Scraping Logic

- [x] 2.1 Implement recursive component tree traversal to extract specifications.
- [x] 2.2 Implement image downloading and local storage to `app/public/images/vehicles/`.
- [x] 2.3 Implement deduplication and save final dataset to `app/public/data/vehicles.json`.

## 3. Frontend Integration

- [x] 3.1 Update `app/src/store/useAppStore.ts` to fetch data from `/data/vehicles.json`.
- [x] 3.2 Update vehicle card and detail components to use local image paths.
- [x] 3.3 Verify 2018 data is correctly displayed in search and comparison screens.

