# Career Agent OS — Technical Architecture

## 1. Architecture goal

Build a persistent career operating system where the browser is one client of a durable candidate/job/application state model. The system must support human workflows now and external agents later without duplicating business logic.

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

Job sources -> ingestion workers -> normalization -> canonical jobs -> freshness

Email provider -> message ingestion -> thread correlation -> intent -> pipeline event
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

## 4. Production data plane

Use PostgreSQL as system of record. Add pgvector only for semantic retrieval where structured ranking is insufficient. Keep canonical structured match components in relational/JSON fields so fit scores are explainable and reproducible.

Use object storage for uploaded resumes, generated PDFs, and application receipts. Keep content hashes and metadata in Postgres.

For large job volumes add a search index behind a search abstraction. Postgres remains authoritative.

## 5. Job intelligence pipeline

```text
source registry
  -> scheduler
  -> connector task
  -> raw snapshot
  -> content normalization
  -> canonical identity/dedupe
  -> classifier
  -> salary/location/workplace normalization
  -> freshness policy
  -> search index
  -> match invalidation/recompute
```

The repository includes Greenhouse and Lever public-feed adapters as the first connector pattern. Workday and arbitrary career pages require more robust browser/network adapters and source-specific rate controls.

## 6. Matching

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

## 7. Generation and hallucination control

Application generation receives a structured evidence bundle, not only raw resume text. Every generated claim must map to evidence IDs. Production should run a second verifier that extracts factual claims and rejects unsupported ones.

## 8. Apply orchestration

Live application submission is intentionally policy-gated.

```text
listing -> ATS detector -> connector/browser plan -> field extraction
        -> answer resolver -> unresolved human tasks -> documents
        -> explicit submission policy -> submit -> confirmation verifier
```

Never equate a click on “Submit” with success. Store receipt/confirmation evidence.

## 9. MCP/API

MCP tools should be thin wrappers around API/domain services. Agents must never gain a parallel privileged path that bypasses candidate consent, application policies, rate limits, or audit logs.

## 10. Security

- encrypt portal credentials with a dedicated KMS envelope key
- never expose portal passwords to the browser after storage
- separate candidate PII from public job data
- retain audit trail for generated claims and submissions
- default sensitive demographic/EEO fields to human-confirmation policy
- least-privilege worker identities
- explicit per-candidate apply budget and rate limits
