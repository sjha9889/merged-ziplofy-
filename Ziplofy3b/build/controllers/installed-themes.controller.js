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
    const doc = await installed_themes_model_1.InstalledThemes.findOneAndUpdate({ store: new mongoose_1.default.Types.ObjectId(storeId), theme: new mongoose_1.default.Types.ObjectId(themeId) }, { $set: { uninstalledAt: null } }, { upsert: true, new: true, setDefaultsOnInsert: true }).populate('theme').lean();
    if (doc && doc.theme) {
        const t = doc.theme;
        const thumbnailUrl = t?.thumbnail?.filename
            ? `${req.protocol}://${req.get('host')}/uploads/themes/${t.themePath}/thumbnail/${t.thumbnail.filename}`
            : null;
        doc.theme.thumbnailUrl = thumbnailUrl;
        delete doc.theme.thumbnail;
        delete doc.theme.zipFile;
        delete doc.theme.themePath;
        delete doc.theme.directories;
    }
    return res.status(200).json({ success: true, data: doc });
});
// Get installed themes by store id
exports.getInstalledThemesByStore = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId } = req.params;
    if (!storeId)
        throw new error_utils_1.CustomError('storeId is required', 400);
    const records = await installed_themes_model_1.InstalledThemes.find({ store: new mongoose_1.default.Types.ObjectId(storeId), uninstalledAt: null })
        .populate('theme')
        .lean();
    // For each record, replace themeId.thumbnail with thumbnailUrl only
    const shaped = records.map((r) => {
        if (r?.theme) {
            const t = r.theme;
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
