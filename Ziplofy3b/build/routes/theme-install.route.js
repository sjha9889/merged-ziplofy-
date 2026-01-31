"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeInstallRouter = void 0;
const express_1 = require("express");
const theme_install_controller_1 = require("../controllers/theme-install.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.themeInstallRouter = (0, express_1.Router)();
exports.themeInstallRouter.use(auth_middleware_1.protect);
// POST /api/theme-install - Install theme to client's store
exports.themeInstallRouter.post('/', theme_install_controller_1.installTheme);
// GET /api/theme-install/store/:storeId - Get installed themes for a store
exports.themeInstallRouter.get('/store/:storeId', theme_install_controller_1.getClientInstalledThemes);
// GET /api/theme-install/:installationId - Get theme installation details
exports.themeInstallRouter.get('/:installationId', theme_install_controller_1.getThemeInstallationDetails);
// DELETE /api/theme-install/:installationId - Uninstall theme from store
exports.themeInstallRouter.delete('/:installationId', theme_install_controller_1.uninstallTheme);
// PUT /api/theme-install/:installationId - Update theme customization
exports.themeInstallRouter.put('/:installationId', theme_install_controller_1.updateTheme);
