## ADDED Requirements

### Requirement: Interaction-Origin Detection
The system SHALL capture the screen coordinates of a user's click or touch event to use as the origin for subsequent animations.

#### Scenario: Capturing click origin
- **WHEN** a user clicks a vehicle card
- **THEN** the system stores the `clientX` and `clientY` coordinates

### Requirement: Flowing Grid Animation
The model selection overlay SHALL animate from the captured interaction origin, expanding outward to fill the screen or its target area.

#### Scenario: Grid expansion from origin
- **WHEN** the model overlay is triggered
- **THEN** it scales from 0 and translates from the captured origin coordinates to its final position with a spring animation
