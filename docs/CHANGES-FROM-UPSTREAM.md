# Changes from upstream

## Origin

This template derives from
[BibekStha/netsuite-vue-vite-spa at commit `4fe7a9a010d8f9b8ff405b0c5c9139821ddecefa`](https://github.com/BibekStha/netsuite-vue-vite-spa/tree/4fe7a9a010d8f9b8ff405b0c5c9139821ddecefa).
It retains the upstream MIT notice and has independent Git history.
This repository is not a GitHub fork of upstream.

The comparison maps upstream root paths to `apps/vite-spa/` here.
It covers the pinned upstream tree and this template's tracked source files;
installed packages, local configuration and generated HTML are excluded.
Upstream has 22 files. Of those paths, one is unchanged, eight have changed
in place and thirteen are absent, including files replaced at new paths below.
The current frontend has 28 tracked files. Only the license is byte-identical;
the former server files and starter images are not retained.

The architectural starting point remains Vue, Vite, a single HTML build,
a local RESTlet proxy and a Suitelet-hosted page. Shared architecture does
not imply unchanged implementation.

## Kept byte-for-byte

These SHA-1 values are Git blob object IDs, not bare file checksums.
Each row matches the corresponding path in the pinned upstream tree.

| Path | SHA-1 | Purpose |
|---|---|---|
| `apps/vite-spa/LICENSE` | `e7c33e260399cc3a68c4e1e03419e56718cff843` | Original MIT license and upstream copyright notice. |

Run the offline verifier from the repository root with Node and Git installed:

```bash
node scripts/verify-upstream-kept.mjs
git hash-object --no-filters apps/vite-spa/LICENSE
```

The verifier reads this table and invokes `git hash-object --no-filters` for
each local file. It prints `OK` or `MISMATCH` per row and exits nonzero on a
mismatch, missing file, malformed table or empty inventory. It makes no network
requests. An optional document path lets you check a scratch copy:

```bash
node scripts/verify-upstream-kept.mjs path/to/scratch-copy.md
```

An `OK` proves local bytes match the documented object ID. To independently
check upstream attribution, compare the table with the blob IDs returned by
the [pinned public tree API](https://api.github.com/repos/BibekStha/netsuite-vue-vite-spa/git/trees/4fe7a9a010d8f9b8ff405b0c5c9139821ddecefa?recursive=1).
Do not update a stated hash merely to make a modified file pass; move that
file to Changed if it no longer matches upstream.

## Changed

Paths below are local. Arrows identify replacements for upstream files;
they do not assert Git rename ancestry. Grouped rows describe related edits.

| Path | What changed | Why / behavior reference |
|---|---|---|
| `apps/vite-spa/.env.example` | Added default demo mode, visibly synthetic credential placeholders and named RESTlet script/deployment IDs. | Allow startup without an account and separate public routing from server credentials; [quickstart](../README.md#try-it-in-five-minutes) and [security model](../README.md#security-model). |
| `apps/vite-spa/.gitignore` | Broadened the single `.env` exclusion to `*.env` and added an environment-file exclusion for build tooling. | Keep local environment material out of source control; [security model](../README.md#security-model). |
| `apps/vite-spa/README.md` | Replaced the upstream setup guide and inline script examples with a frontend command reference and links to the root guide. | Centralize account-free setup and owner-run deployment instructions; [frontend README](../apps/vite-spa/README.md). |
| `apps/vite-spa/package.json` | Updated Vue/Vite and supporting dependencies; added TypeScript, Pinia, PrimeVue and tests; build now typechecks and copies HTML into SDF. | Provide typed UI state and a verified build handoff; [frontend README](../apps/vite-spa/README.md) and [quickstart checks](../README.md#try-it-in-five-minutes). |
| `apps/vite-spa/index.html` | Replaced starter title, favicon link, `#app` mount and JavaScript entry with the Hello Record title, `#nvs-app`, TypeScript entry and `NETSUITE_CONFIG` slot. | Let the hosting Suitelet inject the resolved RESTlet path; [Hosting Suitelet](../apps/netsuite/docs/API.md#hosting-suitelet). |
| `apps/vite-spa/src/App.vue`, `src/components/HelloWorld.vue` | Replaced the counter and on-mount `fetchItemRec` example with a typed, user-submitted Hello Record form and explicit loading/error/empty/result states. | Demonstrate one bounded read-only interaction; [architecture](../apps/netsuite/docs/ARCHITECTURE.md) and [RESTlet contract](../apps/netsuite/docs/API.md#read-only-restlet). |
| `apps/vite-spa/src/assets/index.css` | Replaced Tailwind directives with styles scoped under `#nvs-app`. | Contain page styling within the mounted application; [frontend README](../apps/vite-spa/README.md). |
| `apps/vite-spa/src/main.js` → `src/main.ts` | Added Pinia, unstyled PrimeVue, typed API injection and runtime RESTlet metadata lookup. | Connect shared state and the hosted endpoint without browser credentials; [architecture](../apps/netsuite/docs/ARCHITECTURE.md). |
| `apps/vite-spa/plugins/netsuite-api.js` → `plugins/netsuite-api.ts` | Replaced the generic raw-fetch plugin with a typed `helloRecord` client, response checks, abort support and a local session token. | Enforce the example contract in both local and hosted modes; [API](../apps/netsuite/docs/API.md). |
| `apps/vite-spa/vite.config.js` → `vite.config.ts` | Kept single-file output; added public environment validation, fixed loopback serving and an ES2022 target. | Bound development access and reject unsupported browser environment keys; [security model](../README.md#security-model). |
| `apps/vite-spa/server/index.js`, `server/util/*` → `server/index.cjs`, `config.cjs`, `oauth.cjs` | Replaced permissive CORS and general forwarding with Origin/Host/token checks, one validated task, demo mode, bounded live requests and Node HMAC-SHA256 signing. | Reject callers before signing and keep TBA credentials server-side; [security model](../README.md#security-model) and [local proxy contract](../apps/netsuite/docs/API.md#local-proxy). |

## Added

Upstream supplies backend snippets in its README, but no SDF project or tests.
These additions make that deployment boundary and the example contract explicit.

| Area | Paths | Added behavior and reference |
|---|---|---|
| SDF project and generator | `apps/netsuite/_templates/`, `apps/netsuite/src/`, `scripts/generate.mjs`, `template.config.json` | Validated generation of two SuiteScript 2.1 scripts, three objects, manifest and deploy XML. The authenticated Suitelet hosts HTML; the current-role RESTlet binds an exact-name query. See [Make it yours](../README.md#make-it-yours) and [inventory](../apps/netsuite/docs/INVENTORY.md). |
| Build handoff | `apps/vite-spa/scripts/copy-to-sdf.mjs` | Copies built HTML into the configured SDF folder and verifies identical bytes; [frontend README](../apps/vite-spa/README.md). |
| Dev proxy | `apps/vite-spa/server/config.cjs`, `index.cjs`, `oauth.cjs` | New implementations of the upstream development role, with a synthetic default and optional authorized live mode; [local proxy](../apps/netsuite/docs/API.md#local-proxy). |
| Frontend state and typing | `apps/vite-spa/src/stores/helloStore.ts`, `tsconfig.json`, `tsconfig.node.json` | Cancellable lookup state and stale-response protection; [architecture](../apps/netsuite/docs/ARCHITECTURE.md). |
| Tests and checks | `apps/vite-spa/tests/`, `vitest.config.ts`, `apps/netsuite/__tests__/`, `jest.config.js`, `scripts/validate-structure.cjs` under `apps/netsuite/` | Proxy, signing, API, store, component, round-trip, generator and SDF structural checks. Root `npm run check` builds and runs the account-free suite; [quickstart](../README.md#try-it-in-five-minutes). |
| Package setup | Root `package.json`, both app `package-lock.json` files, `apps/netsuite/package.json` | npm setup, build, test and generation commands with committed dependency locks; [quickstart](../README.md#try-it-in-five-minutes). |
| Docs | Root `README.md`, `apps/netsuite/README.md`, `apps/netsuite/docs/`, `docs/SKILLS.md`, this page | Architecture, API, query, inventory, learning and owner-run sandbox instructions; [Move to a sandbox](../README.md#move-to-a-sandbox). |
| Skills | `.agents/skills/`, `AGENTS.md` | Fourteen portable guidance directories with individual provenance and licenses; [application map](SKILLS.md). |
| Attribution verifier | `scripts/verify-upstream-kept.mjs` | Offline comparison of this page's kept table with local Git blob hashes; [Kept byte-for-byte](#kept-byte-for-byte). |

Local structural checks do not establish account permissions, runtime behavior
or successful deployment. The [sandbox guide](../apps/netsuite/docs/DEPLOYMENT.md)
keeps those verification steps with the account owner.

## Removed

This inventory describes absences relative to pinned upstream, not later
intermediate versions of this derivative. Paths are relative to `apps/vite-spa/`.

| Upstream path / feature | Reason and replacement |
|---|---|
| `server/util/cryptojs.js`, `server/util/oauth.js` | Bundled signing implementation replaced by built-in Node crypto in `server/oauth.cjs`; historical notice remains in [third-party notices](../THIRD_PARTY_NOTICES.md#historical-cryptojs-v312). |
| `server/util/ApiService.js`, `server/util/credentials.js`, `server/index.js` | General forwarding and separate credential helpers replaced by the three `.cjs` proxy modules and their validated server-only configuration. |
| `plugins/netsuite-api.js`, `src/main.js`, `vite.config.js` | Replaced with TypeScript implementations listed under Changed. |
| `tailwind.config.js`, `postcss.config.js` | Tailwind/PostCSS setup removed; the current example uses local PrimeVue components and mount-scoped CSS. |
| `public/favicon.ico`, `src/assets/logo.png` | Starter image assets omitted; the Hello Record page does not reference them. |
| `yarn.lock` | Replaced by npm locks and the documented npm setup command. |
| Starter counter and `fetchItemRec` request | Replaced by the submitted Hello Record lookup. Upstream's example request was not a complete record query implementation. |
| Manual copy/paste backend setup in the frontend README | Replaced by generated SDF files and the sandbox guide; the single HTML build approach remains. |

## Licensing

The original MIT copyright and permission text remain byte-for-byte in
[apps/vite-spa/LICENSE](../apps/vite-spa/LICENSE) and are reproduced in
[third-party notices](../THIRD_PARTY_NOTICES.md#netsuite-vuevite-spa).
Project code and six public house-skill editions use the [root MIT license](../LICENSE).
The other eight bundled skills retain UPL 1.0 and their own provenance and
copyright notices; the root MIT license does not replace those terms.
CryptoJS source is no longer bundled; its historical notice remains for attribution.
Dependencies installed by npm retain the licenses distributed with their packages.
