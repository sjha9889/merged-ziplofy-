import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createBuyXGetYDiscount, getBuyXGetYDiscountsByStore } from '../controllers/buy-x-get-y-discount.controller';

export const buyXGetYDiscountRouter = Router();

buyXGetYDiscountRouter.use(protect);

// Create
buyXGetYDiscountRouter.post('/', createBuyXGetYDiscount);

// List by store
buyXGetYDiscountRouter.get('/store/:id', getBuyXGetYDiscountsByStore);
