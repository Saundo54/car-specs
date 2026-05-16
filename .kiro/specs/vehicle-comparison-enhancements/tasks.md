# Implementation Plan: Vehicle Comparison Enhancements

## Overview

This implementation plan breaks down the 11 enhancement features into discrete coding tasks. The approach follows a layered implementation strategy: data layer first, then services, then components, and finally integration. Each task builds incrementally to ensure continuous validation and early detection of issues.

## Tasks

- [ ] 1. Set up data infrastructure and type definitions
  - [x] 1.1 Create extended VehicleSpec type with ancap_test_year field
    - Add ancap_test_year as optional field to VehicleSpec interface
    - Update vehicles.json data file with ANCAP test year data for existing vehicles
    - _Requirements: 7.1_
  
  - [x] 1.2 Create glossary data structure and initial glossary.json file
    - Define GlossaryEntry and GlossaryData interfaces
    - Create /public/data/glossary.json with initial terms (Torque Converter, Regenerative Braking, ADAS, DOHC, VVT, ABS)
    - Include term, explanation, practicalBenefit, and category fields for each entry
    - _Requirements: 10.1, 10.2, 10.4_
  
  - [x] 1.3 Create boot heuristic data models
    - Define BootHeuristicData, ConversionRatio, LuggageEquivalent, and BootVehicleMapping interfaces
    - Define standard luggage unit volumes (large suitcase, pram, grocery bag)
    - _Requirements: 9.5_
  
  - [x] 1.4 Create lifestyle quiz data models
    - Define QuizQuestion, QuizOption, QuizResults, and CategoryMappingRule interfaces
    - Create quiz configuration with 3 questions (parking, passengers, commute)
    - Define mapping rules from quiz answers to vehicle body types
    - _Requirements: 5.2, 5.3, 5.5_
  
  - [x] 1.5 Create feature filter data models
    - Define FeatureFilterConfig, FilterableFeature, and SpecPath interfaces
    - Configure filterable features: Apple CarPlay, Android Auto, Heated Seats, 360 Camera
    - Define spec paths for each feature (category, key, matchPattern)
    - _Requirements: 6.2_

