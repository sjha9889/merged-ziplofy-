"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsInCollection = exports.getCollectionsByStoreId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_utils_1 = require("../utils/error.utils");
const collections_model_1 = require("../models/collections/collections.model");
const collection_entry_model_1 = require("../models/collection-entry/collection-entry.model");
const product_model_1 = require("../models/product/product.model");
// Get collections by store id
exports.getCollectionsByStoreId = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId } = req.params;
    if (!storeId)
        throw new error_utils_1.CustomError("storeId is required", 400);
    const collections = await collections_model_1.Collections.find({ storeId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: collections, count: collections.length });
});
// Get products inside a collection (storefront)
exports.getProductsInCollection = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { collectionId } = req.params;
    const { page = 1, limit = 12, q } = req.query;
    if (!collectionId || !mongoose_1.default.isValidObjectId(collectionId)) {
        throw new error_utils_1.CustomError("Valid collectionId is required", 400);
    }
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 12));
    const skip = (pageNum - 1) * limitNum;
    // Resolve product ids from collection entries
    const productIds = await collection_entry_model_1.CollectionEntry.find({ collectionId })
        .distinct("productId");
    if (productIds.length === 0) {
        return res.status(200).json({
            success: true,
            data: [],
            pagination: { currentPage: pageNum, totalPages: 0, totalItems: 0, itemsPerPage: limitNum }
        });
    }
    const filter = { _id: { $in: productIds } };
    if (q && typeof q === 'string') {
        const rx = new RegExp(q.trim(), 'i');
        filter.$or = [{ title: rx }, { sku: rx }];
    }
    const [products, total] = await Promise.all([
        product_model_1.Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .select({
            title: 1,
            description: 1,
            category: 1,
            price: 1,
            compareAtPrice: 1,
            sku: 1,
            status: 1,
            vendor: 1,
            imageUrls: 1,
            createdAt: 1,
            updatedAt: 1,
        })
            .populate({ path: 'vendor', select: 'name' })
            .populate({ path: 'category', select: 'name' })
            .lean(),
        product_model_1.Product.countDocuments(filter),
    ]);
    res.status(200).json({
        success: true,
        data: products,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total,
            itemsPerPage: limitNum,
        },
    });
});
