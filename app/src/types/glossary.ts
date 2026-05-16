/**
 * Glossary type definitions for technical term explanations
 * Part of Requirement 10: Technical Term Glossary
 */

/**
 * Represents a single glossary entry with term explanation and practical benefit
 */
export interface GlossaryEntry {
  /** The technical term (e.g., "ADAS", "Torque Converter") */
  term: string;
  
  /** Plain English explanation of the term */
  explanation: string;
  
  /** Practical benefit or impact on daily driving */
  practicalBenefit: string;
  
  /** Category classification for the term */
  category: 'mechanical' | 'safety' | 'tech' | 'general';
  
  /** Optional alternative terms that map to the same entry */
  aliases?: string[];
}

/**
 * Root glossary data structure containing metadata and entries
 */
export interface GlossaryData {
  /** Version identifier for the glossary data format */
  version: string;
  
  /** ISO 8601 timestamp of last update */
  lastUpdated: string;
  
  /** Array of all glossary entries */
  entries: GlossaryEntry[];
}
