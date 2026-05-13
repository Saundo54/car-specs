## Context

Users find the 3-vehicle limit unclear and the comparison output too noisy. We need to introduce a "Base Case" logic where everything is relative to the user's primary choice.

## Goals / Non-Goals

**Goals:**
- Provide real-time feedback during vehicle selection.
- Clear indication of "nearing limit" (2/3 vehicles).
- Highlight specific differences against a reference vehicle (Base Case).

## Decisions

### 1. Selection Feedback: Persistent Bottom Sheet/Bar
We will implement a small, persistent bar at the bottom of the Search page (above the navigation) that shows the names of selected vehicles and a "Compare (N)" button.
- **Rationale**: Immediate feedback without leaving the search flow.

### 2. Base Case: Fixed Order
The `comparisonList` array in Zustand will be treated as an ordered list. Index 0 is always the Base Case.
- **Rationale**: Simplest logic for comparison. Re-ordering can be added later if needed.

### 3. Difference Logic: String Comparison
Rows will be hidden if `vehicles[1].spec[key] === vehicles[0].spec[key]` AND (if 3 vehicles) `vehicles[2].spec[key] === vehicles[0].spec[key]`.
- **Rationale**: Aligns with the "relative to base" requirement.

### 4. Limit Feedback: Material You Warning Tones
- 0-1 vehicles: Primary color.
- 2 vehicles: Secondary color.
- 3 vehicles: Tertiary/Warning color.
