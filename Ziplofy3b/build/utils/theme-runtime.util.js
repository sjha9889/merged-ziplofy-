"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreThemeLayoutPaths = getStoreThemeLayoutPaths;
exports.ensureStoreCatalogThemeMaterialized = ensureStoreCatalogThemeMaterialized;
exports.resolveStoreThemeFilePath = resolveStoreThemeFilePath;
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
const error_utils_1 = require("./error.utils");
const installed_themes_query_util_1 = require("./installed-themes-query.util");
const theme_s3_ingest_1 = require("./theme-s3-ingest");
const theme_zip_from_s3_util_1 = require("./theme-zip-from-s3.util");
function getStoreThemeLayoutPaths(storeId, themeId) {
    const storeThemeDir = path_1.default.join(process.cwd(), "uploads", "stores", storeId, "themes", themeId);
    return {
        storeThemeDir,
        runtimeBaseDir: path_1.default.join(storeThemeDir, "runtime"),
        customizationsDir: path_1.default.join(storeThemeDir, "customizations"),
        remoteThemeDistDir: path_1.default.join(storeThemeDir, "remoteThemeDist"),
    };
}
function hasThemeFiles(dir) {
    if (!fs_1.default.existsSync(dir))
        return false;
    return fs_1.default.readdirSync(dir).filter((f) => f !== ".DS_Store").length > 0;
}
/** Lazy S3 sync into store `runtime/` (not called on install). */
async function ensureStoreCatalogThemeMaterialized(storeId, themeId, theme) {
    const layout = getStoreThemeLayoutPaths(storeId, themeId);
    const zipKey = theme.s3Assets?.zip?.key;
    const contentPrefix = theme.s3Assets?.contentRoot?.prefix;
    if (!zipKey && !contentPrefix) {
        throw new error_utils_1.CustomError("Theme has no S3 package", 404);
    }
    if (!fs_1.default.existsSync(layout.storeThemeDir)) {
        fs_1.default.mkdirSync(layout.storeThemeDir, { recursive: true });
    }
    if (!hasThemeFiles(layout.runtimeBaseDir)) {
        fs_1.default.mkdirSync(layout.runtimeBaseDir, { recursive: true });
        if (zipKey) {
            await (0, theme_zip_from_s3_util_1.downloadS3ZipAndExtractToDir)(zipKey, layout.runtimeBaseDir);
        }
        else if (contentPrefix) {
            await (0, theme_zip_from_s3_util_1.downloadS3PrefixToLocalDir)(contentPrefix, layout.runtimeBaseDir);
        }
    }
    const jsKey = theme.s3Assets?.reactThemeJs?.key;
    const cssKey = theme.s3Assets?.reactThemeCss?.key;
    if (jsKey || cssKey) {
        const needJs = jsKey && !fs_1.default.existsSync(path_1.default.join(layout.remoteThemeDistDir, "theme.js"));
        const needCss = cssKey && !fs_1.default.existsSync(path_1.default.join(layout.remoteThemeDistDir, "theme.css"));
        if (needJs || needCss) {
            fs_1.default.mkdirSync(layout.remoteThemeDistDir, { recursive: true });
            if (needJs && jsKey)
                await (0, theme_s3_ingest_1.downloadS3KeyToFile)(jsKey, path_1.default.join(layout.remoteThemeDistDir, "theme.js"));
            if (needCss && cssKey)
                await (0, theme_s3_ingest_1.downloadS3KeyToFile)(cssKey, path_1.default.join(layout.remoteThemeDistDir, "theme.css"));
        }
    }
    return layout;
}
/** customization → runtime → legacy `unzippedTheme/`. */
function resolveStoreThemeFilePath(layout, relativePath) {
    const rel = relativePath.replace(/^\/+/, "").replace(/\\/g, "/");
    if (!rel || rel.includes(".."))
        return null;
    const customizationPath = path_1.default.join(layout.customizationsDir, rel);
    if (fs_1.default.existsSync(customizationPath) && fs_1.default.statSync(customizationPath).isFile()) {
        return customizationPath;
    }
    const runtimePath = path_1.default.join(layout.runtimeBaseDir, rel);
    if (fs_1.default.existsSync(runtimePath) && fs_1.default.statSync(runtimePath).isFile()) {
        return runtimePath;
    }
    const legacyPath = path_1.default.join(layout.storeThemeDir, "unzippedTheme", rel);
    if (fs_1.default.existsSync(legacyPath) && fs_1.default.statSync(legacyPath).isFile()) {
        return legacyPath;
    }
    return null;
}
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
    const host = req.get("host") || "localhost";
    let storeThemeDir;
    let runtimeBaseDir;
    if (isCustomTheme) {
        storeThemeDir = path_1.default.join(process.cwd(), "uploads", "stores", storeId, "themes", String(runtimeThemeKey));
        const unzippedThemeDir = path_1.default.join(storeThemeDir, "unzippedTheme");
        runtimeBaseDir = fs_1.default.existsSync(unzippedThemeDir) ? unzippedThemeDir : storeThemeDir;
    }
    else {
        const layout = await ensureStoreCatalogThemeMaterialized(storeId, appliedThemeId, theme);
        storeThemeDir = layout.storeThemeDir;
        runtimeBaseDir = layout.runtimeBaseDir;
    }
    const runtimeBaseUrl = `${req.protocol}://${host}/api/themes/installed/${encodeURIComponent(storeId)}/${encodeURIComponent(String(runtimeThemeKey))}/runtime`;
    const themeName = isCustomTheme
        ? customTheme?.name ?? null
        : theme?.name ?? null;
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
    return fs_1.default.existsSync(path_1.default.join(runtimeBaseDir, "templates", "index.liquid"));
}
const LIQUID_TEMPLATE_NAME = /^[a-z][a-z0-9_-]{0,63}$/;
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
