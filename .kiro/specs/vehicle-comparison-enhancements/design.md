# Design Document: Vehicle Comparison Enhancements

## Overview

This design document specifies the technical implementation for eleven enhancement features to the CarSpec vehicle comparison application. The enhancements focus on improving user experience through intelligent data filtering, contextual explanations, practical visualizations, and automated insights.

### Design Goals

1. **Cognitive Load Reduction**: Minimize information overload by highlighting only meaningful differences
2. **Accessibility**: Translate technical jargon into plain English for non-technical users
3. **Practical Context**: Provide real-world visualizations and lifestyle-based recommendations
4. **Data-Driven Insights**: Leverage AI to generate automated summaries of vehicle trade-offs
5. **Mobile-First Experience**: Ensure PWA installation provides a native-like experience

### Technology Stack

- **Frontend**: React 19.2.5 with TypeScript 6.0.2
- **State Management**: Zustand 5.0.13 with persistence middleware
- **Routing**: React Router DOM 7.15.0
- **Animation**: Framer Motion 12.38.0
- **Build Tool**: Vite 8.0.10
- **PWA Support**: vite-plugin-pwa 1.3.0
- **Data Storage**: IndexedDB via idb 8.0.3

## Architecture


### System Architecture

The application follows a component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ SearchScreen │  │ComparisonScreen│ │VehicleDetail │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Component Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ DiffAccordion│  │BootVisualizer│  │LifestyleQuiz │      │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤      │
│  │SpecHighlight │  │TermTooltip   │  │FeatureFilter │      │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤      │
│  │ANCAPContext  │  │ AISummary    │  │ TechGlossary │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                       Service Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │BootHeuristic │  │ AIService    │  │ GlossaryMgr  │      │
│  │   Service    │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                        State Layer                           │
│                   ┌──────────────┐                           │
│                   │  useAppStore │                           │
│                   │   (Zustand)  │                           │
│                   └──────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  vehicles.json│  │ glossary.json│  │ IndexedDB    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Architectural Principles

1. **Component Isolation**: Each enhancement is implemented as a self-contained component
2. **Service Abstraction**: Complex logic (heuristics, AI) is encapsulated in service modules
3. **State Centralization**: All application state flows through Zustand store
4. **Progressive Enhancement**: Features degrade gracefully when data is unavailable
5. **Performance First**: Lazy loading, memoization, and virtualization where appropriate


## Components and Interfaces

### 1. Smart Diff-Only Accordion View

**Component**: `DiffToggle` and enhanced `ComparisonScreen`

**Interface**:
```typescript
interface DiffToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  differenceCount: number;
  identicalCount: number;
}

interface SpecRowProps {
  label: string;
  values: string[];
  hasDifference: boolean;
  collapsed: boolean;
  category: string;
}
```

**Implementation Details**:
- Fixed-position toggle control using CSS `position: sticky`
- Collapse animation using Framer Motion with 300ms duration
- Summary indicator displays count of hidden specs
- State persists within session (not across page reloads)

### 2. Best-in-Class Spec Highlight

**Component**: `SpecHighlightBadge`

**Interface**:
```typescript
interface SpecHighlightProps {
  value: string;
  isBestInClass: boolean;
  metricType: 'higher-better' | 'lower-better';
}

interface BestInClassCalculator {
  calculateBest(
    category: string,
    key: string,
    values: Array<{ vehicleId: string; value: string }>
  ): string[]; // Returns array of vehicle IDs with best value
}
```

**Implementation Details**:
- Gold badge icon (⭐) for best-in-class values
- Distinct from existing green/red/blue highlight system
- Supports tied values (multiple vehicles can have best-in-class)
- Metric direction determined by specification key name patterns


### 3. Boot and Cabin Visualizer

**Component**: `BootVisualizer`

**Interface**:
```typescript
interface BootVisualizerProps {
  capacityLitres: number;
  vehicleId: string;
}

interface LuggageEquivalent {
  largeSuitcases: number;
  prams: number;
  groceryBags: number;
}

interface BootHeuristicService {
  calculateLuggageEquivalent(litres: number): LuggageEquivalent;
  getMethodologyExplanation(): string;
  getBabyDriveReference(vehicleId: string): string | null;
}
```

