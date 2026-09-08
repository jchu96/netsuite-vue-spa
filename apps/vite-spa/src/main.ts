import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import { apiKey, createApiClient } from '../plugins/netsuite-api'
import './assets/index.css'
const endpoint = document.querySelector<HTMLMetaElement>('meta[name="netsuite-restlet"]')?.content || import.meta.env.VITE_RESTLET_URL || '/app/site/hosting/restlet.nl?script=customscript_nvs_hello_rl&deploy=customdeploy_nvs_hello_rl'
createApp(App)
  .use(createPinia())
  .use(PrimeVue, { unstyled: true })
  .provide(apiKey, createApiClient({ development: import.meta.env.DEV, endpoint, port: import.meta.env.VITE_API_SERVER_PORT }))
  .mount('#nvs-app')
