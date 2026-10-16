# JobBoardSearch Donor — Immediate Execution Sequence

This is the handoff from reverse engineering to implementation. It is intentionally ordered by dependency, not UI visibility.

## 1. First implementation target: canonical identity/provenance

Do this before adding generic feeds.

Change production data model from:

`listing -> one source`

to:

`canonical_job <- many job_source_links -> many immutable source_records`.

Required deliverables:

- migration SQL;
- local SQLite migration;
- source-record repository methods;
- canonical identity resolver;
- dedupe receipt/evidence object;
- benchmark fixtures/tests.

Required fixtures:

- Greenhouse record + RSS record representing same vacancy;
- same company/title, different city;
- repost with new source external ID;
- canonical apply URL with tracking parameters;
- conflicting salary/location fields across sources.

No RSS scale-out is accepted until these tests pass.

## 2. Second target: board registry + RSS/Atom feed

After canonicalization:

- `JobBoard`
- `FeedConnection`
- review/claim state
- RSS + Atom parser
- feed fetch security policy
- feed health/sync receipts
- board-to-source provenance

RSS connector output must be `SourceRecord`, never a directly persisted canonical listing.

## 3. Third target: safe redirect + click attribution

Implement only against server-stored destinations.

Never copy the donor's encoded-URL redirect shape as an implementation. Our owned design uses opaque destination IDs and resolves the canonical URL on the server.

Test open-redirect and scheme-confusion attacks explicitly.

## 4. Fourth target: distribution dry-run compiler

Compile canonical jobs to:

- Reddit payload
- Telegram payload
- email/newsletter item

No live provider credentials are required for the first acceptance slice.

Store payload hash + idempotency key + dry-run receipt.

## 5. Parallel target after canonical job contract stabilizes: SEO audit

Build deterministic checks before AI advice:

- crawl/index status
- canonical/meta/headings
- apply action
- company/location/remote/salary
- JobPosting JSON-LD
- schema/visible consistency
- expiry/freshness/dead destination

## 6. Search Console later

Do not block core job-network work on Google OAuth.

Start with fixture-backed `SearchPerformanceFact` + deterministic analyses. Add the live read-only connector only after offline replay is proven.

## Stop conditions / supervisor gates

Pause implementation if:

- identity resolution cannot explain why two records merged;
- a connector bypasses immutable raw/source records;
- a redirect accepts an arbitrary URL;
- a publish adapter writes live without policy approval;
- an SEO/AI score cannot point to evidence;
- Search Console asks for write scopes;
- a donor detail is only inferred but is being presented as observed fact.
