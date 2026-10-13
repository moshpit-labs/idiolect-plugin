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
- Cline listing logo: `assets/logo-400.png`, a mechanical 400×400 resize of the same connector PNG
- Additional brand mark: `assets/logo.svg`, copied unchanged from the product

## Format decisions and primary sources

Read on 13 October 2026:

- [Claude Code manifest reference](https://code.claude.com/docs/en/plugins-reference): `.claude-plugin/plugin.json`, root skill/command directories, and `.mcp.json`; strict CLI validation is authoritative for the manifest. Listing metadata belongs in the plugin manifest, not its marketplace entry.
- [OpenAI packaging](https://developers.openai.com/plugins/build/plugins): root Agent Plugins manifest and `mcp.json` are preferred. `.codex-plugin/plugin.json` remains a compatibility format. Remote MCP transport is `streamable-http`. Public submission needs a remote HTTPS endpoint and its own review.
- [Agent Plugins manifest schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json) and [MCP schema](https://agent-plugins.org/schemas/1.0.0/mcp.schema.json): portable paths and transport format. The shared server entry remains schema-minimal. The explicit OpenAI submission variant adds the vendor-documented OAuth declaration; see the staging steps below.
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

Claude Code 2.1.281 strict plugin and marketplace validation passed. Codex CLI 0.160.1 runs from the Node v24.15.0 installation. The orchestrator reached live OAuth consent using a temporary configuration override; the callback awaits user action. Package installation and writing were not exercised. No authenticated installation, completed OAuth round trip, writing call, host-policy probe, or directory acceptance is claimed. No product model calls were made.


## OpenAI authentication import variant

The [OpenAI submission field reference](https://developers.openai.com/plugins/deploy/submission) confirms that portable packages discover root `skills/` and `mcp.json` automatically. The root `extensions.com.openai` object replaces the compatibility overlay; no duplicate `mcpServers` mapping is needed or effective for a portable package. Keywords are optional and included for discovery.

OpenAI's current [MCP authentication reference](https://developers.openai.com/plugins/build/plugins#configure-mcp-authentication) requires `extensions.com.openai.auth.type` set to `oauth` on each protected server. Its submission guide says the portal imports advanced auth settings from `mcp.json`; the connection panel does not offer an advanced OAuth editor. Do not upload the shared portable `mcp.json` unchanged and assume the portal discovers the authentication method.

The published Agent Plugins 1.0.0 MCP schema rejects extra server fields, including `extensions`, while OpenAI documents and accepts its own extension. To preserve portable schema compatibility, `submission/openai/mcp.json` contains the OpenAI import variant. It uses the documented `streamable-http`, `url`, and `extensions.com.openai.auth` shape with only `type: oauth`. OAuth client mode, endpoints, and scopes remain omitted for discovery. No credentials are embedded. Our deterministic validator checks this exact supported shape; it is not a claim that the OpenAI portal has accepted it.

Before an authorized OpenAI upload:

1. Copy the checked-out package to a separate staging directory without Git files.
2. Copy `submission/openai/mcp.json` over that staging directory's root `mcp.json`. Keep the repository's shared root file unchanged.
3. ZIP the staged package. In the portal, inspect MCPs and confirm the saved Authentication is OAuth before connecting. Resolve discovery or registration problems before scan or submission. If credentials become required, enter them only in the private connection flow.

Support details were verified against the product source: `app/support/page.tsx` implements `/support`; `app/privacy/page.tsx` and `app/terms/page.tsx` publish `hello@idiolect.app`. No support destination was invented.
