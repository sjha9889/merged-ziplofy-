import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';
import { FreeShippingDiscount } from '../models/discount/free-shipping-discount-model/free-shipping-discount.model';
import { FreeShippingEligibilityEntry } from '../models/discount/free-shipping-discount-model/free-shipping-eligibility-entry.model';

export const createFreeShippingDiscount = asyncErrorHandler(async (req: Request, res: Response) => {
  const {
    storeId,

    // Method
    method,
    discountCode,
    title,

    // Country
    countrySelection,
    selectedCountryCodes = [],
    excludeShippingRates,
    shippingRateLimit,

    // Eligibility
    eligibility,
    applyOnPOSPro,

    // Minimum purchase
    minimumPurchase,
    minimumAmount,
    minimumQuantity,

    // Sales channel (discount-code only)
    allowDiscountOnChannels,

    // Limits (discount-code only)
    limitTotalUses,
    totalUsesLimit,
    limitOneUsePerCustomer,

    // Combinations
    productDiscounts,
    orderDiscounts,

    // Active dates
    startDate,
    startTime,
    setEndDate,
    endDate,
    endTime,

    status = 'active',

    // eligibility targets
    targetCustomerSegmentIds = [],
    targetCustomerIds = [],
  } = req.body as Record<string, any>;

  if (!storeId || !mongoose.isValidObjectId(storeId)) {
    throw new CustomError('Valid storeId is required', 400);
  }

  const discount = await FreeShippingDiscount.create({
    storeId,
    method,
    ...(method === 'discount-code' && { discountCode }),
    ...(method === 'automatic' && { title }),

    countrySelection,
    ...(countrySelection === 'selected-countries' && { selectedCountryCodes }),
    excludeShippingRates,
    shippingRateLimit,

    eligibility,
    applyOnPOSPro,

    minimumPurchase,
    minimumAmount,
    minimumQuantity,

    allowDiscountOnChannels,
    limitTotalUses,
    totalUsesLimit,
    limitOneUsePerCustomer,

    productDiscounts,
    orderDiscounts,

    startDate,
    startTime,
    setEndDate,
    endDate,
    endTime,

    status,
  });

  if (Array.isArray(targetCustomerSegmentIds) && targetCustomerSegmentIds.length > 0) {
    await FreeShippingEligibilityEntry.insertMany(
      targetCustomerSegmentIds.map((sid: string) => ({ storeId, discountId: discount._id, customerSegmentId: sid, customerId: null }))
    );
  }
  if (Array.isArray(targetCustomerIds) && targetCustomerIds.length > 0) {
    await FreeShippingEligibilityEntry.insertMany(
      targetCustomerIds.map((cid: string) => ({ storeId, discountId: discount._id, customerSegmentId: null, customerId: cid }))
    );
  }

  res.status(201).json({ success: true, message: 'Free shipping discount created successfully', data: discount });
});

export const getFreeShippingDiscountsByStore = asyncErrorHandler(async (req: Request, res: Response) => {
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
    FreeShippingDiscount.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    FreeShippingDiscount.countDocuments(filter),
  ]);

  const discountIds = discounts.map(d => d._id);

  const eligEntries = await FreeShippingEligibilityEntry.find({ storeId, discountId: { $in: discountIds } })
    .populate('customerSegmentId', 'name')
    .populate('customerId', 'firstName lastName email')
    .lean();

  const eligBy: Record<string, any[]> = eligEntries.reduce((m, e) => { (m[String(e.discountId)] ||= []).push(e); return m; }, {} as Record<string, any[]>);

  const data = discounts.map(d => {
    const list = eligBy[String(d._id)] || [];
    const targetCustomerSegmentIds = list.filter((e: any) => e.customerSegmentId).map((e: any) => e.customerSegmentId);
    const targetCustomerIds = list.filter((e: any) => e.customerId).map((e: any) => e.customerId);
    return {
      ...d,
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
