## Why

The current comparison feature is rudimentary and lacks clear user feedback regarding selection limits and comparison logic. Users need a more intuitive way to manage their comparison shortlist and a structured method to identify specific specification differences against a base vehicle.

## What Changes

- Enhance the vehicle selection UI with a "Shortlist Bar" or clear visual indicators showing selected models and remaining slots (up to 3).
- Implement a "Nearing Limit" warning (e.g., tonal change or snackbar) when the 2nd and 3rd vehicles are added.
- Refactor the Comparison Screen into a structured tabular view categorized by Mechanical, Dimensions, Safety, Tech, and Interior.
- Establish the first vehicle in the list as the "Base Case" for all comparisons.
- Implement a "Show Differences Only" toggle that filters the table to only show rows where Vehicle 2 or Vehicle 3 differ from the Base Case (Vehicle 1).
- Add visual highlighting for differences specifically relative to the base vehicle.

## Capabilities

### New Capabilities
- `comparison-management-ui`: Interface for managing the comparison shortlist with limit feedback.

### Modified Capabilities
- `vehicle-comparison-ui`: Updated with base-case logic, category-based tabular view, and difference-only filtering.

## Impact

- **Frontend**: Significant updates to `SearchScreen.tsx` for selection feedback and `ComparisonScreen.tsx` for the new logic.
- **State**: Minor updates to `useAppStore.ts` to support specific selection order for base-case logic.
