"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAmountOffOrderDiscountCode = exports.checkEligibleAmountOffOrderDiscounts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../models");
const amount_off_order_discount_usage_model_1 = require("../../models/discount/amount-off-order-discount-model/amount-off-order-discount-usage.model");
const amount_off_order_discount_model_1 = require("../../models/discount/amount-off-order-discount-model/amount-off-order-discount.model");
const amount_off_order_eligibility_entry_model_1 = require("../../models/discount/amount-off-order-discount-model/amount-off-order-eligibility-entry.model");
const error_utils_1 = require("../../utils/error.utils");
exports.checkEligibleAmountOffOrderDiscounts = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId, customerId, cartItems } = req.body;
    // Validate required fields
    if (!storeId || !mongoose_1.default.isValidObjectId(storeId)) {
        throw new error_utils_1.CustomError('Valid storeId is required', 400);
    }
    if (!customerId || !mongoose_1.default.isValidObjectId(customerId)) {
        throw new error_utils_1.CustomError('Valid customerId is required', 400);
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new error_utils_1.CustomError('Cart items are required', 400);
    }
    // Calculate cart totals
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    // Get only automatic discounts for the store
    const discounts = await amount_off_order_discount_model_1.AmountOffOrderDiscount.find({
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
            const eligibleSegments = await amount_off_order_eligibility_entry_model_1.AmountOffOrderEligibilityEntry.find({
                storeId,
                discountId: discount._id,
                customerSegmentId: { $exists: true, $ne: null },
            }).select('customerSegmentId');
            if (eligibleSegments.length > 0) {
                // Get customer's segments by finding which segments contain this customer
                const customerSegmentEntries = await models_1.CustomerSegmentEntry.find({
                    customerId: customerId
                }).select('segmentId');
                // Check if customer belongs to any eligible segment
                const customerSegmentIds = customerSegmentEntries.map(entry => entry.segmentId.toString());
                const eligibleSegmentIds = eligibleSegments
                    .filter(entry => entry.customerSegmentId)
                    .map(entry => entry.customerSegmentId.toString());
                // Check if there's any overlap between customer segments and eligible segments
                const hasMatchingSegment = customerSegmentIds.some(customerSegmentId => eligibleSegmentIds.includes(customerSegmentId));
                if (hasMatchingSegment) {
                    isEligible = true;
                }
            }
        }
        else if (discount.eligibility === 'specific-customers') {
            // Check if customer is in the specific customers list
            const customerEntry = await amount_off_order_eligibility_entry_model_1.AmountOffOrderEligibilityEntry.findOne({
                storeId,
                discountId: discount._id,
                customerId,
            });
            if (customerEntry) {
                isEligible = true;
            }
        }
        if (!isEligible)
            continue;
        // 2. MINIMUM PURCHASE REQUIREMENTS CHECK
        if (discount.minimumPurchase === 'minimum-amount' && discount.minimumAmount) {
            if (cartTotal < discount.minimumAmount)
                continue;
        }
        if (discount.minimumPurchase === 'minimum-quantity' && discount.minimumQuantity) {
            if (totalQuantity < discount.minimumQuantity)
                continue;
        }
        // Note: Usage limits are not applicable for automatic discounts
        // They are only relevant for discount code discounts where customers manually enter codes
        // 4. DATE VALIDATION (if dates are set)
        const now = new Date();
        if (discount.startDate) {
            const startDateTime = new Date(`${discount.startDate}T${discount.startTime || '00:00'}`);
            if (now < startDateTime)
                continue;
        }
        if (discount.setEndDate && discount.endDate) {
            const endDateTime = new Date(`${discount.endDate}T${discount.endTime || '23:59'}`);
            if (now > endDateTime)
                continue;
        }
        // Calculate discount amount
        let discountAmount = 0;
        if (discount.valueType === 'percentage' && discount.percentage) {
            discountAmount = (cartTotal * discount.percentage) / 100;
        }
        else if (discount.valueType === 'fixed-amount' && discount.fixedAmount) {
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
exports.validateAmountOffOrderDiscountCode = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId, customerId, cartItems, discountCode } = req.body;
    // Validate required fields
    if (!storeId || !mongoose_1.default.isValidObjectId(storeId)) {
        throw new error_utils_1.CustomError('Valid storeId is required', 400);
    }
    if (!customerId || !mongoose_1.default.isValidObjectId(customerId)) {
        throw new error_utils_1.CustomError('Valid customerId is required', 400);
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new error_utils_1.CustomError('Cart items are required', 400);
    }
    if (!discountCode || !discountCode.trim()) {
        throw new error_utils_1.CustomError('Discount code is required', 400);
    }
    // Calculate cart totals
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    // Find discount by code
    const discount = await amount_off_order_discount_model_1.AmountOffOrderDiscount.findOne({
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
        const eligibleSegments = await amount_off_order_eligibility_entry_model_1.AmountOffOrderEligibilityEntry.find({
            storeId,
            discountId: discount._id,
            customerSegmentId: { $exists: true, $ne: null },
        }).select('customerSegmentId');
        if (eligibleSegments.length > 0) {
            // Get customer's segments by finding which segments contain this customer
            const customerSegmentEntries = await models_1.CustomerSegmentEntry.find({
                customerId: customerId
            }).select('segmentId');
            // Check if customer belongs to any eligible segment
            const customerSegmentIds = customerSegmentEntries.map(entry => entry.segmentId.toString());
            const eligibleSegmentIds = eligibleSegments
                .filter(entry => entry.customerSegmentId)
                .map(entry => entry.customerSegmentId.toString());
            // Check if there's any overlap between customer segments and eligible segments
            const hasMatchingSegment = customerSegmentIds.some(customerSegmentId => eligibleSegmentIds.includes(customerSegmentId));
            if (hasMatchingSegment) {
                isEligible = true;
            }
        }
    }
    else if (discount.eligibility === 'specific-customers') {
        // Check if customer is in the specific customers list
        const customerEntry = await amount_off_order_eligibility_entry_model_1.AmountOffOrderEligibilityEntry.findOne({
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
        const totalUses = await amount_off_order_discount_usage_model_1.AmountOffOrderDiscountUsage.countDocuments({
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
        const alreadyUsed = await amount_off_order_discount_usage_model_1.AmountOffOrderDiscountUsage.findOne({
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
    }
    else if (discount.valueType === 'fixed-amount' && discount.fixedAmount) {
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
