import extract from 'extract-zip';
import fs from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { CustomError } from './error.utils';
import { downloadS3KeyToFile, listAllObjectKeysUnderPrefix } from './theme-s3-ingest';

/** If the zip contained a single top-level folder, lift its contents into `targetDir`. */
export function normalizeExtractedSingleTopLevelWrapper(targetDir: string) {
  const items = fs.readdirSync(targetDir);
  if (items.length !== 1) return;
  const onlyItemPath = path.join(targetDir, items[0]);
  const stat = fs.statSync(onlyItemPath);
  if (!stat.isDirectory()) return;
  const moveUp = (src: string, dest: string) => {
    const entries = fs.readdirSync(src);
    entries.forEach((entry) => {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      const s = fs.statSync(srcPath);
      if (s.isDirectory()) {
        if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
        moveUp(srcPath, destPath);
      } else {
        fs.renameSync(srcPath, destPath);
      }
    });
  };
  moveUp(onlyItemPath, targetDir);
  fs.rmSync(onlyItemPath, { recursive: true, force: true });
}

/**
 * Download every object under an S3 prefix into `destCodeDir`, preserving relative paths
 * (directory is replaced if it already exists).
 */
export async function downloadS3PrefixToLocalDir(prefix: string, destCodeDir: string): Promise<void> {
  const p = prefix.endsWith('/') ? prefix : `${prefix}/`;
  if (fs.existsSync(destCodeDir)) fs.rmSync(destCodeDir, { recursive: true, force: true });
  fs.mkdirSync(destCodeDir, { recursive: true });
  const allKeys = await listAllObjectKeysUnderPrefix(p);
  if (allKeys.length === 0) {
    throw new CustomError('Theme folder is empty in S3', 404);
  }
  for (const key of allKeys) {
    const rel = key.slice(p.length);
    if (!rel || rel.includes('..')) continue;
    const outPath = path.join(destCodeDir, rel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    await downloadS3KeyToFile(key, outPath);
  }
}

/**
 * Download a theme ZIP from S3 and extract Liquid sources into `destCodeDir`
 * (directory is replaced if it already exists).
 */
export async function downloadS3ZipAndExtractToDir(zipKey: string, destCodeDir: string): Promise<void> {
  const tmpZip = path.join(tmpdir(), `ziplofy-theme-${Date.now()}-${Math.random().toString(36).slice(2)}.zip`);
  if (fs.existsSync(destCodeDir)) fs.rmSync(destCodeDir, { recursive: true, force: true });
  fs.mkdirSync(destCodeDir, { recursive: true });
  await downloadS3KeyToFile(zipKey, tmpZip);
  await extract(tmpZip, { dir: destCodeDir });
  fs.unlinkSync(tmpZip);
  normalizeExtractedSingleTopLevelWrapper(destCodeDir);
}
