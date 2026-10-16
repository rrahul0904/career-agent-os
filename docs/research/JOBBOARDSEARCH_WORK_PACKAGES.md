# JobBoardSearch Donor Absorption — Bounded Work Packages

Purpose: translate the REA findings into bounded ownership units with explicit interfaces, dependencies, benchmarks and acceptance gates.

## WP-0 — Canonical Vacancy Identity + Provenance

Ownership:

- `packages/domain`
- persistence schema for source records / canonical jobs / source links
- dedupe benchmark fixtures

Must not own:

- RSS transport
- UI
- social publishing
- matching logic beyond emitting canonical IDs

Inputs:

- parsed source record
- source identity
- normalized employer/apply URL/title/location/description signals

Outputs:

- canonical job ID
- source-to-canonical link
- merge confidence
- evidence/match signals

Dependencies: none; this is prerequisite for multi-board ingestion.

Acceptance:

- same vacancy from Greenhouse + RSS collapses to one canonical job;
- same company/title with materially different location/job ID remains distinct;
- every source record survives canonicalization;
- every merge is replayable and evidence-linked;
- no LLM decides canonical identity.

## WP-1 — Board Registry + Feed Runtime

Ownership:

- `JobBoard`
- `BoardClaim`
- `FeedConnection`
- RSS/Atom connector
- feed health + sync receipts

Must not own:

- canonical dedupe algorithm
- public directory UI
- provider publishing

Inputs:

- reviewed board metadata
- feed endpoint/config

Outputs:

- immutable source records
- health/sync receipts

Dependency: WP-0 canonicalization interface.

Acceptance:

- >=10 board fixtures;
- >=3 heterogeneous feed fixtures;
- valid RSS + Atom ingest;
- malformed feed produces failure receipt;
- timeout/500 retry behavior is deterministic;
- SSRF/private-network target fixture is rejected;
- response size/time limits tested.

## WP-2 — Board Discovery + Attribution

Ownership:

- board search/facets
- board detail/jobs-by-board read model
- approved landing-page specs
- outbound destination registry
- redirect/click receipt service

Must not own:

- arbitrary URL redirects
- provider social publishing
- pricing logic

Inputs:

- reviewed boards
- canonical jobs
- taxonomy
- campaign/channel metadata

Outputs:

- stable directory read models
- safe outbound redirect
- click receipt

Dependencies: WP-0, WP-1.

Acceptance:

- no open redirect;
- destination must exist server-side before redirect;
- only allowed protocol/domain state is used;
- facet counts stable under fixture replay;
- campaign/channel/board/job attribution retained;
- unapproved faceted combinations are non-indexable.

## WP-3 — Distribution Fabric

Ownership:

- `DistributionAsset`
- channel renderers
- Reddit/Telegram/email adapters
- approval/dry-run policy
- idempotent publish attempts
- provider receipts

Must not own:

- candidate apply automation
- board discovery
- pricing

Inputs:

- canonical job
- board/campaign metadata
- channel template version

Outputs:

- rendered payload
- payload hash
- provider receipt / external ID

Dependencies: WP-0; optional WP-2 campaign metadata.

Acceptance:

- one canonical job renders correctly for >=3 channels;
- dry-run performs zero external writes;
- retry cannot duplicate a successful publish;
- exact payload hash stored;
- external ID/receipt stored on success;
- failed attempts are inspectable and retryable.

## WP-4 — Job SEO Quality Engine

Ownership:

- deterministic SEO/job-page rules
- JobPosting JSON-LD validation
- freshness/expiry rules
- machine-readable finding format

Must not own:

- Search Console OAuth/data ingestion
- free-form AI scoring

Inputs:

- fetched page snapshot
- structured data blocks
- canonical job record

Outputs:

- deterministic score
- rule findings with evidence
- remediation hints

Dependencies: canonical job/domain contracts.

Acceptance:

- malformed JSON-LD detected;
- missing apply/company/location/remote/salary fields surfaced independently;
- visible/schema mismatch surfaced;
- expired-but-open job detected;
- same fixture always produces same score;
- AI may summarize but cannot alter base findings/score.

## WP-5 — Search Console Intelligence

Ownership:

- read-only GSC connector
- `SearchPerformanceFact`
- deterministic opportunity rules
- evidence snapshots
- monitoring comparisons

Must not own:

- write access to Google properties;
- automatic page publication;
- SEO base audit rules.

Inputs:

- GSC query/page/date facts
- sitemap/page inventory
- canonical job/page state

Outputs:

- striking-distance opportunities
- low-CTR candidates
- cannibalization/query-page mismatch
- Google for Jobs changes/drop alerts
- expired-page traffic findings
- content-gap candidates

Dependencies: WP-2 page inventory, WP-4 optional page-quality context.

Acceptance:

- read-only OAuth only;
- offline fixture replay works without Google access;
- positions 5–20 rule deterministic;
- suggestion already represented in sitemap is suppressed;
- query with multiple ranking pages yields cannibalization evidence;
- latest 28d vs previous 28d comparison is reproducible;
- all AI advice cites the exact fact IDs used.

## WP-6 — Placement Inventory + Operator ROI

Ownership:

- `InventoryPlacement`
- `Campaign`
- capacity/schedule rules
- campaign-to-click/publish attribution
- operator ROI read model

Must not own:

- hard-coded product pricing
- payment provider internals
- feed canonicalization

Inputs:

- board/operator
- placement schedule
- distribution/click receipts

Outputs:

- active placement state
- campaign performance facts

Dependencies: WP-2, WP-3.

Acceptance:

- mutually exclusive slot conflicts rejected;
- expired placements stop receiving privilege;
- every attributed click resolves to placement/campaign where applicable;
- pricing remains configurable business policy;
- ROI is derived from stored receipts, not manually entered claims.

## Supervisor integration order

`WP-0 -> WP-1 -> WP-2 -> WP-3`

`WP-4` can begin after canonical job contracts stabilize.

`WP-5` depends on page inventory and can run in parallel with WP-3 after WP-2.

`WP-6` begins only after attribution and distribution receipts exist.

## Clean-room benchmark rule

No worker receives JobBoardSearch source code, private APIs, authenticated dashboards, proprietary assets or copied UI implementation. Workers receive only:

- the owned contracts in this repo;
- public behavior/evidence summaries;
- bounded acceptance fixtures;
- dependency interfaces.
