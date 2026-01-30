import { Router } from "express";
import { getCollectionsByStoreId, getProductsInCollection } from "../../controllers/storefront-collection.controller";

export const storeFrontCollectionRouter = Router();


storeFrontCollectionRouter.get("/store/:storeId", getCollectionsByStoreId);

storeFrontCollectionRouter.get("/:collectionId/products", getProductsInCollection);