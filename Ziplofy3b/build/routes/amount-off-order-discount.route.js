"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountOffOrderDiscountRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const amount_off_order_discount_controller_1 = require("../controllers/amount-off-order-discount.controller");
exports.amountOffOrderDiscountRouter = (0, express_1.Router)();
exports.amountOffOrderDiscountRouter.use(auth_middleware_1.protect);
// Create
exports.amountOffOrderDiscountRouter.post('/', amount_off_order_discount_controller_1.createAmountOffOrderDiscount);
// List by store
exports.amountOffOrderDiscountRouter.get('/store/:id', amount_off_order_discount_controller_1.getAmountOffOrderDiscountsByStore);
