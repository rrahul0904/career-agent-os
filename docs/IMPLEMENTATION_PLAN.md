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

## Phase 1 — production identity and persistence

- authentication and account isolation
- Postgres repository implementation + migrations
- encrypted object storage for resumes
- resume upload/parser and versioning
- explicit consent and privacy controls
- audit events

Exit gate: two users can never observe each other's career data; deletion/retention paths certified.

## Phase 2 — job corpus

- source registry and scheduler
- durable queue with lease/retry/dead-letter semantics
- Greenhouse/Lever scale-out
- Ashby adapter
- Workday adapter
- direct career-page adapter
- canonical company identities
- snapshots, dedupe and freshness checks
- search index

Exit gate: ingestion SLOs, dedupe accuracy, stale-job policy, source rate limits.

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

## Phase 8 — growth + intelligence

- public SEO job pages
- hiring-market research
- outcome analytics
- interview prep agent
- networking/outreach agent
- offer comparison and negotiation

## Definition of done

A feature is not “done” because UI exists. It needs persisted state, API contract, authorization, observability, error handling, tests, and a certified user journey.
