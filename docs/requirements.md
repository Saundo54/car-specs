# Requirements Specification: CarSpec PWA / Android App

**Project:** CarSpec — Vehicle Specifications Research Application  
**Version:** 1.0  
**Date:** May 2026

---

## 1. Product Overview

CarSpec is a Progressive Web App (PWA) that provides a comprehensive, offline-capable database of vehicle specifications for model years 2018–present, sourced from carsales.com.au. Users can search, filter, and compare vehicle specifications for research purposes. No sales data, pricing, or regional availability information is included.

---

## 2. Stakeholders

| Stakeholder | Role | Concerns |
|------------|------|---------|
| End User | Primary | Fast search, offline access, clear comparison |
| Developer | Builder | Maintainability, AWS cost, scraper reliability |
| Data Source | carsales.com.au | ToS compliance, rate limits |

---

## 3. Functional Requirements

### 3.1 Data Scraping & Ingestion (FR-SCRAPE)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-S01 | The system SHALL scrape vehicle specification data from carsales.com.au covering all makes, models, and variants for model years 2018–current | MUST |
| FR-S02 | The scraper SHALL capture all available specification categories: mechanical, dimensions, interior, exterior, safety, technology/infotainment, powertrain | MUST |
| FR-S03 | The scraper SHALL run on a scheduled basis (minimum quarterly, ideally monthly) via AWS Lambda | MUST |
| FR-S04 | The scraper SHALL implement rate limiting with randomised delays between requests (minimum 5 seconds) | MUST |
| FR-S05 | The scraper SHALL store raw HTML/JSON responses in S3 before processing (audit trail) | SHOULD |
| FR-S06 | The scraper SHALL log errors, blocked requests, and structural anomalies to CloudWatch | MUST |
| FR-S07 | The ingestion pipeline SHALL normalise spec data into a canonical schema before writing to DynamoDB | MUST |
| FR-S08 | The pipeline SHALL deduplicate records by make + model + year + variant key | MUST |
| FR-S09 | The system SHALL support plugging in alternative data sources without restructuring the pipeline | SHOULD |
| FR-S10 | The scraper SHALL respect robots.txt directives | MUST |

### 3.2 Data Model (FR-DATA)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-D01 | Each vehicle record SHALL contain: Make, Model, Year, Body Type, Variant/Trim name, Country of Origin | MUST |
| FR-D02 | Each record SHALL contain Mechanical specs: engine displacement, cylinder count, fuel type, power (kW/hp), torque (Nm), transmission type, gearbox speeds, drivetrain (FWD/RWD/AWD/4WD) | MUST |
| FR-D03 | Each record SHALL contain Dimension specs: length, width, height, wheelbase, kerb weight, towing capacity, boot capacity (L), fuel tank capacity | MUST |
| FR-D04 | Each record SHALL contain Exterior specs: body style, number of doors, wheel size, tyre size, headlight type, roof type | MUST |
| FR-D05 | Each record SHALL contain Interior specs: seating capacity, upholstery type, seat adjustment type, climate zones, infotainment screen size | MUST |
| FR-D06 | Each record SHALL contain Safety specs: ANCAP rating, year of ANCAP test, airbag count, ABS, ESC, autonomous emergency braking (AEB), lane keep assist, blind spot monitoring, reversing camera | MUST |
| FR-D07 | Each record SHALL contain Technology specs: connectivity (Apple CarPlay, Android Auto), wireless charging, head-up display, surround view cameras, parking sensors | SHOULD |
| FR-D08 | Data SHALL include a `last_updated` timestamp and `source_url` for provenance | MUST |
| FR-D09 | The schema SHALL be versioned to support future field additions without breaking existing records | MUST |
| FR-D10 | A distinct vehicle index (make/model/year list only) SHALL be maintained separately for fast loading | MUST |

### 3.3 Search & Filter (FR-SEARCH)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-SR01 | Users SHALL be able to search by: make, model, year, body type, fuel type, drivetrain | MUST |
| FR-SR02 | Search SHALL support partial text matching on make and model name | MUST |
| FR-SR03 | Users SHALL be able to filter by: year range, fuel type (petrol/diesel/hybrid/electric/PHEV), body type (sedan/SUV/ute/hatch/wagon/coupe/van/convertible), drivetrain, number of seats, ANCAP rating | MUST |
| FR-SR04 | Multiple filters SHALL be combinable (AND logic) | MUST |
| FR-SR05 | Filter state SHALL be preserved during the session | MUST |
| FR-SR06 | Search results SHALL display: make, model, year, body type, thumbnail image (if available), and key spec summary | MUST |
| FR-SR07 | Search results SHALL be sortable by: make (A–Z), year (newest first/oldest first), engine size | SHOULD |
| FR-SR08 | A "recent searches" list SHALL be persisted locally (last 10 searches) | SHOULD |
| FR-SR09 | Search and filter SHALL function fully offline using the local cache | MUST |

### 3.4 Vehicle Detail View (FR-DETAIL)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-DV01 | A full specification sheet SHALL be accessible for each vehicle variant | MUST |
| FR-DV02 | Specs SHALL be organised into tabbed or sectioned categories (Mechanical, Dimensions, Interior, Exterior, Safety, Technology) | MUST |
| FR-DV03 | Users SHALL be able to add any vehicle to a comparison shortlist from the detail view | MUST |
| FR-DV04 | A "similar vehicles" suggestion SHALL appear based on body type and engine class | SHOULD |
| FR-DV05 | Users SHALL be able to bookmark/favourite vehicles (stored locally) | SHOULD |
| FR-DV06 | The spec sheet SHALL indicate the data source and last updated date | MUST |

