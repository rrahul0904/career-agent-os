# Implementation Plan

## Phase 0 — foundation (included)

- monorepo/domain boundaries
- candidate profile state
- canonical listing model
- explainable matching
- pipeline state
- application-pack engine
- dry-run application agent
- Greenhouse + Lever adapters
- responsive UI
- API/OpenAPI
- local SQLite + production Postgres schema
- CI/test baseline

## Phase 0A — JobBoardSearch donor prerequisite: canonical identity + provenance

Before scaling board/RSS aggregation, correct the current source-specific listing identity model.

- immutable `SourceRecord` persistence
- source-independent canonical vacancy identity
- many-to-many `JobSourceLink` provenance
- canonical apply-URL normalization
- deterministic merge evidence + confidence
- cross-source dedupe benchmark corpus

Exit gate: one real vacancy arriving through ATS + RSS resolves to one canonical job while retaining every source record; near-duplicate but distinct jobs remain separate; every merge can be replayed from evidence.

## Phase 1 — production identity and persistence

- authentication and account isolation
- Postgres repository implementation + migrations
- encrypted object storage for resumes
- resume upload/parser and versioning
- explicit consent and privacy controls
- audit events

Exit gate: two users can never observe each other's career data; deletion/retention paths certified.

## Phase 2 — job corpus + board network

- source registry and scheduler
- job-board registry + claim/review state
- durable queue with lease/retry/dead-letter semantics
- Greenhouse/Lever scale-out
- generic RSS + Atom connectors
- Ashby adapter
- Workday adapter
- direct career-page adapter
- canonical company identities
- immutable source snapshots
- canonical job resolution + cross-source dedupe
- feed health/sync receipts
- searchable board directory + facets
- search index

Exit gate: ingestion SLOs, dedupe accuracy, provenance completeness, stale-job policy, source rate limits, feed SSRF/size/time protections.

## Phase 2A — discovery + attribution

- board detail / jobs-by-board surfaces
- approved programmatic landing pages
- controlled outbound destination registry
- opaque redirect IDs; no arbitrary `url=` redirects
- board/job/channel/campaign click receipts
- stable facet counts

Exit gate: no open redirect; attribution is deterministic; landing-page crawl/index policy prevents uncontrolled faceted-page explosion.

## Phase 2B — distribution fabric

- neutral `DistributionAsset` contract
- Reddit, Telegram and email/newsletter adapters first
- channel-specific rendering
- approval policy + dry-run default
- idempotency keys
- payload hashes and provider receipts
- retry/dead-letter rules

Exit gate: same canonical job compiles to multiple channels; dry-run performs zero provider writes; retry cannot duplicate a successful publish; every live write stores exact receipt evidence.

## Phase 3 — candidate intelligence + matching v2

- robust resume parsing
- normalized skills/titles/seniority taxonomy
- hard eligibility constraints
- semantic retrieval and reranking
- evidence-first explanations
- feedback and dismissal learning

Exit gate: offline labeled-match evaluation and explanation traceability.

## Phase 4 — AI application engine

- LLM provider gateway with budget policy
- role-requirement mapper
- structured resume rewrite planner
- claim-level evidence verifier
- cover letters
- screening-answer memory
- PDF/docx rendering

Exit gate: unsupported-claim rate below agreed threshold; cost envelope enforced.

## Phase 5 — ATS automation

- ATS detector
- Greenhouse application adapter
- Lever application adapter
- Ashby adapter
- browser fallback workers
- secure portal credential vault
- human task queue
- screenshot/receipt verification

Exit gate: per-ATS test suites + live canary accounts + confirmation evidence.

## Phase 6 — recruiter inbox

- inbound mail address/routing
- application/thread correlation
- intent classification
- interview/rejection/offer status updates
- human reply drafting

## Phase 7 — platform/API/MCP

- API key scopes
- OAuth for agent clients
- MCP server backed by the same policy layer
- tool audit logs
- per-tool budgets and rate limits

## Phase 8 — growth + operator intelligence

### Public growth

- public SEO job pages
- approved taxonomy/location landing pages
- hiring-market research
- outcome analytics
- interview prep agent
- networking/outreach agent
- offer comparison and negotiation

### Job-board SEO quality

- deterministic page audit
- JobPosting JSON-LD validator
- visible-page/schema consistency checks
- apply/salary/company/location/remote checks
- expired-job/dead-apply checks

### Search Console intelligence

- read-only Search Console adapter
- query/page history
- positions 5–20 striking-distance opportunities
- low-CTR/cannibalization/query-page mismatch rules
- sitemap-aware content-gap suppression
- Google for Jobs traffic/drop detection
- expired high-traffic job analysis
- latest-28-days vs prior-28-days monitoring

Exit gate: recommendations are replayable from exact stored evidence; provider access is read-only; deterministic rules are separate from optional AI explanation.

## Phase 9 — operator monetization

- placement inventory model
- directory/search/newsletter/community/feed-quota placements
- scheduled campaigns with capacity rules
- placement-level attribution
- operator ROI dashboard
- configurable pricing/business policy

Marketplace intelligence and visual-generation integrations remain optional later modules rather than career-core requirements.

## Definition of done

A feature is not “done” because UI exists. It needs persisted state, API contract, authorization, observability, error handling, tests, certified user journey, provenance where external data is involved, and verification receipts for external writes.