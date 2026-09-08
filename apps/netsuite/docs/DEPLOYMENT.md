# Owner-run sandbox deployment

Documented 2026-09-08. These steps require an owner's explicit account authorization and are **not** part of the account-free quickstart or automated acceptance. No live-account validation or deployment is claimed by this template.

## Prepare

1. Run `npm run setup` and `npm run check` from the repository root. Confirm the byte-verified HTML copy and structural receipt.
2. Install Oracle's [SuiteCloud CLI for Node.js](https://github.com/oracle/netsuite-suitecloud-sdk/tree/master/packages/node-cli) and its required Java runtime using Oracle's current prerequisites. This project was structurally tested with Node 22; the inspected owner CLI was 3.2.0 with Java SDK 2026.1.
3. Choose a **sandbox** and confirm Server SuiteScript and Custom Records are enabled. Use an authorized deployment role; do not put account configuration, `.nstba`, certificates or tokens in Git.
4. Review the [inventory](INVENTORY.md). This is an Account Customization Project with two scripts and a permission-list custom record, not a managed SuiteApp. It has no account-specific role dependencies.

## Validate and deploy

From `apps/netsuite`:

```bash
suitecloud account:setup
# Verify the selected sandbox identity before continuing.
suitecloud project:validate
# Optional additional account-side validation:
suitecloud project:validate --server
# Deploy only after reviewing successful validation and the target account:
suitecloud project:deploy
```

The tested CLI requires account context even for local `project:validate`. Local XML/JS structural checks do not replace this step: they cannot validate the complete SDF schema, installed features, permissions or actual NetSuite runtime behavior. `project.json` and authentication artifacts are ignored. The deployment hook runs the Jest suite before deploying.

## Configure the example

- Both deployments begin in **TESTING**. Test as the authorized script owner initially; an ordinary user's audience must be configured deliberately before release.
- Keep the Suitelet's anonymous access disabled (`isonline=F`) and its current-role execution. Do not add Administrator run-as or universal audiences.
- Grant the intended viewer role **View** on `customrecord_nvs_hello`, using the custom record's permission list. That custom record ID is the permission key, not a guessed standard permission. No role definition is shipped because user and role IDs belong to your account.
- Give a fixture maintainer enough permission to create one Hello Record named **Hello world**, then test lookup with the viewer role. Do not grant Create/Edit just to read it.
- If required by the account for the hosting role, the bundled permission reference identifies `LIST_FILECABINET` as Documents and Files; use **View**, not Create, for rendering. Confirm this requirement in the sandbox rather than granting it automatically.
- Obtain the internal Suitelet URL from its deployment. The Suitelet resolves the RESTlet path; no account hostname belongs in the production build.

## Optional local live development

Use a dedicated least-privilege TBA integration/role authorized for the RESTlet and Hello Record. Configure token-based authentication according to Oracle's current account requirements. The NetSuite UI's script and token roles must match the intended access scope; SDF deployment authentication and RESTlet TBA are separate mechanisms.

In the ignored `apps/vite-spa/.env`, set `NETSUITE_MODE=live`, supply the server-only `TBA_*` values, and set matching `NETSUITE_ACCOUNT` (hostname form) and `NETSUITE_ACCOUNT_REALM` (realm form). Update public `VITE_RESTLET_URL` if the generated IDs changed. Never paste real values into examples, tests, screenshots or issue bodies. Restart `npm run dev` and open the exact loopback browser URL.

## Verify and troubleshoot

| Check / symptom | Expected outcome / next step |
|---|---|
| Suitelet loads | HTML and resolved RESTlet meta tag appear; no browser TBA credentials |
| Hello world lookup | Returns the manually seeded synthetic row; no other data is touched |
| Missing name | Returns null, rendered as “No matching hello record” |
| Restricted role | Fails without broadening privileges or falling back to a more powerful role |
| Validation fails | Read the exact SDF error; local structural success is not account-side approval |
| Generic reference error | Match reference/code in script execution logs; do not enable raw request logging |
| Files appear stale after deployment | Compare deployed File Cabinet content to the built artifact; a completion message alone is insufficient |

Record the target sandbox, artifact/version, test role and observed result in your own deployment record. Production rollout is a separate decision after sandbox verification.
