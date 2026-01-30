import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductVariant } from '../contexts/product-variant.context';

interface ProductVariantCardProps {
  variant: ProductVariant;
  productId: string;
}

const ProductVariantCard: React.FC<ProductVariantCardProps> = ({ variant, productId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${productId}/variants/${variant._id}`);
  };

  return (
    <div
      className="p-6 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-blue-500"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-base font-medium">
          {variant.sku || 'N/A'}
        </p>
        <p className="text-base font-medium">
          ${variant.price?.toFixed(2) || '0.00'}
        </p>
      </div>
      
      <div className="flex gap-2 flex-wrap mb-4">
        {variant.optionValues && Object.entries(variant.optionValues).map(([key, value]) => (
          <span
            key={`${key}-${value}`}
            className="px-2 py-1 text-xs font-semibold rounded border border-gray-300 text-gray-700"
          >
            {key}: {value}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Inventory Tracking
          </p>
          <p className="text-base">
            {variant.isInventoryTrackingEnabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Weight
          </p>
          <p className="text-base">
            {variant.weightValue || 0} {variant.weightUnit || 'kg'}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Continue selling: {variant.outOfStockContinueSelling ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  );
};

export default ProductVariantCard;

