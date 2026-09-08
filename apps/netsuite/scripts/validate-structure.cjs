const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { XMLParser, XMLValidator } = require('fast-xml-parser');
function walk(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error('SDF source must not contain symlinks');
    return entry.isDirectory() ? walk(file) : [file];
  });
}
// Review incident: unsafe one-element deployment changes passed structural validation.
// Retire these defaults if the template's documented deployment contract changes.
function validatePosture(body, type, file) {
  const deployments = [].concat(body.scriptdeployments?.scriptdeployment || []);
  const fail = (element, message) => { throw new Error(file + ': <' + element + '> ' + message); };
  if (['restlet', 'suitelet'].includes(type) && !deployments.length) fail('scriptdeployment', 'is required');
  for (const deployment of deployments) {
    if (deployment.status !== 'TESTING') fail('status', 'must be TESTING');
    if (type === 'suitelet' && deployment.isonline !== 'F') fail('isonline', 'must be F');
    const checkRestricted = node => {
      for (const [element, value] of Object.entries(node)) {
        if (element === 'allroles' && [].concat(value).includes('T')) fail(element, 'must not be T');
        if (element === 'runasrole' && [].concat(value).includes('ADMINISTRATOR')) fail(element, 'must not be ADMINISTRATOR');
        if (value && typeof value === 'object') checkRestricted(value);
      }
    };
    checkRestricted(deployment);
  }
}
function validateStructure(root, { requireArtifact = true } = {}) {
  const parse = file => {
    const text = fs.readFileSync(file, 'utf8');
    if (XMLValidator.validate(text) !== true) throw new Error('Invalid XML: ' + path.relative(root, file));
    return new XMLParser({ ignoreAttributes: false }).parse(text);
  };
  const manifest = parse(path.join(root, 'manifest.xml')).manifest;
  const deploy = parse(path.join(root, 'deploy.xml')).deploy;
  if (!manifest || manifest['@_projecttype'] !== 'ACCOUNTCUSTOMIZATION' || !manifest.projectname || !manifest.frameworkversion) throw new Error('Invalid account-customization manifest');
  const features = JSON.stringify(manifest.dependencies?.features);
  if (!features?.includes('SERVERSIDESCRIPTING') || !features.includes('CUSTOMRECORDS')) throw new Error('Missing manifest features');
  const all = walk(root);
  const objects = all.filter(file => file.startsWith(path.join(root, 'Objects') + path.sep) && file.endsWith('.xml'));
  const files = all.filter(file => file.startsWith(path.join(root, 'FileCabinet') + path.sep));
  if (!objects.length || !files.length) throw new Error('SDF project has no objects or FileCabinet files');
  for (const [kind, actual] of [['objects', objects], ['files', files]]) {
    const paths = [].concat(deploy?.[kind]?.path || []);
    if (!paths.length) throw new Error('Missing deploy paths: ' + kind);
    const covered = new Set();
    for (const pattern of paths) {
      if (typeof pattern !== 'string' || !pattern.startsWith('~/') || pattern.includes('..')) throw new Error('Unsafe deploy path');
      const prefix = path.resolve(root, pattern.slice(2).replace(/\*$/, ''));
      const matches = actual.filter(file => pattern.endsWith('*') ? file.startsWith(prefix + path.sep) : file === prefix);
      if (!matches.length) throw new Error('Deploy path matches no files: ' + pattern);
      matches.forEach(file => covered.add(file));
    }
    if (actual.some(file => !covered.has(file))) throw new Error('Undeployed ' + kind + ' file');
  }
  const ids = new Set();
  const referencedScripts = new Set();
  const xmlTexts = [];
  for (const object of objects) {
    const parsed = parse(object);
    const type = Object.keys(parsed).find(key => !key.startsWith('?'));
    const body = parsed[type];
    if (!body?.['@_scriptid'] || ids.has(body['@_scriptid'])) throw new Error('Missing or duplicate object id');
    ids.add(body['@_scriptid']);
    validatePosture(body, type, path.relative(root, object));
    xmlTexts.push(fs.readFileSync(object, 'utf8'));
    if (['restlet', 'suitelet'].includes(type)) {
      if (typeof body.scriptfile !== 'string' || !/^\[\/SuiteScripts\/[^\]]+\.js\]$/.test(body.scriptfile)) throw new Error('Invalid scriptfile reference');
      const filename = path.resolve(root, 'FileCabinet', body.scriptfile.slice(2, -1));
      if (!files.includes(filename)) throw new Error('Missing scriptfile: ' + body.scriptfile);
      const script = fs.readFileSync(filename, 'utf8');
      if (!new RegExp('@NScriptType\\s+' + type, 'i').test(script)) throw new Error('Script type does not match object');
      referencedScripts.add(filename);
    }
  }
  for (const text of xmlTexts) for (const ref of text.matchAll(/\[scriptid=([^\]]+)\]/g)) {
    if (!ids.has(ref[1])) throw new Error('Unresolved object reference: ' + ref[1]);
  }
  const scripts = files.filter(file => file.endsWith('.js'));
  if (!scripts.length) throw new Error('No generated SuiteScripts');
  for (const filename of scripts) {
    execFileSync(process.execPath, ['--check', filename], { stdio: 'pipe' });
    const script = fs.readFileSync(filename, 'utf8');
    if (script.includes('@NScriptType') && !referencedScripts.has(filename)) throw new Error('Script has no SDF object');
    const dependencies = script.match(/define\(\[([^\]]*)\]/)?.[1];
    if (!dependencies) throw new Error('Missing static AMD dependencies');
    for (const [, module] of dependencies.matchAll(/['"]([^'"]+)['"]/g)) {
      if (module.startsWith('N/')) continue;
      if (!module.startsWith('./') && !module.startsWith('../')) throw new Error('Unexpected AMD dependency');
      const resolved = path.resolve(path.dirname(filename), module + (module.endsWith('.js') ? '' : '.js'));
      if (!files.includes(resolved)) throw new Error('Missing AMD dependency: ' + module);
    }
  }
  const artifact = files.find(file => file.endsWith(path.join('app', 'index.html')));
  if (requireArtifact && (!artifact || !fs.readFileSync(artifact, 'utf8').includes('<!--NETSUITE_CONFIG-->'))) throw new Error('Missing SPA build or configuration slot');
  return { objects: objects.length, scripts: scripts.length, artifact: Boolean(artifact) };
}
if (require.main === module) {
  const result = validateStructure(path.resolve(__dirname, '../src'));
  console.log('SDF structure OK: ' + result.objects + ' objects, ' + result.scripts + ' SuiteScripts parsed, deploy paths and references resolved, SPA artifact present');
}
module.exports = { validateStructure };
