import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { CustomerAddress, Order, OrderItem } from '../../models';
import { asyncErrorHandler, CustomError } from '../../utils/error.utils';

export const createOrder = asyncErrorHandler(async (req: Request, res: Response) => {
  const user = req.storefrontUser;
  if (!user) throw new CustomError('Unauthorized', 401);

  const {
    storeId,
    shippingAddressId,
    billingAddressId,
    items,
    paymentMethod,
    subtotal,
    tax,
    shippingCost,
    total,
    notes,
  } = req.body as {
    storeId: string;
    shippingAddressId: string;
    billingAddressId?: string;
    items: Array<{
      productVariantId: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    paymentMethod?: 'credit_card' | 'paypal' | 'cod' | 'other';
    subtotal: number;
    tax?: number;
    shippingCost?: number;
    total: number;
    notes?: string;
  };

  // Validate required fields
  if (!storeId || !mongoose.Types.ObjectId.isValid(storeId)) {
    throw new CustomError('Valid storeId is required', 400);
  }

  if (!shippingAddressId || !mongoose.Types.ObjectId.isValid(shippingAddressId)) {
    throw new CustomError('Valid shippingAddressId is required', 400);
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new CustomError('Items array is required and must not be empty', 400);
  }

  if (typeof subtotal !== 'number' || subtotal < 0) {
    throw new CustomError('Valid subtotal is required', 400);
  }

  if (typeof total !== 'number' || total < 0) {
    throw new CustomError('Valid total is required', 400);
  }

  // Validate billingAddressId if provided
  if (billingAddressId && !mongoose.Types.ObjectId.isValid(billingAddressId)) {
    throw new CustomError('Valid billingAddressId is required', 400);
  }

  // Validate shipping address belongs to customer
  const shippingAddress = await CustomerAddress.findOne({
    _id: new Types.ObjectId(shippingAddressId),
    customerId: new Types.ObjectId(user._id),
  });

  if (!shippingAddress) {
    throw new CustomError('Shipping address not found or does not belong to customer', 404);
  }

  // Validate billing address if provided
  if (billingAddressId) {
    const billingAddress = await CustomerAddress.findOne({
      _id: new Types.ObjectId(billingAddressId),
      customerId: new Types.ObjectId(user._id),
    });

    if (!billingAddress) {
      throw new CustomError('Billing address not found or does not belong to customer', 404);
    }
  }

  // Validate items
  for (const item of items) {
    if (!item.productVariantId || !mongoose.Types.ObjectId.isValid(item.productVariantId)) {
      throw new CustomError('Valid productVariantId is required for all items', 400);
    }
    if (typeof item.quantity !== 'number' || item.quantity < 1) {
      throw new CustomError('Valid quantity (>= 1) is required for all items', 400);
    }
    if (typeof item.price !== 'number' || item.price < 0) {
      throw new CustomError('Valid price is required for all items', 400);
    }
    if (typeof item.total !== 'number' || item.total < 0) {
      throw new CustomError('Valid total is required for all items', 400);
    }
  }

  // Create order
  const order = await Order.create({
    storeId: new Types.ObjectId(storeId),
    customerId: new Types.ObjectId(user._id),
    shippingAddressId: new Types.ObjectId(shippingAddressId),
    billingAddressId: billingAddressId ? new Types.ObjectId(billingAddressId) : undefined,
    paymentMethod: paymentMethod || undefined,
    paymentStatus: 'unpaid',
    subtotal,
    tax: tax || 0,
    shippingCost: shippingCost || 0,
    total,
    notes: notes || undefined,
    status: 'pending',
  });

  // Create order items
  const orderItems = await OrderItem.insertMany(
    items.map((item) => ({
      orderId: order._id,
      productVariantId: new Types.ObjectId(item.productVariantId),
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    }))
  );

  // Populate order with addresses
  await order.populate([
    { path: 'customerId', select: '-password' },
    { path: 'shippingAddressId' },
    { path: 'billingAddressId' },
  ]);

  // Populate order items with productVariantId (same as getOrdersByCustomerId)
  const populatedOrderItems = await OrderItem.populate(orderItems, {
    path: 'productVariantId',
    select: {
      cost: 0,
      profit: 0,
      marginPercent: 0,
      unitPriceTotalAmount: 0,
      unitPriceTotalAmountMetric: 0,
      unitPriceBaseMeasure: 0,
      unitPriceBaseMeasureMetric: 0,
      hsCode: 0,
      isInventoryTrackingEnabled: 0,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      ...order.toObject(),
      items: populatedOrderItems,
    },
    message: 'Order created successfully',
  });
});

export const getOrdersByCustomerId = asyncErrorHandler(async (req: Request, res: Response) => {
  const user = req.storefrontUser;
  if (!user) throw new CustomError('Unauthorized', 401);

  const { customerId } = req.params as { customerId: string };

  if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
    throw new CustomError('Valid customerId is required', 400);
  }

  // Ensure customer can only access their own orders
  if (String(user._id) !== String(customerId)) {
    throw new CustomError('Forbidden', 403);
  }

  const orders = await Order.find({ customerId: new Types.ObjectId(customerId) })
    .populate([
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

