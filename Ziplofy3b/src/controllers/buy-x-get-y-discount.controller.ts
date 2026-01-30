import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BuyXGetYDiscount } from '../models/discount/buy-x-get-y-discount-model/buy-x-get-y-discount.model';
import { BuyXGetYBuysEntry } from '../models/discount/buy-x-get-y-discount-model/buy-x-get-y-buys-entry.model';
import { BuyXGetYGetsEntry } from '../models/discount/buy-x-get-y-discount-model/buy-x-get-y-gets-entry.model';
import { BuyXGetYEligibilityEntry } from '../models/discount/buy-x-get-y-discount-model/buy-x-get-y-eligibility-entry.model';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';

export const createBuyXGetYDiscount = asyncErrorHandler(async (req: Request, res: Response) => {
  const {
    // Store
    storeId,

    // Method
    method,
    discountCode,
    title,

    // Sales channel
    allowDiscountOnChannels,

    // Customer buys
    customerBuys,
    quantity,
    amount,
    anyItemsFrom,

    // Customer gets
    customerGetsQuantity,
    customerGetsAnyItemsFrom,
    discountedValue,
    discountedAmount,
    discountedPercentage,

    setMaxUsersPerOrder,
    maxUsersPerOrder,

    // Eligibility
    eligibility,
    applyOnPOSPro,

    // Limits
    limitTotalUses,
    totalUsesLimit,
    limitOneUsePerCustomer,

    // Combinations
    productDiscounts,
    orderDiscounts,
    shippingDiscounts,

    // Dates
    startDate,
    startTime,
    setEndDate,
    endDate,
    endTime,

    status = 'active',

    // Targets
    buysProductIds = [],
    buysCollectionIds = [],
    getsProductIds = [],
    getsCollectionIds = [],
    targetCustomerSegmentIds = [],
    targetCustomerIds = [],
  } = req.body as Record<string, any>;

  if (!storeId || !mongoose.isValidObjectId(storeId)) {
    throw new CustomError('Valid storeId is required', 400);
  }

  // Create main discount
  const discount = await BuyXGetYDiscount.create({
    storeId,
    method,
    ...(method === 'discount-code' && { discountCode }),
    ...(method === 'automatic' && { title }),
    allowDiscountOnChannels,
    customerBuys,
    ...(customerBuys === 'minimum-quantity' && { quantity }),
    ...(customerBuys === 'minimum-amount' && { amount }),
    anyItemsFrom,
    customerGetsQuantity,
    customerGetsAnyItemsFrom,
    discountedValue,
    ...(discountedValue === 'amount' && { discountedAmount }),
    ...(discountedValue === 'percentage' && { discountedPercentage }),
    setMaxUsersPerOrder,
    maxUsersPerOrder,
    eligibility,
    applyOnPOSPro,
    limitTotalUses,
    totalUsesLimit,
    limitOneUsePerCustomer,
    productDiscounts,
    orderDiscounts,
    shippingDiscounts,
    startDate,
    startTime,
    setEndDate,
    endDate,
    endTime,
    status,
  });

  // Create buys entries
  if (Array.isArray(buysProductIds) && buysProductIds.length > 0) {
    await BuyXGetYBuysEntry.insertMany(buysProductIds.map((pid: string) => ({ storeId, discountId: discount._id, productId: pid, collectionId: null })));
  }
  if (Array.isArray(buysCollectionIds) && buysCollectionIds.length > 0) {
    await BuyXGetYBuysEntry.insertMany(buysCollectionIds.map((cid: string) => ({ storeId, discountId: discount._id, productId: null, collectionId: cid })));
  }

  // Create gets entries
  if (Array.isArray(getsProductIds) && getsProductIds.length > 0) {
    await BuyXGetYGetsEntry.insertMany(getsProductIds.map((pid: string) => ({ storeId, discountId: discount._id, productId: pid, collectionId: null })));
  }
  if (Array.isArray(getsCollectionIds) && getsCollectionIds.length > 0) {
    await BuyXGetYGetsEntry.insertMany(getsCollectionIds.map((cid: string) => ({ storeId, discountId: discount._id, productId: null, collectionId: cid })));
  }

  // Create eligibility entries
  if (Array.isArray(targetCustomerSegmentIds) && targetCustomerSegmentIds.length > 0) {
    await BuyXGetYEligibilityEntry.insertMany(targetCustomerSegmentIds.map((sid: string) => ({ storeId, discountId: discount._id, customerSegmentId: sid, customerId: null })));
  }
  if (Array.isArray(targetCustomerIds) && targetCustomerIds.length > 0) {
    await BuyXGetYEligibilityEntry.insertMany(targetCustomerIds.map((cid: string) => ({ storeId, discountId: discount._id, customerSegmentId: null, customerId: cid })));
  }

  res.status(201).json({ success: true, message: 'Buy X Get Y discount created successfully', data: discount });
});

