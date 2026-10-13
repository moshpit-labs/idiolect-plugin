import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { validate } from './validate.mjs';

function fixture(t, change) {
  const path = mkdtempSync(resolve(tmpdir(), 'idiolect-plugin-test-'));
  cpSync(process.cwd(), path, { recursive: true, filter: (source) => !source.includes('/.git') });
  t.after(() => rmSync(path, { recursive: true, force: true }));
  change(path);
  return path;
}
function edit(root, name, change) {
  const path = resolve(root, name);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  change(data);
  writeFileSync(path, JSON.stringify(data));
}

test('valid hosted package passes without network or models', () => assert.ok(validate(process.cwd())));
test('rejects local-server regression', (t) => {
  const path = fixture(t, (root) => edit(root, '.mcp.json', (v) => { v.mcpServers.idiolect = { command: 'node', args: ['server.mjs'] }; }));
  assert.throws(() => validate(path));
});
test('rejects accidental credential embedding', (t) => {
  const path = fixture(t, (root) => edit(root, 'plugin.json', (v) => { v.extensions['com.openai'].clientSecret = 'accidental-secret'; }));
  assert.throws(() => validate(path), /credential configuration/);
});
test('rejects portable transport drift', (t) => {
  const path = fixture(t, (root) => edit(root, 'mcp.json', (v) => { v.mcpServers.idiolect.type = 'http'; }));
  assert.throws(() => validate(path), /transport drift/);
});
test('rejects missing listing asset', (t) => {
  const path = fixture(t, (root) => rmSync(resolve(root, 'assets/logo.png')));
  assert.throws(() => validate(path), /Missing asset/);
});
