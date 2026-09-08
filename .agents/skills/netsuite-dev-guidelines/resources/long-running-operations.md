# Long Running Operations

Optional extension guidance, not an implemented template feature. Background work needs a real worker, a typed state machine, a stable operation ID, ownership checks, idempotency, bounded polling, retry limits and authoritative completion. A poll timeout means unknown outcome, not failed work. Do not add trigger/cache/mutation routes without access control and tests. Reference progress records and deployments by generated SDF IDs; avoid absent helper or scheduled-script assumptions.
