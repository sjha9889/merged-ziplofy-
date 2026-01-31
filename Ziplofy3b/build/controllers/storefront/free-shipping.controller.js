"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFreeShippingDiscountCode = exports.checkEligibleFreeShippingDiscounts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../models");
const free_shipping_discount_model_1 = require("../../models/discount/free-shipping-discount-model/free-shipping-discount.model");
const free_shipping_eligibility_entry_model_1 = require("../../models/discount/free-shipping-discount-model/free-shipping-eligibility-entry.model");
const free_shipping_discount_usage_model_1 = require("../../models/discount/free-shipping-discount-model/free-shipping-discount-usage.model");
const error_utils_1 = require("../../utils/error.utils");
exports.checkEligibleFreeShippingDiscounts = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId, customerId, cartItems, shippingAddress, currentShippingRate } = req.body;
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
    // Get only automatic free shipping discounts for the store
    const discounts = await free_shipping_discount_model_1.FreeShippingDiscount.find({
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
            const eligibleSegments = await free_shipping_eligibility_entry_model_1.FreeShippingEligibilityEntry.find({
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
            const customerEntry = await free_shipping_eligibility_entry_model_1.FreeShippingEligibilityEntry.findOne({
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
        // 2. COUNTRY ELIGIBILITY CHECK
        if (discount.countrySelection === 'selected-countries' && discount.selectedCountryCodes && discount.selectedCountryCodes.length > 0) {
            if (!shippingAddress?.country) {
                continue; // No shipping address provided, skip
            }
            const isCountryEligible = discount.selectedCountryCodes.includes(shippingAddress.country);
            if (!isCountryEligible)
                continue;
        }
        // 3. MINIMUM PURCHASE REQUIREMENTS CHECK
        if (discount.minimumPurchase === 'minimum-amount' && discount.minimumAmount) {
            if (cartTotal < discount.minimumAmount)
                continue;
        }
        if (discount.minimumPurchase === 'minimum-quantity' && discount.minimumQuantity) {
            if (totalQuantity < discount.minimumQuantity)
                continue;
        }
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
        // 5. SHIPPING RATE VALIDATION (if excludeShippingRates is enabled)
        if (discount.excludeShippingRates && discount.shippingRateLimit !== undefined && discount.shippingRateLimit !== null) {
            if (currentShippingRate === undefined || currentShippingRate === null) {
                continue; // No shipping rate provided, skip
            }
            // If current shipping rate exceeds the limit, this discount doesn't apply
            if (currentShippingRate > discount.shippingRateLimit) {
                continue;
            }
        }
        // Add to eligible discounts
        eligibleDiscounts.push({
            id: discount._id,
            method: discount.method,
            discountCode: discount.discountCode,
            title: discount.title,
            message: 'You are eligible for free shipping!',
            countrySelection: discount.countrySelection,
            selectedCountryCodes: discount.selectedCountryCodes,
            excludeShippingRates: discount.excludeShippingRates,
            shippingRateLimit: discount.shippingRateLimit,
        });
    }
    res.status(200).json({
        success: true,
        data: {
            eligibleDiscounts,
            cartTotal,
            totalQuantity,
            shippingAddress,
            currentShippingRate,
        },
        message: `Found ${eligibleDiscounts.length} eligible free shipping discount(s)`,
    });
});
exports.validateFreeShippingDiscountCode = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId, customerId, cartItems, discountCode, shippingAddress, currentShippingRate } = req.body;
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
    const discount = await free_shipping_discount_model_1.FreeShippingDiscount.findOne({
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
        const eligibleSegments = await free_shipping_eligibility_entry_model_1.FreeShippingEligibilityEntry.find({
            storeId,
            discountId: discount._id,
            customerSegmentId: { $exists: true, $ne: null },
        }).select('customerSegmentId');
        if (eligibleSegments.length > 0) {
            const customerSegmentEntries = await models_1.CustomerSegmentEntry.find({
                customerId: customerId
            }).select('segmentId');
            const customerSegmentIds = customerSegmentEntries.map(entry => entry.segmentId.toString());
            const eligibleSegmentIds = eligibleSegments
                .filter(entry => entry.customerSegmentId)
                .map(entry => entry.customerSegmentId.toString());
            const hasMatchingSegment = customerSegmentIds.some(customerSegmentId => eligibleSegmentIds.includes(customerSegmentId));
            if (hasMatchingSegment) {
                isEligible = true;
            }
        }
    }
    else if (discount.eligibility === 'specific-customers') {
        const customerEntry = await free_shipping_eligibility_entry_model_1.FreeShippingEligibilityEntry.findOne({
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
    // 2. COUNTRY ELIGIBILITY CHECK
    if (discount.countrySelection === 'selected-countries' && discount.selectedCountryCodes && discount.selectedCountryCodes.length > 0) {
        if (!shippingAddress?.country) {
            return res.status(400).json({
                success: false,
                message: 'Shipping address is required for this discount',
            });
        }
        const isCountryEligible = discount.selectedCountryCodes.includes(shippingAddress.country);
        if (!isCountryEligible) {
            return res.status(400).json({
                success: false,
                message: 'This discount is not available in your country',
            });
        }
    }
    // 3. MINIMUM PURCHASE REQUIREMENTS CHECK
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
    // 5. SHIPPING RATE VALIDATION (if excludeShippingRates is enabled)
    if (discount.excludeShippingRates && discount.shippingRateLimit !== undefined && discount.shippingRateLimit !== null) {
        if (currentShippingRate === undefined || currentShippingRate === null) {
            return res.status(400).json({
                success: false,
                message: 'Shipping rate is required for this discount',
            });
        }
        // If current shipping rate exceeds the limit, this discount doesn't apply
        if (currentShippingRate > discount.shippingRateLimit) {
            return res.status(400).json({
                success: false,
                message: `This discount is not available for shipping rates over ₹${discount.shippingRateLimit}`,
            });
        }
    }
    // 6. USAGE LIMITS CHECK
    if (discount.limitTotalUses && discount.totalUsesLimit) {
        const totalUses = await free_shipping_discount_usage_model_1.FreeShippingDiscountUsage.countDocuments({
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
        const alreadyUsed = await free_shipping_discount_usage_model_1.FreeShippingDiscountUsage.findOne({
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
    // Return valid discount
    res.status(200).json({
        success: true,
        data: {
            discount: {
                id: discount._id,
                method: discount.method,
                discountCode: discount.discountCode,
                title: discount.title,
                message: 'Free shipping discount code applied!',
                countrySelection: discount.countrySelection,
                selectedCountryCodes: discount.selectedCountryCodes,
                excludeShippingRates: discount.excludeShippingRates,
                shippingRateLimit: discount.shippingRateLimit,
            },
            cartTotal,
            totalQuantity,
            shippingAddress,
            currentShippingRate,
        },
        message: 'Free shipping discount code is valid',
    });
});
