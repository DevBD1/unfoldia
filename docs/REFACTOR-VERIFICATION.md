# Platform refactor verification — 2026-09-09

- Started from clean commit `570a712`; preserved lab internals via file moves.
- `npm ci`: passed. `npm run check`: 53 tests, production build and output checks passed.
- `npm audit`: zero reported vulnerabilities at inspection time; not a permanent security guarantee.
- Local production preview on port 4173 applies the same headers as `vercel.json`.
- Browser: catalog → canonical Calculus path; completed first task/check and verified 1/4 after refresh. EV canonical path produced a WebGL canvas; renderer-off path retained educational content. No error-level browser logs observed in these checks.
- Desktop catalog screenshot reviewed. This turn did not complete narrow-screen visual acceptance or exhaustive mechanism regression tests; automated geometry/physics tests passed.
- Existing storage keys are unchanged. Preview testing uses a different origin from port 5173 and does not migrate that origin's progress.
- EV ~648 kB JS warning retained; catalog and Calculus do not eagerly import EV.
- No Vercel remote preview, production deploy, push, branch protection, license grant, or full Git-history secret audit performed. Follow DEPLOYMENT.md before promotion.
