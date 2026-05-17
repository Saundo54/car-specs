import { GlossaryData, GlossaryEntry } from '../types/glossary';

class GlossaryManager {
  private data: GlossaryData | null = null;

  async loadGlossary(): Promise<void> {
    try {
      const response = await fetch('/data/glossary.json');
      if (!response.ok) throw new Error('Failed to load glossary');
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading glossary:', error);
      this.data = { version: '1.0.0', lastUpdated: new Date().toISOString(), entries: [] };
    }
  }

  getEntry(term: string): GlossaryEntry | null {
    if (!this.data) return null;
    const lowerTerm = term.toLowerCase();
    return this.data.entries.find(entry => 
      entry.term.toLowerCase() === lowerTerm || 
      entry.aliases?.some(alias => alias.toLowerCase() === lowerTerm)
    ) || null;
  }

  getAllTerms(): string[] {
    if (!this.data) return [];
    return this.data.entries.map(entry => entry.term);
  }

  addEntry(entry: GlossaryEntry): void {
    if (!this.data) return;
    this.data.entries.push(entry);
  }

  updateEntry(term: string, updatedEntry: Partial<GlossaryEntry>): void {
    if (!this.data) return;
    const index = this.data.entries.findIndex(e => e.term === term);
    if (index !== -1) {
      this.data.entries[index] = { ...this.data.entries[index], ...updatedEntry };
    }
  }
}

export const glossaryManager = new GlossaryManager();
