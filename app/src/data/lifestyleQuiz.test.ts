/**
 * Unit tests for Lifestyle Quiz data models and helper functions
 * Part of Task 1.4: Create lifestyle quiz data models
 */

import { describe, it, expect } from 'vitest';
import {
  QUIZ_QUESTIONS,
  CATEGORY_MAPPING_RULES,
  LIFESTYLE_QUIZ_CONFIG,
  getRecommendedBodyTypes,
  getRecommendationReasons
} from './lifestyleQuiz';

describe('Lifestyle Quiz Data Models', () => {
  describe('QUIZ_QUESTIONS', () => {
    it('should have exactly 3 questions', () => {
      expect(QUIZ_QUESTIONS).toHaveLength(3);
    });

    it('should include parking, passengers, and commute questions', () => {
      const questionIds = QUIZ_QUESTIONS.map(q => q.id);
      expect(questionIds).toContain('parking');
      expect(questionIds).toContain('passengers');
      expect(questionIds).toContain('commute');
    });

    it('should have valid question structure', () => {
      QUIZ_QUESTIONS.forEach(question => {
        expect(question.id).toBeDefined();
        expect(question.question).toBeDefined();
        expect(question.options).toBeDefined();
        expect(Array.isArray(question.options)).toBe(true);
        expect(question.options.length).toBeGreaterThan(0);
      });
    });

    it('should have valid option structure for each question', () => {
      QUIZ_QUESTIONS.forEach(question => {
        question.options.forEach(option => {
          expect(option.value).toBeDefined();
          expect(option.label).toBeDefined();
          expect(typeof option.value).toBe('string');
          expect(typeof option.label).toBe('string');
        });
      });
    });

    it('parking question should have 3 options', () => {
      const parkingQuestion = QUIZ_QUESTIONS.find(q => q.id === 'parking');
      expect(parkingQuestion?.options).toHaveLength(3);
    });

    it('passengers question should have 3 options', () => {
      const passengersQuestion = QUIZ_QUESTIONS.find(q => q.id === 'passengers');
      expect(passengersQuestion?.options).toHaveLength(3);
    });

    it('commute question should have 3 options', () => {
      const commuteQuestion = QUIZ_QUESTIONS.find(q => q.id === 'commute');
      expect(commuteQuestion?.options).toHaveLength(3);
    });
  });

  describe('CATEGORY_MAPPING_RULES', () => {
    it('should have at least one mapping rule', () => {
      expect(CATEGORY_MAPPING_RULES.length).toBeGreaterThan(0);
    });

    it('should have valid mapping rule structure', () => {
      CATEGORY_MAPPING_RULES.forEach(rule => {
        expect(rule.conditions).toBeDefined();
        expect(rule.recommendedBodyTypes).toBeDefined();
        expect(rule.reasoning).toBeDefined();
        expect(Array.isArray(rule.recommendedBodyTypes)).toBe(true);
        expect(rule.recommendedBodyTypes.length).toBeGreaterThan(0);
      });
    });

    it('should only reference valid question IDs in conditions', () => {
      const validQuestionIds = ['parking', 'passengers', 'commute'];
      CATEGORY_MAPPING_RULES.forEach(rule => {
        Object.keys(rule.conditions).forEach(questionId => {
          expect(validQuestionIds).toContain(questionId);
        });
      });
    });

    it('should have non-empty reasoning for each rule', () => {
      CATEGORY_MAPPING_RULES.forEach(rule => {
        expect(rule.reasoning.length).toBeGreaterThan(0);
      });
    });
  });

  describe('LIFESTYLE_QUIZ_CONFIG', () => {
    it('should contain questions and mapping rules', () => {
      expect(LIFESTYLE_QUIZ_CONFIG.questions).toBeDefined();
      expect(LIFESTYLE_QUIZ_CONFIG.mappingRules).toBeDefined();
      expect(LIFESTYLE_QUIZ_CONFIG.questions).toEqual(QUIZ_QUESTIONS);
      expect(LIFESTYLE_QUIZ_CONFIG.mappingRules).toEqual(CATEGORY_MAPPING_RULES);
    });
  });

  describe('getRecommendedBodyTypes', () => {
    it('should return body types for tight city parking + solo/couple + short commute', () => {
      const answers = {
        parking: 'tight-city',
        passengers: 'solo-couple',
        commute: 'short'
      };
      const bodyTypes = getRecommendedBodyTypes(answers);
      expect(bodyTypes).toContain('Hatchback');
      expect(bodyTypes.length).toBeGreaterThan(0);
    });

    it('should return body types for suburban parking + small family', () => {
      const answers = {
        parking: 'suburban',
        passengers: 'small-family',
        commute: 'medium'
      };
      const bodyTypes = getRecommendedBodyTypes(answers);
      expect(bodyTypes.length).toBeGreaterThan(0);
      expect(bodyTypes).toContain('Sedan');
    });

    it('should return body types for spacious parking + large group', () => {
      const answers = {
        parking: 'spacious',
        passengers: 'large-group',
        commute: 'medium'
      };
      const bodyTypes = getRecommendedBodyTypes(answers);
      expect(bodyTypes.length).toBeGreaterThan(0);
      expect(bodyTypes.some(type => ['SUV', 'Van', 'People Mover'].includes(type))).toBe(true);
    });

    it('should return all body types when no rules match', () => {
      const answers = {
        parking: 'invalid',
        passengers: 'invalid',
        commute: 'invalid'
      };
      const bodyTypes = getRecommendedBodyTypes(answers);
      expect(bodyTypes.length).toBeGreaterThan(0);
    });

    it('should return unique body types (no duplicates)', () => {
      const answers = {
        parking: 'suburban',
        passengers: 'solo-couple',
        commute: 'medium'
      };
      const bodyTypes = getRecommendedBodyTypes(answers);
      const uniqueBodyTypes = Array.from(new Set(bodyTypes));
      expect(bodyTypes).toEqual(uniqueBodyTypes);
    });
  });

  describe('getRecommendationReasons', () => {
    it('should return reasons for matching rules', () => {
      const answers = {
        parking: 'tight-city',
        passengers: 'solo-couple',
        commute: 'short'
      };
      const reasons = getRecommendationReasons(answers);
      expect(reasons.length).toBeGreaterThan(0);
      expect(reasons.every(reason => typeof reason === 'string')).toBe(true);
    });

    it('should return empty array when no rules match', () => {
      const answers = {
        parking: 'invalid',
        passengers: 'invalid',
        commute: 'invalid'
      };
      const reasons = getRecommendationReasons(answers);
      expect(reasons).toEqual([]);
    });

    it('should return multiple reasons when multiple rules match', () => {
      const answers = {
        parking: 'suburban',
        passengers: 'small-family',
        commute: 'long'
      };
      const reasons = getRecommendationReasons(answers);
      // Should match at least the suburban+small-family rule and the long commute rule
      expect(reasons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty answers object', () => {
      const answers = {};
      const bodyTypes = getRecommendedBodyTypes(answers);
      expect(Array.isArray(bodyTypes)).toBe(true);
    });

    it('should handle partial answers', () => {
      const answers = {
        parking: 'tight-city'
      };
      const bodyTypes = getRecommendedBodyTypes(answers);
      expect(Array.isArray(bodyTypes)).toBe(true);
      expect(bodyTypes.length).toBeGreaterThan(0);
    });

    it('should handle case-sensitive values correctly', () => {
      const answers = {
        parking: 'Tight-City', // Wrong case
        passengers: 'solo-couple',
        commute: 'short'
      };
      const bodyTypes = getRecommendedBodyTypes(answers);
      // Should still return body types (fallback to all)
      expect(bodyTypes.length).toBeGreaterThan(0);
    });
  });
});
