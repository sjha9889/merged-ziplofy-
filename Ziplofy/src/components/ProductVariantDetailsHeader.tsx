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
      <div className="flex items-center mb-2">
        <button
          onClick={handleBack}
          className="p-1.5 hover:bg-gray-50 rounded transition-colors mr-2"
        >
          <ArrowLeftIcon className="w-4 h-4 text-gray-700" />
        </button>
        <h1 className="text-xl font-medium text-gray-900">
          {product.title} - {variant.sku}
        </h1>
      </div>
      <p className="text-sm text-gray-600">
        Variant Details
      </p>
    </div>
  );
};

export default ProductVariantDetailsHeader;

