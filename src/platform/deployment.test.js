import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { labs } from './registry.js';
const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
test('deploy builds run checks and serve only generated dist', () => {
  assert.equal(config.buildCommand,'npm run check');
  assert.equal(config.outputDirectory,'dist');
  for (const lab of labs) assert.ok(config.rewrites.some(r=>r.source===lab.path));
  assert.ok(!config.rewrites.some(r=>r.source==='/(.*)'));
});
test('production security baseline excludes remote scripts and objects', () => {
  const headers = Object.fromEntries(config.headers[0].headers.map(h=>[h.key,h.value]));
  assert.equal(headers['X-Content-Type-Options'],'nosniff');
  assert.match(headers['Content-Security-Policy'], /script-src 'self';/);
  assert.match(headers['Content-Security-Policy'], /object-src 'none'/);
});
