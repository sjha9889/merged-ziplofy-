import React from 'react';
import type { CollectionEntry } from '../../contexts/collection-entries.context';
import ProductsInCollectionList from './ProductsInCollectionList';

interface ProductsInCollectionSectionProps {
  collectionEntries: CollectionEntry[];
  loading?: boolean;
  onProductClick: (productId: string) => void;
  onRemoveProduct: (e: React.MouseEvent, entryId: string) => void;
}

const ProductsInCollectionSection: React.FC<ProductsInCollectionSectionProps> = ({
  collectionEntries,
  loading = false,
  onProductClick,
  onRemoveProduct,
}) => {
  return (
    <div className="bg-white rounded border border-gray-200 p-4">
      <h2 className="text-base font-medium text-gray-900 mb-3">
        Products in this collection ({collectionEntries.length})
      </h2>
      <div className="border-t border-gray-200 mb-3"></div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading products...</p>
      ) : collectionEntries.length > 0 ? (
        <ProductsInCollectionList
          collectionEntries={collectionEntries}
          onProductClick={onProductClick}
          onRemoveProduct={onRemoveProduct}
        />
      ) : (
        <p className="text-sm text-gray-600">
          No products in this collection yet. Use the search above to add products.
        </p>
      )}
    </div>
  );
};

export default ProductsInCollectionSection;

