/**
 * BestInClassCalculator service
 * Part of Requirement 2: Best-in-Class Spec Highlight and Weighting
 */

class BestInClassCalculator {
  /**
   * Identifies the vehicle IDs that have the best value for a given specification
   * Requirement: 2.1, 2.5
   */
  calculateBest(
    category: string,
    key: string,
    values: Array<{ vehicleId: string; value: string }>
  ): string[] {
    // Best-in-class is currently only calculated for mechanical specifications
    if (category !== 'mechanical') return [];

    const numericValues = values
      .map(v => ({ ...v, numericValue: this.parseNumericValue(v.value) }))
      .filter(v => v.numericValue !== null);

    if (numericValues.length < 1) return [];

    const isHigherBetter = this.isHigherBetter(key);
    
    let bestValue = numericValues[0].numericValue!;
    
    for (const v of numericValues) {
      if (isHigherBetter) {
        if (v.numericValue! > bestValue) {
          bestValue = v.numericValue!;
        }
      } else {
        if (v.numericValue! < bestValue) {
          bestValue = v.numericValue!;
        }
      }
    }

    // Return all vehicles that tie for the best value (Requirement 2.5)
    return numericValues
      .filter(v => v.numericValue === bestValue)
      .map(v => v.vehicleId);
  }

  /**
   * Determines if a higher or lower value is considered "better" for a given metric
   * Requirement: 2.2, 2.3
   */
  private isHigherBetter(key: string): boolean {
    const lowerBetterKeys = ['Fuel Consumption', 'L/100km'];
    
    // Check if the key matches any lower-better patterns
    if (lowerBetterKeys.some(lbk => key.toLowerCase().includes(lbk.toLowerCase()))) {
      return false;
    }
    
    // Default to higher better (Power, Torque, Engine Size, etc.)
    return true; 
  }

  /**
   * Extracts a numeric value from a specification string
   */
  private parseNumericValue(value: string): number | null {
    // Handles formats like "170 kW", "420 Nm", "3.5 L/100km"
    const match = value.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }
}

export const bestInClassCalculator = new BestInClassCalculator();
