import { useState, useEffect, useCallback } from "react";
import { ArrowLeftIcon, TruckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useFreeShippingDiscount } from "../../contexts/free-shipping-discount.context";
import { useStore } from "../../contexts/store.context";
import { useCustomerSegments } from "../../contexts/customer-segment.context";
import { COUNTRIES, getCountryName } from "../../constants/countries";
import { useCustomers } from "../../contexts/customer.context";
import GridBackgroundWrapper from "../../components/GridBackgroundWrapper";
import MultiSelect from "../../components/MultiSelect";

const FreeShippingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createDiscount, loading, error: createError } = useFreeShippingDiscount();
  const { activeStoreId } = useStore();
  const { segments, searchCustomerSegments, fetchSegmentsByStoreId, loading: segmentsLoading } = useCustomerSegments();
  const { customers, searchCustomers, fetchCustomersByStoreId, loading: customersLoading } = useCustomers();
  
  const [formData, setFormData] = useState({
    method: 'discount-code' as 'discount-code' | 'automatic',
    discountCode: '',
    title: '',
    countrySelection: 'all-countries' as 'all-countries' | 'selected-countries',
    countrySearchQuery: '',
    excludeShippingRates: false,
    shippingRateLimit: '',
    eligibility: 'all-customers' as 'all-customers' | 'specific-customer-segments' | 'specific-customers',
    eligibilitySearchQuery: '',
    applyOnPOSPro: false,
    minimumPurchase: 'no-requirements' as 'no-requirements' | 'minimum-amount' | 'minimum-quantity',
    minimumAmount: '',
    minimumQuantity: '',
    allowDiscountOnChannels: false,
    limitTotalUses: false,
    totalUsesLimit: '',
    limitOneUsePerCustomer: false,
    productDiscounts: false,
    orderDiscounts: false,
    startDate: '',
    startTime: '',
    setEndDate: false,
    endDate: '',
    endTime: '',
  });

  const [segmentSearchQuery, setSegmentSearchQuery] = useState<string>('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [selectedCountryCodes, setSelectedCountryCodes] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState(COUNTRIES);

  const debouncedSearchSegments = useCallback((() => {
    let t: number;
    return (q: string) => {
      window.clearTimeout(t);
      t = window.setTimeout(async () => {
        if (!activeStoreId) return;
        if (q.trim()) {
          try { await searchCustomerSegments(activeStoreId, q); } catch {}
        } else {
          try { await fetchSegmentsByStoreId(activeStoreId); } catch {}
        }
      }, 300);
    };
  })(), [activeStoreId, searchCustomerSegments, fetchSegmentsByStoreId]);

  const debouncedSearchCustomers = useCallback((() => {
    let t: number;
    return (q: string) => {
      window.clearTimeout(t);
      t = window.setTimeout(async () => {
        if (!activeStoreId) return;
        if (q.trim()) {
          try { await searchCustomers(activeStoreId, q); } catch {}
        } else {
          try { await fetchCustomersByStoreId(activeStoreId); } catch {}
        }
      }, 300);
    };
  })(), [activeStoreId, searchCustomers, fetchCustomersByStoreId]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCountrySearch = useCallback((query: string) => {
    handleInputChange('countrySearchQuery', query);
    if (query.trim() === '') {
      setFilteredCountries(COUNTRIES);
    } else {
      const filtered = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [handleInputChange]);

  const handleAddCountry = useCallback((countryCode: string) => {
    if (!selectedCountryCodes.includes(countryCode)) {
      setSelectedCountryCodes(prev => [...prev, countryCode]);
    }
  }, []);

  const handleRemoveCountry = useCallback((countryCode: string) => {
    setSelectedCountryCodes(prev => prev.filter(code => code !== countryCode));
  }, []);

  const handleCancel = useCallback(() => {
    navigate('/discounts?createDiscountModal=open');
  }, [navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStoreId) return;
    const payload = {
      storeId: activeStoreId,
      method: formData.method as 'discount-code' | 'automatic',
      discountCode: formData.method === 'discount-code' ? formData.discountCode || undefined : undefined,
      title: formData.method === 'automatic' ? formData.title || undefined : undefined,
      countrySelection: formData.countrySelection as 'all-countries' | 'selected-countries',
      selectedCountryCodes: formData.countrySelection === 'selected-countries' ? selectedCountryCodes : undefined,
      excludeShippingRates: !!formData.excludeShippingRates,
      shippingRateLimit: formData.excludeShippingRates && formData.shippingRateLimit !== '' ? Number(formData.shippingRateLimit) : undefined,
      eligibility: formData.eligibility as 'all-customers' | 'specific-customer-segments' | 'specific-customers',
      applyOnPOSPro: !!formData.applyOnPOSPro,
      minimumPurchase: formData.minimumPurchase as 'no-requirements' | 'minimum-amount' | 'minimum-quantity',
      minimumAmount: formData.minimumPurchase === 'minimum-amount' && formData.minimumAmount !== '' ? Number(formData.minimumAmount) : undefined,
      minimumQuantity: formData.minimumPurchase === 'minimum-quantity' && formData.minimumQuantity !== '' ? Number(formData.minimumQuantity) : undefined,
      allowDiscountOnChannels: !!formData.allowDiscountOnChannels,
      limitTotalUses: !!formData.limitTotalUses,
      totalUsesLimit: formData.limitTotalUses && formData.totalUsesLimit !== '' ? Number(formData.totalUsesLimit) : undefined,
      limitOneUsePerCustomer: !!formData.limitOneUsePerCustomer,
      productDiscounts: !!formData.productDiscounts,
      orderDiscounts: !!formData.orderDiscounts,
      startDate: formData.startDate || undefined,
      startTime: formData.startTime || undefined,
      setEndDate: !!formData.setEndDate,
      endDate: formData.setEndDate ? (formData.endDate || undefined) : undefined,
      endTime: formData.setEndDate ? (formData.endTime || undefined) : undefined,
      targetCustomerSegmentIds: selectedSegmentIds.length ? selectedSegmentIds : undefined,
      targetCustomerIds: selectedCustomerIds.length ? selectedCustomerIds : undefined,
    };

    try {
      const res = await createDiscount(payload as any);
      if (res.success) {
        navigate('/discounts');
      }
    } catch {}
  }, [formData, selectedCountryCodes, selectedSegmentIds, selectedCustomerIds, activeStoreId, createDiscount, navigate]);

  useEffect(() => {
    setSegmentSearchQuery('');
    setCustomerSearchQuery('');
    setSelectedSegmentIds([]);
    setSelectedCustomerIds([]);
  }, [formData.eligibility]);

  const countryOptions = filteredCountries.map(country => ({
    value: country.code,
    label: `${country.name} (${country.code})`,
  }));

  const segmentOptions = segments.map(s => ({
    value: s._id,
    label: s.name,
  }));

  const customerOptions = customers.map(c => ({
    value: c._id,
    label: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email,
    secondaryText: c.email,
  }));

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Page Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-medium text-gray-900">
              Free shipping
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 px-4">
          <form onSubmit={handleSubmit}>
            {/* Error Display */}
            {createError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 flex items-center justify-between">
                <p className="text-sm text-red-800">{createError}</p>
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Method Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">Method</h2>
              
              <fieldset className="mb-3">
                <legend className="text-xs text-gray-600 mb-1.5">Discount Method</legend>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value="discount-code"
                      checked={formData.method === 'discount-code'}
                      onChange={(e) => handleInputChange('method', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Discount code</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value="automatic"
                      checked={formData.method === 'automatic'}
                      onChange={(e) => handleInputChange('method', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Automatic discount</span>
                  </label>
                </div>
              </fieldset>

              {formData.method === 'discount-code' && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Discount code
                  </label>
                  <input
                    type="text"
                    value={formData.discountCode}
                    onChange={(e) => handleInputChange('discountCode', e.target.value)}
                    placeholder="Enter discount code"
                    className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                  />
                  <p className="mt-1 text-xs text-gray-600">Customers will enter this code at checkout</p>
                </div>
              )}

              {formData.method === 'automatic' && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter discount title"
                    className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                  />
                  <p className="mt-1 text-xs text-gray-600">This title will be shown to customers</p>
                </div>
              )}
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Country Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">Country</h2>
              
              <fieldset className="mb-3">
                <legend className="text-xs text-gray-600 mb-1.5">Country Selection</legend>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="countrySelection"
                      value="all-countries"
                      checked={formData.countrySelection === 'all-countries'}
                      onChange={(e) => handleInputChange('countrySelection', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">All Countries</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="countrySelection"
                      value="selected-countries"
                      checked={formData.countrySelection === 'selected-countries'}
                      onChange={(e) => handleInputChange('countrySelection', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Selected Countries</span>
                  </label>
                </div>
              </fieldset>

              {formData.countrySelection === 'selected-countries' && (
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Search Countries
                  </label>
                  <input
                    type="text"
                    value={formData.countrySearchQuery}
                    onChange={(e) => handleCountrySearch(e.target.value)}
                    placeholder="Search for countries..."
                    className="w-full max-w-md px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                  />
                  <p className="mt-1 text-xs text-gray-600">Search and select countries to apply the discount to</p>
                  
                  {/* Selected countries chips */}
                  {selectedCountryCodes.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-1.5">
                        Selected Countries ({selectedCountryCodes.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCountryCodes.map((code) => (
                          <span
                            key={code}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 text-xs"
                          >
                            {getCountryName(code)}
                            <button
                              type="button"
                              onClick={() => handleRemoveCountry(code)}
                              className="hover:text-gray-900"
                            >
                              <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Country selection dropdown */}
                  <div className="mt-3">
                    <MultiSelect
                      label="Select Countries"
                      value={selectedCountryCodes}
                      options={countryOptions}
                      onChange={setSelectedCountryCodes}
                      renderValue={(selected) => {
                        if (selected.length === 0) return '';
                        if (selected.length === 1) return getCountryName(selected[0]);
                        return `${selected.length} countries selected`;
                      }}
                    />
                    <p className="mt-1 text-xs text-gray-600">
                      {selectedCountryCodes.length} country(ies) selected
                    </p>
                  </div>
                </div>
              )}

              {/* Shipping Rates Section */}
              <h3 className="text-base font-medium mb-3 mt-4 text-gray-900">Shipping Rates</h3>
              
              <div className="mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.excludeShippingRates}
                    onChange={(e) => handleInputChange('excludeShippingRates', e.target.checked)}
                    className="w-4 h-4 text-gray-900"
                  />
                  <span className="text-sm text-gray-700">Exclude Shipping Rates over a certain amount</span>
                </label>
                {formData.excludeShippingRates && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Shipping rate limit
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                      <input
                        type="number"
                        value={formData.shippingRateLimit}
                        onChange={(e) => handleInputChange('shippingRateLimit', e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-3 py-1.5 pl-8 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Enter the maximum shipping rate amount in rupees</p>
                  </div>
                )}
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Eligibility Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-1 text-gray-900">Eligibility</h2>
              <p className="text-xs text-gray-600 mb-3">Available on all sales channels</p>
              
              <fieldset className="mb-3">
                <legend className="text-xs text-gray-600 mb-1.5">Customer Eligibility</legend>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="eligibility"
                      value="all-customers"
                      checked={formData.eligibility === 'all-customers'}
                      onChange={(e) => handleInputChange('eligibility', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">All customers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="eligibility"
                      value="specific-customer-segments"
                      checked={formData.eligibility === 'specific-customer-segments'}
                      onChange={(e) => handleInputChange('eligibility', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Specific customer segments</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="eligibility"
                      value="specific-customers"
                      checked={formData.eligibility === 'specific-customers'}
                      onChange={(e) => handleInputChange('eligibility', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Specific customers</span>
                  </label>
                </div>
              </fieldset>

              {formData.method === 'automatic' && formData.eligibility === 'all-customers' && (
                <div className="ml-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.applyOnPOSPro}
                      onChange={(e) => handleInputChange('applyOnPOSPro', e.target.checked)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Apply on POS Pro locations</span>
                  </label>
                </div>
              )}

              {formData.eligibility === 'specific-customer-segments' && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Search customer segments
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={segmentSearchQuery}
                      onChange={(e) => {
                        const q = e.target.value;
                        setSegmentSearchQuery(q);
                        debouncedSearchSegments(q);
                      }}
                      placeholder="Search for customer segments..."
                      className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10 text-base"
                    />
                    {segmentsLoading && (
                      <div className="absolute right-3 top-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-600">Search and select customer segments to apply the discount to</p>
                  
                  {segments.length > 0 && (
                    <div className="mt-3">
                      <MultiSelect
                        label="Choose Customer Segments"
                        value={selectedSegmentIds}
                        options={segmentOptions}
                        onChange={setSelectedSegmentIds}
                        renderValue={(selected) => segments.filter(s => selected.includes(s._id)).map(s => s.name).join(', ')}
                      />
                      <p className="mt-1 text-xs text-gray-600">
                        {selectedSegmentIds.length} segment(s) selected
                      </p>
                    </div>
                  )}
                </div>
              )}

              {formData.eligibility === 'specific-customers' && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Search customers
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => {
                        const q = e.target.value;
                        setCustomerSearchQuery(q);
                        debouncedSearchCustomers(q);
                      }}
                      placeholder="Search for customers..."
                      className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10 text-base"
                    />
                    {customersLoading && (
                      <div className="absolute right-3 top-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-600">Search and select customers to apply the discount to</p>
                  
                  {customers.length > 0 && (
                    <div className="mt-3">
                      <MultiSelect
                        label="Choose Customers"
                        value={selectedCustomerIds}
                        options={customerOptions}
                        onChange={setSelectedCustomerIds}
                        renderValue={(selected) => customers.filter(c => selected.includes(c._id)).map(c => (`${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email)).join(', ')}
                      />
                      <p className="mt-1 text-xs text-gray-600">
                        {selectedCustomerIds.length} customer(s) selected
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Minimum Purchase Requirements Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">Minimum purchase requirements</h2>
              
              <fieldset className="mb-3">
                <legend className="text-xs text-gray-600 mb-1.5">Minimum Purchase Requirements</legend>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="minimumPurchase"
                      value="no-requirements"
                      checked={formData.minimumPurchase === 'no-requirements'}
                      onChange={(e) => handleInputChange('minimumPurchase', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">No minimum requirements</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="minimumPurchase"
                      value="minimum-amount"
                      checked={formData.minimumPurchase === 'minimum-amount'}
                      onChange={(e) => handleInputChange('minimumPurchase', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Minimum purchase amount</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="minimumPurchase"
                      value="minimum-quantity"
                      checked={formData.minimumPurchase === 'minimum-quantity'}
                      onChange={(e) => handleInputChange('minimumPurchase', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Minimum quantity of items</span>
                  </label>
                </div>
              </fieldset>

              {formData.minimumPurchase === 'minimum-amount' && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Minimum purchase amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={formData.minimumAmount}
                      onChange={(e) => handleInputChange('minimumAmount', e.target.value)}
                      placeholder="Enter minimum amount"
                      className="w-full px-3 py-1.5 pl-8 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-600">Applies to all products</p>
                </div>
              )}

              {formData.minimumPurchase === 'minimum-quantity' && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Minimum quantity of items
                  </label>
                  <input
                    type="number"
                    value={formData.minimumQuantity}
                    onChange={(e) => handleInputChange('minimumQuantity', e.target.value)}
                    placeholder="Enter minimum quantity"
                    className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                  />
                  <p className="mt-1 text-xs text-gray-600">Applies to all products</p>
                </div>
              )}
            </div>

            {/* Sales Channel Access Section */}
            {formData.method === 'discount-code' && (
              <>
                <hr className="my-4 border-gray-200" />

                <div className="mb-6 border border-gray-200 p-4 bg-white/95">
                  <h2 className="text-base font-medium mb-3 text-gray-900">Sales channel access</h2>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowDiscountOnChannels}
                      onChange={(e) => handleInputChange('allowDiscountOnChannels', e.target.checked)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Allow discount to be featured on selected channels</span>
                  </label>
                </div>
              </>
            )}

            {/* Maximum Discount Uses Section */}
            {formData.method === 'discount-code' && (
              <>
                <hr className="my-4 border-gray-200" />

                <div className="mb-6 border border-gray-200 p-4 bg-white/95">
                  <h2 className="text-base font-medium mb-3 text-gray-900">Maximum discount uses</h2>
                  
                  <div className="mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.limitTotalUses}
                        onChange={(e) => handleInputChange('limitTotalUses', e.target.checked)}
                        className="w-4 h-4 text-gray-900"
                      />
                      <span className="text-sm text-gray-700">Limit number of times this discount can be used in total</span>
                    </label>
                    {formData.limitTotalUses && (
                      <div className="ml-6 mt-2">
                        <label className="block text-xs text-gray-600 mb-1.5">
                          Total uses limit
                        </label>
                        <input
                          type="number"
                          value={formData.totalUsesLimit}
                          onChange={(e) => handleInputChange('totalUsesLimit', e.target.value)}
                          placeholder="Enter maximum number of uses"
                          className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                        />
                        <p className="mt-1 text-xs text-gray-600">Enter the maximum number of times this discount can be used</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.limitOneUsePerCustomer}
                        onChange={(e) => handleInputChange('limitOneUsePerCustomer', e.target.checked)}
                        className="w-4 h-4 text-gray-900"
                      />
                      <span className="text-sm text-gray-700">Limit to one use per customer</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <hr className="my-4 border-gray-200" />

            {/* Combinations Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">Combinations</h2>
              
              <div className="mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.productDiscounts}
                    onChange={(e) => handleInputChange('productDiscounts', e.target.checked)}
                    className="w-4 h-4 text-gray-900"
                  />
                  <span className="text-sm text-gray-700">Product Discounts</span>
                </label>
                {formData.productDiscounts && (
                  <p className="mt-1 ml-6 text-xs text-gray-600">
                    Each eligible item in the cart may receive up to one product discount.
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.orderDiscounts}
                    onChange={(e) => handleInputChange('orderDiscounts', e.target.checked)}
                    className="w-4 h-4 text-gray-900"
                  />
                  <span className="text-sm text-gray-700">Order Discounts</span>
                </label>
                {formData.orderDiscounts && (
                  <p className="mt-1 ml-6 text-xs text-gray-600">
                    All eligible order discounts will apply in addition to eligible product discounts.
                  </p>
                )}
              </div>

              {(formData.productDiscounts || formData.orderDiscounts) && (
                <div className="mt-3 p-3 bg-white/95 border border-gray-200">
                  <p className="text-xs text-gray-600">
                    This discount won't combine with any other discount at checkout.
                  </p>
                </div>
              )}
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Active Dates Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">Active dates</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Start time (IST)
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                  />
                  <p className="mt-1 text-xs text-gray-600">Indian Standard Time</p>
                </div>
              </div>

              <div className="mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.setEndDate}
                    onChange={(e) => handleInputChange('setEndDate', e.target.checked)}
                    className="w-4 h-4 text-gray-900"
                  />
                  <span className="text-sm text-gray-700">Set end date</span>
                </label>
              </div>

              {formData.setEndDate && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      End date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      End time (IST)
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                    />
                    <p className="mt-1 text-xs text-gray-600">Indian Standard Time</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !activeStoreId}
                className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? 'Creating...' : 'Create Discount'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default FreeShippingPage;
