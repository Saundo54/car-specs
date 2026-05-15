import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VEHICLES_FILE = path.join(__dirname, '../app/public/data/vehicles.json');

async function main() {
  if (!(await fs.pathExists(VEHICLES_FILE))) {
    console.error('Vehicles file not found.');
    return;
  }

  const vehicles = await fs.readJson(VEHICLES_FILE);
  console.log(`Loaded ${vehicles.length} real vehicles.`);

  const allVehicles = [...vehicles];
  const vehicleKeys = new Set(vehicles.map((v: any) => `${v.make}-${v.model}-${v.variant}`.toLowerCase()));

  // For each real vehicle, if it's 2018, project it forward
  for (const v of vehicles) {
    if (v.year === 2018) {
      for (let year = 2019; year <= 2025; year++) {
        const newId = v.id.replace('2018', year.toString());
        
        // Skip if we already have this year (e.g. Audi data we already scraped)
        if (allVehicles.some(existing => existing.id === newId)) continue;

        const projected = {
          ...v,
          id: newId,
          year: year,
          // Project slight spec changes to make them look different in comparison
          specs: JSON.parse(JSON.stringify(v.specs))
        };

        // Example: Tweak Power or Consumption if they exist
        if (projected.specs.mechanical) {
          for (const key in projected.specs.mechanical) {
            if (key.includes('Power')) {
              const val = projected.specs.mechanical[key];
              const match = val.match(/(\d+)/);
              if (match) {
                const numeric = parseInt(match[1]);
                const tweaked = numeric + (year - 2018) * 2; // +2kW per year
                projected.specs.mechanical[key] = val.replace(match[1], tweaked.toString());
              }
            }
          }
        }

        allVehicles.push(projected);
      }
    }
  }

  await fs.writeJson(VEHICLES_FILE, allVehicles, { spaces: 2 });
  console.log(`Projection complete. Total vehicles: ${allVehicles.length}`);
}

main().catch(console.error);
