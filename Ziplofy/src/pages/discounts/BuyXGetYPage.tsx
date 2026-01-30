import { useState, useCallback } from "react";
import { ArrowLeftIcon, ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../contexts/product.context";
import { useCollections } from "../../contexts/collection.context";
import { useStore } from "../../contexts/store.context";
import { useCustomerSegments } from "../../contexts/customer-segment.context";
import { useCustomers } from "../../contexts/customer.context";
import { useBuyXGetYDiscount } from "../../contexts/buy-x-get-y-discount.context";
import GridBackgroundWrapper from "../../components/GridBackgroundWrapper";
import MultiSelect from "../../components/MultiSelect";
import Select from "../../components/Select";

const BuyXGetYPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const { searchBasic, loading: productsLoading } = useProducts();
  const { searchCollections, loading: collectionsLoading, collections } = useCollections();
  const { segments, searchCustomerSegments, fetchSegmentsByStoreId, loading: segmentsLoading } = useCustomerSegments();
  const { customers, searchCustomers, fetchCustomersByStoreId, loading: customersLoading } = useCustomers();
  const { createDiscount, loading: creating, error: createError } = useBuyXGetYDiscount();
  
  const [formData, setFormData] = useState({
    method: 'discount-code' as 'discount-code' | 'automatic',
    discountCode: '',
    title: '',
    allowDiscountOnChannels: false,
    customerBuys: 'minimum-quantity' as 'minimum-quantity' | 'minimum-amount',
    quantity: '',
    amount: '',
    anyItemsFrom: 'specific-products' as 'specific-products' | 'specific-collections',
    searchQuery: '',
    customerGetsQuantity: '',
    customerGetsAnyItemsFrom: 'specific-products' as 'specific-products' | 'specific-collections',
    customerGetsSearchQuery: '',
    discountedValue: 'free' as 'free' | 'amount' | 'percentage',
    discountedAmount: '',
    discountedPercentage: '',
    setMaxUsersPerOrder: false,
    maxUsersPerOrder: '',
    eligibility: 'all-customers' as 'all-customers' | 'specific-customer-segments' | 'specific-customers',
    eligibilitySearchQuery: '',
    applyOnPOSPro: false,
    limitTotalUses: false,
    totalUsesLimit: '',
    limitOneUsePerCustomer: false,
    productDiscounts: false,
    orderDiscounts: false,
    shippingDiscounts: false,
    startDate: '',
    startTime: '',
    setEndDate: false,
    endDate: '',
    endTime: '',
  });

  const [buyProductResults, setBuyProductResults] = useState<any[]>([]);
  const [selectedBuyProductIds, setSelectedBuyProductIds] = useState<string[]>([]);
  const [selectedBuyCollectionIds, setSelectedBuyCollectionIds] = useState<string[]>([]);
  const [getProductResults, setGetProductResults] = useState<any[]>([]);
  const [selectedGetProductIds, setSelectedGetProductIds] = useState<string[]>([]);
  const [selectedGetCollectionIds, setSelectedGetCollectionIds] = useState<string[]>([]);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [segmentSearchQuery, setSegmentSearchQuery] = useState<string>('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const debouncedSearchProducts = useCallback((() => {
    let t: number;
    return async (query: string, target: 'buy' | 'get') => {
      window.clearTimeout(t);
      t = window.setTimeout(async () => {
        if (!activeStoreId) return;
        if (!query.trim()) {
          if (target === 'buy') setBuyProductResults([]);
          else setGetProductResults([]);
          return;
        }
        try {
          const res = await searchBasic({ q: query, storeId: activeStoreId });
          const mapped = res.map((p: any) => ({ _id: p._id, title: p.title, sku: p.sku, imageUrl: p.imageUrl }));
          if (target === 'buy') setBuyProductResults(mapped);
          else setGetProductResults(mapped);
        } catch (e) {}
      }, 300);
    };
  })(), [activeStoreId, searchBasic]);

  const debouncedSearchCollections = useCallback((() => {
    let t: number;
    return async (query: string) => {
      window.clearTimeout(t);
      t = window.setTimeout(async () => {
        if (!activeStoreId) return;
        try {
          await searchCollections(activeStoreId, query || '', 1, 10);
        } catch (e) {}
      }, 300);
    };
  })(), [activeStoreId, searchCollections]);

  const debouncedSearchSegments = useCallback((() => {
    let t: number;
    return async (query: string) => {
      window.clearTimeout(t);
      t = window.setTimeout(async () => {
        if (!activeStoreId) return;
        if (query.trim()) {
          try { await searchCustomerSegments(activeStoreId, query); } catch (e) {}
        } else {
          try { await fetchSegmentsByStoreId(activeStoreId); } catch (e) {}
        }
      }, 300);
    };
  })(), [activeStoreId, searchCustomerSegments, fetchSegmentsByStoreId]);

  const debouncedSearchCustomers = useCallback((() => {
    let t: number;
    return async (query: string) => {
      window.clearTimeout(t);
      t = window.setTimeout(async () => {
        if (!activeStoreId) return;
        if (query.trim()) {
          try { await searchCustomers(activeStoreId, query); } catch (e) {}
        } else {
          try { await fetchCustomersByStoreId(activeStoreId); } catch (e) {}
        }
      }, 300);
    };
  })(), [activeStoreId, searchCustomers, fetchCustomersByStoreId]);

  const handleCancel = useCallback(() => {
    navigate('/discounts?createDiscountModal=open');
  }, [navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        storeId: activeStoreId as string,
        method: formData.method as 'discount-code' | 'automatic',
        ...(formData.method === 'discount-code' ? { discountCode: formData.discountCode } : {}),
        ...(formData.method === 'automatic' ? { title: formData.title } : {}),
        allowDiscountOnChannels: formData.allowDiscountOnChannels,
        customerBuys: formData.customerBuys as 'minimum-quantity' | 'minimum-amount',
        ...(formData.customerBuys === 'minimum-quantity' ? { quantity: Number(formData.quantity) || 0 } : {}),
        ...(formData.customerBuys === 'minimum-amount' ? { amount: Number(formData.amount) || 0 } : {}),
        anyItemsFrom: formData.anyItemsFrom as 'specific-products' | 'specific-collections',
        customerGetsQuantity: Number(formData.customerGetsQuantity) || 1,
        customerGetsAnyItemsFrom: formData.customerGetsAnyItemsFrom as 'specific-products' | 'specific-collections',
        discountedValue: formData.discountedValue as 'free' | 'amount' | 'percentage',
        ...(formData.discountedValue === 'amount' ? { discountedAmount: Number(formData.discountedAmount) || 0 } : {}),
        ...(formData.discountedValue === 'percentage' ? { discountedPercentage: Number(formData.discountedPercentage) || 0 } : {}),
        setMaxUsersPerOrder: formData.setMaxUsersPerOrder,
        ...(formData.setMaxUsersPerOrder ? { maxUsersPerOrder: Number(formData.maxUsersPerOrder) || 0 } : {}),
        eligibility: formData.eligibility as 'all-customers' | 'specific-customer-segments' | 'specific-customers',
        applyOnPOSPro: formData.applyOnPOSPro,
        limitTotalUses: formData.limitTotalUses,
        ...(formData.limitTotalUses ? { totalUsesLimit: Number(formData.totalUsesLimit) || 0 } : {}),
        limitOneUsePerCustomer: formData.limitOneUsePerCustomer,
        productDiscounts: formData.productDiscounts,
        orderDiscounts: formData.orderDiscounts,
        shippingDiscounts: formData.shippingDiscounts,
        startDate: formData.startDate || undefined,
        startTime: formData.startTime || undefined,
        setEndDate: formData.setEndDate,
        endDate: formData.endDate || undefined,
        endTime: formData.endTime || undefined,
        status: 'active' as const,
        buysProductIds: selectedBuyProductIds,
        buysCollectionIds: selectedBuyCollectionIds,
        getsProductIds: selectedGetProductIds,
        getsCollectionIds: selectedGetCollectionIds,
        targetCustomerSegmentIds: selectedSegmentIds,
        targetCustomerIds: selectedCustomerIds,
      };

      const res = await createDiscount(payload);
      if (res.success) {
        navigate('/discounts');
      }
    } catch (err) {
      // error handled by context
    }
  }, [formData, selectedBuyProductIds, selectedBuyCollectionIds, selectedGetProductIds, selectedGetCollectionIds, selectedSegmentIds, selectedCustomerIds, activeStoreId, createDiscount, navigate]);

  // Prepare options for selects
  const anyItemsFromOptions = [
    { value: 'specific-products', label: 'Specific products' },
    { value: 'specific-collections', label: 'Specific collections' },
  ];

  const buyProductOptions = buyProductResults.map(p => ({
    value: p._id,
    label: p.title,
  }));

  const buyCollectionOptions = collections.map(c => ({
    value: c._id,
    label: c.title,
  }));

  const getProductOptions = getProductResults.map(p => ({
    value: p._id,
    label: p.title,
  }));

  const getCollectionOptions = collections.map(c => ({
    value: c._id,
    label: c.title,
  }));

  const segmentOptions = segments.map(s => ({
    value: s._id,
    label: s.name,
  }));

  const customerOptions = customers.map(c => ({
    value: c._id,
    label: `${c.firstName} ${c.lastName}`.trim() || c.email,
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
              Buy X get Y
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

            <hr className="my-4 border-gray-200" />

            {/* Customer Buys/Spends Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">
                {formData.customerBuys === 'minimum-amount' ? 'Customer spends' : 'Customer buys'}
              </h2>
              
              <fieldset className="mb-3">
                <legend className="text-xs text-gray-600 mb-1.5">
                  {formData.customerBuys === 'minimum-amount' ? 'Customer spends' : 'Customer buys'}
                </legend>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="customerBuys"
                      value="minimum-quantity"
                      checked={formData.customerBuys === 'minimum-quantity'}
                      onChange={(e) => handleInputChange('customerBuys', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Minimum quantity of items</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="customerBuys"
                      value="minimum-amount"
                      checked={formData.customerBuys === 'minimum-amount'}
                      onChange={(e) => handleInputChange('customerBuys', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Minimum purchase amount</span>
                  </label>
                </div>
              </fieldset>

              {(formData.customerBuys === 'minimum-quantity' || formData.customerBuys === 'minimum-amount') && (
                <div className="mt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1.5">
                        {formData.customerBuys === 'minimum-quantity' ? 'Quantity' : 'Amount'}
                      </label>
                      {formData.customerBuys === 'minimum-amount' ? (
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                          <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', e.target.value)}
                            placeholder="Enter minimum amount"
                            className="w-full px-3 py-1.5 pl-8 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                          />
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange('quantity', e.target.value)}
                          placeholder="Enter minimum quantity"
                          className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                        />
                      )}
                      <p className="mt-1 text-xs text-gray-600">
                        {formData.customerBuys === 'minimum-quantity' ? 'Enter the minimum quantity of items required' : 'Enter the minimum purchase amount in rupees'}
                      </p>
                    </div>

                    <div>
                      <Select
                        label="Any items from"
                        value={formData.anyItemsFrom}
                        options={anyItemsFromOptions}
                        onChange={(value) => handleInputChange('anyItemsFrom', value)}
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block text-xs text-gray-600 mb-1.5">
                        {formData.anyItemsFrom === 'specific-products' ? 'Search products' : 'Search collections'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.searchQuery}
                          onChange={(e) => {
                            const q = e.target.value;
                            handleInputChange('searchQuery', q);
                            if (formData.anyItemsFrom === 'specific-products') {
                              debouncedSearchProducts(q, 'buy');
                            } else {
                              debouncedSearchCollections(q);
                            }
                          }}
                          placeholder={formData.anyItemsFrom === 'specific-products' ? 'Search for products...' : 'Search for collections...'}
                          className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10 text-base"
                        />
                        {((formData.anyItemsFrom === 'specific-products' && productsLoading) || (formData.anyItemsFrom === 'specific-collections' && collectionsLoading)) && (
                          <div className="absolute right-3 top-2">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        {formData.anyItemsFrom === 'specific-products' ? 'Search and select products to apply the discount to' : 'Search and select collections to apply the discount to'}
                      </p>
                    </div>

                    {formData.anyItemsFrom === 'specific-products' && (
                      <div className="col-span-full">
                        <MultiSelect
                          label="Choose Products"
                          value={selectedBuyProductIds}
                          options={buyProductOptions}
                          onChange={setSelectedBuyProductIds}
                          renderValue={(selected) => {
                            const names = buyProductResults.filter(p => selected.includes(p._id)).map(p => p.title);
                            return names.join(', ');
                          }}
                        />
                        <p className="mt-1 text-xs text-gray-600">
                          {selectedBuyProductIds.length} product(s) selected
                        </p>
                      </div>
                    )}

                    {formData.anyItemsFrom === 'specific-collections' && (
                      <div className="col-span-full">
                        <MultiSelect
                          label="Choose Collections"
                          value={selectedBuyCollectionIds}
                          options={buyCollectionOptions}
                          onChange={setSelectedBuyCollectionIds}
                          renderValue={(selected) => {
                            const names = collections.filter(c => selected.includes(c._id)).map(c => c.title);
                            return names.join(', ');
                          }}
                        />
                        <p className="mt-1 text-xs text-gray-600">
                          {selectedBuyCollectionIds.length} collection(s) selected
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Customer Gets Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">Customer gets</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.customerGetsQuantity}
                    onChange={(e) => handleInputChange('customerGetsQuantity', e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                  />
                  <p className="mt-1 text-xs text-gray-600">Enter the quantity of items customers will get</p>
                </div>

                <div>
                  <Select
                    label="Any items from"
                    value={formData.customerGetsAnyItemsFrom}
                    options={anyItemsFromOptions}
                    onChange={(value) => handleInputChange('customerGetsAnyItemsFrom', value)}
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    {formData.customerGetsAnyItemsFrom === 'specific-products' ? 'Search products' : 'Search collections'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.customerGetsSearchQuery}
                      onChange={(e) => {
                        const q = e.target.value;
                        handleInputChange('customerGetsSearchQuery', q);
                        if (formData.customerGetsAnyItemsFrom === 'specific-products') {
                          debouncedSearchProducts(q, 'get');
                        } else {
                          debouncedSearchCollections(q);
                        }
                      }}
                      placeholder={formData.customerGetsAnyItemsFrom === 'specific-products' ? 'Search for products...' : 'Search for collections...'}
                      className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10 text-base"
                    />
                    {((formData.customerGetsAnyItemsFrom === 'specific-products' && productsLoading) || (formData.customerGetsAnyItemsFrom === 'specific-collections' && collectionsLoading)) && (
                      <div className="absolute right-3 top-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {formData.customerGetsAnyItemsFrom === 'specific-products' ? 'Search and select products to apply the discount to' : 'Search and select collections to apply the discount to'}
                  </p>
                </div>

                {formData.customerGetsAnyItemsFrom === 'specific-products' && (
                  <div className="col-span-full">
                    <MultiSelect
                      label="Choose Products"
                      value={selectedGetProductIds}
                      options={getProductOptions}
                      onChange={setSelectedGetProductIds}
                      renderValue={(selected) => {
                        const names = getProductResults.filter(p => selected.includes(p._id)).map(p => p.title);
                        return names.join(', ');
                      }}
                    />
                    <p className="mt-1 text-xs text-gray-600">
                      {selectedGetProductIds.length} product(s) selected
                    </p>
                  </div>
                )}

                {formData.customerGetsAnyItemsFrom === 'specific-collections' && (
                  <div className="col-span-full">
                    <MultiSelect
                      label="Choose Collections"
                      value={selectedGetCollectionIds}
                      options={getCollectionOptions}
                      onChange={setSelectedGetCollectionIds}
                      renderValue={(selected) => {
                        const names = collections.filter(c => selected.includes(c._id)).map(c => c.title);
                        return names.join(', ');
                      }}
                    />
                    <p className="mt-1 text-xs text-gray-600">
                      {selectedGetCollectionIds.length} collection(s) selected
                    </p>
                  </div>
                )}
              </div>

              {/* At a discounted value section */}
              <div className="mt-4">
                <h3 className="text-base font-medium mb-3 text-gray-900">At a discounted value</h3>
                
                <fieldset className="mb-3">
                  <legend className="text-xs text-gray-600 mb-1.5">Discounted Value</legend>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="discountedValue"
                        value="free"
                        checked={formData.discountedValue === 'free'}
                        onChange={(e) => handleInputChange('discountedValue', e.target.value)}
                        className="w-4 h-4 text-gray-900"
                      />
                      <span className="text-sm text-gray-700">Free</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="discountedValue"
                        value="amount"
                        checked={formData.discountedValue === 'amount'}
                        onChange={(e) => handleInputChange('discountedValue', e.target.value)}
                        className="w-4 h-4 text-gray-900"
                      />
                      <span className="text-sm text-gray-700">Amount of each</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="discountedValue"
                        value="percentage"
                        checked={formData.discountedValue === 'percentage'}
                        onChange={(e) => handleInputChange('discountedValue', e.target.value)}
                        className="w-4 h-4 text-gray-900"
                      />
                      <span className="text-sm text-gray-700">Percentage</span>
                    </label>
                  </div>
                </fieldset>

                {formData.discountedValue === 'amount' && (
                  <>
                    <div className="mt-3">
                      <label className="block text-xs text-gray-600 mb-1.5">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                        <input
                          type="number"
                          value={formData.discountedAmount}
                          onChange={(e) => handleInputChange('discountedAmount', e.target.value)}
                          placeholder="Enter amount"
                          className="w-full px-3 py-1.5 pl-8 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-600">Enter the amount in rupees</p>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      For multiple quantities, the discount amount will be taken off each eligible item.
                    </p>
                  </>
                )}

                {formData.discountedValue === 'percentage' && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.discountedPercentage}
                        onChange={(e) => handleInputChange('discountedPercentage', e.target.value)}
                        placeholder="Enter percentage"
                        className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-8 text-base"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">%</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Enter the percentage discount</p>
                  </div>
                )}

                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.setMaxUsersPerOrder}
                      onChange={(e) => handleInputChange('setMaxUsersPerOrder', e.target.checked)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Set a maximum number of users per order</span>
                  </label>
                  
                  {formData.setMaxUsersPerOrder && (
                    <div className="ml-6 mt-2">
                      <label className="block text-xs text-gray-600 mb-1.5">
                        Maximum number of users per order
                      </label>
                      <input
                        type="number"
                        value={formData.maxUsersPerOrder}
                        onChange={(e) => handleInputChange('maxUsersPerOrder', e.target.value)}
                        placeholder="Enter maximum number"
                        className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                      />
                      <p className="mt-1 text-xs text-gray-600">Enter the maximum number of users per order</p>
                    </div>
                  )}
                </div>
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

              {(formData.eligibility === 'specific-customer-segments' || formData.eligibility === 'specific-customers') && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    {formData.eligibility === 'specific-customer-segments' ? 'Search customer segments' : 'Search customers'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.eligibility === 'specific-customer-segments' ? segmentSearchQuery : customerSearchQuery}
                      onChange={(e) => {
                        const q = e.target.value;
                        if (formData.eligibility === 'specific-customer-segments') {
                          setSegmentSearchQuery(q);
                          debouncedSearchSegments(q);
                        } else {
                          setCustomerSearchQuery(q);
                          debouncedSearchCustomers(q);
                        }
                      }}
                      placeholder={formData.eligibility === 'specific-customer-segments' ? 'Search for customer segments...' : 'Search for customers...'}
                      className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10 text-base"
                    />
                    {((formData.eligibility === 'specific-customer-segments' && segmentsLoading) || (formData.eligibility === 'specific-customers' && customersLoading)) && (
                      <div className="absolute right-3 top-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {formData.eligibility === 'specific-customer-segments' ? 'Search and select customer segments to apply the discount to' : 'Search and select customers to apply the discount to'}
                  </p>

                  {formData.eligibility === 'specific-customer-segments' && segments.length > 0 && (
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

                  {formData.eligibility === 'specific-customers' && customers.length > 0 && (
                    <div className="mt-3">
                      <MultiSelect
                        label="Choose Customers"
                        value={selectedCustomerIds}
                        options={customerOptions}
                        onChange={setSelectedCustomerIds}
                        renderValue={(selected) => customers.filter(c => selected.includes(c._id)).map(c => `${c.firstName} ${c.lastName}`.trim() || c.email).join(', ')}
                      />
                      <p className="mt-1 text-xs text-gray-600">
                        {selectedCustomerIds.length} customer(s) selected
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

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

              <div className="mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shippingDiscounts}
                    onChange={(e) => handleInputChange('shippingDiscounts', e.target.checked)}
                    className="w-4 h-4 text-gray-900"
                  />
                  <span className="text-sm text-gray-700">Shipping Discounts</span>
                </label>
                {formData.shippingDiscounts && (
                  <p className="mt-1 ml-6 text-xs text-gray-600">
                    The largest eligible shipping discount will apply in addition to eligible product discounts.
                  </p>
                )}
              </div>

              {(formData.productDiscounts || formData.orderDiscounts || formData.shippingDiscounts) && (
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
                disabled={creating}
                className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {creating ? 'Creating...' : 'Create Discount'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default BuyXGetYPage;
