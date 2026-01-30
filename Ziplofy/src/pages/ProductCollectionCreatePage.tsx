import { ArrowLeftIcon, PlusIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import { useCollections } from '../contexts/collection.context';
import { useStore } from '../contexts/store.context';

const ProductCollectionCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createCollection } = useCollections();
  const { activeStoreId } = useStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    pageTitle: '',
    metaDescription: '',
    urlHandle: '',
    status: 'published' as 'draft' | 'published',
  });

  const handleChange = useCallback((field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBack = useCallback(() => {
    navigate('/products/collections');
  }, [navigate]);

  const handleSubmit = useCallback(async () => {
    if (!activeStoreId) {
      navigate('/products/collections');
      return;
    }
    try {
      await createCollection({
        storeId: activeStoreId,
        title: form.title,
        description: form.description,
        pageTitle: form.pageTitle,
        metaDescription: form.metaDescription,
        urlHandle: form.urlHandle,
        onlineStorePublishing: true,
        pointOfSalePublishing: false,
        status: form.status,
      });
      navigate('/products/collections');
    } catch (e) {
      // error is handled in context; optionally keep here for UX in future
    }
  }, [activeStoreId, form, createCollection, navigate]);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
                <RectangleStackIcon className="w-5 h-5 text-gray-600" />
                <h1 className="text-xl font-medium text-gray-900">Create Collection</h1>
              </div>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Save Collection
              </button>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column */}
          <div className="flex-1">
            {/* Title & Description */}
            <div className="bg-white rounded border border-gray-200 p-4 mb-6">
              <h2 className="text-base font-medium text-gray-900 mb-3">Title and description</h2>
              <div className="border-t border-gray-200 mb-3"></div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                    placeholder="Enter collection title"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors resize-none"
                    placeholder="Enter collection description"
                  />
                </div>
              </div>
            </div>

            {/* Search Engine Listing */}
            <div className="bg-white rounded border border-gray-200 p-4">
              <h2 className="text-base font-medium text-gray-900 mb-2">Search engine listing</h2>
              <p className="text-sm text-gray-600 mb-4">
                Add a title and description to see how this collection might appear in a search engine listing.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="pageTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Page title
                  </label>
                  <input
                    id="pageTitle"
                    type="text"
                    value={form.pageTitle}
                    onChange={(e) => handleChange('pageTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                    placeholder="Enter page title"
                  />
                </div>
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta description
                  </label>
                  <textarea
                    id="metaDescription"
                    value={form.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors resize-none"
                    placeholder="Enter meta description"
                  />
                </div>
                <div>
                  <label htmlFor="urlHandle" className="block text-sm font-medium text-gray-700 mb-2">
                    URL handle
                  </label>
                  <input
                    id="urlHandle"
                    type="text"
                    value={form.urlHandle}
                    onChange={(e) => handleChange('urlHandle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                    placeholder="Enter URL handle"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Lowercase letters, numbers, and hyphens only
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-full md:w-[360px]">
            <div className="bg-white rounded border border-gray-200 p-4">
              <h2 className="text-base font-medium text-gray-900 mb-3">Status</h2>
              <div className="border-t border-gray-200 mb-3"></div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value as 'draft' | 'published')}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default ProductCollectionCreatePage;
