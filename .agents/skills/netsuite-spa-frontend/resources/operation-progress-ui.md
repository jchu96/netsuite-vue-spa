# Operation Progress Ui

Optional extension only: there is no bundled progress modal or worker. Show pending/running/completed/failed/unknown states from server-authoritative progress, with bounded polling and cancellation. Do not use a fixed delay as proof of database commit. Refresh only after verified completion and keep a timed-out operation visible as unknown until reconciled.
