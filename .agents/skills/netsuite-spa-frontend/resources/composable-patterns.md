# Composable Patterns

Expose typed refs and methods from useCamelCase composables. Accept reactive inputs deliberately, clean up watchers/listeners/polling on unmount, cancel pending requests and ignore stale results. Keep pure helpers outside reactive orchestration. Inject the API client through a typed key rather than global mutable state.
