## ADDED Requirements

### Requirement: Search Interface
The system SHALL provide a prominent search bar that allows users to filter the vehicle index by make, model, or year.

#### Scenario: Searching for a specific model
- **WHEN** the user types "Corolla" into the search bar
- **THEN** the vehicle list filters to show only Corolla variants

### Requirement: Multi-Select Filtering
The system SHALL provide a filter bottom sheet with options for body type, fuel type, and year range.

#### Scenario: Applying multiple filters
- **WHEN** the user selects "SUV" and "Electric" in the filter sheet
- **THEN** the vehicle list updates to show only electric SUVs

### Requirement: Vehicle Cards
The system SHALL display search results as Material Design 3 cards containing key summary data (make, model, year, fuel type, drivetrain).

#### Scenario: Viewing search results
- **WHEN** a search or filter is active
- **THEN** the system renders a list of cards representing matching vehicles
