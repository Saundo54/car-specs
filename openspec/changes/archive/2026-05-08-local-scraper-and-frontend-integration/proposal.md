## Why

The user requires a local database of 2018 vehicle specifications to populate the frontend prototype. This will allow for testing the UI and comparison engine with real-world data without relying on a live internet connection during every development session. It also validates the scraping logic discovered during the initial research phase.

## What Changes

- Implement a local Node.js scraper script that targets carsales.com.au for vehicles from the year 2018.
- Extract specifications from the "Taco" API using whitelisted User-Agents.
- Scrape and store vehicle images locally in a structured directory format.
- Save normalized vehicle data to a local `vehicles.json` file.
- Update the frontend prototype to load data from the local `vehicles.json` and serve images from the local storage directory.
- Implement deduplication logic to ensure only single vehicle records are captured.

## Capabilities

### New Capabilities
- `local-data-scraping`: Automated retrieval of specifications and images for 2018 vehicles, stored locally.
- `local-data-integration`: Frontend connectivity to local JSON and image assets.

### Modified Capabilities
- `vehicle-search-ui`: Updated to use local data source.
- `vehicle-detail-ui`: Updated to use local data source.
- `vehicle-comparison-ui`: Updated to use local data source.

## Impact

- **Storage**: Addition of a large number of vehicle images and a JSON data file to the local workspace.
- **Frontend**: Modification of data fetching logic in the React app to point to local assets.
- **Build Process**: New scripts for running the scraper locally.
