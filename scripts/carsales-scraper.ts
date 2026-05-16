import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import pLimit from 'p-limit';

// Use process.cwd() so the script works with CommonJS and ts-node settings.
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'app/public/data');
const IMAGE_DIR = path.join(ROOT_DIR, 'app/public/images/vehicles');
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');
const PROGRESS_FILE = path.join(ROOT_DIR, 'scripts/carsales_progress.json');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BOT_USER_AGENT = 'Gemini-Deep-Research';
const CONCURRENCY_LIMIT = 3;
const START_YEAR = 2018;
const END_YEAR = 2026;
const MAX_CONSECUTIVE_BLOCKS = 5;

const limit = pLimit(CONCURRENCY_LIMIT);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ScrapingStats {
  successful: Array<{ make: string; model: string; year: number; variant: string }>;
  failed: Array<{ make: string; model: string; year: number; variant?: string; reason: string }>;
  skipped: number;
  consecutiveBlocks: number;
}

function isBlockedError(err: any) {
  const status = err?.response?.status;
  const body = err?.response?.data?.toString?.() || '';
  if (status === 403 || status === 429) return true;
  const lower = body.toLowerCase();
  if (lower.includes('access denied') || lower.includes('cloudfront') || lower.includes('ddos') || lower.includes('blocked')) return true;
  return false;
}

async function saveProgress(state: any, vehicles: Map<string, any>) {
  try {
    await fs.writeJson(PROGRESS_FILE, state, { spaces: 2 });
    await fs.writeJson(VEHICLES_FILE, Array.from(vehicles.values()), { spaces: 2 });
  } catch (e) {}
}

async function loadProgress() {
  if (await fs.pathExists(PROGRESS_FILE)) {
    try { return await fs.readJson(PROGRESS_FILE); } catch (e) { return null; }
  }
  return null;
}

