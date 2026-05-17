import type { VehicleSpec } from '../data/vehicles';
import { FEATURE_FILTER_CONFIG } from '../data/featureFilters';
import type { FilterableFeature } from '../data/featureFilters';

/**
 * FeatureFilterService
 * Part of Requirement 6: Must-Have Feature Checklist Filters
 */
class FeatureFilterService {
  /**
   * Filters vehicles based on selected features using AND logic
   * Requirement: 6.3, 6.4
   */
  filterVehicles(
    vehicles: VehicleSpec[],
    selectedFeatureIds: string[]
  ): VehicleSpec[] {
    if (selectedFeatureIds.length === 0) return vehicles;

    const selectedFeatures = FEATURE_FILTER_CONFIG.features.filter(f => 
      selectedFeatureIds.includes(f.id)
    );

    return vehicles.filter(vehicle => 
      // AND logic: vehicle must have ALL selected features
      selectedFeatures.every(feature => this.hasFeature(vehicle, feature))
    );
  }

  /**
   * Checks if a vehicle has a specific feature based on its spec paths
   * Requirement: 6.3
   */
  hasFeature(vehicle: VehicleSpec, feature: FilterableFeature): boolean {
    return feature.specPaths.some(path => {
      const categorySpecs = (vehicle.specs as any)[path.category];
      if (!categorySpecs) return false;
      
      const value = categorySpecs[path.key];
      if (!value) return false;

      if (path.matchPattern instanceof RegExp) {
        return path.matchPattern.test(value);
      }
      return value.toLowerCase().includes(String(path.matchPattern).toLowerCase());
    });
  }
}

export const featureFilterService = new FeatureFilterService();
