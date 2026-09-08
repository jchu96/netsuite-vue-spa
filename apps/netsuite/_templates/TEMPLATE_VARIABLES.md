# NetSuite Project Template Variables

When creating a new project from these templates, replace the following placeholders throughout all files.

## Required Variables

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `{PREFIX}` | 2-4 letter lowercase prefix for all identifiers | `dp`, `ob`, `inv`, `wms` |
| `{PREFIX_UPPER}` | Uppercase version for display names | `DP`, `OB`, `INV`, `WMS` |
| `{PREFIX_OP}` | Prefix for operation progress fields (usually `{PREFIX}op`) | `dop`, `obop`, `invop` |
| `{PROJECT_NAME}` | Full project name (PascalCase) | `DirectPay`, `OrderBuilder` |
| `{PROJECT_NAME_DISPLAY}` | Human-readable project name with spaces | `Direct Pay`, `Order Builder` |
| `{PROJECT_FOLDER}` | SuiteScripts folder name | `com.example.myproject`, `com.example.orderbuilder` |
| `{PARENT_RECORD_TYPE}` | The main record type this project operates on | `customrecord_dp_project`, `salesorder` |

## Naming Convention Patterns

### Custom Records

| Pattern | Example (PREFIX=dp) | Description |
|---------|---------------------|-------------|
| `customrecord_{PREFIX}_*` | `customrecord_dp_project` | Custom record type |
| `customrecord_{PREFIX}_operation_progress` | `customrecord_dp_operation_progress` | Operation progress record |

### Custom Fields

| Pattern | Example (PREFIX=dp, PREFIX_OP=dop) | Description |
|---------|-----------------------------------|-------------|
| `custrecord_{PREFIX_OP}_*` | `custrecord_dop_status` | Fields on operation progress record |
| `custrecord_{PREFIX}_*` | `custrecord_dp_project_name` | Fields on other custom records |
| `custbody_{PREFIX}_*` | `custbody_dp_project_link` | Transaction body fields |
| `custcol_{PREFIX}_*` | `custcol_dp_line_ref` | Transaction line/column fields |
| `custitem_{PREFIX}_*` | `custitem_dp_eligible` | Item fields |

### Scripts & Deployments

| Pattern | Example (PREFIX=dp) | Description |
|---------|---------------------|-------------|
| `customscript_{PREFIX}_*` | `customscript_dp_finalization_ss` | Script ID |
| `customdeploy_{PREFIX}_*` | `customdeploy_dp_fin` | Deployment ID |
| `custscript_{PREFIX}_*` | `custscript_dp_tl_project_id` | Script parameter |

### Module Files

| Pattern | Example | Description |
|---------|---------|-------------|
| `{PREFIX}_utils.js` | `dp_utils.js` | Shared utility functions |
| `{PREFIX}_operation_steps.js` | `dp_operation_steps.js` | Operation step definitions |
| `{PROJECT_NAME}_SPA_Data_RL.js` | `DirectPay_SPA_Data_RL.js` | SPA data RESTlet |
| `{PROJECT_NAME}_SPA_Render_SL.js` | `DirectPay_SPA_Render_SL.js` | SPA render Suitelet |

## Operation Progress Field Mapping

The operation progress record uses a specific field prefix pattern:

| Template Field | Actual Field (PREFIX_OP=dop) |
|----------------|------------------------------|
| `custrecord_{PREFIX_OP}_parent_record` | `custrecord_dop_project` |
| `custrecord_{PREFIX_OP}_operation_type` | `custrecord_dop_operation_type` |
| `custrecord_{PREFIX_OP}_status` | `custrecord_dop_status` |
| `custrecord_{PREFIX_OP}_progress_data` | `custrecord_dop_progress_data` |
| `custrecord_{PREFIX_OP}_context_data` | `custrecord_dop_context_data` |
| `custrecord_{PREFIX_OP}_correlation_id` | `custrecord_dop_correlation_id` |
| `custrecord_{PREFIX_OP}_triggered_by` | `custrecord_dop_triggered_by` |
| `custrecord_{PREFIX_OP}_triggered_by_id` | `custrecord_dop_triggered_by_id` |
| `custrecord_{PREFIX_OP}_start_time` | `custrecord_dop_start_time` |
| `custrecord_{PREFIX_OP}_last_update` | `custrecord_dop_last_update` |
| `custrecord_{PREFIX_OP}_completed_at` | `custrecord_dop_completed_at` |
| `custrecord_{PREFIX_OP}_current_step` | `custrecord_dop_current_step` |
| `custrecord_{PREFIX_OP}_total_steps` | `custrecord_dop_total_steps` |
| `custrecord_{PREFIX_OP}_final_error` | `custrecord_dop_final_error` |

## Quick Start Checklist

When starting a new project:

1. [ ] Choose your PREFIX (2-4 lowercase letters)
2. [ ] Copy template files to your project's SuiteScripts folder
3. [ ] Rename files (replace `{PREFIX}` and `{PROJECT_NAME}` in filenames)
4. [ ] Find & replace all placeholders in file contents
5. [ ] Update the `selectrecordtype` reference in operation progress XML
6. [ ] Define your operation types and steps in `{PREFIX}_operation_steps.js`
7. [ ] Deploy to NetSuite sandbox for testing

## Example: Creating "OrderBuilder" Project

```
PREFIX = ob
PREFIX_UPPER = OB
PREFIX_OP = obop
PROJECT_NAME = OrderBuilder
PROJECT_NAME_DISPLAY = Order Builder
PROJECT_FOLDER = com.example.orderbuilder
PARENT_RECORD_TYPE = customrecord_ob_order
```

### File Renames:
- `{PREFIX}_operation_steps.js.template` → `ob_operation_steps.js`
- `{PREFIX}_utils.js.template` → `ob_utils.js`
- `{PROJECT_NAME}_SPA_Data_RL.js.template` → `OrderBuilder_SPA_Data_RL.js`
- `customrecord_{PREFIX}_operation_progress.xml.template` → `customrecord_ob_operation_progress.xml`

### Find & Replace in Contents:
1. `{PREFIX}` → `ob`
2. `{PREFIX_UPPER}` → `OB`
3. `{PREFIX_OP}` → `obop`
4. `{PROJECT_NAME}` → `OrderBuilder`
5. `{PROJECT_NAME_DISPLAY}` → `Order Builder`
6. `{PROJECT_FOLDER}` → `com.example.orderbuilder`
7. `{PARENT_RECORD_TYPE}` → `customrecord_ob_order`

