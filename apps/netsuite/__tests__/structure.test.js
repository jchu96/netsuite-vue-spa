const { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { validateStructure } = require('../scripts/validate-structure.cjs');
const config = require('../../../template.config.json');
const folder = 'FileCabinet/SuiteScripts/' + config.projectFolder + '/';
const rl = config.projectName + '_SPA_Data_RL.js';
const sl = config.projectName + '_SPA_Render_SL.js';
const recordObject = 'Objects/customrecord_' + config.prefix + '_hello.xml';
const rlObject = 'Objects/customscript_' + config.prefix + '_hello_rl.xml';
const slObject = 'Objects/customscript_' + config.prefix + '_hello_sl.xml';
let fixture;
beforeEach(() => {
  fixture = mkdtempSync(path.join(tmpdir(), 'nvs structure '));
  cpSync(path.resolve('src'), fixture, { recursive: true });
});
afterEach(() => rmSync(fixture, { recursive: true, force: true }));
test('account-free SDF structure references all real files and parses every script', () => {
  expect(validateStructure(path.resolve('src'))).toEqual({ objects: 3, scripts: 2, artifact: true });
});
test.each([
 ['manifest.xml', () => '<manifest>'],
 ['deploy.xml', text => text.replace('~/Objects/*', '~/Missing/*')],
 [rlObject, text => text.replace(rl, 'Missing.js')],
 [folder + rl, () => 'invalid javascript {'],
 [folder + 'app/index.html', () => '<html>missing slot</html>'],
])('structural oracle rejects broken %s', (relative, mutate) => {
  const file = path.join(fixture, relative); writeFileSync(file, mutate(readFileSync(file, 'utf8')));
  expect(() => validateStructure(fixture)).toThrow();
});
test('generator reproduces tracked source bytes and refuses overwrite', () => {
  const generated = path.join(fixture, 'fresh');
  const generator = path.resolve('../../scripts/generate.mjs');
  execFileSync(process.execPath, [generator, '--output', generated]);
  for (const file of ['manifest.xml', 'deploy.xml', recordObject, rlObject, slObject, folder + rl, folder + sl]) {
    expect(readFileSync(path.join(generated, file))).toEqual(readFileSync(path.resolve('src', file)));
  }
  expect(() => execFileSync(process.execPath, [generator, '--output', generated], { stdio: 'pipe' })).toThrow(/Refusing to overwrite/);
});

test.each([['--unknown'], ['--output'], ['--output', '--force']])('generator rejects malformed CLI arguments %p', args => {
  expect(() => execFileSync(process.execPath, [path.resolve('../../scripts/generate.mjs'), ...args], { stdio: 'pipe' })).toThrow(/Usage:/);
});
