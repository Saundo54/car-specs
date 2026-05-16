/**
 * Feature Filter Data Models
 * 
 * This module defines the data structures for the feature filter system,
 * which allows users to filter vehicles by convenience features.
 * 
 * Requirements: 6.2
 */

/**
 * Defines where to look in vehicle specs for a specific feature
 */
export interface SpecPath {
  /** The specification category to search in */
  category: 'tech' | 'interior' | 'safety';
  /** The key name in the category's record */
  key: string;
  /** Pattern to match against the spec value (string or RegExp) */
  matchPattern: string | RegExp;
}

/**
 * Defines a filterable feature with its display properties and spec locations
 */
export interface FilterableFeature {
  /** Unique identifier for the feature */
  id: string;
  /** Display label for the feature */
  label: string;
  /** Icon identifier for visual representation */
  icon: string;
  /** Array of spec paths where this feature might be found */
  specPaths: SpecPath[];
}

/**
 * Configuration for all available feature filters
 */
export interface FeatureFilterConfig {
  /** Array of all filterable features */
  features: FilterableFeature[];
}

/**
 * Feature filter configuration with all available convenience features
 */
export const FEATURE_FILTER_CONFIG: FeatureFilterConfig = {
  features: [
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
    },
    {
      id: 'android-auto',
      label: 'Android Auto',
      icon: '🤖',
      specPaths: [
        {
          category: 'tech',
          key: 'Android Auto',
          matchPattern: /^(Yes|Wireless)/i
        }
      ]
    },
    {
      id: 'heated-seats',
      label: 'Heated Seats',
      icon: '🔥',
      specPaths: [
        {
          category: 'interior',
          key: 'Heated Seats',
          matchPattern: /^(Yes|Front|Front & Rear)/i
        },
        {
          category: 'interior',
          key: 'Seats',
          matchPattern: /Heated/i
        }
      ]
    },
    {
      id: '360-camera',
      label: '360° Camera',
      icon: '📷',
      specPaths: [
        {
          category: 'tech',
          key: '360 Camera',
          matchPattern: /^Yes/i
        },
        {
          category: 'tech',
          key: 'Surround View',
          matchPattern: /^Yes/i
        },
        {
          category: 'safety',
          key: '360 Camera',
          matchPattern: /^Yes/i
        },
        {
          category: 'safety',
          key: 'Parking Camera',
          matchPattern: /360|Surround/i
        }
      ]
    }
  ]
};
