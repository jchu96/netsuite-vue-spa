const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const config = require('../../../template.config.json');
let root;
beforeAll(() => {
  root = mkdtempSync(path.join(tmpdir(), 'nvs generated '));
  execFileSync(process.execPath, [path.resolve('../../scripts/generate.mjs'), '--output', root]);
});
afterAll(() => rmSync(root, { recursive: true, force: true }));
function load(kind, overrides = {}) {
  const mocks = {
    'N/query': { runSuiteQL: jest.fn(() => ({ asMappedResults: () => [{ id: 1, name: 'Hello world' }] })) },
    'N/runtime': { getCurrentUser: () => ({ id: 1 }) },
    'N/log': { error: jest.fn() },
    'N/file': { load: jest.fn(() => ({ getContents: () => '<html><!--NETSUITE_CONFIG--><div>Hello</div></html>' })) },
    'N/url': { resolveScript: () => '/app/site/hosting/restlet.nl?script=customscript_nvs_hello_rl&deploy=customdeploy_nvs_hello_rl' },
    ...overrides,
  };
  const filename = path.join(root, 'FileCabinet/SuiteScripts/' + config.projectFolder + '/' + config.projectName + '_SPA_' + kind + '.js');
  let module;
  vm.runInNewContext(readFileSync(filename, 'utf8'), { define: (names, factory) => { module = factory(...names.map(name => mocks[name])); } }, { filename });
  return { module, mocks };
}
test('generated RESTlet binds request values', () => {
  const { module, mocks } = load('Data_RL');
  const name = "Hello' OR 1=1 --";
  expect(module.post({ task: 'helloRecord', name }).success).toBe(true);
  const options = mocks['N/query'].runSuiteQL.mock.calls[0][0];
  expect(options.query).toBe('SELECT TOP 1 id, name FROM customrecord_' + config.prefix + '_hello WHERE name = ? AND isinactive = ? ORDER BY id');
  expect(options.params).toEqual([name, 'F']);
  expect(options.metaDataProvider).toBe('SUITE_QL');
});
test.each([null, [], {}, { task: 'helloRecord', name: '' }, { task: 'helloRecord', name: 'x'.repeat(81) }, { task: 'delete', name: 'Hello' }, { task: 'helloRecord', name: 'Hello', id: 2 }])('generated RESTlet rejects invalid input %p without querying', body => {
  const { module, mocks } = load('Data_RL');
  expect(module.post(body).error.code).toBe('INVALID_REQUEST');
  expect(mocks['N/query'].runSuiteQL).not.toHaveBeenCalled();
});
test.each([0, -4, undefined, 'invalid'])('generated scripts deny unauthenticated user %p', id => {
  const runtime = { getCurrentUser: () => ({ id }) };
  const rl = load('Data_RL', { 'N/runtime': runtime });
  expect(rl.module.post({ task: 'helloRecord', name: 'Hello' }).error.code).toBe('ACCESS_DENIED');
  expect(rl.mocks['N/query'].runSuiteQL).not.toHaveBeenCalled();
  const sl = load('Render_SL', { 'N/runtime': runtime });
  const response = { setHeader: jest.fn(), write: jest.fn() };
  sl.module.onRequest({ request: { method: 'GET' }, response });
  expect(response.write).toHaveBeenCalledWith('Access denied');
  expect(sl.mocks['N/file'].load).not.toHaveBeenCalled();
});
test('sanitized RESTlet failure excludes raw error data from response and logs', () => {
  const { module, mocks } = load('Data_RL', { 'N/query': { runSuiteQL: () => { throw Error('synthetic-secret-marker'); } } });
  const result = module.post({ task: 'helloRecord', name: 'Hello' });
  expect(result.error.code).toBe('INTERNAL_ERROR');
  expect(result.error.reference).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
  expect(JSON.stringify([result, mocks['N/log'].error.mock.calls])).not.toContain('synthetic-secret-marker');
  expect(Object.keys(mocks['N/log'].error.mock.calls[0][0].details).sort()).toEqual(['code', 'reference']);
});
test('returns null for absent records and maps id to a string', () => {
  expect(load('Data_RL').module.post({ task: 'helloRecord', name: 'Hello' }).data.id).toBe('1');
  const { module } = load('Data_RL', { 'N/query': { runSuiteQL: () => ({ asMappedResults: () => [] }) } });
  expect(module.post({ task: 'helloRecord', name: 'Missing' }).data).toBe(null);
});
test('Suitelet injects the same-account endpoint into the built artifact', () => {
  const { module, mocks } = load('Render_SL');
  const response = { setHeader: jest.fn(), write: jest.fn() };
  module.onRequest({ request: { method: 'GET', headers: { Cookie: 'synthetic-cookie' }, parameters: { secret: 'synthetic-secret-marker' } }, response });
  const html = response.write.mock.calls[0][0];
  expect(html).toContain('name="netsuite-restlet"');
  expect(html).toContain('&amp;deploy=');
  expect(html).not.toContain('NETSUITE_CONFIG');
  expect(mocks['N/log'].error).not.toHaveBeenCalled();
  expect(JSON.stringify(response.write.mock.calls)).not.toMatch(/synthetic-cookie|synthetic-secret-marker/);
});
test('sanitized Suitelet failure excludes raw request and error data', () => {
  const { module, mocks } = load('Render_SL', { 'N/file': { load: () => { throw Error('synthetic-secret-marker'); } } });
  const response = { setHeader: jest.fn(), write: jest.fn() };
  module.onRequest({ request: { method: 'GET', headers: { Cookie: 'synthetic-cookie' }, parameters: { password: 'synthetic-password' } }, response });
  expect(response.write.mock.calls[0][0]).toMatch(/^Unable to open the application. Reference:/);
  expect(JSON.stringify([response.write.mock.calls, mocks['N/log'].error.mock.calls])).not.toMatch(/synthetic-secret-marker|synthetic-cookie|synthetic-password/);
});
