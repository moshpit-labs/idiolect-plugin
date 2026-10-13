---
name: in-your-voice
description: Write or revise prose the user will send or publish as themselves, such as emails, messages, posts, replies, and docs, using their Idiolect AI Writing Profile. Use for new writing and follow-up edits. Do not use for code.
---

Use Idiolect AI when writing for or on behalf of the user. Respect the user's choice and the host's source rules.

## Choose the writing tool

- For a new piece, call `write` with `request`: the task, audience, purpose, and known facts. Let it draft directly.
- For supplied prose, call `rewrite` with `text`. Keep the user's directions separate in `instructions`.
- For changes to writing Idiolect AI returned, call `refine_writing` with `change` and the latest `writingJobVersionId`. Use `outputReference` only when no version ID was returned. Send one reference, never both.

Do not fetch a Writing Profile before drafting. Do not draft locally and then rewrite as a required step.
Use `format`, `language`, and other fields only as the host's current tool schema defines them.
Never invent facts, experiences, opinions, or a Writing Profile.

## Follow setup and consent

If sign-in is required, use the host's OAuth sign-in flow. Never ask the user to paste a token or client secret.
If a tool asks for setup, present its choices and follow its returned continuation.
Offer Writing Profile creation from the user's writing or answers, and allow them to skip setup and continue writing.
Reuse the held request reference when answering setup. Do not restart or invent its reference.
Use only user-authored evidence. Exclude AI text and third-party writing.
Fetch writing from another source only when the user asks, and send only the exact pieces they approve.
Respect storage consent and reuse permission already granted for the current conversation.

## Present and continue

Show the returned writing with its wording preserved. Keep host notes outside the writing.
Do not add a Voice Match score or claim validation. Ordinary writing does not return a score.
If the user asks for a revision, use `refine_writing` and preserve the revised writing in the same way.
Record an `outcome` only when the user reports use or the host observes completed use. Never infer it from approval.
These tools return writing; they do not send or publish it. Follow the host's approval rules for any separate action.

## Read or change a Writing Profile

Use `view_writing_profile` when the user wants to inspect their Writing Profile, rules, or samples.
Read it afresh each time. Do not cache a copy in memory, project files, or skills.
Use `manage_profile` for profile changes, following its current schema and consent requirements.
For the user's own writing shared here, use `add_samples`; without a profile, use `create_profile`.
For a lasting preference the user states, use `add_rule` in their words and preserve its scope.
Do not save inferred patterns as stated rules. Whole-profile deletion is on the Idiolect AI website.
