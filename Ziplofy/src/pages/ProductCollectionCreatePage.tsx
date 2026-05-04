import { ArrowLeftIcon, PlusIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollections } from '../contexts/collection.context';
import { useStore } from '../contexts/store.context';

const inputClass =
  'w-full rounded-lg border border-gray-200/90 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

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

  const handleChange = useCallback((field: string, value: string) => {
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
    } catch {
      // error is handled in context
    }
  }, [activeStoreId, form, createCollection, navigate]);

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4">
        {/* Page header — aligned with Collections list */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleBack}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200/90 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
              Back to collections
            </button>
            <div className="border-l-4 border-blue-500/60 pl-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <RectangleStackIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create collection</h1>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Add details and SEO settings. You can add products after saving.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            Save collection
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-6">
            <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">Title and description</h2>
              <p className="mt-1 text-sm text-gray-500">Shown on your storefront where this collection appears.</p>
              <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
                <div>
                  <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    className={inputClass}
                    placeholder="e.g. Summer sale"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Optional description for customers"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">Search engine listing</h2>
              <p className="mt-1 text-sm text-gray-500">
                Add a title and description to preview how this collection may appear in search results.
              </p>
              <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
                <div>
                  <label htmlFor="pageTitle" className="mb-2 block text-sm font-medium text-gray-700">
                    Page title
                  </label>
                  <input
                    id="pageTitle"
                    type="text"
                    value={form.pageTitle}
                    onChange={(e) => handleChange('pageTitle', e.target.value)}
                    className={inputClass}
                    placeholder="Page title for search engines"
                  />
                </div>
                <div>
                  <label htmlFor="metaDescription" className="mb-2 block text-sm font-medium text-gray-700">
                    Meta description
                  </label>
                  <textarea
                    id="metaDescription"
                    value={form.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Short summary for search results"
                  />
                </div>
                <div>
                  <label htmlFor="urlHandle" className="mb-2 block text-sm font-medium text-gray-700">
                    URL handle
                  </label>
                  <input
                    id="urlHandle"
                    type="text"
                    value={form.urlHandle}
                    onChange={(e) => handleChange('urlHandle', e.target.value)}
                    className={inputClass}
                    placeholder="summer-sale"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">Use lowercase letters, numbers, and hyphens only.</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="w-full shrink-0 lg:w-[360px]">
            <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">Visibility</h2>
              <p className="mt-1 text-sm text-gray-500">Control whether this collection is live on your store.</p>
              <div className="mt-5 border-t border-gray-100 pt-5">
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value as 'draft' | 'published')}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductCollectionCreatePage;
