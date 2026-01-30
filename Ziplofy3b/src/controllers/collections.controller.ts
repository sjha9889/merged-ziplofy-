import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncErrorHandler, CustomError } from "../utils/error.utils";
import { Collections, ICollection } from "../models/collections/collections.model";
import { CollectionEntry } from "../models/collection-entry/collection-entry.model";
import { Product } from "../models/product/product.model";

// Create a new collection
export const createCollection = asyncErrorHandler(async (req: Request, res: Response) => {
  const {
    storeId,
    title,
    description,
    pageTitle,
    metaDescription,
    urlHandle,
    onlineStorePublishing,
    pointOfSalePublishing,
    status,
  } = req.body as Partial<ICollection> & Record<string, any>;

  if (!storeId || !title || !description || !pageTitle || !metaDescription || !urlHandle) {
    throw new CustomError("Missing required fields", 400);
  }

  // Optional status validation
  if (typeof status !== 'undefined' && status !== 'draft' && status !== 'published') {
    throw new CustomError("Invalid status. Allowed values are 'draft' or 'published'", 400);
  }

  const collection = await Collections.create({
    storeId,
    title,
    description,
    pageTitle,
    metaDescription,
    urlHandle,
    onlineStorePublishing: onlineStorePublishing ?? true,
    pointOfSalePublishing: pointOfSalePublishing ?? false,
    ...(typeof status !== 'undefined' ? { status } : {}),
  });

  res.status(201).json({ success: true, data: collection, message: "Collection created successfully" });
});

// Get collections by store id
export const getCollectionsByStoreId = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  if (!storeId) throw new CustomError("storeId is required", 400);

  const collections = await Collections.find({ storeId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: collections, count: collections.length });
});

// Update collection
export const updateCollection = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const update = req.body as Partial<ICollection>;

  const updated = await Collections.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!updated) throw new CustomError("Collection not found", 404);

  res.status(200).json({ success: true, data: updated, message: "Collection updated successfully" });
});

// Delete collection
export const deleteCollection = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await Collections.findByIdAndDelete(id);
  if (!deleted) throw new CustomError("Collection not found", 404);

  res.status(200).json({ success: true, data: { deletedId: id }, message: "Collection deleted successfully" });
});

// Search collections with fuzzy search
export const searchCollections = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const { q, page = 1, limit = 10 } = req.query;
  
  if (!storeId) throw new CustomError("storeId is required", 400);
  if (!q || typeof q !== 'string') throw new CustomError("Search query 'q' is required", 400);

  const skip = (Number(page) - 1) * Number(limit);

  // Simple fuzzy search on collection names
  const searchCriteria = {
    storeId,
    title: { $regex: q, $options: 'i' }
  };

  // Get collections with pagination
  const collections = await Collections.find(searchCriteria)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Get product counts for each collection
  const collectionsWithProductCount = await Promise.all(
    collections.map(async (collection) => {
      const productCount = await CollectionEntry.countDocuments({
        collectionId: collection._id
      });

      return {
        ...collection,
        productCount
      };
    })
  );

  // Get total count for pagination
  const totalCollections = await Collections.countDocuments(searchCriteria);

  res.status(200).json({
    success: true,
    data: collectionsWithProductCount,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalCollections / Number(limit)),
      totalItems: totalCollections,
      itemsPerPage: Number(limit)
    }
  });
});

export const searchProductsInCollection = asyncErrorHandler(async (req: Request, res: Response) => {
  const { collectionId } = req.params;
  const { q, page = 1, limit = 10 } = req.query as Record<string, any>;

  if (!collectionId || !mongoose.isValidObjectId(collectionId)) {
    throw new CustomError("Valid collectionId is required", 400);
  }
  if (!q || typeof q !== "string") {
    throw new CustomError("Search query 'q' is required", 400);
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;
  const rx = new RegExp(q.trim(), "i");

  // Get product ids in the collection
  const productIds: mongoose.Types.ObjectId[] = await CollectionEntry.find({ collectionId })
    .distinct("productId");

  if (productIds.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
      pagination: {
        currentPage: pageNum,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limitNum,
      },
    });
  }

  const filter = {
    _id: { $in: productIds },
    $or: [
      { title: rx },
      { sku: rx },
    ],
  } as any;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select({ title: 1, sku: 1, imageUrls: 1, vendor: 1, productType: 1, createdAt: 1 })
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

