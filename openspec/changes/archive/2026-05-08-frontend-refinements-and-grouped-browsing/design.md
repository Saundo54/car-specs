## Context

The current prototype browsing experience is hindered by large images and a long, unfiltered list. We need to implement responsive fixes and a more structured A-Z browsing flow.

## Goals / Non-Goals

**Goals:**
- Fix mobile image scaling.
- Implement alphabetical make accordions.
- Improve fuel type filtering reliability.

**Non-Goals:**
- Redesigning the entire search page (just the results layout).
- Adding new vehicle data (this uses existing local-scraper data).

## Decisions

### 1. Two-Pane Result Strategy
We will toggle between the `alphaList` and `resultsArea` in `SearchScreen.tsx` using local component state.
- **Rationale**: Keeps the user focused on the selection funnel (Make -> Model -> Variant).

### 2. CSS object-fit: contain
- **Rationale**: Ensures the entire vehicle is visible even if the source image has varying aspect ratios, avoiding "zoom-in" cropping.

### 3. Dynamic Normalization Hook
We will extract fuel type normalization into a helper function to ensure consistency across search and detail views.
