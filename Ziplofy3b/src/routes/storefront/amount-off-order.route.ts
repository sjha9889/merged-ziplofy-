import { Router } from 'express';
import { checkEligibleAmountOffOrderDiscounts, validateAmountOffOrderDiscountCode } from '../../controllers/storefront/amount-off-order.controller';

export const storefrontAmountOffOrderRouter = Router();

// Check eligible discounts for customer cart (storefront)
storefrontAmountOffOrderRouter.post('/check', checkEligibleAmountOffOrderDiscounts);

// Validate discount code for amount off order discounts (storefront)
storefrontAmountOffOrderRouter.post('/validate-code', validateAmountOffOrderDiscountCode);
