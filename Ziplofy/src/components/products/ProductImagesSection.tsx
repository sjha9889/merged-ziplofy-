import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import ProductImageList from "./ProductImageList";

interface ProductImagesSectionProps {
  images: string[];
  onAddImage: () => void;
  onUpdateImage: (index: number, url: string) => void;
  onRemoveImage: (index: number) => void;
}

const ProductImagesSection: React.FC<ProductImagesSectionProps> = ({
  images,
  onAddImage,
  onUpdateImage,
  onRemoveImage,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Product Images
      </h3>
      
      {/* Add Image Button */}
      <button
        type="button"
        onClick={onAddImage}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4"
      >
        <PlusIcon className="w-4 h-4" />
        Add Image
      </button>
      
      {/* Image Input Fields */}
      {images.length > 0 ? (
        <ProductImageList
          images={images}
          onUpdateImage={onUpdateImage}
          onRemoveImage={onRemoveImage}
        />
      ) : (
        <div className="text-center py-8 text-gray-600">
          No images added yet. Click "Add Image" to get started.
        </div>
      )}
    </div>
  );
};

export default ProductImagesSection;

