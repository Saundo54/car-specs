## MODIFIED Requirements

### Requirement: Material You (M3) Theming
The system SHALL implement a dynamic theming engine that derives a tonal palette from a seed color and applies it to all UI components, respecting the system's light/dark mode preference.

#### Scenario: Dark mode application
- **WHEN** the system is set to dark mode
- **THEN** the application renders using the dark tonal palette with appropriate contrast for all text and backgrounds.

### Requirement: Difference Highlighting
The system SHALL visually highlight differences in specification values using semantic tonal background tints that remain legible in both light and dark modes.

#### Scenario: Highlighting superior performance in dark mode
- **WHEN** the system is in dark mode and a vehicle has higher power
- **THEN** the value is highlighted using a dark-theme-appropriate tertiary container color.
