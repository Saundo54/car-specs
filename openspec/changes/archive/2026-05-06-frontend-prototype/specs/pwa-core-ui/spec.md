## ADDED Requirements

### Requirement: Material You (M3) Theming
The system SHALL implement a dynamic theming engine that derives a tonal palette from a seed color or system wallpaper (where available) and applies it to all UI components.

#### Scenario: Dynamic color application
- **WHEN** the application initializes
- **THEN** it generates a Material Design 3 color palette and applies it via CSS custom properties

### Requirement: Reachability-First Navigation
The system SHALL use a Bottom Navigation Bar on mobile devices to ensure primary actions are within the thumb's reach.

#### Scenario: Navigation between primary screens
- **WHEN** the user taps an icon in the Bottom Navigation Bar
- **THEN** the system navigates to the corresponding screen (Search, Compare, or Saved)

### Requirement: PWA Installability
The application SHALL meet all PWA criteria, including a web manifest and service worker, to allow installation on the user's home screen.

#### Scenario: PWA installation prompt
- **WHEN** the user visits the app on a compatible browser
- **THEN** they are presented with an option to install the application
