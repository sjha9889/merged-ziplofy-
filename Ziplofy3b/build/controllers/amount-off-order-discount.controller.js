"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAmountOffOrderDiscountsByStore = exports.createAmountOffOrderDiscount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const amount_off_order_discount_model_1 = require("../models/discount/amount-off-order-discount-model/amount-off-order-discount.model");
const amount_off_order_eligibility_entry_model_1 = require("../models/discount/amount-off-order-discount-model/amount-off-order-eligibility-entry.model");
const error_utils_1 = require("../utils/error.utils");
exports.createAmountOffOrderDiscount = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId, method, discountCode, title, valueType, percentage, fixedAmount, eligibility, applyOnPOSPro, minimumPurchase, minimumAmount, minimumQuantity, productDiscounts, orderDiscounts, shippingDiscounts, allowDiscountOnChannels, limitTotalUses, totalUsesLimit, limitOneUsePerCustomer, startDate, startTime, setEndDate, endDate, endTime, status = 'active', 
    // eligibility targets
    targetCustomerSegmentIds = [], targetCustomerIds = [], } = req.body;
    if (!storeId || !mongoose_1.default.isValidObjectId(storeId)) {
        throw new error_utils_1.CustomError('Valid storeId is required', 400);
    }
    const discount = await amount_off_order_discount_model_1.AmountOffOrderDiscount.create({
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
        await amount_off_order_eligibility_entry_model_1.AmountOffOrderEligibilityEntry.insertMany(targetCustomerSegmentIds.map((sid) => ({ storeId, discountId: discount._id, customerSegmentId: sid, customerId: null })));
    }
    if (Array.isArray(targetCustomerIds) && targetCustomerIds.length > 0) {
        await amount_off_order_eligibility_entry_model_1.AmountOffOrderEligibilityEntry.insertMany(targetCustomerIds.map((cid) => ({ storeId, discountId: discount._id, customerSegmentId: null, customerId: cid })));
    }
    res.status(201).json({ success: true, message: 'Amount off order discount created successfully', data: discount });
});
exports.getAmountOffOrderDiscountsByStore = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { id: storeId } = req.params;
    const { page = 1, limit = 10, status, method } = req.query;
    if (!storeId || !mongoose_1.default.isValidObjectId(storeId)) {
        throw new error_utils_1.CustomError('Valid storeId is required', 400);
    }
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;
    const filter = { storeId };
    if (status)
        filter.status = status;
    if (method)
        filter.method = method;
    const [discounts, total] = await Promise.all([
        amount_off_order_discount_model_1.AmountOffOrderDiscount.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
        amount_off_order_discount_model_1.AmountOffOrderDiscount.countDocuments(filter),
    ]);
    const discountIds = discounts.map(d => d._id);
    const eligEntries = await amount_off_order_eligibility_entry_model_1.AmountOffOrderEligibilityEntry.find({ storeId, discountId: { $in: discountIds } })
        .populate('customerSegmentId', 'name')
        .populate('customerId', 'firstName lastName email')
        .lean();
    const eligBy = eligEntries.reduce((m, e) => { var _a; (m[_a = String(e.discountId)] || (m[_a] = [])).push(e); return m; }, {});
    const data = discounts.map(d => {
        const list = eligBy[String(d._id)] || [];
        const targetCustomerSegmentIds = list.filter((e) => e.customerSegmentId).map((e) => e.customerSegmentId);
        const targetCustomerIds = list.filter((e) => e.customerId).map((e) => e.customerId);
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
