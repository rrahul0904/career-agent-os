# Reverse Engineering Notes

## Clean-room rule

Reverse engineer public behavior, information architecture, workflows, and product patterns. Do not copy proprietary source code, private APIs, prompts, assets, or authenticated implementation details.

## Active donor: JobBoardSearch

Seed: https://www.reddit.com/r/jobboardsearch/s/OiuzJbg0MO

Routing: **donor/reference extension of Career Agent OS; no new standalone repository.**

Evidence branch: `research/jobboardsearch`

Primary research:

- `docs/research/JOBBOARDSEARCH_REA.md`
- `docs/research/JOBBOARDSEARCH_SYSTEM_DESIGN.md`

Key reverse-engineering result:

JobBoardSearch is not merely a directory or isolated Reddit posting bot. Public evidence shows a flywheel spanning board discovery, board review, API/RSS feed ingestion, job publishing, programmatic discovery/SEO, multi-channel job distribution, newsletter/community audience, outbound attribution, sponsorship inventory, operator SEO/Search Console tooling and a job-board marketplace.

Critical Career Agent OS prerequisite discovered:

The current source-dependent listing identity and single-source listing schema are insufficient for multi-board aggregation. Before expanding feed ingestion, implement immutable source records, source-independent canonical vacancy identity, many-to-many provenance links and replayable dedupe evidence.

Seed-post evidence:

The Oct 15, 2026 Reddit post advertises a Senior Platform Engineer vacancy, labels it Senior / engineer / devops / fulltime / python / golang, and links through a JobBoardSearch redirect carrying `utm_source=reddit`, `utm_medium=bot`, `utm_term=devopsjobs.com`, plus an encoded destination resolving to the upstream DevOpsJobs job URL. Treat this as direct evidence of automated channel distribution + source attribution behavior.
