## ADDED Requirements

### Requirement: Side-by-Side Comparison
The system SHALL display up to three vehicles side-by-side in a scrollable grid, aligning identical specification rows for direct comparison.

#### Scenario: Comparing two vehicles
- **WHEN** the user navigates to the Comparison screen with two vehicles selected
- **THEN** the system renders their specifications in adjacent columns

### Requirement: Difference Highlighting
The system SHALL visually highlight differences in specification values between compared vehicles using tonal background tints.

#### Scenario: Highlighting superior performance
- **WHEN** one vehicle has higher power (kW) than another in a comparison
- **THEN** the higher value is tinted green and the lower value is tinted red (or neutral)

### Requirement: Show Differences Toggle
The system SHALL provide a toggle to hide all identical specification rows, showing only the fields where the vehicles differ.

#### Scenario: Toggling "Show Differences Only"
- **WHEN** the user enables the "Show differences only" toggle
- **THEN** the system hides all rows where the values are identical across all compared vehicles
