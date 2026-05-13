## Why

Even with brand-level grouping, brands like Toyota or Mazda have dozens of variants for the 2018 model year alone, leading to a long, confusing list. Aggregating these variants by "Vehicle Type" (Model) will provide a much cleaner browsing experience, allowing users to drill down from Brand -> Model -> Variant in a logical, alphabetical hierarchy.

## What Changes

- Update the "Selected Make" view in `SearchScreen.tsx` to group vehicles by Model.
- Implement an alphabetical A-Z accordion structure for Models within the selected Brand.
- Display a representative image for each Model in the accordion header.
- Expand Model accordions to show individual Variants as cards, each with its own specific hero image.
- Clicking a Variant card opens the vehicle specification page.

## Capabilities

### Modified Capabilities
- `grouped-browsing-ui`: Enhanced with a nested hierarchical model for Brand -> Model -> Variant navigation.

## Impact

- **Frontend**: Significant refactoring of the `selectedMake` rendering logic in `SearchScreen.tsx`.
- **UX**: Improves navigation efficiency for brands with diverse model ranges.
