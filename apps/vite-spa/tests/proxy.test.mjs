import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
import { request } from 'node:http';
const require = createRequire(import.meta.url);
const { createApp, startServer } = require('../server/index.cjs');
const { loadConfig } = require('../server/config.cjs');
const servers = [];
afterEach(async () => { for (const s of servers.splice(0)) { s.closeAllConnections(); await new Promise(r => s.close(r)); } });
async function fixture(mode = 'live', overrides = {}) {
  const config = { mode, port: 0, origin: 'http://127.0.0.1:5173', url: 'https://example.invalid/restlet' };
  const sign = vi.fn(() => 'synthetic-authorization');
  const transport = vi.fn(async () => new Response(JSON.stringify({ success: true, data: { id: '1', name: 'Hello' } })));
  const server = createApp(config, { sign, transport, sessionToken: 'synthetic-session', ...overrides }).listen(0, '127.0.0.1');
  servers.push(server);
  await new Promise(r => server.once('listening', r));
  config.port = server.address().port;
  async function call({ origin = config.origin, host = '127.0.0.1:' + config.port, token = 'synthetic-session', path = '/api', method = 'POST', body = JSON.stringify({ task: 'helloRecord', name: 'Hello' }) } = {}) {
    return new Promise((resolve, reject) => {
      const headers = { Host: host, 'Content-Type': 'application/json', 'X-Proxy-Token': token };
      if (origin !== null) headers.Origin = origin;
      const req = request({ hostname: '127.0.0.1', port: config.port, path, method, headers }, res => {
        let text = ''; res.on('data', b => text += b); res.on('end', () => resolve({ status: res.statusCode, text, headers: res.headers }));
      });
      req.on('error', reject); req.end(body);
    });
  }
  return { call, sign, transport, server };
}
describe('proxy caller boundary', () => {
  it.each(['https://unexpected.example', null])('unexpected Origin never signs (%s)', async origin => {
    const { call, sign, transport } = await fixture();
    const response = await call({ origin });
    expect(sign, 'rejected Origin must not reach signing').not.toHaveBeenCalled();
    expect(transport).not.toHaveBeenCalled();
    expect(response.status).toBe(403);
  });
  it('rejects Host rebinding, unauthenticated callers and unknown tasks before signing', async () => {
    const { call, sign } = await fixture();
    for (const args of [{ host: 'unexpected.example' }, { token: '' }, { token: 'wrong' }, { body: '{"task":"delete"}' }, { body: 'null' }, { path: '/other' }, { method: 'GET' }]) {
      expect((await call(args)).status).toBeGreaterThanOrEqual(400);
    }
    expect(sign).not.toHaveBeenCalled();
  });
  it('rejects oversized and malformed input', async () => {
    const { call, sign } = await fixture();
    expect((await call({ body: 'x'.repeat(9000) })).status).toBe(413);
    expect((await call({ body: '{' })).status).toBe(400);
    expect(sign).not.toHaveBeenCalled();
  });
  it('issues a no-store session only to the expected browser Origin', async () => {
    const { call, sign } = await fixture();
    const session = await call({ path: '/session', token: '' });
    expect(JSON.parse(session.text).token).toBe('synthetic-session');
    expect(session.headers['cache-control']).toBe('no-store');
    expect((await call({ path: '/session', origin: null })).status).toBe(403);
    expect((await call({ method: 'OPTIONS' })).status).toBe(204);
    expect(sign).not.toHaveBeenCalled();
  });
  it('signs only validated live requests and prevents redirects with a timeout', async () => {
    const { call, sign, transport } = await fixture();
    expect((await call()).status).toBe(200);
    expect(sign).toHaveBeenCalledTimes(1);
    expect(transport.mock.calls[0][1]).toMatchObject({ redirect: 'error', method: 'POST', headers: { Authorization: 'synthetic-authorization' } });
    expect(transport.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });
  it('demo returns synthetic data without invoking signing or transport', async () => {
    const { call, sign, transport } = await fixture('demo');
    expect(JSON.parse((await call()).text)).toMatchObject({ success: true, mode: 'demo', data: { id: '1', name: 'Hello' } });
    expect(sign).not.toHaveBeenCalled(); expect(transport).not.toHaveBeenCalled();
  });
  it('never returns transport errors containing credentials', async () => {
    const { call } = await fixture('live', { transport: async () => { throw new Error('synthetic-secret-marker'); } });
    const response = await call();
    expect(response.status).toBe(502); expect(response.text).not.toContain('synthetic-secret-marker');
  });
  it('startup binds the listening socket to loopback', async () => {
    const server = startServer({ ...loadConfig({}), port: 0 }); servers.push(server);
    await new Promise(r => server.once('listening', r));
    expect(server.address().address).toBe('127.0.0.1');
  });
});
