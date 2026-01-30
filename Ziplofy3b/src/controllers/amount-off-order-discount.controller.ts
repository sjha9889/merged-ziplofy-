import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AmountOffOrderDiscount } from '../models/discount/amount-off-order-discount-model/amount-off-order-discount.model';
import { AmountOffOrderEligibilityEntry } from '../models/discount/amount-off-order-discount-model/amount-off-order-eligibility-entry.model';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';

export const createAmountOffOrderDiscount = asyncErrorHandler(async (req: Request, res: Response) => {
  const {
    storeId,

    method,
    discountCode,
    title,

    valueType,
    percentage,
    fixedAmount,

    eligibility,
    applyOnPOSPro,

    minimumPurchase,
    minimumAmount,
    minimumQuantity,

    productDiscounts,
    orderDiscounts,
    shippingDiscounts,

    allowDiscountOnChannels,
    limitTotalUses,
    totalUsesLimit,
    limitOneUsePerCustomer,

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

  const discount = await AmountOffOrderDiscount.create({
    storeId,
    method,
    ...(method === 'discount-code' && { discountCode }),
    ...(method === 'automatic' && { title }),
    valueType,
    ...(valueType === 'percentage' && { percentage }),
    ...(valueType === 'fixed-amount' && { fixedAmount }),
    eligibility,
    applyOnPOSPro,
    minimumPurchase,
    minimumAmount,
    minimumQuantity,
    productDiscounts,
    orderDiscounts,
    shippingDiscounts,
    allowDiscountOnChannels,
    limitTotalUses,
    totalUsesLimit,
    limitOneUsePerCustomer,
    startDate,
    startTime,
    setEndDate,
    endDate,
    endTime,
    status,
  });

  if (Array.isArray(targetCustomerSegmentIds) && targetCustomerSegmentIds.length > 0) {
    await AmountOffOrderEligibilityEntry.insertMany(
      targetCustomerSegmentIds.map((sid: string) => ({ storeId, discountId: discount._id, customerSegmentId: sid, customerId: null }))
    );
  }
  if (Array.isArray(targetCustomerIds) && targetCustomerIds.length > 0) {
    await AmountOffOrderEligibilityEntry.insertMany(
      targetCustomerIds.map((cid: string) => ({ storeId, discountId: discount._id, customerSegmentId: null, customerId: cid }))
    );
  }

  res.status(201).json({ success: true, message: 'Amount off order discount created successfully', data: discount });
});

export const getAmountOffOrderDiscountsByStore = asyncErrorHandler(async (req: Request, res: Response) => {
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
    AmountOffOrderDiscount.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    AmountOffOrderDiscount.countDocuments(filter),
  ]);

  const discountIds = discounts.map(d => d._id);

  const eligEntries = await AmountOffOrderEligibilityEntry.find({ storeId, discountId: { $in: discountIds } })
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
