---
name: netsuite-sdf-safe-guide
description: Comprehensive NetSuite SDF best practices based on the SAFE Guide (12 principles + appendices). Generates Object XML for all 14 script types, enforces governance limits, security patterns, and defensive coding. Includes N/cache, N/query, concurrency limits, OAuth 2.0 guidance, legacy TBA guardrails, CustomTool runtime patterns, REST Web Services (2026.1 features), and 140+ documented pitfalls. Essential for SuiteApp and Account Customization development.
license: The Universal Permissive License (UPL), Version 1.0
metadata:
  author: Oracle NetSuite
  version: "1.0"
---

# netsuite-sdf-safe-guide

## Purpose

Use Oracle NetSuite guidance from the complete [upstream skill](UPSTREAM_SKILL.md).

## When to use

Apply this skill for the subject described above; read the upstream workflow and its relevant references before acting.

## Core workflow

- Start at [UPSTREAM_SKILL.md](UPSTREAM_SKILL.md), then follow its topic-specific reference links.
- Scope all actions to the user request; example account access and deployment steps are not pre-authorized.
- In this template, build, tests and structural validation run without an account. Sandbox validation belongs to the owner.

## Reference files

- [Complete Oracle instructions](UPSTREAM_SKILL.md)
- [Provenance and local adjustments](PROVENANCE.md)
- [UPL 1.0 license](LICENSE)
