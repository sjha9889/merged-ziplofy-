import { Request, Response } from 'express';
import { AmountOffProductsEntry } from '../models/discount/amount-off-product-discount-model/amount-off-products-entry.model';
import { AmountOffProductsEligibilityEntry } from '../models/discount/amount-off-product-discount-model/amount-off-products-eligibility-entry.model';
import { AmountOffProductsDiscount } from '../models';

export class AmountOffProductsDiscountController {
  /**
   * Create a new amount off products discount
   */
  static async createDiscount(req: Request, res: Response) {
    try {
      const {
        // Store ID
        storeId,
        
        // Method
        method,
        discountCode,
        title,
        
        // Sales channel and usage limits
        allowDiscountOnChannels,
        limitTotalUses,
        totalUsesLimit,
        limitOneUsePerCustomer,
        
        // Discount value
        valueType,
        percentage,
        fixedAmount,
        
        // Applies to
        appliesTo,
        oncePerOrder,
        
        // Eligibility
        eligibility,
        applyOnPOSPro,
        
        // Minimum purchase requirements
        minimumPurchase,
        minimumAmount,
        minimumQuantity,
        
        // Combinations
        productDiscounts,
        orderDiscounts,
        shippingDiscounts,
        
        // Active dates
        startDate,
        startTime,
        setEndDate,
        endDate,
        endTime,
        
        // Status
        status = 'active',
        
        // Target products/collections
        targetProductIds = [],
        targetCollectionIds = [],
        
        // Target customers/customer segments (for eligibility)
        targetCustomerSegmentIds = [],
        targetCustomerIds = []
      } = req.body;

      if (!storeId) {
        return res.status(400).json({ error: 'Store ID is required' });
      }

      // Create the main discount record
      const discountData = {
        storeId,
        method,
        ...(method === 'discount-code' && { discountCode }),
        ...(method === 'automatic' && { title }),
        allowDiscountOnChannels,
        limitTotalUses,
        totalUsesLimit,
        limitOneUsePerCustomer,
        valueType,
        ...(valueType === 'percentage' && { percentage }),
        ...(valueType === 'fixed-amount' && { fixedAmount }),
        appliesTo,
        oncePerOrder,
        eligibility,
        applyOnPOSPro,
        minimumPurchase,
        minimumAmount,
        minimumQuantity,
        productDiscounts,
        orderDiscounts,
        shippingDiscounts,
        startDate,
        startTime,
        setEndDate,
        endDate,
        endTime,
        status
      };

      const discount = new AmountOffProductsDiscount(discountData);
      await discount.save();

      // Create entry records for target products
      if (targetProductIds.length > 0) {
        const productEntries = targetProductIds.map((productId: string) => ({
          storeId,
          discountId: discount._id,
          productId,
          collectionId: null
        }));
        await AmountOffProductsEntry.insertMany(productEntries);
      }

      // Create entry records for target collections
      if (targetCollectionIds.length > 0) {
        const collectionEntries = targetCollectionIds.map((collectionId: string) => ({
          storeId,
          discountId: discount._id,
          productId: null,
          collectionId
        }));
        await AmountOffProductsEntry.insertMany(collectionEntries);
      }

      // Create eligibility entry records for customer segments
      if (targetCustomerSegmentIds.length > 0) {
        const customerSegmentEntries = targetCustomerSegmentIds.map((customerSegmentId: string) => ({
          storeId,
          discountId: discount._id,
          customerSegmentId,
          customerId: null
        }));
        await AmountOffProductsEligibilityEntry.insertMany(customerSegmentEntries);
      }

      // Create eligibility entry records for specific customers
      if (targetCustomerIds.length > 0) {
        const customerEntries = targetCustomerIds.map((customerId: string) => ({
          storeId,
          discountId: discount._id,
          customerSegmentId: null,
          customerId
        }));
        await AmountOffProductsEligibilityEntry.insertMany(customerEntries);
      }

      res.status(201).json({
        success: true,
        message: 'Amount off products discount created successfully',
        data: discount
      });

    } catch (error) {
      console.error('Error creating amount off products discount:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create amount off products discount',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get all amount off products discounts for a store
   */
  static async getDiscountsByStore(req: Request, res: Response) {
    try {
      const { id: storeId } = req.params;
      if (!storeId) {
        return res.status(400).json({ error: 'Store ID is required' });
      }

      const { page = 1, limit = 10, status, method } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Build filter object
      const filter: any = { storeId };
      if (status) filter.status = status;
      if (method) filter.method = method;

      // Get discounts with pagination
      const discounts = await AmountOffProductsDiscount.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

      // Get total count for pagination
      const total = await AmountOffProductsDiscount.countDocuments(filter);

      // Get target products/collections and eligibility for each discount
      const discountsWithTargets = await Promise.all(
        discounts.map(async (discount) => {
          // Get product/collection entries
          const entries = await AmountOffProductsEntry.find({
            storeId,
            discountId: discount._id
          }).populate('productId', 'title price imageUrl').populate('collectionId', 'title description').lean();

          const targetProductIds = entries
            .filter(entry => entry.productId)
            .map(entry => entry.productId);

          const targetCollectionIds = entries
            .filter(entry => entry.collectionId)
            .map(entry => entry.collectionId);

          // Get eligibility entries
          const eligibilityEntries = await AmountOffProductsEligibilityEntry.find({
            storeId,
            discountId: discount._id
          }).populate('customerSegmentId', 'name').populate('customerId', 'firstName lastName email').lean();

          const targetCustomerSegmentIds = eligibilityEntries
            .filter(entry => entry.customerSegmentId)
            .map(entry => entry.customerSegmentId);

          const targetCustomerIds = eligibilityEntries
            .filter(entry => entry.customerId)
            .map(entry => entry.customerId);

          return {
            ...discount,
            targetProductIds,
            targetCollectionIds,
            targetCustomerSegmentIds,
            targetCustomerIds
          };
        })
      );

      res.json({
        success: true,
        data: discountsWithTargets,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      });

    } catch (error) {
      console.error('Error fetching amount off products discounts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch amount off products discounts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

}
