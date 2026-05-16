/**
 * Lifestyle Quiz configuration data
 * Part of Requirement 5: Everyday Lifestyle Match Quiz
 * 
 * This configuration defines the three quiz questions (parking, passengers, commute)
 * and the mapping rules that translate answers into vehicle body type recommendations.
 */

import type { LifestyleQuizData, QuizQuestion, CategoryMappingRule } from '../types/lifestyleQuiz';

/**
 * Quiz questions covering parking environment, passenger requirements, and commute distance
 * Validates: Requirements 5.2, 5.3
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'parking',
    question: 'Where do you typically park your vehicle?',
    options: [
      {
        value: 'tight-city',
        label: 'Tight city streets or small parking spaces',
        icon: 'parking-tight'
      },
      {
        value: 'suburban',
        label: 'Suburban driveways or standard parking lots',
        icon: 'parking-standard'
      },
      {
        value: 'spacious',
        label: 'Spacious garage or large parking areas',
        icon: 'parking-spacious'
      }
    ]
  },
  {
    id: 'passengers',
    question: 'How many passengers do you typically carry?',
    options: [
      {
        value: 'solo-couple',
        label: 'Just me or 1-2 people',
        icon: 'passengers-few'
      },
      {
        value: 'small-family',
        label: 'Small family (3-5 people)',
        icon: 'passengers-family'
      },
      {
        value: 'large-group',
        label: 'Large family or groups (6+ people)',
        icon: 'passengers-many'
      }
    ]
  },
  {
    id: 'commute',
    question: 'What is your typical daily commute distance?',
    options: [
      {
        value: 'short',
        label: 'Short city trips (under 20km per day)',
        icon: 'commute-short'
      },
      {
        value: 'medium',
        label: 'Moderate commute (20-60km per day)',
        icon: 'commute-medium'
      },
      {
        value: 'long',
        label: 'Long distance (over 60km per day)',
        icon: 'commute-long'
      }
    ]
  }
];

/**
 * Mapping rules that translate quiz answers into vehicle body type recommendations
 * 
 * Rules are evaluated in order, and multiple rules can match.
 * The final recommendation is the union of all matching rules.
 * 
 * Validates: Requirements 5.5
 */
