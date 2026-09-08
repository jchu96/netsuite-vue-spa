# Acceptance mutations

These plants exercise the public-template assessment's executable obligations. They are verification fixtures, not another text-scanning gate.

| Obligation | Mutation | Expected failing test |
|---|---|---|
| Caller rejection precedes signing | Remove the proxy Origin comparison | unexpected Origin never signs |
| Every query value remains data | Replace the hello-record name placeholder with string concatenation; remove that parameter | generated RESTlet binds request values |
| No secret enters browser configuration | Remove the VITE_ allowlist | rejects unknown VITE_ variables |
| Build handoff copies real bytes | Omit artifact copy or accept missing output | exact artifact copy / missing output |
| Errors never reveal request context | Include the thrown exception in the response/log | sanitized RESTlet failure / sanitized Suitelet failure |
