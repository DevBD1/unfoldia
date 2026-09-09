# Localization and translation

Unfoldia's direction is multilingual; today's catalog supports `en` and `tr`,
while EV and Calculus lesson content remains Turkish. The catalog language selector
changes only the catalog. It uses `?lang=en` or `?lang=tr`, falling back to the
browser language (Turkish for `tr*`, English otherwise), and writes no storage.
Existing lab paths and aliases remain supported, with `lang` carried on internal
navigation links so returning to the catalog retains the choice. Lessons still
declare Turkish. No preference is written to storage: opening a bare URL without
`lang` uses the browser fallback. This is not a complete application i18n system.

## Propose a translation

Open a translation issue with the language/locale, exact lesson or page, source
revision, and review availability. Start with one complete activity rather than
partially relabeling a course. A maintainer and a reviewer competent in the target
language should check meaning, terminology, equations, examples, and accessibility
labels before declaring that language supported. Review may wait for expertise.

Catalog copy lives in `src/platform/identity.js`; Turkish lab metadata remains in
`src/platform/registry.js`. New catalog locales need explicit selection/fallback
behavior, complete card copy, selector options, and tests. Lesson localization
needs a separate implementation proposal; do not imply it works by translating
catalog cards alone.

Keep Unfoldia and the canonical tagline recognizable. Translate supporting copy
naturally, not necessarily word for word. Preserve semantic IDs, URLs, formulas,
units, package identifiers, `partwise:*` keys, and `ev-atlas` records. Never reset
progress when changing language. Set the document language to match actual content,
and test long text, keyboard navigation, desktop/narrow layouts, and right-to-left
direction if relevant. Do not claim RTL support without implementation and evidence.

Translation PRs should include the original and translated terms, source revision,
screenshots for affected UI, tests, and any sections still untranslated. Machine
translation is a draft, not evidence of linguistic or subject-matter accuracy.
