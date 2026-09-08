# Datetime Patterns

Choose date-only versus timestamp types deliberately. Display account-local dates without unintended timezone conversion. Keep UTC instants distinct from date-only strings; parse and validate at boundaries. Name timezone and locale in APIs or docs where they affect meaning.
