#!/usr/bin/env node
/**
 * Validation script for glossary.json
 * Ensures the JSON file matches the TypeScript interface requirements
 */

const fs = require('fs');
const path = require('path');

const glossaryPath = path.join(__dirname, 'public/data/glossary.json');
const data = JSON.parse(fs.readFileSync(glossaryPath, 'utf8'));

// Validation constants
const validCategories = ['mechanical', 'safety', 'tech', 'general'];
const requiredFields = ['term', 'explanation', 'practicalBenefit', 'category'];
const requiredTerms = ['Torque Converter', 'Regenerative Braking', 'ADAS', 'DOHC', 'VVT', 'ABS'];

console.log('✓ Validating glossary.json structure...');
console.log('  Version:', data.version);
console.log('  Last Updated:', data.lastUpdated);
console.log('  Total Entries:', data.entries.length);
console.log('');

// Check required root fields
if (!data.version || !data.lastUpdated || !data.entries) {
  console.error('✗ Missing required root fields (version, lastUpdated, entries)');
  process.exit(1);
}

// Check entries is an array
if (!Array.isArray(data.entries)) {
  console.error('✗ entries must be an array');
  process.exit(1);
}

// Check each entry has required fields
data.entries.forEach((entry, idx) => {
  requiredFields.forEach(field => {
    if (!entry[field]) {
      console.error(`✗ Entry ${idx} (${entry.term || 'unknown'}) missing field: ${field}`);
      process.exit(1);
    }
  });
  
  if (!validCategories.includes(entry.category)) {
    console.error(`✗ Entry ${idx} (${entry.term}) has invalid category: ${entry.category}`);
    console.error(`  Valid categories: ${validCategories.join(', ')}`);
    process.exit(1);
  }
  
  // Check aliases if present
  if (entry.aliases !== undefined) {
    if (!Array.isArray(entry.aliases)) {
      console.error(`✗ Entry ${idx} (${entry.term}) aliases must be an array`);
      process.exit(1);
    }
    entry.aliases.forEach((alias, aliasIdx) => {
      if (typeof alias !== 'string') {
        console.error(`✗ Entry ${idx} (${entry.term}) alias ${aliasIdx} must be a string`);
        process.exit(1);
      }
    });
  }
});

console.log('✓ All entries have valid structure');
console.log('');

// Check required terms are present
const actualTerms = data.entries.map(e => e.term);
const missingTerms = requiredTerms.filter(term => !actualTerms.includes(term));

if (missingTerms.length > 0) {
  console.error('✗ Missing required terms:', missingTerms.join(', '));
  process.exit(1);
}

console.log('✓ All required terms present:');
requiredTerms.forEach(term => {
  const entry = data.entries.find(e => e.term === term);
  console.log(`  - ${term} (${entry.category})`);
});
console.log('');

// Summary
console.log('✓ Glossary validation complete!');
console.log(`  ${data.entries.length} entries validated successfully`);
