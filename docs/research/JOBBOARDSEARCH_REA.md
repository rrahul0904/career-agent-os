# JobBoardSearch REA — Evidence, Capability Map, and Clean-Room Integration

Status: **active research**  
Target: `https://jobboardsearch.com`  
Seed evidence: Reddit share `https://www.reddit.com/r/jobboardsearch/s/OiuzJbg0MO`  
Captured: 2026-10-16

## 1. Repository routing decision

**Classification: donor/reference + extension of Career Agent OS.**

Do **not** create a new standalone repository for this target. The job-seeker side overlaps Career Agent OS's existing product boundary: persistent candidate intelligence, live job ingestion, explainable matching, application-pack generation, pipeline tracking, dry-run auto-apply, and agent-ready APIs.

JobBoardSearch contributes a valuable missing layer: **job-board discovery, board metadata, feed aggregation, multi-channel distribution, operator growth tooling, sponsorship inventory, attribution, and board-marketplace intelligence**.

Canonical branch: `research/jobboardsearch`.

Detailed clean-room system reconstruction: `docs/research/JOBBOARDSEARCH_SYSTEM_DESIGN.md`.

## 2. What the Reddit post actually is

The shared Reddit item is an automatically distributed job listing. It routes the click through JobBoardSearch rather than behaving as an isolated manual post.

This is evidence of a distribution pipeline, not just a static directory:

1. ingest job from a source board;
2. normalize title/company/location/date/category metadata;
3. publish a channel-specific job announcement;
4. route outbound traffic through a controlled destination;
5. attribute traffic back to channel/source/board.

The subreddit itself contains repeated machine-like job announcements over time, reinforcing the interpretation that Reddit is an ongoing distribution surface rather than a one-off campaign.

## 3. Current evidence snapshot — 2026-10-16

Public surfaces currently show approximately:

- **870 job boards** in the directory;
- **118,594 page views in the preceding 30 days** and **3,363,777 year-to-date page views** on the board-submission surface;
- **27,660 Reddit members**;
- **5,891 Telegram members** on the current submission page;
- **~15.8K weekly newsletter subscribers**;
- **1K+ LinkedIn followers**;
- **1,005 Bluesky followers**.

The board submission form explicitly accepts an **API or RSS URL**. Feed-enabled boards are told their jobs may be:

- displayed on JobBoardSearch;
- posted to Telegram;
- posted to the JobBoardSearch subreddit;
- included in the weekly newsletter;
- indexed through the Google for Jobs ecosystem.

The same surface exposes monetized distribution inventory, including highlighted/sticky/featured directory placements, fixed Gold/Silver/Bronze sponsor slots, newsletter placement, community pinning, backlink benefits, larger job-ingestion quotas, directory-submission services and SEO packages.

These numbers and offers are time-sensitive public product evidence, not constants to hard-code into our product.

## 4. Observed product surfaces

### A. Job-board discovery directory

Observed public behavior:

- ~870 niche job boards in the current directory.
- Board discovery by industry, location, profession, work arrangement, technology, level, and other niche tags.
- Bookmarks / saved boards.
- Dedicated board pages and cross-linked job pages.
- Search / filtering and SEO-oriented landing pages for job categories and countries.
- Hand-reviewed/curated positioning rather than an unbounded automatically generated list.

### B. Job ingestion and job discovery

Observed public behavior:

- JobBoardSearch states that boards can provide an **API or RSS feed**.
- Jobs are fetched and displayed on JobBoardSearch pages.
- Jobs are categorized into role, seniority, technology, geography, remote status, recency, etc.
- Feed-enabled sponsorship tiers advertise larger quantities of recent jobs listed/indexed.

### C. Multi-channel distribution engine

Observed channels include:

- Reddit
- Telegram
- LinkedIn
- Bluesky
- newsletter/email
- Google for Jobs / structured-data discovery

The important reusable pattern is:

`CanonicalJob -> DistributionAsset -> PublishAttempt -> ProviderReceipt -> AttributionReceipt`.

### D. Job-board operator acquisition + monetization

Observed monetization primitives:

