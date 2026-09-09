# Contributing to Unfoldia

**Explore the parts, understand the whole.** Help build a global, multilingual,
open-source learning platform. You do not need to be a developer: explanations,
source review, translations, accessibility feedback, and teaching experience
are valuable contributions. Current lessons are Turkish; English catalog copy
is not a claim that the lessons are translated.

## Choose a first contribution

- Report a reproducible bug using the bug issue template.
- Suggest a small learning activity using the learning proposal template.
- Improve an explanation, source citation, or keyboard/screen-reader experience.
- Propose a translation using the translation template and
  [localization guide](docs/LOCALIZATION.md).
- For a new lab, dependency, or large redesign, discuss an issue before coding.

English is the shared documentation language. Turkish reports are welcome;
reports in other languages are welcome too, but review depends on available
language expertise. Do not promise translation support that is not available.

## From idea to reviewed change

1. Read the [product vision](docs/PRODUCT.md), [architecture](docs/ARCHITECTURE.md),
   and [community code of conduct](CODE_OF_CONDUCT.md).
2. Search existing issues and PRs. Describe the learner, objective, and smallest
   useful improvement. An issue is helpful but not required for small corrections.
3. Fork the repository, create a topic branch, and follow the setup below.
4. Add or update tests. For lessons, follow the [content guide](docs/CONTENT_GUIDE.md).
5. Open a PR using the checklist. Include evidence and limitations, not just a
   screenshot or a passing build. Maintainers may request revisions or defer work.
6. A maintainer reviews and decides whether to merge. Contributors do not gain
   deployment access by opening a PR. See [governance](GOVERNANCE.md).

## Setup, licensing, and compatibility

Original source code and project-authored educational content are licensed
under the [MIT License](LICENSE). Do not assume that repository visibility or
this license grants rights to third-party materials; check
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Use Node 22 and `npm ci`. Keep changes scoped to a lab or platform contract. Run `npm run check` before opening a pull request. Include the learning objective, source provenance, tests, and desktop/mobile evidence for visual changes. State what was not verified.

Do not commit `.env`, credentials, real learner records, copyrighted textbook scans, or assets without redistribution permission. Dependency additions need a reason and license review. Do not disable security headers or tests just to make deployment succeed.

New modules follow [ARCHITECTURE.md](docs/ARCHITECTURE.md). Retain stable semantic IDs and storage migrations. Pure calculation tests should not import DOM/rendering modules. Version control should include `package-lock.json`; use `npm ci` in CI.

Do not expose deployment tokens to untrusted pull requests or use `pull_request_target` to run contributor code. Publishing and production promotion remain owner-controlled.
