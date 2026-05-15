import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import pLimit from 'p-limit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../app/public/data');
const IMAGE_DIR = path.join(__dirname, '../app/public/images/vehicles');
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BOT_USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const CONCURRENCY_LIMIT = 2;

const limit = pLimit(CONCURRENCY_LIMIT);

const START_YEAR = 2018;
const END_YEAR = 2025;

const sleep = (ms: number) => new Promise(resolve => setTimeout(ms, resolve));

async function main() {
  console.log(`Starting improved comprehensive scraper for vehicles ${START_YEAR}-${END_YEAR}...`);
  
  await fs.ensureDir(DATA_DIR);
  await fs.ensureDir(IMAGE_DIR);

  let existingVehicles: any[] = [];
  if (await fs.pathExists(VEHICLES_FILE)) {
    existingVehicles = await fs.readJson(VEHICLES_FILE);
    console.log(`Loaded ${existingVehicles.length} existing vehicles.`);
  }

  const vehiclesMap = new Map<string, any>(existingVehicles.map(v => [v.id, v]));

  const discoveryHeaders = {
    'User-Agent': USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.carsales.com.au/research/'
  };

  try {
    console.log('Discovering makes...');
    const researchPage = await axios.get('https://www.carsales.com.au/research/', { headers: discoveryHeaders });
    const allMakes = [...new Set(Array.from(researchPage.data.matchAll(/https:\/\/www\.carsales\.com\.au\/research\/([^/"]+)\//g))
      .map((m: any) => m[1]))]
      .filter(m => !m.includes('-lifestyle') && !m.includes('-bodytype') && m !== 'showroom' && !/^\d+$/.test(m));

    console.log(`Found ${allMakes.length} total makes.`);
    
    const commonBrands = ['toyota', 'mazda', 'ford', 'hyundai', 'kia', 'mitsubishi', 'nissan', 'subaru', 'volkswagen', 'honda', 'mg', 'isuzu', 'bmw', 'mercedes-benz', 'audi', 'lexus', 'volvo', 'skoda', 'jeep', 'land-rover', 'porsche', 'tesla', 'byd'];
    const otherBrands = allMakes.filter(m => !commonBrands.includes(m));
    const sortedMakes = [...commonBrands, ...otherBrands];

    for (const make of sortedMakes) {
      console.log(`\n--- Processing Make: ${make} ---`);
      try {
        const makePageUrl = `https://www.carsales.com.au/research/${make}/`;
        const makePage = await axios.get(makePageUrl, { headers: discoveryHeaders });
        
        const models = [...new Set(Array.from(makePage.data.matchAll(new RegExp(`https:\\/\\/www\\.carsales\\.com\\.au\\/research\\/${make.replace(/-/g, '\\-')}\\/([^/"]+)\\/`, 'g')))
          .map((m: any) => m[1]))]
          .filter(m => !['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'].includes(m));

        console.log(`Found ${models.length} models for ${make}.`);

        for (const model of models) {
          console.log(`  Checking ${make} ${model}...`);
          for (let year = START_YEAR; year <= END_YEAR; year++) {
            const existingCount = Array.from(vehiclesMap.keys()).filter(id => id.startsWith(`${make}-${model}-${year}`)).length;
            if (existingCount > 0) continue;

            const yearPageUrl = `https://www.carsales.com.au/research/${make}/${model}/${year}/`;
            try {
              await sleep(1500); 
              const yearPage = await axios.get(yearPageUrl, { 
                headers: { ...discoveryHeaders, 'Referer': makePageUrl },
                timeout: 10000
              });

              const html = yearPage.data;
              const pattern = `https://www.carsales.com.au/research/${make}/${model}/${year}/`;
              const variantUrls = [...new Set(html.split('"')
                .filter((s: string) => (s as string).startsWith(pattern) && (s as string).length > pattern.length)
              )];

              if (variantUrls.length > 0) {
                console.log(`    [${year}] Found ${variantUrls.length} variants.`);
                
                const scrapePromises = variantUrls.map(url => limit(async () => {
                  const parts = (url as string).split('/');
                  const variant = parts[7];
                  const id = `${make}-${model}-${year}-${variant}`.toLowerCase();

                  if (vehiclesMap.has(id)) return;

                  await sleep(Math.random() * 2000 + 1000); 
                  const vehicle = await scrapeVehicle(url as string, id);
                  if (vehicle) {
                    vehiclesMap.set(vehicle.id, vehicle);
                    console.log(`      [OK] ${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.variant}`);
                    
                    if (vehiclesMap.size % 20 === 0) {
                      await fs.writeJson(VEHICLES_FILE, Array.from(vehiclesMap.values()), { spaces: 2 });
                    }
                  }
                }));
                await Promise.all(scrapePromises);
              }
            } catch (e: any) {
              if (e.response?.status === 403) {
                console.error(`    [${year}] ERROR 403: Blocked. Stopping.`);
                return;
              }
            }
          }
        }
      } catch (err: any) {
        console.error(`Failed to process make ${make}: ${err.message}`);
        if (err.response?.status === 403) return;
      }
      
      await fs.writeJson(VEHICLES_FILE, Array.from(vehiclesMap.values()), { spaces: 2 });
    }

    console.log(`Scraping complete. Total vehicles: ${vehiclesMap.size}`);

  } catch (error) {
    console.error('Global failure:', error);
  }
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
        for (const child of root.children) {
          results = results.concat(findComponents(child, predicate));
        }
      }
      if (root.child) {
        results = results.concat(findComponents(root.child, predicate));
      }
      return results;
    };

    const accordions = findComponents(raw.root, (node) => node.type === 'AccordionItem');
    
    for (const acc of accordions) {
      const category = acc.id ? acc.id.toLowerCase() : '';
      const rows = findComponents(acc, (node) => node.type === 'Stack' && node.direction === 'vertical');

      for (const row of rows) {
        const labels = findComponents(row, (node) => node.type === 'Text' && node.color === 'foreground-extrasubtle');
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
      const title = titleNodes[0].value.toLowerCase();
      if (title.includes('sedan')) vehicle.body_type = 'Sedan';
      else if (title.includes('suv')) vehicle.body_type = 'SUV';
      else if (title.includes('hatch')) vehicle.body_type = 'Hatch';
      else if (title.includes('ute')) vehicle.body_type = 'Ute';
      else if (title.includes('wagon')) vehicle.body_type = 'Wagon';
      else if (title.includes('van')) vehicle.body_type = 'Van';
      else if (title.includes('convertible')) vehicle.body_type = 'Convertible';
      else if (title.includes('coupe')) vehicle.body_type = 'Coupe';
    }

    const imageNodes = findComponents(raw.root, (node) => node.type === 'Image' && node.url && node.url.includes('pxcrush.net'));
    if (imageNodes.length > 0) {
      const imageUrl = imageNodes[0].url;
      const imagePath = path.join(IMAGE_DIR, `${id}.jpg`);
      if (!(await fs.pathExists(imagePath))) {
        await downloadImage(imageUrl, imagePath);
      }
      vehicle.image = `/images/vehicles/${id}.jpg`;
    }

    return vehicle;
  } catch (err) {
    return null;
  }
}

async function downloadImage(url: string, dest: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    await fs.writeFile(dest, response.data);
  } catch (err) {}
}

function capitalize(s: string) {
  return s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

main().catch(console.error);
