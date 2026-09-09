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
  for (const lab of labs) assert.ok(catalogCopy.en.labs[lab.id]);
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
  for (const file of ['src/labs/calculus/app.js', 'src/labs/calculus/sets-app.js', 'src/labs/ev/shell.js', 'index.html']) {
    assert.ok(read(file).includes('Unfoldia'), file);
    assert.ok(!read(file).includes('Partwise'), file);
  }
});
