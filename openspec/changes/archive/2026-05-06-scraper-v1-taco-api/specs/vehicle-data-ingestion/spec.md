## ADDED Requirements

### Requirement: Taco API Data Retrieval
The system SHALL retrieve vehicle specification data from the carsales.com.au internal "Taco" API using a whitelisted AI bot User-Agent (e.g., Gemini-Deep-Research).

#### Scenario: Successful retrieval of vehicle specs
- **WHEN** the scraper requests the Taco API for a valid vehicle research URL with a whitelisted User-Agent
- **THEN** the system receives a JSON response containing the vehicle's component tree and specification data

### Requirement: Data Normalization
The system SHALL extract raw data from the Taco API component tree and normalize it into the project's canonical vehicle specification schema.

#### Scenario: Normalization of engine displacement
- **WHEN** the raw JSON contains a "2487 cc" value in the "Engine" section
- **THEN** the normalized record contains "engine_displacement_cc: 2487"

### Requirement: Decoupled Data Storage
The system SHALL store raw responses in S3 and normalized data in DynamoDB.

#### Scenario: Storage of scraped data
- **WHEN** a vehicle is successfully scraped and normalized
- **THEN** the raw JSON is saved to the S3 bucket's `/raw/` prefix and the normalized record is upserted into the `carspec-vehicles` DynamoDB table

### Requirement: Resilient Error Handling
The system SHALL implement exponential back-off and retries when encountering rate limits (HTTP 429) or transient network errors.

#### Scenario: Handling rate limits
- **WHEN** the API returns an HTTP 429 status code
- **THEN** the scraper waits for an increasing randomized interval before retrying the request
