import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, samples, restore, complete } from './model.js';
test('function rules handle zero, negatives and fractions', () => {
  assert.equal(evaluate('square', -2), 4);
  assert.equal(evaluate('square', 0), 0);
  assert.equal(evaluate('double', -0.5), -1);
  assert.equal(evaluate('square', 3), 9);
  assert.throws(() => evaluate('missing', 1));
  assert.throws(() => evaluate('square', Infinity));
});
test('graph samples preserve rule and domain', () => {
  const points = samples('square');
  assert.equal(points[0].x, -4);
  assert.equal(points.at(-1).x, 4);
  for (const p of points) assert.equal(p.y, p.x ** 2);
  assert.throws(() => samples('double', 4, -4));
  assert.throws(() => samples('double', -4, 4, 0));
});
test('progress requires experiment and both checks; safe restore', () => {
  const state = restore('broken');
  assert.equal(complete(state), false);
  state.explored = true;
  state.prediction = true;
  assert.equal(complete(state), false);
  state.concept = true;
  assert.equal(complete(restore(JSON.stringify(state))), true);
  assert.equal(complete(restore('{"version":0,"explored":true}')), false);
  assert.equal(restore('{"version":1,"concept":"true"}').concept, false);
});
