# API

Default identities · documented 2026-09-08

## Hosting Suitelet

`GET /app/site/hosting/scriptlet.nl?script=customscript_nvs_hello_sl&deploy=customdeploy_nvs_hello_sl`

Requires a NetSuite session and an allowed deployment audience. Other methods or missing identity return “Access denied”. The script reads the HTML build from File Cabinet, escapes the resolved RESTlet URL for an HTML attribute, and replaces the `NETSUITE_CONFIG` slot. It never serializes incoming headers or parameters into HTML or logs.

## Read-only RESTlet

`POST /app/site/hosting/restlet.nl?script=customscript_nvs_hello_rl&deploy=customdeploy_nvs_hello_rl`

```json
{ "task": "helloRecord", "name": "Hello world" }
```

Exactly these two keys are accepted. `name` must be a string of 1–80 characters with non-whitespace content. The name is matched exactly; it is not trimmed or treated as SQL. No GET, PUT, DELETE, record mutation, operation progress or cache task is exported.

```json
{ "success": true, "data": { "id": "1", "name": "Hello world" } }
```

The ID above is synthetic. No active matching row yields `{ "success": true, "data": null }`. Error envelopes contain `success: false` and `{ code, message, reference }` under `error`. Codes are `ACCESS_DENIED`, `INVALID_REQUEST` and `INTERNAL_ERROR`. Clients must check both the HTTP status and envelope; a NetSuite entrypoint can return a failure envelope within a successful HTTP response.

## Complete query

```sql
SELECT TOP 1 id, name
FROM customrecord_nvs_hello
WHERE name = ? AND isinactive = ?
ORDER BY id
```

Parameters are `[body.name, 'F']`. `metaDataProvider: 'SUITE_QL'` preserves role/metadata failures. Only the trusted generator controls the record identifier. The test sends a quote/SQL-like name and verifies that it remains in `params`, never in the query string. Legacy status/date/id/operation routes were removed rather than exposed without a working contract.

## Local proxy

Only `http://127.0.0.1:5173` is an accepted browser Origin. The proxy Host must match its loopback address and configured port.

| Route | Contract |
|---|---|
| `POST /session` | Expected Origin/Host required; returns ephemeral `{ token, mode }`; no-store |
| `POST /api` | Expected Origin/Host, JSON and `X-Proxy-Token` required; accepts the same helloRecord request |
| `OPTIONS` for either route | Restricted preflight for POST, Content-Type and X-Proxy-Token |

Demo adds `mode: "demo"` and returns a synthetic name/id without account access. Live proxy failures return HTTP 502 and a generic message. Malformed input is 400, rejected callers are 403, oversized bodies are 413 and unsupported routes are 404. The browser token is not a NetSuite credential and cannot defend against other local processes that can impersonate a browser.
