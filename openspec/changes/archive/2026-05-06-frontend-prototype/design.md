## Context

This design covers the implementation of the CarSpec frontend prototype. The goal is to demonstrate a high-fidelity, Material You-based PWA that functions offline and allows for deep vehicle specification research and comparison. We will use placeholder data for three specific vehicles: 2020 Toyota Corolla Hybrid, 2018 Mazda 6 Sedan, and 2025 Toyota Camry Hybrid SL.

## Goals / Non-Goals

**Goals:**
- Implement a responsive React + Vite PWA with a Material You (M3) design system.
- Create a reachability-first navigation pattern for mobile devices.
- Develop a robust comparison engine with difference highlighting.
- Use placeholder data to demonstrate full-cycle spec browsing and comparison.

**Non-Goals:**
- Real-time data scraping (this prototype uses static/mocked data).
- User authentication or persistent cloud-synced favorites (localStorage/IndexedDB only).
- Native Android code (this is a PWA-only phase).

## Decisions

### 1. Component Library: Custom + `material-web`
We will use Google's official `material-web` components where stable, and build custom React components for more complex layout patterns like the Comparison Table and Filter Bottom Sheet.
- **Rationale**: `material-web` provides the core M3 tokens and interactions, but complex automotive-specific research components require custom implementation to match the UX specs.

### 2. State Management: Zustand
We will use Zustand for managing global application state (search filters, comparison shortlist, theme preference).
- **Rationale**: Lightweight, easy to integrate with persistence middleware for offline-first behavior, and avoids the boilerplate of Redux.

### 3. Routing: React Router v6
- **Rationale**: Standard for React applications, supporting nested routes and search params (essential for deep-linking comparisons).

### 4. Placeholder Data Structure
Vehicles will be stored as static JSON objects following the canonical schema defined in `docs/design.md`.
- **2020 Toyota Corolla Hybrid**: Focus on efficiency and safety specs.
- **2018 Mazda 6 Sedan**: Focus on mechanical and dimension specs for comparison against hybrids.
- **2025 Toyota Camry Hybrid SL**: Demonstrates latest technology and premium features.

### 5. Styling: Vanilla CSS + CSS Modules
- **Rationale**: Maximum flexibility for implementing the specific spring animations and tonal surface elevations of Material You without the overhead of a large CSS-in-JS library.

## Risks / Trade-offs

- **[Risk]**: Dynamic color extraction from wallpaper is complex in a PWA.
  - **Mitigation**: Implement a robust fallback theme and use `@material/material-color-utilities` to generate the palette from a seed color.
- **[Risk]**: Comparison table performance with many rows.
  - **Mitigation**: Use a simple list virtualization or optimize row rendering with `React.memo`.
- **[Risk]**: Service worker complexity for offline caching.
  - **Mitigation**: Use `vite-plugin-pwa` with Workbox for standard caching patterns.
