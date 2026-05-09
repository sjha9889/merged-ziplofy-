"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveStorefrontThemeRuntime = resolveStorefrontThemeRuntime;
exports.themeHasLiquidTemplates = themeHasLiquidTemplates;
exports.listLiquidTemplateNames = listLiquidTemplateNames;
exports.isSafeLiquidTemplateName = isSafeLiquidTemplateName;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const installed_themes_model_1 = require("../models/installed-themes.model");
const theme_model_1 = require("../models/theme.model");
const custom_theme_model_1 = require("../models/custom-theme.model");
const store_model_1 = require("../models/store/store.model");
const installed_themes_query_util_1 = require("./installed-themes-query.util");
/**
 * Resolve installed theme directory and public asset base URL for a store.
 * Mirrors logic in getStorefrontThemeRuntime for path consistency.
 */
async function resolveStorefrontThemeRuntime(req, storeId) {
    if (!storeId)
        return null;
    const storeDoc = await store_model_1.Store.findById(storeId).select("appliedTheme").lean();
    const appliedThemeId = storeDoc?.appliedTheme ? String(storeDoc.appliedTheme) : null;
    if (!appliedThemeId)
        return null;
    const installedTheme = await installed_themes_model_1.InstalledThemes.findOne({
        $and: [
            { $or: (0, installed_themes_query_util_1.storeAndUserScopeOr)(String(storeId)) },
            { theme: new mongoose_1.Types.ObjectId(appliedThemeId) },
            { uninstalledAt: null },
        ],
    }).lean();
    const theme = await theme_model_1.Theme.findById(appliedThemeId).lean();
    const customTheme = !theme ? await custom_theme_model_1.CustomTheme.findById(appliedThemeId).lean() : null;
    if (!theme && !customTheme)
        return null;
    const isCustomTheme = Boolean(!theme && customTheme);
    const runtimeThemeKey = isCustomTheme ? `custom-${appliedThemeId}` : appliedThemeId;
    const canonicalStoreThemeDir = path_1.default.join(process.cwd(), "uploads", "stores", storeId, "themes", String(runtimeThemeKey));
    const storeThemeDir = installedTheme?.storePath && fs_1.default.existsSync(installedTheme.storePath)
        ? installedTheme.storePath
        : canonicalStoreThemeDir;
    const unzippedThemeDir = path_1.default.join(storeThemeDir, "unzippedTheme");
    const runtimeBaseDir = fs_1.default.existsSync(unzippedThemeDir) ? unzippedThemeDir : storeThemeDir;
    const host = req.get("host") || "localhost";
    const runtimeBaseUrl = `${req.protocol}://${host}/api/themes/installed/${encodeURIComponent(storeId)}/${encodeURIComponent(String(runtimeThemeKey))}/unzippedTheme`;
    const themeName = isCustomTheme ? customTheme?.name ?? null : theme?.name ?? null;
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
function themeHasLiquidTemplates(runtimeBaseDir) {
    const p = path_1.default.join(runtimeBaseDir, "templates", "index.liquid");
    return fs_1.default.existsSync(p);
}
const LIQUID_TEMPLATE_NAME = /^[a-z][a-z0-9_-]{0,63}$/;
/** Basenames of `templates/*.liquid` (e.g. `index`, `blog-detail`). */
function listLiquidTemplateNames(runtimeBaseDir) {
    const dir = path_1.default.join(runtimeBaseDir, "templates");
    if (!fs_1.default.existsSync(dir))
        return [];
    return fs_1.default
        .readdirSync(dir)
        .filter((f) => f.endsWith(".liquid"))
        .map((f) => f.replace(/\.liquid$/i, ""))
        .filter((name) => LIQUID_TEMPLATE_NAME.test(name))
        .sort();
}
function isSafeLiquidTemplateName(name) {
    return typeof name === "string" && LIQUID_TEMPLATE_NAME.test(name);
}
