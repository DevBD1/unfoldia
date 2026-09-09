// Repository-only validation: docs are intentionally excluded from Vercel uploads.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
for (const path of ['README.md', 'CONTRIBUTING.md', 'AUTHORS.md', 'GOVERNANCE.md', 'CODE_OF_CONDUCT.md', 'docs/CONTENT_GUIDE.md', 'docs/LOCALIZATION.md']) {
  const absolute = resolve(root, path);
  const body = readFileSync(absolute, 'utf8');
  for (const [, target] of body.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^https?:/.test(target)) continue;
    assert.ok(existsSync(resolve(dirname(absolute), target.split('#')[0])), `${path}: ${target}`);
  }
}
console.log('Contributor documentation links passed.');
