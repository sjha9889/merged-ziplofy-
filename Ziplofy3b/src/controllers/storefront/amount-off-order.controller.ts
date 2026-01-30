import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CustomerSegmentEntry } from '../../models';
import { AmountOffOrderDiscountUsage } from '../../models/discount/amount-off-order-discount-model/amount-off-order-discount-usage.model';
import { AmountOffOrderDiscount } from '../../models/discount/amount-off-order-discount-model/amount-off-order-discount.model';
import { AmountOffOrderEligibilityEntry } from '../../models/discount/amount-off-order-discount-model/amount-off-order-eligibility-entry.model';
import { asyncErrorHandler, CustomError } from '../../utils/error.utils';

export const checkEligibleAmountOffOrderDiscounts = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId, customerId, cartItems } = req.body as {
    storeId: string;
    customerId: string;
    cartItems: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
  };

  // Validate required fields
  if (!storeId || !mongoose.isValidObjectId(storeId)) {
    throw new CustomError('Valid storeId is required', 400);
  }
  if (!customerId || !mongoose.isValidObjectId(customerId)) {
    throw new CustomError('Valid customerId is required', 400);
  }
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new CustomError('Cart items are required', 400);
  }

  // Calculate cart totals
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Get only automatic discounts for the store
  const discounts = await AmountOffOrderDiscount.find({
    storeId,
    status: 'active',
    method: 'automatic',
  });

  const eligibleDiscounts = [];

  for (const discount of discounts) {
    let isEligible = false;

    // 1. ELIGIBILITY CHECK
    if (discount.eligibility === 'all-customers') {
      isEligible = true;
    } 
    else if (discount.eligibility === 'specific-customer-segments') {
      // First, get all eligible segments for this discount
      const eligibleSegments = await AmountOffOrderEligibilityEntry.find({
        storeId,
        discountId: discount._id,
        customerSegmentId: { $exists: true, $ne: null },
      }).select('customerSegmentId');
      
      if (eligibleSegments.length > 0) {
        // Get customer's segments by finding which segments contain this customer
        const customerSegmentEntries = await CustomerSegmentEntry.find({
          customerId: customerId
        }).select('segmentId');
        
        // Check if customer belongs to any eligible segment
        const customerSegmentIds = customerSegmentEntries.map(entry => entry.segmentId.toString());
        const eligibleSegmentIds = eligibleSegments
          .filter(entry => entry.customerSegmentId)
          .map(entry => entry.customerSegmentId!.toString());
        
        // Check if there's any overlap between customer segments and eligible segments
        const hasMatchingSegment = customerSegmentIds.some(customerSegmentId => 
          eligibleSegmentIds.includes(customerSegmentId)
        );
        
        if (hasMatchingSegment) {
          isEligible = true;
        }
      }
    }
    else if (discount.eligibility === 'specific-customers') {
      // Check if customer is in the specific customers list
      const customerEntry = await AmountOffOrderEligibilityEntry.findOne({
        storeId,
        discountId: discount._id,
        customerId,
      });
      if (customerEntry) {
        isEligible = true;
      }
    }

    if (!isEligible) continue;

    // 2. MINIMUM PURCHASE REQUIREMENTS CHECK
    if (discount.minimumPurchase === 'minimum-amount' && discount.minimumAmount) {
      if (cartTotal < discount.minimumAmount) continue;
    }

    if (discount.minimumPurchase === 'minimum-quantity' && discount.minimumQuantity) {
      if (totalQuantity < discount.minimumQuantity) continue;
    }

    // Note: Usage limits are not applicable for automatic discounts
    // They are only relevant for discount code discounts where customers manually enter codes

    // 4. DATE VALIDATION (if dates are set)
    const now = new Date();
    if (discount.startDate) {
      const startDateTime = new Date(`${discount.startDate}T${discount.startTime || '00:00'}`);
      if (now < startDateTime) continue;
    }
    if (discount.setEndDate && discount.endDate) {
      const endDateTime = new Date(`${discount.endDate}T${discount.endTime || '23:59'}`);
      if (now > endDateTime) continue;
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.valueType === 'percentage' && discount.percentage) {
      discountAmount = (cartTotal * discount.percentage) / 100;
    } else if (discount.valueType === 'fixed-amount' && discount.fixedAmount) {
      discountAmount = Math.min(discount.fixedAmount, cartTotal); // Don't exceed cart total
    }

    // Add to eligible discounts
    eligibleDiscounts.push({
      id: discount._id,
      method: discount.method,
      discountCode: discount.discountCode,
      title: discount.title,
      valueType: discount.valueType,
      percentage: discount.percentage,
      fixedAmount: discount.fixedAmount,
      discountAmount,
      message: discount.valueType === 'percentage' 
        ? `You are eligible for ${discount.percentage}% off!`
        : `You are eligible for ₹${discount.fixedAmount} off!`,
    });
  }

  // Sort by discount amount (highest first)
  eligibleDiscounts.sort((a, b) => b.discountAmount - a.discountAmount);

  res.status(200).json({
    success: true,
    data: {
      eligibleDiscounts,
      cartTotal,
      totalQuantity,
    },
    message: `Found ${eligibleDiscounts.length} eligible discount(s)`,
  });
});

