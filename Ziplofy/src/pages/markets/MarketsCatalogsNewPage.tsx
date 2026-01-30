import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import CatalogBasicsSection from '../../components/CatalogBasicsSection';
import CatalogPricingSection from '../../components/CatalogPricingSection';
import { useCatalogs } from '../../contexts/catalog.context';
import { useCurrencies } from '../../contexts/currency.context';
import { useStore } from '../../contexts/store.context';

const MarketsCatalogsNewPage: React.FC = () => {
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [title, setTitle] = useState<string>('');
  const [autoInclude] = useState(true); // keep default behavior
  const [adjustDirection, setAdjustDirection] = useState<'decrease' | 'increase'>('decrease');
  const [includeCompareAt, setIncludeCompareAt] = useState<boolean>(true);
  const [priceAdjustment, setPriceAdjustment] = useState<number>(0);
  const [currencyId, setCurrencyId] = useState<string>('');

  const { currencies, getCurrencies, loading } = useCurrencies();
  const { createCatalog } = useCatalogs();
  const { activeStoreId } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    getCurrencies({ limit: 250 })
      .then((list) => {
        if (list && list.length && !currencyId) {
          setCurrencyId(list[0]._id);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = useCallback(async () => {
    if (!activeStoreId || !title || !currencyId) return;
    await createCatalog({
      storeId: activeStoreId,
      title,
      status,
      currencyId,
      priceAdjustment,
      priceAdjustmentSide: adjustDirection,
      includeCompareAtPrice: includeCompareAt,
      autoIncludeNewProducts: autoInclude,
    });
    navigate('/markets/catalogs');
  }, [
    activeStoreId,
    title,
    status,
    currencyId,
    priceAdjustment,
    adjustDirection,
    includeCompareAt,
    autoInclude,
    createCatalog,
    navigate,
  ]);

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
            <h1 className="text-xl font-medium text-gray-900">New catalog</h1>
            <p className="mt-1 text-sm text-gray-600">Create a new catalog for your store</p>
          </div>

          <div className="space-y-4">
            <CatalogBasicsSection
              title={title}
              status={status}
              onTitleChange={setTitle}
              onStatusChange={(val) => setStatus(val)}
            />
            <CatalogPricingSection
              currencies={currencies}
              currencyId={currencyId}
              loading={loading}
              onCurrencyChange={setCurrencyId}
              priceAdjustment={priceAdjustment}
              onPriceAdjustmentChange={setPriceAdjustment}
              adjustDirection={adjustDirection}
              onAdjustDirectionChange={setAdjustDirection}
              includeCompareAt={includeCompareAt}
              onIncludeCompareAtChange={setIncludeCompareAt}
            />
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate('/markets/catalogs')}
              className="px-3 py-1.5 rounded border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!activeStoreId || !title || !currencyId}
              onClick={handleCreate}
              className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default MarketsCatalogsNewPage;


