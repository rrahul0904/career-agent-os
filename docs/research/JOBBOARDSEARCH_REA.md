# JobBoardSearch REA — Evidence, Capability Map, and Clean-Room Integration

Status: **active research**  
Target: `https://jobboardsearch.com`  
Seed evidence: Reddit share `https://www.reddit.com/r/jobboardsearch/s/OiuzJbg0MO`  
Captured: 2026-10-16

## 1. Repository routing decision

**Classification: donor/reference + extension of Career Agent OS.**

Do **not** create a new standalone repository for this target. The job-seeker side overlaps Career Agent OS's existing product boundary: persistent candidate intelligence, live job ingestion, explainable matching, application-pack generation, pipeline tracking, dry-run auto-apply, and agent-ready APIs.

JobBoardSearch contributes a valuable missing layer: **job-board discovery, board metadata, feed aggregation, multi-channel distribution, operator growth tooling, and board-marketplace intelligence**.

Canonical branch: `research/jobboardsearch`.

## 2. What the Reddit post actually is

The shared Reddit item is an automatically distributed job listing. It advertises a Senior Platform Engineer role and routes the click through `jobboardsearch.com/redirect`, with UTM parameters identifying Reddit/bot distribution and the upstream board domain.

This is evidence of a distribution pipeline, not just a static directory:

1. ingest job from a source board;
2. normalize title/company/location/date/category metadata;
3. publish a Reddit link post;
4. route outbound apply traffic through a redirect endpoint;
5. attribute traffic back to channel/source/board.

Public founder material from 2022 also describes a cron-driven Reddit bot posting jobs repeatedly via Reddit's API, confirming that automated social distribution is a long-running growth primitive.

## 3. Observed product surfaces

### A. Job-board discovery directory

Observed public behavior:

- ~870 niche job boards in the current directory.
- Board discovery by industry, location, profession, work arrangement, technology, level, and other niche tags.
- Bookmarks / saved boards.
- Dedicated board pages and cross-linked job pages.
- Search / filtering and SEO-oriented landing pages for job categories and countries.

### B. Job ingestion and job discovery

Observed public behavior:

- JobBoardSearch states that boards can provide an **API or RSS feed**.
- Jobs are fetched and displayed on JobBoardSearch pages.
- Jobs are categorized into role, seniority, technology, geography, remote status, recency, etc.
- The Reddit evidence shows outbound redirect attribution to the upstream source board.

### C. Multi-channel distribution engine

Observed channels include:

- Reddit
- Telegram
- LinkedIn
- Bluesky
- newsletter/email
- Google for Jobs / structured-data discovery

The important reusable pattern is `Job -> DistributionAsset -> ChannelPublishAttempt -> AttributionReceipt`.

### D. Job-board operator acquisition + monetization

Observed monetization primitives:

- free permanent listing after approval;
- featured placements from ~$19/month;
- priority ranking / highlighted placements;
- newsletter inclusion;
- additional job indexing / cross-posting volume;
- do-follow backlink / SEO value;
- sponsorship/ad slots;
- SEO services and directory-submission services.

This is a two-sided business:

- **job seeker value:** discover specialized boards and jobs;
- **operator value:** acquire traffic, authority, distribution and customers.

### E. Job-board marketplace

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

### F. Operator SEO / growth tooling

Observed tools include:

- job-board Open Graph checker;
- site audit;
- keyword research;
- domain-rating checker;
- JobPosting schema checker;
- Chrome SEO analyzer;
- Search Console AI;
- directory submission tooling.

The SEO analyzer checks job-specific signals: apply actions, salary, company, location, remote markers and `JobPosting` structured data, in addition to ordinary meta/indexing/content checks.

Search Console AI adds:

- 12 months of Search Console data;
- "striking distance" queries (roughly positions 5–20);
- content-gap analysis;
- low CTR / cannibalization / query-page mismatch analysis;
- sitemap-aware recommendations;
- Google for Jobs traffic reporting;
- expired-page / traffic-drop detection.

### G. Job Visuals AI

Observed operator workflow:

1. load jobs from a connected board feed;
2. generate branded job graphics from logo + job metadata;
3. create multiple social-friendly visual formats;
4. generate platform-specific captions;
5. track usage/top-ups.

This overlaps our Creator Console / Product Tutorial distribution pattern and should be treated as an integration point, not rebuilt inside the career core.

### H. Auto-apply / JobCopilot

The JobBoardSearch navigation exposes "Auto Apply", but the CTA routes to `jobboardsearch.jobcopilot.com` and the page is branded JobCopilot. Treat this as **external/partner/white-label behavior unless stronger provenance proves ownership**.

Observed behavior worth benchmarking independently:

- user search preferences;
- resume/profile upload;
- screening-question knowledge base;
- frequent job scanning;
- automatic application attempts;
- application confirmation + tracker;
- editable AI answers;
- application-volume controls.

Career Agent OS already owns the correct clean-room boundary for these capabilities; do not copy JobCopilot implementation or claims.

## 4. Historical architecture evidence

Public founder retrospectives say the first version was built rapidly as a single `index.php` using plain PHP/HTML/CSS/JavaScript plus a small amount of jQuery. That is historical evidence only; do **not** assume it represents the current production stack.

