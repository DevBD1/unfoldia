# Platform architecture

## Boundaries

Platform owns discoverability and routing. Each lab owns its meaning/content, representation, and progression. `src/platform/registry.js` contains public metadata and route resolution; explicit dynamic imports in `entry.js` are the executable allowlist. URL values never become import paths.

Labs currently initialize on import and own `#app`. Navigation deliberately reloads the document: old listeners, Three.js resources and global styles are discarded by the browser. Do not add client-side route switching without first implementing and testing a `mount(host)/dispose()` lifecycle. Individual lab rendering internals were preserved rather than rewritten in this move.

## Add a topic

1. Create `src/labs/<stable-id>/` with an entry, independent styles, content, pure calculations and colocated `*.test.js` tests.
2. Add metadata and route resolution in `platform/registry.js`, then an explicit lazy loader in `platform/entry.js`.
3. Add exact Vercel rewrites for its public deep links, and route tests. Unknown paths should not silently render another course.
4. Use a namespaced versioned key such as `partwise:<lab>:<lesson-version>`. Validate corrupt input and handle denied storage. Never mark new lessons complete using legacy completion.
5. Define objectives, prerequisites, explained tasks/questions, and source scope before declaring content ready. Planned courses must be labeled planned.
6. Run `npm run check`; inspect desktop and narrow screens; check keyboard access, navigation and refresh on a preview.

## Layers within a topic

Subject → course/stage → lesson → learning activity. A difficulty setting is explanation depth, not a replacement for stage prerequisites. EV has beginner/advanced depth; Calculus has Pre-Calculus/Calculus I/Calculus II stages. Avoid forcing those into one misleading level enum.

Keep pure math independent of D3/Three.js. Extract shared components into `src/shared/` only when a second real consumer exists; do not build a generic lesson engine around a single example. Existing Calculus graph adapters can be reused within that lab without coupling EV to D3.

## Deployment boundary

Only Vite's generated `dist` is served. `publicDir` is disabled to prevent accidental bulk copying; future GLB/image assets should be explicitly imported from a reviewed source asset directory and the build allowlist deliberately extended. Research Markdown and PDFs are not web assets. Production sourcemaps are disabled (this is not source-code secrecy; the repository is public).

No backend, user accounts, remote code evaluation, arbitrary formula eval, service worker, or third-party embed is introduced. Adding those requires revisiting the security policy, CSP, licenses and privacy contract.
