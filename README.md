# NetSuite Vue SPA Boilerplate

A production-ready template for building NetSuite SuiteScript applications with Vue 3 + Vite single-page application frontends.

## Features

- **NetSuite Backend** - SDF project structure with SuiteScript 2.1 RESTlets, Suitelets, and Scheduled Scripts
- **Vue 3 + Vite Frontend** - Modern SPA with TypeScript, hot module replacement, and single-file build output
- **PrimeVue UI** - Professional UI components with Tailwind CSS styling
- **Pinia State Management** - Type-safe stores with DevTools support
- **Long-Running Operations** - Built-in pattern for async operations with progress tracking
- **Template System** - Reusable templates with placeholder variables for quick project scaffolding
- **Cursor Rules** - Comprehensive AI-assisted development patterns for both backend and frontend

## Repository Structure

```
├── apps/
│   ├── netsuite/                    # NetSuite SDF Project
│   │   ├── src/
│   │   │   └── FileCabinet/
│   │   │       └── SuiteScripts/
│   │   │           └── com.example.{project}/
│   │   │               ├── app/     # Built SPA files
│   │   │               └── lib/     # Shared SuiteScript modules
│   │   ├── _templates/              # Reusable script templates
│   │   └── .cursor/rules/           # NetSuite development patterns
│   │
│   └── vite-spa/                    # Vue 3 + Vite SPA
│       ├── src/
│       │   ├── components/          # Vue components
│       │   ├── stores/              # Pinia stores
│       │   ├── types/               # TypeScript definitions
│       │   └── views/               # Page components
│       ├── plugins/                 # Vue plugins (NetSuite API)
│       ├── server/                  # Local dev proxy server
│       └── .cursor/rules/           # Vue/TypeScript patterns
│
└── netsuite-vue-spa.code-workspace  # VS Code workspace
```

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **NetSuite Account** with SuiteCloud Development Framework (SDF) enabled
- **Token-Based Authentication (TBA)** credentials configured in NetSuite
- **SuiteCloud CLI** - Install globally:
  ```bash
  npm install -g @oracle/suitecloud-cli
  ```
- **Yarn** (optional, npm works too)

## Quick Start

### 1. Clone or Scaffold the Repository

```bash
# Clone this template
git clone <repository-url> my-netsuite-project
cd my-netsuite-project
```

### 2. Set Up the Vite SPA

```bash
cd apps/vite-spa

# Install dependencies
yarn install
# or: npm install

# Copy environment template
cp sb2.env .env

# Edit .env with your NetSuite credentials:
# - VITE_NS_ACCOUNT_ID
# - VITE_NS_CONSUMER_KEY
# - VITE_NS_CONSUMER_SECRET
# - VITE_NS_TOKEN_ID
# - VITE_NS_TOKEN_SECRET
# - VITE_NS_RESTLET_URL
```

### 3. Set Up NetSuite SDF Project

```bash
cd apps/netsuite

# Authenticate with NetSuite (first time only)
suitecloud account:setup
```

### 4. Start Development

```bash
# In apps/vite-spa directory
yarn dev
# or: npm run dev

# This starts both the Vite dev server and the proxy server for NetSuite API calls
```

## NetSuite Templates

This boilerplate includes reusable templates for common NetSuite patterns. See the full documentation:

📚 **[NetSuite Templates Guide](apps/netsuite/_templates/README.md)**

### Template Placeholders

When creating a new project, replace these placeholders in template files:

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{PREFIX}` | `dp`, `ob` | 2-4 letter lowercase project prefix |
| `{PREFIX_OP}` | `dop`, `obop` | Operation progress field prefix |
| `{PROJECT_NAME}` | `DirectPay` | PascalCase project name |
| `{PROJECT_NAME_DISPLAY}` | `Direct Pay` | Human-readable name |
| `{PROJECT_FOLDER}` | `com.example.myproject` | SuiteScripts folder name |

### Available Templates

- `{PREFIX}_operation_steps.js.template` - Operation step definitions
- `{PREFIX}_utils.js.template` - Shared utility functions
- `{PROJECT_NAME}_SPA_Data_RL.js.template` - SPA data RESTlet
- `{PROJECT_NAME}_SPA_Render_SL.js.template` - SPA render Suitelet
- `customrecord_{PREFIX}_operation_progress.xml.template` - Progress tracking record

## Vite SPA Development

The Vue SPA is pre-configured with:

- **Vue 3.5+** with Composition API and `<script setup>` syntax
- **TypeScript 5.9+** with strict mode
- **PrimeVue 4.x** component library
- **Pinia 3.x** state management
- **TailwindCSS 2.x** utility-first styling
- **Luxon** for date/time handling

### Key Commands

```bash
# Development (with HMR and proxy server)
yarn dev

