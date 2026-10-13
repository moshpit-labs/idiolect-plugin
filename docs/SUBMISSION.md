# Public plugin submission preparation

Part of https://linear.app/idiolect-ai/issue/IDI-612/refresh-public-plugin-for-hosted-oauth-and-multi-client-submission

Prepared 13 October 2026. This is a local package, not a submitted or published listing.

## Shared listing information

- Name: Idiolect AI (`idiolect` package identifier)
- Description: Write and revise emails, messages, posts, and docs in your voice with your portable Writing Profile.
- Endpoint: `https://idiolect.app/api/mcp`
- Authentication: hosted OAuth, discovered by the host; no bundled credentials or scope overrides
- Repository: `https://github.com/Moshpit-Labs/idiolect-plugin`
- Documentation: repository README
- Support: `https://idiolect.app/support`, `hello@idiolect.app`
- Privacy: `https://idiolect.app/privacy`
- Terms: `https://idiolect.app/terms`
- Logo: `assets/logo.png`, copied unchanged from the product's existing connector asset
- Additional brand mark: `assets/logo.svg`, copied unchanged from the product

## Format decisions and primary sources

Read on 13 October 2026:

- [Claude Code manifest reference](https://code.claude.com/docs/en/plugins-reference): `.claude-plugin/plugin.json`, root skill/command directories, and `.mcp.json`; strict CLI validation is authoritative for the manifest. Listing metadata belongs in the plugin manifest, not its marketplace entry.
- [OpenAI packaging](https://developers.openai.com/plugins/build/plugins): root Agent Plugins manifest and `mcp.json` are preferred. `.codex-plugin/plugin.json` remains a compatibility format. Remote MCP transport is `streamable-http`. Public submission needs a remote HTTPS endpoint and its own review.
- [Agent Plugins manifest schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json) and [MCP schema](https://agent-plugins.org/schemas/1.0.0/mcp.schema.json): portable paths and transport format. Keep server config minimal for portability; let OAuth discovery supply settings rather than adding vendor extensions to the shared server entry.
- [Cursor plugin reference](https://cursor.com/docs/reference/plugins): root Agent Plugins packages load in Cursor; a separate Cursor manifest is unnecessary for this skill and remote server. No plugin-root variables are needed.
- [Gemini extension reference](https://geminicli.com/docs/extensions/reference/) and [MCP OAuth reference](https://geminicli.com/docs/tools/mcp-server/): `gemini-extension.json`, shared `skills/`, `httpUrl`, and automatic OAuth discovery are supported. This does not prove callback compatibility with the hosted provider.

The product reference is the progressive-v1 catalog in `lib/mcp/contracts/progressive-v1.ts`, paired with `docs/MCP-PLAYBOOK.md` and `docs/BRAND.md` in the product repository. The older `lib/mcp/public-contract.js` list covers compatibility names; it is not the current advertised catalog.

The refresh removes the obsolete bundled stdio server instead of shipping two defaults. Previously published npm packages are unaffected. `package.json` is private because this is a hosted plugin package, not a new npm server release.

## Evidence before submission

1. Approve and publish the repository refresh separately. No push, PR, or submission was made while preparing this package.
2. Install the exact candidate in each target host. Verify a fresh browser OAuth sign-in, a reconnect, and cancellation. Record host version and observed result.
3. With a bounded, separately authorized product-call budget, test a new writing request, supplied-text rewrite, follow-up revision, and no-profile setup/skip. Verify returned wording and continuation references. Do not report a score for ordinary writing.
4. Verify profile reads and an explicitly authorized profile change. Use only approved test evidence; do not upload private production writing.
5. Submit Claude through its plugin publishing process, Cursor through [its submission page](https://cursor.com/marketplace/publish), and OpenAI through its current plugin submission portal. OpenAI connection setup may require a registered server mapping; this package does not invent one. Gemini's extension repository format is prepared; no directory acceptance is claimed.

## Local checks

The deterministic validator checks hosted transport parity, absence of credential configuration, required skill and command artifacts, version parity, and listing assets. Mutation tests reject a local-server regression, embedded client secret, wrong portable transport, and a missing asset.

Claude Code 2.1.281 strict plugin and marketplace validation passed. The installed Codex launcher failed before startup because its native executable was missing. No authenticated installation, OAuth round trip, writing call, host-policy probe, or directory acceptance is claimed. No product model calls were made.
