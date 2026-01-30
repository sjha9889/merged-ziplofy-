import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, PhotoIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useCatalogMarkets } from '../../contexts/catalog-market.context';
import { useCatalogProducts } from '../../contexts/catalog-product.context';
import { useMarkets } from '../../contexts/market.context';
import { useProducts } from '../../contexts/product.context';
import { useStore } from '../../contexts/store.context';

const MarketsCatalogDetailsPage: React.FC = () => {
  const { catalogId } = useParams();
  const navigate = useNavigate();
  const { markets, getByStoreId, loading } = useMarkets();
  const { activeStoreId } = useStore();
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');
  const [isMarketSelectOpen, setIsMarketSelectOpen] = useState(false);
  const { searchBasic } = useProducts();
  const [productQuery, setProductQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{ _id: string; title: string; imageUrl: string | null }>>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ _id: string; title: string }>>([]);
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);
  const debounceRef = useRef<number | undefined>(undefined);
  const { createItem, getByCatalogId, items: catalogProducts, loading: catalogProductsLoading, deleteItem } = useCatalogProducts();
  const { getByCatalogId: getCatalogMarkets, items: catalogMarkets, loading: catalogMarketsLoading, createItem: createCatalogMarket } = useCatalogMarkets();
  const [saving, setSaving] = useState<boolean>(false);
  const [expandedProductIds, setExpandedProductIds] = useState<Record<string, boolean>>({});
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<{ id: string; title: string } | null>(null);

  const marketSelectRef = useRef<HTMLDivElement>(null);
  const productSearchRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: string) => setExpandedProductIds((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    if (activeStoreId) {
      getByStoreId(activeStoreId).catch(() => {});
    }
  }, [activeStoreId, getByStoreId]);

  // Debounced product search
  useEffect(() => {
    if (!productQuery || !activeStoreId) {
      setSearchResults([]);
      setIsProductSearchOpen(false);
      return;
    }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      const results = await searchBasic({ q: productQuery, storeId: activeStoreId }).catch(() => []);
      setSearchResults(results);
      setIsProductSearchOpen(results.length > 0);
    }, 300);
    return () => window.clearTimeout(debounceRef.current);
  }, [productQuery, activeStoreId, searchBasic]);

  // Fetch existing catalog products
  useEffect(() => {
    if (catalogId) {
      getByCatalogId(String(catalogId)).catch(() => {});
    }
  }, [catalogId, getByCatalogId]);

  // Fetch catalog markets
  useEffect(() => {
    if (catalogId) {
      getCatalogMarkets(String(catalogId)).catch(() => {});
    }
  }, [catalogId, getCatalogMarkets]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (marketSelectRef.current && !marketSelectRef.current.contains(event.target as Node)) {
        setIsMarketSelectOpen(false);
      }
      if (productSearchRef.current && !productSearchRef.current.contains(event.target as Node)) {
        setIsProductSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProduct = useCallback((product: { _id: string; title: string }) => {
    const alreadyInCatalog = !!catalogProducts.find(cp => cp.productId === product._id);
    const alreadySelected = !!selectedProducts.find(p => p._id === product._id);
    if (!alreadyInCatalog && !alreadySelected) {
      setSelectedProducts(prev => [...prev, product]);
      setProductQuery('');
      setIsProductSearchOpen(false);
    }
  }, [catalogProducts, selectedProducts]);

  const handleSaveSelectedProducts = useCallback(async () => {
    if (!catalogId) return;
    try {
      setSaving(true);
      await Promise.all(
        selectedProducts.map((p) =>
          createItem({ catalogId: String(catalogId), productId: p._id, isManuallyAdded: true })
        )
      );
      setSelectedProducts([]);
      if (catalogId) {
        getByCatalogId(String(catalogId)).catch(() => {});
      }
    } finally {
      setSaving(false);
    }
  }, [catalogId, selectedProducts, createItem, getByCatalogId]);

  const handleSaveMarket = useCallback(async () => {
    if (!catalogId || !selectedMarketId) return;
    await createCatalogMarket({ catalogId: String(catalogId), marketId: selectedMarketId });
    setSelectedMarketId('');
    if (catalogId) {
      getCatalogMarkets(String(catalogId)).catch(() => {});
    }
  }, [catalogId, selectedMarketId, createCatalogMarket, getCatalogMarkets]);

  const handleDeleteProduct = useCallback(async () => {
    if (!toDelete) return;
    await deleteItem(toDelete.id).catch(() => {});
    setDeleteOpen(false);
    setToDelete(null);
    if (catalogId) {
      getByCatalogId(String(catalogId)).catch(() => {});
    }
  }, [toDelete, deleteItem, catalogId, getByCatalogId]);

  const selectedMarket = markets.find((m) => m._id === selectedMarketId);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="mb-4">
            <button
              onClick={() => navigate('/markets/catalogs')}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm font-medium cursor-pointer">Back</span>
            </button>
            <h1 className="text-xl font-medium text-gray-900">Catalog details</h1>
          </div>

          {/* Assign to Market Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign to market</label>
            <div className="relative" ref={marketSelectRef}>
              <button
                type="button"
                onClick={() => setIsMarketSelectOpen(!isMarketSelectOpen)}
                disabled={loading}
                className="w-full md:w-[280px] flex items-center justify-between px-3 py-2 border border-gray-200 rounded text-sm text-left bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={selectedMarket ? 'text-gray-900' : 'text-gray-400 italic'}>
                  {selectedMarket ? `${selectedMarket.name} (${selectedMarket.status === 'active' ? 'Active' : 'Draft'})` : 'Select a market'}
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isMarketSelectOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMarketSelectOpen && (
                <div className="absolute z-10 w-full md:w-[280px] mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                  {markets.map((m) => {
                    const isAdded = !!catalogMarkets.find((cm) => cm.marketId === m._id);
                    return (
                      <button
                        key={m._id}
                        type="button"
                        onClick={() => {
                          if (!isAdded) {
                            setSelectedMarketId(m._id);
                            setIsMarketSelectOpen(false);
                          }
                        }}
                        disabled={isAdded || loading}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                          isAdded ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span>{`${m.name} (${m.status === 'active' ? 'Active' : 'Draft'})`}</span>
                        {isAdded && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-50 text-green-700 border border-green-200">
                            Added
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {selectedMarketId && !catalogMarkets.find((cm) => cm.marketId === selectedMarketId) && (
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={handleSaveMarket}
                  className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h2 className="text-base font-medium text-gray-900 mb-4">Products</h2>
            <div className="relative mb-4" ref={productSearchRef}>
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition-colors"
                />
              </div>
              {isProductSearchOpen && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((option) => {
                    const disabled = !!catalogProducts.find(cp => cp.productId === option._id) || !!selectedProducts.find(p => p._id === option._id);
                    return (
                      <button
                        key={option._id}
                        type="button"
                        onClick={() => handleAddProduct({ _id: option._id, title: option.title })}
                        disabled={disabled}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                          disabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span>{option.title}</span>
                        {catalogProducts.find(cp => cp.productId === option._id) && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-50 text-green-700 border border-green-200">
                            Added
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedProducts.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProducts.map((p) => (
                    <span
                      key={p._id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium rounded bg-gray-50 text-gray-700 border border-gray-200"
                    >
                      {p.title}
                      <button
                        type="button"
                        onClick={() => setSelectedProducts(prev => prev.filter(sp => sp._id !== p._id))}
                        className="hover:text-gray-900 transition-colors"
                      >
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={saving || !catalogId}
                    onClick={handleSaveSelectedProducts}
                    className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Catalog Products Table */}
          <div className="bg-white border border-gray-200 rounded overflow-hidden mb-4">
            <div className="grid grid-cols-[1fr_220px_220px_60px] px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50">
              <div>Product</div>
              <div>Price in INR</div>
              <div>Compare at price</div>
              <div />
            </div>
            <div className="border-t border-gray-200" />
            {catalogProductsLoading ? (
              <div className="px-3 py-3 text-sm text-gray-600">Loading products...</div>
            ) : catalogProducts.length === 0 ? (
              <div className="px-3 py-3 text-sm text-gray-600">No products in catalog</div>
            ) : (
              catalogProducts.map((cp, idx) => {
                const title = cp.product?.title || 'Untitled';
                const image = cp.product?.imageUrl || null;
                const variantCount = cp.variants?.length || 0;
                const isExpanded = !!expandedProductIds[cp._id];
                return (
                  <div key={cp._id}>
                    <div className="grid grid-cols-[1fr_220px_220px_60px] items-center px-3 py-2 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center shrink-0">
                          {image ? (
                            <img src={image} alt={title} className="w-7 h-7 object-cover rounded" />
                          ) : (
                            <PhotoIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{title}</div>
                          <div className="text-xs text-gray-500">{variantCount} {variantCount === 1 ? 'variant' : 'variants'}</div>
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          defaultValue={cp.product?.price ?? ''}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          defaultValue={cp.product?.compareAtPrice ?? ''}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition-colors"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        {variantCount > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(cp._id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setToDelete({ id: cp._id, title });
                            setDeleteOpen(true);
                          }}
                          className="p-1 hover:bg-red-50 rounded transition-colors"
                          aria-label="Remove from catalog"
                        >
                          <TrashIcon className="w-4 h-4 text-gray-600 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                    {isExpanded && cp.variants && cp.variants.map((v, vIdx) => (
                      <div key={v._id} className={`grid grid-cols-[1fr_220px_220px_60px] items-center px-3 py-1.5 bg-gray-50 ${vIdx < cp.variants.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <div className="flex items-center gap-2 pl-5">
                          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center shrink-0">
                            {v.imageUrl ? (
                              <img src={v.imageUrl} alt={v.sku || ''} className="w-6 h-6 object-cover rounded" />
                            ) : (
                              <PhotoIcon className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </div>
                          <span className="text-sm text-gray-700">
                            {Object.entries(v.optionValues || {}).map(([k, val]) => `${k}: ${val}`).join(' • ') || v.sku}
                          </span>
                        </div>
                        <div>
                          <input
                            type="text"
                            defaultValue={v.price ?? ''}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition-colors"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            defaultValue={v.compareAtPrice ?? ''}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition-colors"
                          />
                        </div>
                        <div />
                      </div>
                    ))}
                    {idx < catalogProducts.length - 1 && <div className="border-t border-gray-200" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Catalog Active in Markets Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-base font-medium text-gray-900 mb-3">Catalog active in markets</h2>
            <p className="text-sm text-gray-600 mb-3">
              {catalogMarketsLoading ? 'Loading markets...' : `${catalogMarkets.length} market(s)`}
            </p>
            {catalogMarkets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {catalogMarkets.map((cm) => {
                  const market = markets.find((m) => m._id === cm.marketId);
                  const label = market ? market.name : cm.marketId;
                  return (
                    <span
                      key={cm._id}
                      className="inline-flex items-center px-2.5 py-1 text-sm font-medium rounded bg-gray-50 text-gray-700 border border-gray-200"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-500/20 z-[1400]"
            onClick={() => setDeleteOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-lg w-full max-w-md shadow-lg border border-gray-200 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base font-medium text-gray-900">Remove product from catalog</h2>
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Close"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm text-gray-700">
                  Are you sure you want to remove <span className="font-medium">{toDelete?.title || 'this product'}</span> from this catalog?
                </p>
              </div>
              <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Yes, remove
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </GridBackgroundWrapper>
  );
};

export default MarketsCatalogDetailsPage;
