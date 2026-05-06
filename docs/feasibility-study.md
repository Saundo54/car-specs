# Feasibility Study: Vehicle Specifications PWA / Android App

**Project:** CarSpec — Vehicle Specifications Research Application  
**Source:** carsales.com.au  
**Date:** May 2026  
**Version:** 1.0

---

## 1. Executive Summary

This feasibility study evaluates the viability of building a Progressive Web App (PWA) — subsequently promoted to a native Android application — that scrapes, stores, and presents comprehensive vehicle specification data from carsales.com.au. The application targets research-oriented users who want to compare and filter vehicle specifications across makes, models, and years (2018–present), with no sales or pricing focus.

**Overall Verdict: FEASIBLE with significant caveats.** The core technical stack is achievable on the AWS Free Tier with careful architecture. The primary risk is the scraping layer, which faces meaningful legal, technical, and ethical obstacles that must be actively managed.

---

## 2. Scope Definition

### In Scope
- Scraping vehicle specification data (make, model, year, trim, interior/exterior specs, mechanical, dimensions, safety, technology) from carsales.com.au for model years 2018–present
- Structured storage on AWS Free Tier infrastructure
- PWA with offline-capable search, filtering, and comparison (up to 3 vehicles)
- Material You design system (Android-native aesthetic)
- Progressive upgrade path to native Android app

### Out of Scope
- Pricing, sales listings, dealer data, regional pricing
- User accounts or personalisation (Phase 1)
- iOS native app
- Real-time data sync (scraping runs on a schedule)

---

## 3. Technical Feasibility

### 3.1 Scraping Layer

**Feasibility: MODERATE — highest-risk component**

#### Observations
A direct HTTP fetch of `https://www.carsales.com.au/` returns **HTTP 403 Forbidden**, confirming the site employs bot-protection measures. This is the single largest technical risk.

#### Known Protections on carsales.com.au
| Protection Type | Likelihood | Impact |
|----------------|-----------|--------|
| Cloudflare or similar WAF | High | Blocks basic scrapers |
| User-Agent fingerprinting | High | Blocks curl/requests |
| JavaScript rendering requirement | High | Blocks non-headless scraping |
| Rate limiting / IP banning | High | Disrupts bulk scraping |
| CAPTCHA / challenge pages | Medium | Requires solver services |
| Dynamic DOM / obfuscated selectors | Medium | Increases maintenance burden |
| robots.txt restrictions | High | Legal and ethical signal |

#### Recommended Approach
- **Headless browser scraping** via Playwright (Python) or Puppeteer (Node.js) running on AWS Lambda or EC2 t2.micro
- Respectful rate limiting: randomised delays (5–15s between requests), session rotation
- Scrape during off-peak hours (overnight AEST)
- Target structured data where available (JSON-LD, schema.org Vehicle markup embedded in pages)
- Implement exponential back-off on 429/503 responses

#### Caveat: robots.txt
The site's `robots.txt` must be reviewed before commencing any scraping. If it disallows automated crawling of specification pages, this constitutes a legal and ethical boundary. The project must either:
1. Respect the disallowance and seek an alternative data source, or
2. Obtain explicit written permission from carsales.com.au

#### Alternative / Supplemental Data Sources
If scraping proves infeasible at scale:
| Source | Type | Quality |
|--------|------|---------|
| NHTSA Vehicle API (US) | Official API | High — US market only |
| NCAP Safety Data | Official API | High — safety specs |
| Redbook Australia | Commercial licence | High — AU market |
| CarQuery API | Free API | Medium — older data |
| Wikipedia / Wikidata | Structured | Low-Medium — incomplete |
| manufacturer press releases | Manual | High — effort intensive |

**Recommendation:** Treat carsales.com.au as the primary source but architect the ingestion pipeline with an adapter pattern so alternative sources can be plugged in if the scraper is blocked or legally challenged.

---

### 3.2 Data Storage — AWS Free Tier

**Feasibility: HIGH** — well within Free Tier limits with proper data management

