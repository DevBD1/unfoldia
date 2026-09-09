# Unfoldia identity verification

- `npm run check`: 55 tests passed, production build and dist safety check passed.
- Existing warning: EV bundle exceeds Vite's 500 kB advisory threshold.
- Chrome local catalog: English desktop and Turkish 390×844 screenshots inspected;
  wordmark, copy, cards, and language selector are legible, with no visible clipping.
- English → Turkish selector navigation verified; current language and translated
  catalog appear after navigation. Lesson availability remains explicitly Turkish.
- Automated regression guards retain package identity, EV/Calculus storage keys,
  route aliases, model behavior, and progress semantics.
- No domain, repository, deployment, storage schema, or lab mechanism migration.
- This is not a full repeat of EV assembly/cutaway/inventory visual acceptance;
  model code was not changed. Production hosting and physical-device testing are
  not covered by this local verification.

## Contribution layer (PR 2)

- `npm run check`: 56 tests, production build, and dist safety check passed.
- `npm run check:docs`: contributor documentation links passed, separately required
  by GitHub CI because `.vercelignore` excludes documentation from web builds.
- All four issue-template YAML files parsed successfully with Ruby YAML.
- Browser smoke checks loaded Calculus and EV's `renderer=off` route with the
  Unfoldia header and existing Turkish learning controls.
- Added contributor guides, governance, conduct, credit, and GitHub issue/PR templates.
- English and Turkish community links inspected in Chrome at 390×844; copy wraps
  without visible clipping and points to the existing repository contribution guide.
- Added checks for local contributor-document links and bilingual community copy.
- No permissions, moderation inbox, branch protections, or deployment settings
  were created. GitHub issue-form rendering still needs confirmation after merge
  to the default branch.
