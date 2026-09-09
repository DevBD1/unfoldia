# Vercel deployment checklist

## Before import

- Use Node 22.x and `npm ci && npm run check` from repository root.
- Confirm the owner has reviewed public repository contents and license status. `.gitignore` does not remove already-published history. If a credential was ever published, rotate it; deleting a file alone is insufficient.
- Review asset provenance independently of code licenses. The textbook contents index is not permission to publish the textbook.

## Project settings (owner action)

- Root directory: `.`; framework: Vite; Node: 22.x.
- Install: `npm ci`; build: `npm run check`; output: `dist`.
- No environment variables. Never place secrets in `VITE_*`; those values become public client code.
- Import the Git repository and use a preview before production. Vercel Git integration can publish its configured production branch automatically; confirm that branch before merging.
- Protect the production branch in GitHub and require the CI check. The workflow does not configure protections itself. Vercel independently runs tests in its build; it does not wait for GitHub CI by assumption.

## Preview acceptance

- Open `/`, all three lab paths, and legacy query links. Refresh each deep link.
- Check catalog → lab → catalog and EV ↔ Calculus. Check unknown paths return a hosting 404; unknown query labs display a not-found catalog.
- Complete a task; refresh; verify saved state. Do not confuse different preview/local/production origins with lost migration.
- Test EV with WebGL and `/labs/ev?renderer=off`; verify selection and working mechanism.
- Check desktop, 390×844 and 320×568, keyboard focus and reduced motion.
- Inspect network/console for CSP violations and validate response headers on the actual preview. Local Vite preview is not proof that Vercel applied its configuration.
- `/docs/`, `.env`, source files, and source maps must not be served by production. Missing static assets must not return the application shell.

## Headers and limitations

CSP restricts scripts/connects to the same origin, disallows embedded frames/objects, and allows inline styles because existing D3/Three.js UI uses style attributes. The app cannot be embedded in another site (`frame-ancestors 'none'`, X-Frame-Options DENY). Revisit deliberately if embedding becomes a product requirement. Vercel toolbar/analytics or remote model embeds are not assumed compatible and were not enabled.

No blanket long-lived cache is added to HTML. Vercel handles Vite's fingerprinted assets. EV's large JS chunk warning remains; lazy loading prevents it loading on the catalog/Calculus page, but does not make the EV module small.

## Rollback

Retain the previous known-good Vercel deployment. Use the dashboard rollback/promote controls if acceptance fails. Database migrations are not involved. Do not clear users' storage as a rollback mechanism.
