---
name: netsuite-error-triage
description: Classify NetSuite script errors into an actionable evidence-based triage map.
license: MIT
---

# NetSuite Error Triage

## Purpose
Turn error signatures into an actionable map without silently fixing or dismissing them.

## When to use
Diagnose a script failure or plan remediation from an owner-provided execution-log sample.

## Core workflow
1. Establish the observation window and actual retention. Requested days do not prove retained days.
2. Group by script, stable error code and first relevant stack frame. Compare failures with successes in the same window.
3. Assign one bucket: diagnostic noise; expected validation outcome; duplicated symptoms of one cause; application bug; vendor/platform/permission issue.
4. Separate intermittent failure from deterministic failure. A deployment record proves configuration, not execution or correct output.
5. Report counts, impact, evidence and the next smallest fix. Redact raw request data and credentials from the map.
6. Code changes, permission changes and resolving external issues are separate authorized work. Never bulk-update an empty or unverified issue set.
7. Use a correlation reference to match the application's generic error to its allowlisted server log. In this template the only stored details are reference and code.

## Reference files
- [Logging and governance](../netsuite-dev-guidelines/resources/debugging-governance.md)
- [Oracle security reference](../netsuite-owasp-secure-coding/SKILL.md)
