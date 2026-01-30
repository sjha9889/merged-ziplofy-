import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncErrorHandler, CustomError } from "../utils/error.utils";
import { Collections, ICollection } from "../models/collections/collections.model";
import { CollectionEntry } from "../models/collection-entry/collection-entry.model";
import { Product } from "../models/product/product.model";

// Get collections by store id
export const getCollectionsByStoreId = asyncErrorHandler(async (req: Request, res: Response) => {
    const { storeId } = req.params;
    if (!storeId) throw new CustomError("storeId is required", 400);

    const collections = await Collections.find({ storeId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: collections, count: collections.length });
});
  
// Get products inside a collection (storefront)
export const getProductsInCollection = asyncErrorHandler(async (req: Request, res: Response) => {
  const { collectionId } = req.params;
  const { page = 1, limit = 12, q } = req.query as Record<string, any>;

  if (!collectionId || !mongoose.isValidObjectId(collectionId)) {
    throw new CustomError("Valid collectionId is required", 400);
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 12));
  const skip = (pageNum - 1) * limitNum;

  // Resolve product ids from collection entries
  const productIds: mongoose.Types.ObjectId[] = await CollectionEntry.find({ collectionId })
    .distinct("productId");

  if (productIds.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
      pagination: { currentPage: pageNum, totalPages: 0, totalItems: 0, itemsPerPage: limitNum }
    });
  }

  const filter: any = { _id: { $in: productIds } };
  if (q && typeof q === 'string') {
    const rx = new RegExp(q.trim(), 'i');
    filter.$or = [{ title: rx }, { sku: rx }];
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
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
    Product.countDocuments(filter),
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