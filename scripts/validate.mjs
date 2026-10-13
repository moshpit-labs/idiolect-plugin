import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const endpoint = 'https://idiolect.app/api/mcp';
const schemas = 'https://agent-plugins.org/schemas/1.0.0/';
const readJson = (root, name) => JSON.parse(readFileSync(resolve(root, name), 'utf8'));
const exactKeys = (value, keys) => assert.deepEqual(Object.keys(value).sort(), [...keys].sort());

export function validate(root) {
  const portable = readJson(root, 'plugin.json');
  exactKeys(portable, ['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions']);
  assert.equal(portable.$schema, `${schemas}plugin.schema.json`);
  assert.equal(portable.name, 'idiolect');
  assert.match(portable.version, /^\d+\.\d+\.\d+$/);
  assert.equal(portable.author.name, 'Idiolect AI');
  assert.ok(portable.keywords.includes('writing'));
  const openai = portable.extensions['com.openai'];
  assert.equal(openai.interface.displayName, 'Idiolect AI');
  for (const key of ['logo', 'composerIcon']) {
    const path = openai.interface[key];
    assert.ok(path.startsWith('./assets/'), `Invalid asset path: ${path}`);
    assert.ok(existsSync(resolve(root, path)), `Missing asset: ${path}`);
  }
  const configurations = [
    ['mcp.json', 'streamable-http', 'url'],
    ['.mcp.json', 'http', 'url'],
    ['gemini-extension.json', null, 'httpUrl'],
  ];
  for (const [file, transport, urlKey] of configurations) {
    const config = readJson(root, file);
    exactKeys(config.mcpServers, ['idiolect']);
    const server = config.mcpServers.idiolect;
    exactKeys(server, transport ? ['type', urlKey] : [urlKey]);
    assert.equal(server[urlKey], endpoint, `${file}: hosted endpoint drift`);
    if (transport) assert.equal(server.type, transport, `${file}: transport drift`);
    if (file === 'mcp.json') assert.equal(config.$schema, `${schemas}mcp.schema.json`);
  }
  for (const file of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json', 'gemini-extension.json', 'package.json']) {
    const manifest = readJson(root, file);
    assert.equal(manifest.version, portable.version, `${file}: version drift`);
  }
  const openaiMcp = readJson(root, 'submission/openai/mcp.json');
  assert.equal(openaiMcp.$schema, `${schemas}mcp.schema.json`);
  exactKeys(openaiMcp.mcpServers, ['idiolect']);
  const openaiServer = openaiMcp.mcpServers.idiolect;
  exactKeys(openaiServer, ['type', 'url', 'extensions']);
  assert.equal(openaiServer.type, 'streamable-http');
  assert.equal(openaiServer.url, endpoint);
  assert.deepEqual(openaiServer.extensions, { 'com.openai': { auth: { type: 'oauth' } } }, 'OpenAI import must declare OAuth');
  const compatibility = readJson(root, '.codex-plugin/plugin.json');
  assert.equal(compatibility.mcpServers, './.mcp.json');
  assert.equal(compatibility.skills, './skills/');
  const market = readJson(root, '.claude-plugin/marketplace.json');
  assert.equal(market.plugins[0].source, './');
  assert.equal(market.plugins[0].name, portable.name);
  const pkg = readJson(root, 'package.json');
  assert.equal(pkg.private, true);
  assert.ok(!pkg.bin, 'Hosted plugin must not install a local server');
  assert.ok(!existsSync(resolve(root, 'server.mjs')), 'Stale local server is still bundled');
  const skill = readFileSync(resolve(root, 'skills/in-your-voice/SKILL.md'), 'utf8');
  assert.ok(skill.startsWith('---\nname: in-your-voice\ndescription: '));
  for (const name of ['write', 'rewrite', 'refine_writing', 'view_writing_profile', 'manage_profile']) {
    assert.ok(skill.includes(`\`${name}\``), `Skill missing ${name}`);
  }
  for (const file of readdirSync(resolve(root, 'commands'))) {
    const command = readFileSync(resolve(root, 'commands', file), 'utf8');
    assert.ok(command.startsWith('---\ndescription: '), `${file}: missing frontmatter`);
    assert.ok(!/get_my_voice|rewrite_in_voice|draft_in_voice|score_voice/.test(command), `${file}: retired tool`);
  }
  function scan(dir) {
    for (const entry of readdirSync(dir)) {
      if (['.git', 'node_modules'].includes(entry)) continue;
      const path = resolve(dir, entry);
      const rel = relative(root, path);
      assert.ok(!rel.startsWith(`..${sep}`));
      if (statSync(path).isDirectory()) scan(path);
      else if (path.endsWith('.json')) {
        const text = readFileSync(path, 'utf8');
        assert.ok(!/Authorization|clientSecret|IDIOLECT_API_KEY|idl_sk_/.test(text), `${rel}: credential configuration`);
      }
    }
  }
  scan(root);
  return 'Plugin artifacts validated: hosted transports, versions, assets, skill, commands, and credential exclusion.';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(validate(resolve(process.argv[2] ?? '.')));
}
