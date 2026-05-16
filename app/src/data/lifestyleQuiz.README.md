# Lifestyle Quiz Data Models

This directory contains the data models and configuration for the Lifestyle Quiz feature (Requirement 5).

## Files

### `lifestyleQuiz.ts`
Contains the quiz configuration and helper functions:
- **QUIZ_QUESTIONS**: Array of 3 questions covering parking, passengers, and commute
- **CATEGORY_MAPPING_RULES**: Rules that map quiz answers to vehicle body type recommendations
- **LIFESTYLE_QUIZ_CONFIG**: Complete configuration combining questions and rules
- **getRecommendedBodyTypes()**: Helper function to determine recommended body types based on answers
- **getRecommendationReasons()**: Helper function to get reasoning for recommendations

### `../types/lifestyleQuiz.ts`
TypeScript type definitions:
- **QuizOption**: Single option within a question
- **QuizQuestion**: Single quiz question with options
- **CategoryMappingRule**: Rule mapping answers to body types
- **QuizResults**: Results from a completed quiz
- **LifestyleQuizData**: Complete quiz data structure

## Quiz Questions

### 1. Parking Environment
**Question**: "Where do you typically park your vehicle?"

**Options**:
- `tight-city`: Tight city streets or small parking spaces
- `suburban`: Suburban driveways or standard parking lots
- `spacious`: Spacious garage or large parking areas

### 2. Passenger Requirements
**Question**: "How many passengers do you typically carry?"

**Options**:
- `solo-couple`: Just me or 1-2 people
- `small-family`: Small family (3-5 people)
- `large-group`: Large family or groups (6+ people)

### 3. Commute Distance
**Question**: "What is your typical daily commute distance?"

**Options**:
- `short`: Short city trips (under 20km per day)
- `medium`: Moderate commute (20-60km per day)
- `long`: Long distance (over 60km per day)

## Mapping Rules

The quiz uses a rule-based system to recommend vehicle body types. Rules are evaluated in order, and multiple rules can match. The final recommendation is the union of all matching rules.

### Example Rules

**Tight City Parking + Solo/Couple + Short Commute**
- Recommends: Hatchback
- Reasoning: Compact hatchbacks are ideal for tight city parking, easy to maneuver, and efficient for short trips

**Suburban Parking + Small Family**
- Recommends: Sedan, SUV, Wagon
- Reasoning: Family-friendly vehicles with good space for passengers and cargo, suitable for standard parking

**Large Group Passengers** (overrides other factors)
- Recommends: SUV, Van, People Mover
- Reasoning: Vehicles with 6+ seating capacity are essential for large families or groups

## Usage Example

```typescript
import { LIFESTYLE_QUIZ_CONFIG, getRecommendedBodyTypes, getRecommendationReasons } from './data/lifestyleQuiz';

// Display quiz questions
LIFESTYLE_QUIZ_CONFIG.questions.forEach(question => {
  console.log(question.question);
  question.options.forEach(option => {
    console.log(`  - ${option.label}`);
  });
});

// Get recommendations based on user answers
const userAnswers = {
  parking: 'tight-city',
  passengers: 'solo-couple',
  commute: 'short'
};

const recommendedBodyTypes = getRecommendedBodyTypes(userAnswers);
console.log('Recommended body types:', recommendedBodyTypes);
// Output: ['Hatchback', 'Sedan']

const reasons = getRecommendationReasons(userAnswers);
console.log('Reasons:', reasons);
// Output: Array of reasoning strings explaining why these body types are recommended
```

## Requirements Validation

This implementation validates the following requirements:

- **Requirement 5.2**: Quiz presents exactly three questions ✓
- **Requirement 5.3**: Questions cover parking environment, passenger requirements, and commute distance ✓
- **Requirement 5.5**: Mapping rules translate quiz responses to vehicle recommendations ✓

## Future Enhancements

- Add more granular mapping rules based on user feedback
- Include fuel type preferences in recommendations
- Add budget considerations to the quiz
- Support for custom user-defined priorities
