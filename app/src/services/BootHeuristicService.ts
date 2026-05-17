import {
  STANDARD_LUGGAGE_VOLUMES,
  DEFAULT_METHODOLOGY,
} from '../types/bootHeuristic';
import type {
  BootHeuristicData,
  LuggageEquivalent,
  ConversionRatio,
  BabyDriveEntry,
  HeuristicMethodology,
} from '../types/bootHeuristic';

class BootHeuristicService {
  private data: BootHeuristicData | null = null;

  constructor() {
    this.data = {
      version: '1.0.0',
      calculatedAt: new Date().toISOString(),
      conversionRatios: STANDARD_LUGGAGE_VOLUMES,
      methodology: DEFAULT_METHODOLOGY,
      vehicleMappings: []
    };
  }

  /**
   * Identifies vehicles present in both the application database and the BabyDrive_Database
   * Requirement: 9.1
   */
  matchVehicleToBabyDrive(_vehicleId: string): BabyDriveEntry | null {
    // Mock implementation: in a real app this would look up in a data source
    // For now, we return null to fall back to industry standards
    return null;
  }

  /**
   * Calculates conversion ratios based on BabyDrive measurements
   * Requirement: 9.3
   */
  calculateConversionRatio(bootLitres: number, babyDrive: BabyDriveEntry): ConversionRatio {
    return {
      litresPerSuitcase: babyDrive.largeSuitcases > 0 ? bootLitres / babyDrive.largeSuitcases : STANDARD_LUGGAGE_VOLUMES.litresPerSuitcase,
      litresPerPram: babyDrive.prams > 0 ? bootLitres / babyDrive.prams : STANDARD_LUGGAGE_VOLUMES.litresPerPram,
      litresPerGroceryBag: babyDrive.groceryBags > 0 ? bootLitres / babyDrive.groceryBags : STANDARD_LUGGAGE_VOLUMES.litresPerGroceryBag,
    };
  }

  /**
   * Estimates luggage capacity for a given boot volume
   * Requirement: 9.4, 9.6
   */
  estimateLuggageCapacity(bootLitres: number): LuggageEquivalent {
    if (isNaN(bootLitres) || bootLitres <= 0) {
      return { largeSuitcases: 0, prams: 0, groceryBags: 0 };
    }

    const ratios = this.data?.conversionRatios || STANDARD_LUGGAGE_VOLUMES;
    
    return {
      largeSuitcases: Math.floor(bootLitres / ratios.litresPerSuitcase),
      prams: Math.floor(bootLitres / ratios.litresPerPram),
      groceryBags: Math.floor(bootLitres / ratios.litresPerGroceryBag),
    };
  }

  /**
   * Returns the methodology metadata for transparency
   * Requirement: 9.8
   */
  getMethodology(): HeuristicMethodology {
    return this.data?.methodology || DEFAULT_METHODOLOGY;
  }
}

export const bootHeuristicService = new BootHeuristicService();
