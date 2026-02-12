import React from 'react';
import { ProductVariant } from '../contexts/product-variant.context';
import ProductVariantCard from './ProductVariantCard';

interface ProductVariantsListProps {
  variants: ProductVariant[];
  productId: string;
  loading: boolean;
}

function ProductVariantsList({
  variants,
  productId,
  loading,
}: ProductVariantsListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h2 className="text-sm font-semibold text-gray-900">Product Variants ({variants.length})</h2>
      </div>
      <div className="p-4">
      
      {loading && (
        <p className="text-sm text-gray-600">Loading variants...</p>
      )}
      
      {!loading && variants.length === 0 && (
        <p className="text-sm text-gray-600">No variants available.</p>
      )}
      
      {!loading && variants.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants.map((variant) => (
            <ProductVariantCard
              key={variant._id}
              variant={variant}
              productId={productId}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default ProductVariantsList;

