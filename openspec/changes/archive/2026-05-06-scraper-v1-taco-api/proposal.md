## Why

The CarSpec project requires a comprehensive, offline-capable database of vehicle specifications, but the primary data source (carsales.com.au) employs significant bot protection that blocks standard scraping attempts. We need a robust, high-efficiency, and cost-effective method to retrieve this data while adhering to a strict permanent $0/month AWS budget.

## What Changes

- Implement a specialized scraper that targets the carsales.com.au "Taco" API via the `/research/` path.
- Utilize whitelisted AI bot User-Agents (e.g., `Gemini-Deep-Research`) to ensure reliable access without headless browser overhead.
- Automated discovery of over 10,000 vehicle variants using Research sitemap indexing.
- Implementation of a decoupled ingestion pipeline: Raw HTML/JSON storage (S3) -> Normalization -> Structured Storage (DynamoDB).
- Implementation of the vehicle index generation for PWA pre-caching.

## Capabilities

### New Capabilities
- `vehicle-data-ingestion`: Automated scraping, normalization, and canonical storage of vehicle specifications from external sources.
- `vehicle-index-generation`: Creation of a lightweight search index for offline-first PWA access.

### Modified Capabilities
- None (Initial implementation)

## Impact

- **Infrastructure**: New AWS Lambda functions for orchestration, scraping, and transformation.
- **Storage**: New DynamoDB tables for specifications and S3 buckets for raw/processed data.
- **Compute**: Utilization of AWS Lambda (Node.js 20.x) within Free Tier limits.
- **Data Model**: Introduction of the canonical vehicle specification schema.