- [ ] 2. Implement service layer components
  - [~] 2.1 Implement GlossaryManager service
    - Create loadGlossary() method to fetch and parse glossary.json
    - Implement getEntry() with case-insensitive term matching
    - Implement getAllTerms(), addEntry(), and updateEntry() methods
    - _Requirements: 10.3, 10.5, 10.6_
  
  - [~] 2.2 Write property test for GlossaryManager
    - **Property 27: Glossary case-insensitive matching**
    - **Validates: Requirements 10.5**
  
  - [~] 2.3 Write unit tests for GlossaryManager
    - Test glossary loading and parsing
    - Test case-insensitive matching with various case combinations
    - Test error handling for malformed JSON and missing fields
    - _Requirements: 10.1, 10.5_
  
  - [~] 2.4 Implement BootHeuristicService
    - Create matchVehicleToBabyDrive() method for cross-referencing
    - Implement calculateConversionRatio() using BabyDrive data
    - Implement estimateLuggageCapacity() with fallback to industry standards
    - Implement getMethodology() for transparency
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.7, 9.8_
  
  - [~] 2.5 Write property test for BootHeuristicService
    - **Property 10: Boot capacity heuristic calculation**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.6**
  
  - [~] 2.6 Write property test for BabyDrive matching
    - **Property 26: BabyDrive vehicle matching**
    - **Validates: Requirements 9.1**
  
  - [~] 2.7 Write unit tests for BootHeuristicService
    - Test conversion ratio calculation with known BabyDrive data
    - Test luggage estimation for various boot capacities
    - Test fallback behavior when BabyDrive data unavailable
    - _Requirements: 9.1, 9.4, 9.7_
  
  - [~] 2.8 Implement BestInClassCalculator service
    - Create calculateBest() method for identifying best values
    - Implement metric direction detection (higher-better vs lower-better)
    - Handle tied values and non-numeric values
    - _Requirements: 2.1, 2.2, 2.3, 2.5_
  
  - [~] 2.9 Write property test for BestInClassCalculator
    - **Property 6: Best-in-class identification**
    - **Validates: Requirements 2.1**
  
  - [~] 2.10 Write property test for tied best-in-class values
    - **Property 8: Tied best-in-class values**
    - **Validates: Requirements 2.5**
  
  - [~] 2.11 Write unit tests for BestInClassCalculator
    - Test higher-better metrics (power, torque)
    - Test lower-better metrics (fuel consumption)
    - Test tied values scenario
    - Test non-numeric value handling
    - _Requirements: 2.1, 2.2, 2.3, 2.5_
  
  - [~] 2.12 Implement FeatureFilterService
    - Create filterVehicles() method with AND logic for multiple features
    - Implement hasFeature() method to check feature presence in vehicle specs
    - Handle spec path resolution and pattern matching
    - _Requirements: 6.3, 6.4_
  
  - [~] 2.13 Write property test for FeatureFilterService
    - **Property 17: Feature filter AND logic**
    - **Validates: Requirements 6.3, 6.4**
  
  - [~] 2.14 Write unit tests for FeatureFilterService
    - Test single feature filtering
    - Test multiple feature filtering with AND logic
    - Test empty result handling
    - Test unknown feature handling
    - _Requirements: 6.3, 6.4_
  
  - [~] 2.15 Implement ANCAPService
    - Create getWarningLevel() method based on test year age
    - Implement shouldEmphasize() for 5+ year old ratings
    - Define warning thresholds (5 years = caution, 7 years = warning)
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [~] 2.16 Write property test for ANCAPService
    - **Property 20: ANCAP age-based styling**
    - **Validates: Requirements 7.2, 7.3**
  
  - [~] 2.17 Write unit tests for ANCAPService
    - Test warning level calculation for various age ranges
    - Test emphasis logic for 5+ year old ratings
    - Test edge cases (missing test year, future test year)
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ] 3. Checkpoint - Ensure all service layer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement UI components for Requirement 1 (Diff Toggle)
  - [~] 4.1 Create DiffToggle component
    - Implement toggle button with enabled/disabled states
    - Add sticky positioning (position: sticky) for scroll persistence
    - Display difference count and identical count
    - Wire up onToggle callback
    - _Requirements: 1.1_
  
  - [~] 4.2 Enhance ComparisonScreen with diff filtering logic
    - Add diff toggle state management
    - Implement spec row filtering to hide identical values
    - Add summary indicator showing count of hidden specs
    - Maintain tab context during toggle state changes
    - _Requirements: 1.2, 1.3, 1.4, 1.5_
  
  - [~] 4.3 Add Framer Motion animations for diff toggle transitions
    - Implement 300ms transition animation for collapse/expand
    - Use Framer Motion AnimatePresence for smooth transitions
    - _Requirements: 1.6_
  
  - [~] 4.4 Write property test for diff toggle filtering
    - **Property 1: Diff toggle filters identical specifications**
    - **Validates: Requirements 1.2**
  
  - [~] 4.5 Write property test for hidden spec count
    - **Property 2: Hidden specification count accuracy**
    - **Validates: Requirements 1.3**
  
  - [~] 4.6 Write property test for diff toggle round-trip
    - **Property 3: Diff toggle round-trip preservation**
    - **Validates: Requirements 1.4**
  
  - [~] 4.7 Write property test for tab context invariant
    - **Property 4: Tab context invariant during toggle**
    - **Validates: Requirements 1.5**
  
  - [~] 4.8 Write property test for animation timing
    - **Property 5: Transition animation timing**
    - **Validates: Requirements 1.6**
  
  - [~] 4.9 Write unit tests for DiffToggle component
    - Test toggle button rendering and interaction
    - Test count display accuracy
    - Test disabled state for single/empty comparisons
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 5. Implement UI components for Requirement 2 (Best-in-Class Highlighting)
  - [~] 5.1 Create SpecHighlightBadge component
    - Implement gold badge icon (⭐) for best-in-class values
    - Add distinct styling separate from existing green/red/blue highlights
    - Support both higher-better and lower-better metric types
    - _Requirements: 2.2, 2.3, 2.4, 2.6_
  
  - [~] 5.2 Integrate BestInClassCalculator into ComparisonScreen
    - Calculate best-in-class values for mechanical category specs
    - Apply SpecHighlightBadge to best values
    - Handle tied values by applying badge to all
    - _Requirements: 2.1, 2.5_
  
  - [~] 5.3 Write property test for best-in-class badge application
    - **Property 7: Best-in-class badge application**
    - **Validates: Requirements 2.2, 2.3**
  
  - [~] 5.4 Write unit tests for SpecHighlightBadge
    - Test badge rendering for best-in-class values
    - Test distinct styling from existing highlights
    - Test visibility without scrolling
    - _Requirements: 2.2, 2.4, 2.6_

