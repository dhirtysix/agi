import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Basic test to ensure the UI markup includes the main header

test('index.html contains header', async () => {
  const html = await readFile(new URL('../client/index.html', import.meta.url), 'utf8');
  assert.match(html, /Kubernetes RTS Controller/);
});
