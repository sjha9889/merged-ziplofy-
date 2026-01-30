import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { createTheme, deleteRecentInstallations, deleteTheme, downloadTheme, getInstalledThemes, getRecentInstallations, getTheme, getThemes, getThemesStatic, getThemeStats, getThumbnail, getThemePreview, installTheme, serveInstalledThemeFiles, serveThemePreviewFiles, uninstallTheme, updateTheme, listThemeFiles, readThemeFile, saveUserFileEdit } from "../controllers/theme.controller";
import { authorize, authorizePermission, optionalAuth, protect } from "../middlewares/auth.middleware";
import { RoleType } from "../types";

export const themeRouter = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(process.cwd(), 'uploads', 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // keep original name for zip; multer temp name will be overridden when moving
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === "zipFile") {
    if (
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only ZIP files are allowed"));
    }
  } else if (file.fieldname === "thumbnail") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  } else {
    cb(new Error("Unexpected field"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Public routes
themeRouter.route("/installed").get(getInstalledThemes);
themeRouter.route("/recent").get(getRecentInstallations);
themeRouter.route("/recent/delete").post(deleteRecentInstallations);
themeRouter.route("/").get(getThemes);

themeRouter.route("/themesStatic").get(getThemesStatic);

// install theme - MUST come before /:id route
themeRouter.post("/install", installTheme);

// Serve installed theme files
themeRouter.route("/installed/:storeId/:themeId/*").get(serveInstalledThemeFiles);

// Theme preview routes - MUST come before /:id route
themeRouter.route("/preview/:themeId").get(getThemePreview);
themeRouter.route("/preview/:themeId/*").get(serveThemePreviewFiles);

// Expose theme files for editor publicly (read-only), but merge with user context if token provided
themeRouter.route("/files/:themeId").get(optionalAuth as any, listThemeFiles);
themeRouter.route("/file/:themeId").get(optionalAuth as any, readThemeFile);

// Protected routes
themeRouter.use(protect);

themeRouter.route("/uninstall").delete(uninstallTheme);

themeRouter.route("/:id").get(getTheme);
themeRouter.route("/:id/thumbnail").get(getThumbnail);
themeRouter.route("/stats").get(authorize(RoleType.SUPER_ADMIN), getThemeStats);

themeRouter.route("/:id/download").get(downloadTheme);

// Save user-specific edits (any authenticated user; no super-admin requirement)
themeRouter.route("/:themeId/save-edit").post(saveUserFileEdit);

// Theme creation - allow users with "upload" permission in "Theme Management" section
// OR users with "upload" permission in "Developer" → "Theme Developer" subsection
// The middleware automatically checks both: section-level "Theme Management" and subsection "Developer" → "Theme Developer"
// Super-admin and developer-admin have access by default, but support-admin can be granted permission
themeRouter.route("/").post(
  authorizePermission("Theme Management", "upload"), // Middleware will also check "Developer" → "Theme Developer" as alternative
  upload.fields([
    { name: "zipFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createTheme
);

themeRouter
  .route("/:id")
  .put(
    authorizePermission("Theme Management", "edit"), // Also checks "Developer" → "Theme Developer" as alternative
    upload.fields([
      { name: "zipFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    updateTheme
  )
  .delete(authorizePermission("Theme Management", "edit"), deleteTheme); // Also checks "Developer" → "Theme Developer" as alternative
