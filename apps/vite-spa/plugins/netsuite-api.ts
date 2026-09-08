import type { App, Plugin } from 'vue'
import type { NetsuitePost } from '../src/types/netsuite-api'

const netSuiteApiPlugin: Plugin = {
  install: (app: App, options?: any) => {
    const apiCall: NetsuitePost = async (data: any): Promise<Response> => {
      let getAssemItemApiRes: Response;
      
      if (import.meta.env.PROD) {
        getAssemItemApiRes = await fetch(import.meta.env.VITE_RESTLET_URL, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        getAssemItemApiRes = await fetch(`http://localhost:${import.meta.env.VITE_API_SERVER_PORT}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }
      return getAssemItemApiRes;
    };

    app.provide("netsuiteApi", apiCall);
  },
};

export default netSuiteApiPlugin;
