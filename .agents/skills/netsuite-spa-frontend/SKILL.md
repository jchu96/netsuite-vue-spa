---
name: netsuite-spa-frontend
description: Vue 3, TypeScript, PrimeVue and Pinia patterns for NetSuite SPAs.
license: MIT
---

# NetSuite SPA Frontend Guidelines

## Purpose
Vue 3, TypeScript, Pinia and PrimeVue conventions for an authenticated NetSuite SPA.

## When to use
Build Vue components, composables, stores, typed API clients and asynchronous UI states.

## Core patterns
- Use <script setup lang="ts">, explicit props/emits and relative imports.
- Install Pinia and PrimeVue before mounting. Import PrimeVue components locally, not globally.
- Use a typed InjectionKey for API dependencies; never use window globals or an untyped app singleton.
- Validate response envelopes at runtime and check HTTP status. Network failures and empty data are distinct outcomes.
- Stores own state and expose loading/error/result. Components own user feedback. Keep buttons disabled and visibly loading during work.
- Abort requests on unmount or replacement and discard stale results. A timeout does not prove a server mutation failed.
- Keep all styles under the SPA mount selector; do not override NetSuite's body, tables or links globally.
- Never put credentials into VITE_ variables, localStorage or browser code. This template's two VITE_ variables are public routing metadata only.
- Use backend-provided same-account endpoints in production; the local dev proxy is a separate development boundary.

## Reference files
- [Vue component patterns](resources/vue-component-patterns.md)
- [Composable patterns](resources/composable-patterns.md)
- [Computed patterns](resources/computed-patterns.md)
- [Pinia store patterns](resources/pinia-store-patterns.md)
- [Api error handling](resources/api-error-handling.md)
- [File naming conventions](resources/file-naming-conventions.md)
- [Operation progress ui](resources/operation-progress-ui.md)
- [Datetime patterns](resources/datetime-patterns.md)
- [Localstorage caching](resources/localstorage-caching.md)
- [Primevue local imports](resources/primevue-local-imports.md)
- [Relative import paths](resources/relative-import-paths.md)
- [Typescript strict patterns](resources/typescript-strict-patterns.md)
