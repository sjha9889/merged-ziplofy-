import { Router } from 'express';
import { getStoreData, renderStorefront, serveThemeAsset } from '../controllers/storefront.controller';

export const storefrontRouter = Router();

// Storefront routes
storefrontRouter.route('/:storeId').get(renderStorefront);
storefrontRouter.route('/:storeId/assets/:themeId/*').get(serveThemeAsset);
storefrontRouter.route('/:storeId/api/data').get(getStoreData);

