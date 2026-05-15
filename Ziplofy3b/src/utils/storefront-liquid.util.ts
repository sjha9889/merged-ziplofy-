import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import { Types } from 'mongoose';
import { CustomTheme } from '../models/custom-theme.model';
import { InstalledThemes } from '../models/installed-themes.model';
import { Store } from '../models/store/store.model';
import { Theme } from '../models/theme.model';
import { ensureCatalogThemeCodeDir } from './theme-zip-from-s3.util';

export type StorefrontThemePaths = {
  appliedThemeId: string;
  runtimeThemeKey: string;
  isCustomTheme: boolean;
  themeName: string | null;
  runtimeBaseDir: string;
  runtimeBaseUrl: string;
};

export async function resolveAppliedStorefrontTheme(
  req: Request,
  storeId: string
): Promise<StorefrontThemePaths | null> {
  const storeDoc = await Store.findById(storeId).select('appliedTheme').lean();
  const appliedThemeId = storeDoc?.appliedTheme ? String(storeDoc.appliedTheme) : null;
  if (!appliedThemeId) return null;

  const installed = await InstalledThemes.findOne({
    store: new Types.ObjectId(storeId),
    theme: new Types.ObjectId(appliedThemeId),
    uninstalledAt: null,
  }).lean();
  if (!installed) return null;

  const theme = await Theme.findById(appliedThemeId).lean();
  const customTheme = !theme ? await CustomTheme.findById(appliedThemeId).lean() : null;
  if (!theme && !customTheme) return null;

  const isCustomTheme = Boolean(!theme && customTheme);
  const runtimeThemeKey = isCustomTheme ? `custom-${appliedThemeId}` : appliedThemeId;
  const host = req.get('host') || 'localhost';

  let runtimeBaseDir: string;
  if (isCustomTheme) {
    const storeThemeDir = path.join(
      process.cwd(),
      'uploads',
      'stores',
      storeId,
      'themes',
      String(runtimeThemeKey)
    );
    const unzippedThemeDir = path.join(storeThemeDir, 'unzippedTheme');
    runtimeBaseDir = fs.existsSync(unzippedThemeDir) ? unzippedThemeDir : storeThemeDir;
  } else {
    runtimeBaseDir = await ensureCatalogThemeCodeDir(theme!);
  }

  const runtimeBaseUrl = `${req.protocol}://${host}/api/themes/installed/${encodeURIComponent(
    storeId
  )}/${encodeURIComponent(String(runtimeThemeKey))}/runtime`;

  const themeName = isCustomTheme
    ? (customTheme as { name?: string })?.name ?? null
    : (theme as { name?: string })?.name ?? null;

  return {
    appliedThemeId,
    runtimeThemeKey,
    isCustomTheme,
    themeName,
    runtimeBaseDir,
    runtimeBaseUrl,
  };
}

export function themeHasLiquidTemplates(runtimeBaseDir: string): boolean {
  return fs.existsSync(path.join(runtimeBaseDir, 'templates', 'index.liquid'));
}

const LIQUID_TEMPLATE_NAME = /^[a-z][a-z0-9_-]{0,63}$/;

export function listLiquidTemplateNames(runtimeBaseDir: string): string[] {
  const dir = path.join(runtimeBaseDir, 'templates');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.liquid'))
    .map((f) => f.replace(/\.liquid$/i, ''))
    .filter((name) => LIQUID_TEMPLATE_NAME.test(name))
    .sort();
}

export function isSafeLiquidTemplateName(name: string): boolean {
  return typeof name === 'string' && LIQUID_TEMPLATE_NAME.test(name);
}