export const getBuyXGetYDiscountsByStore = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id: storeId } = req.params as { id: string };
  const { page = 1, limit = 10, status, method } = req.query as Record<string, any>;

  if (!storeId || !mongoose.isValidObjectId(storeId)) {
    throw new CustomError('Valid storeId is required', 400);
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter: any = { storeId };
  if (status) filter.status = status;
  if (method) filter.method = method;

  const [discounts, total] = await Promise.all([
    BuyXGetYDiscount.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    BuyXGetYDiscount.countDocuments(filter),
  ]);

  const discountIds = discounts.map(d => d._id);

  const [buysEntries, getsEntries, eligEntries] = await Promise.all([
    BuyXGetYBuysEntry.find({ storeId, discountId: { $in: discountIds } })
      .populate('productId', 'title sku imageUrls')
      .populate('collectionId', 'title description')
      .lean(),
    BuyXGetYGetsEntry.find({ storeId, discountId: { $in: discountIds } })
      .populate('productId', 'title sku imageUrls')
      .populate('collectionId', 'title description')
      .lean(),
    BuyXGetYEligibilityEntry.find({ storeId, discountId: { $in: discountIds } })
      .populate('customerSegmentId', 'name')
      .populate('customerId', 'firstName lastName email')
      .lean(),
  ]);

  const byDiscount = (arr: any[]) => arr.reduce((m, e) => { (m[e.discountId as any] ||= []).push(e); return m; }, {} as Record<string, any[]>);
  const buysBy = byDiscount(buysEntries);
  const getsBy = byDiscount(getsEntries);
  const eligBy = byDiscount(eligEntries);

  const data = discounts.map(d => {
    const bid = String(d._id);
    const buys = buysBy[bid] || [];
    const gets = getsBy[bid] || [];
    const elig = eligBy[bid] || [];

    const buysProductIds = buys.filter((e: any) => e.productId).map((e: any) => e.productId); // populated product objects
    const buysCollectionIds = buys.filter((e: any) => e.collectionId).map((e: any) => e.collectionId); // populated collection objects
    const getsProductIds = gets.filter((e: any) => e.productId).map((e: any) => e.productId);
    const getsCollectionIds = gets.filter((e: any) => e.collectionId).map((e: any) => e.collectionId);
    const targetCustomerSegmentIds = elig.filter((e: any) => e.customerSegmentId).map((e: any) => e.customerSegmentId); // populated segment objects
    const targetCustomerIds = elig.filter((e: any) => e.customerId).map((e: any) => e.customerId); // populated customer objects

    return {
      ...d,
      buysProductIds,
      buysCollectionIds,
      getsProductIds,
      getsCollectionIds,
      targetCustomerSegmentIds,
      targetCustomerIds,
    };
  });

  res.status(200).json({
    success: true,
    data,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
      itemsPerPage: limitNum,
    },
  });
});
