# JobBoardSearch — System Reconstruction and Owned Target Architecture

Status: active REA design
Captured: 2026-10-16
Canonical target: Career Agent OS
Research branch: `research/jobboardsearch`

## 1. Purpose

This document turns publicly observable JobBoardSearch behavior into an independent, clean-room architecture for Career Agent OS. It separates **observed evidence** from **engineering inference** and then defines the owned contracts we should implement.

Primary public evidence:

- https://jobboardsearch.com/
- https://jobboardsearch.com/add-board
- https://jobboardsearch.com/about-us
- https://jobboardsearch.com/marketplace
- https://jobboardsearch.com/seo-analyzer
- https://jobboardsearch.com/search-console-ai
- https://jobboardsearch.com/job-visuals-ai
- seed Reddit evidence: https://www.reddit.com/r/jobboardsearch/s/OiuzJbg0MO

No private dashboard, source code, private API, authenticated bypass, or copied asset is used.

## 2. Current public evidence snapshot

Observed on 2026-10-16:

- 870 job boards in the public directory.
- 118,594 page views in the preceding 30 days and 3,363,777 year-to-date page views displayed on the board-submission page.
- 27,660-member Reddit community.
- 5,891-member Telegram group on the submission page.
- ~15.8K weekly newsletter subscribers.
- 1,005 Bluesky followers and 1K+ LinkedIn followers.
- Board submission accepts a board URL plus optional API/RSS feed.
- Feed-enabled boards can have jobs displayed on JobBoardSearch, posted to Reddit/Telegram, included in newsletter distribution, and made eligible for Google for Jobs indexing.
- Paid placement includes highlighted/sticky/featured listings, multi-channel promotion, fixed sponsor inventory, newsletter placements and larger job-ingestion quotas.
- Search Console AI exposes read-only Search Console sync, striking-distance queries, content gaps, Google for Jobs reporting, expired-job checks and monitoring.
- SEO Analyzer checks meta/indexability, content structure, apply action, salary, company, location, remote signals and JobPosting structured data.
- Marketplace listings expose traffic, revenue, technology, SEO/domain and audience metrics for job-board acquisitions.

These are public product claims and should be treated as evidence of surface behavior, not proof of internal implementation.

## 3. Reconstructed product system

### 3.1 Observed product loop

```text
Board owner submits board
        |
        v
Board reviewed + categorized
        |
        +---- no feed ----> directory page + backlink + discovery
        |
        +---- API/RSS ----> job ingestion
                             |
                             v
                      normalized jobs
                             |
                +------------+------------+
                |            |            |
                v            v            v
           web job pages   social      newsletter
                |         distribution      |
                +------------+--------------+
                             |
                             v
                      tracked referral
                             |
                             v
                   operator value/ROI
                             |
                             v
             featured/sponsor/tool upsell
                             |
                             v
                    more boards + jobs
```

### 3.2 Likely internal service boundaries — inference

The public behavior can be produced by many stacks. We should **not** assume JobBoardSearch uses this architecture. This is our clean-room reconstruction of the minimum logical boundaries required to reproduce the behavior safely:

1. Board Registry
2. Feed Connector Runtime
3. Raw Source Record Store
4. Canonical Job Resolver
5. Taxonomy/Facet Service
6. Public Directory + Job Page Renderer
7. Distribution Compiler
8. Provider Publishers
9. Redirect/Attribution Service
10. Sponsorship/Inventory Service
11. Operator Workspace
12. SEO Quality Engine
13. Search Console Intelligence
14. Optional Marketplace Intelligence

## 4. Critical gap discovered in Career Agent OS

Current Career Agent OS has the right high-level job-ingestion boundary, but its current identity model is not sufficient for an aggregator/network.

### Current behavior

`stableListingId()` hashes:

```text
source + externalId + company + title + location
```

and the production `listings` table carries one `source_id`.

### Problem

The same employer vacancy may arrive through:

- Greenhouse directly;
- an RSS feed from a niche board;
- another board that syndicated the same vacancy;
- an API partner.

