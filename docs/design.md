# Design Specification: CarSpec PWA / Android App

**Project:** CarSpec — Vehicle Specifications Research Application  
**Version:** 1.0  
**Date:** May 2026

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│                                                                 │
│   PWA (React + Vite)          Android App (Phase 2)            │
│   ┌─────────────────┐         ┌──────────────────────┐         │
│   │  Service Worker │         │   TWA (Bubblewrap)   │         │
│   │  IndexedDB      │         │   or React Native    │         │
│   │  Cache API      │         └──────────────────────┘         │
│   └─────────────────┘                                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
┌───────────────────────────────▼─────────────────────────────────┐
│                           AWS EDGE                              │
│                                                                 │
│   ┌──────────────────────────────────────────┐                 │
│   │          Amazon CloudFront CDN           │                 │
│   │   Static PWA assets + API caching        │                 │
│   └──────┬──────────────────────┬────────────┘                 │
│          │                      │                               │
│   ┌──────▼──────┐        ┌──────▼──────┐                       │
│   │  S3 Bucket  │        │ API Gateway │                       │
│   │  (PWA dist) │        │  (REST API) │                       │
│   └─────────────┘        └──────┬──────┘                       │
└──────────────────────────────────┼──────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────┐
│                         COMPUTE LAYER                           │
│                                                                 │
│   ┌──────────────────────────────────────────┐                 │
│   │           AWS Lambda Functions           │                 │
│   │                                          │                 │
│   │  lambda-api        lambda-scraper        │                 │
│   │  (GET /vehicles)   (Playwright/Chromium) │                 │
│   │  (GET /specs/{id}) (EventBridge trigger) │                 │
│   │  (GET /compare)    (Monthly schedule)    │                 │
│   └──────┬─────────────────────┬─────────────┘                 │
└──────────┼─────────────────────┼───────────────────────────────┘
           │                     │
┌──────────▼─────────────────────▼───────────────────────────────┐
│                          DATA LAYER                             │
│                                                                 │
│   ┌─────────────────┐    ┌─────────────────────────────┐       │
│   │    DynamoDB     │    │          S3 Bucket          │       │
│   │                 │    │                             │       │
│   │  Table: vehicles│    │  /raw/          (scraped)   │       │
│   │  PK: make#model │    │  /processed/    (normalised)│       │
│   │  SK: year#var   │    │  /index/        (search idx)│       │
│   │                 │    │  /assets/       (PWA dist)  │       │
│   │  GSI: body_type │    └─────────────────────────────┘       │
│   │  GSI: fuel_type │                                          │
│   └─────────────────┘    ┌─────────────────────────────┐       │
│                          │   CloudWatch Logs + SNS     │       │
│                          │   (monitoring + alerts)     │       │
│                          └─────────────────────────────┘       │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Architecture

### 2.1 DynamoDB Schema

**Table: `carspec-vehicles`**

```
Partition Key (PK): make#model          e.g. "toyota#camry"
Sort Key (SK):      year#variant        e.g. "2023#ascent-hybrid-sedan"

Attributes:
  make            String      "Toyota"
  model           String      "Camry"
  year            Number      2023
  variant         String      "Ascent Hybrid Sedan"
  body_type       String      "sedan"
  fuel_type       String      "hybrid"
  drivetrain      String      "fwd"
  seats           Number      5
  specs           Map         { mechanical: {...}, dimensions: {...}, ... }
  ancap_rating    Number      5
  source_url      String
  last_updated    String      ISO-8601
  schema_version  String      "1.0"

GSIs:
  GSI-BodyType:   PK=body_type, SK=year#make#model
  GSI-FuelType:   PK=fuel_type, SK=year#make#model
  GSI-Year:       PK=year,      SK=make#model
```

**Specs Map Structure:**
```json
{
  "mechanical": {
    "engine_displacement_cc": 2487,
    "cylinder_count": 4,
    "fuel_type": "hybrid",
    "power_kw": 160,
    "torque_nm": 221,
    "transmission": "CVT",
    "gearbox_speeds": null,
    "drivetrain": "FWD",
    "fuel_consumption_combined": 4.2,
    "co2_emissions": 96
  },
  "dimensions": {
    "length_mm": 4885,
    "width_mm": 1840,
    "height_mm": 1445,
    "wheelbase_mm": 2825,
    "kerb_weight_kg": 1610,
    "towing_capacity_kg": 0,
    "boot_capacity_l": 524,
    "fuel_tank_l": 50
  },
  "exterior": {
    "body_style": "sedan",
    "doors": 4,
    "wheel_size_inches": 18,
    "tyre_size": "235/45R18",
    "headlight_type": "LED",
    "roof_type": "standard"
  },
  "interior": {
    "seating_capacity": 5,
    "upholstery": "fabric",
    "driver_seat_adjust": "8-way power",
    "climate_zones": 2,
    "infotainment_screen_inches": 12.3,
    "digital_instrument_cluster": true
  },
  "safety": {
    "ancap_rating": 5,
    "ancap_year": 2022,
    "airbags": 9,
    "abs": true,
    "esc": true,
    "aeb": true,
    "lane_keep_assist": true,
    "blind_spot_monitoring": true,
    "rear_cross_traffic_alert": true,
    "reversing_camera": true,
    "adaptive_cruise_control": true
  },
  "technology": {
    "apple_carplay": true,
    "android_auto": true,
    "wireless_carplay": false,
    "wireless_charging": false,
    "head_up_display": false,
    "surround_view_cameras": false,
    "parking_sensors_front": true,
    "parking_sensors_rear": true,
    "dab_radio": false,
    "satellite_navigation": true
  }
}
```