- free listing after review;
- highlighted/brand-color/sticky/featured placement;
- fixed premium sponsor slots;
- newsletter inclusion;
- community pinning;
- additional job indexing / cross-posting volume;
- do-follow backlink / SEO value;
- sponsorship/ad slots;
- SEO services;
- directory-submission services;
- Search Console AI subscriptions/credits;
- Job Visuals AI usage/top-ups.

This is a two-sided-plus-operator business:

- **job seeker value:** discover specialized boards and jobs;
- **operator value:** acquire traffic, authority, distribution and customers;
- **platform value:** aggregate inventory, own distribution surfaces, measure referrals, then sell placement/tools/services.

### E. Sponsorship inventory as a first-class system

A major confirmed pattern is that promotion is sold across multiple finite surfaces, not merely as `featured=true`.

Observed examples include:

- fixed top directory/search positions;
- visual highlight treatment;
- pinned Reddit placement;
- pinned Telegram placement;
- weekly newsletter mentions;
- direct-link/visit treatment;
- feed-ingestion quotas by sponsor tier;
- month-specific sponsor slots that can sell out.

Our owned implementation should therefore model **placement inventory + campaigns + attribution**, not just a premium boolean.

### F. Job-board marketplace

Marketplace listings expose operator/business diligence fields such as:

- niche;
- tech stack;
- launch date;
- trailing revenue and recurring revenue;
- traffic and traffic sources;
- target country;
- indexed pages;
- domain authority / backlinks / linking domains;
- member/customer counts;
- social audiences;
- asking price and seller rationale.

This is useful as a separate `BoardBusinessProfile` domain model and can later support acquisition scouting / opportunity intelligence.

### G. Operator SEO / growth tooling

Observed tools include:

- job-board Open Graph checker;
- site audit;
- keyword research;
- domain-rating checker;
- JobPosting schema checker;
- Chrome SEO analyzer;
- Search Console AI;
- directory submission tooling.

The SEO analyzer currently groups checks around:

1. meta/indexing — title, meta description, canonical, robots, viewport;
2. content structure — H1, H2 count, word count, internal links;
3. job-page signals — apply actions, salary, company, location, remote signal;
4. schema — JobPosting and important structured-data fields.

### H. Search Console AI

Current public behavior includes:

- 12 months of Search Console data in a sync;
- read-only access;
- striking-distance queries around positions 5–20;
- query/page history with clicks, impressions and position;
- content-gap analysis;
- low-CTR, cannibalization and query/page mismatch analysis;
- sitemap-aware suppression of already-existing pages;
- Google for Jobs traffic reporting and drop alerts;
- expired-job checks for high-traffic pages;
- automatic monitoring comparing the latest 28 days with the prior 28 days.

This is a strong donor pattern because it is specialized for expiring job inventory rather than generic website SEO.

### I. Job Visuals AI

Observed operator workflow:

1. load jobs from a connected board feed;
2. generate branded job graphics from logo + job metadata;
3. create multiple social-friendly visual formats;
4. generate platform-specific captions;
5. track usage/top-ups.

This overlaps our Creator Console direction and should be treated as an integration point, not rebuilt inside the career core.

### J. Auto-apply / JobCopilot

The JobBoardSearch navigation exposes "Auto Apply", but the CTA routes to a JobCopilot-branded product. Treat this as **external/partner/white-label behavior unless stronger provenance proves ownership**.

Career Agent OS already owns the correct clean-room boundary for candidate-side application automation.

## 5. Historical architecture evidence

Public founder material states the project began as a very small directory built rapidly and then expanded over time. That is historical evidence only; do **not** infer the current production stack from the launch implementation.

The reusable lesson is architectural, not technological: start with a simple curated directory, then compound value through feeds, programmatic discovery, social distribution, operator monetization, and adjacent tools.

## 6. Growth loop reconstructed

```text
Board submission / discovery
        ↓
Manual review + BoardProfile
        ↓
API/RSS feed connection
        ↓
Source records + normalization + cross-source dedupe
        ↓
Search / category / country landing pages
        ↓
Structured data + programmatic SEO
        ↓
Reddit / Telegram / LinkedIn / Bluesky / newsletter distribution
        ↓
Tracked outbound destination
        ↓
Referral traffic + operator ROI evidence
        ↓
Featured placement / sponsorship / tools / services
        ↓
More boards + more jobs + more audience inventory
        ↺
```

