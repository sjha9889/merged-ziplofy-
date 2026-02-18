import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { useCountries } from '../../contexts/country.context';
import { useTaxAndDutiesGlobalSettings } from '../../contexts/tax-and-duties-global-settings.context';
import { useStore } from '../../contexts/store.context';

interface TaxRegion {
  id: string;
  name: string;
  flag: string;
  collecting: string | null;
  taxService: string;
}

const TaxesAndDutiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { countries, loading: countriesLoading, getCountries } = useCountries();
  const { activeStoreId } = useStore();
  const { settings, loading: settingsLoading, getByStoreId, update } = useTaxAndDutiesGlobalSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [includeSalesTax, setIncludeSalesTax] = useState(false);
  const [chargeTaxOnShipping, setChargeTaxOnShipping] = useState(false);
  const [chargeVATOnDigital, setChargeVATOnDigital] = useState(false);
  
  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch countries on component mount
  useEffect(() => {
    getCountries({ limit: 1000 }); // Fetch a large number to get all countries
  }, [getCountries]);

  // Fetch tax and duties global settings when store ID is available
  useEffect(() => {
    if (activeStoreId) {
      getByStoreId(activeStoreId).catch((error) => {
        console.error('Failed to fetch tax and duties global settings:', error);
      });
    }
  }, [activeStoreId, getByStoreId]);

  // Sync local state with fetched settings
  useEffect(() => {
    if (settings) {
      setIncludeSalesTax(settings.includeSalesTaxInProductPriceAndShippingRate);
      setChargeTaxOnShipping(settings.chargeSalesTaxOnShipping);
      setChargeVATOnDigital(settings.chargeVATOnDigitalGoods);
    }
  }, [settings]);

  // Debounced update function
  const debouncedUpdate = useCallback(
    (payload: {
      includeSalesTaxInProductPriceAndShippingRate?: boolean;
      chargeSalesTaxOnShipping?: boolean;
      chargeVATOnDigitalGoods?: boolean;
    }) => {
      if (!settings || !settings._id) {
        return;
      }

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(async () => {
        try {
          await update(settings._id, payload);
        } catch (error) {
          console.error('Failed to update tax and duties global settings:', error);
        }
      }, 500); // 500ms debounce delay
    },
    [settings, update]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Map countries to TaxRegion format
  const taxRegions: TaxRegion[] = countries.map((country) => ({
    id: country._id,
    name: country.name,
    flag: country.flagEmoji || '🏳️',
    collecting: country.name.toLowerCase() === 'india' ? 'Taxes' : null, // Show "Taxes" chip for India
    taxService: 'Manual Tax', // Default value, can be updated later
  }));

  const filteredRegions = taxRegions.filter((region) =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedRegions = filteredRegions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredRegions.length / rowsPerPage);

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Taxes and duties</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage tax regions, duties, import taxes, and global tax settings.
          </p>
        </header>

        {/* Tax Regions Section */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-base font-semibold text-gray-900">Tax regions</h2>
            <InformationCircleIcon className="w-4 h-4 text-gray-500" />
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Areas where your customers will pay tax, and where you will collect and remit. Create a{' '}
            <button
              type="button"
              onClick={() => navigate('/settings/shipping-and-delivery')}
              className="text-gray-700 cursor-pointer hover:underline font-medium"
            >
              shipping zone
            </button>{' '}
            to add a new tax region. If you're unsure about your tax liability, check with a tax professional.
          </p>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-[300px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
            <button type="button" className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <FunnelIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button type="button" className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <ArrowsUpDownIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Tax Regions Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 border-b border-gray-200">
                    Region
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 border-b border-gray-200">
                    Collecting
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 border-b border-gray-200">
                    Tax service
                  </th>
                </tr>
              </thead>
              <tbody>
                {countriesLoading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-sm text-gray-500">
                      Loading countries...
                    </td>
                  </tr>
                ) : paginatedRegions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-sm text-gray-500">
                      No countries found
                    </td>
                  </tr>
                ) : (
                  paginatedRegions.map((region) => (
                    <tr
                      key={region.id}
                      onClick={() => navigate(`/settings/taxes-and-duties/${region.id}`)}
                      className="cursor-pointer hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{region.flag}</span>
                          <span className="text-sm text-gray-900 font-medium">
                            {region.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {region.collecting ? (
                          <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700">
                            {region.collecting}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {region.taxService}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 mt-4">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`p-2 rounded-lg border border-gray-200 transition-colors ${
                  page === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`p-2 rounded-lg border border-gray-200 transition-colors ${
                  page === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Duties and import taxes */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-semibold text-gray-900">Duties and import taxes</h2>
            <InformationCircleIcon className="w-4 h-4 text-gray-500" />
          </div>

          {/* Collect duties and import taxes at checkout */}
          <div className="mb-4">
            <div className="flex justify-between items-start gap-4 mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  Collect duties and import taxes at checkout
                </p>
                <p className="text-sm text-gray-500">
                  Prevent surprise fees for international customers at delivery • 0.5% transaction fee
                </p>
              </div>
              <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap">
                Set up
              </button>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-start gap-2">
              <InformationCircleIcon className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-500">
                Ensure the carriers you use offer{' '}
                <button type="button" className="text-gray-700 cursor-pointer hover:underline font-medium">
                  Delivered duty paid (DDP) shipping labels
                </button>
                .
              </p>
            </div>
          </div>

          {/* Customs information */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">Customs information</h3>
              <button type="button" className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-0.5">Country of origin</p>
              <p className="text-sm text-gray-900">No default set</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-0.5">Harmonized System (HS) codes</p>
              <p className="text-sm text-gray-900">No physical products available</p>
            </div>
          </div>
        </div>

        {/* Global settings */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Global settings</h2>

          {/* Include sales tax in product price and shipping rate */}
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSalesTax}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setIncludeSalesTax(newValue);
                  debouncedUpdate({
                    includeSalesTaxInProductPriceAndShippingRate: newValue,
                  });
                }}
                disabled={settingsLoading || !settings}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  Include sales tax in product price and shipping rate
                </p>
                <p className="text-sm text-gray-500">
                  Assumes a 9% tax rate, which is adjusted to local tax rates in markets with{' '}
                  <button type="button" className="text-gray-700 cursor-pointer hover:underline font-medium">
                    dynamic tax inclusion
                  </button>
                  .
                </p>
              </div>
            </label>
          </div>

          {/* Charge sales tax on shipping */}
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={chargeTaxOnShipping}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setChargeTaxOnShipping(newValue);
                  debouncedUpdate({
                    chargeSalesTaxOnShipping: newValue,
                  });
                }}
                disabled={settingsLoading || !settings}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">Charge sales tax on shipping</p>
                <p className="text-sm text-gray-500">
                  Automatically calculated for Canada, European Union, and United States
                </p>
              </div>
            </label>
          </div>

          {/* Charge VAT on digital goods */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={chargeVATOnDigital}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setChargeVATOnDigital(newValue);
                  debouncedUpdate({
                    chargeVATOnDigitalGoods: newValue,
                  });
                }}
                disabled={settingsLoading || !settings}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">Charge VAT on digital goods</p>
                <p className="text-sm text-gray-500">
                  Creates a collection of digital goods that will be{' '}
                  <button type="button" className="text-gray-700 cursor-pointer hover:underline font-medium">
                    charged VAT
                  </button>{' '}
                  at checkout (for European customers)
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxesAndDutiesPage;
