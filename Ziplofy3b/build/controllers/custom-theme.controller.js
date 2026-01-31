"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCustomThemeFiles = exports.deleteCustomTheme = exports.uninstallCustomTheme = exports.installCustomTheme = exports.updateCustomTheme = exports.getCustomTheme = exports.getCustomThemes = exports.createCustomTheme = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const extract_zip_1 = __importDefault(require("extract-zip"));
const custom_theme_model_1 = require("../models/custom-theme.model");
const installed_themes_model_1 = require("../models/installed-themes.model");
const recent_installations_model_1 = require("../models/recent-installations.model");
const error_utils_1 = require("../utils/error.utils");
// Helper function to create custom theme directory structure
const createCustomThemeDirectory = (themeName) => {
    const baseDir = path_1.default.join(process.cwd(), "uploads/custom themes/");
    const safeName = themeName.replace(/[^a-zA-Z0-9\s-]/g, "").trim();
    let themeDirName = safeName;
    let themeDirPath = path_1.default.join(baseDir, themeDirName);
    // If directory exists, append a unique suffix
    if (fs_1.default.existsSync(themeDirPath)) {
        const suffix = Date.now().toString().slice(-6);
        themeDirName = `${safeName}-${suffix}`;
        themeDirPath = path_1.default.join(baseDir, themeDirName);
    }
    // Create main theme directory
    if (!fs_1.default.existsSync(themeDirPath)) {
        fs_1.default.mkdirSync(themeDirPath, { recursive: true });
    }
    // Create subdirectories
    const thumbnailDirPath = path_1.default.join(themeDirPath, "thumbnail");
    const unzippedThemeDirPath = path_1.default.join(themeDirPath, "unzippedTheme");
    const zippedDirPath = path_1.default.join(themeDirPath, "zipped");
    [thumbnailDirPath, unzippedThemeDirPath, zippedDirPath].forEach((p) => {
        if (!fs_1.default.existsSync(p))
            fs_1.default.mkdirSync(p, { recursive: true });
    });
    return {
        themeDir: themeDirPath,
        thumbnailDir: thumbnailDirPath,
        unzippedThemeDir: unzippedThemeDirPath,
        zippedDir: zippedDirPath,
        themeDirName,
    };
};
// Create custom theme
exports.createCustomTheme = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    // Check for multer errors (file too large, etc.)
    if (req.fileValidationError) {
        throw new error_utils_1.CustomError(req.fileValidationError, 413);
    }
    const { name } = req.body;
    const files = req.files;
    const zipFile = files?.zipFile?.[0];
    const thumbnailFile = files?.thumbnail?.[0];
    if (!name) {
        throw new error_utils_1.CustomError("Name is required", 400);
    }
    if (!zipFile) {
        throw new error_utils_1.CustomError("ZIP file is required", 400);
    }
    // Check file size (additional validation)
    const maxFileSize = 500 * 1024 * 1024; // 500MB
    if (zipFile.size > maxFileSize) {
        throw new error_utils_1.CustomError(`ZIP file too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`, 413);
    }
    if (!req.user?.id) {
        throw new error_utils_1.CustomError("User authentication required", 401);
    }
    // Create directory structure
    const themeDirs = createCustomThemeDirectory(name);
    let html = "";
    let css = "";
    try {
        // Move zip file to zipped directory
        const zipDestPath = path_1.default.join(themeDirs.zippedDir, zipFile.originalname || `${name}.zip`);
        fs_1.default.renameSync(zipFile.path, zipDestPath);
        // Extract ZIP file to unzippedTheme directory
        await (0, extract_zip_1.default)(zipDestPath, { dir: themeDirs.unzippedThemeDir });
        console.log("ZIP extraction complete to:", themeDirs.unzippedThemeDir);
        // Normalize extraction: if a single top-level folder exists, move its contents up
        const items = fs_1.default.readdirSync(themeDirs.unzippedThemeDir);
        if (items.length === 1) {
            const onlyItemPath = path_1.default.join(themeDirs.unzippedThemeDir, items[0]);
            const stat = fs_1.default.statSync(onlyItemPath);
            if (stat.isDirectory()) {
                const moveUp = (src, dest) => {
                    const entries = fs_1.default.readdirSync(src);
                    entries.forEach((entry) => {
                        const srcPath = path_1.default.join(src, entry);
                        const destPath = path_1.default.join(dest, entry);
                        const s = fs_1.default.statSync(srcPath);
                        if (s.isDirectory()) {
                            if (!fs_1.default.existsSync(destPath))
                                fs_1.default.mkdirSync(destPath, { recursive: true });
                            moveUp(srcPath, destPath);
                        }
                        else {
                            fs_1.default.renameSync(srcPath, destPath);
                        }
                    });
                };
                moveUp(onlyItemPath, themeDirs.unzippedThemeDir);
                fs_1.default.rmSync(onlyItemPath, { recursive: true, force: true });
                console.log("Normalized extracted structure by removing top-level wrapper folder");
            }
        }
        // HTML and CSS are stored on disk, not in MongoDB to avoid 16MB document limit
        // Files are already extracted to themeDirs.unzippedThemeDir
        // We'll read them from disk when needed (in getCustomTheme)
    }
    catch (extractError) {
        // Clean up if extraction fails
        if (fs_1.default.existsSync(themeDirs.themeDir)) {
            fs_1.default.rmSync(themeDirs.themeDir, { recursive: true, force: true });
        }
        throw new error_utils_1.CustomError(`ZIP extraction failed: ${extractError.message}`, 500);
    }
    // Save thumbnail if provided
    let thumbnailData = null;
    if (thumbnailFile) {
        const thumbnailExt = path_1.default.extname(thumbnailFile.originalname || '.png');
        const thumbnailFilename = `thumbnail${thumbnailExt}`;
        const thumbnailDestPath = path_1.default.join(themeDirs.thumbnailDir, thumbnailFilename);
        fs_1.default.renameSync(thumbnailFile.path, thumbnailDestPath);
        thumbnailData = {
            filename: thumbnailFilename,
            originalName: thumbnailFile.originalname,
            path: thumbnailDestPath,
            size: thumbnailFile.size,
            uploadDate: new Date(),
        };
    }
    // Create theme in database (without HTML/CSS to avoid MongoDB 16MB limit)
    // HTML/CSS are stored on disk and will be read from files when needed
    const customTheme = await custom_theme_model_1.CustomTheme.create({
        name,
        // html and css are not stored in DB - they're on disk
        themePath: themeDirs.themeDirName,
        directories: {
            theme: themeDirs.themeDir,
            thumbnail: themeDirs.thumbnailDir,
            unzippedTheme: themeDirs.unzippedThemeDir,
        },
        thumbnail: thumbnailData,
        createdBy: new mongoose_1.Types.ObjectId(req.user.id),
    });
    const themeResponse = await custom_theme_model_1.CustomTheme.findById(customTheme._id)
        .populate("createdBy", "name email")
        .select("-directories -html -css");
    res.status(201).json({
        success: true,
        data: themeResponse,
        message: "Custom theme created successfully",
    });
});
// Get all custom themes for the authenticated user
exports.getCustomThemes = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new error_utils_1.CustomError("User authentication required", 401);
    }
    const customThemes = await custom_theme_model_1.CustomTheme.find({
        createdBy: new mongoose_1.Types.ObjectId(req.user.id),
    })
        .populate("createdBy", "name email")
        .select("-directories -html -css")
        .sort({ createdAt: -1 });
    // Add thumbnail URLs to themes
    const themesWithThumbnails = customThemes.map((theme) => {
        const themeObj = theme.toObject();
        if (theme.thumbnail?.filename) {
            themeObj.thumbnailUrl = `${req.protocol}://${req.get("host")}/uploads/custom themes/${theme.themePath}/thumbnail/${theme.thumbnail.filename}`;
        }
        return themeObj;
    });
    res.status(200).json({
        success: true,
        data: themesWithThumbnails,
        count: themesWithThumbnails.length,
    });
});
// Get single custom theme
exports.getCustomTheme = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new error_utils_1.CustomError("Invalid theme ID format. Please use a valid theme ID.", 400);
    }
    if (!req.user?.id) {
        throw new error_utils_1.CustomError("User authentication required", 401);
    }
    let customTheme;
    try {
        customTheme = await custom_theme_model_1.CustomTheme.findOne({
            _id: new mongoose_1.Types.ObjectId(id),
            createdBy: new mongoose_1.Types.ObjectId(req.user.id),
        }).populate("createdBy", "name email");
    }
    catch (error) {
        throw new error_utils_1.CustomError("Invalid theme ID", 400);
    }
    if (!customTheme) {
        throw new error_utils_1.CustomError("Custom theme not found or you don't have permission to access it", 404);
    }
    // Read HTML and CSS from files on disk (not from MongoDB to avoid 16MB limit)
    const themeObj = customTheme.toObject();
    const htmlPath = path_1.default.join(customTheme.directories.unzippedTheme, "index.html");
    const cssPath = path_1.default.join(customTheme.directories.unzippedTheme, "style.css");
    try {
        if (fs_1.default.existsSync(htmlPath)) {
            themeObj.html = fs_1.default.readFileSync(htmlPath, "utf-8");
        }
        else {
            themeObj.html = customTheme.html || "";
        }
        if (fs_1.default.existsSync(cssPath)) {
            themeObj.css = fs_1.default.readFileSync(cssPath, "utf-8");
        }
        else {
            themeObj.css = customTheme.css || "";
        }
    }
    catch (fileError) {
        console.error("Error reading theme files:", fileError);
        // Fallback to DB values if files don't exist (for backward compatibility)
        themeObj.html = customTheme.html || "";
        themeObj.css = customTheme.css || "";
    }
    res.status(200).json({
        success: true,
        data: themeObj,
    });
});
// Update custom theme
exports.updateCustomTheme = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    // Check for multer errors (file too large, etc.)
    if (req.fileValidationError) {
        throw new error_utils_1.CustomError(req.fileValidationError, 413);
    }
    const { id } = req.params;
    const { name } = req.body;
    const files = req.files;
    const zipFile = files?.zipFile?.[0];
    const thumbnailFile = files?.thumbnail?.[0];
    // Check file size if zip file is provided
    if (zipFile) {
        const maxFileSize = 500 * 1024 * 1024; // 500MB
        if (zipFile.size > maxFileSize) {
            throw new error_utils_1.CustomError(`ZIP file too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`, 413);
        }
    }
    // Validate ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new error_utils_1.CustomError(`Theme ID is required. Received: ${JSON.stringify(id)}`, 400);
    }
    const trimmedId = id.trim();
    if (!mongoose_1.Types.ObjectId.isValid(trimmedId)) {
        throw new error_utils_1.CustomError(`Invalid theme ID format: "${trimmedId}". Expected a valid MongoDB ObjectId (24 hex characters).`, 400);
    }
    if (!req.user?.id) {
        throw new error_utils_1.CustomError("User authentication required", 401);
    }
    let customTheme;
    try {
        customTheme = await custom_theme_model_1.CustomTheme.findOne({
            _id: new mongoose_1.Types.ObjectId(trimmedId),
            createdBy: new mongoose_1.Types.ObjectId(req.user.id),
        });
    }
    catch (error) {
        throw new error_utils_1.CustomError(`Failed to find theme with ID: ${trimmedId}. ${error.message}`, 400);
    }
    if (!customTheme) {
        throw new error_utils_1.CustomError("Custom theme not found", 404);
    }
    // Update name if provided
    if (name) {
        customTheme.name = name;
    }
    // If zip file is provided, extract and update HTML/CSS
    if (zipFile) {
        try {
            // Get zipped directory path
            const zippedDir = path_1.default.join(customTheme.directories.theme, "zipped");
            if (!fs_1.default.existsSync(zippedDir)) {
                fs_1.default.mkdirSync(zippedDir, { recursive: true });
            }
            // Move zip file to zipped directory
            const zipDestPath = path_1.default.join(zippedDir, zipFile.originalname || `${customTheme.name}.zip`);
            fs_1.default.renameSync(zipFile.path, zipDestPath);
            // Clear existing unzippedTheme directory
            if (fs_1.default.existsSync(customTheme.directories.unzippedTheme)) {
                fs_1.default.rmSync(customTheme.directories.unzippedTheme, { recursive: true, force: true });
            }
            fs_1.default.mkdirSync(customTheme.directories.unzippedTheme, { recursive: true });
            // Extract ZIP file to unzippedTheme directory
            await (0, extract_zip_1.default)(zipDestPath, { dir: customTheme.directories.unzippedTheme });
            console.log("ZIP extraction complete to:", customTheme.directories.unzippedTheme);
            // Normalize extraction: if a single top-level folder exists, move its contents up
            const items = fs_1.default.readdirSync(customTheme.directories.unzippedTheme);
            if (items.length === 1) {
                const onlyItemPath = path_1.default.join(customTheme.directories.unzippedTheme, items[0]);
                const stat = fs_1.default.statSync(onlyItemPath);
                if (stat.isDirectory()) {
                    const moveUp = (src, dest) => {
                        const entries = fs_1.default.readdirSync(src);
                        entries.forEach((entry) => {
                            const srcPath = path_1.default.join(src, entry);
                            const destPath = path_1.default.join(dest, entry);
                            const s = fs_1.default.statSync(srcPath);
                            if (s.isDirectory()) {
                                if (!fs_1.default.existsSync(destPath))
                                    fs_1.default.mkdirSync(destPath, { recursive: true });
                                moveUp(srcPath, destPath);
                            }
                            else {
                                fs_1.default.renameSync(srcPath, destPath);
                            }
                        });
                    };
                    moveUp(onlyItemPath, customTheme.directories.unzippedTheme);
                    fs_1.default.rmSync(onlyItemPath, { recursive: true, force: true });
                    console.log("Normalized extracted structure by removing top-level wrapper folder");
                }
            }
            // HTML and CSS are stored on disk, not in MongoDB to avoid 16MB document limit
            // Files are already extracted to customTheme.directories.unzippedTheme
            // We'll read them from disk when needed (in getCustomTheme)
        }
        catch (extractError) {
            throw new error_utils_1.CustomError(`ZIP extraction failed: ${extractError.message}`, 500);
        }
    }
    // Update thumbnail if provided
    if (thumbnailFile) {
        const thumbnailExt = path_1.default.extname(thumbnailFile.originalname || '.png');
        const thumbnailFilename = `thumbnail${thumbnailExt}`;
        const thumbnailDestPath = path_1.default.join(customTheme.directories.thumbnail, thumbnailFilename);
        // Remove old thumbnail if exists
        if (customTheme.thumbnail?.filename) {
            const oldThumbnailPath = path_1.default.join(customTheme.directories.thumbnail, customTheme.thumbnail.filename);
            if (fs_1.default.existsSync(oldThumbnailPath)) {
                fs_1.default.unlinkSync(oldThumbnailPath);
            }
        }
        // Move new thumbnail
        fs_1.default.renameSync(thumbnailFile.path, thumbnailDestPath);
        customTheme.thumbnail = {
            filename: thumbnailFilename,
            originalName: thumbnailFile.originalname,
            path: thumbnailDestPath,
            size: thumbnailFile.size,
            uploadDate: new Date(),
        };
    }
    customTheme.updatedAt = new Date();
    await customTheme.save();
    const themeResponse = await custom_theme_model_1.CustomTheme.findById(customTheme._id)
        .populate("createdBy", "name email")
        .select("-directories -html -css");
    res.status(200).json({
        success: true,
        data: themeResponse,
        message: "Custom theme updated successfully",
    });
});
// Delete custom theme
// Install custom theme to a store (similar to installTheme for normal themes)
exports.installCustomTheme = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { customThemeId, userId, storeId } = req.body;
    if (!userId) {
        throw new error_utils_1.CustomError("User ID is required", 400);
    }
    if (!customThemeId) {
        throw new error_utils_1.CustomError("Custom theme ID is required", 400);
    }
    console.log('🔍 Installing custom theme:', { customThemeId, userId, storeId });
    // Validate IDs
    if (!mongoose_1.Types.ObjectId.isValid(customThemeId)) {
        throw new error_utils_1.CustomError("Invalid custom theme ID format", 400);
    }
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new error_utils_1.CustomError("Invalid user ID format", 400);
    }
    const customThemeObjectId = new mongoose_1.Types.ObjectId(customThemeId);
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    // Load custom theme
    const customTheme = await custom_theme_model_1.CustomTheme.findById(customThemeObjectId);
    if (!customTheme) {
        throw new error_utils_1.CustomError("Custom theme not found", 404);
    }
    // Check if user owns this theme
    if (customTheme.createdBy.toString() !== req.user?.id) {
        throw new error_utils_1.CustomError("You don't have permission to install this theme", 403);
    }
    // Create store-specific theme directory
    // Use "custom-{customThemeId}" as the theme ID to distinguish from normal themes
    const storeIdToUse = storeId || userId;
    const themeIdForStore = `custom-${customThemeId}`;
    const storeThemeDir = path_1.default.join(process.cwd(), 'uploads', 'stores', storeIdToUse, 'themes', themeIdForStore);
    const unzippedThemeDir = path_1.default.join(storeThemeDir, 'unzippedTheme');
    const sourceThemeDir = customTheme.directories.unzippedTheme;
    console.log('📁 Source custom theme directory:', sourceThemeDir);
    console.log('📁 Store theme directory:', storeThemeDir);
    try {
        // IMPORTANT: Deactivate all other active themes (regular themes) for this user/store before installing custom theme
        // This ensures only one theme is active at a time
        // Use storeIdToUse to match where themes are installed
        await installed_themes_model_1.InstalledThemes.updateMany({ user: storeIdToUse, isActive: true }, {
            isActive: false,
            uninstalledAt: new Date()
        });
        console.log('✅ Deactivated all other active themes for this user/store');
        // Also remove any other custom theme installations (delete installation directories)
        const storeThemesDir = path_1.default.join(process.cwd(), 'uploads', 'stores', storeIdToUse, 'themes');
        if (fs_1.default.existsSync(storeThemesDir)) {
            try {
                const themeDirs = fs_1.default.readdirSync(storeThemesDir, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);
                for (const themeDirName of themeDirs) {
                    // Remove all other custom theme installations (but not the one we're installing)
                    if (themeDirName.startsWith('custom-') && themeDirName !== themeIdForStore) {
                        const customThemeDir = path_1.default.join(storeThemesDir, themeDirName);
                        fs_1.default.rmSync(customThemeDir, { recursive: true, force: true });
                        console.log(`✅ Removed other custom theme installation: ${themeDirName}`);
                    }
                }
            }
            catch (err) {
                console.warn('Error removing other custom theme installations:', err);
            }
        }
        // Create store theme directory if it doesn't exist
        if (!fs_1.default.existsSync(storeThemeDir)) {
            fs_1.default.mkdirSync(storeThemeDir, { recursive: true });
            console.log('✅ Created store theme directory');
        }
        // Create unzippedTheme subdirectory
        if (!fs_1.default.existsSync(unzippedThemeDir)) {
            fs_1.default.mkdirSync(unzippedThemeDir, { recursive: true });
        }
        // Check if files already exist (preserve customizations)
        const hasExistingFiles = fs_1.default.existsSync(unzippedThemeDir) &&
            fs_1.default.readdirSync(unzippedThemeDir).filter(f => f !== '.DS_Store').length > 0;
        // Copy theme files to store directory (only if no existing files)
        if (fs_1.default.existsSync(sourceThemeDir) && !hasExistingFiles) {
            const copyRecursive = (src, dest) => {
                const stats = fs_1.default.statSync(src);
                if (stats.isDirectory()) {
                    if (!fs_1.default.existsSync(dest)) {
                        fs_1.default.mkdirSync(dest, { recursive: true });
                    }
                    const files = fs_1.default.readdirSync(src);
                    files.forEach(file => {
                        copyRecursive(path_1.default.join(src, file), path_1.default.join(dest, file));
                    });
                }
                else {
                    fs_1.default.copyFileSync(src, dest);
                }
            };
            copyRecursive(sourceThemeDir, unzippedThemeDir);
            console.log('✅ Custom theme files copied to store directory');
        }
        else if (hasExistingFiles) {
            console.log('📁 Existing theme files found - preserving user edits');
        }
        // Record in recent installations
        let thumbnailUrl = null;
        if (customTheme.thumbnail?.filename) {
            thumbnailUrl = `${req.protocol}://${req.get("host")}/uploads/custom themes/${customTheme.themePath}/thumbnail/${customTheme.thumbnail.filename}`;
        }
        try {
            // Remove any existing entry for this theme (to avoid duplicates)
            await recent_installations_model_1.RecentInstallations.deleteOne({ themeId: themeIdForStore });
            // Create new entry
            await recent_installations_model_1.RecentInstallations.create({
                themeId: themeIdForStore, // Format: "custom-{customThemeId}"
                themeName: customTheme.name,
                thumbnailUrl: thumbnailUrl,
                isCustomTheme: true,
                installedAt: new Date(),
            });
            // Keep only the last 3 installations
            const allRecent = await recent_installations_model_1.RecentInstallations.find().sort({ installedAt: -1 });
            if (allRecent.length > 3) {
                const toDelete = allRecent.slice(3);
                await recent_installations_model_1.RecentInstallations.deleteMany({ _id: { $in: toDelete.map(r => r._id) } });
            }
        }
        catch (recentError) {
            console.warn('Failed to record recent installation:', recentError);
            // Don't fail the installation if recent tracking fails
        }
        res.status(200).json({
            success: true,
            message: 'Custom theme installed successfully',
            data: {
                customThemeId: customTheme._id,
                themeId: themeIdForStore, // Special format: "custom-{customThemeId}"
                name: customTheme.name,
                storePath: storeThemeDir,
            },
        });
    }
    catch (error) {
        console.error('❌ Error installing custom theme:', error);
        throw new error_utils_1.CustomError(`Failed to install custom theme: ${error?.message || 'Unknown error'}`, 500);
    }
});
// Uninstall custom theme from a store (removes installation directory)
exports.uninstallCustomTheme = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { customThemeId, userId, storeId } = req.body;
    if (!userId) {
        throw new error_utils_1.CustomError("User ID is required", 400);
    }
    if (!customThemeId) {
        throw new error_utils_1.CustomError("Custom theme ID is required", 400);
    }
    console.log('🔍 Uninstalling custom theme:', { customThemeId, userId, storeId });
    // Validate IDs
    if (!mongoose_1.Types.ObjectId.isValid(customThemeId)) {
        throw new error_utils_1.CustomError("Invalid custom theme ID format", 400);
    }
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new error_utils_1.CustomError("Invalid user ID format", 400);
    }
    const customThemeObjectId = new mongoose_1.Types.ObjectId(customThemeId);
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    // Load custom theme to verify it exists
    const customTheme = await custom_theme_model_1.CustomTheme.findById(customThemeObjectId);
    if (!customTheme) {
        throw new error_utils_1.CustomError("Custom theme not found", 404);
    }
    // Check if user owns this theme
    if (customTheme.createdBy.toString() !== req.user?.id) {
        throw new error_utils_1.CustomError("You don't have permission to uninstall this theme", 403);
    }
    // Get the installation directory path
    const storeIdToUse = storeId || userId;
    const themeIdForStore = `custom-${customThemeId}`;
    const storeThemeDir = path_1.default.join(process.cwd(), 'uploads', 'stores', storeIdToUse, 'themes', themeIdForStore);
    console.log('📁 Custom theme installation directory:', storeThemeDir);
    try {
        // Delete the installation directory if it exists
        if (fs_1.default.existsSync(storeThemeDir)) {
            fs_1.default.rmSync(storeThemeDir, { recursive: true, force: true });
            console.log('✅ Custom theme installation directory deleted');
        }
        else {
            console.log('⚠️ Custom theme installation directory not found (may have been already deleted)');
        }
        res.status(200).json({
            success: true,
            message: 'Custom theme uninstalled successfully',
        });
    }
    catch (error) {
        console.error('❌ Error uninstalling custom theme:', error);
        throw new error_utils_1.CustomError(`Failed to uninstall custom theme: ${error?.message || 'Unknown error'}`, 500);
    }
});
exports.deleteCustomTheme = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new error_utils_1.CustomError("Invalid theme ID format", 400);
    }
    if (!req.user?.id) {
        throw new error_utils_1.CustomError("User authentication required", 401);
    }
    let customTheme;
    try {
        customTheme = await custom_theme_model_1.CustomTheme.findOne({
            _id: new mongoose_1.Types.ObjectId(id),
            createdBy: new mongoose_1.Types.ObjectId(req.user.id),
        });
    }
    catch (error) {
        throw new error_utils_1.CustomError("Invalid theme ID", 400);
    }
    if (!customTheme) {
        throw new error_utils_1.CustomError("Custom theme not found", 404);
    }
    // Delete directory and all files
    if (fs_1.default.existsSync(customTheme.directories.theme)) {
        fs_1.default.rmSync(customTheme.directories.theme, { recursive: true, force: true });
    }
    // Delete from database
    await custom_theme_model_1.CustomTheme.findByIdAndDelete(new mongoose_1.Types.ObjectId(id));
    res.status(200).json({
        success: true,
        message: "Custom theme deleted successfully",
    });
});
// Serve custom theme files
exports.serveCustomThemeFiles = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { themeId } = req.params;
    // Extract file path from req.params[0] (wildcard parameter from /* route pattern)
    // Similar to how serveInstalledThemeFiles works
    let filePath = req.params[0] || '';
    if (!filePath) {
        // If params[0] is not available, try to extract from URL
        const urlMatch = req.url.match(/\/files\/(.+)$/);
        if (urlMatch && urlMatch[1]) {
            filePath = urlMatch[1];
        }
        else if (req.url.endsWith('/files') || req.url.endsWith('/files/')) {
            // If URL ends with /files, default to index.html
            filePath = 'index.html';
        }
        else {
            filePath = 'index.html';
        }
    }
    // Decode URL-encoded paths
    if (filePath) {
        try {
            filePath = decodeURIComponent(filePath);
        }
        catch (e) {
            // If decoding fails, use original path
            console.warn('Failed to decode file path:', filePath);
        }
    }
    console.log('📁 Serving custom theme file:', {
        themeId,
        filePath,
        url: req.url,
        originalUrl: req.originalUrl,
        params: req.params,
        params0: req.params[0]
    });
    if (!mongoose_1.Types.ObjectId.isValid(themeId)) {
        throw new error_utils_1.CustomError("Invalid theme ID format", 400);
    }
    let customTheme;
    try {
        customTheme = await custom_theme_model_1.CustomTheme.findById(new mongoose_1.Types.ObjectId(themeId));
    }
    catch (error) {
        throw new error_utils_1.CustomError("Invalid theme ID", 400);
    }
    if (!customTheme) {
        throw new error_utils_1.CustomError("Custom theme not found", 404);
    }
    // If user is authenticated, verify they own the theme (optional check)
    // If not authenticated, allow access for preview purposes
    if (req.user?.id) {
        const userId = new mongoose_1.Types.ObjectId(req.user.id);
        const themeOwnerId = new mongoose_1.Types.ObjectId(customTheme.createdBy);
        if (!userId.equals(themeOwnerId)) {
            // Allow preview even if not owner (for sharing purposes)
            // But log it for security
            console.log(`User ${req.user.id} accessing custom theme ${themeId} (not owner)`);
        }
    }
    const fullPath = path_1.default.join(customTheme.directories.unzippedTheme, filePath || "index.html");
    // Security check: ensure the file is within the theme directory
    const resolvedPath = path_1.default.resolve(fullPath);
    const resolvedThemeDir = path_1.default.resolve(customTheme.directories.unzippedTheme);
    if (!resolvedPath.startsWith(resolvedThemeDir)) {
        throw new error_utils_1.CustomError("Invalid file path", 403);
    }
    if (!fs_1.default.existsSync(resolvedPath)) {
        throw new error_utils_1.CustomError("File not found", 404);
    }
    // Set appropriate headers for iframe embedding (for preview)
    const ext = path_1.default.extname(resolvedPath).toLowerCase();
    if (ext === '.html') {
        // Read and process HTML file
        let htmlContent = fs_1.default.readFileSync(resolvedPath, 'utf8');
        // Update relative paths to work with our file serving endpoint
        const baseUrl = `${req.protocol}://${req.get('host')}/api/custom-themes/${themeId}/files`;
        // Update src attributes (images, scripts, etc.)
        htmlContent = htmlContent.replace(/src=["'](?!https?:|data:|mailto:|tel:|javascript:|#|\/\/)([^"']+)["']/gi, (match, srcPath) => {
            // Handle relative paths
            const cleanPath = srcPath.startsWith('/') ? srcPath.substring(1) : srcPath;
            const quote = match[0]; // Preserve original quote style
            return `src=${quote}${baseUrl}/${cleanPath}${quote}`;
        });
        // Update href attributes (CSS, links, etc.)
        htmlContent = htmlContent.replace(/href=["'](?!https?:|data:|mailto:|tel:|javascript:|#|\/\/)([^"']+)["']/gi, (match, hrefPath) => {
            // Handle relative paths for CSS and other resources
            const cleanPath = hrefPath.startsWith('/') ? hrefPath.substring(1) : hrefPath;
            const quote = match[0]; // Preserve original quote style
            return `href=${quote}${baseUrl}/${cleanPath}${quote}`;
        });
        // Update srcset attributes (responsive images)
        htmlContent = htmlContent.replace(/srcset=["']([^"']+)["']/gi, (match, srcsetValue) => {
            const quote = match[0];
            const updatedSrcset = srcsetValue.split(',').map((entry) => {
                const trimmed = entry.trim();
                const parts = trimmed.split(/\s+/);
                const url = parts[0];
                const size = parts.slice(1).join(' ');
                // Skip if already absolute URL
                if (/^(https?:|data:|mailto:|tel:|javascript:|#|\/\/)/i.test(url)) {
                    return trimmed;
                }
                // Make relative path absolute
                const cleanPath = url.startsWith('/') ? url.substring(1) : url;
                return size ? `${baseUrl}/${cleanPath} ${size}` : `${baseUrl}/${cleanPath}`;
            }).join(', ');
            return `srcset=${quote}${updatedSrcset}${quote}`;
        });
        // Update background-image URLs in style attributes and CSS
        htmlContent = htmlContent.replace(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/gi, (match, urlPath) => {
            // Skip if already absolute URL
            if (/^(https?:|data:|mailto:|tel:|javascript:|#|\/\/)/i.test(urlPath)) {
                return match;
            }
            const cleanPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
            return `background-image: url('${baseUrl}/${cleanPath}')`;
        });
        // Ensure viewport meta tag exists for proper responsive rendering
        if (!htmlContent.includes('viewport')) {
            htmlContent = htmlContent.replace(/<head>/i, `<head><meta name="viewport" content="width=device-width, initial-scale=1.0">`);
        }
        // Ensure charset meta tag exists
        if (!htmlContent.includes('charset')) {
            htmlContent = htmlContent.replace(/<head>/i, `<head><meta charset="UTF-8">`);
        }
        // Check if CSS file exists and link it if not already linked
        const cssPath = path_1.default.join(customTheme.directories.unzippedTheme, 'style.css');
        const cssExists = fs_1.default.existsSync(cssPath);
        const hasCssLink = htmlContent.includes('style.css') || htmlContent.includes('<style>');
        // Inject CSS link if CSS file exists but isn't linked
        if (cssExists && !hasCssLink) {
            const cssLink = `<link rel="stylesheet" href="${baseUrl}/style.css">`;
            if (htmlContent.includes('</head>')) {
                htmlContent = htmlContent.replace('</head>', `${cssLink}</head>`);
            }
            else if (htmlContent.includes('<head>')) {
                htmlContent = htmlContent.replace('<head>', `<head>${cssLink}`);
            }
            else {
                htmlContent = `<head>${cssLink}</head>${htmlContent}`;
            }
        }
        // Inject base styles to ensure consistent rendering (box-sizing, etc.)
        const baseStyles = `
        <style>
          *, *::before, *::after {
            box-sizing: border-box;
          }
          html {
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            text-size-adjust: 100%;
          }
          body {
            margin: 0;
            padding: 0;
          }
          img {
            max-width: 100%;
            height: auto;
            display: block;
          }
        </style>
      `;
        // Inject base styles before closing head tag or after opening head
        if (htmlContent.includes('</head>')) {
            htmlContent = htmlContent.replace('</head>', `${baseStyles}</head>`);
        }
        else if (htmlContent.includes('<head>')) {
            htmlContent = htmlContent.replace('<head>', `<head>${baseStyles}`);
        }
        else {
            // No head tag, add one
            htmlContent = `<head>${baseStyles}</head>${htmlContent}`;
        }
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', "frame-ancestors *");
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    }
    else {
        // Set appropriate content type for other files
        const contentTypes = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject'
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        res.sendFile(resolvedPath);
    }
});
