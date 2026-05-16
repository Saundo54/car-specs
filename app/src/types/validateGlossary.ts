/**
 * Type validation helper for glossary data
 * This file can be used to validate that glossary.json matches the TypeScript interfaces
 */

import type { GlossaryData, GlossaryEntry } from './glossary';

/**
 * Type guard to check if an object is a valid GlossaryEntry
 */
export function isGlossaryEntry(obj: unknown): obj is GlossaryEntry {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const entry = obj as Record<string, unknown>;
  
  return (
    typeof entry.term === 'string' &&
    typeof entry.explanation === 'string' &&
    typeof entry.practicalBenefit === 'string' &&
    typeof entry.category === 'string' &&
    ['mechanical', 'safety', 'tech', 'general'].includes(entry.category as string) &&
    (entry.aliases === undefined || (Array.isArray(entry.aliases) && entry.aliases.every(a => typeof a === 'string')))
  );
}

/**
 * Type guard to check if an object is valid GlossaryData
 */
export function isGlossaryData(obj: unknown): obj is GlossaryData {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const data = obj as Record<string, unknown>;
  
  return (
    typeof data.version === 'string' &&
    typeof data.lastUpdated === 'string' &&
    Array.isArray(data.entries) &&
    data.entries.every(isGlossaryEntry)
  );
}

/**
 * Validates glossary data and throws descriptive errors if invalid
 */
export function validateGlossaryData(data: unknown): asserts data is GlossaryData {
  if (!isGlossaryData(data)) {
    throw new Error('Invalid glossary data structure');
  }
}
