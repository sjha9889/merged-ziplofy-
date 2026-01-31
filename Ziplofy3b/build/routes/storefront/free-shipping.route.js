"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storefrontFreeShippingRouter = void 0;
const express_1 = require("express");
const free_shipping_controller_1 = require("../../controllers/storefront/free-shipping.controller");
exports.storefrontFreeShippingRouter = (0, express_1.Router)();
// Check eligible free shipping discounts for customer cart (storefront)
exports.storefrontFreeShippingRouter.post('/check', free_shipping_controller_1.checkEligibleFreeShippingDiscounts);
// Validate free shipping discount code (storefront)
exports.storefrontFreeShippingRouter.post('/validate-code', free_shipping_controller_1.validateFreeShippingDiscountCode);
