import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalogCopy } from './identity.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
test('contributor guides have resolvable local documentation links', () => {
  for (const path of ['README.md', 'CONTRIBUTING.md', 'AUTHORS.md', 'GOVERNANCE.md', 'CODE_OF_CONDUCT.md', 'docs/CONTENT_GUIDE.md', 'docs/LOCALIZATION.md']) {
    const absolute = resolve(root, path);
    const body = readFileSync(absolute, 'utf8');
    for (const [, target] of body.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(target)) continue;
      assert.ok(existsSync(resolve(dirname(absolute), target.split('#')[0])), `${path}: ${target}`);
    }
  }
});

test('community invitation is available in every catalog language', () => {
  for (const copy of Object.values(catalogCopy)) {
    assert.ok(copy.contribute.includes('Unfoldia'));
    assert.ok(copy.community.length > 0);
  }
  const source = readFileSync(resolve(root, 'src/platform/catalog.js'), 'utf8');
  assert.ok(source.includes('https://github.com/DevBD1/partwise/blob/main/CONTRIBUTING.md'));
});
