import { expect, it } from 'vitest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { signRequest } = require('../server/oauth.cjs');
// RFC 5849 normalization fixture, independently calculated with Python urllib.parse and hmac.
const config = {
  url: 'https://1234567-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?deploy=customdeploy_nvs_hello_rl&script=customscript_nvs_hello_rl',
  realm: '1234567_SB1', consumerKey: 'synthetic consumer', consumerSecret: 'synthetic&consumer',
  tokenKey: 'synthetic/token', tokenSecret: 'synthetic=token'
};
it('signs URL parameters and OAuth fields with an independently calculated HMAC-SHA256 fixture', () => {
  const header = signRequest(config, 'synthetic-nonce', '1700000000');
  const signature = decodeURIComponent(header.match(/oauth_signature="([^"]+)"/)[1]);
  expect(signature).toBe('3LPxvC+Uq4TERQWcOd8tfEz1RSrsMg+kRFxBQNFuCN4=');
  expect(header).toContain('oauth_signature_method="HMAC-SHA256"');
  expect(header).not.toContain(config.consumerSecret);
  expect(header).not.toContain(config.tokenSecret);
  const reordered = { ...config, url: config.url.split('?')[0] + '?script=customscript_nvs_hello_rl&deploy=customdeploy_nvs_hello_rl' };
  expect(signRequest(reordered, 'synthetic-nonce', '1700000000')).toBe(header);
});
