"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariantsByProductIdPublic = exports.updateVariantById = exports.getVariantsByProductId = void 0;
const product_variants_model_1 = require("../models/product/product-variants.model");
const error_utils_1 = require("../utils/error.utils");
// GET variants by product id
exports.getVariantsByProductId = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        throw new error_utils_1.CustomError("productId is required", 400);
    }
    const variants = await product_variants_model_1.ProductVariant.find({ productId, depricated: false })
        .populate({ path: 'package', model: 'Packaging' })
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data: variants,
        count: variants.length,
    });
});
// PUT update variant by id
exports.updateVariantById = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
        throw new error_utils_1.CustomError("Variant id is required", 400);
    }
    // Validate that variant exists
    const existingVariant = await product_variants_model_1.ProductVariant.findById(id);
    if (!existingVariant) {
        throw new error_utils_1.CustomError("Variant not found", 404);
    }
    // Update the variant with new data
    const updatedVariant = await product_variants_model_1.ProductVariant.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).populate({ path: 'package', model: 'Packaging' });
    res.status(200).json({
        success: true,
        data: updatedVariant,
        message: 'Variant updated successfully',
    });
});
// Public route for getting variants by product id
exports.getVariantsByProductIdPublic = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        throw new error_utils_1.CustomError("productId is required", 400);
    }
    const variants = await product_variants_model_1.ProductVariant.find({ productId, depricated: false })
        .select({
        cost: 0,
        profit: 0,
        marginPercent: 0,
        unitPriceTotalAmount: 0,
        unitPriceTotalAmountMetric: 0,
        unitPriceBaseMeasure: 0,
        unitPriceBaseMeasureMetric: 0,
        hsCode: 0,
        isInventoryTrackingEnabled: 0,
    });
    res.status(200).json({
        success: true,
        data: variants,
        count: variants.length,
    });
});
