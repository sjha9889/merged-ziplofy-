import { RectangleStackIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import type { CollectionEntry } from '../../contexts/collection-entries.context';

interface ProductsInCollectionItemProps {
  entry: CollectionEntry;
  onProductClick: (productId: string) => void;
  onRemoveProduct: (e: React.MouseEvent, entryId: string) => void;
}

const ProductsInCollectionItem: React.FC<ProductsInCollectionItemProps> = ({
  entry,
  onProductClick,
  onRemoveProduct,
}) => {
  const handleClick = useCallback(() => {
    if (entry?.productId?._id) {
      onProductClick(entry.productId._id);
    }
  }, [entry?.productId?._id, onProductClick]);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      onRemoveProduct(e, entry?._id);
    },
    [entry?._id, onRemoveProduct]
  );

  return (
    <div
      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
          {entry?.productId?.images?.[0] ? (
            <img
              src={entry.productId.images[0]}
              alt={entry?.productId?.title || 'Product'}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <RectangleStackIcon className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {entry?.productId?.title || 'Untitled Product'}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
            {entry?.productId?.description?.substring(0, 80) || 'No description available'}
            ...
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              ${entry?.productId?.price || 0}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border border-gray-200 text-gray-700">
              {entry?.productId?.sku || 'No SKU'}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border border-gray-200 text-gray-700">
              {entry?.productId?.category?.name || 'No Category'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-3">
        <p className="text-xs text-gray-500 whitespace-nowrap">
          Added{' '}
          {entry?.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Unknown date'}
        </p>
        <button
          onClick={handleRemove}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
        >
          <TrashIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ProductsInCollectionItem;

