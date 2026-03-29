/**
 * Modal for BXGY "gets from specific collections": user picks which free items
 * they want from the collection, up to customerGetsQuantity.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import type { BuyXGetYDiscount, BuyXGetYGetsItem } from '../contexts/buy-x-get-y.context';
import type { StorefrontProductItem } from '../contexts/product.context';
import { formatINR } from '../utils/currency';

interface BxgyChooseItemsModalProps {
  open: boolean;
  onClose: () => void;
  discount: BuyXGetYDiscount;
  onConfirm: (items: BuyXGetYGetsItem[]) => void;
}

export const BxgyChooseItemsModal: React.FC<BxgyChooseItemsModalProps> = ({
  open,
  onClose,
  discount,
  onConfirm,
}) => {
  const { products, loading, fetchProductsInCollection } = useStorefrontCollections();
  const { fetchVariantsByProductId } = useStorefrontProductVariants();

  const collectionIds = discount.getsCollectionIds ?? [];
  const collectionNames = discount.getsCollectionNames ?? [];
  const maxItems = discount.customerGetsQuantity ?? 1;
  const isFree = discount.discountedValue === 'free';

  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState(0);
  const [selected, setSelected] = useState<BuyXGetYGetsItem[]>([]);
  const [variantLoadingProductId, setVariantLoadingProductId] = useState<string | null>(null);

  const currentCollectionId = collectionIds[selectedCollectionIndex];
  const currentCollectionName = collectionNames[selectedCollectionIndex] ?? 'Collection';

  useEffect(() => {
    if (!open || !currentCollectionId) return;
    fetchProductsInCollection(currentCollectionId, { limit: 100 }).catch(() => {});
  }, [open, currentCollectionId, fetchProductsInCollection]);

  const totalSelected = selected.reduce((sum, s) => sum + s.quantity, 0);
  const canAddMore = totalSelected < maxItems;

  const addProduct = useCallback(
    async (product: StorefrontProductItem) => {
      if (!canAddMore) return;
      setVariantLoadingProductId(product._id);
      try {
        const variants = await fetchVariantsByProductId(product._id);
        const variant = variants.find((v) => !v.depricated) ?? variants[0];
        if (!variant) {
          setVariantLoadingProductId(null);
          return;
        }
        const originalPrice = variant.price ?? product.price ?? 0;
        let discountPerItem = 0;
        if (discount.discountedValue === 'free') {
          discountPerItem = originalPrice;
        } else if (discount.discountedValue === 'amount' && discount.discountedAmount != null) {
          discountPerItem = Math.min(discount.discountedAmount, originalPrice);
        } else if (discount.discountedValue === 'percentage' && discount.discountedPercentage != null) {
          discountPerItem = (originalPrice * Math.min(100, discount.discountedPercentage)) / 100;
        }
        const discountedPrice = Math.max(0, originalPrice - discountPerItem);
        const quantityToAdd = Math.min(1, maxItems - totalSelected);
        const newItem: BuyXGetYGetsItem = {
          productId: product._id,
          productVariantId: variant._id,
          productTitle: product.title ?? 'Product',
          productImage: product.imageUrls?.[0] ?? null,
          originalPrice,
          discountedPrice,
          discountPerItem,
          quantity: quantityToAdd,
          discountType: discount.discountedValue,
          discountTypeLabel: isFree ? 'FREE' : discount.discountedValue === 'percentage' ? `${discount.discountedPercentage}% OFF` : 'OFF',
          discountValue: discount.discountedValue === 'percentage' ? discount.discountedPercentage ?? null : null,
          savings: discountPerItem * quantityToAdd,
        };
        setSelected((prev) => {
          const existing = prev.find((s) => s.productVariantId === newItem.productVariantId);
          if (existing) {
            const newQty = Math.min(existing.quantity + quantityToAdd, maxItems - totalSelected + existing.quantity);
            if (newQty <= 0) return prev;
            return prev.map((s) =>
              s.productVariantId === newItem.productVariantId
                ? { ...s, quantity: newQty, savings: s.discountPerItem * newQty }
                : s
            );
          }
          return [...prev, newItem];
        });
      } finally {
        setVariantLoadingProductId(null);
      }
    },
    [canAddMore, maxItems, totalSelected, discount, isFree, fetchVariantsByProductId]
  );

  const updateQuantity = useCallback(
    (productVariantId: string, delta: number) => {
      setSelected((prev) => {
        const item = prev.find((s) => s.productVariantId === productVariantId);
        if (!item) return prev;
        const newQty = Math.max(0, Math.min(maxItems - totalSelected + item.quantity, item.quantity + delta));
        if (newQty === 0) return prev.filter((s) => s.productVariantId !== productVariantId);
        return prev.map((s) =>
          s.productVariantId === productVariantId
            ? { ...s, quantity: newQty, savings: s.discountPerItem * newQty }
            : s
        );
      });
    },
    [maxItems, totalSelected]
  );

  const handleConfirm = useCallback(() => {
    onConfirm(selected);
    setSelected([]);
    onClose();
  }, [selected, onConfirm, onClose]);

  const handleClose = useCallback(() => {
    setSelected([]);
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden />
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl bg-[#fefcf8] shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Choose up to {maxItems} item{maxItems !== 1 ? 's' : ''} from {currentCollectionName}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {collectionIds.length > 1 && (
          <div className="px-4 py-2 border-b border-gray-100">
            <label className="text-xs font-medium text-gray-500 block mb-1">Collection</label>
            <select
              value={selectedCollectionIndex}
              onChange={(e) => setSelectedCollectionIndex(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
            >
              {collectionNames.map((name, i) => (
                <option key={collectionIds[i]} value={i}>
                  {name || `Collection ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <p className="text-sm text-gray-500 py-4">Loading products…</p>
          )}
          {!loading && products.length === 0 && (
            <p className="text-sm text-gray-500 py-4">No products in this collection.</p>
          )}
          {!loading && products.length > 0 && (
            <ul className="space-y-2">
              {products.map((product) => (
                <li
                  key={product._id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white"
                >
                  <img
                    src={product.imageUrls?.[0] ?? 'https://via.placeholder.com/48'}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs text-gray-500">{formatINR(product.price ?? 0)}</p>
                  </div>
                  <button
                    type="button"
                    disabled={!canAddMore || variantLoadingProductId === product._id}
                    onClick={() => addProduct(product)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {variantLoadingProductId === product._id ? '…' : <FiPlus className="w-4 h-4" />}
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-amber-50/50">
            <p className="text-xs font-medium text-gray-600 mb-2">Selected ({totalSelected} / {maxItems})</p>
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {selected.map((item) => (
                <li key={item.productVariantId} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 truncate text-gray-900">{item.productTitle}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productVariantId, -1)}
                      className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      <FiMinus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      disabled={totalSelected >= maxItems}
                      onClick={() => updateQuantity(item.productVariantId, 1)}
                      className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiPlus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-amber-600 text-xs">{isFree ? 'FREE' : formatINR(item.savings)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selected.length === 0}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
