import React from 'react';
import { Product } from '../contexts/product.context';

interface ProductShippingInformationProps {
  product: Product;
}

const ProductShippingInformation: React.FC<ProductShippingInformationProps> = ({ product }) => {
  if (!product.isPhysicalProduct) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Shipping Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Package
          </p>
          <p className="text-sm text-gray-900">
            {product.package?.packageName || 'N/A'}
          </p>
          {product.package && (
            <p className="text-xs text-gray-500 mt-1">
              {product.package.length} × {product.package.width} × {product.package.height} {product.package.dimensionsUnit}
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Weight
          </p>
          <p className="text-sm text-gray-900">
            {product.productWeight} {product.productWeightUnit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            Origin
          </p>
          <p className="text-sm text-gray-900">
            {product.countryOfOrigin || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">
            HS Code
          </p>
          <p className="text-sm text-gray-900">
            {product.harmonizedSystemCode || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductShippingInformation;

