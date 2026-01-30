import React from "react";
import ProductImageItem from "./ProductImageItem";

interface ProductImageListProps {
  images: string[];
  onUpdateImage: (index: number, url: string) => void;
  onRemoveImage: (index: number) => void;
}

const ProductImageList: React.FC<ProductImageListProps> = ({
  images,
  onUpdateImage,
  onRemoveImage,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {images.map((imageUrl, index) => (
        <ProductImageItem
          key={index}
          imageUrl={imageUrl}
          index={index}
          onUpdateImage={onUpdateImage}
          onRemoveImage={onRemoveImage}
        />
      ))}
    </div>
  );
};

export default ProductImageList;

