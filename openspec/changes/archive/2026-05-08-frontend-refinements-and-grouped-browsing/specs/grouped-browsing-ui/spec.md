## ADDED Requirements

### Requirement: Alphabetical Make Grouping
The system SHALL group vehicle makes into alphabetical sections (A-Z).

#### Scenario: Expanding an A-Z section
- **WHEN** the user taps on the "T" accordion header
- **THEN** it expands to show "Toyota", "Tesla", etc.

### Requirement: Brand Selection Flow
The system SHALL transition to a dedicated model/variant list when a specific make is selected.

#### Scenario: Selecting Toyota
- **WHEN** the user taps on "Toyota" in the make list
- **THEN** the view updates to show all 2018 Toyota models and variants

### Requirement: Responsive Hero Images
The system SHALL ensure vehicle hero images are fully visible on all screen sizes without overflow.

#### Scenario: Viewing a vehicle on mobile
- **WHEN** a vehicle detail page is loaded on a small screen
- **THEN** the image is scaled to fit the width while maintaining aspect ratio and limited height
