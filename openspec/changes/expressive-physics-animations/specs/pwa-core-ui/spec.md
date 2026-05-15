## ADDED Requirements

### Requirement: Expressive Page Transitions
The system SHALL support expressive, physics-based transitions between top-level pages and nested views.

#### Scenario: Navigating between tabs
- **WHEN** the user clicks a navigation bar item
- **THEN** the current page fades out and slides slightly to the left, while the new page fades in and slides in from the right.

#### Scenario: Navigating to vehicle detail
- **WHEN** the user selects a vehicle from the search results
- **THEN** the search screen slides out and the detail screen slides in with a snappy spring.