#### Estimated Data Volume
| Entity | Estimated Count | Avg Record Size | Total |
|--------|----------------|-----------------|-------|
| Makes | ~60 | 1 KB | 60 KB |
| Models (2018–present) | ~800 | 2 KB | 1.6 MB |
| Variants/Trims | ~5,000 | 5 KB | 25 MB |
| Full Spec Sheets | ~5,000 | 15 KB | 75 MB |
| **Total (compressed)** | | | **~30–50 MB** |

This comfortably fits within all relevant Free Tier limits.

#### AWS Free Tier Resources (Permanent Free Tier unless noted)
| Service | Free Tier Allowance | Projected Usage | Risk |
|---------|-------------------|-----------------|------|
| **S3** | 5 GB storage, 20K GET, 2K PUT/month | ~50 MB, <1K PUTs/scrape | Low |
| **DynamoDB** | 25 GB, 25 RCU, 25 WCU | <1 GB, low RCU | Low |
| **Lambda** | 1M requests, 400K GB-seconds/month | Scraper + API handlers | Low |
| **API Gateway** | 1M API calls/month | App API | Low |
| **CloudFront** | 1 TB transfer/month, 10M requests | PWA static delivery | Low |
| **EC2 t2.micro** | 750 hrs/month (12-month only) | Headless scraper host | **Medium — expires** |

#### ⚠️ Critical Caveat: EC2 Free Tier Expiry
The EC2 t2.micro free tier is **12-month only**, not permanent. After 12 months, any EC2 instance incurs charges (~$8–12 USD/month). **Mitigation:** Run the scraper on Lambda instead of EC2. Playwright/Puppeteer can run in Lambda using the `chrome-aws-lambda` layer (Chromium stripped for Lambda). This keeps the stack permanently within Free Tier.

#### Recommended Architecture
```
Scraper (Lambda + Playwright) 
  → S3 (raw JSON dumps per scrape run)
  → Lambda (transform/normalise)
  → DynamoDB (structured specs, indexed by make/model/year)
  → API Gateway (REST API for PWA)
  → CloudFront (PWA static files + API caching)
```

#### Data Freshness & Retention Strategy
- Full scrape: Run quarterly (4×/year) — new model years appear in Jan–Mar
- Incremental scrape: Monthly for new variants
- Old data: Retain historical specs permanently (small volume); no deletion needed
- Storage cost remains flat at ~50–100 MB indefinitely

---

### 3.3 PWA Frontend

**Feasibility: HIGH**

#### Technology Stack
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React + Vite | Excellent PWA tooling, wide ecosystem |
| UI Library | Custom Material You components | No mature library fully implements Material You for web yet |
| State | Zustand | Lightweight, offline-compatible |
| Offline | Service Worker + Cache API | IndexedDB for spec data cache |
| Hosting | S3 + CloudFront | Free Tier, global CDN |
| Build | GitHub Actions → S3 | Free CI/CD |

#### Material You on the Web
Material You (Material Design 3) was designed for Android. Its web implementation requires manual work:
- **Material Web** (`material-web` npm package by Google) provides MD3 web components — but coverage is partial
- Dynamic colour theming (the hallmark of Material You) requires manual CSS custom property management
- `@material/material-color-utilities` library provides the HCT colour algorithm for dynamic theming

#### Offline Capability
- Service Worker pre-caches the full vehicle index (make/model/year list) — ~2–5 MB compressed
- Full spec sheets cached on-demand (user browses a vehicle → cached for offline)
- Comparison state stored in IndexedDB
- Clear cache management UI for the user

---

### 3.4 Android App (Phase 2)

**Feasibility: HIGH** — PWA-first approach de-risks this

