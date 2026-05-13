## Context

Popular car brands often have many models and variants. A flat list is difficult to navigate. We need a hierarchical drill-down: A-Z Letter -> Brand -> A-Z Letter -> Model -> Variant.

## Goals / Non-Goals

**Goals:**
- Implement nested alphabetical grouping for Models within a Brand.
- Display images at both Model and Variant levels.

## Decisions

### 1. Model Representative Image
For the Model header/accordion, we will use the image from the first available Variant.
- **Rationale**: Provides immediate visual recognition of the car shape/type.

### 2. Double-Layer Accordion UI
The `SearchScreen.tsx` will now support a state-driven UI where clicking a brand resets the view to a new alphabetical list of models.
- **Rationale**: Consistency in navigation patterns.

### 3. Data Transformation
We will use a multi-level reduce to group `filteredVehicles`:
- `Makes[Letter] -> Models[Letter] -> Variants[]`
- **Rationale**: Efficient for rendering and filtering.
