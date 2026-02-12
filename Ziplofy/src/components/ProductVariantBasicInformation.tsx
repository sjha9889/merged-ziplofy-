import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { ProductVariant } from '../contexts/product-variant.context';

interface ProductVariantBasicInformationProps {
  variant: ProductVariant;
  formData: {
    sku: string;
    barcode: string;
    outOfStockContinueSelling: boolean;
  };
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: string, value: any) => void;
}

const ProductVariantBasicInformation: React.FC<ProductVariantBasicInformationProps> = ({
  variant,
  formData,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          Basic Information
        </h2>
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={onSave}
              className="p-1 text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="p-1 text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            SKU
          </p>
          {isEditing ? (
            <input
              type="text"
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
              value={formData.sku}
              onChange={(e) => onInputChange('sku', e.target.value)}
            />
          ) : (
            <p className="text-sm font-medium text-gray-900">
              {variant.sku}
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Barcode
          </p>
          {isEditing ? (
            <input
              type="text"
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
              value={formData.barcode}
              onChange={(e) => onInputChange('barcode', e.target.value)}
            />
          ) : (
            <p className="text-sm text-gray-900">
              {variant.barcode || 'N/A'}
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Continue Selling When Out of Stock
          </p>
          {isEditing ? (
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative inline-block w-10 h-5">
                <input
                  type="checkbox"
                  checked={formData.outOfStockContinueSelling}
                  onChange={(e) => onInputChange('outOfStockContinueSelling', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
              </div>
              <span className="text-sm text-gray-900">{formData.outOfStockContinueSelling ? 'Yes' : 'No'}</span>
            </label>
          ) : (
            <p className="text-sm text-gray-900">
              {variant.outOfStockContinueSelling ? 'Yes' : 'No'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductVariantBasicInformation;



