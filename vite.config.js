import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
const deployment = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'));
export default defineConfig({
  publicDir: false,
  preview: { headers: Object.fromEntries(deployment.headers[0].headers.map(({ key, value }) => [key, value])) },
  build: { sourcemap: false, target: 'es2022' },
});
