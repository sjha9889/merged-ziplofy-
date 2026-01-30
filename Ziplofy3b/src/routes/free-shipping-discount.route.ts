import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createFreeShippingDiscount, getFreeShippingDiscountsByStore } from '../controllers/free-shipping-discount.controller';

export const freeShippingDiscountRouter = Router();

freeShippingDiscountRouter.use(protect);

// Create
freeShippingDiscountRouter.post('/', createFreeShippingDiscount);

// List by store
freeShippingDiscountRouter.get('/store/:id', getFreeShippingDiscountsByStore);