- [ ] 6. Implement UI components for Requirement 3 (Boot Visualizer)
  - [~] 6.1 Create BootVisualizer component
    - Display luggage icons (suitcases, prams, grocery bags) alongside litre value
    - Integrate BootHeuristicService for luggage equivalent calculation
    - Add info button adjacent to visualization
    - Handle missing boot capacity data with dash placeholder
    - _Requirements: 3.1, 3.2, 3.7_
  
  - [~] 6.2 Create methodology info modal
    - Display heuristic model explanation
    - Show BabyDrive database cross-reference information
    - Display conversion ratios and confidence level
    - _Requirements: 3.4, 3.5_
  
  - [~] 6.3 Integrate BootVisualizer into ComparisonScreen dimensions tab
    - Add BootVisualizer to boot capacity spec rows
    - Ensure visualization updates when vehicles added/removed
    - _Requirements: 3.1, 3.6_
  
  - [~] 6.4 Write property test for boot capacity visualization presence
    - **Property 9: Boot capacity visualization presence**
    - **Validates: Requirements 3.1**
  
  - [~] 6.5 Write property test for luggage visualization reactivity
    - **Property 11: Luggage visualization reactivity**
    - **Validates: Requirements 3.6**
  
  - [~] 6.6 Write unit tests for BootVisualizer
    - Test luggage icon rendering for specific capacities
    - Test info button functionality
    - Test missing data handling
    - Test zero/negative capacity handling
    - _Requirements: 3.1, 3.4, 3.7_

- [ ] 7. Implement UI components for Requirement 4 (Technical Term Tooltips)
  - [~] 7.1 Create TermTooltip component
    - Implement hover-triggered tooltip for desktop (200ms delay)
    - Implement tap-triggered tooltip for mobile with dismiss overlay
    - Display explanation and practical benefit text
    - Handle viewport overflow with position adjustment
    - _Requirements: 4.2, 4.3, 4.4, 4.5_
  
  - [~] 7.2 Integrate GlossaryManager and identify technical terms in specs
    - Scan specification values for glossary terms
    - Wrap identified terms with TermTooltip component
    - Use case-insensitive matching
    - _Requirements: 4.1, 4.6, 4.7_
  
  - [~] 7.3 Write property test for technical term identification
    - **Property 12: Technical term identification**
    - **Validates: Requirements 4.1**
  
  - [~] 7.4 Write property test for tooltip display timing
    - **Property 13: Tooltip display timing**
    - **Validates: Requirements 4.2**
  
  - [~] 7.5 Write property test for tooltip content completeness
    - **Property 14: Tooltip content completeness**
    - **Validates: Requirements 4.4**
  
  - [~] 7.6 Write unit tests for TermTooltip
    - Test tooltip rendering and positioning
    - Test hover and tap interactions
    - Test dismiss functionality on mobile
    - Test viewport overflow handling
    - _Requirements: 4.2, 4.3, 4.4_