### 3.5 Vehicle Comparison (FR-COMPARE)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-C01 | Users SHALL be able to compare up to 3 vehicles simultaneously | MUST |
| FR-C02 | The comparison view SHALL display all specs side-by-side in aligned rows | MUST |
| FR-C03 | Differences between vehicles SHALL be visually highlighted (e.g. colour coding) | MUST |
| FR-C04 | Identical spec values across all compared vehicles SHALL be visually de-emphasised or optionally hidden | SHOULD |
| FR-C05 | Users SHALL be able to swap one vehicle in a comparison without losing the others | MUST |
| FR-C06 | Comparison state SHALL persist across navigation (within session) | MUST |
| FR-C07 | Users SHALL be able to share a comparison via a URL (deep link) | SHOULD |
| FR-C08 | Comparison SHALL function offline using cached spec sheets | MUST |

### 3.6 Offline & Caching (FR-OFFLINE)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-O01 | The PWA SHALL install a Service Worker on first visit | MUST |
| FR-O02 | The vehicle index (all make/model/year combinations) SHALL be pre-cached on install (~2–5 MB) | MUST |
| FR-O03 | Full spec sheets SHALL be cached on-demand as the user browses | MUST |
| FR-O04 | The app SHALL function in full offline mode once the index is cached | MUST |
| FR-O05 | The app SHALL display a clear offline indicator when no network is available | MUST |
| FR-O06 | Cached data SHALL display a staleness warning if older than 90 days | SHOULD |
| FR-O07 | Users SHALL be able to manually trigger a data refresh when online | MUST |
| FR-O08 | Users SHALL be able to view and manage cache size | SHOULD |

### 3.7 PWA Requirements (FR-PWA)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-P01 | The app SHALL meet all PWA installability criteria (manifest, HTTPS, Service Worker) | MUST |
| FR-P02 | The app SHALL be installable on Android via Chrome "Add to Home Screen" | MUST |
| FR-P03 | The app SHALL support Android back gesture navigation | MUST |
| FR-P04 | The app SHALL support dark mode (respects system preference) | MUST |
| FR-P05 | The app SHALL achieve a Lighthouse PWA score ≥ 90 | SHOULD |
| FR-P06 | Time to interactive on first load SHALL be < 3 seconds on a 4G connection | SHOULD |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement |
|----|------------|
| NFR-P01 | Search results SHALL render within 300ms of query submission (offline, local index) |
| NFR-P02 | Vehicle detail page SHALL load within 500ms when spec is cached |
| NFR-P03 | Comparison view SHALL render within 500ms |
| NFR-P04 | The vehicle index (pre-cached) SHALL support searching 10,000+ records without noticeable lag |

### 4.2 Scalability

| ID | Requirement |
|----|------------|
| NFR-SC01 | The system SHALL remain within AWS Free Tier limits permanently |
| NFR-SC02 | Storage SHALL not exceed 4 GB total (well within Free Tier) |
| NFR-SC03 | API Gateway + CloudFront SHALL handle burst traffic via caching (no Lambda invocation for cached responses) |

### 4.3 Reliability

| ID | Requirement |
|----|------------|
| NFR-R01 | Scraper failures SHALL NOT affect the live app (read and write paths are decoupled) |
| NFR-R02 | The scraper SHALL send failure alerts via SNS email notification |
| NFR-R03 | The app SHALL gracefully degrade to offline mode when the API is unavailable |

### 4.4 Security

| ID | Requirement |
|----|------------|
| NFR-S01 | All API endpoints SHALL be served over HTTPS |
| NFR-S02 | S3 buckets SHALL NOT be publicly accessible (CloudFront OAC only) |
| NFR-S03 | DynamoDB tables SHALL use IAM role-based access (Lambda execution role only) |
| NFR-S04 | No user PII is collected in Phase 1 |

### 4.5 Maintainability

| ID | Requirement |
|----|------------|
| NFR-M01 | Scraper selectors SHALL be abstracted into a configuration file (not hardcoded) for easy update when site structure changes |
| NFR-M02 | All infrastructure SHALL be defined as Infrastructure-as-Code (AWS CDK or Terraform) |
| NFR-M03 | The data schema SHALL be documented and versioned |

---

## 5. Constraints

| Constraint | Description |
|-----------|-------------|
| C01 | AWS infrastructure cost MUST be $0/month permanently |
| C02 | No EC2 instances in production architecture (Free Tier expiry risk) |
| C03 | No paid third-party APIs or data services |
| C04 | Scraping MUST comply with carsales.com.au robots.txt |
| C05 | No user data storage or tracking |
| C06 | Android-first design; iOS compatibility is a bonus, not a requirement |

---

## 6. Acceptance Criteria

| Criterion | Measure |
|----------|---------|
| Data Coverage | ≥ 500 distinct vehicle variants across ≥ 30 makes for 2018–present |
| Spec Completeness | ≥ 80% of records have mechanical, dimension, and safety specs populated |
| Search Accuracy | Search returns correct results for 100% of exact make+model queries |
| Offline Search | 100% of search/filter operations work with no network connection |
| Comparison | 3-vehicle comparison renders all spec rows correctly |
| Differences Highlighted | Visual differentiation present for all non-matching spec values |
| AWS Cost | $0.00/month on AWS bill |
| PWA Install | Installable on Android Chrome with working offline mode |

---

*Document version 1.0 — May 2026*
