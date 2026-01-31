"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storefrontAmountOffOrderRouter = void 0;
const express_1 = require("express");
const amount_off_order_controller_1 = require("../../controllers/storefront/amount-off-order.controller");
exports.storefrontAmountOffOrderRouter = (0, express_1.Router)();
// Check eligible discounts for customer cart (storefront)
exports.storefrontAmountOffOrderRouter.post('/check', amount_off_order_controller_1.checkEligibleAmountOffOrderDiscounts);
// Validate discount code for amount off order discounts (storefront)
exports.storefrontAmountOffOrderRouter.post('/validate-code', amount_off_order_controller_1.validateAmountOffOrderDiscountCode);
