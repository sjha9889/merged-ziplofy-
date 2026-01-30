import React from 'react';

interface ProductImagesGalleryProps {
  imageUrls: string[];
}

const ProductImagesGallery: React.FC<ProductImagesGalleryProps> = ({ imageUrls }) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Images
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {imageUrls.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative rounded overflow-hidden border border-gray-200 aspect-square bg-gray-50"
          >
            <img
              src={url}
              alt={`Product image ${idx + 1}`}
              className="w-full h-full object-cover block"
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImagesGallery;

