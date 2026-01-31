"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstallThemeForStore = exports.getInstalledThemesByStore = exports.installThemeForStore = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const installed_themes_model_1 = require("../models/installed-themes.model");
const theme_model_1 = require("../models/theme.model");
const error_utils_1 = require("../utils/error.utils");
// Install (activate) a theme for a store
exports.installThemeForStore = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId, themeId } = req.body;
    if (!storeId || !themeId)
        throw new error_utils_1.CustomError('storeId and themeId are required', 400);
    const validTheme = await theme_model_1.Theme.findById(themeId);
    if (!validTheme)
        throw new error_utils_1.CustomError('Theme not found', 404);
    const doc = await installed_themes_model_1.InstalledThemes.findOneAndUpdate({ storeId: new mongoose_1.default.Types.ObjectId(storeId), themeId: new mongoose_1.default.Types.ObjectId(themeId) }, { $set: { isActive: true } }, { upsert: true, new: true, setDefaultsOnInsert: true }).populate('themeId').lean();
    if (doc && doc.themeId) {
        const t = doc.themeId;
        const thumbnailUrl = t?.thumbnail?.filename
            ? `${req.protocol}://${req.get('host')}/uploads/themes/${t.themePath}/thumbnail/${t.thumbnail.filename}`
            : null;
        doc.themeId.thumbnailUrl = thumbnailUrl;
        delete doc.themeId.thumbnail;
        delete doc.themeId.zipFile;
        delete doc.themeId.themePath;
        delete doc.themeId.directories;
    }
    return res.status(200).json({ success: true, data: doc });
});
// Get installed (active) themes by store id
exports.getInstalledThemesByStore = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId } = req.params;
    if (!storeId)
        throw new error_utils_1.CustomError('storeId is required', 400);
    const records = await installed_themes_model_1.InstalledThemes.find({ storeId: new mongoose_1.default.Types.ObjectId(storeId), isActive: true })
        .populate('themeId')
        .lean();
    // For each record, replace themeId.thumbnail with thumbnailUrl only
    const shaped = records.map((r) => {
        if (r?.themeId) {
            const t = r.themeId;
            const thumbnailUrl = t?.thumbnail?.filename
                ? `${req.protocol}://${req.get('host')}/uploads/themes/${t.themePath}/thumbnail/${t.thumbnail.filename}`
                : null;
            t.thumbnailUrl = thumbnailUrl;
            delete t.thumbnail;
            delete t.zipFile;
            delete t.themePath;
            delete t.directories;
        }
        return r;
    });
    return res.status(200).json({ success: true, data: shaped });
});
// Uninstall (deactivate) theme for a store
exports.uninstallThemeForStore = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const installedThemeId = req.params.installedThemeId;
    if (!installedThemeId)
        throw new error_utils_1.CustomError('installedThemeId is required', 400);
    const deleted = await installed_themes_model_1.InstalledThemes.findByIdAndDelete(new mongoose_1.default.Types.ObjectId(installedThemeId));
    if (!deleted)
        throw new error_utils_1.CustomError('Installed theme not found', 404);
    return res.status(200).json({ success: true, message: 'Theme uninstalled for store', data: deleted });
});
