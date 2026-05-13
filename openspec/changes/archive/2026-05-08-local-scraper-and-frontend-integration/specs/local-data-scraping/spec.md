## ADDED Requirements

### Requirement: Scraper Constraint (Year 2018 Only)
The scraper SHALL only retrieve vehicle data for the model year 2018.

#### Scenario: Scraping 2018 Toyota Corolla
- **WHEN** the scraper encounters a 2018 vehicle URL in the sitemap
- **THEN** it proceeds to scrape the specifications and images

#### Scenario: Skipping non-2018 vehicles
- **WHEN** the scraper encounters a 2020 vehicle URL
- **THEN** it SHALL skip the record

### Requirement: Specification Extraction (Taco API)
The scraper SHALL extract all available specifications (mechanical, dimensions, safety, tech, interior) from the Carsales "Taco" API.

#### Scenario: Successful spec extraction
- **WHEN** the API returns a valid JSON component tree
- **THEN** the scraper traverses the tree to extract all key-value specification pairs

### Requirement: Local JSON Storage
The scraper SHALL store all scraped and normalized vehicle data in a single local JSON file named `vehicles.json`.

#### Scenario: Data persistence
- **WHEN** a vehicle is successfully scraped and normalized
- **THEN** its record is appended to the `vehicles.json` file (ensuring no duplicates)

### Requirement: Image Scraping and Local Storage
The scraper SHALL download vehicle hero images and store them in a local directory structure (e.g., `public/images/vehicles/{id}.jpg`).

#### Scenario: Image download
- **WHEN** a vehicle record contains a valid image URL
- **THEN** the scraper downloads the image and saves it locally using the vehicle's unique ID as the filename
