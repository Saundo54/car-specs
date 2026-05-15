import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VEHICLES_FILE = path.join(__dirname, '../app/public/data/vehicles.json');

async function testFilters() {
  const vehicles = await fs.readJson(VEHICLES_FILE);
  console.log(`Testing filters against ${vehicles.length} vehicles...\n`);

  // Helper to simulate the normalization logic in SearchScreen.tsx
  const normalizeFuelType = (v: any) => {
    const raw = v.fuel_type || (v.specs?.mechanical && (v.specs.mechanical['Fuel type'] || v.specs.mechanical['Fuel Type'])) || '';
    const lower = raw.toLowerCase();
    if (lower.includes('petrol')) return 'Petrol';
    if (lower.includes('diesel')) return 'Diesel';
    if (lower.includes('hybrid')) return 'Hybrid';
    if (lower.includes('electric')) return 'Electric';
    return raw || 'Other';
  };

  // Test Case 1: All Wheel Drive
  const awdResults = vehicles.filter((v: any) => {
    const drive = v.specs?.mechanical?.['Drive'] || '';
    return drive.includes('All Wheel Drive');
  });
  console.log(`AWD Vehicles: ${awdResults.length}`);
  if (awdResults.length > 0) {
      console.log(`  Sample Drive values: ${[...new Set(awdResults.map((v: any) => v.specs.mechanical['Drive']))].slice(0, 3)}`);
  }

  // Test Case 2: Transmission (Automatic)
  const autoResults = vehicles.filter((v: any) => {
    const trans = v.specs?.mechanical?.['Transmission'] || '';
    const isManual = trans.toLowerCase().includes('manual');
    const isAuto = !isManual && (trans.toLowerCase().includes('auto') || trans.toLowerCase().includes('cvt') || trans.toLowerCase().includes('dual clutch'));
    return isAuto;
  });
  console.log(`Automatic Vehicles: ${autoResults.length}`);

  // Test Case 3: Power Range (e.g. 100kW - 200kW)
  const powerResults = vehicles.filter((v: any) => {
    const powerStr = v.specs?.mechanical?.['Maximum Power'] || '';
    const powerMatch = powerStr.match(/(\d+)kW/);
    const power = powerMatch ? parseInt(powerMatch[1]) : 0;
    return power >= 100 && power <= 200;
  });
  console.log(`Vehicles with 100-200kW Power: ${powerResults.length}`);

  // Test Case 4: 4 Cylinders
  const cylinderResults = vehicles.filter((v: any) => {
    const cylStr = v.specs?.mechanical?.['Cylinders'] || '';
    const cyl = parseInt(cylStr);
    return cyl === 4;
  });
  console.log(`4 Cylinder Vehicles: ${cylinderResults.length}`);

  // Test Case 5: Drive Type "4X4" vs "4x4"
  const drive4x4Results = vehicles.filter((v: any) => {
    const drive = v.specs?.mechanical?.['Drive'] || '';
    return drive.includes('4X4') || drive.includes('4x4');
  });
  console.log(`4x4 Vehicles: ${drive4x4Results.length}`);

  console.log('\n--- Diagnostic Sample (First 5 vehicles) ---');
  vehicles.slice(0, 5).forEach((v: any) => {
    console.log(`Vehicle: ${v.make} ${v.model} ${v.year}`);
    console.log(`  Drive: ${v.specs?.mechanical?.['Drive']}`);
    console.log(`  Trans: ${v.specs?.mechanical?.['Transmission']}`);
    console.log(`  Cyls: ${v.specs?.mechanical?.['Cylinders']}`);
    console.log(`  Power: ${v.specs?.mechanical?.['Maximum Power']}`);
    console.log(`  Induction: ${v.specs?.mechanical?.['Induction']}`);
  });
}

testFilters().catch(console.error);
