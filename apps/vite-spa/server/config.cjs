const PUBLIC_KEYS = new Set(['VITE_RESTLET_URL', 'VITE_API_SERVER_PORT']);
const DEFAULT_PATH = '/app/site/hosting/restlet.nl?script=customscript_nvs_hello_rl&deploy=customdeploy_nvs_hello_rl';
function validatePublicEnv(env) {
  for (const key of Object.keys(env)) {
    if (key.startsWith('VITE_') && !PUBLIC_KEYS.has(key)) {
      throw new Error('Unsupported browser environment variable: ' + key);
    }
  }
  const restletPath = env.VITE_RESTLET_URL || DEFAULT_PATH;
  const parsed = new URL(restletPath, 'https://example.invalid');
  if (parsed.origin !== 'https://example.invalid' || !restletPath.startsWith('/app/site/hosting/restlet.nl?') ||
      parsed.pathname !== '/app/site/hosting/restlet.nl' || parsed.hash ||
      [...parsed.searchParams.keys()].sort().join(',') !== 'deploy,script' ||
      !/^customscript_[a-z0-9_]+$/.test(parsed.searchParams.get('script')) ||
      !/^customdeploy_[a-z0-9_]+$/.test(parsed.searchParams.get('deploy'))) {
    throw new Error('VITE_RESTLET_URL must be a relative RESTlet path with script and deploy IDs');
  }
  const rawPort = env.VITE_API_SERVER_PORT || '3333';
  if (!/^\d+$/.test(rawPort) || Number(rawPort) < 1024 || Number(rawPort) > 65535 || Number(rawPort) === 5173) {
    throw new Error('VITE_API_SERVER_PORT must be 1024–65535, excluding 5173');
  }
  return { restletPath, port: Number(rawPort), origin: 'http://127.0.0.1:5173' };
}
function loadConfig(env) {
  const config = validatePublicEnv(env);
  const mode = env.NETSUITE_MODE || 'demo';
  if (!['demo', 'live'].includes(mode)) throw new Error('NETSUITE_MODE must be demo or live');
  if (mode === 'demo') return { ...config, mode };
  for (const key of ['NETSUITE_ACCOUNT', 'NETSUITE_ACCOUNT_REALM', 'TBA_CONSUMER_KEY', 'TBA_CONSUMER_SECRET', 'TBA_TOKEN_KEY', 'TBA_TOKEN_SECRET']) {
    if (!env[key] || /^(example-|your-)/i.test(env[key])) throw new Error('Configure server variable ' + key);
  }
  if (!/^[a-z0-9]+(?:-(?:sb\d+|rp))?$/.test(env.NETSUITE_ACCOUNT) || env.NETSUITE_ACCOUNT === '1234567-sb1' ||
      env.NETSUITE_ACCOUNT_REALM.toLowerCase().replaceAll('_', '-') !== env.NETSUITE_ACCOUNT) {
    throw new Error('Account hostname and realm must match; replace the synthetic account');
  }
  return { ...config, mode, realm: env.NETSUITE_ACCOUNT_REALM,
    url: 'https://' + env.NETSUITE_ACCOUNT + '.restlets.api.netsuite.com' + config.restletPath,
    consumerKey: env.TBA_CONSUMER_KEY, consumerSecret: env.TBA_CONSUMER_SECRET,
    tokenKey: env.TBA_TOKEN_KEY, tokenSecret: env.TBA_TOKEN_SECRET };
}
module.exports = { loadConfig, validatePublicEnv };
