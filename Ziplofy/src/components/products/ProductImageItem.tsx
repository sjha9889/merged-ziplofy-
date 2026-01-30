import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useCallback } from "react";

interface ProductImageItemProps {
  imageUrl: string;
  index: number;
  onUpdateImage: (index: number, url: string) => void;
  onRemoveImage: (index: number) => void;
}

const ProductImageItem: React.FC<ProductImageItemProps> = ({
  imageUrl,
  index,
  onUpdateImage,
  onRemoveImage,
}) => {
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateImage(index, e.target.value);
  }, [index, onUpdateImage]);

  const handleRemoveClick = useCallback(() => {
    onRemoveImage(index);
  }, [index, onRemoveImage]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  }, []);

  return (
    <div className="border border-gray-200 rounded p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-600">
          Image {index + 1}
        </span>
        <button
          type="button"
          onClick={handleRemoveClick}
          className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Image URL Input */}
      <input
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={handleImageChange}
        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors mb-2"
      />
      
      {/* Image Preview */}
      {imageUrl.trim() ? (
        <img
          src={imageUrl}
          alt={`Preview ${index + 1}`}
          className="w-full h-32 object-cover rounded border border-gray-200"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-32 border border-dashed border-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
          No image preview
        </div>
      )}
    </div>
  );
};

export default ProductImageItem;

