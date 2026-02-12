import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../contexts/product.context';
import { ProductVariant } from '../contexts/product-variant.context';

interface ProductVariantDetailsHeaderProps {
  product: Product;
  variant: ProductVariant;
  productId: string;
}

const ProductVariantDetailsHeader: React.FC<ProductVariantDetailsHeaderProps> = ({
  product,
  variant,
  productId,
}) => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(`/products/${productId}`);
  }, [navigate, productId]);

  return (
    <div className="mb-6">
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-2 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to product
      </button>
      <h1 className="text-2xl font-semibold text-gray-900">
        {product.title}
      </h1>
      <p className="text-sm text-gray-600 mt-1">
        Variant: {variant.sku}
      </p>
    </div>
  );
};

export default ProductVariantDetailsHeader;

