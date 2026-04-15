import { PhotoIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface ProductImagesGalleryProps {
  imageUrls: string[];
}

const ProductImagesGallery: React.FC<ProductImagesGalleryProps> = ({ imageUrls }) => {
  const urls = Array.isArray(imageUrls) ? imageUrls : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50/90 to-white px-5 py-3.5">
        <h2 className="text-sm font-semibold text-gray-900">Media</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          {urls.length === 0 ? 'No images uploaded' : `${urls.length} image${urls.length === 1 ? '' : 's'}`}
        </p>
      </div>
      {urls.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
            <PhotoIcon className="h-7 w-7 text-gray-300" aria-hidden />
          </div>
          <p className="text-sm font-medium text-gray-700">No product images</p>
          <p className="mt-1 max-w-xs text-xs text-gray-500">Add images when editing this product in your catalog workflow.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 md:grid-cols-4">
          {urls.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm ring-1 ring-black/[0.03]"
            >
              <img
                src={url}
                alt={`Product ${idx + 1}`}
                className="block h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImagesGallery;