### 2.2 Vehicle Index (S3 + Client Cache)

A lightweight index JSON file is pre-built after each scrape and served from S3/CloudFront. This is what gets pre-cached in the PWA Service Worker.

```json
{
  "version": "2026-05",
  "generated": "2026-05-01T00:00:00Z",
  "count": 5234,
  "vehicles": [
    {
      "id": "toyota#camry#2023#ascent-hybrid-sedan",
      "make": "Toyota",
      "model": "Camry",
      "year": 2023,
      "variant": "Ascent Hybrid Sedan",
      "body_type": "sedan",
      "fuel_type": "hybrid",
      "drivetrain": "fwd",
      "seats": 5,
      "ancap_rating": 5
    }
  ]
}
```

Estimated size: ~5,000 vehicles × ~200 bytes = **~1 MB** (uncompressed). With gzip/brotli: ~200–300 KB — excellent for pre-caching.

---

## 3. Scraping Architecture

### 3.1 Lambda Scraper Design

```
EventBridge (monthly cron)
  → lambda-scraper-orchestrator
      → Builds list of target URLs (makes × models × years)
      → Publishes batches to SQS
  → lambda-scraper-worker (triggered by SQS)
      → Launches Playwright (Chromium via chrome-aws-lambda layer)
      → Fetches spec page with retry/back-off logic
      → Extracts structured data (JSON-LD > meta tags > DOM parsing)
      → Writes raw HTML to S3 /raw/{date}/{make}/{model}/{year}/{variant}.html
      → Writes extracted JSON to S3 /processed/{make}/{model}/{year}/{variant}.json
  → lambda-transformer (S3 event trigger on /processed/)
      → Normalises to canonical schema
      → Upserts into DynamoDB
      → Rebuilds vehicle index JSON → S3 /index/vehicles.json
      → Invalidates CloudFront cache for /index/*
```

### 3.2 Scraper Implementation Notes

**URL Pattern Discovery:**
carsales.com.au URLs follow a pattern such as:
`/cars/{make}/{model}/{year}/specifications/`
The orchestrator builds this list by first scraping the make/model directory pages.

**Data Extraction Priority:**
1. JSON-LD `schema.org/Vehicle` structured data (cleanest)
2. Spec table DOM parsing (most common)
3. Meta tags (fallback)

**Rate Limiting:**
```python
# Pseudocode
async def fetch_with_respect(url: str):
    await asyncio.sleep(random.uniform(5, 15))  # 5–15s delay
    response = await page.goto(url, timeout=30000)
    if response.status == 429:
        await asyncio.sleep(random.uniform(60, 120))  # back-off
        return await fetch_with_respect(url)
    return response
```

**Lambda Constraints:**
- Max execution time: 15 minutes per invocation
- Memory: 1024 MB (Chromium requirement)
- Chromium layer: `chrome-aws-lambda` or `@sparticuz/chromium`
- SQS batch size: 1 (one URL per Lambda invocation to avoid timeouts)

### 3.3 Cost Verification (Free Tier)

| Resource | Per Scrape Run | Monthly (1 run) | Free Tier | Status |
|---------|---------------|-----------------|-----------|--------|
| Lambda invocations | ~5,000 | ~5,000 | 1,000,000 | ✅ |
| Lambda duration | 5,000 × 2min × 1GB = 600K GB-s | 600K GB-s | 400K GB-s/month | ⚠️ |
| S3 PUTs | ~10,000 | ~10,000 | 2,000/month free → $0.005/1000 | ~$0.04 |

**Note on Lambda Duration:** A full scrape of 5,000+ pages may exceed the 400K GB-s free allowance. **Mitigation:** Run at 512 MB instead of 1024 MB where possible, use incremental scraping (only new/updated pages), and schedule across multiple days to spread the invocations across monthly billing cycles.

---

## 4. API Design

### 4.1 REST API Endpoints

**Base URL:** `https://api.carspec.app/v1`

