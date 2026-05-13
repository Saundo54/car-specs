## 1. Infrastructure Setup (CDK)

- [x] 1.1 Define DynamoDB `carspec-vehicles` table with PK `make#model` and SK `year#variant`.
- [x] 1.2 Create S3 buckets for `raw` and `processed` data.
- [x] 1.3 Define SQS work queue for scraper tasks.
- [x] 1.4 Setup IAM roles for Lambda execution with access to S3, DynamoDB, and SQS.

## 2. Orchestrator Implementation

- [x] 2.1 Implement Sitemap parser to fetch `ResearchMakeModelPage.xml`.
- [x] 2.2 Filter URLs for depth 9 and model years >= 2018.
- [x] 2.3 Implement SQS publisher to enqueue variant URLs with a rate-limiting strategy.

## 3. Scraper Implementation

- [x] 3.1 Implement "Taco" API client using `axios` or similar.
- [x] 3.2 Configure whitelisted User-Agent spoofing (`Gemini-Deep-Research`).
- [x] 3.3 Implement raw JSON storage to S3 `/raw/` prefix.
- [x] 3.4 Implement error handling and exponential back-off for 429 responses.

## 4. Transformer & Normalization

- [x] 4.1 Implement JSON tree traversal logic to extract mechanical, dimensions, and safety specs.
- [x] 4.2 Map extracted fields to the canonical `VehicleSpec` schema.
- [x] 4.3 Implement DynamoDB upsert logic.

## 5. Index Generation

- [x] 5.1 Implement DynamoDB scan task for lightweight record extraction.
- [x] 5.2 Generate compressed `vehicles.json` index.
- [x] 5.3 Implement S3 upload and CloudFront invalidation for the index file.

## 6. Verification & Monitoring

- [x] 6.1 Implement a verification script to scrape a known model (e.g., 2023 Toyota Camry Ascent).
- [x] 6.2 Set up CloudWatch alarms for scraper failures or persistent 429 status codes.
