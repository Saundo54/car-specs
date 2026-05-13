## MODIFIED Requirements

### Requirement: Brand Selection Flow
The system SHALL transition to a dedicated model list when a specific make is selected.

#### Scenario: Selecting Mazda
- **WHEN** the user taps on "Mazda" in the make list
- **THEN** the view updates to show an alphabetical list of Mazda models (3, 6, CX-3, etc.).

### Requirement: Model Grouping (Alphabetical)
The system SHALL group vehicle models into alphabetical sections (A-Z) within the brand view.

#### Scenario: Expanding a model section
- **WHEN** the user taps on the "C" section in the Mazda view
- **THEN** it expands to show "CX-3", "CX-5", etc., each with a representative image.

### Requirement: Model Expansion
The system SHALL allow users to expand a model to see all its individual variants.

#### Scenario: Expanding Mazda CX-5
- **WHEN** the user taps on "CX-5"
- **THEN** it expands to show variants (GT, Maxx, etc.), each as a card with its specific hero image.
