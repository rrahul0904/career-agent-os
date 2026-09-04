# Career Agent OS

A clean-room, end-to-end reference implementation inspired by the product category represented by Dreamwork HQ: persistent candidate intelligence, live job ingestion, explainable matching, application-pack generation, pipeline tracking, and an agent-ready API surface.

> This repository does **not** contain Dreamwork HQ source code, proprietary prompts, private APIs, or copied assets. It is an independent implementation based on publicly observable product behavior and original engineering decisions.

## What works now

- Candidate profile API and UI
- Resume-style structured candidate intelligence
- Seeded + connector-ready job corpus
- Explainable deterministic matching
- Search/filter/recommended jobs
- Career pipeline state
- Application pack generation with evidence-bound copy
- Dry-run auto-apply orchestration and receipts
- Greenhouse and Lever public job-feed adapters
- Worker entrypoint for ingestion
- Responsive operator-style web UI
- SQLite zero-dependency local persistence
- Production PostgreSQL schema
- Docker image + Compose
- OpenAPI contract
- CI workflow and Node test suite

## Quick start

```bash
cp .env.example .env
npm run seed
npm start
```

Open <http://localhost:4310>.

No npm install is required for the current reference runtime; it uses Node.js 22 built-ins only.

## Demo API

```bash
curl http://localhost:4310/api/health
curl http://localhost:4310/api/profile
curl 'http://localhost:4310/api/listings/recommended?limit=10'
curl http://localhost:4310/api/pipeline
```

Create an application pack:

```bash
curl -X POST http://localhost:4310/api/jobs/job-openai-senior-platform/pack \
  -H 'content-type: application/json' \
  -d '{}'
```

Dry-run an application:

```bash
curl -X POST http://localhost:4310/api/jobs/job-openai-senior-platform/apply \
  -H 'content-type: application/json' \
  -d '{}'
```

## Repository map

```text
apps/
  api/                 HTTP API + static web host
  web/                 browser UI
  worker/              job-ingestion worker
packages/
  domain/              canonical entities + normalization
  matching/            explainable ranking engine
  ai/                  evidence-bound application-pack engine
  connectors/          ATS/job-source adapters
  application-agent/   submission orchestration abstraction
  mcp/                 MCP-facing tool contract
scripts/                local utility scripts
db/                     production PostgreSQL schema
infra/                  Docker + Compose
docs/                   architecture, product and delivery docs
openapi/                 API contract
tests/                   unit + integration tests
```

## Architecture principle

The UI is a client of a persistent career-state backend. Candidate intelligence, listings, matches, pipeline state, generated artifacts, and application attempts remain server-side domain state so future clients—including MCP/AI agents—can use the same primitives.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).
