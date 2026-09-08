# NetSuite guidance applied to this template

The fourteen included skills are real directories with a `PROVENANCE.md` and license in each. Six are sanitized public editions of author-owned guidance (MIT); eight are re-vendored from Oracle's pinned SuiteCloud SDK (UPL 1.0). Long Oracle documents retain their full text in `UPSTREAM_SKILL.md` behind an entrypoint under 500 lines. Reusable Cursor topics were consolidated into the house-skill resources and the duplicate rule directories were removed.

| Skill | Applied result |
|---|---|
| netsuite-dev-guidelines | Static AMD, SuiteScript 2.1, bound SuiteQL, normalized IDs, generic logging and generated-script tests |
| netsuite-spa-frontend | Typed injection, local PrimeVue imports, Pinia installation, cancellable state and mount-scoped CSS |
| netsuite-restlet-test | Invalid/missing identity/input fixtures, query binding and error-envelope assertions; no live calls |
| netsuite-query | Explicit bounded columns, lowercase result fields, bound name/inactive values; custom schema sourced from XML |
| netsuite-error-triage | Generic error/reference contract and troubleshooting that preserves errors rather than reporting false empty success |
| netsuite-mcp-connector | Optional owner-authorized setup with no embedded account or authentication; not required for the template |
| netsuite-suitescript-records-reference | Field-source distinction: standard metadata is supplemental; the custom Hello Record XML owns this example |
| netsuite-sdf-safe-guide | Explicit manifest features, real scriptfile paths, authenticated Suitelet, TESTING deployments and separate sandbox verification |
| netsuite-owasp-secure-coding | Origin/Host/token boundary, bound SQL, generic errors, attribute escaping and negative tests |
| netsuite-sdf-roles-and-permissions | Permission-list custom record, View-only reader guidance, current-role execution and no universal audience |
| netsuite-sdf-project-documentation | SDF README, inventory, complete query/API, diagrams, deployment guide and troubleshooting |
| netsuite-suitescript-upgrade | Confirmed both entrypoints already use 2.1; no legacy API migration needed; documented runtime limit |
| netsuite-suitescript-learning | Guided RESTlet/Suitelet walkthrough, key concepts, pitfalls and comprehension checks |
| netsuite-ai-connector-instructions | Metadata and bounded-query conduct for future authorized connector sessions; no live tool use inferred from installation |

[AGENTS.md](../AGENTS.md) routes all fourteen skills by task. The root and SDF READMEs remain the project-specific command and deployment contract; generic vendor examples do not authorize account actions or override the offline scope.

Excluded material includes organization-specific adapters, finance-analysis guidance and Oracle UIF frontend guidance. This application uses Vue/PrimeVue and no financial records or UIF runtime. Required open-source copyright attributions are retained; private account/person context and executable credential-discovery helpers are omitted.
