# Pinia Store Patterns

Install createPinia before mounting and call the store composable before use. Stores own typed data, loading/error state and asynchronous actions; components own notifications. Use try/catch/finally, abort obsolete requests and prevent old responses from overwriting current data. Never put credentials into a store.