- [ ] 8. Checkpoint - Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement UI components for Requirement 5 (Lifestyle Quiz)
  - [~] 9.1 Create LifestyleQuiz component
    - Implement 3-question flow (parking, passengers, commute)
    - Create single-select option interface for each question
    - Add info button explaining filtering logic
    - Implement reset/retake functionality
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.7_
  
  - [~] 9.2 Implement quiz results filtering logic
    - Map quiz answers to recommended vehicle body types using CategoryMappingRule
    - Filter vehicle database based on quiz results
    - Store results in Zustand with persistence middleware
    - _Requirements: 5.4, 5.8_
  
  - [~] 9.3 Create info modal explaining recommendation algorithm
    - Display mapping rules from answers to body types
    - Show reasoning for recommendations
    - _Requirements: 5.6_
  
  - [~] 9.4 Integrate LifestyleQuiz into SearchScreen
    - Add quiz entry point on search screen
    - Apply quiz filtering to vehicle list
    - Display active quiz filter indicator
    - _Requirements: 5.1, 5.4_
  
  - [~] 9.5 Write property test for lifestyle quiz filtering
    - **Property 15: Lifestyle quiz filtering**
    - **Validates: Requirements 5.4**
  
  - [~] 9.6 Write property test for quiz results persistence
    - **Property 16: Quiz results persistence**
    - **Validates: Requirements 5.8**
  
  - [~] 9.7 Write unit tests for LifestyleQuiz
    - Test quiz rendering and question flow
    - Test answer selection and validation
    - Test reset functionality
    - Test persistence across sessions
    - _Requirements: 5.1, 5.2, 5.3, 5.7, 5.8_

- [ ] 10. Implement UI components for Requirement 6 (Feature Filters)
  - [~] 10.1 Create FeatureFilterChecklist component
    - Implement checkbox-based multi-select interface
    - Display matching vehicle count in real-time
    - Add clear-all button
    - Show empty state message when no matches
    - _Requirements: 6.1, 6.5, 6.6, 6.7_
  
  - [~] 10.2 Integrate FeatureFilterService into SearchScreen
    - Apply feature filters to vehicle list with AND logic
    - Update matching count as selections change
    - _Requirements: 6.3, 6.4, 6.5_
  
  - [~] 10.3 Write property test for feature filter count accuracy
    - **Property 18: Feature filter count accuracy**
    - **Validates: Requirements 6.5**
  
  - [~] 10.4 Write unit tests for FeatureFilterChecklist
    - Test checkbox rendering and interaction
    - Test clear-all functionality
    - Test empty state display
    - Test count accuracy
    - _Requirements: 6.1, 6.5, 6.6, 6.7_

- [ ] 11. Implement UI components for Requirement 7 (ANCAP Context)
  - [~] 11.1 Create ANCAPContextDisplay component
    - Display ANCAP rating and test year adjacent to each other
    - Apply visual emphasis for ratings older than 5 years
    - Add warning indicator for ratings older than 7 years
    - Add tooltip explaining rating age implications
    - Handle missing test year with data-unavailable indicator
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [~] 11.2 Implement ANCAP sorting in ComparisonScreen safety tab
    - Sort vehicles by ANCAP rating (descending)
    - Use test year as tiebreaker (newer first)
    - _Requirements: 7.6_
  
  - [~] 11.3 Write property test for ANCAP test year display
    - **Property 19: ANCAP test year display**
    - **Validates: Requirements 7.1**
  
  - [~] 11.4 Write property test for ANCAP sorting with tiebreaker
    - **Property 21: ANCAP sorting with tiebreaker**
    - **Validates: Requirements 7.6**
  
  - [~] 11.5 Write unit tests for ANCAPContextDisplay
    - Test rating and year display
    - Test emphasis styling for old ratings
    - Test warning indicator for very old ratings
    - Test tooltip content
    - Test missing test year handling
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12. Implement UI components for Requirement 8 (AI Summary)
  - [~] 12.1 Create AIService for summary generation
    - Implement generateSummary() method (feasibility assessment phase)
    - Implement extractTradeOffs() to identify key differences
    - Limit trade-offs to maximum of 3
    - Use plain English without technical jargon
    - Handle similar vehicles with minimal differences message
    - _Requirements: 8.3, 8.4, 8.5, 8.7, 8.8, 8.9_
  
  - [~] 12.2 Create AISummaryCard component
    - Display summary at top of comparison screen
    - Show loading state during generation
    - Display trade-offs with category references
    - Handle generation errors with retry button
    - _Requirements: 8.2, 8.4_
  
  - [~] 12.3 Integrate AISummaryCard into ComparisonScreen
    - Trigger summary generation when 2+ vehicles compared
    - Regenerate summary when vehicles added/removed
    - _Requirements: 8.1, 8.6_
  
  - [~] 12.4 Write property test for AI summary generation trigger
    - **Property 22: AI summary generation trigger**
    - **Validates: Requirements 8.1**
  
  - [~] 12.5 Write property test for AI summary category references
    - **Property 23: AI summary category references**
    - **Validates: Requirements 8.4**
  
  - [~] 12.6 Write property test for AI summary reactivity
    - **Property 24: AI summary reactivity**
    - **Validates: Requirements 8.6**
  
  - [~] 12.7 Write property test for AI summary trade-off limit
    - **Property 25: AI summary trade-off limit**
    - **Validates: Requirements 8.7**
  
  - [~] 12.8 Write unit tests for AIService and AISummaryCard
    - Test summary generation with various vehicle combinations
    - Test trade-off extraction and limiting
    - Test plain English output
    - Test error handling and retry
    - _Requirements: 8.1, 8.3, 8.4, 8.5, 8.7, 8.8_

