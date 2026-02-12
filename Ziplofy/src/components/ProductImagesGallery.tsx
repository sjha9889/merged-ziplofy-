import React from 'react';

interface ProductImagesGalleryProps {
  imageUrls: string[];
}

const ProductImagesGallery: React.FC<ProductImagesGalleryProps> = ({ imageUrls }) => {
  const urls = Array.isArray(imageUrls) ? imageUrls : [];
  if (urls.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h2 className="text-sm font-semibold text-gray-900">Images</h2>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {urls.map((url, idx) => (
            <div
            key={`${url}-${idx}`}
            className="relative rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50"
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

