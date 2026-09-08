import { expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { loadConfig, validatePublicEnv } = require('../server/config.cjs');
const { parse } = require('dotenv');
it('example credentials start a demo without credential-bearing config', () => {
  const config = loadConfig(parse(readFileSync(new URL('../.env.example', import.meta.url))));
  expect(config.mode).toBe('demo'); expect(config).not.toHaveProperty('consumerSecret');
});
it.each(['VITE_NS_TOKEN_SECRET', 'VITE_SECRET', 'VITE_SOMETHING_NEW'])('rejects unknown VITE_ variables (%s)', key => {
  expect(() => validatePublicEnv({ [key]: 'synthetic-only' })).toThrow(/Unsupported browser/);
});
it('rejects live startup without complete server credentials', () => {
  expect(() => loadConfig({ NETSUITE_MODE: 'live' })).toThrow(/Configure server/);
  expect(() => loadConfig({ NETSUITE_MODE: 'typo' })).toThrow(/demo or live/);
});
it.each(['https://unexpected.example/', '//unexpected.example/', '/app/site/hosting/restlet.nl?script=customscript_test&deploy=customdeploy_test&url=other'])('rejects RESTlet destination overrides: %s', value => {
  expect(() => validatePublicEnv({ VITE_RESTLET_URL: value })).toThrow();
});
it.each(['0', '5173', '65536', 'abc'])('rejects invalid proxy port %s', value => {
  expect(() => validatePublicEnv({ VITE_API_SERVER_PORT: value })).toThrow();
});
