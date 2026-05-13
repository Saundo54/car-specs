## Context

The CarSpec project requires a vehicle specification database retrieved from carsales.com.au. Previous analysis identified significant bot protection and AWS Free Tier constraints ($0/month budget). Traditional headless browser scraping (Playwright) is resource-intensive and risks exceeding the 400,000 GB-seconds/month Lambda free allowance for the ~11,000 target variants.

## Goals / Non-Goals

**Goals:**
- Implement a lightweight, HTTP-only scraper for vehicle specifications.
- Ensure 100% compatibility with the AWS permanent Free Tier.
- Automate the discovery of all vehicle variants from 2018 to present.
- Store data in a normalized canonical schema for offline-first PWA use.

**Non-Goals:**
- Scraping real-time pricing or sales listings.
- Implementing user accounts or personalized data in this phase.
- Supporting non-Australian vehicle markets.

## Decisions

### 1. Internal "Taco" API Access
We will bypass the HTML-rendered frontend and directly target the internal JSON API (`/_api/taco-makemodel/research/...`).
- **Rationale**: Reduces payload size by >90% and eliminates the need for headless browsers, saving significant CPU and memory.
- **Alternatives**: Playwright (too expensive), BeautifulSoup (fragile and blocked).

### 2. Whitelisted User-Agent Spoofing
We will use a whitelisted User-Agent (e.g., `Gemini-Deep-Research` or `Googlebot`) to access the research API.
- **Rationale**: Carsales explicitly allows these bots in their `robots.txt` for research/search paths, ensuring stable access.

### 3. Sitemap-Based Discovery
The orchestrator will parse `ResearchMakeModelPage.xml` to build the work queue.
- **Rationale**: Sitemaps provide a comprehensive and structured list of all "leaf nodes" (variants) without aggressive crawling of directory pages.

### 4. Decoupled Processing Pipeline
1. **Scraper Lambda**: Fetches JSON from API -> Stores raw JSON in S3.
2. **Transformer Lambda**: Triggered by S3 upload -> Normalizes data -> Writes to DynamoDB.
- **Rationale**: Separates concerns, provides an audit trail of raw data, and allows for re-processing if the normalization logic changes.

## Risks / Trade-offs

- **[Risk]**: Carsales changes the "Taco" API structure.
  - **Mitigation**: Abstract the JSON parser logic and implement automated error alerts via SNS if the parsing success rate drops.
- **[Risk]**: IP-based rate limiting despite whitelisted User-Agent.
  - **Mitigation**: Implement a randomized delay (5–15s) and spread the 11,000-request load over several days using an SQS-based "drip-feed" strategy.
- **[Risk]**: DynamoDB Write Capacity Unit (WCU) throttling.
  - **Mitigation**: Use "On-Demand" billing mode (which has a generous free tier for low-volume apps) or limit concurrent Lambda workers.
