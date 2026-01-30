import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createAmountOffOrderDiscount, getAmountOffOrderDiscountsByStore } from '../controllers/amount-off-order-discount.controller';

export const amountOffOrderDiscountRouter = Router();

amountOffOrderDiscountRouter.use(protect);

// Create
amountOffOrderDiscountRouter.post('/', createAmountOffOrderDiscount);

// List by store
amountOffOrderDiscountRouter.get('/store/:id', getAmountOffOrderDiscountsByStore);
