import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { brand, tagline, catalogLanguage, catalogCopy } from './identity.js';
import { labs, resolveRoute } from './registry.js';

test('Unfoldia catalog languages use explicit supported locale or browser fallback', () => {
  const url = query => new URL(`https://example.test/${query}`);
  assert.equal(brand, 'Unfoldia');
  assert.equal(tagline, 'Explore the parts, understand the whole.');
  assert.equal(catalogLanguage(url('?lang=en'), 'tr-TR'), 'en');
  assert.equal(catalogLanguage(url('?lang=tr'), 'en-US'), 'tr');
  assert.equal(catalogLanguage(url('?lang=xx'), 'tr-TR'), 'tr');
  assert.equal(catalogLanguage(url(''), 'fr'), 'en');
  for (const lab of labs) {
    const copy = catalogCopy.en.labs[lab.id];
    assert.equal(typeof copy?.description, 'string', lab.id);
    assert.ok(copy.description.trim().length > 0, lab.id);
    assert.ok(Array.isArray(copy.stages), lab.id);
    assert.ok(copy.stages.length > 0, lab.id);
    for (const stage of copy.stages) assert.ok(typeof stage === 'string' && stage.trim().length > 0, lab.id);
  }
  for (const path of ['/?lab=ev&lang=en', '/labs/calculus?lang=en']) {
    assert.equal(resolveRoute(new URL(path, url(''))).kind, 'lab');
  }
});

test('rebrand retains package and persisted progress identities', () => {
  const read = file => readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
  assert.equal(JSON.parse(read('package.json')).name, 'partwise');
  assert.ok(read('src/labs/calculus/app.js').includes('partwise:calculus:${lessonId}'));
  assert.ok(read('src/labs/calculus/sets-app.js').includes('partwise:calculus:sets-v1'));
  assert.ok(read('src/labs/ev/main.js').includes('ev-atlas'));
  for (const file of ['src/platform/catalog.js', 'src/labs/calculus/app.js', 'src/labs/calculus/sets-app.js', 'src/labs/ev/shell.js', 'index.html']) {
    assert.ok(read(file).includes('Unfoldia'), file);
    // Exempt retained storage and repository URLs, never visible brand strings.
    const publicCopy = read(file).replaceAll('partwise:calculus:', '').replaceAll('https://github.com/DevBD1/partwise/', '');
    assert.doesNotMatch(publicCopy, /partwise/i, file);
    if (file.endsWith('catalog.js') || file.includes('/calculus/')) {
      assert.match(read(file), />Unfoldia(?:<|\$)/, file);
    }
  }
});
