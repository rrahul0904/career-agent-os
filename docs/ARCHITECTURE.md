# Career Agent OS — Technical Architecture

## 1. Architecture goal

Build a persistent career operating system where the browser is one client of a durable candidate/job/application state model. The system must support human workflows now and external agents later without duplicating business logic.

The JobBoardSearch donor analysis adds a second requirement: public job-network data must retain source provenance, resolve cross-source duplicates into source-independent canonical vacancies, and support governed distribution/attribution without weakening candidate-side policy controls.

## 2. Logical architecture

```text
Browser UI ───────────────┐
REST clients ─────────────┼──> API / policy layer
MCP / agent clients ──────┘          │
                                     ├── Candidate Intelligence
                                     ├── Job Intelligence
                                     ├── Explainable Matching
                                     ├── Career Pipeline
                                     ├── Application Pack Engine
                                     └── Apply Orchestrator
                                              │
                        ┌─────────────────────┼────────────────────┐
                        │                     │                    │
                  ATS adapters          Browser workers       Human tasks
                        │                     │                    │
                        └──────────── Submission verifier ─────────┘

Public job-network plane:

Job boards / ATS / RSS / APIs
        │
        v
source registry + scheduler
        │
        v
immutable source records
        │
        v
canonical vacancy resolver
        │
        ├── canonical jobs ──> search / matching / public job pages
        │
        └── provenance links

canonical jobs ──> distribution compiler ──> approval policy ──> channel adapters
       │                                                        │
       │                                                        v
       └──────────────────────────────> attribution <──── provider receipts

Operator plane:

board registry -> feed health -> distribution status -> SEO quality -> search intelligence
       │                                                        │
       └──────────── placement inventory / campaigns / ROI <────┘
```

## 3. Current runnable slice

The initial repository intentionally uses Node 22 built-ins and SQLite so it runs without external services. Domain boundaries match the future distributed architecture:

- `apps/api`: stateful REST facade and static frontend host
- `apps/worker`: ingestion execution boundary
- `packages/connectors`: source-specific adapters
- `packages/matching`: deterministic scoring
- `packages/ai`: generation policy boundary
- `packages/application-agent`: execution boundary
- `packages/mcp`: agent tool contract

The local SQLite store is replaceable with a Postgres repository implementation without changing the domain interfaces.

The current runnable slice still uses source-dependent listing identity and must be upgraded before multi-board aggregation is scaled.

## 4. Production data plane

Use PostgreSQL as system of record. Add pgvector only for semantic retrieval where structured ranking is insufficient. Keep canonical structured match components in relational/JSON fields so fit scores are explainable and reproducible.

Use object storage for uploaded resumes, generated PDFs, and application receipts. Keep content hashes and metadata in Postgres.

For large job volumes add a search index behind a search abstraction. Postgres remains authoritative.

### Provenance model

Do not let a canonical job row represent the only copy of an external source record.

Persist:

- immutable/source-specific raw records;
- parsed source records;
- source-independent canonical jobs;
- many-to-many canonical-job/source links;
- merge confidence + match evidence;
- first/last seen timestamps.

This preserves the ability to replay deduplication, inspect drift, and prove where a field came from.

## 5. Job intelligence pipeline

```text
source / board registry
  -> scheduler
  -> connector task
  -> immutable raw SourceRecord
  -> parsed source record
  -> company + apply URL normalization
  -> source-independent identity resolution
  -> CanonicalJob + JobSourceLink(s)
  -> classifier
  -> salary/location/workplace normalization
  -> freshness policy
  -> search index
  -> match invalidation/recompute
```

The repository includes Greenhouse and Lever public-feed adapters as the first connector pattern. RSS/Atom is the next generic connector required for the board-network slice. Workday and arbitrary career pages require more robust browser/network adapters and source-specific rate controls.

### Identity tiers

1. same employer ATS + employer job ID;
2. same normalized canonical apply URL;
3. structured company/title/location/description fingerprint;
4. fuzzy candidate merge only after calibrated benchmark thresholds.

Fuzzy similarity alone must not silently merge jobs.

