import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export async function copyArtifact(source, target) {
  if (!(await stat(source)).isFile()) throw new Error('Build artifact must be a file');
  const bytes = await readFile(source);
  if (!bytes.length) throw new Error('Build artifact is empty');
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(source, target);
  if (!bytes.equals(await readFile(target))) throw new Error('Build artifact copy differs');
  return bytes.length;
}
const self = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === self) {
  const root = path.resolve(path.dirname(self), '../../..');
  const { projectFolder } = JSON.parse(await readFile(path.join(root, 'template.config.json'), 'utf8'));
  if (!/^[a-z][a-z0-9.-]{2,49}$/.test(projectFolder) || projectFolder.includes('..')) throw new Error('Invalid projectFolder');
  const target = path.join(root, 'apps/netsuite/src/FileCabinet/SuiteScripts', projectFolder, 'app/index.html');
  const bytes = await copyArtifact(path.join(root, 'apps/vite-spa/dist/index.html'), target);
  console.log('SDF artifact copied and byte-verified: ' + bytes + ' bytes → ' + path.relative(root, target));
}
