"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorefrontThemeSourceFile = exports.listStorefrontThemeSourceFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const error_utils_1 = require("../utils/error.utils");
const ALLOWED_THEME_IDS = ["theme1", "theme2"];
function isThemeId(themeId) {
    return ALLOWED_THEME_IDS.includes(themeId);
}
function getThemeSourceRoot(themeId) {
    return path_1.default.join(process.cwd(), "src", "data", "storefront-theme-sources", themeId);
}
function listThemeFilesRecursively(rootDir, currentDir = rootDir) {
    const entries = fs_1.default.readdirSync(currentDir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path_1.default.join(currentDir, entry.name);
        if (entry.isDirectory()) {
            files.push(...listThemeFilesRecursively(rootDir, fullPath));
            continue;
        }
        if (entry.isFile()) {
            files.push(path_1.default.relative(rootDir, fullPath).replace(/\\/g, "/"));
        }
    }
    return files.sort();
}
exports.listStorefrontThemeSourceFiles = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { themeId } = req.params;
    if (!themeId || !isThemeId(themeId)) {
        throw new error_utils_1.CustomError("Invalid themeId", 400);
    }
    const rootDir = getThemeSourceRoot(themeId);
    if (!fs_1.default.existsSync(rootDir)) {
        throw new error_utils_1.CustomError("Theme source not found", 404);
    }
    res.status(200).json({
        success: true,
        data: {
            themeId,
            files: listThemeFilesRecursively(rootDir),
            availableSources: [...ALLOWED_THEME_IDS],
        },
    });
});
exports.getStorefrontThemeSourceFile = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { themeId } = req.params;
    const relativeFilePath = req.params[0];
    if (!themeId || !isThemeId(themeId)) {
        throw new error_utils_1.CustomError("Invalid themeId", 400);
    }
    if (!relativeFilePath) {
        throw new error_utils_1.CustomError("Theme source file path is required", 400);
    }
    const rootDir = getThemeSourceRoot(themeId);
    const requestedPath = path_1.default.resolve(rootDir, relativeFilePath);
    if (!requestedPath.startsWith(rootDir + path_1.default.sep) && requestedPath !== rootDir) {
        throw new error_utils_1.CustomError("Invalid file path", 400);
    }
    if (!fs_1.default.existsSync(requestedPath) || !fs_1.default.statSync(requestedPath).isFile()) {
        throw new error_utils_1.CustomError("Theme source file not found", 404);
    }
    const fileContent = fs_1.default.readFileSync(requestedPath, "utf-8");
    res.type("text/plain").status(200).send(fileContent);
});
