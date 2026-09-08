---
name: netsuite-query
description: Bounded and parameterized SuiteQL query design and schema verification.
license: MIT
---

# SuiteQL Queries

## Purpose
Write and test bounded, parameterized SuiteQL using verified fields and record permissions.

## When to use
Investigate data shape, implement a RESTlet query or diagnose field/type mismatches.

## Core workflow
- For this repository's custom record, inspect src/Objects/customrecord_nvs_hello.xml before inventing fields. The example reads id and name and excludes inactive records.
- For standard records, inspect Oracle metadata and the bundled record reference; validate account-specific schema only in an owner-authorized sandbox session.
- Use SELECT with explicit fields and a small TOP bound. Distinguish SuiteQL record type/status formats from N/record and N/search formats; do not transplant values across APIs.
- Bind name, date, status, ID and all other request values via params. Never concatenate or interpolate them into SQL. Keep identifiers fixed or selected from trusted generation configuration.
- Treat result aliases as lowercase. Normalize IDs and booleans before comparing or returning data.
- Preserve permission errors. Do not retry with a broader role or silently convert failures to an empty result.
- Inspect date/time behavior and metadata for the exact account and API. A date-only result is not a timestamp oracle.
- No production data or credentials are required for the template's tests. Do not run a live query merely because this skill is installed.

## Reference files
- [SuiteQL patterns](../netsuite-dev-guidelines/resources/suiteql-patterns.md)
- [Oracle field reference](../netsuite-suitescript-records-reference/SKILL.md)
- [Optional MCP setup](../netsuite-mcp-connector/SKILL.md)
