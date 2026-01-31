"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyXGetYDiscountRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const buy_x_get_y_discount_controller_1 = require("../controllers/buy-x-get-y-discount.controller");
exports.buyXGetYDiscountRouter = (0, express_1.Router)();
exports.buyXGetYDiscountRouter.use(auth_middleware_1.protect);
// Create
exports.buyXGetYDiscountRouter.post('/', buy_x_get_y_discount_controller_1.createBuyXGetYDiscount);
// List by store
exports.buyXGetYDiscountRouter.get('/store/:id', buy_x_get_y_discount_controller_1.getBuyXGetYDiscountsByStore);
