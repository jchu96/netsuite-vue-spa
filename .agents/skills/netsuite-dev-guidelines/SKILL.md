---
name: netsuite-dev-guidelines
description: SuiteScript 2.1, SuiteQL binding, SDF and backend tests for this public template.
license: MIT
---

# NetSuite Development Guidelines

## Purpose
Build SuiteScript 2.1 applications with validated requests, bounded queries, explicit permissions and useful tests.

## When to use
Edit SuiteScripts, SDF objects, SuiteQL queries or backend tests.

## Core patterns
- Declare all N/* and local modules in one static AMD define block. Never use runtime require.
- Use @NApiVersion 2.1 and the exact @NScriptType. Name script IDs and deployments with _rl, _sl, _ue, _ss, _mr, _cs or _pt suffixes; stay within 40 characters.
- Validate the task, object shape, value types, ranges and authorization before calling N/query or N/record.
- Bind every request value through query.runSuiteQL({ query, params }); only trusted generator configuration may choose identifiers.
- Use bounded SELECT TOP queries; read mapped aliases in lowercase and explicitly normalize values for the frontend.
- Test missing, null, malformed, unauthorized and empty-result requests; a failed query is not an empty success.
- Use least-privilege record permissions. Keep Suitelets authenticated and execute as the current role. Never broaden audience to solve a permission error.
- Keep correlation references server-generated. Log an allowlisted operation and error code; exclude request headers, parameters, credentials, record contents and user PII.
- Prefer record.load/save for CLOBTEXT updates; use booleans for checkbox writes. Check API governance costs against Oracle's current reference.
- Custom record access and field IDs come from the project's XML. Standard fields and permission keys come from the vendored Oracle references.
- Verify the built HTML copy byte-for-byte, parse generated JS, and check SDF paths before the owner's sandbox validation.

## Reference files
- [SuiteQL](resources/suiteql-patterns.md)
- [RESTlet responses](resources/restlet-response-patterns.md)
- [Checkbox and date fields](resources/checkbox-date-fields.md)
- [CLOBTEXT](resources/clobtext-progress-tracking.md)
- [Audit history](resources/audit-history-pattern.md)
- [Governance and diagnostics](resources/debugging-governance.md)
- [Optional background work](resources/long-running-operations.md)
- [Oracle SAFE guide](../netsuite-sdf-safe-guide/SKILL.md)
- [Oracle fields](../netsuite-suitescript-records-reference/SKILL.md)
- [Oracle permission IDs](../netsuite-sdf-roles-and-permissions/SKILL.md)
- [Oracle security](../netsuite-owasp-secure-coding/SKILL.md)
