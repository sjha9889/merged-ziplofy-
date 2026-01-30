import { Router } from 'express';
import { checkEligibleFreeShippingDiscounts, validateFreeShippingDiscountCode } from '../../controllers/storefront/free-shipping.controller';

export const storefrontFreeShippingRouter = Router();

// Check eligible free shipping discounts for customer cart (storefront)
storefrontFreeShippingRouter.post('/check', checkEligibleFreeShippingDiscounts);

// Validate free shipping discount code (storefront)
storefrontFreeShippingRouter.post('/validate-code', validateFreeShippingDiscountCode);
