import { Router } from 'express';
import { getOrdersByStoreId } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';

export const orderRouter = Router();
orderRouter.use(protect);

// GET /api/orders/store/:storeId - Get all orders by store ID
orderRouter.get('/store/:storeId', getOrdersByStoreId);

