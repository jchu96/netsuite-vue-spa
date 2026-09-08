# Agent Instructions

## Package manager and checks
- Use npm and the committed per-app package locks; see README.md for setup.
- Full account-free check: `npm run check` from the root.
- Frontend file: `npm test --prefix apps/vite-spa -- tests/proxy.test.mjs`.
- Backend file: `npm test --prefix apps/netsuite -- --runTestsByPath __tests__/generated-scripts.test.js`.
- Frontend typecheck: `npm run type-check --prefix apps/vite-spa`.
- SDF structural check after build: `npm run check:structure --prefix apps/netsuite`.

## Conventions and boundaries
- Edit `_templates/`, then `npm run generate -- --force`; generated source and tests must agree.
- PascalCase.vue components, camelCase.ts stores/types, useCamelCase.ts composables; relative imports.
- SuiteScript files end in _RL.js/_SL.js; lowercase object/deployment IDs end in _rl/_sl and stay within 40 characters.
- Use static AMD define, SuiteScript 2.1, strict task validation and SuiteQL params for every request value.
- Keep TBA credentials server-side. Only the two documented public VITE_ variables are allowed.
- Preserve loopback, Origin/Host and per-run proxy-token checks; rejected callers must never sign.
- Keep Suitelets authenticated, use the current role and explicit least-privilege permissions; no raw request/credential logs.
- Demo/build/tests require no account. Account setup, sandbox validation and deployment are separate owner actions.
- Keep skill copies as real directories with provenance/licenses; no private schemas, accounts or machine paths.

## Scoped guidance
- Frontend work: [apps/vite-spa/AGENTS.md](apps/vite-spa/AGENTS.md).
- SDF work: [apps/netsuite/AGENTS.md](apps/netsuite/AGENTS.md).
- NetSuite skill routing and application: [docs/SKILLS.md](docs/SKILLS.md).

## Commit attribution
- AI-authored commits include the agent's own `Co-Authored-By` attribution.
