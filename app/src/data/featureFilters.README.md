# Feature Filter Data Models

## Overview

This module provides the data structures and configuration for the feature filter system, which allows users to filter vehicles by convenience features like Apple CarPlay, Android Auto, Heated Seats, and 360° Camera.

**Requirements:** 6.2

## Data Models

### `SpecPath`

Defines where to look in vehicle specifications for a specific feature.

```typescript
interface SpecPath {
  category: 'tech' | 'interior' | 'safety';
  key: string;
  matchPattern: string | RegExp;
}
```

**Fields:**
- `category`: The specification category to search in (tech, interior, or safety)
- `key`: The key name in the category's record
- `matchPattern`: Pattern to match against the spec value (can be a string or RegExp)

**Example:**
```typescript
{
  category: 'tech',
  key: 'Apple CarPlay',
  matchPattern: /^(Yes|Wireless)/i
}
```

### `FilterableFeature`

Defines a filterable feature with its display properties and spec locations.

```typescript
interface FilterableFeature {
  id: string;
  label: string;
  icon: string;
  specPaths: SpecPath[];
}
```

**Fields:**
- `id`: Unique identifier for the feature (kebab-case)
- `label`: Display label for the feature
- `icon`: Icon emoji for visual representation
- `specPaths`: Array of spec paths where this feature might be found

**Example:**
```typescript
{
  id: 'apple-carplay',
  label: 'Apple CarPlay',
  icon: '📱',
  specPaths: [
    {
      category: 'tech',
      key: 'Apple CarPlay',
      matchPattern: /^(Yes|Wireless)/i
    }
  ]
}
```

### `FeatureFilterConfig`

Configuration for all available feature filters.

```typescript
interface FeatureFilterConfig {
  features: FilterableFeature[];
}
```

## Configuration

### `FEATURE_FILTER_CONFIG`

The main configuration object containing all filterable features.

**Available Features:**

1. **Apple CarPlay** (`apple-carplay`)
   - Icon: 📱
   - Searches: `tech.Apple CarPlay`
   - Matches: "Yes", "Wireless" (case-insensitive)

2. **Android Auto** (`android-auto`)
   - Icon: 🤖
   - Searches: `tech.Android Auto`
   - Matches: "Yes", "Wireless" (case-insensitive)

3. **Heated Seats** (`heated-seats`)
   - Icon: 🔥
   - Searches: 
     - `interior.Heated Seats` → Matches: "Yes", "Front", "Front & Rear"
     - `interior.Seats` → Matches: any value containing "Heated"

4. **360° Camera** (`360-camera`)
   - Icon: 📷
   - Searches:
     - `tech.360 Camera` → Matches: "Yes"
     - `tech.Surround View` → Matches: "Yes"
     - `safety.360 Camera` → Matches: "Yes"
     - `safety.Parking Camera` → Matches: values containing "360" or "Surround"

## Usage

### Importing

```typescript
import { 
  FEATURE_FILTER_CONFIG,
  type FeatureFilterConfig,
  type FilterableFeature,
  type SpecPath
} from './featureFilters';
```

### Accessing Features

```typescript
// Get all features
const allFeatures = FEATURE_FILTER_CONFIG.features;

// Find a specific feature
const carPlayFeature = FEATURE_FILTER_CONFIG.features.find(
  f => f.id === 'apple-carplay'
);

// Get feature labels for display
const featureLabels = FEATURE_FILTER_CONFIG.features.map(f => f.label);
```

### Checking if a Vehicle Has a Feature

```typescript
function hasFeature(vehicle: VehicleSpec, feature: FilterableFeature): boolean {
  return feature.specPaths.some(specPath => {
    const value = vehicle.specs[specPath.category]?.[specPath.key];
    if (!value) return false;
    
    if (typeof specPath.matchPattern === 'string') {
      return value === specPath.matchPattern;
    } else {
      return specPath.matchPattern.test(value);
    }
  });
}
```

## Design Decisions

### Multiple Spec Paths

Some features (like Heated Seats and 360° Camera) have multiple spec paths because:
- Different manufacturers may use different key names
- Features may appear in different categories
- Values may be structured differently

This approach ensures comprehensive feature detection across various vehicle data formats.

### Case-Insensitive Matching

All RegExp patterns use the `i` flag for case-insensitive matching to handle:
- Inconsistent capitalization in source data
- User input variations
- Data entry variations

### RegExp vs String Matching

- **RegExp patterns** are used when:
  - Multiple valid values exist (e.g., "Yes" or "Wireless")
  - Partial matching is needed (e.g., "Heated" anywhere in value)
  - Case-insensitive matching is required

- **String patterns** would be used when:
  - Exact matching is required
  - Only one valid value exists
  - Performance is critical (though RegExp is fast enough for this use case)

### Icon Selection

Emoji icons are used for:
- Universal recognition across platforms
- No additional asset loading
- Consistent rendering
- Accessibility (screen readers can announce emoji)

## Testing

The module includes comprehensive unit tests covering:
- Configuration structure validation
- Feature presence verification
- Spec path validation
- Pattern matching behavior
- Edge cases (empty strings, case variations, partial matches)
- Type safety

Run tests with:
```bash
npm test -- featureFilters.test.ts
```

## Future Enhancements

Potential additions to the feature filter system:

1. **Additional Features:**
   - Sunroof/Panoramic Roof
   - Wireless Charging
   - Adaptive Cruise Control
   - Lane Keep Assist
   - Parking Sensors

2. **Advanced Matching:**
   - Numeric range matching (e.g., screen size >= 10 inches)
   - Boolean logic (AND/OR combinations)
   - Fuzzy matching for typos

3. **User Customization:**
   - Allow users to add custom filters
   - Save filter presets
   - Share filter configurations

4. **Data Validation:**
   - Validate spec paths against actual vehicle data
   - Report missing or inconsistent data
   - Suggest corrections for common typos

## Related Files

- `vehicles.ts` - Vehicle data structure and mock data
- `lifestyleQuiz.ts` - Lifestyle quiz data models (complementary filtering)
- `featureFilters.test.ts` - Unit tests for this module
