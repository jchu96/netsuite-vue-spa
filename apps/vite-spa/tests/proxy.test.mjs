import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
import { request } from 'node:http';
const require = createRequire(import.meta.url);
const { createApp, startServer } = require('../server/index.cjs');
const { loadConfig } = require('../server/config.cjs');
const servers = [];
afterEach(async () => {
  vi.restoreAllMocks();
  for (const s of servers.splice(0)) { s.closeAllConnections(); await new Promise(r => s.close(r)); }
});
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
  it('rejects a well-formed write task before signing', async () => {
    const { call, sign, transport } = await fixture();
    const response = await call({ body: JSON.stringify({ task: 'write', name: 'x' }) });
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(sign).not.toHaveBeenCalled();
    expect(transport).not.toHaveBeenCalled();
  });
  it.each([8191, 8192, 8193])('enforces the 8 KB JSON byte boundary at %i bytes', async size => {
    const { call, sign, transport } = await fixture();
    const json = JSON.stringify({ task: 'helloRecord', name: 'Hello ☀' });
    // JSON whitespace pads the wire size without violating the name/shape rules.
    const body = json + ' '.repeat(size - Buffer.byteLength(json));
    expect(Buffer.byteLength(body)).toBe(size);
    expect(JSON.parse(body)).toEqual({ task: 'helloRecord', name: 'Hello ☀' });
    const response = await call({ body });
    if (size <= 8192) {
      expect(response.status).toBe(200);
      expect(sign).toHaveBeenCalledTimes(1);
      expect(transport).toHaveBeenCalledTimes(1);
    } else {
      expect(response.status).toBe(413);
      expect(sign).not.toHaveBeenCalled();
      expect(transport).not.toHaveBeenCalled();
    }
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
  it('uses a 10000 ms timeout and handles aborted transport', async () => {
    const controller = new AbortController();
    const timeout = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(controller.signal);
    const aborted = vi.fn();
    const transport = vi.fn(async (_url, { signal }) => {
      // A missing signal completes normally so its mutant fails an assertion, not a test timeout.
      if (!signal) return new Response('{}');
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => { aborted(); reject(signal.reason); }, { once: true });
        queueMicrotask(() => controller.abort(new DOMException('Synthetic timeout', 'TimeoutError')));
      });
    });
    const { call, sign } = await fixture('live', { transport });
    const response = await call();
    expect(timeout).toHaveBeenCalledExactlyOnceWith(10000);
    expect(transport.mock.calls[0][1].signal).toBe(controller.signal);
    expect(controller.signal.aborted).toBe(true);
    expect(aborted).toHaveBeenCalledTimes(1);
    expect(sign).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(502);
    expect(JSON.parse(response.text)).toEqual({ error: 'NetSuite request failed' });
  });
  it('isolates fresh session tokens between two proxy instances', async () => {
    const first = await fixture('live', { sessionToken: undefined });
    const second = await fixture('live', { sessionToken: undefined });
    const tokens = [];
    for (const instance of [first, second]) {
      const response = await instance.call({ path: '/session', token: '' });
      expect(response.status).toBe(200);
      const { token } = JSON.parse(response.text);
      expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
      tokens.push(token);
    }
    expect(tokens[0]).not.toBe(tokens[1]);
    expect((await first.call({ token: tokens[1] })).status).toBe(403);
    expect((await second.call({ token: tokens[0] })).status).toBe(403);
    for (const instance of [first, second]) {
      expect(instance.sign).not.toHaveBeenCalled();
      expect(instance.transport).not.toHaveBeenCalled();
    }
    // Each token must also work in its own run, ruling out blanket refusal.
    expect((await first.call({ token: tokens[0] })).status).toBe(200);
    expect((await second.call({ token: tokens[1] })).status).toBe(200);
    expect(first.sign).toHaveBeenCalledTimes(1);
    expect(second.sign).toHaveBeenCalledTimes(1);
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
