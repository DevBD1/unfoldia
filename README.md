# Unfoldia

**Explore the parts, understand the whole.**

An open-source interactive learning platform across subjects, built with Vite and JavaScript. Our vision is a global, multilingual community where learners explore and educators, translators, designers, and developers build understanding together.

Today the catalog supports English and Turkish; lesson content is Turkish. Broader language and subject coverage is a direction, not a claim of completed courses. See the [product vision](docs/PRODUCT.md).

Formerly **Partwise**. Existing URLs, repository location, the internal `partwise` package name, and browser storage keys remain unchanged; no progress migration is required.

- **EV Lab:** eight systems, twenty component targets, guided learning and simplified Three.js mechanisms. Not a Tesla digital twin or service guide.
- **Calculus Lab:** introductory sets/functions lessons with synchronized D3 diagrams, tables and graphs. Calculus I/II are planned, not complete courses.

## Local development

Use Node 22 (`nvm use`) and npm:

```sh
npm ci
npm run dev
npm run check
npm run preview
```

`check` runs all tests, a production build, and a build-output safety check. No account, API key, backend, analytics or external runtime script is required.

| URL | Purpose |
| --- | --- |
| `/` | Platform catalog |
| `/labs/ev` | EV Lab |
| `/labs/calculus` | Sets and functions |
| `/labs/calculus/machine` | Original function machine |

Legacy `/?lab=ev`, `/?lab=calculus`, `/?lab=calculus&lesson=machine`, and `/?renderer=off` remain supported. Use `/labs/ev?renderer=off` to test EV without WebGL.

## Structure

```text
src/
  platform/          catalog, route resolver, lazy entry points
  labs/
    ev/              EV content, rendering, physics, progress, tests
    calculus/        lessons, diagrams, pure math, progress, tests
scripts/             build-output checks
docs/                research, architecture, deployment instructions
```

This is a modular single application, not a monorepo. Labs use full-document navigation, so scene resources and CSS cannot leak into the next lab. There is no need for React, Next.js, workspaces, or a backend merely to add a new subject. See [architecture](docs/ARCHITECTURE.md) and [contributing](CONTRIBUTING.md).

## Vercel

Import the repository with root directory `.` and Node **22.x**. Configuration in `vercel.json` sets Vite, `npm ci`, `npm run check`, and `dist`. No environment variables are needed. Start with a preview and follow the [deployment checklist](docs/DEPLOYMENT.md) before production.

This change does not deploy, push, configure your Vercel dashboard, or enable GitHub branch protections. CI performs checks only; it holds no deployment tokens.

## Data and safety

Learning progress stays in this browser's localStorage. Existing keys are preserved, including `ev-atlas`. Localhost, preview domains, and your production domain have **separate storage**; progress does not automatically migrate between them. No student data is sent to a backend. Hosting providers still receive ordinary HTTP requests.

See [security policy](SECURITY.md), [third-party notices](THIRD_PARTY_NOTICES.md), and [EV research handoff](docs/EV-STATUS-HANDOFF.md). Research claims and sources are not automatically verified production specifications. Do not commit textbook PDFs, purchased assets, credentials, or student data.

## License

Original source code and project-authored educational content are available
under the [MIT License](LICENSE). This does not license third-party dependencies,
referenced materials, or excluded local research files; see
[third-party notices](THIRD_PARTY_NOTICES.md) for the provenance boundary.
