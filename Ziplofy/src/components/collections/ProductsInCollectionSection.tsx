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
    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Products in collection ({collectionEntries.length})
      </h2>

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

