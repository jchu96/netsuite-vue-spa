const express = require('express');
const { randomBytes, timingSafeEqual } = require('node:crypto');
const { loadConfig } = require('./config.cjs');
const { signRequest } = require('./oauth.cjs');
const LOOPBACK = '127.0.0.1';
function validRequest(body) {
  return body && typeof body === 'object' && !Array.isArray(body) &&
    Object.keys(body).sort().join(',') === 'name,task' && body.task === 'helloRecord' &&
    typeof body.name === 'string' && body.name.trim().length > 0 && body.name.length <= 80;
}
function createApp(config, { sign = signRequest, transport = fetch, sessionToken = randomBytes(32).toString('base64url') } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (req.headers.host !== LOOPBACK + ':' + config.port || req.headers.origin !== config.origin) {
      return res.status(403).json({ error: 'Caller rejected' });
    }
    res.set('Access-Control-Allow-Origin', config.origin);
    res.set('Vary', 'Origin');
    if (req.method === 'OPTIONS' && ['/session', '/api'].includes(req.path)) {
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type, X-Proxy-Token');
      return res.sendStatus(204);
    }
    next();
  });
  app.use(express.json({ limit: '8kb', strict: true }));
  app.post('/session', (req, res) => res.json({ token: sessionToken, mode: config.mode }));
  app.post('/api', async (req, res) => {
    const provided = Buffer.from(req.get('X-Proxy-Token') || '');
    const expected = Buffer.from(sessionToken);
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      return res.status(403).json({ error: 'Session required' });
    }
    if (!validRequest(req.body)) return res.status(400).json({ error: 'Invalid request' });
    if (config.mode === 'demo') return res.json({ success: true, data: { id: '1', name: req.body.name }, mode: 'demo' });
    try {
      const authorization = sign(config);
      const response = await transport(config.url, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: authorization },
        body: JSON.stringify(req.body), redirect: 'error', signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error('Upstream rejected request');
      return res.json(await response.json());
    } catch {
      return res.status(502).json({ error: 'NetSuite request failed' });
    }
  });
  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
  app.use((err, _req, res, _next) => res.status(err.status === 413 ? 413 : 400).json({ error: 'Invalid request body' }));
  return app;
}
function startServer(config) {
  const server = createApp(config).listen(config.port, LOOPBACK, () => {
    console.log('Dev proxy (' + config.mode + ') listening on http://' + LOOPBACK + ':' + config.port);
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}
if (require.main === module) {
  require('dotenv').config({ quiet: true });
  try { startServer(loadConfig(process.env)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { createApp, startServer, validRequest, LOOPBACK };
