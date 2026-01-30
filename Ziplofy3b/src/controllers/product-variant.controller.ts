import { Request, Response } from "express";
import { ProductVariant } from "../models/product/product-variants.model";
import { asyncErrorHandler, CustomError } from "../utils/error.utils";

// GET variants by product id
export const getVariantsByProductId = asyncErrorHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  if (!productId) {
    throw new CustomError("productId is required", 400);
  }

  const variants = await ProductVariant.find({ productId, depricated: false })
    .populate({ path: 'package', model: 'Packaging' })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: variants,
    count: variants.length,
  });
});

// PUT update variant by id
export const updateVariantById = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    throw new CustomError("Variant id is required", 400);
  }

  // Validate that variant exists
  const existingVariant = await ProductVariant.findById(id);
  if (!existingVariant) {
    throw new CustomError("Variant not found", 404);
  }

  // Update the variant with new data
  const updatedVariant = await ProductVariant.findByIdAndUpdate(
    id,
    updateData,
    { 
      new: true, 
      runValidators: true 
    }
  ).populate({ path: 'package', model: 'Packaging' });

  res.status(200).json({
    success: true,
    data: updatedVariant,
    message: 'Variant updated successfully',
  });
});

// Public route for getting variants by product id
export const getVariantsByProductIdPublic = asyncErrorHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  if (!productId) {
    throw new CustomError("productId is required", 400);
  }

  const variants = await ProductVariant.find({ productId, depricated: false })
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
    })

  res.status(200).json({
    success: true,
    data: variants,
    count: variants.length,
  });
});
