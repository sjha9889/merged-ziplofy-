import React, { useCallback } from "react";

interface ProductSearchEngineListingSectionProps {
  pageTitle: string;
  metaDescription: string;
  urlHandle: string;
  onPageTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onUrlHandleChange: (value: string) => void;
}

const ProductSearchEngineListingSection: React.FC<ProductSearchEngineListingSectionProps> = ({
  pageTitle,
  metaDescription,
  urlHandle,
  onPageTitleChange,
  onMetaDescriptionChange,
  onUrlHandleChange,
}) => {
  const handlePageTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onPageTitleChange(e.target.value);
  }, [onPageTitleChange]);

  const handleMetaDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMetaDescriptionChange(e.target.value);
  }, [onMetaDescriptionChange]);

  const handleUrlHandleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUrlHandleChange(e.target.value);
  }, [onUrlHandleChange]);

  return (
    <div className="mb-6 border border-gray-200 p-3 bg-white/95">
      <h2 className="text-base font-medium text-gray-900 mb-2">
        Search Engine Listing
      </h2>
      
      <p className="text-sm text-gray-600 mb-4">
        Add a title and description to see how this product might appear in a search engine listing.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Title
          </label>
          <input
            type="text"
            value={pageTitle}
            onChange={handlePageTitleChange}
            placeholder="Enter page title"
            maxLength={70}
            className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
          />
          <p className="mt-1 text-sm text-gray-500">{pageTitle.length}/70 characters</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={metaDescription}
            onChange={handleMetaDescriptionChange}
            placeholder="Enter meta description"
            maxLength={160}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors resize-none"
          />
          <p className="mt-1 text-sm text-gray-500">{metaDescription.length}/160 characters</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Handle
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base">products/</span>
            <input
              type="text"
              value={urlHandle}
              onChange={handleUrlHandleChange}
              placeholder="Enter URL handle"
              className="w-full pl-20 pr-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">This will be the URL for your product page</p>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchEngineListingSection;