export const CATEGORY_MAPPING_RULES: CategoryMappingRule[] = [
  // Tight parking + solo/couple + short commute -> Hatchback
  {
    conditions: {
      parking: 'tight-city',
      passengers: 'solo-couple',
      commute: 'short'
    },
    recommendedBodyTypes: ['Hatchback'],
    reasoning: 'Compact hatchbacks are ideal for tight city parking, easy to maneuver, and efficient for short trips'
  },
  
  // Tight parking + solo/couple + any commute -> Hatchback, Sedan
  {
    conditions: {
      parking: 'tight-city',
      passengers: 'solo-couple'
    },
    recommendedBodyTypes: ['Hatchback', 'Sedan'],
    reasoning: 'Smaller vehicles are easier to park in tight city spaces while still providing comfort for 1-2 people'
  },
  
  // Tight parking + small family -> Hatchback, Sedan
  {
    conditions: {
      parking: 'tight-city',
      passengers: 'small-family'
    },
    recommendedBodyTypes: ['Hatchback', 'Sedan', 'Wagon'],
    reasoning: 'Compact family vehicles that can fit in tight spaces while accommodating 3-5 passengers'
  },
  
  // Suburban parking + solo/couple -> Sedan, Hatchback, SUV
  {
    conditions: {
      parking: 'suburban',
      passengers: 'solo-couple'
    },
    recommendedBodyTypes: ['Sedan', 'Hatchback', 'SUV'],
    reasoning: 'Standard parking allows for a wider range of vehicle sizes with good comfort and practicality'
  },
  
  // Suburban parking + small family -> Sedan, SUV, Wagon
  {
    conditions: {
      parking: 'suburban',
      passengers: 'small-family'
    },
    recommendedBodyTypes: ['Sedan', 'SUV', 'Wagon'],
    reasoning: 'Family-friendly vehicles with good space for passengers and cargo, suitable for standard parking'
  },
  
  // Suburban parking + large group -> SUV, Van, People Mover
  {
    conditions: {
      parking: 'suburban',
      passengers: 'large-group'
    },
    recommendedBodyTypes: ['SUV', 'Van', 'People Mover'],
    reasoning: 'Larger vehicles needed for 6+ passengers, with standard parking accommodating their size'
  },
  
  // Spacious parking + solo/couple -> Any body type
  {
    conditions: {
      parking: 'spacious',
      passengers: 'solo-couple'
    },
    recommendedBodyTypes: ['Sedan', 'Hatchback', 'SUV', 'Wagon', 'Ute'],
    reasoning: 'Ample parking space allows for any vehicle size based on personal preference'
  },
  
  // Spacious parking + small family -> SUV, Wagon, Sedan
  {
    conditions: {
      parking: 'spacious',
      passengers: 'small-family'
    },
    recommendedBodyTypes: ['SUV', 'Wagon', 'Sedan'],
    reasoning: 'Family vehicles with extra space for comfort and cargo, no parking constraints'
  },
  
  // Spacious parking + large group -> SUV, Van, People Mover
  {
    conditions: {
      parking: 'spacious',
      passengers: 'large-group'
    },
    recommendedBodyTypes: ['SUV', 'Van', 'People Mover'],
    reasoning: 'Large vehicles for 6+ passengers with spacious parking to accommodate their size'
  },
  
  // Long commute + any passengers -> Sedan, SUV, Wagon
  {
    conditions: {
      commute: 'long'
    },
    recommendedBodyTypes: ['Sedan', 'SUV', 'Wagon'],
    reasoning: 'Comfortable vehicles with good highway performance and fuel efficiency for long daily drives'
  },
  
  // Short commute + tight parking -> Hatchback
  {
    conditions: {
      commute: 'short',
      parking: 'tight-city'
    },
    recommendedBodyTypes: ['Hatchback'],
    reasoning: 'Compact and efficient for short city trips with easy parking'
  },
  
  // Large group passengers (overrides other factors)
  {
    conditions: {
      passengers: 'large-group'
    },
    recommendedBodyTypes: ['SUV', 'Van', 'People Mover'],
    reasoning: 'Vehicles with 6+ seating capacity are essential for large families or groups'
  }
];

/**
 * Complete lifestyle quiz configuration
 * Combines questions and mapping rules into a single data structure
 */
export const LIFESTYLE_QUIZ_CONFIG: LifestyleQuizData = {
  questions: QUIZ_QUESTIONS,
  mappingRules: CATEGORY_MAPPING_RULES
};

/**
 * Helper function to determine recommended body types based on quiz answers
 * 
 * @param answers - User's quiz answers (questionId -> optionValue)
 * @returns Array of recommended vehicle body types
 */
export function getRecommendedBodyTypes(answers: Record<string, string>): string[] {
  const matchedBodyTypes = new Set<string>();
  
  // Evaluate each mapping rule
  for (const rule of CATEGORY_MAPPING_RULES) {
    // Check if all conditions in the rule match the user's answers
    const conditionsMatch = Object.entries(rule.conditions).every(
      ([questionId, requiredValue]) => answers[questionId] === requiredValue
    );
    
    // If conditions match, add recommended body types to the set
    if (conditionsMatch) {
      rule.recommendedBodyTypes.forEach(bodyType => matchedBodyTypes.add(bodyType));
    }
  }
  
  // If no rules matched, return all body types (no filtering)
  if (matchedBodyTypes.size === 0) {
    return ['Sedan', 'Hatchback', 'SUV', 'Wagon', 'Ute', 'Van', 'People Mover'];
  }
  
  return Array.from(matchedBodyTypes);
}

/**
 * Helper function to get the reasoning for a specific set of answers
 * 
 * @param answers - User's quiz answers (questionId -> optionValue)
 * @returns Array of reasoning strings from matched rules
 */
export function getRecommendationReasons(answers: Record<string, string>): string[] {
  const reasons: string[] = [];
  
  for (const rule of CATEGORY_MAPPING_RULES) {
    const conditionsMatch = Object.entries(rule.conditions).every(
      ([questionId, requiredValue]) => answers[questionId] === requiredValue
    );
    
    if (conditionsMatch) {
      reasons.push(rule.reasoning);
    }
  }
  
  return reasons;
}
