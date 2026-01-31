"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeRouter = void 0;
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const theme_controller_1 = require("../controllers/theme.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const types_1 = require("../types");
exports.themeRouter = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = path_1.default.join(process.cwd(), 'uploads', 'temp');
        if (!fs_1.default.existsSync(tempDir))
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        // keep original name for zip; multer temp name will be overridden when moving
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "zipFile") {
        if (file.mimetype === "application/zip" ||
            file.mimetype === "application/x-zip-compressed") {
            cb(null, true);
        }
        else {
            cb(new Error("Only ZIP files are allowed"));
        }
    }
    else if (file.fieldname === "thumbnail") {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    }
    else {
        cb(new Error("Unexpected field"));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
});
// Public routes
exports.themeRouter.route("/installed").get(theme_controller_1.getInstalledThemes);
exports.themeRouter.route("/recent").get(theme_controller_1.getRecentInstallations);
exports.themeRouter.route("/recent/delete").post(theme_controller_1.deleteRecentInstallations);
exports.themeRouter.route("/").get(theme_controller_1.getThemes);
exports.themeRouter.route("/themesStatic").get(theme_controller_1.getThemesStatic);
// install theme - MUST come before /:id route
exports.themeRouter.post("/install", theme_controller_1.installTheme);
// Serve installed theme files
exports.themeRouter.route("/installed/:storeId/:themeId/*").get(theme_controller_1.serveInstalledThemeFiles);
// Theme preview routes - MUST come before /:id route
exports.themeRouter.route("/preview/:themeId").get(theme_controller_1.getThemePreview);
exports.themeRouter.route("/preview/:themeId/*").get(theme_controller_1.serveThemePreviewFiles);
// Expose theme files for editor publicly (read-only), but merge with user context if token provided
exports.themeRouter.route("/files/:themeId").get(auth_middleware_1.optionalAuth, theme_controller_1.listThemeFiles);
exports.themeRouter.route("/file/:themeId").get(auth_middleware_1.optionalAuth, theme_controller_1.readThemeFile);
// Protected routes
exports.themeRouter.use(auth_middleware_1.protect);
exports.themeRouter.route("/uninstall").delete(theme_controller_1.uninstallTheme);
exports.themeRouter.route("/:id").get(theme_controller_1.getTheme);
exports.themeRouter.route("/:id/thumbnail").get(theme_controller_1.getThumbnail);
exports.themeRouter.route("/stats").get((0, auth_middleware_1.authorize)(types_1.RoleType.SUPER_ADMIN), theme_controller_1.getThemeStats);
exports.themeRouter.route("/:id/download").get(theme_controller_1.downloadTheme);
// Save user-specific edits (any authenticated user; no super-admin requirement)
exports.themeRouter.route("/:themeId/save-edit").post(theme_controller_1.saveUserFileEdit);
// Theme creation - allow users with "upload" permission in "Theme Management" section
// OR users with "upload" permission in "Developer" → "Theme Developer" subsection
// The middleware automatically checks both: section-level "Theme Management" and subsection "Developer" → "Theme Developer"
// Super-admin and developer-admin have access by default, but support-admin can be granted permission
exports.themeRouter.route("/").post((0, auth_middleware_1.authorizePermission)("Theme Management", "upload"), // Middleware will also check "Developer" → "Theme Developer" as alternative
upload.fields([
    { name: "zipFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
]), theme_controller_1.createTheme);
exports.themeRouter
    .route("/:id")
    .put((0, auth_middleware_1.authorizePermission)("Theme Management", "edit"), // Also checks "Developer" → "Theme Developer" as alternative
upload.fields([
    { name: "zipFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
]), theme_controller_1.updateTheme)
    .delete((0, auth_middleware_1.authorizePermission)("Theme Management", "edit"), theme_controller_1.deleteTheme); // Also checks "Developer" → "Theme Developer" as alternative
