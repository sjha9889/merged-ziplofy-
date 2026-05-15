"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAppliedStorefrontTheme = resolveAppliedStorefrontTheme;
exports.themeHasLiquidTemplates = themeHasLiquidTemplates;
exports.listLiquidTemplateNames = listLiquidTemplateNames;
exports.isSafeLiquidTemplateName = isSafeLiquidTemplateName;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const custom_theme_model_1 = require("../models/custom-theme.model");
const installed_themes_model_1 = require("../models/installed-themes.model");
const store_model_1 = require("../models/store/store.model");
const theme_model_1 = require("../models/theme.model");
const theme_zip_from_s3_util_1 = require("./theme-zip-from-s3.util");
async function resolveAppliedStorefrontTheme(req, storeId) {
    const storeDoc = await store_model_1.Store.findById(storeId).select('appliedTheme').lean();
    const appliedThemeId = storeDoc?.appliedTheme ? String(storeDoc.appliedTheme) : null;
    if (!appliedThemeId)
        return null;
    const installed = await installed_themes_model_1.InstalledThemes.findOne({
        store: new mongoose_1.Types.ObjectId(storeId),
        theme: new mongoose_1.Types.ObjectId(appliedThemeId),
        uninstalledAt: null,
    }).lean();
    if (!installed)
        return null;
    const theme = await theme_model_1.Theme.findById(appliedThemeId).lean();
    const customTheme = !theme ? await custom_theme_model_1.CustomTheme.findById(appliedThemeId).lean() : null;
    if (!theme && !customTheme)
        return null;
    const isCustomTheme = Boolean(!theme && customTheme);
    const runtimeThemeKey = isCustomTheme ? `custom-${appliedThemeId}` : appliedThemeId;
    const host = req.get('host') || 'localhost';
    let runtimeBaseDir;
    if (isCustomTheme) {
        const storeThemeDir = path_1.default.join(process.cwd(), 'uploads', 'stores', storeId, 'themes', String(runtimeThemeKey));
        const unzippedThemeDir = path_1.default.join(storeThemeDir, 'unzippedTheme');
        runtimeBaseDir = fs_1.default.existsSync(unzippedThemeDir) ? unzippedThemeDir : storeThemeDir;
    }
    else {
        runtimeBaseDir = await (0, theme_zip_from_s3_util_1.ensureCatalogThemeCodeDir)(theme);
    }
    const runtimeBaseUrl = `${req.protocol}://${host}/api/themes/installed/${encodeURIComponent(storeId)}/${encodeURIComponent(String(runtimeThemeKey))}/runtime`;
    const themeName = isCustomTheme
        ? customTheme?.name ?? null
        : theme?.name ?? null;
    return {
        appliedThemeId,
        runtimeThemeKey,
        isCustomTheme,
        themeName,
        runtimeBaseDir,
        runtimeBaseUrl,
    };
}
function themeHasLiquidTemplates(runtimeBaseDir) {
    return fs_1.default.existsSync(path_1.default.join(runtimeBaseDir, 'templates', 'index.liquid'));
}
const LIQUID_TEMPLATE_NAME = /^[a-z][a-z0-9_-]{0,63}$/;
function listLiquidTemplateNames(runtimeBaseDir) {
    const dir = path_1.default.join(runtimeBaseDir, 'templates');
    if (!fs_1.default.existsSync(dir))
        return [];
    return fs_1.default
        .readdirSync(dir)
        .filter((f) => f.endsWith('.liquid'))
        .map((f) => f.replace(/\.liquid$/i, ''))
        .filter((name) => LIQUID_TEMPLATE_NAME.test(name))
        .sort();
}
function isSafeLiquidTemplateName(name) {
    return typeof name === 'string' && LIQUID_TEMPLATE_NAME.test(name);
}
