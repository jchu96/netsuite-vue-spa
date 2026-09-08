# NetSuite Project Templates

This folder contains template files for quickly scaffolding new NetSuite SuiteScript projects with consistent patterns and best practices.

## 📁 Template Structure

```
_templates/
├── README.md                 # This file
├── TEMPLATE_VARIABLES.md     # Complete list of placeholders to replace
├── scripts/                  # SuiteScript templates
│   ├── {PREFIX}_operation_steps.js.template    # Operation step definitions
│   ├── {PREFIX}_utils.js.template              # Shared utility functions
│   ├── {PROJECT_NAME}_SPA_Data_RL.js.template  # SPA data RESTlet
│   └── {PROJECT_NAME}_SPA_Render_SL.js.template # SPA render Suitelet
└── records/                  # Custom record XML templates
    └── customrecord_{PREFIX}_operation_progress.xml.template
```

## 🚀 Quick Start

### 1. Choose Your Project Identifiers

| Variable | Your Value | Example |
|----------|------------|---------|
| `{PREFIX}` | ___________ | `dp`, `ob` |
| `{PREFIX_OP}` | ___________ | `dop`, `obop` |
| `{PROJECT_NAME}` | ___________ | `DirectPay`, `OrderBuilder` |
| `{PROJECT_NAME_DISPLAY}` | ___________ | `Direct Pay`, `Order Builder` |
| `{PROJECT_FOLDER}` | ___________ | `com.example.myproject` |
| `{PARENT_RECORD_TYPE}` | ___________ | `customrecord_dp_project` |

### 2. Copy Template Files

```bash
# Create your project folder structure
mkdir -p src/FileCabinet/SuiteScripts/com.example.{yourproject}/lib
mkdir -p src/FileCabinet/SuiteScripts/com.example.{yourproject}/app

# Copy templates (rename removing .template extension)
cp _templates/scripts/{PREFIX}_utils.js.template \
   src/FileCabinet/SuiteScripts/com.example.{yourproject}/lib/{prefix}_utils.js

cp _templates/scripts/{PREFIX}_operation_steps.js.template \
   src/FileCabinet/SuiteScripts/com.example.{yourproject}/lib/{prefix}_operation_steps.js

# ...etc
```

### 3. Find & Replace Placeholders

In your copied files, replace all placeholders:

1. `{PREFIX}` → your prefix (e.g., `ob`)
2. `{PREFIX_OP}` → your operation prefix (e.g., `obop`)
3. `{PROJECT_NAME}` → your project name (e.g., `OrderBuilder`)
4. `{PROJECT_NAME_DISPLAY}` → display name (e.g., `Order Builder`)
5. `{PROJECT_FOLDER}` → folder name (e.g., `com.example.orderbuilder`)
6. `{PARENT_RECORD_TYPE}` → main record type (e.g., `customrecord_ob_order`)

### 4. Customize Operation Steps

Edit `{prefix}_operation_steps.js` to define your project's specific operations:

```javascript
const OPERATION_STEPS = {
    'your_operation': [
        { id: 'step1', message: 'First step description' },
        { id: 'step2', message: 'Second step description' },
        // ...
    ]
};
```

## 📋 Template Descriptions

### `{PREFIX}_operation_steps.js.template`
Centralized step definitions for long-running operations. The frontend automatically adapts to changes here.

### `{PREFIX}_utils.js.template`
Shared utility functions including:
- `uuidv4()` - Generate correlation IDs
- `isCheckboxTrue()` - Handle NetSuite checkbox values
- `escapeSql()` - Safe SQL string escaping
- `getCached()` - N/cache wrapper
- `fetchWithPagination()` - Paginated SuiteQL queries
- `fetchInBatches()` - Batch processing for large datasets
- `safeJsonParse()` - Parse JSON with fallback

### `{PROJECT_NAME}_SPA_Data_RL.js.template`
RESTlet template for SPA ↔ NetSuite data communication with:
- Task-based routing
- Correlation ID tracking
- Error handling
- Operation progress endpoints

### `{PROJECT_NAME}_SPA_Render_SL.js.template`
Suitelet that serves the Vue/Vite SPA with:
- Request logging
- Error fallback page
- User context tracking

### `customrecord_{PREFIX}_operation_progress.xml.template`
Custom record for tracking long-running operation progress with fields for:
- Operation type and status
- Progress data (CLOBTEXT JSON)
- Correlation ID
- Timestamps
- Error tracking

## 📚 Related Documentation

See the `.cursor/rules/` folder for detailed patterns:

| Rule File | Description |
|-----------|-------------|
| `long-running-operations.mdc` | Complete pattern for async operations |
| `restlet-response-patterns.mdc` | SuiteQL → TypeScript field mapping |
| `suiteql-patterns.mdc` | SuiteQL syntax and best practices |
| `clobtext-progress-tracking.mdc` | CLOBTEXT field handling |
| `checkbox-date-fields.mdc` | NetSuite field type handling |
| `debugging-governance.mdc` | Debugging and governance limits |
| `audit-history-pattern.mdc` | Audit entry structure |

## ⚠️ Important Notes

1. **Don't deploy templates directly** - Always copy and customize first
2. **Update `selectrecordtype`** - The operation progress XML references a parent record that must exist
3. **Test in sandbox first** - Always validate in sandbox before production
4. **Follow naming conventions** - Consistent prefixes make code easier to maintain

## 🔧 Optional: Scaffold Script

For automated project scaffolding, you could create a PowerShell or Node.js script:

```powershell
# Example scaffold-project.ps1
param(
    [Parameter(Mandatory=$true)]
    [string]$Prefix,
    
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

$templateDir = "apps/netsuite/_templates"
$targetDir = "apps/netsuite/src/FileCabinet/SuiteScripts/com.example.$($ProjectName.ToLower())"

# Create directory structure
New-Item -ItemType Directory -Force -Path "$targetDir/lib"
New-Item -ItemType Directory -Force -Path "$targetDir/app"

# Copy and transform templates...
```

## 📝 Checklist for New Projects

- [ ] Choose PREFIX (2-4 lowercase letters)
- [ ] Create folder structure in FileCabinet
- [ ] Copy and rename template files
- [ ] Replace all placeholders
- [ ] Define operation steps
- [ ] Create/update custom records
- [ ] Deploy to sandbox
- [ ] Test all endpoints
- [ ] Deploy to production