- PWA can be wrapped with **Bubblewrap** (Google's official PWA→TWA tool) to produce an Android APK with near-zero additional code
- Full native Material You theming available in TWA context — accesses system dynamic colour
- Alternatively, React Native with `react-native-material-you` could be used for deeper native integration
- Play Store submission requires a Google Developer account ($25 one-time fee — not an AWS cost)

---

## 4. Legal & Ethical Feasibility

**Feasibility: CONDITIONAL**

### 4.1 Terms of Service
carsales.com.au's Terms of Service almost certainly prohibit automated scraping. **This is the most significant non-technical risk.** The project must:

1. **Review** carsales.com.au ToS before any development begins
2. **Assess** robots.txt directives
3. **Consider** whether vehicle specifications (facts) are copyrightable (generally, factual data is not, but compiled databases may attract database rights under Australian law)

### 4.2 Australian Law Context
- The *Copyright Act 1968* (Cth) protects creative works, not raw factual data
- However, the **database/compilation right** (Part IV) may protect a sufficiently creative selection/arrangement of specs
- The *Computer Fraud and Abuse Act* equivalent in Australia is the *Criminal Code Act 1995* — unauthorised access provisions could theoretically apply if ToS is breached

### 4.3 Risk Mitigation
| Mitigation | Description |
|-----------|-------------|
| Rate limiting | Avoid server strain; mimics human browsing |
| No resale | Pure research use, no commercial exploitation of scraped data |
| Attribution | Credit carsales.com.au as data source in app |
| Seek permission | Write to carsales.com.au seeking a data licence or API access |
| Fallback sources | Architect for source-agnostic ingestion |

---

## 5. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| R1 | carsales.com.au blocks scraper | High | High | Playwright + rotation; seek permission; alt sources |
| R2 | ToS violation / legal challenge | Medium | High | Legal review; attribution; non-commercial use |
| R3 | EC2 Free Tier expiry adds cost | High | Low | Use Lambda-only architecture |
| R4 | Site structure changes break scraper | High | Medium | Selector abstraction; monitoring; alerts |
| R5 | DynamoDB RCU throttling at scale | Low | Medium | IndexedDB client-side cache; API Gateway cache |
| R6 | Material You web support incomplete | Medium | Low | Custom implementation; progressive enhancement |
| R7 | Lambda cold start latency | Low | Low | CloudFront caching; keep-warm ping |
| R8 | Incomplete spec data on source | Medium | Medium | Multiple sources; manual gap-fill for key models |

---

## 6. Assumptions

1. The application is for **personal/research use**, not commercial redistribution of scraped data
2. Vehicle spec data spans **model years 2018–current** (approx. 8 years)
3. The user/team accepts **quarterly data freshness** (not real-time)
4. **No user authentication** is required in Phase 1
5. AWS account remains on Free Tier — no accidental upgrades
6. The scraper is run **respectfully** (rate-limited, off-peak, no aggressive parallelism)
7. Budget for AWS is **$0/month permanently** — any deviation is unacceptable
8. The PWA will be served from a **custom domain** (Route 53 is not Free Tier — use Cloudflare DNS free plan)
9. Phase 2 (native Android) is at least **6 months** after Phase 1 PWA launch
10. The comparison feature compares specs stored locally — no server round-trip needed

---

## 7. Dependencies

| Dependency | Type | Risk |
|-----------|------|------|
| carsales.com.au remaining accessible | External | High |
| AWS Free Tier programme continuation | External | Low |
| `chrome-aws-lambda` Chromium layer | Open Source | Low |
| Material Web components (`material-web`) | Google OSS | Low |
| Bubblewrap / TWA toolchain | Google OSS | Low |
| GitHub Actions free tier (2000 min/month) | External | Low |
| CloudFront Free Tier (1 TB/month) | AWS | Low |

---

## 8. Conclusion & Recommendation

| Dimension | Assessment |
|-----------|-----------|
| Technical | ✅ Achievable |
| Cost | ✅ Permanently Free Tier viable |
| Legal/Ethical | ⚠️ Requires due diligence before proceeding |
| Timeline | ✅ MVP PWA achievable in 8–12 weeks |
| Scalability | ✅ Data volume well within limits |

**Proceed with development**, subject to:
1. Legal review of carsales.com.au ToS and robots.txt before any scraping commences
2. Scraper built on Lambda (not EC2) to avoid Free Tier expiry costs
3. Adapter-pattern data pipeline to support source switching

---

*Document version 1.0 — May 2026*
