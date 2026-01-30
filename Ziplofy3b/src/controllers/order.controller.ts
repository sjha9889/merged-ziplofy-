import mongoose, { Types } from 'mongoose';
import { Request, Response } from 'express';
import { Order, OrderItem } from '../models';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';

export const getOrdersByStoreId = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };

  if (!storeId || !mongoose.Types.ObjectId.isValid(storeId)) {
    throw new CustomError('Valid storeId is required', 400);
  }

  const orders = await Order.find({ storeId: new Types.ObjectId(storeId) })
    .populate([
      { path: 'storeId', select: 'name' },
      { path: 'customerId', select: '-password' },
      { path: 'shippingAddressId' },
      { path: 'billingAddressId' },
    ])
    .sort({ orderDate: -1 })
    .lean();

  // Fetch order items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await OrderItem.find({ orderId: order._id })
        .populate('productVariantId', {
          cost: 0,
          profit: 0,
          marginPercent: 0,
          unitPriceTotalAmount: 0,
          unitPriceTotalAmountMetric: 0,
          unitPriceBaseMeasure: 0,
          unitPriceBaseMeasureMetric: 0,
          hsCode: 0,
          isInventoryTrackingEnabled: 0,
        })
        .lean();

      return {
        ...order,
        items,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: ordersWithItems,
    count: ordersWithItems.length,
  });
});

