## MODIFIED Requirements

### Requirement: Side-by-Side Comparison
The system SHALL display up to three vehicles side-by-side in a scrollable grid, aligning identical specification rows for direct comparison.

#### Scenario: Base Case comparison
- **WHEN** comparing multiple vehicles
- **THEN** the first vehicle added SHALL be designated as the "Base Case" and positioned in the first data column.

### Requirement: Show Differences Toggle
The system SHALL provide a toggle to hide all identical specification rows, showing only the fields where Vehicle 2 or 3 differ from the Base Case.

#### Scenario: Toggling "Show Differences Only"
- **WHEN** the user enables the "Show differences only" toggle
- **THEN** the system SHALL hide all rows where the values of Vehicle 2 and 3 match the value of the Base Case (Vehicle 1).

### Requirement: Categorized View
The comparison SHALL be organized into the following tabs or sections: Mechanical, Dimensions, Safety, Tech, and Interior.

#### Scenario: Filtering comparison by category
- **WHEN** the user selects a category (e.g., Dimensions)
- **THEN** only specifications belonging to that category are shown in the tabular view.