**Implementation Details**:
- Icon-based visualization using SVG or icon font
- Info button triggers modal with methodology explanation
- Heuristic model based on BabyDrive database cross-reference
- Fallback to industry-standard volume estimates when BabyDrive data unavailable

### 4. Plain English Spec Translator

**Component**: `TermTooltip`

**Interface**:
```typescript
interface TermTooltipProps {
  term: string;
  children: React.ReactNode;
}

interface GlossaryEntry {
  term: string;
  explanation: string;
  practicalBenefit: string;
}

interface GlossaryService {
  getExplanation(term: string): GlossaryEntry | null;
  hasExplanation(term: string): boolean;
  loadGlossary(): Promise<void>;
}
```

**Implementation Details**:
- Desktop: hover-triggered tooltip with 200ms delay
- Mobile: tap-triggered tooltip with dismiss overlay
- Case-insensitive term matching
- Tooltip positioned to avoid viewport overflow


### 5. Everyday Lifestyle Match Quiz

**Component**: `LifestyleQuiz`

**Interface**:
```typescript
interface LifestyleQuizProps {
  onComplete: (results: QuizResults) => void;
  onReset: () => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

interface QuizOption {
  label: string;
  value: string;
  mappedCategories: string[];
}

interface QuizResults {
  parkingEnvironment: string;
  passengerRequirements: string;
  commuteDistance: string;
  recommendedCategories: string[];
}
```

**Implementation Details**:
- Three-question flow with single-select options
- Results stored in Zustand with persistence
- Filtering logic maps responses to vehicle body types
- Info modal explains recommendation algorithm

### 6. Must-Have Feature Checklist Filters

**Component**: `FeatureFilterChecklist`

**Interface**:
```typescript
interface FeatureFilterProps {
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
  onClearAll: () => void;
  matchingCount: number;
}

interface FeatureFilterService {
  filterVehicles(
    vehicles: VehicleSpec[],
    requiredFeatures: string[]
  ): VehicleSpec[];
  
  hasFeature(vehicle: VehicleSpec, feature: string): boolean;
}
```

**Implementation Details**:
- Checkbox-based multi-select interface
- AND logic for multiple selections
- Real-time count of matching vehicles
- Empty state message when no matches found


### 7. ANCAP Safety Rating and Date Context

**Component**: `ANCAPContextDisplay`

**Interface**:
```typescript
interface ANCAPContextProps {
  rating: number;
  testYear: number | null;
  currentYear: number;
}

interface ANCAPWarningLevel {
  level: 'none' | 'caution' | 'warning';
  message: string;
}

interface ANCAPService {
  getWarningLevel(testYear: number, currentYear: number): ANCAPWarningLevel;
  shouldEmphasize(testYear: number, currentYear: number): boolean;
}
```

**Implementation Details**:
- Display test year adjacent to star rating
- Visual emphasis for ratings older than 5 years
- Warning indicator for ratings older than 7 years
- Tooltip explaining rating age implications
- Sorting by rating with test year as tiebreaker

### 8. Automated AI Summary

**Component**: `AISummaryCard`

**Interface**:
```typescript
interface AISummaryProps {
  vehicles: VehicleSpec[];
}

interface TradeOff {
  category: string;
  description: string;
  affectedVehicles: string[];
}

interface AIService {
  generateSummary(vehicles: VehicleSpec[]): Promise<AISummary>;
  extractTradeOffs(vehicles: VehicleSpec[]): TradeOff[];
}

interface AISummary {
  tradeOffs: TradeOff[];
  overallAssessment: string;
  generatedAt: Date;
}
```

**Implementation Details**:
- Positioned at top of comparison screen
- Maximum 3 key trade-offs displayed
- Plain English without technical jargon
- Loading state during generation
- Feasibility assessment phase before full implementation


### 9. Boot Capacity Heuristic Model

**Service**: `BootHeuristicService`

