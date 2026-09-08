---
name: netsuite-mcp-connector
description: Optional owner-authorized NetSuite MCP connection with least privilege and protected credentials.
license: MIT
---

# NetSuite MCP Connector

## Purpose
Connect an owner-authorized MCP client to NetSuite with explicit identity, permission and credential boundaries.

## When to use
An owner requests a live NetSuite AI Connector session. MCP is optional and is not needed to build or test this template.

## Core workflow
1. Confirm the target account, user, role, scope and authorization before connecting. Let the owner complete authentication.
2. Consult current Oracle documentation for the NetSuite AI Connector Service prerequisites, supported OAuth flow and registered redirect URI. Client support varies; never weaken TLS to work around callback errors.
3. Use the account-specific endpoint https://<account-host>.suitetalk.api.netsuite.com/services/mcp/v1/all. Obtain the host from account information; never reuse another deployment's host or token.
4. Keep credentials in the client's approved credential store or environment references. Do not commit literal Authorization headers or persist authentication inside this repository.
5. Scope the connector to the project and start read-only with a dedicated least-privilege role. Deny create/update tools in the client when the session is read-only.
6. Inspect the actual discovered tool schemas; a connected transport does not prove every tool or permission is available.
7. Follow the Oracle connector skill for report/search/record/query selection, metadata discovery and explicit mutation authorization. Keep queries bounded and log only sanitized scope/outcome receipts.
8. If credentials belong to another user, record their explicit authorization and the fact that activity is attributed to them; never turn temporary access into implicit permanent access.

## Reference files
- [Oracle connector instructions](../netsuite-ai-connector-instructions/SKILL.md)
- [Oracle permissions](../netsuite-sdf-roles-and-permissions/SKILL.md)
- [Query workflow](../netsuite-query/SKILL.md)
