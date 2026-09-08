# Template variables

`template.config.json` is trusted, local generation input; HTTP requests cannot set these values.

| JSON key | Placeholder | Default | Validation |
|---|---|---|---|
| `prefix` | `{PREFIX}` | `nvs` | 2–6 lowercase letters |
| `projectName` | `{PROJECT_NAME}` | `Hello` | Starts uppercase; 1–20 ASCII letters/digits |
| `displayName` | `{PROJECT_NAME_DISPLAY}` | `Hello Record` | Starts with a letter; 1–50 letters/digits/spaces/dots/hyphens |
| `projectFolder` | `{PROJECT_FOLDER}` | `netsuite-vue-spa` | Starts lowercase; 3–50 lowercase letters/digits/dots/hyphens; no `..` |

All four keys are required; unknown keys and non-string values fail. The restricted alphabets make substitutions safe in JavaScript literals, filenames and XML text. Object and deployment IDs remain under 40 characters.

Generated identities include `customrecord_{PREFIX}_hello`, `customscript_{PREFIX}_hello_rl`, `customdeploy_{PREFIX}_hello_rl`, the corresponding `_sl` IDs, and `customrole_{PREFIX}_hello_viewer`. Scripts are named `{PROJECT_NAME}_SPA_Data_RL.js` and `{PROJECT_NAME}_SPA_Render_SL.js`.

Generation writes eight SDF source files, refusing overwrite by default. `--force` overwrites those owned paths only. After changing identity values, review and remove old generated paths yourself. The generator does not infer whether existing custom code is safe to remove. Update local `.env` routing IDs when using optional live mode.

The built HTML is a separate artifact: `npm run build` copies it into `FileCabinet/SuiteScripts/{PROJECT_FOLDER}/app/index.html`. The Suitelet injects its resolved RESTlet path through the `NETSUITE_CONFIG` comment slot.
