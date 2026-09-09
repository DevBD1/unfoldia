import test from 'node:test';
import assert from 'node:assert/strict';
import { labs, resolveRoute } from './registry.js';
const route = path => resolveRoute(new URL(path, 'https://example.test'));
test('catalog and registry IDs are stable and unique', () => {
  assert.equal(route('/').kind, 'catalog');
  assert.equal(new Set(labs.map(l=>l.id)).size,labs.length);
  for (const lab of labs) assert.equal(route(lab.path).entry,lab.entry);
});
test('legacy links retain their meaning without dynamic user imports', () => {
  assert.equal(route('/?lab=ev').entry,'ev');
  assert.equal(route('/?renderer=off').entry,'ev');
  assert.equal(route('/?lab=calculus&lesson=machine').entry,'calculus-machine');
  assert.equal(route('/labs/calculus/machine').entry,'calculus-machine');
  assert.equal(route('/labs/ev/').entry,'ev');
  for(const path of ['/?lab=../../x','/labs/unknown','/?lab=calculus&lesson=unknown']) assert.equal(route(path).kind,'not-found');
});