export const validateAmountOffOrderDiscountCode = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId, customerId, cartItems, discountCode } = req.body as {
    storeId: string;
    customerId: string;
    cartItems: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    discountCode: string;
  };

  // Validate required fields
  if (!storeId || !mongoose.isValidObjectId(storeId)) {
    throw new CustomError('Valid storeId is required', 400);
  }
  if (!customerId || !mongoose.isValidObjectId(customerId)) {
    throw new CustomError('Valid customerId is required', 400);
  }
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new CustomError('Cart items are required', 400);
  }
  if (!discountCode || !discountCode.trim()) {
    throw new CustomError('Discount code is required', 400);
  }

  // Calculate cart totals
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Find discount by code
  const discount = await AmountOffOrderDiscount.findOne({
    storeId,
    status: 'active',
    method: 'discount-code',
    discountCode: discountCode.trim(),
  });

  if (!discount) {
    return res.status(400).json({
      success: false,
      message: 'Invalid discount code',
    });
  }

  // 1. ELIGIBILITY CHECK
  let isEligible = false;

  if (discount.eligibility === 'all-customers') {
    isEligible = true;
  } 
  else if (discount.eligibility === 'specific-customer-segments') {
    // First, get all eligible segments for this discount
    const eligibleSegments = await AmountOffOrderEligibilityEntry.find({
      storeId,
      discountId: discount._id,
      customerSegmentId: { $exists: true, $ne: null },
    }).select('customerSegmentId');
    
    if (eligibleSegments.length > 0) {
      // Get customer's segments by finding which segments contain this customer
      const customerSegmentEntries = await CustomerSegmentEntry.find({
        customerId: customerId
      }).select('segmentId');
      
      // Check if customer belongs to any eligible segment
      const customerSegmentIds = customerSegmentEntries.map(entry => entry.segmentId.toString());
      const eligibleSegmentIds = eligibleSegments
        .filter(entry => entry.customerSegmentId)
        .map(entry => entry.customerSegmentId!.toString());
      
      // Check if there's any overlap between customer segments and eligible segments
      const hasMatchingSegment = customerSegmentIds.some(customerSegmentId => 
        eligibleSegmentIds.includes(customerSegmentId)
      );
      
      if (hasMatchingSegment) {
        isEligible = true;
      }
    }
  }
  else if (discount.eligibility === 'specific-customers') {
    // Check if customer is in the specific customers list
    const customerEntry = await AmountOffOrderEligibilityEntry.findOne({
      storeId,
      discountId: discount._id,
      customerId,
    });
    if (customerEntry) {
      isEligible = true;
    }
  }

  if (!isEligible) {
    return res.status(400).json({
      success: false,
      message: 'You are not eligible for this discount code',
    });
  }

  // 2. MINIMUM PURCHASE REQUIREMENTS CHECK
  if (discount.minimumPurchase === 'minimum-amount' && discount.minimumAmount) {
    if (cartTotal < discount.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount of ₹${discount.minimumAmount} required`,
      });
    }
  }

  if (discount.minimumPurchase === 'minimum-quantity' && discount.minimumQuantity) {
    if (totalQuantity < discount.minimumQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimum quantity of ${discount.minimumQuantity} items required`,
      });
    }
  }

  // 3. USAGE LIMITS CHECK (relevant for discount codes)
  if (discount.limitTotalUses && discount.totalUsesLimit) {
    const totalUses = await AmountOffOrderDiscountUsage.countDocuments({
      discountId: discount._id,
    });
    if (totalUses >= discount.totalUsesLimit) {
      return res.status(400).json({
        success: false,
        message: 'This discount code has reached its usage limit',
      });
    }
  }

  if (discount.limitOneUsePerCustomer) {
    const alreadyUsed = await AmountOffOrderDiscountUsage.findOne({
      discountId: discount._id,
      customerId,
    });
    if (alreadyUsed) {
      return res.status(400).json({
        success: false,
        message: 'You have already used this discount code',
      });
    }
  }

  // 4. DATE VALIDATION (if dates are set)
  const now = new Date();
  if (discount.startDate) {
    const startDateTime = new Date(`${discount.startDate}T${discount.startTime || '00:00'}`);
    if (now < startDateTime) {
      return res.status(400).json({
        success: false,
        message: 'This discount code is not yet active',
      });
    }
  }
  if (discount.setEndDate && discount.endDate) {
    const endDateTime = new Date(`${discount.endDate}T${discount.endTime || '23:59'}`);
    if (now > endDateTime) {
      return res.status(400).json({
        success: false,
        message: 'This discount code has expired',
      });
    }
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (discount.valueType === 'percentage' && discount.percentage) {
    discountAmount = (cartTotal * discount.percentage) / 100;
  } else if (discount.valueType === 'fixed-amount' && discount.fixedAmount) {
    discountAmount = Math.min(discount.fixedAmount, cartTotal); // Don't exceed cart total
  }

  // Return valid discount
  res.status(200).json({
    success: true,
    data: {
      discount: {
        id: discount._id,
        method: discount.method,
        discountCode: discount.discountCode,
        valueType: discount.valueType,
        percentage: discount.percentage,
        fixedAmount: discount.fixedAmount,
        discountAmount,
        message: discount.valueType === 'percentage' 
          ? `You are eligible for ${discount.percentage}% off!`
          : `You are eligible for ₹${discount.fixedAmount} off!`,
      },
      cartTotal,
      totalQuantity,
    },
    message: 'Discount code is valid',
  });
});