This is the most important donor pattern.

## 7. Gap analysis vs Career Agent OS

### Already owned

- candidate profile and persistent career state;
- job corpus / ingestion worker;
- deterministic explainable matching;
- recommended jobs;
- application packs;
- application pipeline;
- dry-run application orchestration;
- Greenhouse and Lever adapters;
- API / MCP surface;
- PostgreSQL production schema.

### Critical architecture correction discovered

The existing `stableListingId()` includes the source in the ID input, and the current production `listings` table stores a single `source_id`.

That is insufficient for an aggregator. The same employer vacancy can arrive through Greenhouse, an RSS feed, another niche board and an API partner. We need:

1. immutable/source-specific `SourceRecord` objects;
2. source-independent `CanonicalJob` identity;
3. many-to-many `JobSourceLink` provenance;
4. auditable dedupe/merge evidence.

**This becomes Gate 0. Do not scale RSS/API ingestion until it is fixed.**

### Missing / high-value additions from this donor

1. **Cross-source canonical identity + provenance** — prerequisite.
2. **JobBoard Registry** — canonical board metadata, taxonomy, provenance and health.
3. **Feed Connector Contract** — RSS/Atom/API/sitemap/ATS adapters with sync receipts.
4. **Board + Job Taxonomy Graph** — niche/location/role/stack/work-style facets.
5. **Redirect + Attribution Service** — click receipts by job/board/channel/campaign.
6. **Distribution Engine** — transform canonical jobs into channel-specific assets and publish receipts.
7. **Programmatic Discovery/SEO Surface** — approved category/location/stack/level landing pages with crawl controls.
8. **Board Operator Workspace** — submit/claim/configure board, feed health, distribution status and referral analytics.
9. **Placement Inventory + Campaigns** — explicit finite promotion surfaces and ROI.
10. **JobPosting Quality Analyzer** — schema/content/indexability validation specialized for jobs.
11. **Search Console Intelligence Adapter** — read-only GSC ingestion and opportunity analysis.
12. **Board Marketplace Intelligence** — optional later module; separate from seeker core.

## 8. Proposed owned domain contracts

```ts
interface JobBoardProfile {
  id: string;
  canonicalUrl: string;
  name: string;
  description?: string;
  niches: string[];
  locations: string[];
  workModes: Array<'remote' | 'hybrid' | 'onsite'>;
  levels: string[];
  technologies: string[];
  sourceProvenance: Provenance;
  verificationStatus: 'unverified' | 'reviewed' | 'claimed';
  feedConnections: FeedConnection[];
}

interface SourceRecord {
  id: string;
  connectionId: string;
  externalId?: string;
  sourceUrl: string;
  fetchedAt: string;
  contentHash: string;
  rawPayload: unknown;
}

interface JobSourceLink {
  canonicalJobId: string;
  sourceRecordId: string;
  confidence: number;
  matchSignals: string[];
}

interface DistributionReceipt {
  id: string;
  jobId: string;
  channel: 'reddit' | 'telegram' | 'linkedin' | 'bluesky' | 'email' | 'web';
  assetHash: string;
  target?: string;
  status: 'prepared' | 'approved' | 'published' | 'failed';
  externalId?: string;
  publishedAt?: string;
}

interface AttributionReceipt {
  id: string;
  jobId?: string;
  boardId: string;
  channel?: string;
  campaign?: string;
  outboundUrlHash: string;
  occurredAt: string;
}
```

See `JOBBOARDSEARCH_SYSTEM_DESIGN.md` for the complete target model.

## 9. Clean-room rules

- Use only publicly observable behavior and public founder material as evidence.
- Do not scrape private dashboards, bypass auth, copy proprietary text/assets, or reproduce private APIs.
- Do not infer ownership of JobCopilot solely from the JobBoardSearch integration.
- Do not copy branding, UI artwork, testimonials, pricing language or source code.
- Preserve provenance for every donor-derived capability.
- Provider writes (social posting, Search Console access, email delivery) require explicit credentials and approval gates.
- Default all application submission and social publish flows to dry-run / prepared receipts until enabled by policy.