# Type checking
yarn type-check

# Production build (single HTML file)
yarn build

# Copy built file to NetSuite folder
yarn postbuild
```

### NetSuite API Integration

The SPA includes a typed plugin for communicating with NetSuite RESTlets:

```typescript
import type { NetsuitePost } from '../types/netsuite-api'

const netSuiteApiCall = inject<NetsuitePost>('netsuiteApi')

const response = await netSuiteApiCall({ 
  task: 'fetchRecords',
  filters: { status: 'active' }
})
```

📚 **[Vue SPA Detailed Documentation](apps/vite-spa/README.md)**

## Development Workflow

### How the Apps Work Together

1. **Development Mode**
   - Vite dev server runs on `localhost:3000` (or similar)
   - Proxy server handles NetSuite API calls with TBA authentication
   - Hot module replacement for instant feedback

2. **Production Build**
   - `yarn build` compiles TypeScript and bundles everything into a single `index.html`
   - `yarn postbuild` copies the file to `apps/netsuite/src/FileCabinet/SuiteScripts/.../app/`
   - SDF deploy uploads to NetSuite File Cabinet

3. **NetSuite Serving**
   - Suitelet loads `index.html` from File Cabinet
   - SPA makes API calls to RESTlet for data operations

### Deployment

```bash
# Build the SPA
cd apps/vite-spa
yarn build

# Deploy to NetSuite
cd ../netsuite
suitecloud project:deploy
```

## Documentation

### NetSuite Patterns (Cursor Rules)

Located in `apps/netsuite/.cursor/rules/`:

| Rule | Description |
|------|-------------|
| `long-running-operations.mdc` | Async operations with progress tracking |
| `restlet-response-patterns.mdc` | SuiteQL → TypeScript field mapping |
| `suiteql-patterns.mdc` | SuiteQL syntax and best practices |
| `clobtext-progress-tracking.mdc` | CLOBTEXT field handling |
| `checkbox-date-fields.mdc` | NetSuite field type handling |
| `debugging-governance.mdc` | Debugging and governance limits |
| `audit-history-pattern.mdc` | Audit entry structure |

### Vue/TypeScript Patterns (Cursor Rules)

Located in `apps/vite-spa/.cursor/rules/`:

| Rule | Description |
|------|-------------|
| `pinia-store-patterns.mdc` | Store initialization and usage |
| `vue-component-patterns.mdc` | Loading states, user feedback |
| `typescript-strict-patterns.mdc` | TypeScript conventions |
| `api-error-handling.mdc` | Error handling patterns |
| `composable-patterns.mdc` | Vue composable templates |
| `computed-patterns.mdc` | Computed property best practices |
| `primevue-local-imports.mdc` | PrimeVue import patterns |

## New Project Checklist

When starting a new project from this boilerplate:

- [ ] Choose a 2-4 letter PREFIX for your project
- [ ] Update `apps/vite-spa/package.json` name and postbuild path
- [ ] Copy templates from `apps/netsuite/_templates/` to your project folder
- [ ] Replace all template placeholders (`{PREFIX}`, `{PROJECT_NAME}`, etc.)
- [ ] Define your operation steps in `{prefix}_operation_steps.js`
- [ ] Create custom records in NetSuite (operation progress, etc.)
- [ ] Set up TBA credentials in `.env`
- [ ] Deploy to NetSuite sandbox
- [ ] Test all endpoints
- [ ] Deploy to production

## Tech Stack

### Backend (NetSuite)
- SuiteScript 2.1
- SuiteCloud Development Framework (SDF)
- SuiteQL for database queries

### Frontend (Vue SPA)
- Vue 3.5+ (Composition API)
- Vite 6+ (build tool)
- TypeScript 5.9+
- PrimeVue 4.x (UI components)
- Pinia 3.x (state management)
- TailwindCSS 2.x (styling)
- Luxon (date/time)

## License

MIT

## Credits

Vue SPA structure based on [NetSuite-Vue-Vite-SPA](https://github.com/BibekStha/netsuite-vue-vite-spa) by [@BibekStha](https://github.com/BibekStha), enhanced with TypeScript support by [@jchu96](https://github.com/jchu96/netsuite-vue-vite-spa)
