## 1. PWA and Offline Readiness

- [ ] 1.1 Add a Web App Manifest (`manifest.webmanifest`) with `name`, `short_name`, `icons`, `theme_color`, `background_color`, `display`, and `start_url`.
- [ ] 1.2 Integrate a Service Worker into the Vite app to cache the app shell, CSS, JS, local JSON data, and vehicle image/logo assets.
- [ ] 1.3 Ensure the Service Worker supports offline fallback for the main UI and displays a helpful offline state if a network-only call fails.
- [ ] 1.4 Test installability and offline startup for local JSON data and image assets.

## 2. Redesign Brand Discovery Page

- [ ] 2.1 Redesign the main page to display brands inside an accordion view.
- [ ] 2.2 When a brand accordion panel opens, show a responsive grid of cards or tiles featuring the brand logo and the brand name.
- [ ] 2.3 Ensure each brand tile is clickable and navigates to the brand’s vehicle list or search results.
- [ ] 2.4 Make the grid responsive to mobile widths, supporting 1–2 columns on narrow screens and 3–4 columns on wider screens.
- [ ] 2.5 Use transparent logo assets and confirm they render cleanly on both light and dark backgrounds.

## 3. MUI-aligned UI and Dark Mode

- [ ] 3.1 Refactor the app UI to use Material UI-inspired spacing, cards, typography, and button styles.
- [ ] 3.2 Apply an overall MUI-style responsive layout system with consistent gutter spacing and section padding.
- [ ] 3.3 Add theme switching or automatic dark mode support based on user preference.
- [ ] 3.4 Persist the selected color mode across app reloads using local storage.
- [ ] 3.5 Verify all screens, dialogs, menus, and custom components work in both light and dark themes.

## 4. Vehicle Detail Swipeable Tabs

- [ ] 4.1 Update the vehicle detail screen to present spec categories as tabs or swipeable views.
- [ ] 4.2 Add mobile swipe gesture support so users can move between categories by swiping left/right.
- [ ] 4.3 Maintain click/tap tab selection behavior in addition to swipe gestures.
- [ ] 4.4 Confirm tab content is keyboard accessible and the active tab is visually distinct.

## 5. Compare Screen Enhancements

- [ ] 5.1 Refactor the comparison screen to group specs into named categories (Mechanical, Dimensions, Safety, Tech, Interior, etc.).
- [ ] 5.2 Add swipeable navigation between comparison category groups.
- [ ] 5.3 Implement a comparison legend accessible via an info button (`i`) that clearly explains each colour’s meaning in plain English.
- [ ] 5.4 Ensure comparison colours behave consistently in both light and dark mode.
- [ ] 5.5 Add visible category headings or tabs so users understand the current comparison group.

## 6. Brand Logo Asset Sourcing

- [ ] 6.1 Source transparent SVG or PNG logos for the brands: Audi, Ford, Honda, Hyundai, Kia, Mazda, Toyota, Volkswagen.
- [ ] 6.2 Prefer official or licensed SVG assets and optimize them for use in the app.
- [ ] 6.3 Add the sourced logos to the app’s public image assets and reference them from the brand grid.

## 7. Validation and polish

- [ ] 7.1 Conduct offline testing across the full app: brand page, vehicle detail, compare mode, and theme switching.
- [ ] 7.2 Verify the PWA installs correctly on Chrome and Firefox and launches from the installed icon.
- [ ] 7.3 Confirm that app navigation, swipe gestures, and compare legend work on mobile screen sizes.
- [ ] 7.4 Review the UI against MUI style guidance and refine spacing, typography, and card treatment.
- [ ] 7.5 Document how the Service Worker handles caching and offline content in a short README or change note.
