/**
 * Boot Heuristic data model type definitions
 * Part of Requirement 9: Boot Capacity Heuristic Model
 * Part of Requirement 3: Boot and Cabin Visualizer
 */

/**
 * Represents the luggage capacity equivalent for a given boot volume
 * Used to translate boot litres into practical, relatable objects
 */
export interface LuggageEquivalent {
  /** Number of large suitcases that fit in the boot */
  largeSuitcases: number;
  
  /** Number of prams/strollers that fit in the boot */
  prams: number;
  
  /** Number of grocery bags that fit in the boot */
  groceryBags: number;
}

/**
 * Conversion ratios between boot litres and luggage items
 * Calculated from BabyDrive database cross-reference or industry standards
 */
export interface ConversionRatio {
  /** Litres required per large suitcase */
  litresPerSuitcase: number;
  
  /** Litres required per pram/stroller */
  litresPerPram: number;
  
  /** Litres required per grocery bag */
  litresPerGroceryBag: number;
}

/**
 * Metadata about the heuristic calculation methodology
 * Provides transparency about data sources and confidence levels
 */
export interface HeuristicMethodology {
  /** Source of the conversion data (e.g., "BabyDrive", "Industry Standard") */
  dataSource: string;
  
  /** Number of vehicles matched between app database and BabyDrive */
  matchedVehicleCount: number;
  
  /** Average conversion ratio calculated from matched vehicles */
  averageConversionRatio: ConversionRatio;
  
  /** Confidence level based on sample size and data quality */
  confidenceLevel: 'high' | 'medium' | 'low';
}

/**
 * Mapping of a specific vehicle to its luggage capacity
 * Links vehicle ID to calculated or measured luggage equivalents
 */
export interface BootVehicleMapping {
  /** Unique vehicle identifier matching VehicleSpec.id */
  vehicleId: string;
  
  /** Boot capacity in litres from vehicle specifications */
  bootLitres: number;
  
  /** Calculated luggage equivalent for this boot capacity */
  luggageEquivalent: LuggageEquivalent;
  
  /** Source of the luggage data */
  dataSource: 'babydrive' | 'estimated';
}

/**
 * Complete boot heuristic data structure
 * Contains all conversion ratios, methodology, and vehicle mappings
 */
export interface BootHeuristicData {
  /** Version identifier for the heuristic data format */
  version: string;
  
  /** ISO 8601 timestamp when the heuristic was calculated */
  calculatedAt: string;
  
  /** Conversion ratios used for estimation */
  conversionRatios: ConversionRatio;
  
  /** Methodology and metadata about the calculation */
  methodology: HeuristicMethodology;
  
  /** Array of vehicle-specific luggage mappings */
  vehicleMappings: BootVehicleMapping[];
}

/**
 * Entry from the BabyDrive database
 * Represents real-world cargo capacity measurements
 */
export interface BabyDriveEntry {
  /** Vehicle identifier (should match VehicleSpec.id format) */
  vehicleId: string;
  
  /** Boot capacity in litres */
  bootLitres: number;
  
  /** Measured number of large suitcases that fit */
  largeSuitcases: number;
  
  /** Measured number of prams that fit */
  prams: number;
  
  /** Measured number of grocery bags that fit */
  groceryBags: number;
}

/**
 * Standard luggage unit volumes (in litres)
 * Industry-standard estimates used as fallback when BabyDrive data unavailable
 * 
 * Based on typical dimensions:
 * - Large suitcase: ~75cm x 50cm x 30cm = ~112.5L (rounded to 200L for packing inefficiency)
 * - Pram/stroller: Varies widely, average ~300L when folded
 * - Grocery bag: ~30cm x 40cm x 20cm = ~24L (rounded to 50L for irregular shapes)
 */
export const STANDARD_LUGGAGE_VOLUMES: ConversionRatio = {
  litresPerSuitcase: 200,
  litresPerPram: 300,
  litresPerGroceryBag: 50,
};

/**
 * Default heuristic methodology used when insufficient BabyDrive data exists
 */
export const DEFAULT_METHODOLOGY: HeuristicMethodology = {
  dataSource: 'Industry Standard',
  matchedVehicleCount: 0,
  averageConversionRatio: STANDARD_LUGGAGE_VOLUMES,
  confidenceLevel: 'low',
};