A source-dependent canonical key can create multiple canonical jobs for one real vacancy. A single `source_id` also loses multi-source provenance.

### Required correction

Separate **source records** from **canonical vacancies**:

```text
Feed/ATS/API
    |
    v
SourceRecord (immutable provenance)
    |
    v
Identity Resolver
    |
    +--> existing CanonicalJob
    |
    +--> new CanonicalJob

CanonicalJob <---- many JobSourceLink ---- SourceRecord
```

This is now a prerequisite for the JobBoardSearch donor work.

## 5. Owned canonical data model

### 5.1 Board registry

```ts
interface JobBoard {
  id: string;
  canonicalDomain: string;
  canonicalUrl: string;
  name: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'claimed' | 'rejected' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface BoardClaim {
  id: string;
  boardId: string;
  operatorUserId: string;
  verificationMethod: 'dns' | 'email-domain' | 'manual';
  status: 'pending' | 'verified' | 'rejected';
}
```

### 5.2 Feed connections

```ts
interface FeedConnection {
  id: string;
  boardId: string;
  kind: 'rss' | 'atom' | 'json-api' | 'sitemap' | 'greenhouse' | 'lever' | 'ashby' | 'custom';
  endpoint: string;
  enabled: boolean;
  fetchPolicy: FetchPolicy;
  health: 'unknown' | 'healthy' | 'degraded' | 'failed';
  lastSuccessAt?: string;
  lastFailureAt?: string;
}
```

### 5.3 Provenance-first ingestion

```ts
interface SourceRecord {
  id: string;
  connectionId: string;
  externalId?: string;
  sourceUrl: string;
  fetchedAt: string;
  contentHash: string;
  rawPayload: unknown;
  parsed: ParsedJobRecord;
}

interface CanonicalJob {
  id: string;
  identityFingerprint: string;
  companyId?: string;
  title: string;
  description: string;
  workplace: 'remote' | 'hybrid' | 'onsite' | 'unknown';
  locations: NormalizedLocation[];
  salary?: NormalizedSalary;
  postedAt?: string;
  validThrough?: string;
  active: boolean;
}

interface JobSourceLink {
  canonicalJobId: string;
  sourceRecordId: string;
  confidence: number;
  matchSignals: string[];
  firstSeenAt: string;
  lastSeenAt: string;
}
```

### 5.4 Taxonomy

Do not encode JobBoardSearch's visible tag strings as our canonical ontology. Use neutral typed facets:

```text
role
function
industry
technology
seniority
employment_type
work_mode
country
region
city
visa
education_requirement
compensation_present
company_attribute
board_feature
```

Aliases map public/source vocabulary into the owned taxonomy.

### 5.5 Distribution

```ts
interface DistributionAsset {
  id: string;
  canonicalJobId: string;
  channel: 'reddit' | 'telegram' | 'linkedin' | 'bluesky' | 'email';
  templateVersion: string;
  renderedPayload: unknown;
  payloadHash: string;
  createdAt: string;
}

interface PublishAttempt {
  id: string;
  assetId: string;
  mode: 'dry-run' | 'live';
  approvalId?: string;
  idempotencyKey: string;
  status: 'prepared' | 'approved' | 'publishing' | 'published' | 'failed';
  externalId?: string;
  providerReceipt?: unknown;
}
```

### 5.6 Attribution

Never redirect to an arbitrary user-supplied URL parameter.

```ts
interface OutboundDestination {
  id: string;
  canonicalJobId?: string;
  boardId: string;
  normalizedUrl: string;
  urlHash: string;
  allowed: boolean;
}

interface ClickReceipt {
  id: string;
  destinationId: string;
  channel?: string;
  campaignId?: string;
  distributionAssetId?: string;
  occurredAt: string;
  privacySafeMetadata: unknown;
}
```

The redirect endpoint resolves an opaque destination identifier stored server-side. This prevents an open redirect and makes attribution deterministic.

## 6. Canonical vacancy identity strategy

Identity must be source-independent and evidence-producing.

