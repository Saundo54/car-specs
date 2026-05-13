## Why

The CarSpec project requires a high-fidelity frontend prototype to validate the Material You UX design, reachability-first layout, and offline-first capabilities. This prototype will serve as the foundation for the PWA and future Android TWA promotion.

## What Changes

- Initialize a React + Vite PWA project with TypeScript.
- Implement the core Material You (M3) design system including dynamic color logic (with fallback).
- Build the primary navigation structure (Bottom Navigation Bar/Navigation Rail).
- Create the Home/Search screen with vehicle cards and a filter bottom sheet.
- Implement the Vehicle Detail screen with tabbed specification categories.
- Develop the Comparison screen with side-by-side spec alignment and difference highlighting.
- Integrate placeholder data for three vehicles: 2020 Toyota Corolla Hybrid, 2018 Mazda 6 Sedan, and 2025 Toyota Camry Hybrid SL.

## Capabilities

### New Capabilities
- `pwa-core-ui`: Implementation of the Material You design system and base application shell.
- `vehicle-search-ui`: Search and filtering interface for browsing the vehicle index.
- `vehicle-detail-ui`: Detailed specification display with categorized information.
- `vehicle-comparison-ui`: Side-by-side comparison engine for multiple vehicle variants.

### Modified Capabilities
- None

## Impact

- **Frontend**: Creation of the React + Vite codebase in the repository root or a dedicated `app` directory.
- **Dependencies**: Addition of `react`, `react-router-dom`, `zustand`, `idb`, `material-web`, and `@material/material-color-utilities`.
- **Assets**: Implementation of Google Fonts (Roboto Flex) and Material Symbols.
