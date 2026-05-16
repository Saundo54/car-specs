/**
 * Lifestyle Quiz data model type definitions
 * Part of Requirement 5: Everyday Lifestyle Match Quiz
 */

/**
 * Represents a single option within a quiz question
 */
export interface QuizOption {
  /** Unique value identifier for this option */
  value: string;
  
  /** Display label shown to the user */
  label: string;
  
  /** Optional icon identifier for visual representation */
  icon?: string;
}

/**
 * Represents a single question in the lifestyle quiz
 */
export interface QuizQuestion {
  /** Unique question identifier (parking, passengers, commute) */
  id: 'parking' | 'passengers' | 'commute';
  
  /** Question text displayed to the user */
  question: string;
  
  /** Array of available options for this question */
  options: QuizOption[];
}

/**
 * Mapping rule that connects quiz answers to vehicle body type recommendations
 */
export interface CategoryMappingRule {
  /** Conditions that must be met for this rule to apply (questionId -> optionValue) */
  conditions: Record<string, string>;
  
  /** Vehicle body types recommended when conditions are met */
  recommendedBodyTypes: string[];
  
  /** Human-readable explanation of why these body types are recommended */
  reasoning: string;
}

/**
 * Results from a completed lifestyle quiz
 */
export interface QuizResults {
  /** User's answers mapped by question ID */
  answers: Record<string, string>;
  
  /** Recommended vehicle body types based on answers */
  recommendedBodyTypes: string[];
  
  /** Timestamp when the quiz was completed */
  completedAt: Date;
}

/**
 * Complete lifestyle quiz data structure
 */
export interface LifestyleQuizData {
  /** Array of quiz questions */
  questions: QuizQuestion[];
  
  /** Array of mapping rules for determining recommendations */
  mappingRules: CategoryMappingRule[];
}
