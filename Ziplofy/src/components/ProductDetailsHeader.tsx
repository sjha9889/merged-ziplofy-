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
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Products</span>
      </button>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="pl-3 border-l-4 border-blue-500/60">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {product.title || 'Untitled'}
          </h1>
          {product.description && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddVariants}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add Variants
          </button>
          <button
            onClick={onDeleteVariant}
            disabled={!product?.variants || product.variants.length === 0}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Variant
          </button>
          <button
            onClick={onAddOption}
            disabled={!product?.variants || product.variants.length === 0 || variantsCount <= 1}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Option
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
          product.status === 'active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {product.status || 'draft'}
        </span>
        {product.onlineStorePublishing && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 text-gray-700">
            Online
          </span>
        )}
        {product.pointOfSalePublishing && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 text-gray-700">
            POS
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsHeader;