The reusable lesson is architectural, not technological: start with a simple curated directory, then compound value through feeds, programmatic SEO, social distribution, operator monetization, and adjacent tools.

## 5. Growth loop reconstructed

```text
Board submission / discovery
        ↓
Manual review + BoardProfile
        ↓
API/RSS feed connection
        ↓
Job ingestion + normalization + dedupe
        ↓
Search / category / country landing pages
        ↓
Structured data + programmatic SEO
        ↓
Reddit / Telegram / LinkedIn / Bluesky / newsletter distribution
        ↓
Tracked outbound redirect
        ↓
Referral traffic + operator ROI evidence
        ↓
Featured listing / sponsorship / growth tools
        ↓
More boards + more jobs + more SEO inventory
        ↺
```

This is the most important donor pattern.

## 6. Gap analysis vs Career Agent OS

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

### Missing / high-value additions from this donor

1. **JobBoard Registry** — canonical board metadata, taxonomy, provenance and health.
2. **Feed Connector Contract** — RSS/API/sitemap/ATS adapters with sync receipts.
3. **Board + Job Taxonomy Graph** — niche/location/role/stack/work-style facets.
4. **Redirect + Attribution Service** — click receipts by job/board/channel/campaign.
5. **Distribution Engine** — transform canonical jobs into channel-specific assets and publish receipts.
6. **Programmatic SEO Surface** — category/location/stack/level landing pages with canonical rules and structured data.
7. **Board Operator Workspace** — submit/claim/configure board, feed health, distribution status and referral analytics.
8. **JobPosting Quality Analyzer** — schema/content/indexability validation specialized for jobs.
9. **Search Console Intelligence Adapter** — read-only GSC ingestion and opportunity analysis.
10. **Board Marketplace Intelligence** — optional later module; separate from seeker core.

## 7. Proposed owned domain contracts

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

interface FeedConnection {
  id: string;
  boardId: string;
  kind: 'rss' | 'api' | 'sitemap' | 'greenhouse' | 'lever' | 'custom';
  endpoint: string;
  enabled: boolean;
  lastSyncAt?: string;
  health: 'unknown' | 'healthy' | 'degraded' | 'failed';
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

## 8. Clean-room rules

- Use only publicly observable behavior and public founder material as evidence.
- Do not scrape private dashboards, bypass auth, copy proprietary text/assets, or reproduce private APIs.
- Do not infer ownership of JobCopilot solely from the JobBoardSearch integration.
- Do not copy branding, UI artwork, testimonials, pricing language or source code.
- Preserve provenance for every donor-derived capability.
- Provider writes (social posting, Search Console access, email delivery) require explicit credentials and approval gates.
- Default all application submission and social publish flows to dry-run / prepared receipts until enabled by policy.

## 9. Build slices

### Slice 1 — Registry + ingestion foundation

- `JobBoardProfile` domain model and persistence.
- board submission/import endpoint.
- RSS generic adapter.
- normalize/dedupe jobs from board feeds.
- feed sync receipts + health state.
- searchable board directory API.

Acceptance:

- seed at least 10 synthetic/public boards;
- sync at least 3 heterogeneous feed fixtures;
- duplicate job fixture collapses deterministically;
- failed feed produces inspectable failure receipt;
- board provenance survives normalization.

### Slice 2 — Discovery + attribution

- board directory UI;
- board detail page;
- jobs-by-board and jobs-by-facet views;
- redirect service with signed/opaque destination token;
- attribution receipts.

Acceptance:

- no open-redirect vulnerability;
- redirect destination is constrained to normalized job/board records;
- click receipt links to board/job/campaign;
- directory search returns stable facet counts.

### Slice 3 — Distribution fabric

- neutral `DistributionAsset` contract;
- Reddit/Telegram/email adapters first;
- approval gate + dry-run mode;
- exact payload hash and external-id receipt.

Acceptance:

- same canonical job compiles into channel-specific payloads;
- dry-run causes zero provider writes;
- failed publish is retryable/idempotent;
- successful publish stores external receipt.

### Slice 4 — Job SEO quality engine

- `JobPosting` schema validator;
- title/meta/canonical/robots/H1/content checks;
- apply/salary/company/location/remote checks;
- machine-readable audit output + UI scorecard.

Acceptance:

- deterministic fixture score;
- malformed JSON-LD is caught;
- missing salary/location/apply action are separately surfaced;
- no generic SEO recommendation without evidence.

### Slice 5 — Operator intelligence

- read-only Search Console adapter;
- query/page history model;
- striking-distance analysis;
- low-CTR/cannibalization/content-gap rules;
- traffic-drop alerts.

Acceptance:

- read-only OAuth scopes;
- fixture-based GSC replay works without live provider access;
- every recommendation cites the query/page evidence used;
- sitemap-aware suppression prevents duplicate page suggestions.

## 10. Recommendation

**Absorb the distribution/registry/SEO intelligence patterns into Career Agent OS; do not clone JobBoardSearch as a separate product.**

The owned differentiation should become:

`candidate intelligence + board intelligence + job ingestion + explainable matching + verified application artifacts + governed application execution + operator-grade distribution/attribution`.

That is a materially stronger product boundary than a directory clone and fits the existing Self Working Agent roadmap.