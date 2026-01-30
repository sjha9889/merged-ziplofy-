import { Router } from "express";
import {
  addOptionToProduct,
  addVariantsToProduct,
  createProduct,
  deleteVariantsFromProduct,
  getProductsByStoreId,
  getProductsByStoreIdPublic,
  searchProductsBasic,
  searchProductsWithAvailability,
  searchProductsWithVariantAndDestination,
  searchProductsWithVariants,
} from "../controllers/product.controller";
import { protect } from "../middlewares/auth.middleware";

export const productRouter = Router();

// Public route for getting products by store ID with pagination
productRouter.get("/public/store/:storeId", getProductsByStoreIdPublic);

// Protect all product routes (adjust if public create not desired)
productRouter.use(protect);

// Create product
productRouter.post("/", createProduct);

// Get products by store id
productRouter.get("/store/:storeId", getProductsByStoreId);

// add variants to product
productRouter.post("/:id/variants", addVariantsToProduct);

// delete variants from product
productRouter.delete("/:id/variants", deleteVariantsFromProduct);

// add option to existing variant dimension
productRouter.post("/:id/variants/:dimensionName/options", addOptionToProduct);

// delete option from existing variant dimension
// productRouter.delete("/:id/variants/:dimensionName/options", deleteOptionFromVariantDimension);

// search products with availability
productRouter.get("/search", searchProductsWithAvailability);

// search products basic (title + first image + id)
productRouter.get("/search-basic", searchProductsBasic);

// search products with variants (no availability)
productRouter.get("/search-with-variants", searchProductsWithVariants);

// search products with variant and destination availability
productRouter.get("/search-product-with-variant-and-destination", searchProductsWithVariantAndDestination);

