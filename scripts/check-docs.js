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
const checklist = readFileSync(resolve(root, '.github/pull_request_template.md'), 'utf8');
for (const command of ['npm run check', 'npm run check:docs']) {
  assert.ok(checklist.includes(`\`${command}\``), `PR checklist missing ${command}`);
}
for (const [form, target] of [['bug_report.yml', 'SECURITY.md'], ['translation.yml', 'docs/LOCALIZATION.md']]) {
  const source = readFileSync(resolve(root, '.github/ISSUE_TEMPLATE', form), 'utf8');
  assert.ok(source.includes(`](https://github.com/DevBD1/unfoldia/blob/main/${target})`), `${form}: missing guidance link`);
  assert.ok(existsSync(resolve(root, target)), `${form}: missing guidance target`);
}
console.log('Contributor documentation links passed.');