**Interface**:
```typescript
interface BootHeuristicService {
  // Cross-reference with BabyDrive database
  matchVehicleToBabyDrive(vehicleId: string): BabyDriveEntry | null;
  
  // Calculate conversion ratios
  calculateConversionRatio(
    bootLitres: number,
    practicalCapacity: BabyDriveMeasurement
  ): ConversionRatio;
  
  // Apply heuristic to unmapped vehicles
  estimateLuggageCapacity(bootLitres: number): LuggageEquivalent;
  
  // Store methodology for transparency
  getMethodology(): HeuristicMethodology;
}

interface BabyDriveEntry {
  vehicleId: string;
  bootLitres: number;
  largeSuitcases: number;
  prams: number;
  groceryBags: number;
}

interface ConversionRatio {
  litresPerSuitcase: number;
  litresPerPram: number;
  litresPerGroceryBag: number;
}

interface HeuristicMethodology {
  dataSource: string;
  matchedVehicleCount: number;
  averageConversionRatio: ConversionRatio;
  confidenceLevel: 'high' | 'medium' | 'low';
}
```

**Implementation Details**:
- One-time calculation during app initialization
- Results cached in IndexedDB
- Fallback to industry standards when insufficient data
- Transparent methodology display in info modal


### 10. Technical Term Glossary

**Service**: `GlossaryManager`

**Interface**:
```typescript
interface GlossaryManager {
  loadGlossary(): Promise<void>;
  getEntry(term: string): GlossaryEntry | null;
  getAllTerms(): string[];
  addEntry(entry: GlossaryEntry): void;
  updateEntry(term: string, entry: Partial<GlossaryEntry>): void;
}

interface GlossaryEntry {
  term: string;
  explanation: string;
  practicalBenefit: string;
  category: 'mechanical' | 'safety' | 'tech' | 'general';
}
```

**Implementation Details**:
- Stored in `/public/data/glossary.json`
- Loaded once at app initialization
- Case-insensitive term matching
- Extensible without code changes
- Initial terms: Torque Converter, Regenerative Braking, ADAS, DOHC, VVT, ABS

### 11. PWA Mobile Application Icon

**Configuration**: `manifest.webmanifest`

**Interface**:
```typescript
interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  theme_color: string;
  background_color: string;
  display: string;
  scope: string;
  start_url: string;
  icons: PWAIcon[];
}

interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}
```

**Implementation Details**:
- Icon source: `/images/logo/mobile_app_icon.png`
- Required sizes: 192x192, 512x512
- Purpose: "any maskable" for Android adaptive icons
- Type: "image/png"
- Retain existing favicon.svg for browser tabs


## Data Models

### Extended VehicleSpec

```typescript
interface VehicleSpec {
  id: string;
  make: string;
  model: string;
  year: number;
  variant: string;
  body_type: string;
  fuel_type: string;
  drivetrain: string;
  seats: number;
  ancap_rating: number;
  ancap_test_year?: number; // NEW: ANCAP test year
  image: string;
  specs: {
    mechanical: Record<string, string>;
    dimensions: Record<string, string>;
    safety: Record<string, string>;
    tech: Record<string, string>;
    interior: Record<string, string>;
  };
}
```

### Glossary Data Model

```typescript
interface GlossaryData {
  version: string;
  lastUpdated: string;
  entries: GlossaryEntry[];
}

interface GlossaryEntry {
  term: string;
  explanation: string;
  practicalBenefit: string;
  category: 'mechanical' | 'safety' | 'tech' | 'general';
  aliases?: string[]; // Alternative terms that map to same entry
}
```

### Boot Heuristic Data Model

```typescript
interface BootHeuristicData {
  version: string;
  calculatedAt: string;
  conversionRatios: ConversionRatio;
  methodology: HeuristicMethodology;
  vehicleMappings: BootVehicleMapping[];
}

interface BootVehicleMapping {
  vehicleId: string;
  bootLitres: number;
  luggageEquivalent: LuggageEquivalent;
  dataSource: 'babydrive' | 'estimated';
}
```


### Lifestyle Quiz Data Model

