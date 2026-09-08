import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const document = process.argv[2] || path.join(root, 'docs/CHANGES-FROM-UPSTREAM.md');

try {
  if (process.argv.length > 3) throw new Error('Usage: node scripts/verify-upstream-kept.mjs [document]');
  const text = readFileSync(document, 'utf8').replaceAll('\r\n', '\n');
  const section = text.match(/^## Kept byte-for-byte\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1];
  if (!section) throw new Error('Missing Kept byte-for-byte section');
  const table = section.split('\n').filter(line => line.trimStart().startsWith('|'));
  if (table[0] !== '| Path | SHA-1 | Purpose |' || table[1] !== '|---|---|---|') {
    throw new Error('Malformed kept table header');
  }
  if (table.length < 3) throw new Error('No kept rows');
  const seen = new Set();
  for (const line of table.slice(2)) {
    const row = line.match(/^\| `([^`]+)` \| `([0-9a-f]{40})` \| ([^|]+) \|$/);
    if (!row || !row[3].trim()) throw new Error('Malformed kept row');
    const [, filename, expected] = row;
    if (!/^apps\/vite-spa\/(?:[\w.-]+\/)*[\w.-]+$/.test(filename) ||
        filename.split('/').some(part => part === '.' || part === '..')) {
      throw new Error('Invalid kept path');
    }
    if (seen.has(filename)) throw new Error('Duplicate kept path: ' + filename);
    seen.add(filename);
    let actual;
    try {
      actual = execFileSync('git', ['hash-object', '--no-filters', '--', filename], {
        cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      }).trim();
    } catch {
      console.log('MISMATCH ' + filename + ' expected=' + expected + ' actual=unavailable (check file and Git)');
      process.exitCode = 1;
      continue;
    }
    if (actual === expected) console.log('OK ' + filename + ' ' + actual);
    else {
      console.log('MISMATCH ' + filename + ' expected=' + expected + ' actual=' + actual);
      process.exitCode = 1;
    }
  }
} catch (error) {
  console.error('MISMATCH ' + error.message);
  process.exitCode = 1;
}