async function main() {
  console.log(`\n=== CarSales Scraper (${START_YEAR}-${END_YEAR}) ===\n`);
  await fs.ensureDir(DATA_DIR);
  await fs.ensureDir(IMAGE_DIR);

  const stats: ScrapingStats = {
    successful: [],
    failed: [],
    skipped: 0,
    consecutiveBlocks: 0
  };

  const discoveryHeaders = {
    'User-Agent': USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.carsales.com.au/research/'
  };

  let existingVehicles: any[] = [];
  if (await fs.pathExists(VEHICLES_FILE)) {
    existingVehicles = await fs.readJson(VEHICLES_FILE);
    console.log(`✓ Loaded ${existingVehicles.length} existing vehicles from vehicles.json`);
  }

  const vehiclesMap = new Map<string, any>(existingVehicles.map(v => [v.id, v]));
  
  // Build a set of existing vehicle IDs for quick lookup
  const existingIds = new Set(vehiclesMap.keys());
  console.log(`✓ Will skip ${existingIds.size} already-scraped vehicles\n`);

  // Discover makes from research landing page
  let allMakes: string[] = [];
  try {
    const researchPage = await axios.get('https://www.carsales.com.au/research/', { headers: discoveryHeaders, timeout: 15000 });
    allMakes = [...new Set(Array.from(researchPage.data.matchAll(/https:\/\/www\.carsales\.com\.au\/research\/([^/\"]+)\//g)).map((m: any) => m[1]))]
      .filter(m => !m.includes('-lifestyle') && !m.includes('-bodytype') && m !== 'showroom' && !/^\d+$/.test(m));
    console.log(`✓ Discovered ${allMakes.length} makes from CarSales\n`);
  } catch (err: any) {
    console.error('✗ Failed to fetch makes from research page:', err?.message || err);
    return;
  }

  const commonBrands = ['toyota', 'mazda', 'ford', 'hyundai', 'kia', 'mitsubishi', 'nissan', 'subaru', 'volkswagen', 'honda', 'mg', 'isuzu', 'bmw', 'mercedes-benz', 'audi', 'lexus', 'volvo', 'skoda', 'jeep', 'land-rover', 'porsche', 'tesla', 'byd'];
  const otherBrands = allMakes.filter(m => !commonBrands.includes(m));
  const sortedMakes = [...commonBrands.filter(m => allMakes.includes(m)), ...otherBrands];

  const progress = await loadProgress() || { makeIndex: 0, modelIndex: 0, year: START_YEAR, variantIndex: 0 };

  for (let mi = progress.makeIndex; mi < sortedMakes.length; mi++) {
    const make = sortedMakes[mi];
    console.log(`\n[${mi + 1}/${sortedMakes.length}] Processing: ${make.toUpperCase()}`);

    let models: string[] = [];
    try {
      const makePageUrl = `https://www.carsales.com.au/research/${make}/`;
      const makePage = await axios.get(makePageUrl, { headers: discoveryHeaders, timeout: 15000 });
      models = [...new Set(Array.from(makePage.data.matchAll(new RegExp(`https:\/\/www\\.carsales\\.com\\.au\\/research\\/${make.replace(/-/g,'\\-')}\\/([^/\"]+)\\/`, 'g'))).map((m: any) => m[1]))]
        .filter(m => ![...Array(20).keys()].map(i => (2018 + i).toString()).includes(m));
      stats.consecutiveBlocks = 0; // Reset on success
    } catch (err: any) {
      console.error(`  ✗ Failed to load models for ${make}:`, err?.message || err);
      if (isBlockedError(err)) {
        stats.consecutiveBlocks++;
        console.error(`  ⚠ BLOCKED by CloudFront (${stats.consecutiveBlocks}/${MAX_CONSECUTIVE_BLOCKS})`);
        stats.failed.push({ make, model: '*', year: 0, reason: 'Blocked fetching models' });
        
        if (stats.consecutiveBlocks >= MAX_CONSECUTIVE_BLOCKS) {
          console.error(`\n✗ BLOCKED ${MAX_CONSECUTIVE_BLOCKS} times consecutively. Exiting to prevent further blocks.`);
          await saveProgress({ makeIndex: mi, modelIndex: 0, year: START_YEAR, variantIndex: 0 }, vehiclesMap);
          await printFinalReport(stats, vehiclesMap);
          process.exit(1);
        }
        
        await saveProgress({ makeIndex: mi, modelIndex: 0, year: progress.year, variantIndex: 0 }, vehiclesMap);
        continue; // Skip this make and try next
      }
      stats.failed.push({ make, model: '*', year: 0, reason: err?.message || 'Unknown error' });
      continue;
    }
    
    console.log(`  Found ${models.length} models`);
    if (models.length === 0) continue;

    for (let mo = (mi === progress.makeIndex ? progress.modelIndex : 0); mo < models.length; mo++) {
      const model = models[mo];
      console.log(`  [${mo + 1}/${models.length}] ${model}`);

      for (let year = (mi === progress.makeIndex && mo === progress.modelIndex ? progress.year : START_YEAR); year <= END_YEAR; year++) {
        const yearPageUrl = `https://www.carsales.com.au/research/${make}/${model}/${year}/`;
        try {
          await sleep(1200 + Math.random() * 1000);
          const yearPage = await axios.get(yearPageUrl, { headers: { ...discoveryHeaders, Referer: `https://www.carsales.com.au/research/${make}/` }, timeout: 15000 });
          const pattern = `https://www.carsales.com.au/research/${make}/${model}/${year}/`;
          const variantUrls = [...new Set(yearPage.data.split('"').filter((s: string) => (s as string).startsWith(pattern) && (s as string).length > pattern.length))] as string[];

          stats.consecutiveBlocks = 0; // Reset on success

          if (variantUrls.length === 0) continue;

          console.log(`    [${year}] ${variantUrls.length} variants`);

          for (let vi = (mi === progress.makeIndex && mo === progress.modelIndex && year === progress.year ? progress.variantIndex : 0); vi < variantUrls.length; vi++) {
            const url = variantUrls[vi] as string;
            const parts = url.split('/').filter(Boolean);
            const variant = parts[7] || parts[parts.length - 1];
            const id = `${make}-${model}-${year}-${variant}`.toLowerCase();
            
            if (vehiclesMap.has(id)) {
              stats.skipped++;
              continue;
            }

            try {
              await sleep(1000 + Math.random() * 2000);
              const vehicle = await scrapeVehicle(url, id);
              if (vehicle) {
                vehiclesMap.set(vehicle.id, vehicle);
                stats.successful.push({ make: vehicle.make, model: vehicle.model, year: vehicle.year, variant: vehicle.variant });
                stats.consecutiveBlocks = 0; // Reset on success
                console.log(`      ✓ ${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.variant}`);
              }
            } catch (err: any) {
              if (isBlockedError(err)) {
                stats.consecutiveBlocks++;
                console.error(`      ⚠ BLOCKED by CloudFront (${stats.consecutiveBlocks}/${MAX_CONSECUTIVE_BLOCKS})`);
                stats.failed.push({ make, model, year, variant, reason: 'Blocked by CloudFront' });
                
                if (stats.consecutiveBlocks >= MAX_CONSECUTIVE_BLOCKS) {
                  console.error(`\n✗ BLOCKED ${MAX_CONSECUTIVE_BLOCKS} times consecutively. Exiting to prevent further blocks.`);
                  await saveProgress({ makeIndex: mi, modelIndex: mo, year, variantIndex: vi }, vehiclesMap);
                  await printFinalReport(stats, vehiclesMap);
                  process.exit(1);
                }
                
                await saveProgress({ makeIndex: mi, modelIndex: mo, year, variantIndex: vi }, vehiclesMap);
                continue; // Skip this variant and continue
              } else {
                stats.failed.push({ make, model, year, variant, reason: err?.message || 'Unknown error' });
                console.error(`      ✗ Failed: ${err?.message || 'Unknown error'}`);
              }
            }

            if (vehiclesMap.size % 20 === 0) {
              await saveProgress({ makeIndex: mi, modelIndex: mo, year, variantIndex: vi + 1 }, vehiclesMap);
              console.log(`      [Progress saved: ${vehiclesMap.size} vehicles]`);
            }
          }

        } catch (err: any) {
          if (isBlockedError(err)) {
            stats.consecutiveBlocks++;
            console.error(`    ⚠ BLOCKED fetching year page (${stats.consecutiveBlocks}/${MAX_CONSECUTIVE_BLOCKS})`);
            stats.failed.push({ make, model, year, reason: 'Blocked fetching year page' });
            
            if (stats.consecutiveBlocks >= MAX_CONSECUTIVE_BLOCKS) {
              console.error(`\n✗ BLOCKED ${MAX_CONSECUTIVE_BLOCKS} times consecutively. Exiting to prevent further blocks.`);
              await saveProgress({ makeIndex: mi, modelIndex: mo, year, variantIndex: 0 }, vehiclesMap);
              await printFinalReport(stats, vehiclesMap);
              process.exit(1);
            }
            
            await saveProgress({ makeIndex: mi, modelIndex: mo, year, variantIndex: 0 }, vehiclesMap);
            continue; // Skip this year and continue
          } else {
            stats.failed.push({ make, model, year, reason: err?.message || 'Unknown error' });
          }
        }
      }

      // reset variant progress after finishing model
      await saveProgress({ makeIndex: mi, modelIndex: mo + 1, year: START_YEAR, variantIndex: 0 }, vehiclesMap);
      console.log(`  ✓ Completed ${model} (Total: ${vehiclesMap.size} vehicles)`);
    }

    // finished make
    await saveProgress({ makeIndex: mi + 1, modelIndex: 0, year: START_YEAR, variantIndex: 0 }, vehiclesMap);
    console.log(`✓ Completed ${make.toUpperCase()} (Total: ${vehiclesMap.size} vehicles)`);
  }

  // final write
  await fs.writeJson(VEHICLES_FILE, Array.from(vehiclesMap.values()), { spaces: 2 });
  if (await fs.pathExists(PROGRESS_FILE)) await fs.remove(PROGRESS_FILE);
  
  await printFinalReport(stats, vehiclesMap);
}

async function printFinalReport(stats: ScrapingStats, vehiclesMap: Map<string, any>) {
  console.log('\n' + '='.repeat(80));
  console.log('SCRAPING REPORT');
  console.log('='.repeat(80));
  
  console.log(`\n✓ Total vehicles in database: ${vehiclesMap.size}`);
  console.log(`✓ Successfully scraped this session: ${stats.successful.length}`);
  console.log(`⊘ Skipped (already in database): ${stats.skipped}`);
  console.log(`✗ Failed: ${stats.failed.length}`);
  
  if (stats.successful.length > 0) {
    console.log('\n' + '-'.repeat(80));
    console.log('SUCCESSFULLY SCRAPED:');
    console.log('-'.repeat(80));
    
    // Group by make
    const byMake = new Map<string, typeof stats.successful>();
    for (const item of stats.successful) {
      if (!byMake.has(item.make)) byMake.set(item.make, []);
      byMake.get(item.make)!.push(item);
    }
    
    for (const [make, items] of Array.from(byMake.entries()).sort()) {
      console.log(`\n${make} (${items.length} vehicles):`);
      
      // Group by model
      const byModel = new Map<string, typeof items>();
      for (const item of items) {
        if (!byModel.has(item.model)) byModel.set(item.model, []);
        byModel.get(item.model)!.push(item);
      }
      
      for (const [model, modelItems] of Array.from(byModel.entries()).sort()) {
        const years = [...new Set(modelItems.map(i => i.year))].sort();
        console.log(`  ${model}: ${years.join(', ')}`);
      }
    }
  }
  
  if (stats.failed.length > 0) {
    console.log('\n' + '-'.repeat(80));
    console.log('FAILED TO SCRAPE:');
    console.log('-'.repeat(80));
    
    // Group by make
    const byMake = new Map<string, typeof stats.failed>();
    for (const item of stats.failed) {
      if (!byMake.has(item.make)) byMake.set(item.make, []);
      byMake.get(item.make)!.push(item);
    }
    
    for (const [make, items] of Array.from(byMake.entries()).sort()) {
      console.log(`\n${make}:`);
      
      for (const item of items) {
        if (item.model === '*') {
          console.log(`  All models - ${item.reason}`);
        } else if (item.variant) {
          console.log(`  ${item.model} ${item.year} ${item.variant} - ${item.reason}`);
        } else {
          console.log(`  ${item.model} ${item.year} - ${item.reason}`);
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`Vehicles data saved to: ${VEHICLES_FILE}`);
  console.log('='.repeat(80) + '\n');
}

async function scrapeVehicle(url: string, id: string) {
  const apiUrl = url.replace('https://www.carsales.com.au/research/', 'https://www.carsales.com.au/_api/taco-makemodel/research/');
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': BOT_USER_AGENT,
        'Referer': url,
        'Accept': 'application/json'
      },
      timeout: 20000
    });

    const raw = response.data;
    if (!raw || !raw.root) return null;

    const parts = url.split('/');
    const make = parts[4];
    const model = parts[5];
    const year = parseInt(parts[6]);
    const variant = parts[7];

    const vehicle: any = {
      id,
      make: capitalize(make.replace(/-/g, ' ')),
      model: capitalize(model.replace(/-/g, ' ')),
      year,
      variant: variant.replace(/-/g, ' ').toUpperCase(),
      specs: { mechanical: {}, dimensions: {}, safety: {}, tech: {}, interior: {} }
    };

    const findComponents = (root: any, predicate: (node: any) => boolean): any[] => {
      let results: any[] = [];
      if (!root) return results;
      if (predicate(root)) results.push(root);
      if (root.children && Array.isArray(root.children)) {
        for (const child of root.children) results = results.concat(findComponents(child, predicate));
      }
      if (root.child) results = results.concat(findComponents(root.child, predicate));
      return results;
    };

    const accordions = findComponents(raw.root, (node) => node.type === 'AccordionItem');
    for (const acc of accordions) {
      const category = (acc.id || '').toLowerCase();
      const rows = findComponents(acc, (node) => node.type === 'Stack' && node.direction === 'vertical');
      for (const row of rows) {
        const labels = findComponents(row, (node) => node.type === 'Text' && (node.color === 'foreground-extrasubtle' || node.color === 'foreground-subtle'));
        const values = findComponents(row, (node) => node.type === 'Text' && (node.color === 'foreground-default' || node.color === 'foreground-subtle'));
        if (labels.length > 0 && values.length > 0) {
          const label = labels[0].value;
          const value = values[0].value;
          if (category.includes('engine') || category.includes('transmission') || category.includes('mechanical')) {
            vehicle.specs.mechanical[label] = value;
            if (label === 'Fuel type') vehicle.fuel_type = value;
            if (label === 'Drivetrain') vehicle.drivetrain = value;
          } else if (category.includes('dimensions')) {
            vehicle.specs.dimensions[label] = value;
          } else if (category.includes('interior')) {
            vehicle.specs.interior[label] = value;
            if (label === 'Seating capacity') vehicle.seats = parseInt(value);
          } else if (category.includes('safety')) {
            vehicle.specs.safety[label] = value;
            if (label === 'ANCAP rating') vehicle.ancap_rating = parseInt(value);
          } else if (category.includes('technology')) {
            vehicle.specs.tech[label] = value;
          }
        }
      }
    }

    const titleNodes = findComponents(raw.root, (node) => node.type === 'Text' && node.variant === 'heading-1');
    if (titleNodes.length > 0) {
      const title = (titleNodes[0].value || '').toLowerCase();
      if (title.includes('sedan')) vehicle.body_type = 'Sedan';
      else if (title.includes('suv')) vehicle.body_type = 'SUV';
      else if (title.includes('hatch')) vehicle.body_type = 'Hatch';
      else if (title.includes('ute')) vehicle.body_type = 'Ute';
      else if (title.includes('wagon')) vehicle.body_type = 'Wagon';
      else if (title.includes('van')) vehicle.body_type = 'Van';
    }

    const imageNodes = findComponents(raw.root, (node) => node.type === 'Image' && node.url && node.url.includes('pxcrush.net'));
    if (imageNodes.length > 0) {
      const imageUrl = imageNodes[0].url;
      const imagePath = path.join(IMAGE_DIR, `${id}.jpg`);
      if (!(await fs.pathExists(imagePath))) await downloadImage(imageUrl, imagePath);
      vehicle.image = `/images/vehicles/${id}.jpg`;
    }

    return vehicle;
  } catch (err) {
    throw err;
  }
}

async function downloadImage(url: string, dest: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    await fs.writeFile(dest, response.data);
  } catch (e) {}
}

function capitalize(s: string) {
  return s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Run the script
main().catch(err => { 
  console.error('\n✗ Fatal error:', err); 
  process.exit(1); 
});
