import { Router } from 'express';
import { AmountOffProductsDiscountController } from '../controllers/amount-off-products-discount.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', AmountOffProductsDiscountController.createDiscount);
router.get('/store/:id', AmountOffProductsDiscountController.getDiscountsByStore);


export default router;
