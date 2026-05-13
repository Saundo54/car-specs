## ADDED Requirements

### Requirement: Search Index Creation
The system SHALL generate a lightweight `vehicles.json` search index containing only the essential fields (id, make, model, year, variant, body_type, fuel_type) for all records in the database.

#### Scenario: Successful index generation
- **WHEN** the index generation task is triggered
- **THEN** it scans the DynamoDB table and produces a compressed JSON file containing the summary records for all vehicles

### Requirement: Index Deployment
The system SHALL upload the generated `vehicles.json` to the S3 bucket's `/index/` prefix and invalidate the corresponding CloudFront cache.

#### Scenario: Deployment of updated index
- **WHEN** a new `vehicles.json` is generated
- **THEN** it is uploaded to S3 and is immediately available via the CloudFront CDN URL
