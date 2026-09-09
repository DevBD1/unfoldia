import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalogCopy } from './identity.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
test('community invitation is available in every catalog language', () => {
  for (const copy of Object.values(catalogCopy)) {
    assert.ok(copy.contribute.includes('Unfoldia'));
    assert.ok(copy.community.length > 0);
  }
  const source = readFileSync(resolve(root, 'src/platform/catalog.js'), 'utf8');
  assert.ok(source.includes('https://github.com/DevBD1/partwise/blob/main/CONTRIBUTING.md'));
});
