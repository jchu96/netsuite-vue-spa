# SDF agent instructions

## Commands
- Use npm with the committed lockfile; commands below run from the repository root.
- Edit `_templates/` and `template.config.json`, then run `npm run generate -- --force`.
- Generated-script file tests: `npm test --prefix apps/netsuite -- --runTestsByPath __tests__/generated-scripts.test.js`.
- Build HTML before structural checks: `npm run build` (includes frontend typecheck).
- SDF structural check: `npm run check:structure --prefix apps/netsuite`.

## Boundaries
- Treat `src/` as generated output; keep templates and generated-source tests in agreement.
- Preserve static AMD, SuiteScript 2.1, strict request validation and bound SuiteQL values.
- Keep the Suitelet authenticated and execution in the current role with explicit least privilege.
- Keep logs limited to generated references and error codes; no raw requests or credentials.
- Account validation and deployment are owner actions; follow [the sandbox guide](docs/DEPLOYMENT.md).
- Follow the [root agent instructions](../../AGENTS.md) and [SDF README](README.md).

## Commit attribution
- AI-authored commits include the agent's own `Co-Authored-By` attribution.
