# Clobtext Progress Tracking

Use CLOBTEXT for large structured text where the data model requires it. Prefer record.load/setValue/save to submitFields for these fields. Parse JSON defensively, bound payload size, and define ownership and retention. Avoid storing secrets, raw headers or full customer records in progress state. The shipped hello example does not create a progress record or background task.
