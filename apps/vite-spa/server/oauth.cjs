const { createHmac, randomBytes } = require('node:crypto');
const encode = value => encodeURIComponent(value).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
function signRequest(config, nonce = randomBytes(24).toString('base64url'), timestamp = String(Math.floor(Date.now() / 1000))) {
  const url = new URL(config.url);
  const oauth = { oauth_consumer_key: config.consumerKey, oauth_token: config.tokenKey,
    oauth_signature_method: 'HMAC-SHA256', oauth_timestamp: timestamp, oauth_nonce: nonce, oauth_version: '1.0' };
  const pairs = [...url.searchParams, ...Object.entries(oauth)].map(([k, v]) => [encode(k), encode(v)]);
  pairs.sort(([ak, av], [bk, bv]) => ak < bk ? -1 : ak > bk ? 1 : av < bv ? -1 : av > bv ? 1 : 0);
  const normalized = pairs.map(([k, v]) => k + '=' + v).join('&');
  const base = ['POST', url.origin + url.pathname, normalized].map(encode).join('&');
  const signature = createHmac('sha256', encode(config.consumerSecret) + '&' + encode(config.tokenSecret)).update(base).digest('base64');
  return 'OAuth ' + Object.entries({ realm: config.realm, ...oauth, oauth_signature: signature })
    .map(([k, v]) => encode(k) + '="' + encode(v) + '"').join(', ');
}
module.exports = { signRequest };
