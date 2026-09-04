# Clean-room reverse-engineering notes

This project re-implements a product pattern based on public product behavior, not proprietary source code.

Observed category capabilities that informed the architecture include candidate profile analysis, job recommendations, a persistent application pipeline, role-specific resume/cover-letter generation, automated application workflows, and API/MCP-style agent access.

The implementation decisions in this repository are original:

- deterministic explainable match scoring
- evidence-bound generation boundary
- local Node SQLite runtime
- production PostgreSQL schema
- connector interface and ingestion worker
- dry-run-by-default application execution policy

No private Dreamwork HQ implementation details are assumed or represented as facts.
