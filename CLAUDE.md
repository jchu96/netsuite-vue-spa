# NetSuite SPA Boilerplate

A personal template for scaffolding NetSuite SuiteScript applications with Vue 3 + Vite single-page application frontends.

## Structure

```
apps/
├── netsuite/              # NetSuite SDF project
│   ├── _templates/        # Reusable script templates
│   └── .cursor/rules/     # NetSuite development patterns
└── vite-spa/              # Vue 3 + Vite frontend
    ├── src/               # Vue components, stores, types
    ├── plugins/           # NetSuite API integration
    ├── server/            # Local dev proxy server
    └── .cursor/rules/     # Vue/TypeScript patterns
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | SuiteScript 2.1, SDF, SuiteQL |
| Frontend | Vue 3.5+, TypeScript 5.9+, Vite 6+ |
| UI | PrimeVue 4.x, TailwindCSS |
| State | Pinia 3.x |

## Template Placeholders

When modifying templates, always use these placeholder variables:

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{PREFIX}` | `dp`, `ob` | 2-4 letter lowercase project prefix |
| `{PREFIX_OP}` | `dop`, `obop` | Operation progress field prefix |
| `{PROJECT_NAME}` | `DirectPay` | PascalCase project name |
| `{PROJECT_NAME_DISPLAY}` | `Direct Pay` | Human-readable name |
| `{PROJECT_FOLDER}` | `com.example.myproject` | SuiteScripts folder name |
| `{PARENT_RECORD_TYPE}` | `customrecord_dp_project` | Main record type |

## Conventions

### General
- **Keep it generic** - No project-specific code; this is a reusable boilerplate
- **Template files** use `.template` extension and contain placeholder variables
- **Sample files** in `Documentation/Sample Files/` show real implementations

### Cursor Rules (MDC Format)
Rules in `.cursor/rules/` directories follow MDC structure:
- Use frontmatter for metadata where applicable
- Clear section headers with examples
- Pattern-focused with do/don't guidance
- Open to better formatting approaches

### NetSuite Patterns
- SuiteScript 2.1 with AMD modules
- Long-running operations use progress tracking custom records
- RESTlets follow task-based routing pattern
- SuiteQL for database queries (not search API)

### Vue SPA Patterns
- Composition API with `<script setup>` syntax
- TypeScript strict mode
- PrimeVue components with local imports
- Pinia stores with proper initialization

## Common Tasks

| Task | Command/Location |
|------|------------------|
| Add new script template | `apps/netsuite/_templates/scripts/` |
| Add new cursor rule | `apps/{app}/.cursor/rules/` |
| Update Vue SPA patterns | `apps/vite-spa/.cursor/rules/` |
| Run dev server | `cd apps/vite-spa && yarn dev` |
| Build for production | `cd apps/vite-spa && yarn build` |

## Key Files

| File | Purpose |
|------|---------|
| `apps/netsuite/_templates/README.md` | Template usage guide |
| `apps/netsuite/_templates/TEMPLATE_VARIABLES.md` | Complete placeholder reference |
| `apps/vite-spa/plugins/netsuite-api.ts` | NetSuite API integration plugin |
| `apps/vite-spa/src/types/netsuite-api.d.ts` | TypeScript definitions |

## Don't
- Add project-specific code to templates
- Hardcode NetSuite account IDs or credentials
- Skip placeholder variables in template files
- Commit `.env` files with real credentials
