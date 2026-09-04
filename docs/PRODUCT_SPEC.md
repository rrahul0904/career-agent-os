# Product Specification

## Product thesis

Career Agent OS turns a candidate's verified career history and preferences into a persistent operating layer for finding, qualifying, applying to, and tracking opportunities.

## Core jobs to be done

1. Understand me once instead of making me re-enter my history for every role.
2. Find current jobs that actually fit and explain why.
3. Build truthful, role-specific application materials.
4. Keep every opportunity and state transition in one pipeline.
5. Automate repetitive application work while pausing when judgment or sensitive answers are required.
6. Capture replies and outcomes so the system becomes smarter over time.

## Main surfaces

### Discover
Search and ranked recommendations with fit decomposition, salary, work mode and visible evidence.

### Job detail
Role summary, match reasons, gaps, application assets, source freshness and execution state.

### Application pack
Tailored resume, cover letter, screening-answer draft, evidence links and fabrication verification.

### Pipeline
Saved -> Pack ready -> Ready to apply -> Applied -> Interview -> Offer / Rejected / Withdrawn.

### Candidate profile
Resume versions, structured experience, skills, preferences, constraints and answer memory.

### Messages
Recruiter/application messages correlated to jobs and classified by intent.

### Operations
Job-source freshness, ingestion health, submission success rate, queue health, costs and policy exceptions.

## Non-goals for the first production slice

- mass blind applying without candidate controls
- scraping behind authentication in ways that violate site policy
- invented resume claims
- auto-answering sensitive demographic questions without explicit candidate policy
