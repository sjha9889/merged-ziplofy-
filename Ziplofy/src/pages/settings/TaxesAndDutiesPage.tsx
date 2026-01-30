import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBagIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
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
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-4">
          <ShoppingBagIcon className="w-5 h-5 text-gray-600" />
          <h1 className="text-xl font-medium text-gray-900">
            Taxes and duties
          </h1>
        </div>

        {/* Tax Regions Section */}
        <div className="border border-gray-200 bg-white/95 p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-medium text-gray-900">
              Tax regions
            </h2>
            <InformationCircleIcon className="w-4 h-4 text-gray-500" />
          </div>

          <p className="text-xs text-gray-600 mb-4">
            Areas where your customers will pay tax, and where you will collect and remit. Create a{' '}
            <button
              onClick={() => navigate('/settings/shipping-and-delivery')}
              className="text-gray-700 cursor-pointer hover:underline"
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
                className="w-full pl-10 pr-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
            <button className="p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors">
              <FunnelIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors">
              <ArrowsUpDownIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Tax Regions Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-700 border-b border-gray-200">
                    Region
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-700 border-b border-gray-200">
                    Collecting
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-700 border-b border-gray-200">
                    Tax service
                  </th>
                </tr>
              </thead>
              <tbody>
                {countriesLoading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-xs text-gray-600">
                      Loading countries...
                    </td>
                  </tr>
                ) : paginatedRegions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-xs text-gray-600">
                      No countries found
                    </td>
                  </tr>
                ) : (
                  paginatedRegions.map((region) => (
                    <tr
                      key={region.id}
                      onClick={() => navigate(`/settings/taxes-and-duties/${region.id}`)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{region.flag}</span>
                          <span className="text-sm text-gray-900 font-medium">
                            {region.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 border-b border-gray-100">
                        {region.collecting ? (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-xs font-medium text-gray-700">
                            {region.collecting}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 border-b border-gray-100 text-sm text-gray-600">
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
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`p-1.5 border border-gray-200 transition-colors ${
                  page === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`p-1.5 border border-gray-200 transition-colors ${
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
        <div className="border border-gray-200 bg-white/95 p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-gray-900">
              Duties and import taxes
            </h2>
            <InformationCircleIcon className="w-4 h-4 text-gray-500" />
          </div>

          {/* Collect duties and import taxes at checkout */}
          <div className="mb-4">
            <div className="flex justify-between items-start gap-4 mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  Collect duties and import taxes at checkout
                </p>
                <p className="text-xs text-gray-600">
                  Prevent surprise fees for international customers at delivery • 0.5% transaction fee
                </p>
              </div>
              <button className="px-3 py-1.5 border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
                Set up
              </button>
            </div>

            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 flex items-start gap-2">
              <InformationCircleIcon className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">
                Ensure the carriers you use offer{' '}
                <button className="text-gray-700 cursor-pointer hover:underline">
                  Delivered duty paid (DDP) shipping labels
                </button>
                .
              </p>
            </div>
          </div>

          {/* Customs information */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                Customs information
              </h3>
              <button className="p-1 text-gray-500 hover:bg-gray-50 transition-colors">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-0.5">
                Country of origin
              </p>
              <p className="text-xs text-gray-900">
                No default set
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-0.5">
                Harmonized System (HS) codes
              </p>
              <p className="text-xs text-gray-900">
                No physical products available
              </p>
            </div>
          </div>
        </div>

        {/* Global settings */}
        <div className="border border-gray-200 bg-white/95 p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Global settings
          </h2>

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
                className="mt-0.5 w-4 h-4 border-gray-300 text-gray-600 focus:ring-gray-400"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  Include sales tax in product price and shipping rate
                </p>
                <p className="text-xs text-gray-600">
                  Assumes a 9% tax rate, which is adjusted to local tax rates in markets with{' '}
                  <button className="text-gray-700 cursor-pointer hover:underline">
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
                className="mt-0.5 w-4 h-4 border-gray-300 text-gray-600 focus:ring-gray-400"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  Charge sales tax on shipping
                </p>
                <p className="text-xs text-gray-600">
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
                className="mt-0.5 w-4 h-4 border-gray-300 text-gray-600 focus:ring-gray-400"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  Charge VAT on digital goods
                </p>
                <p className="text-xs text-gray-600">
                  Creates a collection of digital goods that will be{' '}
                  <button className="text-gray-700 cursor-pointer hover:underline">
                    charged VAT
                  </button>{' '}
                  at checkout (for European customers)
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default TaxesAndDutiesPage;
