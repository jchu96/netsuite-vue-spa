# Frontend agent instructions

## Commands
- Use npm with the committed lockfile; commands below run from the repository root.
- Proxy file tests: `npm test --prefix apps/vite-spa -- tests/proxy.test.mjs`.
- Typecheck: `npm run type-check --prefix apps/vite-spa`.
- Build and verify the SDF handoff: `npm run build`.
- If changing SDF configuration or templates: `npm run generate -- --force`.

## Boundaries
- Keep browser code in `src/` and `plugins/`; credential-bearing Node code belongs in `server/`.
- Preserve Origin/Host and per-run token checks before signing; use [the security model](../../README.md#security-model).
- Only `VITE_RESTLET_URL` and `VITE_API_SERVER_PORT` are public browser configuration.
- Preserve runtime response validation, cancellation and stale-response protection.
- Follow the [root agent instructions](../../AGENTS.md) and [frontend README](README.md).

## Commit attribution
- AI-authored commits include the agent's own `Co-Authored-By` attribution.
