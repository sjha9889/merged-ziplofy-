"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeFrontCollectionRouter = void 0;
const express_1 = require("express");
const storefront_collection_controller_1 = require("../../controllers/storefront-collection.controller");
exports.storeFrontCollectionRouter = (0, express_1.Router)();
exports.storeFrontCollectionRouter.get("/store/:storeId", storefront_collection_controller_1.getCollectionsByStoreId);
exports.storeFrontCollectionRouter.get("/:collectionId/products", storefront_collection_controller_1.getProductsInCollection);
