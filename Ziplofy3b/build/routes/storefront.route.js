"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storefrontRouter = void 0;
const express_1 = require("express");
const storefront_controller_1 = require("../controllers/storefront.controller");
exports.storefrontRouter = (0, express_1.Router)();
// Storefront routes
exports.storefrontRouter.route('/:storeId').get(storefront_controller_1.renderStorefront);
exports.storefrontRouter.route('/:storeId/assets/:themeId/*').get(storefront_controller_1.serveThemeAsset);
exports.storefrontRouter.route('/:storeId/api/data').get(storefront_controller_1.getStoreData);