## 6. Board network and taxonomy

Board metadata is a separate domain from job records.

A `JobBoard` owns:

- canonical domain/URL;
- review/claim state;
- feed connections;
- typed facets/taxonomy;
- health and sync receipts;
- operator/campaign relationships.

Do not copy donor tag strings into the canonical ontology. Map source vocabulary into neutral types such as role, function, industry, technology, seniority, work mode, employment type, geography and board feature.

Interactive filter combinations are not automatically SEO landing pages. Persist approved `LandingPageSpec` records for crawlable/indexable programmatic pages to avoid faceted crawl-space explosion.

## 7. Distribution and attribution

External publishing is a governed write plane.

```text
CanonicalJob
   -> DistributionAsset renderer
   -> dry-run payload + exact hash
   -> approval/policy gate
   -> provider adapter
   -> provider receipt/external id
   -> attribution link/campaign
```

Rules:

- dry-run by default;
- idempotency keys on live publish attempts;
- scoped provider credentials;
- exact payload hash in receipts;
- bounded retries/dead-letter behavior;
- no parallel privileged path for agents.

Outbound redirect/attribution must resolve an opaque server-side destination ID. Never accept an arbitrary destination URL from a query parameter.

## 8. Matching

Matching is hybrid, but the score itself should stay deterministic:

1. Hard eligibility constraints
2. Skill overlap
3. Role/title alignment
4. Seniority
5. Workplace/location
6. Compensation
7. Optional semantic similarity
8. Optional outcome-based reranking later

An LLM may explain evidence; it should not invent the canonical numeric score.

## 9. Generation and hallucination control

Application generation receives a structured evidence bundle, not only raw resume text. Every generated claim must map to evidence IDs. Production should run a second verifier that extracts factual claims and rejects unsupported ones.

## 10. Apply orchestration

Live application submission is intentionally policy-gated.

```text
listing -> ATS detector -> connector/browser plan -> field extraction
        -> answer resolver -> unresolved human tasks -> documents
        -> explicit submission policy -> submit -> confirmation verifier
```

Never equate a click on “Submit” with success. Store receipt/confirmation evidence.

## 11. Operator SEO and Search Console intelligence

SEO quality should be deterministic and evidence-linked. The base audit should inspect crawl/index state, canonical/meta/headings, apply actions, job semantics, JobPosting structured data, visible/schema consistency, expiry and dead apply targets.

Search Console integration is read-only:

```text
GSC data -> SearchPerformanceFact -> deterministic opportunity rules
                                    -> optional AI explanation
```

Store the source query/page facts separately from AI recommendations so reports can be replayed against exact evidence.

Useful rules include:

- positions 5–20 striking distance;
- low CTR vs comparable query/page cohorts;
- query/page mismatch;
- cannibalization;
- traffic loss/change detection;
- Google for Jobs traffic/drop detection;
- expired page still receiving traffic;
- sitemap-aware content-gap suppression.

## 12. Sponsorship inventory

Promotion should not be modeled as a generic `featured` boolean.

Use explicit finite inventory:

- surface/channel;
- slot;
- capacity;
- schedule window;
- campaign;
- placement-level attribution.

This supports exclusive sponsor slots, newsletter/community placements, feed quotas, expiry and ROI without hard-coding pricing into domain logic.

## 13. MCP/API

MCP tools should be thin wrappers around API/domain services. Agents must never gain a parallel privileged path that bypasses candidate consent, application policies, rate limits, provider publish gates, or audit logs.

## 14. Security

- encrypt portal and provider credentials with a dedicated KMS envelope key
- never expose portal passwords to the browser after storage
- separate candidate PII from public job/board data
- retain audit trail for generated claims and submissions
- default sensitive demographic/EEO fields to human-confirmation policy
- least-privilege worker identities
- explicit per-candidate apply budget and rate limits
- SSRF protection for operator-submitted feed URLs
- response size/time/content-type limits on feed fetches
- controlled redirect destinations only
- read-only Search Console scopes
- explicit live-publish approval + idempotency