```
GET /vehicles
  Query params: make, model, year_min, year_max, body_type, fuel_type,
                drivetrain, seats_min, ancap_min, sort, limit, offset
  Response: { count, vehicles: [...index records] }
  Cache: CloudFront 24h

GET /vehicles/{id}
  Path: id = make#model#year#variant (URL-encoded)
  Response: Full spec record
  Cache: CloudFront 7 days

GET /vehicles/compare
  Query params: ids (comma-separated, max 3)
  Response: { vehicles: [full spec records], differences: [...field paths] }
  Cache: CloudFront 7 days

GET /makes
  Response: Distinct list of makes with model counts
  Cache: CloudFront 24h

GET /models/{make}
  Response: Models for a make with year ranges
  Cache: CloudFront 24h

GET /index
  Response: Full vehicle index JSON (for Service Worker pre-cache)
  Cache: CloudFront 24h, versioned by ETag
```

### 4.2 Client-Side API (Offline)

When offline, the PWA bypasses API Gateway entirely. The Service Worker intercepts requests and serves from:
- Vehicle index: `Cache API` (pre-cached)
- Individual specs: `IndexedDB` (cached on visit)
- Comparison: assembled from `IndexedDB` records

---

## 5. Frontend Architecture

### 5.1 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.x |
| Build tool | Vite | 5.x |
| Language | TypeScript | 5.x |
| State management | Zustand | 4.x |
| Routing | React Router | 6.x |
| Offline storage | idb (IndexedDB wrapper) | 8.x |
| PWA | vite-plugin-pwa | latest |
| Service Worker | Workbox | 7.x |
| UI Components | Custom + material-web | latest |
| HTTP client | ky | latest |
| Testing | Vitest + Playwright | latest |

### 5.2 Application State

```typescript
// Global state (Zustand)
interface AppState {
  // Search & Filter
  searchQuery: string;
  filters: FilterState;
  searchResults: VehicleIndexRecord[];
  
  // Vehicle Index (pre-cached)
  vehicleIndex: VehicleIndexRecord[];
  indexVersion: string;
  indexLoaded: boolean;
  
  // Comparison
  comparisonList: string[]; // up to 3 vehicle IDs
  comparisonData: Record<string, VehicleSpec>; // loaded specs
  
  // Favourites (persisted to IndexedDB)
  favourites: string[];
  
  // App status
  isOnline: boolean;
  lastSyncTime: string;
  
  // Actions
  setSearchQuery: (q: string) => void;
  setFilters: (f: Partial<FilterState>) => void;
  addToComparison: (id: string) => void;
  removeFromComparison: (id: string) => void;
  toggleFavourite: (id: string) => void;
}
```

### 5.3 Routing Structure

```
/                           → Home / Search
/vehicles                   → Vehicle list (filtered)
/vehicles/:id               → Vehicle detail
/compare                    → Comparison view
/compare/:ids               → Comparison view (deep link)
/favourites                 → Saved vehicles
/settings                   → Cache management, preferences
```

### 5.4 Service Worker Strategy

```javascript
// Caching strategies (Workbox)
registerRoute(
  ({ url }) => url.pathname === '/index/vehicles.json',
  new StaleWhileRevalidate({ cacheName: 'vehicle-index' })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/vehicles/'),
  new CacheFirst({
    cacheName: 'vehicle-specs',
    plugins: [new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 90 * 24 * 60 * 60 })]
  })
);

// App shell: precached by vite-plugin-pwa
// Static assets: CacheFirst with versioned filenames
```

---

## 6. Infrastructure as Code

All infrastructure defined in **AWS CDK (TypeScript)**:

```typescript
// Key constructs
const vehicleTable = new dynamodb.Table(this, 'VehicleTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Free Tier: 25 RCU/WCU
});

const scraperFunction = new lambda.Function(this, 'Scraper', {
  runtime: lambda.Runtime.NODEJS_20_X,
  memorySize: 1024,
  timeout: cdk.Duration.minutes(10),
  layers: [chromiumLayer],
});

new events.Rule(this, 'MonthlySchedule', {
  schedule: events.Schedule.cron({ day: '1', hour: '2', minute: '0' }),
  targets: [new targets.LambdaFunction(orchestratorFunction)],
});
```

---

## 7. Phase 2: Android App Promotion

### Option A — Trusted Web Activity (TWA) via Bubblewrap (Recommended)
- PWA wrapped as Android APK with TWA
- Full Material You dynamic colour from system — the TWA gets access to Android's `THEME_COLOR` system
- Minimal additional code (<1 day of work)
- `bubblewrap init --manifest https://carspec.app/manifest.json`
- Publish to Google Play Store

### Option B — React Native
- More native feel, deeper OS integration
- Requires significant code rewrite
- `react-native-material-you` for dynamic colour
- Estimated 4–6 additional weeks

**Recommendation:** Phase 2 = TWA. Phase 3 (if warranted) = React Native.

---

*Document version 1.0 — May 2026*
