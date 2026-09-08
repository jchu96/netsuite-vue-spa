import { readFile, readdir, mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function templateValues(config) {
  if (!config || Object.keys(config).sort().join(',') !== 'displayName,prefix,projectFolder,projectName' ||
      !/^[a-z]{2,6}$/.test(config.prefix) || !/^[A-Z][A-Za-z0-9]{0,19}$/.test(config.projectName) ||
      !/^[A-Za-z][A-Za-z0-9 .-]{0,49}$/.test(config.displayName) ||
      !/^[a-z][a-z0-9.-]{2,49}$/.test(config.projectFolder) || config.projectFolder.includes('..')) {
    throw new Error('Invalid template configuration');
  }
  return { PREFIX: config.prefix, PROJECT_NAME: config.projectName, PROJECT_NAME_DISPLAY: config.displayName, PROJECT_FOLDER: config.projectFolder };
}
export function render(text, config) {
  const values = templateValues(config);
  return text.replace(/\{([A-Z_]+)\}/g, (_, key) => {
    if (!(key in values)) throw new Error('Unknown template variable: ' + key);
    return values[key];
  });
}
export async function generate(config, destination, { overwrite = false } = {}) {
  templateValues(config);
  const entries = [];
  for (const [directory, target] of [['scripts', 'FileCabinet/SuiteScripts/' + config.projectFolder], ['objects', 'Objects']]) {
    for (const name of await readdir(path.join(root, 'apps/netsuite/_templates', directory))) {
      if (!name.endsWith('.template')) continue;
      entries.push([path.join(destination, target, render(name.slice(0, -9), config)), render(await readFile(path.join(root, 'apps/netsuite/_templates', directory, name), 'utf8'), config)]);
    }
  }
  entries.push([path.join(destination, 'manifest.xml'), '<manifest projecttype="ACCOUNTCUSTOMIZATION">\n  <projectname>' + config.projectFolder + '</projectname>\n  <frameworkversion>1.0</frameworkversion>\n  <dependencies><features><feature required="true">SERVERSIDESCRIPTING</feature><feature required="true">CUSTOMRECORDS</feature></features></dependencies>\n</manifest>\n']);
  entries.push([path.join(destination, 'deploy.xml'), '<deploy>\n  <files><path>~/FileCabinet/SuiteScripts/' + config.projectFolder + '/*</path></files>\n  <objects><path>~/Objects/*</path></objects>\n</deploy>\n']);
  if (!overwrite) for (const [filename] of entries) {
    try { await access(filename); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    throw new Error('Refusing to overwrite ' + filename);
  }
  for (const [filename, text] of entries) { await mkdir(path.dirname(filename), { recursive: true }); await writeFile(filename, text); }
  return entries.map(([filename]) => filename);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const outputIndex = args.indexOf('--output');
  const destination = outputIndex >= 0 ? args[outputIndex + 1] : path.join(root, 'apps/netsuite/src');
  if (!destination || args.some((arg, i) => arg !== '--force' && arg !== '--output' && i !== outputIndex + 1)) throw new Error('Usage: npm run generate -- [--force] [--output PATH]');
  const config = JSON.parse(await readFile(path.join(root, 'template.config.json'), 'utf8'));
  const files = await generate(config, path.resolve(destination), { overwrite: force });
  console.log('Generated ' + files.length + ' SDF files');
}
