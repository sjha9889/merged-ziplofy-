import fs from "fs";
import path from "path";
import { Request } from "express";
import { Types } from "mongoose";
import { InstalledThemes } from "../models/installed-themes.model";
import { Theme } from "../models/theme.model";
import { CustomTheme } from "../models/custom-theme.model";
import { Store } from "../models/store/store.model";
import { storeAndUserScopeOr } from "./installed-themes-query.util";

export type ResolvedStorefrontThemeRuntime = {
  storeId: string;
  appliedThemeId: string;
  runtimeThemeKey: string;
  isCustomTheme: boolean;
  themeName: string | null;
  storeThemeDir: string;
  runtimeBaseDir: string;
  /** Public base URL for theme static files (matches getStorefrontThemeRuntime htmlUrls prefix). */
  runtimeBaseUrl: string;
  installedThemeRecord: Awaited<ReturnType<typeof InstalledThemes.findOne>> | null;
};

/**
 * Resolve installed theme directory and public asset base URL for a store.
 * Mirrors logic in getStorefrontThemeRuntime for path consistency.
 */
export async function resolveStorefrontThemeRuntime(
  req: Request,
  storeId: string
): Promise<ResolvedStorefrontThemeRuntime | null> {
  if (!storeId) return null;

  const storeDoc = await Store.findById(storeId).select("appliedTheme").lean();
  const appliedThemeId = storeDoc?.appliedTheme ? String(storeDoc.appliedTheme) : null;
  if (!appliedThemeId) return null;

  const installedTheme = await InstalledThemes.findOne({
    $and: [
      { $or: storeAndUserScopeOr(String(storeId)) },
      { theme: new Types.ObjectId(appliedThemeId) },
      { uninstalledAt: null },
    ],
  }).lean();

  const theme = await Theme.findById(appliedThemeId).lean();
  const customTheme = !theme ? await CustomTheme.findById(appliedThemeId).lean() : null;
  if (!theme && !customTheme) return null;

  const isCustomTheme = Boolean(!theme && customTheme);
  const runtimeThemeKey = isCustomTheme ? `custom-${appliedThemeId}` : appliedThemeId;

  const canonicalStoreThemeDir = path.join(
    process.cwd(),
    "uploads",
    "stores",
    storeId,
    "themes",
    String(runtimeThemeKey)
  );
  const storeThemeDir =
    installedTheme?.storePath && fs.existsSync(installedTheme.storePath)
      ? installedTheme.storePath
      : canonicalStoreThemeDir;

  const unzippedThemeDir = path.join(storeThemeDir, "unzippedTheme");
  const runtimeBaseDir = fs.existsSync(unzippedThemeDir) ? unzippedThemeDir : storeThemeDir;

  const host = req.get("host") || "localhost";
  const runtimeBaseUrl = `${req.protocol}://${host}/api/themes/installed/${encodeURIComponent(
    storeId
  )}/${encodeURIComponent(String(runtimeThemeKey))}/unzippedTheme`;

  const themeName = isCustomTheme ? (customTheme as { name?: string })?.name ?? null : (theme as { name?: string })?.name ?? null;

  return {
    storeId,
    appliedThemeId,
    runtimeThemeKey,
    isCustomTheme,
    themeName,
    storeThemeDir,
    runtimeBaseDir,
    runtimeBaseUrl,
    installedThemeRecord: installedTheme,
  };
}

export function themeHasLiquidTemplates(runtimeBaseDir: string): boolean {
  const p = path.join(runtimeBaseDir, "templates", "index.liquid");
  return fs.existsSync(p);
}

const LIQUID_TEMPLATE_NAME = /^[a-z][a-z0-9_-]{0,63}$/;

/** Basenames of `templates/*.liquid` (e.g. `index`, `blog-detail`). */
export function listLiquidTemplateNames(runtimeBaseDir: string): string[] {
  const dir = path.join(runtimeBaseDir, "templates");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".liquid"))
    .map((f) => f.replace(/\.liquid$/i, ""))
    .filter((name) => LIQUID_TEMPLATE_NAME.test(name))
    .sort();
}

export function isSafeLiquidTemplateName(name: string): boolean {
  return typeof name === "string" && LIQUID_TEMPLATE_NAME.test(name);
}