### Tier 1 — exact employer identifier

If two records resolve to the same employer ATS + employer job ID, merge with high confidence.

### Tier 2 — canonical apply URL

Normalize known ATS/apply URLs and remove tracking parameters. Exact canonical apply target is a strong signal.

### Tier 3 — structured fingerprint

Fingerprint normalized:

- employer/company identity;
- title family;
- location/work mode;
- description signature;
- salary when available;
- posting date window.

### Tier 4 — fuzzy candidate merge

Use similarity only to create a **merge candidate**, not an automatic merge, unless a calibrated threshold is proven by benchmark data.

Every merge stores `matchSignals` and confidence so dedupe can be replayed and audited.

## 7. Feed runtime contract

Each connector must expose the same contract:

```ts
interface JobFeedConnector {
  discover(config: FeedConnection): Promise<FetchBatch>;
  parse(item: unknown): ParsedJobRecord;
  sourceIdentity(item: unknown): SourceIdentity;
  health(result: FetchBatch): FeedHealth;
}
```

Runtime responsibilities:

- conditional requests (ETag / Last-Modified) where supported;
- provider-specific rate limits;
- bounded response size/time;
- content-type validation;
- SSRF protection;
- retry + dead-letter behavior;
- immutable raw snapshot before normalization;
- per-run receipts.

RSS/Atom should be the next generic connector because the target explicitly accepts API/RSS feeds.

## 8. Programmatic discovery architecture

Public JobBoardSearch demonstrates a very large cross-product of board/job facets. We should avoid an uncontrolled crawl-space explosion.

Owned rule:

```text
Facet combination becomes indexable only when:
- enough active inventory exists;
- the combination has stable demand or explicit editorial approval;
- canonical URL is deterministic;
- it is not a near-duplicate of another landing page;
- stale/empty pages are retired intentionally.
```

Separate:

- interactive filters: may produce non-indexable URLs;
- approved SEO landing pages: persisted `LandingPageSpec` objects.

This prevents millions of low-value parameter pages.

## 9. Job SEO quality engine

The public analyzer gives us a useful minimum benchmark. Our owned analyzer should be stricter and evidence-based.

Signal groups:

1. crawl/index
   - status code
   - robots/noindex
   - canonical
   - mobile viewport
   - canonical consistency
2. content
   - H1/title consistency
   - description depth
   - internal links
   - apply action
3. job semantics
   - employer
   - location/remote model
   - salary provenance
   - employment type
   - date posted / valid through
4. structured data
   - JSON-LD parseability
   - JobPosting required/recommended fields
   - visible-page/schema consistency
5. freshness
   - expired job still marked active
   - redirect-to-home anti-pattern
   - dead apply target

Output is deterministic:

```ts
interface SeoAuditFinding {
  ruleId: string;
  severity: 'info' | 'warning' | 'error';
  evidence: unknown;
  remediation: string;
}
```

LLM advice may summarize findings; it must not invent the base score.

## 10. Search Console intelligence model

Public evidence shows useful job-board-specific reports:

- 12 months of query/page history;
- positions 5–20 striking-distance queries;
- low CTR and query/page mismatch;
- content gaps with sitemap suppression;
- Google for Jobs traffic trends and drop alerts;
- expired high-traffic job pages;
- rolling 28-day vs prior-28-day monitoring.

Owned architecture:

```text
Read-only GSC connector
      |
      v
SearchPerformanceFact
(query, page, date, clicks, impressions, ctr, position, searchAppearance)
      |
      +--> deterministic opportunity rules
      |      - striking distance
      |      - CTR anomaly
      |      - cannibalization
      |      - traffic loss
      |      - expired-page traffic
      |
      +--> sitemap/page inventory join
      |
      +--> optional AI explanation
```

Store provider data separately from AI recommendations so all recommendations can be replayed against the exact evidence set.

## 11. Sponsorship and distribution inventory

A major newly confirmed pattern is that the platform monetizes **inventory across multiple owned surfaces**, not just a generic premium flag.

