"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuyXGetYDiscountsByStore = exports.createBuyXGetYDiscount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const buy_x_get_y_discount_model_1 = require("../models/discount/buy-x-get-y-discount-model/buy-x-get-y-discount.model");
const buy_x_get_y_buys_entry_model_1 = require("../models/discount/buy-x-get-y-discount-model/buy-x-get-y-buys-entry.model");
const buy_x_get_y_gets_entry_model_1 = require("../models/discount/buy-x-get-y-discount-model/buy-x-get-y-gets-entry.model");
const buy_x_get_y_eligibility_entry_model_1 = require("../models/discount/buy-x-get-y-discount-model/buy-x-get-y-eligibility-entry.model");
const error_utils_1 = require("../utils/error.utils");
exports.createBuyXGetYDiscount = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { 
    // Store
    storeId, 
    // Method
    method, discountCode, title, 
    // Sales channel
    allowDiscountOnChannels, 
    // Customer buys
    customerBuys, quantity, amount, anyItemsFrom, 
    // Customer gets
    customerGetsQuantity, customerGetsAnyItemsFrom, discountedValue, discountedAmount, discountedPercentage, setMaxUsersPerOrder, maxUsersPerOrder, 
    // Eligibility
    eligibility, applyOnPOSPro, 
    // Limits
    limitTotalUses, totalUsesLimit, limitOneUsePerCustomer, 
    // Combinations
    productDiscounts, orderDiscounts, shippingDiscounts, 
    // Dates
    startDate, startTime, setEndDate, endDate, endTime, status = 'active', 
    // Targets
    buysProductIds = [], buysCollectionIds = [], getsProductIds = [], getsCollectionIds = [], targetCustomerSegmentIds = [], targetCustomerIds = [], } = req.body;
    if (!storeId || !mongoose_1.default.isValidObjectId(storeId)) {
        throw new error_utils_1.CustomError('Valid storeId is required', 400);
    }
    // Create main discount
    const discount = await buy_x_get_y_discount_model_1.BuyXGetYDiscount.create({
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
        await buy_x_get_y_buys_entry_model_1.BuyXGetYBuysEntry.insertMany(buysProductIds.map((pid) => ({ storeId, discountId: discount._id, productId: pid, collectionId: null })));
    }
    if (Array.isArray(buysCollectionIds) && buysCollectionIds.length > 0) {
        await buy_x_get_y_buys_entry_model_1.BuyXGetYBuysEntry.insertMany(buysCollectionIds.map((cid) => ({ storeId, discountId: discount._id, productId: null, collectionId: cid })));
    }
    // Create gets entries
    if (Array.isArray(getsProductIds) && getsProductIds.length > 0) {
        await buy_x_get_y_gets_entry_model_1.BuyXGetYGetsEntry.insertMany(getsProductIds.map((pid) => ({ storeId, discountId: discount._id, productId: pid, collectionId: null })));
    }
    if (Array.isArray(getsCollectionIds) && getsCollectionIds.length > 0) {
        await buy_x_get_y_gets_entry_model_1.BuyXGetYGetsEntry.insertMany(getsCollectionIds.map((cid) => ({ storeId, discountId: discount._id, productId: null, collectionId: cid })));
    }
    // Create eligibility entries
    if (Array.isArray(targetCustomerSegmentIds) && targetCustomerSegmentIds.length > 0) {
        await buy_x_get_y_eligibility_entry_model_1.BuyXGetYEligibilityEntry.insertMany(targetCustomerSegmentIds.map((sid) => ({ storeId, discountId: discount._id, customerSegmentId: sid, customerId: null })));
    }
    if (Array.isArray(targetCustomerIds) && targetCustomerIds.length > 0) {
        await buy_x_get_y_eligibility_entry_model_1.BuyXGetYEligibilityEntry.insertMany(targetCustomerIds.map((cid) => ({ storeId, discountId: discount._id, customerSegmentId: null, customerId: cid })));
    }
    res.status(201).json({ success: true, message: 'Buy X Get Y discount created successfully', data: discount });
});
exports.getBuyXGetYDiscountsByStore = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
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
        buy_x_get_y_discount_model_1.BuyXGetYDiscount.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
        buy_x_get_y_discount_model_1.BuyXGetYDiscount.countDocuments(filter),
    ]);
    const discountIds = discounts.map(d => d._id);
    const [buysEntries, getsEntries, eligEntries] = await Promise.all([
        buy_x_get_y_buys_entry_model_1.BuyXGetYBuysEntry.find({ storeId, discountId: { $in: discountIds } })
            .populate('productId', 'title sku imageUrls')
            .populate('collectionId', 'title description')
            .lean(),
        buy_x_get_y_gets_entry_model_1.BuyXGetYGetsEntry.find({ storeId, discountId: { $in: discountIds } })
            .populate('productId', 'title sku imageUrls')
            .populate('collectionId', 'title description')
            .lean(),
        buy_x_get_y_eligibility_entry_model_1.BuyXGetYEligibilityEntry.find({ storeId, discountId: { $in: discountIds } })
            .populate('customerSegmentId', 'name')
            .populate('customerId', 'firstName lastName email')
            .lean(),
    ]);
    const byDiscount = (arr) => arr.reduce((m, e) => { var _a; (m[_a = e.discountId] || (m[_a] = [])).push(e); return m; }, {});
    const buysBy = byDiscount(buysEntries);
    const getsBy = byDiscount(getsEntries);
    const eligBy = byDiscount(eligEntries);
    const data = discounts.map(d => {
        const bid = String(d._id);
        const buys = buysBy[bid] || [];
        const gets = getsBy[bid] || [];
        const elig = eligBy[bid] || [];
        const buysProductIds = buys.filter((e) => e.productId).map((e) => e.productId); // populated product objects
        const buysCollectionIds = buys.filter((e) => e.collectionId).map((e) => e.collectionId); // populated collection objects
        const getsProductIds = gets.filter((e) => e.productId).map((e) => e.productId);
        const getsCollectionIds = gets.filter((e) => e.collectionId).map((e) => e.collectionId);
        const targetCustomerSegmentIds = elig.filter((e) => e.customerSegmentId).map((e) => e.customerSegmentId); // populated segment objects
        const targetCustomerIds = elig.filter((e) => e.customerId).map((e) => e.customerId); // populated customer objects
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
