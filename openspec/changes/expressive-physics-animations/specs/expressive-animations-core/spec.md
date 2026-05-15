## ADDED Requirements

### Requirement: Centralized Physics Configuration
The system SHALL provide a centralized configuration for Framer Motion spring constants to ensure visual consistency across the application.

#### Scenario: Using standard spring
- **WHEN** a component requests the "standard" spring configuration
- **THEN** it receives values matching `stiffness: 300, damping: 30`

#### Scenario: Using expressive spring
- **WHEN** a component requests the "expressive" spring configuration
- **THEN** it receives values matching `stiffness: 200, damping: 20`

### Requirement: Shared Layout Transitions
The system SHALL support shared layout transitions (Magic Motion) between different views using unique identifiers.

#### Scenario: Transitioning image across views
- **WHEN** two components share the same `layoutId` and one enters while the other exits
- **THEN** Framer Motion animates the element's position and size smoothly between the two states
