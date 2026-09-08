# Hello Record SDF project

Generated documentation · 2026-09-08 · package version 1.0.0 · SuiteScript 2.1

This Account Customization Project hosts the Vue frontend and exposes one read-only RESTlet lookup. It creates a dedicated **Hello Record** custom record type and an unassigned viewer role with View permission; it does not read or modify transaction records. A synthetic local proxy response lets the frontend run before an account is available.

## Source ownership

Edit [the templates](_templates/README.md) and [root configuration](../../template.config.json), then regenerate from the repository root. Generated files live in `src/`; the HTML build artifact is copied separately and is ignored by Git. No SuiteApp publisher ID, account ID, auth profile or external-account dependency is embedded.

The manifest requires `SERVERSIDESCRIPTING` and `CUSTOMRECORDS`. There are no scheduled workers, custom field dependencies, saved searches, `N/llm` integrations or server-side external HTTP calls. Optional local development TBA is outside this SDF project.

## Checks

```bash
# From repository root, after npm run setup:
npm run check
# Focus on the generated-script tests:
npm test --prefix apps/netsuite -- --runTestsByPath __tests__/generated-scripts.test.js
```

The check builds HTML first, then verifies generated-source parity, XML structure, real deploy paths, scriptfile references and JS parseability. Jest executes the actual generated entrypoints against N/* fixtures. These checks do not emulate NetSuite's complete SDF schema, account permissions or execution engine.

**The owner separately runs `suitecloud project:validate` in a sandbox account context.** No account setup or deployment runs as part of the quickstart, tests or structural checker.

## Project guide

- [Script and object inventory](docs/INVENTORY.md)
- [Architecture and data flow](docs/ARCHITECTURE.md)
- [API and complete SuiteQL query](docs/API.md)
- [Sandbox deployment and troubleshooting](docs/DEPLOYMENT.md)
- [Code walkthrough and migration notes](docs/LEARNING.md)
- [Change history](docs/CHANGELOG.md)