We should model this explicitly rather than hard-code `featured=true`.

```ts
interface InventoryPlacement {
  id: string;
  surface: 'directory' | 'search' | 'newsletter' | 'reddit' | 'telegram' | 'job-ingestion-quota';
  slot: string;
  capacity: number;
  startAt: string;
  endAt: string;
}

interface Campaign {
  id: string;
  boardId: string;
  placements: string[];
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
}
```

This gives us attribution by placement and makes ROI measurable.

## 12. Marketplace intelligence — later boundary

Do not mix acquisitions into the core seeker product.

If built later, use:

- `BoardBusinessProfile`
- `BoardMetricSnapshot`
- `MarketplaceListing`
- `AcquisitionThesis`
- provenance for every seller-supplied metric

Seller-reported metrics must never be presented as independently verified without verification evidence.

## 13. Security / policy gates

### Ingestion

- no private/authenticated scraping without explicit source authorization;
- SSRF protection for submitted feed URLs;
- size/time/rate bounds;
- malware-safe handling for linked files;
- immutable raw evidence.

### Distribution

- default `dry-run`;
- provider credentials scoped per channel;
- explicit approval policy for live writes;
- idempotency keys;
- exact payload hash in receipt;
- no spam-oriented cross-posting policy.

### Redirects

- opaque destination IDs only;
- destination must already exist in normalized board/job state;
- protocol allowlist (`https` by default);
- no arbitrary `url=` redirect parameter.

### Google/Search Console

- read-only OAuth scopes;
- encrypted tokens;
- board-domain ownership verification;
- disconnect/revoke path;
- retention policy.

## 14. Benchmark corpus

Before implementation is accepted, create fixtures for:

1. one job duplicated across Greenhouse + RSS;
2. same title/company but genuinely different locations;
3. reposted job with new employer ID;
4. remote job with conflicting location strings;
5. malformed RSS XML;
6. valid Atom feed;
7. feed timeout and 500 response;
8. job removed between two syncs;
9. malicious feed URL attempting internal-network access;
10. open-redirect attack input;
11. duplicate publish retry;
12. malformed JobPosting JSON-LD;
13. schema/visible-page salary mismatch;
14. expired job still marked open;
15. Search Console query with two competing pages;
16. content-gap suggestion already present in sitemap.

## 15. Implementation order

### Gate 0 — identity/provenance correction

- `source_records`
- source-independent canonical vacancy identity
- `job_source_links`
- deterministic dedupe receipts

**Do not scale feed ingestion before this gate passes.**

### Gate 1 — board registry + generic feeds

- board registry
- board claim/review state
- RSS/Atom connector
- feed health + sync receipts
- 10+ board fixtures

### Gate 2 — directory + safe attribution

- board facets
- board detail/jobs-by-board
- opaque redirect destinations
- click receipts

### Gate 3 — distribution fabric

- neutral asset compiler
- Reddit/Telegram/email adapters
- dry-run default
- publish receipts and idempotency

### Gate 4 — SEO quality

- deterministic job-page audit
- JobPosting validator
- freshness/dead-page checks

### Gate 5 — Search Console intelligence

- read-only GSC connector
- opportunity rules
- replay fixtures
- monitoring receipts

### Gate 6 — operator monetization

- inventory placements
- campaigns
- placement attribution
- operator ROI dashboard

Marketplace and visual-generation integrations remain later optional modules.

## 16. Definition of done for the donor absorption

JobBoardSearch donor absorption is not complete because a directory UI exists. It is complete only when:

- source records and canonical jobs are separated;
- cross-source duplicates are benchmarked and auditable;
- every job retains provenance;
- board feeds have health and sync receipts;
- distribution defaults to dry-run and is idempotent;
- outbound attribution cannot be used as an open redirect;
- SEO scores are deterministic and evidence-linked;
- Search Console recommendations are replayable from stored evidence;
- public landing-page generation has crawl/index controls;
- operator campaign ROI can be measured by board/channel/placement;
- no JobBoardSearch proprietary implementation, copy, assets or private API is used.
