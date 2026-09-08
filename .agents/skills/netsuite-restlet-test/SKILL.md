---
name: netsuite-restlet-test
description: Test NetSuite RESTlet contracts and authorization using synthetic fixtures before authorized sandbox calls.
license: MIT
---

# RESTlet Testing

## Purpose
Exercise a RESTlet's request, authorization and response contracts with synthetic fixtures before a sandbox call.

## When to use
Add or change a RESTlet, investigate a rejected request, or verify the frontend contract.

## Core workflow
1. Read the generated script and its SDF object; list supported entry points and task keys.
2. Run npm test --prefix apps/netsuite -- --runTestsByPath __tests__/generated-scripts.test.js.
3. In a VM fixture, supply mocks for every static N/* dependency; assert the real entry point's effects and response.
4. Cover invalid inputs, missing identity, restricted records, missing data and internal failure. Check rejected input never reaches query/mutation APIs.
5. For SQL changes, plant interpolation in the template and rerun the generated-script test; require it to fail, then restore the source.
6. Only after the owner authorizes a sandbox call, set up a dedicated minimal role and authenticate outside Git. This template does not provide or discover credentials.
7. Prefer the included read-only helloRecord request. Unsupported methods and mutation tasks must remain rejected.
8. Report the target, scope and observed outcome; never print Authorization headers or secrets.

## Reference files
- [Request and response contract](../netsuite-dev-guidelines/resources/restlet-response-patterns.md)
- [Connector conduct](../netsuite-ai-connector-instructions/SKILL.md)
