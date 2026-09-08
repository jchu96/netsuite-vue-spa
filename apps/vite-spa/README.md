# Vue frontend

Start with the [root quickstart](../../README.md). Use npm; the lockfile is committed.

- `npm run dev`: Vue dev server plus loopback-only proxy; demo mode is the default.
- `npm run build`: TypeScript check, single-file build, exact-byte SDF handoff.
- `npm test`: Vitest caller-boundary, transport, store, component and round-trip tests.
- `npm test -- tests/proxy.test.mjs`: focused caller-boundary tests.

The entrypoint installs Pinia and PrimeVue. Components import PrimeVue locally and styles stay under `#nvs-app`. The API client uses a typed injection key and validates responses. Credential-bearing Node code is under `server/` and is never imported by browser code.
