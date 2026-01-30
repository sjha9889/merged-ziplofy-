import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../contexts/product.context';

interface ProductDetailsHeaderProps {
  product: Product;
  variantsCount: number;
  onAddVariants: () => void;
  onDeleteVariant: () => void;
  onAddOption: () => void;
}

const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({
  product,
  variantsCount,
  onAddVariants,
  onDeleteVariant,
  onAddOption,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/products')}
            className="p-1.5 hover:bg-gray-50 rounded transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-xl font-medium text-gray-900">
            {product.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddVariants}
            className="bg-gray-900 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Add Variants
          </button>
          <button
            onClick={onDeleteVariant}
            disabled={!product?.variants || product.variants.length === 0}
            className="border border-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Variant
          </button>
          <button
            onClick={onAddOption}
            disabled={!product?.variants || product.variants.length === 0 || variantsCount <= 1}
            className="border border-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Option
          </button>
        </div>
      </div>
      {product.description && (
        <p className="text-sm text-gray-600 mb-3">
          {product.description}
        </p>
      )}
      
      {/* Simple Status */}
      <div className="flex gap-2 flex-wrap">
        <span className={`px-2.5 py-1 rounded text-xs font-medium ${
          product.status === 'active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {product.status}
        </span>
        {product.onlineStorePublishing && (
          <span className="px-2.5 py-1 rounded text-xs font-medium border border-gray-200 text-gray-700">
            Online
          </span>
        )}
        {product.pointOfSalePublishing && (
          <span className="px-2.5 py-1 rounded text-xs font-medium border border-gray-200 text-gray-700">
            POS
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsHeader;

