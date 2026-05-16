/**
 * Unit tests for Feature Filter Data Models
 * 
 * Tests verify the structure and configuration of feature filters.
 * Requirements: 6.2
 */

import { describe, it, expect } from 'vitest';
import {
  FEATURE_FILTER_CONFIG,
  type FeatureFilterConfig,
  type FilterableFeature,
  type SpecPath
} from './featureFilters';

describe('Feature Filter Data Models', () => {
  describe('FEATURE_FILTER_CONFIG structure', () => {
    it('should have a features array', () => {
      expect(FEATURE_FILTER_CONFIG).toHaveProperty('features');
      expect(Array.isArray(FEATURE_FILTER_CONFIG.features)).toBe(true);
    });

    it('should contain exactly 4 filterable features', () => {
      expect(FEATURE_FILTER_CONFIG.features).toHaveLength(4);
    });

    it('should include Apple CarPlay feature', () => {
      const feature = FEATURE_FILTER_CONFIG.features.find(f => f.id === 'apple-carplay');
      expect(feature).toBeDefined();
      expect(feature?.label).toBe('Apple CarPlay');
      expect(feature?.icon).toBe('📱');
    });

    it('should include Android Auto feature', () => {
      const feature = FEATURE_FILTER_CONFIG.features.find(f => f.id === 'android-auto');
      expect(feature).toBeDefined();
      expect(feature?.label).toBe('Android Auto');
      expect(feature?.icon).toBe('🤖');
    });

    it('should include Heated Seats feature', () => {
      const feature = FEATURE_FILTER_CONFIG.features.find(f => f.id === 'heated-seats');
      expect(feature).toBeDefined();
      expect(feature?.label).toBe('Heated Seats');
      expect(feature?.icon).toBe('🔥');
    });

    it('should include 360 Camera feature', () => {
      const feature = FEATURE_FILTER_CONFIG.features.find(f => f.id === '360-camera');
      expect(feature).toBeDefined();
      expect(feature?.label).toBe('360° Camera');
      expect(feature?.icon).toBe('📷');
    });
  });

  describe('FilterableFeature structure', () => {
    it('should have all required fields for each feature', () => {
      FEATURE_FILTER_CONFIG.features.forEach(feature => {
        expect(feature).toHaveProperty('id');
        expect(feature).toHaveProperty('label');
        expect(feature).toHaveProperty('icon');
        expect(feature).toHaveProperty('specPaths');
        
        expect(typeof feature.id).toBe('string');
        expect(typeof feature.label).toBe('string');
        expect(typeof feature.icon).toBe('string');
        expect(Array.isArray(feature.specPaths)).toBe(true);
      });
    });

    it('should have at least one spec path for each feature', () => {
      FEATURE_FILTER_CONFIG.features.forEach(feature => {
        expect(feature.specPaths.length).toBeGreaterThan(0);
      });
    });
  });

  describe('SpecPath structure', () => {
    it('should have valid category values', () => {
      const validCategories = ['tech', 'interior', 'safety'];
      
      FEATURE_FILTER_CONFIG.features.forEach(feature => {
        feature.specPaths.forEach(specPath => {
          expect(validCategories).toContain(specPath.category);
        });
      });
    });

    it('should have key and matchPattern for each spec path', () => {
      FEATURE_FILTER_CONFIG.features.forEach(feature => {
        feature.specPaths.forEach(specPath => {
          expect(specPath).toHaveProperty('category');
          expect(specPath).toHaveProperty('key');
          expect(specPath).toHaveProperty('matchPattern');
          
          expect(typeof specPath.key).toBe('string');
          expect(specPath.key.length).toBeGreaterThan(0);
          expect(['string', 'object']).toContain(typeof specPath.matchPattern);
        });
      });
    });
  });

  describe('Apple CarPlay configuration', () => {
    const carPlayFeature = FEATURE_FILTER_CONFIG.features.find(f => f.id === 'apple-carplay');

    it('should search in tech category', () => {
      expect(carPlayFeature?.specPaths[0].category).toBe('tech');
    });

    it('should look for "Apple CarPlay" key', () => {
      expect(carPlayFeature?.specPaths[0].key).toBe('Apple CarPlay');
    });

    it('should match "Yes" or "Wireless" values', () => {
      const pattern = carPlayFeature?.specPaths[0].matchPattern as RegExp;
      expect(pattern.test('Yes')).toBe(true);
      expect(pattern.test('Wireless')).toBe(true);
      expect(pattern.test('No')).toBe(false);
      expect(pattern.test('Not Available')).toBe(false);
    });

    it('should match case-insensitively', () => {
      const pattern = carPlayFeature?.specPaths[0].matchPattern as RegExp;
      expect(pattern.test('yes')).toBe(true);
      expect(pattern.test('YES')).toBe(true);
      expect(pattern.test('wireless')).toBe(true);
      expect(pattern.test('WIRELESS')).toBe(true);
    });
  });

  describe('Android Auto configuration', () => {
    const androidAutoFeature = FEATURE_FILTER_CONFIG.features.find(f => f.id === 'android-auto');

    it('should search in tech category', () => {
      expect(androidAutoFeature?.specPaths[0].category).toBe('tech');
    });

    it('should look for "Android Auto" key', () => {
      expect(androidAutoFeature?.specPaths[0].key).toBe('Android Auto');
    });

    it('should match "Yes" or "Wireless" values', () => {
      const pattern = androidAutoFeature?.specPaths[0].matchPattern as RegExp;
      expect(pattern.test('Yes')).toBe(true);
      expect(pattern.test('Wireless')).toBe(true);
      expect(pattern.test('No')).toBe(false);
    });
  });

  describe('Heated Seats configuration', () => {
    const heatedSeatsFeature = FEATURE_FILTER_CONFIG.features.find(f => f.id === 'heated-seats');

    it('should have multiple spec paths', () => {
      expect(heatedSeatsFeature?.specPaths.length).toBeGreaterThanOrEqual(2);
    });

    it('should search in interior category', () => {
      heatedSeatsFeature?.specPaths.forEach(specPath => {
        expect(specPath.category).toBe('interior');
      });
    });

    it('should match explicit "Heated Seats" key with Yes/Front/Rear values', () => {
      const explicitPath = heatedSeatsFeature?.specPaths.find(p => p.key === 'Heated Seats');
      expect(explicitPath).toBeDefined();
      
      const pattern = explicitPath?.matchPattern as RegExp;
      expect(pattern.test('Yes')).toBe(true);
      expect(pattern.test('Front')).toBe(true);
      expect(pattern.test('Front & Rear')).toBe(true);
      expect(pattern.test('No')).toBe(false);
    });

    it('should match "Seats" key with "Heated" in value', () => {
      const seatsPath = heatedSeatsFeature?.specPaths.find(p => p.key === 'Seats');
      expect(seatsPath).toBeDefined();
      
      const pattern = seatsPath?.matchPattern as RegExp;
      expect(pattern.test('Heated Leather')).toBe(true);
      expect(pattern.test('Ventilated and Heated')).toBe(true);
      expect(pattern.test('Leather')).toBe(false);
    });
  });

  describe('360 Camera configuration', () => {
    const cameraFeature = FEATURE_FILTER_CONFIG.features.find(f => f.id === '360-camera');

    it('should have multiple spec paths', () => {
      expect(cameraFeature?.specPaths.length).toBeGreaterThanOrEqual(2);
    });

    it('should search in both tech and safety categories', () => {
      const categories = cameraFeature?.specPaths.map(p => p.category) || [];
      expect(categories).toContain('tech');
      expect(categories).toContain('safety');
    });

    it('should match "360 Camera" key with Yes value', () => {
      const explicitPath = cameraFeature?.specPaths.find(
        p => p.key === '360 Camera' && p.category === 'tech'
      );
      expect(explicitPath).toBeDefined();
      
      const pattern = explicitPath?.matchPattern as RegExp;
      expect(pattern.test('Yes')).toBe(true);
      expect(pattern.test('No')).toBe(false);
    });

    it('should match "Surround View" as alternative key', () => {
      const surroundPath = cameraFeature?.specPaths.find(p => p.key === 'Surround View');
      expect(surroundPath).toBeDefined();
      
      const pattern = surroundPath?.matchPattern as RegExp;
      expect(pattern.test('Yes')).toBe(true);
    });

    it('should match "Parking Camera" with 360 or Surround in value', () => {
      const parkingPath = cameraFeature?.specPaths.find(p => p.key === 'Parking Camera');
      expect(parkingPath).toBeDefined();
      
      const pattern = parkingPath?.matchPattern as RegExp;
      expect(pattern.test('360')).toBe(true);
      expect(pattern.test('Surround View')).toBe(true);
      expect(pattern.test('Rear Only')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string values', () => {
      const carPlayFeature = FEATURE_FILTER_CONFIG.features.find(f => f.id === 'apple-carplay');
      const pattern = carPlayFeature?.specPaths[0].matchPattern as RegExp;
      expect(pattern.test('')).toBe(false);
    });

    it('should handle undefined-like string values', () => {
      const carPlayFeature = FEATURE_FILTER_CONFIG.features.find(f => f.id === 'apple-carplay');
      const pattern = carPlayFeature?.specPaths[0].matchPattern as RegExp;
      expect(pattern.test('undefined')).toBe(false);
      expect(pattern.test('null')).toBe(false);
      expect(pattern.test('N/A')).toBe(false);
    });

    it('should handle partial matches correctly', () => {
      const carPlayFeature = FEATURE_FILTER_CONFIG.features.find(f => f.id === 'apple-carplay');
      const pattern = carPlayFeature?.specPaths[0].matchPattern as RegExp;
      // Should match "Yes" at start but not in middle
      expect(pattern.test('Yes (Retrofit)')).toBe(true);
      expect(pattern.test('Available: Yes')).toBe(false);
    });
  });

  describe('Type safety', () => {
    it('should satisfy FeatureFilterConfig type', () => {
      const config: FeatureFilterConfig = FEATURE_FILTER_CONFIG;
      expect(config).toBeDefined();
    });

    it('should satisfy FilterableFeature type for each feature', () => {
      FEATURE_FILTER_CONFIG.features.forEach(feature => {
        const typedFeature: FilterableFeature = feature;
        expect(typedFeature).toBeDefined();
      });
    });

    it('should satisfy SpecPath type for each spec path', () => {
      FEATURE_FILTER_CONFIG.features.forEach(feature => {
        feature.specPaths.forEach(specPath => {
          const typedSpecPath: SpecPath = specPath;
          expect(typedSpecPath).toBeDefined();
        });
      });
    });
  });
});
