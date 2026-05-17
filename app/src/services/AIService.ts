import { VehicleSpec } from '../data/vehicles';

/**
 * Trade-off data structure for AI summaries
 */
export interface TradeOff {
  aspect: string;
  winner: string; // vehicle ID
  loser?: string; // vehicle ID
  magnitude: 'significant' | 'moderate' | 'minor';
  description: string;
}

/**
 * AI Summary data structure
 */
export interface AISummary {
  summary: string;
  tradeOffs: TradeOff[];
}

/**
 * AIService
 * Part of Requirement 8: Automated AI Summary
 */
class AIService {
  /**
   * Generates an AI summary for a set of compared vehicles
   * Requirement: 8.1, 8.3, 8.4, 8.5, 8.7, 8.8
   */
  generateSummary(vehicles: VehicleSpec[]): AISummary {
    if (vehicles.length < 2) return { summary: '', tradeOffs: [] };

    const tradeOffs: TradeOff[] = [];
    
    // 1. Performance vs Efficiency Trade-off
    const powerValues = vehicles.map(v => ({
      id: v.id,
      model: v.model,
      val: parseFloat((v.specs.mechanical['Power'] || '0').replace(/[^0-9.]/g, ''))
    })).sort((a, b) => b.val - a.val);

    const fuelValues = vehicles.map(v => ({
      id: v.id,
      model: v.model,
      val: parseFloat((v.specs.mechanical['Fuel Consumption'] || '100').replace(/[^0-9.]/g, ''))
    })).sort((a, b) => a.val - b.val); // Lower is better

    if (powerValues[0].id !== fuelValues[0].id) {
      tradeOffs.push({
        aspect: 'Performance vs Efficiency',
        winner: powerValues[0].id,
        loser: fuelValues[0].id,
        magnitude: 'significant',
        description: `The ${powerValues[0].model} offers the most power, whereas the ${fuelValues[0].model} leads in fuel efficiency.`
      });
    }

    // 2. Cargo Space Trade-off
    const bootValues = vehicles.map(v => ({
      id: v.id,
      model: v.model,
      val: parseFloat((v.specs.dimensions['Boot Capacity'] || '0').replace(/[^0-9.]/g, ''))
    })).sort((a, b) => b.val - a.val);

    if (bootValues[0].val > bootValues[bootValues.length - 1].val) {
      tradeOffs.push({
        aspect: 'Practicality',
        winner: bootValues[0].id,
        magnitude: 'moderate',
        description: `The ${bootValues[0].model} provides superior cargo capacity for families and trips.`
      });
    }

    // 3. Safety Standard Trade-off
    const safetyValues = vehicles.map(v => ({
      id: v.id,
      model: v.model,
      rating: v.ancap_rating,
      year: v.ancap_test_year || 0
    })).sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.year - a.year;
    });

    if (safetyValues[0].year > (safetyValues[safetyValues.length - 1].year + 5)) {
      tradeOffs.push({
        aspect: 'Safety Standards',
        winner: safetyValues[0].id,
        magnitude: 'significant',
        description: `The ${safetyValues[0].model} was tested to much more recent safety standards than the ${safetyValues[safetyValues.length - 1].model}.`
      });
    }

    // Handle very similar vehicles (Requirement 8.8)
    const isVerySimilar = tradeOffs.length === 0;
    const summary = isVerySimilar
      ? `These vehicles are very similar in key specifications, with only minor differences in features and styling.`
      : `Comparing these vehicles reveals distinct trade-offs between performance, efficiency, and modern safety standards.`;

    return {
      summary,
      tradeOffs: tradeOffs.slice(0, 3) // Limit to 3 (Requirement 8.7)
    };
  }

  /**
   * Mechanism to assess feasibility (Requirement 8.9)
   */
  async assessFeasibility(): Promise<boolean> {
    // In a real implementation, this might check API availability or data quality
    return true;
  }
}

export const aiService = new AIService();
