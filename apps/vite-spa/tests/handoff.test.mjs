import { expect, it, vi } from 'vitest';
import { copyFile, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { copyArtifact } from '../scripts/copy-to-sdf.mjs';
vi.mock('node:fs/promises', async importOriginal => {
  const actual = await importOriginal();
  return { ...actual, copyFile: vi.fn(actual.copyFile) };
});
it('copies the exact artifact into a path with spaces', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'nvs artifact '));
  try {
    const source = path.join(root, 'index.html'), target = path.join(root, 'FileCabinet/app/index.html');
    const bytes = Buffer.from('<!doctype html>\n<p>Hello ☀</p>');
    await writeFile(source, bytes); await copyArtifact(source, target);
    expect(await readFile(target)).toEqual(bytes);
  } finally { await rm(root, { recursive: true, force: true }); }
});
it('rejects a missing or empty build output', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'nvs missing '));
  try {
    await expect(copyArtifact(path.join(root, 'missing.html'), path.join(root, 'target.html'))).rejects.toThrow(/ENOENT/);
    await writeFile(path.join(root, 'empty.html'), '');
    await expect(copyArtifact(path.join(root, 'empty.html'), path.join(root, 'target.html'))).rejects.toThrow(/empty/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
it('rejects a copied artifact corrupted before byte verification', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'nvs corrupt '));
  try {
    const source = path.join(root, 'index.html'), target = path.join(root, 'app/index.html');
    const bytes = Buffer.from('<!doctype html>\n<p>Hello</p>');
    await writeFile(source, bytes);
    const actual = await vi.importActual('node:fs/promises');
    vi.mocked(copyFile).mockImplementationOnce(async (from, to) => {
      await actual.copyFile(from, to);
      const corrupted = await actual.readFile(to);
      corrupted[corrupted.length - 1] ^= 1;
      await actual.writeFile(to, corrupted);
    });
    await expect(copyArtifact(source, target)).rejects.toThrow('Build artifact copy differs');
    expect(await readFile(source)).toEqual(bytes);
    expect((await readFile(target)).length).toBe(bytes.length);
    expect(await readFile(target)).not.toEqual(bytes);
  } finally { await rm(root, { recursive: true, force: true }); }
});
