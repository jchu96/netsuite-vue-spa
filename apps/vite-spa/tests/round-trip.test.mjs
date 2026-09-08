// @vitest-environment jsdom
import { expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { mount, flushPromises } from '@vue/test-utils';
import HelloWorld from '../src/components/HelloWorld.vue';
import { apiKey, createApiClient } from '../plugins/netsuite-api';
const require = createRequire(import.meta.url);
const { createApp } = require('../server/index.cjs');
it('Vue → typed client → real loopback proxy → synthetic record completes without an account', async () => {
  const config = { mode: 'demo', origin: 'http://127.0.0.1:5173', port: 0 };
  const server = createApp(config).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  config.port = server.address().port;
  const api = createApiClient({ development: true, endpoint: '/unused', port: String(config.port),
    fetcher: (input, init) => fetch(input, { ...init, headers: { ...init?.headers, Origin: config.origin } }) });
  const wrapper = mount(HelloWorld, { global: { plugins: [createPinia(), [PrimeVue, { unstyled: true }]], provide: { [apiKey]: api } } });
  try {
    await wrapper.get('form').trigger('submit');
    for (let i = 0; i < 100 && !wrapper.text().includes('Record #1'); i++) {
      await new Promise(resolve => setTimeout(resolve, 10)); await flushPromises();
    }
    expect(wrapper.text()).toContain('Record #1');
    expect(wrapper.get('[role="status"]').text()).toContain('Hello world');
  } finally {
    wrapper.unmount(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  }
});
