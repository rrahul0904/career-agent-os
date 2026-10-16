# JobBoardSearch Evidence Matrix

Captured: 2026-10-16

Confidence scale:

- **A — direct observable behavior:** visible in the live public product or seed Reddit post.
- **B — explicit public product claim:** stated by JobBoardSearch on its public pages.
- **C — historical public statement:** useful context but not evidence of current internals.
- **D — engineering inference:** our independent reconstruction; never presented as donor fact.

| Capability / claim | Evidence | Grade | Clean-room takeaway |
|---|---|---:|---|
| Directory contains ~870 job boards | public homepage | A | board registry + typed facets |
| Boards can submit API/RSS URL | public add-board form | A | generic feed connection model |
| Feed jobs can appear on website | add-board/about pages | A/B | feed -> canonical job -> public read model |
| Feed jobs distributed to Reddit/Telegram/newsletter | add-board/about pages + seed Reddit post | A | governed distribution fabric |
| Seed Reddit job marked as bot traffic | redirect has `utm_medium=bot` | A | publish receipts + channel metadata |
| Seed redirect identifies upstream board | `utm_term=devopsjobs.com` | A | source/board attribution |
| Seed redirect contains encoded upstream vacancy URL | public redirect URL | A | controlled destination registry; do not copy encoding scheme |
| Google for Jobs is part of operator distribution proposition | add-board/about pages | B | structured data/freshness/indexing quality |
| Fixed sponsor slots can sell out | add-board page | A | finite placement inventory, schedule/capacity |
| Sponsorship bundles directory/community/newsletter/feed volume | add-board page | A | campaign composed of placements |
| Board submission is reviewed/curated | about/add-board pages | B | review state separate from claim/ownership |
| Search Console connection is read-only | Search Console AI page | B | read-only provider adapter + revoke/delete path |
| Search Console AI syncs 12 months | Search Console AI page | B | fact store with historical window |
| Striking-distance range positions 5-20 | Search Console AI page | A/B | deterministic opportunity rule |
| Content gaps use sitemap suppression | Search Console AI page | B | join recommendations against owned page inventory |
| Google for Jobs drop monitoring | Search Console AI page | B | traffic anomaly rule |
| Expired job checker detects errors/home redirects/stale open jobs | Search Console AI page | B | job freshness page validator |
| SEO analyzer checks job-specific signals + JobPosting | SEO Analyzer page | A/B | deterministic job-page audit engine |
| Marketplace exposes revenue/traffic/SEO/stack/audience metrics | marketplace | A | optional acquisition intelligence domain |
| Job Visuals AI consumes feed jobs and produces channel assets | Job Visuals AI page | B | integrate with Creator Console rather than career core |
| Auto Apply is internally owned by JobBoardSearch | not established; JobCopilot branding observed | — | treat as external/partner unless stronger evidence appears |
| Current production stack/language/database | not publicly proven by surfaces used | — | do not infer or imitate |
| Canonical job identity algorithm | not observable | D | build our own provenance-first resolver |
| Distribution queue/provider architecture | not observable | D | build owned dry-run/idempotent publish runtime |

## Evidence-backed product thesis

The highest-confidence reconstruction is a flywheel:

`curated board registry -> feed-enabled job inventory -> public discovery/SEO -> multi-channel distribution -> attributed referral value -> sponsor/operator monetization -> more board supply and inventory`.

The exact donor implementation is unknown and irrelevant to the owned system design.
