import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
async function check(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) { assert.equal(entry.name, 'assets', `Unexpected output directory: ${path}`); await check(path); continue; }
    assert.match(entry.name, /\.(html|js|css)$/, `Unexpected published file: ${path}`);
    const contents = await readFile(path, 'utf8');
    assert.ok(!contents.includes('/Users/') && !contents.includes('codex-remote-attachments'), `Local path leaked into ${path}`);
    assert.ok(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(contents), `Private key marker in ${path}`);
  }
}
await check('dist');
assert.match(await readFile('dist/index.html', 'utf8'), /assets\/.*\.js/);
console.log('Build output allowlist and local-path/private-key checks passed (not a full secret audit).');
