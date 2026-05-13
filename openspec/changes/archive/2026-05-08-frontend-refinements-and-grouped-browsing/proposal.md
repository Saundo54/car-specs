## Why

The initial frontend prototype has several UI issues: images are too large for mobile view, and fuel type data is often missing or incorrectly categorized, which breaks filtering. Additionally, browsing 230+ vehicles in a single list is overwhelming. This change addresses these issues by making the UI responsive, improving data normalization, and introducing an alphabetical A-Z grouped browsing experience.

## What Changes

- Make vehicle hero images responsive to screen size (max-height 40vh, object-fit contain).
- Implement a robust fuel type normalization engine to handle scraped data variants (e.g., "Hybrid (Petrol/Electric)").
- Implement an alphabetical A-Z list of brands using accordions.
- Implement a two-step browsing flow: Select A-Z Letter -> Select Brand -> View Models/Variants.
- Ensure the vehicle list is filtered by the active year range (fixed to 2018 for the current dataset).

## Capabilities

### New Capabilities
- `grouped-browsing-ui`: Alphabetical A-Z navigation for vehicle makes.

### Modified Capabilities
- `vehicle-search-ui`: Refined to support brand selection and better data normalization.
- `vehicle-detail-ui`: Responsive image fixes.

## Impact

- **Frontend**: Significant changes to `SearchScreen.tsx` and `VehicleDetail.module.css`.
- **UX**: Shift from flat list to a structured, hierarchical browsing model.
