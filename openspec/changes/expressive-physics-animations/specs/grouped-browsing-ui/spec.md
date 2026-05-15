## MODIFIED Requirements

### Requirement: Brand Selection Flow
The system SHALL transition to a dedicated model list when a specific make is selected using a swipe-in animation.

#### Scenario: Selecting Mazda
- **WHEN** the user taps on "Mazda" in the make list
- **THEN** the brand list slides out to the left and the Mazda model list slides in from the right with a physics-based spring.

### Requirement: Model Grouping (Alphabetical)
The system SHALL group vehicle models into alphabetical sections (A-Z) within the brand view with graceful expansion/collapse animations.

#### Scenario: Expanding a model section
- **WHEN** the user taps on the "C" section in the Mazda view
- **THEN** the section expands with a spring animation, smoothly pushing down the following sections.

### Requirement: Model Expansion
The system SHALL allow users to expand a model to see all its individual variants with a smooth layout transition.

#### Scenario: Expanding Mazda CX-5
- **WHEN** the user taps on "CX-5"
- **THEN** it expands to show variants (GT, Maxx, etc.) using a layout-aware transition that animates the height and contents.
