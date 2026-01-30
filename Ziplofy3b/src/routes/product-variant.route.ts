import { Router } from "express";
import {
    getVariantsByProductId,
    getVariantsByProductIdPublic,
    updateVariantById
} from "../controllers/product-variant.controller";
import { protect } from "../middlewares/auth.middleware";

export const productVariantRouter = Router();

// Public route for getting variants by product id
productVariantRouter.get("/public/product/:productId", getVariantsByProductIdPublic);

// Protect all variant routes
productVariantRouter.use(protect);

// GET variants by product id
productVariantRouter.get("/product/:productId", getVariantsByProductId);

// PUT update variant by id
productVariantRouter.put("/:id", updateVariantById);
