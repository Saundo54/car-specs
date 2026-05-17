/**
 * ANCAPService
 * Part of Requirement 7: ANCAP Safety Rating and Date Context Breakdown
 */

export type ANCAPWarningLevel = 'none' | 'caution' | 'warning';

class ANCAPService {
  /**
   * Calculates the warning level based on the age of the ANCAP test
   * Requirement: 7.2, 7.3
   */
  getWarningLevel(testYear: number | undefined): ANCAPWarningLevel {
    if (!testYear) return 'none';
    
    const currentYear = new Date().getFullYear();
    const age = currentYear - testYear;
    
    // Warning indicator for ratings older than 7 years (Requirement 7.3)
    if (age > 7) return 'warning';
    
    // Visual emphasis for ratings older than 5 years (Requirement 7.2)
    if (age > 5) return 'caution';
    
    return 'none';
  }

  /**
   * Determines if a rating should be visually emphasized due to age
   * Requirement: 7.2
   */
  shouldEmphasize(testYear: number | undefined): boolean {
    if (!testYear) return false;
    const currentYear = new Date().getFullYear();
    return (currentYear - testYear) > 5;
  }

  /**
   * Returns a message explaining the rating age implications
   * Requirement: 7.4
   */
  getAgeExplanation(testYear: number | undefined): string {
    if (!testYear) return 'No test year data available.';
    
    const warningLevel = this.getWarningLevel(testYear);
    if (warningLevel === 'warning') {
      return 'This safety rating is more than 7 years old and may not reflect current safety standards or testing protocols.';
    }
    if (warningLevel === 'caution') {
      return 'This safety rating is more than 5 years old. Safety standards have evolved since this vehicle was tested.';
    }
    return 'This rating reflects safety standards from ' + testYear + '.';
  }
}

export const ancapService = new ANCAPService();