## 10. Build gates

### Gate 0 — canonical identity + provenance

- add `SourceRecord` persistence;
- create source-independent canonical vacancy identity;
- add many-to-many source links;
- produce deterministic dedupe receipts;
- create benchmark duplicates across ATS + RSS.

Acceptance:

- same vacancy from different sources collapses to one canonical job;
- genuinely different jobs with same title/company do not collapse;
- every merge is replayable from stored evidence;
- source provenance survives canonicalization.

### Gate 1 — Registry + ingestion foundation

- `JobBoardProfile` domain model and persistence;
- board submission/import endpoint;
- RSS/Atom generic adapter;
- feed sync receipts + health state;
- searchable board directory API.

Acceptance:

- seed at least 10 synthetic/public board fixtures;
- sync at least 3 heterogeneous feed fixtures;
- failed feed produces inspectable failure receipt;
- SSRF/size/time protections are tested.

### Gate 2 — Discovery + attribution

- board directory UI;
- board detail page;
- jobs-by-board and jobs-by-facet views;
- controlled redirect service using opaque server-side destination IDs;
- attribution receipts.

Acceptance:

- no open-redirect vulnerability;
- redirect destination is constrained to normalized job/board records;
- click receipt links to board/job/campaign;
- directory search returns stable facet counts.

### Gate 3 — Distribution fabric

- neutral `DistributionAsset` contract;
- Reddit/Telegram/email adapters first;
- approval gate + dry-run mode;
- exact payload hash and external-id receipt.

Acceptance:

- same canonical job compiles into channel-specific payloads;
- dry-run causes zero provider writes;
- failed publish is retryable/idempotent;
- successful publish stores external receipt.

### Gate 4 — Job SEO quality engine

- `JobPosting` schema validator;
- title/meta/canonical/robots/H1/content checks;
- apply/salary/company/location/remote checks;
- freshness/dead-job rules;
- machine-readable audit output + UI scorecard.

Acceptance:

- deterministic fixture score;
- malformed JSON-LD is caught;
- schema vs visible-page mismatches are surfaced;
- expired-but-open jobs are detected;
- no generic SEO recommendation without evidence.

### Gate 5 — Operator intelligence

- read-only Search Console adapter;
- query/page history model;
- striking-distance analysis;
- low-CTR/cannibalization/content-gap rules;
- Google for Jobs traffic/drop rules;
- expired-page traffic analysis;
- 28-day comparison monitoring.

Acceptance:

- read-only OAuth scopes;
- fixture-based GSC replay works without live provider access;
- every recommendation cites the query/page evidence used;
- sitemap-aware suppression prevents duplicate page suggestions.

### Gate 6 — sponsorship inventory + ROI

- `InventoryPlacement` and `Campaign` models;
- directory/newsletter/community/feed-quota placements;
- finite capacity and schedule rules;
- placement-level attribution and ROI reporting.

Acceptance:

- overlapping exclusive slots cannot both activate;
- campaign attribution resolves to placement + board + channel;
- expiry automatically removes privileged placement;
- pricing remains a configurable business policy, not domain logic.

## 11. Benchmark fixtures required

1. same vacancy in Greenhouse + RSS;
2. same title/company but different locations;
3. reposted vacancy with new source ID;
4. malformed RSS;
5. valid Atom feed;
6. feed timeout/500;
7. job removed between syncs;
8. malicious internal-network feed URL;
9. open-redirect attack input;
10. duplicate social publish retry;
11. malformed JobPosting JSON-LD;
12. visible salary/schema salary mismatch;
13. expired job still marked open;
14. Search Console query with two competing pages;
15. suggested landing page already in sitemap.

## 12. Recommendation

**Absorb the distribution/registry/attribution/operator-intelligence patterns into Career Agent OS; do not clone JobBoardSearch as a separate product.**

The owned differentiation becomes:

`candidate intelligence + board intelligence + provenance-safe job network + explainable matching + verified application artifacts + governed application execution + multi-channel distribution + placement attribution + operator intelligence`.

This is a stronger product boundary than a directory clone and fits the Self Working Agent / REA roadmap.