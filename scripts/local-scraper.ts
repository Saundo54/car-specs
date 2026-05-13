import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import pLimit from 'p-limit';

const DATA_DIR = path.join(__dirname, '../app/public/data');
const IMAGE_DIR = path.join(__dirname, '../app/public/images/vehicles');
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BOT_USER_AGENT = 'Gemini-Deep-Research';
const CONCURRENCY_LIMIT = 5;

const limit = pLimit(CONCURRENCY_LIMIT);

async function main() {
  console.log('Starting local scraper for 2018 vehicles (Crawl Mode)...');
  
  await fs.ensureDir(DATA_DIR);
  await fs.ensureDir(IMAGE_DIR);

  const discoveryHeaders = {
    'User-Agent': USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.carsales.com.au/research/'
  };

  try {
    const targetMakes = ['toyota', 'mazda', 'honda', 'hyundai', 'kia', 'ford', 'volkswagen', 'mitsubishi', 'nissan', 'subaru'];
    console.log(`Targeting 2018 vehicles for makes: ${targetMakes.join(', ')}`);

    const vehiclesMap = new Map<string, any>();

    for (const make of targetMakes) {
      console.log(`\n--- Processing Make: ${make} ---`);
      try {
        const makePage = await axios.get(`https://www.carsales.com.au/research/${make}/`, { headers: discoveryHeaders });
        const models = [...new Set(Array.from(makePage.data.matchAll(new RegExp(`https:\\/\\/www\\.carsales\\.com\\.au\\/research\\/${make}\\/([^/"]+)\\/`, 'g')))
          .map((m: any) => m[1]))]
          .filter(m => !['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'].includes(m));

        console.log(`Found ${models.length} models for ${make}.`);

        for (const model of models) {
          try {
            const yearPageUrl = `https://www.carsales.com.au/research/${make}/${model}/2018/`;
            const yearPage = await axios.get(yearPageUrl, { headers: { ...discoveryHeaders, 'Referer': `https://www.carsales.com.au/research/${make}/` } });
            const variantUrls = [...new Set(Array.from(yearPage.data.matchAll(new RegExp(`https:\\/\\/www\\.carsales\\.com\\.au\\/research\\/${make}\\/${model}\\/2018\\/([^/"]+)\\/`, 'g')))
              .map((m: any) => m[0]))];

            if (variantUrls.length > 0) {
              console.log(`  [${model}] Found ${variantUrls.length} variants for 2018.`);
              
              const scrapePromises = variantUrls.map(url => limit(async () => {
                const vehicle = await scrapeVehicle(url);
                if (vehicle && !vehiclesMap.has(vehicle.id)) {
                  vehiclesMap.set(vehicle.id, vehicle);
                  console.log(`    [OK] ${vehicle.make} ${vehicle.model} ${vehicle.variant}`);
                }
              }));
              await Promise.all(scrapePromises);
            }
          } catch (e) {
            // No 2018 model
          }
        }
      } catch (err) {
        console.error(`Failed to process make ${make}`);
      }
      
      if (vehiclesMap.size > 0) {
        await fs.writeJson(VEHICLES_FILE, Array.from(vehiclesMap.values()), { spaces: 2 });
      }
    }

    console.log(`Scraping complete. Total vehicles: ${vehiclesMap.size}`);

  } catch (error) {
    console.error('Global failure:', error);
  }
}

async function scrapeVehicle(url: string) {
  const apiUrl = url.replace('https://www.carsales.com.au/research/', 'https://www.carsales.com.au/_api/taco-makemodel/research/');
  
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': BOT_USER_AGENT,
        'Referer': url
      },
      timeout: 15000
    });

    const raw = response.data;
    const parts = url.split('/');
    const make = parts[4];
    const model = parts[5];
    const year = parseInt(parts[6]);
    const variant = parts[7];
    const id = `${make}-${model}-${year}-${variant}`.toLowerCase();

    const vehicle: any = {
      id,
      make: capitalize(make),
      model: capitalize(model),
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
      const category = acc.id.toLowerCase();
      const rows = findComponents(acc, (node) => node.type === 'Stack' && node.direction === 'vertical');

      for (const row of rows) {
        const labels = findComponents(row, (node) => node.type === 'Text' && node.color === 'foreground-extrasubtle');
        const values = findComponents(row, (node) => node.type === 'Text' && node.color === 'foreground-default');

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

    if (!vehicle.body_type) {
      const titleNodes = findComponents(raw.root, (node) => node.type === 'Text' && node.variant === 'heading-1');
      if (titleNodes.length > 0) {
        const title = titleNodes[0].value.toLowerCase();
        if (title.includes('sedan')) vehicle.body_type = 'Sedan';
        else if (title.includes('suv')) vehicle.body_type = 'SUV';
        else if (title.includes('hatch')) vehicle.body_type = 'Hatch';
        else if (title.includes('ute')) vehicle.body_type = 'Ute';
        else if (title.includes('wagon')) vehicle.body_type = 'Wagon';
      }
    }

    const imageNodes = findComponents(raw.root, (node) => node.type === 'Image' && node.url && node.url.includes('pxcrush.net'));
    if (imageNodes.length > 0) {
      const imageUrl = imageNodes[0].url;
      const imagePath = path.join(IMAGE_DIR, `${id}.jpg`);
      await downloadImage(imageUrl, imagePath);
      vehicle.image = `/images/vehicles/${id}.jpg`;
    }

    return vehicle;
  } catch (err) {
    return null;
  }
}

async function downloadImage(url: string, dest: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    await fs.writeFile(dest, response.data);
  } catch (err) {}
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

if (require.main === module) {
  main().catch(console.error);
}
