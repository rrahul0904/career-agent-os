# Product Specification

## Product thesis

Career Agent OS turns a candidate's verified career history and preferences into a persistent operating layer for finding, qualifying, applying to, and tracking opportunities.

The JobBoardSearch donor analysis expands the discovery side into an owned **job-network intelligence layer**: Career Agent OS should understand not only jobs, but the boards/sources they came from, cross-source provenance, feed health, distribution, attribution and operator-quality signals.

This does **not** change the core product into a JobBoardSearch clone. Candidate outcomes remain the primary product boundary; board-network capabilities improve coverage, freshness, trust, distribution and observability.

## Core jobs to be done

1. Understand me once instead of making me re-enter my history for every role.
2. Find current jobs that actually fit and explain why.
3. Search across many sources without showing duplicate copies of the same real vacancy.
4. Tell me where a job came from, how fresh it is and whether its apply destination is still valid.
5. Build truthful, role-specific application materials.
6. Keep every opportunity and state transition in one pipeline.
7. Automate repetitive application work while pausing when judgment or sensitive answers are required.
8. Capture replies and outcomes so the system becomes smarter over time.

## Main candidate surfaces

### Discover

Search and ranked recommendations with fit decomposition, salary, work mode, source/provenance and visible evidence.

### Source/board discovery

Explore job sources by niche, geography, role, technology and other typed facets. A board is a source entity, not just a string on a job record.

### Job detail

Role summary, match reasons, gaps, application assets, source provenance/freshness, canonical apply destination and execution state.

When multiple sources contain the same vacancy, show one canonical job and retain source alternatives/provenance behind it.

### Application pack

Tailored resume, cover letter, screening-answer draft, evidence links and fabrication verification.

### Pipeline

Saved -> Pack ready -> Ready to apply -> Applied -> Interview -> Offer / Rejected / Withdrawn.

### Candidate profile

Resume versions, structured experience, skills, preferences, constraints and answer memory.

### Messages

Recruiter/application messages correlated to jobs and classified by intent.

## Operator / system surfaces

### Operations

Job-source freshness, ingestion health, dedupe confidence, submission success rate, queue health, costs and policy exceptions.

### Board registry

Reviewed/claimed boards, feed connections, taxonomy, source provenance, feed health and current inventory.

### Distribution

Prepared/dry-run/live distribution assets with approval state, exact payload hashes, channel receipts and idempotency.

### Attribution

Controlled outbound destinations and click/campaign/channel receipts. No arbitrary open redirects.

### Job SEO quality

Deterministic job-page and JobPosting structured-data findings, freshness/expiry checks and evidence-linked remediation.

### Search intelligence

Read-only Search Console facts, striking-distance opportunities, query/page mismatch, content gaps, Google for Jobs changes and expired-page traffic findings.

### Campaign inventory — later

Explicit placement inventory and campaign attribution for directory/search/newsletter/community surfaces. Pricing is business policy, not core domain logic.

## Non-goals for the first production slice

- mass blind applying without candidate controls
- scraping behind authentication in ways that violate site policy
- invented resume claims
- auto-answering sensitive demographic questions without explicit candidate policy
- cloning JobBoardSearch branding, UI, copy, private APIs or proprietary implementation
- uncontrolled indexing of every possible facet combination
- arbitrary user-controlled outbound redirects
- live social/provider publishing without approval policy
- treating seller-supplied marketplace metrics as independently verified facts
