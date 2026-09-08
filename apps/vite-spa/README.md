# NetSuite-Vue-Vite-SPA (TypeScript Edition)

NetSuite-Vue-Vite-SPA is a modern boilerplate template for a single page application (SPA) using Vue 3.5+, Vite 6+, and TypeScript to render custom pages on NetSuite.

> **Note**: This is an enhanced TypeScript fork of the original [NetSuite-Vue-Vite-SPA](https://github.com/BibekStha/netsuite-vue-vite-spa) by [@BibekStha](https://github.com/BibekStha). All credit for the original concept and implementation goes to the original author.

## Features

- Easy to start boilerplate for creating custom page for NetSuite
- Uses [Vue 3.5+](https://v3.vuejs.org/) and [Vite 6+](https://vitejs.dev/) for great developer experience
- **Full TypeScript support** with proper typing for NetSuite API calls
- Develop your SPA as you would develop any other application with type safety
- A typed plugin that handles sending API calls to NetSuite RestLet both during development and when deployed to NetSuite
- Bundles code into a single file for production to be deployed to NetSuite file cabinet
- Type checking and IntelliSense support for better development experience

## TypeScript Upgrade

This fork includes significant upgrades from the original repository:

### What's New
- **Vue 3.5+** (upgraded from 3.x)
- **Vite 6+** (upgraded from 2.x) 
- **TypeScript 5.9+** with full type safety
- **Typed NetSuite API plugin** with proper interfaces
- **Type checking** integrated into build process

### Before/After Examples

**Original JavaScript approach:**
```js
// plugins/netsuite-api.js
export default {
  install: (app, options) => {
    const apiCall = async (data) => {
      // No type safety
    };
  }
};

// Component usage
const netSuiteApiCall = inject("netsuiteApi");
const apiResponse = await netSuiteApiCall({ task: "fetchItemRec" });
```

**New TypeScript approach:**
```ts
// plugins/netsuite-api.ts
import type { App, Plugin } from 'vue'
import type { NetsuitePost } from '../src/types/netsuite-api'

const netSuiteApiPlugin: Plugin = {
  install: (app: App, options?: any) => {
    const apiCall: NetsuitePost = async (data: any): Promise<Response> => {
      // Full type safety
    };
  }
};

// Component usage with types
import type { NetsuitePost } from "../types/netsuite-api";
const netSuiteApiCall = inject<NetsuitePost>("netsuiteApi");
```

## Installation

On your terminal, use `degit` tool to scaffold a new project.

```bash
npx degit your-username/netsuite-vue-vite-spa <your-project-name>
```

`cd` into your project directory and install dependencies.

```bash
cd <your-project-name>

# Using yarn
yarn

# OR

# Using npm
npm install
```

## Checklist before starting to use this repo on your project

- [ ] Scaffold your project using `degit` tool
- [ ] Delete `LICENSE` file
- [ ] Update README.md file as per your need
- [ ] Rename `.env.example` file to `.env`
- [ ] Set up [TBA (Token Based Authentication)](https://system.netsuite.com/app/help/helpcenter.nl?fid=section_4247337262.html) on NetSuite
- [ ] Update tokens, your NetSuite account number to `.env` file
- [ ] Create a RestLet on NetSuite as per an example shown below and deploy it
- [ ] Copy the internal URL of the RestLet and update it on `.env` file

## Usage

```bash
# Start local dev server

# Using yarn
yarn dev

# OR

# Using npm
npm run dev
```

Develop your application as any other single page application using features provided by Vue and Vite with full TypeScript support. Enjoy extremely fast HMR with Vite. TailwindCSS with PostCSS support has already been set up out of the box.

### TypeScript Development

This project includes several TypeScript-specific commands:

```bash
# Type check your code without building
npm run type-check

# Build with type checking (will fail if types are incorrect)
npm run build
```

### Fetching data with TypeScript

You get a fully typed plugin out of the box that handles sending API calls to NetSuite RestLet to fetch data. You will have to set up TBA and create RestLet (See example below) on NetSuite as described in the checklist above.

To fetch data on any component with full type safety:

```ts
<script setup lang="ts">
import { onMounted, ref, inject } from "vue";
import type { NetsuitePost } from "../types/netsuite-api";

// Inject the typed "netsuiteApi" function
const netSuiteApiCall = inject<NetsuitePost>("netsuiteApi");
const restletMessage = ref<string>("");

onMounted(async () => {
  if (netSuiteApiCall) {
    try {
      // Call with full type checking
      const apiResponse = await netSuiteApiCall({ 
        task: "fetchItemRec", 
        itemId: "12345" 
      });
      
      const result = await apiResponse.json();
      restletMessage.value = JSON.stringify(result);
    } catch (error) {
      console.error("API call failed:", error);
      restletMessage.value = "Error fetching data";
    }
  }
});
</script>
```

View `HelloWorld.vue` component to understand the complete TypeScript implementation.

## Production code

This project is setup to produce a single HTML file with JavaScript code and CSS styles inlined. The build process now includes TypeScript compilation and type checking.

```bash
# Using yarn
yarn build

# OR

# Using npm
npm run build
```

The build command will:
1. **Type check** your entire codebase
2. **Compile TypeScript** to JavaScript
3. **Bundle** everything into a single HTML file
4. **Fail** if there are any TypeScript errors

You can use `--watch` flag with the vite build command to re-build the app every time the code changes, which becomes handy when you have to constantly copy and paste the code to NetSuite file system to test.

Running the build command creates an `index.html` file in the `dist` folder. On NetSuite file cabinet, upload the file for the first time and keep updating this file on NetSuite with new code every time you run the build command again. Do not worry about the files inside `dist/assets` folder as the content of those files are inlined on the `index.html` file.

### RestLet to setup communication between your SPA and NetSuite

Create a RestLet with below code and deploy it. This RestLet will work with the TypeScript frontend:

```js
/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(["N/search", "N/error", "N/record"], function (search, error, record) {
  function post(context) {
    try {
      // Logging to check data sent as request body
      log.debug("Context", context);

      /*
      // Example: Handle different tasks sent from TypeScript frontend
      const task = context.task;
      const itemId = context.itemId;
      const data = {};

      switch (task) {
        case "fetchItemRec":
          // Fetch item record logic
          data.message = `Fetching item: ${itemId}`;
          break;
        case "createRecord":
          // Create record logic
          break;
        default:
          data.error = "Unknown task";
      }

      return JSON.stringify(data);
      */

      return JSON.stringify("Hey from a RestLet!");
    } catch (error) {
      log.error("RestLet Error", error);
      return JSON.stringify({ error: error.message });
    }
  }

  return {
    post: post,
  };
});
```

### SuiteLet to render the SPA

Create a SuiteLet with below code and deploy to create a custom page on NetSuite and render the TypeScript-built SPA you created.

```js
/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/file"], function (ui, file) {
  function onRequest(context) {
    if (context.request.method === "GET") {
      const form = ui.createForm({
        title: "NetSuite Vue-Vite-SPA TypeScript Edition",
      });

      const contentHTML = form.addField({
        id: "content",
        type: ui.FieldType.INLINEHTML,
        label: "TypeScript SPA",
      });

      try {
        // 'id' is the file path of the built TypeScript SPA inside 'file cabinet'
        const fileHTML = file.load({ id: "/SuiteScripts/your-folder/index.html" });
        contentHTML.defaultValue = fileHTML.getContents();
      } catch (error) {
        log.error("SuiteLet Error", error);
        contentHTML.defaultValue = "<p>Error loading SPA: " + error.message + "</p>";
      }
      
      context.response.writePage(form);
    }
  }

  return {
    onRequest: onRequest,
  };
});
```

Visit the URL of the SuiteLet deployment to view your custom page.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://github.com/BibekStha/netsuite-vue-vite-spa/blob/main/LICENSE)
