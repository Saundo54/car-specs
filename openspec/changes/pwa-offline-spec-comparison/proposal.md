## Why

CarSpec currently depends on a web session and a non-optimized interface for brand discovery, comparison, and vehicle details. The app should be elevated to a full offline-capable Progressive Web App so that users can browse brands, compare vehicles, and view specs without internet connectivity, while also improving mobile usability and consistency with Material UI design.

## What Changes

- Convert the app into a true PWA with Service Worker support, local asset caching, and offline-first behavior.
- Redesign the main brand discovery page so each accordion item expands into a clickable brand grid with logo icons and brand names.
- Align all app screens with Material UI design patterns and responsive mobile layout guidelines.
- Add support for dark mode throughout the entire app, including color contrast, backgrounds, and component styling.
- Enable swipeable tabs on the vehicle detail view for mobile users, allowing swipe gestures between categories such as Mechanical and Dimensions.
- Extend compare mode so the comparison grid is swipeable across spec groups and uses a clear colour legend with accessible explanation.
- Ensure full app functionality works offline using local JSON data and local image assets only.

## Requirements

### Functional Requirements

- FR-001: The app must install as a PWA on supported browsers and advertise installability.
- FR-002: A Service Worker must cache all app shell assets, brand logos, vehicle images, CSS, JS, and JSON data for offline use.
- FR-003: When offline, the app must still allow browsing brands, opening brand cards, viewing vehicle lists, inspecting vehicle details, and comparing vehicles.
- FR-004: The main brand page must show an accordion list of brands, where each expanded section includes a responsive grid of brand logos and names.
- FR-005: Each brand logo item must be clickable and navigate to the brand’s vehicle list or search results.
- FR-006: The app UI must follow Material UI conventions for spacing, typography, cards, buttons, tabs, dialogs, and responsive layout.
- FR-007: Dark mode must be supported and persist across app sessions if the user chooses it.
- FR-008: The vehicle detail screen tabs must support swipe gestures on mobile and desktop tab click behavior.
- FR-009: The compare screen must display spec categories as separate panels or tabs, and support horizontal swipe navigation between category groups.
- FR-010: Compare colours must have consistent meaning in both light and dark mode and a visible plain-English legend accessible from an info button.
- FR-011: All brand logos used must be transparent-background assets optimized for fast loading.

### Non-functional Requirements

- NFR-001: Offline startup should complete within 3 seconds on mobile devices when assets are already cached.
- NFR-002: App responsiveness must work on common mobile viewports (320px–480px) and tablet/desktop breakpoints.
- NFR-003: Service Worker caching must gracefully fall back to cached content when the network is unavailable.
- NFR-004: The PWA manifest should include a name, short_name, icons, theme_color, background_color, and display settings.
- NFR-005: Compare mode colour usage must remain accessible against both light and dark backgrounds.

## Capabilities

### New Capabilities

- `pwa-offline-mode`: Installable PWA with offline-first behavior and local caching.
- `brand-logo-grid`: Brand discovery UI that presents clickable logo tiles in a responsive grid.
- `swipeable-tabs`: Gesture-enabled tab navigation for detail screens and compare categories.
- `comparison-colour-key`: UI legend explaining comparison colours in plain English.

### Modified Capabilities

- `vehicle-detail-ui`: Add swipe navigation and MUI tab design.
- `vehicle-comparison-ui`: Add swipeable category groups, light/dark colour consistency, and info legend.
- `search-brand-ui`: Redesign the main brand accordion page with logo grid cards.
- `theme-ui`: Add global MUI-based dark mode and responsive styling.
- `app-shell`: Add PWA manifest and Service Worker integration.

## Impact

- **Frontend**: Major updates to the brand discovery page, detail page, compare page, theme handling, and layout implementation.
- **State**: Minimal state changes to support active theme persistence, swipe tab state, and offline-ready asset references.
- **Assets**: Add or source transparent brand logos for Audi, Ford, Honda, Hyundai, Kia, Mazda, Toyota, and Volkswagen.
- **Build**: Add a Service Worker integration path and manifest configuration in the Vite app.

## Logo Sourcing

Recommended transparent logo sources for the target brands:

- `https://cdn.simpleicons.org/audi`
- `https://cdn.simpleicons.org/ford`
- `https://cdn.simpleicons.org/honda`
- `https://cdn.simpleicons.org/hyundai`
- `https://cdn.simpleicons.org/kia`
- `https://cdn.simpleicons.org/mazda`
- `https://cdn.simpleicons.org/toyota`
- `https://cdn.simpleicons.org/volkswagen`

These sources provide SVG icons with transparent backgrounds that are well-suited for brand grid tiles.

## Nice-to-Have Features

- Add a `Recently Viewed` row on the main page so users can quickly return to brands or vehicles they explored.
- Include a `Compare Summary` card that highlights the number of matching vs. differing specs across compared vehicles.
- Add an offline status indicator or snackbar that shows when the app is using cached data.
- Enable `Add to Home Screen` prompt guidance for mobile users who install the PWA.
- Provide a toggle for “Show only differences” in compare mode to focus on variant specs.
- Add animated transitions between swipeable tabs to improve perceived responsiveness.
