"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCatalogThemeCodeDir = ensureCatalogThemeCodeDir;
exports.ensureCatalogRemoteDistDir = ensureCatalogRemoteDistDir;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
const error_utils_1 = require("./error.utils");
const theme_s3_ingest_1 = require("./theme-s3-ingest");
const theme_zip_from_s3_util_1 = require("./theme-zip-from-s3.util");
function catalogCacheRoot(themeId) {
    return path_1.default.join((0, os_1.tmpdir)(), "ziplofy-catalog-themes", themeId);
}
/** Shared catalog theme files (OS temp). Not copied per store on install. */
async function ensureCatalogThemeCodeDir(theme) {
    const id = String(theme._id);
    const zipKey = theme.s3Assets?.zip?.key;
    const folderPrefix = theme.s3Assets?.contentRoot?.prefix;
    if (!zipKey && !folderPrefix)
        throw new error_utils_1.CustomError("Theme has no S3 package", 404);
    const cacheRoot = catalogCacheRoot(id);
    const codeDir = path_1.default.join(cacheRoot, "code");
    const metaPath = path_1.default.join(cacheRoot, ".meta.json");
    const mode = zipKey ? "zip" : "folder";
    const ref = zipKey ?? folderPrefix ?? "";
    const folderFileCount = theme.s3Assets?.contentRoot?.fileCount;
    let skip = false;
    if (fs_1.default.existsSync(metaPath)) {
        try {
            const meta = JSON.parse(fs_1.default.readFileSync(metaPath, "utf8"));
            if (meta.mode === mode &&
                meta.ref === ref &&
                (mode !== "folder" || meta.folderFileCount === folderFileCount) &&
                fs_1.default.existsSync(codeDir) &&
                fs_1.default.readdirSync(codeDir).length > 0) {
                skip = true;
            }
        }
        catch {
            /* re-sync */
        }
    }
    if (!skip) {
        if (fs_1.default.existsSync(cacheRoot))
            fs_1.default.rmSync(cacheRoot, { recursive: true, force: true });
        fs_1.default.mkdirSync(codeDir, { recursive: true });
        if (zipKey) {
            await (0, theme_zip_from_s3_util_1.downloadS3ZipAndExtractToDir)(zipKey, codeDir);
        }
        else {
            await (0, theme_zip_from_s3_util_1.downloadS3PrefixToLocalDir)(folderPrefix, codeDir);
        }
        fs_1.default.writeFileSync(metaPath, JSON.stringify({
            mode,
            ref,
            folderFileCount: mode === "folder" ? folderFileCount : undefined,
            ts: Date.now(),
        }));
    }
    return codeDir;
}
async function ensureCatalogRemoteDistDir(theme) {
    const id = String(theme._id);
    const distDir = path_1.default.join(catalogCacheRoot(id), "remoteThemeDist");
    const jsKey = theme.s3Assets?.reactThemeJs?.key;
    const cssKey = theme.s3Assets?.reactThemeCss?.key;
    if (!jsKey && !cssKey)
        return distDir;
    fs_1.default.mkdirSync(distDir, { recursive: true });
    if (jsKey && !fs_1.default.existsSync(path_1.default.join(distDir, "theme.js"))) {
        await (0, theme_s3_ingest_1.downloadS3KeyToFile)(jsKey, path_1.default.join(distDir, "theme.js"));
    }
    if (cssKey && !fs_1.default.existsSync(path_1.default.join(distDir, "theme.css"))) {
        await (0, theme_s3_ingest_1.downloadS3KeyToFile)(cssKey, path_1.default.join(distDir, "theme.css"));
    }
    return distDir;
}
