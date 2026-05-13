## ADDED Requirements

### Requirement: Shortlist Indicator
The system SHALL display a persistent or context-aware indicator of the vehicles currently selected for comparison.

#### Scenario: Adding first vehicle
- **WHEN** the user adds a vehicle to compare
- **THEN** an indicator (e.g., Badge or Bottom Bar) shows "1/3 selected" with the vehicle model name.

### Requirement: Limit Warning
The system SHALL provide a clear visual warning when the user has 2 vehicles selected or attempts to add more than 3.

#### Scenario: Adding third vehicle
- **WHEN** the user adds a third vehicle
- **THEN** the indicator SHALL use a warning tonal color (e.g., Amber) to indicate the limit is reached.

#### Scenario: Exceeding limit
- **WHEN** the user attempts to add a 4th vehicle
- **THEN** the system SHALL block the addition and show a message: "Comparison limit reached (max 3)."
