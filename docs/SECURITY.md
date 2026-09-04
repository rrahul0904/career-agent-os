# Security Baseline

- Candidate resumes and profile fields are private by default.
- Do not store raw portal credentials without envelope encryption/KMS.
- Live application submission requires explicit user authorization and an auditable policy decision.
- Sensitive/EEO questions default to human review.
- Generated claims must retain evidence provenance.
- Job-source connectors need rate limiting, robots/terms review, and source-specific backoff.
- Separate browser automation workers from the API network plane.
- Treat uploaded resume documents and job HTML as untrusted input.
- Add CSRF/session protection when authentication is introduced.
- Production must use HTTPS, secret-manager-backed credentials, database backups, and retention/deletion workflows.
