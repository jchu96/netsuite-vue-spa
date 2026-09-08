# Audit History Pattern

Separate optional diagnostic history from an audit trail required for correctness. Use immutable timestamped entries with an operation code and correlation reference. Keep identity/data fields to the minimum authorized scope. Bound and retain history deliberately. If a required audit write fails, surface that failure; do not declare success. Query parent IDs via params, never interpolation. Concurrent append-by-load/save requires a concurrency design before enabling writers.
