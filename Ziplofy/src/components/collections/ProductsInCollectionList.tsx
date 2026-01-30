import React from 'react';
import type { CollectionEntry } from '../../contexts/collection-entries.context';
import ProductsInCollectionItem from './ProductsInCollectionItem';

interface ProductsInCollectionListProps {
  collectionEntries: CollectionEntry[];
  onProductClick: (productId: string) => void;
  onRemoveProduct: (e: React.MouseEvent, entryId: string) => void;
}

const ProductsInCollectionList: React.FC<ProductsInCollectionListProps> = ({
  collectionEntries,
  onProductClick,
  onRemoveProduct,
}) => {
  return (
    <div className="space-y-3">
      {collectionEntries.map((entry) => (
        <ProductsInCollectionItem
          key={entry?._id || Math.random()}
          entry={entry}
          onProductClick={onProductClick}
          onRemoveProduct={onRemoveProduct}
        />
      ))}
    </div>
  );
};

export default ProductsInCollectionList;