```typescript
interface LifestyleQuizData {
  questions: QuizQuestion[];
  mappingRules: CategoryMappingRule[];
}

interface QuizQuestion {
  id: 'parking' | 'passengers' | 'commute';
  question: string;
  options: QuizOption[];
}

interface QuizOption {
  value: string;
  label: string;
  icon?: string;
}

interface CategoryMappingRule {
  conditions: Record<string, string>; // questionId -> optionValue
  recommendedBodyTypes: string[];
  reasoning: string;
}

interface QuizResults {
  answers: Record<string, string>;
  recommendedBodyTypes: string[];
  completedAt: Date;
}
```

### Feature Filter Data Model

```typescript
interface FeatureFilterConfig {
  features: FilterableFeature[];
}

interface FilterableFeature {
  id: string;
  label: string;
  icon: string;
  specPaths: SpecPath[]; // Where to look in vehicle specs
}

interface SpecPath {
  category: 'tech' | 'interior' | 'safety';
  key: string;
  matchPattern: string | RegExp;
}
```

### AI Summary Data Model

```typescript
interface AISummaryData {
  vehicleIds: string[];
  summary: string;
  tradeOffs: TradeOff[];
  generatedAt: Date;
  model: string;
  confidence: number;
}

interface TradeOff {
  aspect: string;
  winner: string; // vehicle ID
  loser: string; // vehicle ID
  magnitude: 'significant' | 'moderate' | 'minor';
  description: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Diff toggle filters identical specifications

*For any* set of compared vehicles and any specification category, when the diff toggle is activated, all displayed specification rows should have at least one differing value across the compared vehicles.

**Validates: Requirements 1.2**

### Property 2: Hidden specification count accuracy

*For any* comparison state with diff toggle enabled, the displayed count of hidden specifications should equal the actual number of specifications with identical values across all compared vehicles.

**Validates: Requirements 1.3**

### Property 3: Diff toggle round-trip preservation

*For any* comparison screen state, toggling the diff filter on and then off should restore the original display of all specification rows.

**Validates: Requirements 1.4**

### Property 4: Tab context invariant during toggle

*For any* active tab selection, toggling the diff filter on or off should not change which tab is currently active.

**Validates: Requirements 1.5**

### Property 5: Transition animation timing

*For any* diff toggle state change, the transition animation should complete within 300ms.

**Validates: Requirements 1.6**


### Property 6: Best-in-class identification

*For any* set of compared vehicles and any numeric specification in the mechanical category, the system should correctly identify which vehicle(s) have the best value according to the metric's direction (higher-better or lower-better).

**Validates: Requirements 2.1**

### Property 7: Best-in-class badge application

*For any* specification identified as best-in-class, the display should include a visual badge, with the badge applied according to metric direction (highest for power/torque, lowest for fuel consumption).

**Validates: Requirements 2.2, 2.3**

### Property 8: Tied best-in-class values

*For any* specification where multiple vehicles share the best value, all tied vehicles should receive the best-in-class badge.

**Validates: Requirements 2.5**

### Property 9: Boot capacity visualization presence

*For any* vehicle with boot capacity data in the dimensions category, the display should include luggage icon representations alongside the litre value.

**Validates: Requirements 3.1**

### Property 10: Boot capacity heuristic calculation

*For any* boot capacity value in litres, the heuristic model should produce a consistent luggage equivalent (suitcases, prams, grocery bags) based on the calculated conversion ratio.

**Validates: Requirements 3.2, 3.3, 9.2, 9.3, 9.4, 9.6**

### Property 11: Luggage visualization reactivity

*For any* change to the comparison list (adding or removing vehicles), the luggage icon representations should update to reflect the boot capacities of the currently compared vehicles.

**Validates: Requirements 3.6**


### Property 12: Technical term identification

*For any* specification value containing a term present in the glossary, the system should identify and mark that term as interactive for tooltip display.

**Validates: Requirements 4.1**

### Property 13: Tooltip display timing

*For any* technical term on desktop, hovering should trigger tooltip display within 200ms.

**Validates: Requirements 4.2**

### Property 14: Tooltip content completeness

*For any* technical term with a glossary entry, the displayed tooltip should contain both an explanation and practical benefit text.

**Validates: Requirements 4.4**

### Property 15: Lifestyle quiz filtering

*For any* completed quiz with valid answers, the application should filter the vehicle database to show only vehicles whose body types match the quiz-recommended categories.

**Validates: Requirements 5.4**

### Property 16: Quiz results persistence

*For any* completed lifestyle quiz, the results should persist across browser sessions and be retrievable after page reload.

**Validates: Requirements 5.8**

### Property 17: Feature filter AND logic

*For any* set of selected feature filters, the displayed vehicles should include only those vehicles that possess all selected features (AND logic).

**Validates: Requirements 6.3, 6.4**

### Property 18: Feature filter count accuracy

*For any* feature filter selection state, the displayed count of matching vehicles should equal the actual number of vehicles that satisfy all selected filters.

**Validates: Requirements 6.5**


### Property 19: ANCAP test year display

*For any* vehicle with an ANCAP rating, the display should show both the rating and the test year adjacent to each other.

**Validates: Requirements 7.1**

### Property 20: ANCAP age-based styling

*For any* ANCAP rating where the test year is more than 5 years old, the display should apply visual emphasis, with additional warning indicators for ratings more than 7 years old.

**Validates: Requirements 7.2, 7.3**

### Property 21: ANCAP sorting with tiebreaker

*For any* set of vehicles in the safety tab, vehicles should be sorted by ANCAP rating in descending order, with ties broken by test year (newer first).

**Validates: Requirements 7.6**

### Property 22: AI summary generation trigger

*For any* comparison containing two or more vehicles, the system should generate an AI summary.

**Validates: Requirements 8.1**

### Property 23: AI summary category references

*For any* generated AI summary, the text should reference at least one specification category (mechanical, dimensions, safety, tech, or interior).

**Validates: Requirements 8.4**

### Property 24: AI summary reactivity

*For any* change to the comparison list (adding or removing vehicles), the AI summary should regenerate to reflect the new vehicle set.

**Validates: Requirements 8.6**

### Property 25: AI summary trade-off limit

*For any* generated AI summary, the number of trade-offs presented should not exceed three.

**Validates: Requirements 8.7**


### Property 26: BabyDrive vehicle matching

*For any* vehicle in the application database, the heuristic model should correctly identify whether a matching entry exists in the BabyDrive database based on make, model, and year.

**Validates: Requirements 9.1**

### Property 27: Glossary case-insensitive matching

*For any* technical term in the glossary, the system should identify and match that term in specifications regardless of the case (uppercase, lowercase, or mixed case) used in the specification text.

**Validates: Requirements 10.5**

### Property 28: Glossary configuration-driven updates

*For any* new entry added to the glossary configuration file, the term should become available for tooltip display without requiring code changes or redeployment.

**Validates: Requirements 10.3**

## Error Handling

### Diff Toggle Errors

- **Empty Comparison**: When no vehicles are in comparison, diff toggle should be disabled
- **Single Vehicle**: When only one vehicle is in comparison, diff toggle should be disabled (no differences possible)
- **Animation Failure**: If animation framework fails, fall back to instant state change

### Best-in-Class Calculation Errors

- **Non-numeric Values**: Skip best-in-class calculation for specifications with non-numeric values
- **Missing Data**: Treat missing values as non-participants in best-in-class determination
- **Parsing Errors**: Log parsing errors and exclude affected values from calculation

### Boot Visualizer Errors

- **Missing Boot Capacity**: Display dash placeholder without luggage icons
- **Invalid Capacity Values**: Log error and display raw value without visualization
- **Heuristic Calculation Failure**: Fall back to simple litre-to-suitcase ratio (e.g., 200L per suitcase)
- **BabyDrive API Unavailable**: Use cached conversion ratios or industry-standard estimates


### Technical Term Tooltip Errors

- **Glossary Load Failure**: Disable tooltip functionality and log error
- **Missing Glossary Entry**: Do not display tooltip for undefined terms
- **Tooltip Positioning Overflow**: Adjust tooltip position to stay within viewport bounds
- **Mobile Dismiss Failure**: Provide alternative dismiss methods (tap outside, close button)

### Lifestyle Quiz Errors

- **Incomplete Answers**: Disable completion until all questions answered
- **Invalid Answer Values**: Reject invalid inputs and show validation message
- **Persistence Failure**: Continue with in-memory state and warn user about lack of persistence
- **Mapping Rule Errors**: Fall back to showing all vehicles if mapping logic fails

### Feature Filter Errors

- **Unknown Feature**: Log warning and ignore unknown feature selections
- **Spec Path Resolution Failure**: Skip features that cannot be resolved in vehicle specs
- **Empty Result Set**: Display helpful message suggesting filter adjustment
- **Filter State Corruption**: Provide clear-all button to reset to known good state

### ANCAP Context Errors

- **Missing Test Year**: Display rating with data-unavailable indicator
- **Invalid Test Year**: Validate year is reasonable (e.g., 1990-current year + 1)
- **Future Test Year**: Treat as current year for age calculations
- **Sorting Errors**: Fall back to alphabetical sorting if ANCAP sorting fails

### AI Summary Errors

- **Generation Timeout**: Display loading state with timeout message after 10 seconds
- **API Failure**: Show error message with retry button
- **Invalid Response**: Log error and hide summary section
- **Rate Limiting**: Queue requests and show "generating..." state
- **Insufficient Data**: Display message that summary requires at least 2 vehicles


### Heuristic Model Errors

- **Insufficient BabyDrive Matches**: Use industry-standard volume estimates
- **Conversion Ratio Calculation Failure**: Fall back to default ratios (200L/suitcase, 300L/pram, 50L/grocery bag)
- **Data Format Errors**: Validate and sanitize BabyDrive data before processing
- **Negative or Zero Capacity**: Treat as invalid and display dash placeholder

### Glossary Management Errors

- **Malformed JSON**: Fail gracefully and disable glossary features
- **Duplicate Terms**: Use first occurrence and log warning
- **Missing Required Fields**: Skip entries without term or explanation
- **Load Timeout**: Retry once, then disable glossary features

### PWA Manifest Errors

- **Missing Icon Files**: Browser will fall back to favicon
- **Invalid Icon Sizes**: Browser will use closest available size
- **Manifest Parse Error**: PWA installation will fail but app remains functional
- **Icon Format Mismatch**: Ensure PNG files are actually PNG format

## Testing Strategy

### Dual Testing Approach

This feature will employ both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, error conditions, and integration points
- **Property Tests**: Verify universal properties across randomized inputs

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide input space.

### Property-Based Testing Configuration

**Library Selection**: 
- **JavaScript/TypeScript**: Use `fast-check` library for property-based testing
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property using a comment tag

**Tag Format**: 
```typescript
// Feature: vehicle-comparison-enhancements, Property 1: Diff toggle filters identical specifications
```


### Unit Testing Focus Areas

**Requirement 1 - Diff Toggle**:
- Example: Verify toggle button exists and has correct CSS positioning
- Example: Test with specific vehicle set where 2 specs differ and 5 are identical
- Edge case: Single vehicle comparison (toggle should be disabled)
- Edge case: Empty comparison (toggle should be disabled)

**Requirement 2 - Best-in-Class Highlighting**:
- Example: Verify gold badge icon is distinct from green/red/blue highlights
- Example: Test specific case with 3 vehicles where one has highest power
- Edge case: All vehicles have identical values (all should get badge)
- Edge case: Non-numeric values (should skip highlighting)

**Requirement 3 - Boot Visualizer**:
- Example: Verify info button exists adjacent to boot capacity
- Example: Test specific capacity (500L) produces expected luggage icons
- Edge case: Missing boot capacity data (should show dash only)
- Edge case: Zero or negative capacity (should show dash only)

**Requirement 4 - Technical Term Tooltips**:
- Example: Verify glossary is loaded and accessible
- Example: Test specific term "ADAS" displays correct tooltip
- Edge case: Term not in glossary (should not show tooltip)
- Edge case: Tooltip positioning near viewport edge

**Requirement 5 - Lifestyle Quiz**:
- Example: Verify quiz is accessible from search screen
- Example: Verify exactly 3 questions are presented
- Example: Verify questions cover parking, passengers, and commute
- Example: Test reset functionality clears quiz state
- Integration: Test quiz results filter vehicle list correctly

**Requirement 6 - Feature Filters**:
- Example: Verify filter controls exist on search screen
- Example: Verify filters include CarPlay, Android Auto, Heated Seats, 360 Camera
- Example: Test clear-all button resets all filters
- Edge case: No vehicles match selected filters (show helpful message)

**Requirement 7 - ANCAP Context**:
- Example: Verify tooltip explains rating age implications
- Edge case: Rating exists but test year missing (show data-unavailable indicator)
- Edge case: Invalid test year (validate and handle gracefully)

**Requirement 8 - AI Summary**:
- Example: Verify summary appears at top of comparison screen
- Example: Test with 2 very similar vehicles (should state minimal differences)
- Integration: Test summary updates when vehicle added/removed

**Requirement 9 - Heuristic Model**:
- Example: Verify standard luggage units are defined
- Example: Verify methodology is stored and retrievable
- Edge case: Insufficient BabyDrive matches (use industry standards)

**Requirement 10 - Glossary**:
- Example: Verify glossary is stored in structured JSON format
- Example: Verify glossary includes required terms (Torque Converter, Regenerative Braking, ADAS, DOHC, VVT, ABS)
- Example: Verify glossary stores term and explanation as key-value pairs

**Requirement 11 - PWA Icon**:
- Example: Verify manifest references /images/logo/mobile_app_icon.png
- Example: Verify icon configuration includes 192x192 and 512x512 sizes
- Example: Verify purpose attribute is "any maskable"
- Example: Verify type attribute is "image/png"
- Example: Verify favicon.svg is retained for browser tabs


### Property-Based Testing Focus Areas

Each correctness property will be implemented as a single property-based test:

**Property 1 - Diff toggle filters identical specifications**:
- Generate: Random sets of 2-3 vehicles with varying spec similarities
- Test: All visible rows have at least one difference when toggle is on
- Iterations: 100

**Property 2 - Hidden specification count accuracy**:
- Generate: Random vehicle sets and categories
- Test: Displayed count equals actual count of identical specs
- Iterations: 100

**Property 3 - Diff toggle round-trip preservation**:
- Generate: Random comparison states
- Test: Toggle on then off restores original state
- Iterations: 100

**Property 4 - Tab context invariant during toggle**:
- Generate: Random tab selections and toggle states
- Test: Active tab unchanged after toggle
- Iterations: 100

**Property 5 - Transition animation timing**:
- Generate: Random toggle state changes
- Test: Animation completes within 300ms
- Iterations: 100

**Property 6 - Best-in-class identification**:
- Generate: Random numeric specifications across vehicles
- Test: Correct vehicle(s) identified as best based on metric direction
- Iterations: 100

**Property 7 - Best-in-class badge application**:
- Generate: Random best-in-class scenarios
- Test: Badge present for best values with correct direction logic
- Iterations: 100

**Property 8 - Tied best-in-class values**:
- Generate: Random vehicle sets with tied best values
- Test: All tied vehicles receive badge
- Iterations: 100

**Property 9 - Boot capacity visualization presence**:
- Generate: Random vehicles with boot capacity data
- Test: Luggage icons present alongside litre value
- Iterations: 100

**Property 10 - Boot capacity heuristic calculation**:
- Generate: Random boot capacity values
- Test: Consistent luggage equivalent for same input
- Iterations: 100

**Property 11 - Luggage visualization reactivity**:
- Generate: Random comparison list changes
- Test: Luggage icons update to match current vehicles
- Iterations: 100

**Property 12 - Technical term identification**:
- Generate: Random spec values containing glossary terms
- Test: Terms are marked as interactive
- Iterations: 100

**Property 13 - Tooltip display timing**:
- Generate: Random hover events on technical terms
- Test: Tooltip appears within 200ms
- Iterations: 100

**Property 14 - Tooltip content completeness**:
- Generate: Random glossary terms
- Test: Tooltip contains explanation and benefit
- Iterations: 100

**Property 15 - Lifestyle quiz filtering**:
- Generate: Random quiz answer combinations
- Test: Filtered vehicles match recommended categories
- Iterations: 100

**Property 16 - Quiz results persistence**:
- Generate: Random quiz completions
- Test: Results survive page reload
- Iterations: 100

**Property 17 - Feature filter AND logic**:
- Generate: Random feature filter combinations
- Test: Results contain only vehicles with all selected features
- Iterations: 100

**Property 18 - Feature filter count accuracy**:
- Generate: Random filter selections
- Test: Displayed count equals actual filtered count
- Iterations: 100

**Property 19 - ANCAP test year display**:
- Generate: Random vehicles with ANCAP ratings
- Test: Both rating and year displayed together
- Iterations: 100

**Property 20 - ANCAP age-based styling**:
- Generate: Random ANCAP test years relative to current year
- Test: Correct styling applied based on age thresholds
- Iterations: 100

**Property 21 - ANCAP sorting with tiebreaker**:
- Generate: Random vehicle sets with ANCAP data
- Test: Sorted by rating desc, then by year desc
- Iterations: 100

**Property 22 - AI summary generation trigger**:
- Generate: Random comparison lists of varying sizes
- Test: Summary generated when 2+ vehicles present
- Iterations: 100

**Property 23 - AI summary category references**:
- Generate: Random vehicle comparisons
- Test: Summary text contains at least one category name
- Iterations: 100

**Property 24 - AI summary reactivity**:
- Generate: Random comparison list modifications
- Test: Summary regenerates on change
- Iterations: 100

**Property 25 - AI summary trade-off limit**:
- Generate: Random vehicle comparisons
- Test: Trade-off count <= 3
- Iterations: 100

**Property 26 - BabyDrive vehicle matching**:
- Generate: Random vehicle identifiers
- Test: Matching logic correctly identifies BabyDrive entries
- Iterations: 100

**Property 27 - Glossary case-insensitive matching**:
- Generate: Random case variations of glossary terms
- Test: All variations matched correctly
- Iterations: 100

**Property 28 - Glossary configuration-driven updates**:
- Generate: Random new glossary entries
- Test: New entries available without code changes
- Iterations: 100

### Test Data Generation

**Vehicle Generator**:
```typescript
const arbitraryVehicle = fc.record({
  id: fc.string(),
  make: fc.constantFrom('Toyota', 'Mazda', 'Honda', 'Ford'),
  model: fc.string(),
  year: fc.integer({ min: 2018, max: 2026 }),
  variant: fc.string(),
  body_type: fc.constantFrom('Sedan', 'SUV', 'Hatchback', 'Wagon'),
  fuel_type: fc.constantFrom('Petrol', 'Diesel', 'Hybrid', 'Electric'),
  ancap_rating: fc.integer({ min: 1, max: 5 }),
  ancap_test_year: fc.option(fc.integer({ min: 2010, max: 2025 })),
  specs: fc.record({
    mechanical: fc.dictionary(fc.string(), fc.string()),
    dimensions: fc.dictionary(fc.string(), fc.string()),
    safety: fc.dictionary(fc.string(), fc.string()),
    tech: fc.dictionary(fc.string(), fc.string()),
    interior: fc.dictionary(fc.string(), fc.string())
  })
});
```

### Integration Testing

- Test interaction between diff toggle and best-in-class highlighting
- Test interaction between lifestyle quiz and feature filters
- Test interaction between boot visualizer and comparison list changes
- Test interaction between ANCAP context and sorting behavior
- Test AI summary generation with various vehicle combinations

### Performance Testing

- Measure diff toggle animation timing under various loads
- Measure tooltip display latency
- Measure AI summary generation time
- Measure heuristic calculation performance with large datasets
- Measure glossary lookup performance

### Accessibility Testing

- Verify keyboard navigation for all interactive elements
- Verify screen reader announcements for dynamic content
- Verify color contrast for best-in-class badges and ANCAP warnings
- Verify focus management for modals and tooltips
- Verify ARIA labels and roles for custom components

