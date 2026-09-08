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
const roleObject = 'Objects/customrole_' + config.prefix + '_hello_viewer.xml';
const rlObject = 'Objects/customscript_' + config.prefix + '_hello_rl.xml';
const slObject = 'Objects/customscript_' + config.prefix + '_hello_sl.xml';
let fixture;
beforeEach(() => {
  fixture = mkdtempSync(path.join(tmpdir(), 'nvs structure '));
  cpSync(path.resolve('src'), fixture, { recursive: true });
});
afterEach(() => rmSync(fixture, { recursive: true, force: true }));
test('account-free SDF structure references all real files and parses every script', () => {
  expect(validateStructure(path.resolve('src'))).toEqual({ objects: 4, scripts: 2, artifact: true });
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
const unsafePostures = [
  [rlObject, 'status', text => text.replace('<status>TESTING</status>', '<status>RELEASED</status>')],
  [slObject, 'status', text => text.replace('<status>TESTING</status>', '')],
  ...[rlObject, slObject].flatMap(object => [
    [object, 'allroles', text => text.replace('</scriptdeployment>', '<audience><allroles>T</allroles></audience></scriptdeployment>')],
    [object, 'runasrole', text => text.replace('</scriptdeployment>', '<runasrole>ADMINISTRATOR</runasrole></scriptdeployment>')],
  ]),
  [slObject, 'isonline', text => text.replace('<isonline>F</isonline>', '<isonline>T</isonline>')],
  [slObject, 'isonline', text => text.replace('<isonline>F</isonline>', '')],
];
test.each(unsafePostures)('deployment posture rejects %s <%s>', (relative, element, mutate) => {
  const file = path.join(fixture, relative);
  writeFileSync(file, mutate(readFileSync(file, 'utf8')));
  expect(() => validateStructure(fixture)).toThrow(relative + ': <' + element + '>');
});
test.each(unsafePostures)('deployment posture checks a second deployment in %s <%s>', (relative, element, mutate) => {
  const file = path.join(fixture, relative);
  const text = readFileSync(file, 'utf8');
  const deployment = text.match(/<scriptdeployment\s[\s\S]*?<\/scriptdeployment>/)[0];
  const second = mutate(deployment.replace('scriptid="customdeploy_', 'scriptid="customdeploy_second_'));
  writeFileSync(file, text.replace('</scriptdeployments>', second + '</scriptdeployments>'));
  expect(() => validateStructure(fixture)).toThrow(relative + ': <' + element + '>');
});
test.each([rlObject, slObject])('deployment posture requires a live deployment in %s', relative => {
  const file = path.join(fixture, relative);
  writeFileSync(file, readFileSync(file, 'utf8').replace(/<scriptdeployments>[\s\S]*?<\/scriptdeployments>/, '<!-- no deployments -->'));
  expect(() => validateStructure(fixture)).toThrow(relative + ': <scriptdeployment>');
});
test.each([rlObject, slObject])('deployment posture accepts multiple restricted deployments in %s', relative => {
  const file = path.join(fixture, relative);
  const text = readFileSync(file, 'utf8');
  const deployment = text.match(/<scriptdeployment\s[\s\S]*?<\/scriptdeployment>/)[0];
  const second = deployment.replace('scriptid="customdeploy_', 'scriptid="customdeploy_second_')
    .replace('</scriptdeployment>', '<audience><allroles>F</allroles></audience></scriptdeployment>');
  writeFileSync(file, text.replace('</scriptdeployments>', second + '</scriptdeployments>'));
  expect(validateStructure(fixture).scripts).toBe(2);
});
test('generator reproduces tracked source bytes and refuses overwrite', () => {
  const generated = path.join(fixture, 'fresh');
  const generator = path.resolve('../../scripts/generate.mjs');
  execFileSync(process.execPath, [generator, '--output', generated]);
  for (const file of ['manifest.xml', 'deploy.xml', recordObject, roleObject, rlObject, slObject, folder + rl, folder + sl]) {
    expect(readFileSync(path.join(generated, file))).toEqual(readFileSync(path.resolve('src', file)));
  }
  expect(() => execFileSync(process.execPath, [generator, '--output', generated], { stdio: 'pipe' })).toThrow(/Refusing to overwrite/);
});

test.each([['--unknown'], ['--output'], ['--output', '--force']])('generator rejects malformed CLI arguments %p', args => {
  expect(() => execFileSync(process.execPath, [path.resolve('../../scripts/generate.mjs'), ...args], { stdio: 'pipe' })).toThrow(/Usage:/);
});