- [ ] 13. Implement Requirement 10 (Glossary Configuration)
  - [~] 13.1 Verify glossary.json structure and configuration-driven updates
    - Ensure glossary is loaded at app initialization
    - Test adding new terms without code changes
    - Verify case-insensitive matching works across all components
    - _Requirements: 10.3, 10.5, 10.6_
  
  - [~] 13.2 Write property test for glossary configuration-driven updates
    - **Property 28: Glossary configuration-driven updates**
    - **Validates: Requirements 10.3**
  
  - [~] 13.3 Write integration tests for glossary system
    - Test glossary loading and term availability
    - Test configuration updates without deployment
    - _Requirements: 10.3, 10.6_

- [ ] 14. Implement Requirement 11 (PWA Mobile Icon)
  - [~] 14.1 Update manifest.webmanifest with mobile app icon configuration
    - Add icon entries for 192x192 and 512x512 sizes
    - Set src to /images/logo/mobile_app_icon.png
    - Set type to "image/png"
    - Set purpose to "any maskable"
    - Retain existing favicon.svg for browser tabs
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.7_
  
  - [~] 14.2 Write unit tests for PWA manifest configuration
    - Verify manifest references correct icon path
    - Verify size entries (192x192, 512x512)
    - Verify purpose attribute is "any maskable"
    - Verify type attribute is "image/png"
    - Verify favicon.svg retained for browser tabs
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.7_
  
  - [~] 14.3 Test PWA installation on mobile device
    - Install PWA to mobile home screen
    - Verify mobile_app_icon.png displays correctly
    - _Requirements: 11.6_

- [ ] 15. Final integration and end-to-end testing
  - [~] 15.1 Test interaction between diff toggle and best-in-class highlighting
    - Verify best-in-class badges remain visible when diff toggle is active
    - Verify badges update correctly when toggle state changes
    - _Requirements: 1.2, 2.2_
  
  - [~] 15.2 Test interaction between lifestyle quiz and feature filters
    - Verify quiz filtering and feature filtering work together correctly
    - Verify combined filters produce accurate results
    - _Requirements: 5.4, 6.3_
  
  - [~] 15.3 Test boot visualizer with comparison list changes
    - Verify luggage icons update when vehicles added/removed
    - Verify info modal displays correct methodology
    - _Requirements: 3.6, 3.5_
  
  - [~] 15.4 Test ANCAP context display and sorting
    - Verify sorting works correctly in safety tab
    - Verify emphasis and warnings display correctly
    - _Requirements: 7.2, 7.3, 7.6_
  
  - [ ] 15.5 Test AI summary with various vehicle combinations
    - Verify summary generates for 2+ vehicles
    - Verify summary updates when vehicles change
    - Verify trade-off limit is respected
    - _Requirements: 8.1, 8.6, 8.7_
  
  - [ ] 15.6 Write integration tests for complete feature set
    - Test all features working together
    - Test state persistence across sessions
    - Test error handling and graceful degradation

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples, edge cases, and integration points
- Implementation uses TypeScript with React 19.2.5 and existing tech stack
- All state management flows through Zustand store with persistence middleware
- Components follow existing project patterns and styling conventions
