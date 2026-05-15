"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreThemeLayoutPaths = getStoreThemeLayoutPaths;
exports.ensureStoreCatalogThemeMaterialized = ensureStoreCatalogThemeMaterialized;
exports.resolveStoreThemeFilePath = resolveStoreThemeFilePath;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const error_utils_1 = require("./error.utils");
const theme_s3_ingest_1 = require("./theme-s3-ingest");
const theme_zip_from_s3_util_1 = require("./theme-zip-from-s3.util");
function getStoreThemeLayoutPaths(storeId, themeId) {
    const storeThemeDir = path_1.default.join(process.cwd(), 'uploads', 'stores', storeId, 'themes', themeId);
    return {
        storeThemeDir,
        runtimeBaseDir: path_1.default.join(storeThemeDir, 'runtime'),
        customizationsDir: path_1.default.join(storeThemeDir, 'customizations'),
        remoteThemeDistDir: path_1.default.join(storeThemeDir, 'remoteThemeDist'),
    };
}
function hasThemeFiles(dir) {
    if (!fs_1.default.existsSync(dir))
        return false;
    return fs_1.default.readdirSync(dir).filter((f) => f !== '.DS_Store').length > 0;
}
/**
 * Materialize catalog theme assets from S3 into the store runtime folder (first use only).
 * Install does NOT call this — only storefront / file serving / editor paths.
 */
async function ensureStoreCatalogThemeMaterialized(storeId, themeId, theme) {
    const layout = getStoreThemeLayoutPaths(storeId, themeId);
    const zipKey = theme.s3Assets?.zip?.key;
    const contentPrefix = theme.s3Assets?.contentRoot?.prefix;
    if (!zipKey && !contentPrefix) {
        throw new error_utils_1.CustomError('Theme has no S3 package', 404);
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
        const needJs = jsKey && !fs_1.default.existsSync(path_1.default.join(layout.remoteThemeDistDir, 'theme.js'));
        const needCss = cssKey && !fs_1.default.existsSync(path_1.default.join(layout.remoteThemeDistDir, 'theme.css'));
        if (needJs || needCss) {
            fs_1.default.mkdirSync(layout.remoteThemeDistDir, { recursive: true });
            if (needJs && jsKey)
                await (0, theme_s3_ingest_1.downloadS3KeyToFile)(jsKey, path_1.default.join(layout.remoteThemeDistDir, 'theme.js'));
            if (needCss && cssKey)
                await (0, theme_s3_ingest_1.downloadS3KeyToFile)(cssKey, path_1.default.join(layout.remoteThemeDistDir, 'theme.css'));
        }
    }
    return layout;
}
/** Resolve a theme file: customization override → runtime cache → null. */
function resolveStoreThemeFilePath(layout, relativePath) {
    const rel = relativePath.replace(/^\/+/, '').replace(/\\/g, '/');
    if (!rel || rel.includes('..'))
        return null;
    const customizationPath = path_1.default.join(layout.customizationsDir, rel);
    if (fs_1.default.existsSync(customizationPath) && fs_1.default.statSync(customizationPath).isFile()) {
        return customizationPath;
    }
    const runtimePath = path_1.default.join(layout.runtimeBaseDir, rel);
    if (fs_1.default.existsSync(runtimePath) && fs_1.default.statSync(runtimePath).isFile()) {
        return runtimePath;
    }
    // Legacy installs used `unzippedTheme/`
    const legacyPath = path_1.default.join(layout.storeThemeDir, 'unzippedTheme', rel);
    if (fs_1.default.existsSync(legacyPath) && fs_1.default.statSync(legacyPath).isFile()) {
        return legacyPath;
    }
    return null;
}
