# Idiolect AI plugin

Write emails, messages, posts, replies, and docs in your voice with your portable Writing Profile.
The plugin connects your AI to the hosted Idiolect AI service at `https://idiolect.app/api/mcp`.
Sign in through your host's browser-based OAuth flow. No local server, API key, or client secret is required.

## Install and connect

These instructions describe the refreshed package. It has not yet been published to any directory.
For review, clone this repository and check out the approved refresh branch before installing locally.
Avoid enabling a second Idiolect AI connection if your host already has one.

### Claude Code

Test the checked-out package:

```sh
claude --plugin-dir /absolute/path/to/idiolect-plugin
```

Use `/mcp` to authenticate the `idiolect` server. Approve the browser sign-in and return to Claude Code.
After this refresh is merged, the repository marketplace can install it:

```text
/plugin marketplace add Moshpit-Labs/idiolect-plugin
/plugin install idiolect@idiolect
```

The Claude Code commands are `/idiolect:draft`, `/idiolect:rewrite`, `/idiolect:refine`, and `/idiolect:voice`.
The writing skill also applies to ordinary writing requests.

### Codex

The root `plugin.json` and `mcp.json` use the portable Agent Plugins format supported by current Codex.
A `.codex-plugin/plugin.json` compatibility manifest is included for older clients.
Use your Codex plugin browser's local package/marketplace workflow to test this checked-out package.
For the hosted tools alone, the Codex CLI also supports:

```sh
codex mcp add idiolect --url https://idiolect.app/api/mcp
codex mcp login idiolect
```

The CLI commands connect the tools; they do not install this package's writing skill.
Public OpenAI submission uses the explicit OAuth import variant at `submission/openai/mcp.json`.
Copy it over root `mcp.json` in a separate submission staging directory. Do not replace the shared portable file.
The portal imports authentication from this file; no registered app ID or secret is bundled here.

### Cursor and other Agent Plugins hosts

Cursor supports the root Agent Plugins manifest, `skills/`, and `mcp.json`.
Load this repository through the host's plugin installation flow and authenticate its `idiolect` connection.
If using Cursor's MCP settings directly, add `https://idiolect.app/api/mcp` as a remote server.
That connects the tools without installing the skill. Directory publication remains pending.

### Gemini CLI

The package includes `gemini-extension.json` and the shared writing skill:

```sh
gemini extensions install /absolute/path/to/idiolect-plugin
```

Restart Gemini CLI, then run `/mcp auth idiolect` and complete browser sign-in.
Gemini CLI discovers OAuth endpoints from the server. No token belongs in the extension file.

## Writing flow

- `write` drafts directly from your request, facts, or notes.
- `rewrite` changes prose you supply. Your directions travel separately in `instructions`.
- `refine_writing` revises writing returned by Idiolect AI, using its latest writing reference.
- `view_writing_profile` reads your current Writing Profile, rules, and samples.
- `manage_profile` creates or updates your Writing Profile and stated rules.

There is no required profile fetch before writing, and no required draft-then-rewrite loop.
If you do not have a Writing Profile, the service offers setup from your writing or answers.
You can skip setup and continue with the held writing request. The host follows the returned choices.
The skill preserves the returned wording. Ordinary writing does not include a Voice Match score.
Idiolect AI returns writing; sending or publishing it is a separate action in your host.

## Authentication, permissions, and privacy

Your host manages OAuth sign-in and token storage. Review the requested access on its consent screen.
This package sets no scope overrides, credentials, or OAuth client IDs; the host discovers connection settings.
The service uses your authenticated account for writing and Writing Profile operations.
Read-only profile inspection and profile changes are separate tools. The host controls tool approvals.
You can disconnect the server in the host. Account and Writing Profile controls are on the Idiolect AI website.

Writing requests and approved evidence are sent to Idiolect AI for processing.
Use your own authored writing for profile evidence. Do not upload AI or third-party writing as yours.
The skill fetches writing from other sources only when you ask and sends only the exact pieces you approve.
Your Writing Profile remains in Idiolect AI; the skill does not cache it in project files or host memory.
The package contains configuration, instructions, and brand assets; it runs no local server or hooks.
Hosted storage and processing follow the [privacy policy](https://idiolect.app/privacy) and
[terms](https://idiolect.app/terms). For help, use [support](https://idiolect.app/support)
or email [hello@idiolect.app](mailto:hello@idiolect.app).

## Compatibility and validation

Current documentation was checked on 13 October 2026. Format support is documented; authenticated behavior needs host testing.

| Host | Package | Validation status |
| --- | --- | --- |
| Claude Code | `.claude-plugin/`, `.mcp.json`, skill, commands | Strict plugin and marketplace validation passed on 2.1.281; OAuth and writing not exercised |
| Codex | Root Agent Plugins format and compatibility manifest | Artifact checks passed; CLI 0.160.1 and OAuth initiation reached live consent; callback, package install, and writing untested |
| Cursor | Root Agent Plugins format | Deterministic artifact checks passed; host install/OAuth untested |
| Gemini CLI | `gemini-extension.json`, shared skill | Deterministic artifact checks passed; host install/OAuth untested |

Run local checks with Node.js 20 or newer:

```sh
npm test
npm run validate
npm run lint
claude plugin validate .claude-plugin/plugin.json --strict
claude plugin validate . --strict
```

`lint` checks package invariants; no separate style linter or TypeScript build is configured.
The tests exercise packaging failures without a network connection or model calls.
See [submission preparation](docs/SUBMISSION.md) for sources, review steps, and remaining evidence.

## Upgrade from the legacy package

Remove the old stdio `idiolect` MCP entry before enabling the hosted connection, then sign in through OAuth.
This refresh removes the bundled Node server and scoring command. Previously published npm versions are unchanged.
It updates the plugin package only; it is not an npm server release.
