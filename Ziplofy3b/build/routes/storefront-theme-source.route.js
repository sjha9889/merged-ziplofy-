"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storefrontThemeSourceRouter = void 0;
const express_1 = require("express");
const storefront_theme_source_controller_1 = require("../controllers/storefront-theme-source.controller");
exports.storefrontThemeSourceRouter = (0, express_1.Router)();
exports.storefrontThemeSourceRouter.get("/:themeId", storefront_theme_source_controller_1.listStorefrontThemeSourceFiles);
exports.storefrontThemeSourceRouter.get("/:themeId/*", storefront_theme_source_controller_1.getStorefrontThemeSourceFile);
