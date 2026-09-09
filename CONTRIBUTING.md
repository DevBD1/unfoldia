# Contributing

Original source code and project-authored educational content are licensed
under the [MIT License](LICENSE). Do not assume that repository visibility or
this license grants rights to third-party materials; check
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Use Node 22 and `npm ci`. Keep changes scoped to a lab or platform contract. Run `npm run check` before opening a pull request. Include the learning objective, source provenance, tests, and desktop/mobile evidence for visual changes. State what was not verified.

Do not commit `.env`, credentials, real learner records, copyrighted textbook scans, or assets without redistribution permission. Dependency additions need a reason and license review. Do not disable security headers or tests just to make deployment succeed.

New modules follow [ARCHITECTURE.md](docs/ARCHITECTURE.md). Retain stable semantic IDs and storage migrations. Pure calculation tests should not import DOM/rendering modules. Version control should include `package-lock.json`; use `npm ci` in CI.

Do not expose deployment tokens to untrusted pull requests or use `pull_request_target` to run contributor code. Publishing and production promotion remain owner-controlled.
