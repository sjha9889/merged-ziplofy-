import { useState, useEffect, useCallback } from "react";
import { ArrowLeftIcon, CurrencyDollarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAmountOffProductsDiscount, CreateDiscountRequest } from "../../contexts/amount-off-products-discount.context";
import { useProducts } from "../../contexts/product.context";
import { useCollections } from "../../contexts/collection.context";
import { useCustomerSegments } from "../../contexts/customer-segment.context";
import { useCustomers } from "../../contexts/customer.context";
import { useStore } from "../../contexts/store.context";
import GridBackgroundWrapper from "../../components/GridBackgroundWrapper";
import MultiSelect from "../../components/MultiSelect";
import Select from "../../components/Select";

const AmountOffProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { createDiscount, loading, error, clearError } = useAmountOffProductsDiscount();
  const { products, fetchProductsByStoreId, searchBasic, loading: productsLoading } = useProducts();
  const { collections, fetchCollectionsByStoreId, searchCollections, loading: collectionsLoading } = useCollections();
  const { segments, fetchSegmentsByStoreId, searchCustomerSegments, loading: segmentsLoading } = useCustomerSegments();
  const { customers, fetchCustomersByStoreId, searchCustomers, loading: customersLoading } = useCustomers();
  const { activeStoreId } = useStore();
  
  // State for selected items
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  
  // State for search
  const [collectionSearchQuery, setCollectionSearchQuery] = useState<string>('');
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [segmentSearchQuery, setSegmentSearchQuery] = useState<string>('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');

  // State for search results
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Debounced search functions
  const debouncedSearchCollections = useCallback(
    (() => {
      let timeoutId: number;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(async () => {
          if (query.trim() && activeStoreId) {
            try {
              await searchCollections(activeStoreId, query);
            } catch (error) {
              console.error('Error searching collections:', error);
            }
          } else if (activeStoreId) {
            await fetchCollectionsByStoreId(activeStoreId);
          }
        }, 300);
      };
    })(),
    [activeStoreId, searchCollections, fetchCollectionsByStoreId]
  );

  const debouncedSearchProducts = useCallback(
    (() => {
      let timeoutId: number;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(async () => {
          if (query.trim() && activeStoreId) {
            try {
              const searchResults = await searchBasic({ q: query, storeId: activeStoreId });
              const fullProducts = searchResults.map(result => ({
                _id: result._id,
                title: result.title,
                price: 0,
                description: '',
                imageUrl: result.imageUrl
              }));
              setSearchResults(fullProducts);
            } catch (error) {
              console.error('Error searching products:', error);
            }
          } else if (activeStoreId) {
            await fetchProductsByStoreId(activeStoreId);
            setSearchResults([]);
          }
        }, 300);
      };
    })(),
    [activeStoreId, fetchProductsByStoreId, searchBasic]
  );

  const debouncedSearchSegments = useCallback(
    (() => {
      let timeoutId: number;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(async () => {
          if (query.trim() && activeStoreId) {
            try {
              await searchCustomerSegments(activeStoreId, query);
            } catch (error) {
              console.error('Error searching customer segments:', error);
            }
          } else if (activeStoreId) {
            await fetchSegmentsByStoreId(activeStoreId);
          }
        }, 300);
      };
    })(),
    [activeStoreId, searchCustomerSegments, fetchSegmentsByStoreId]
  );

  const debouncedSearchCustomers = useCallback(
    (() => {
      let timeoutId: number;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(async () => {
          if (query.trim() && activeStoreId) {
            try {
              await searchCustomers(activeStoreId, query);
            } catch (error) {
              console.error('Error searching customers:', error);
            }
          } else if (activeStoreId) {
            await fetchCustomersByStoreId(activeStoreId);
          }
        }, 300);
      };
    })(),
    [activeStoreId, searchCustomers, fetchCustomersByStoreId]
  );

  const [formData, setFormData] = useState({
    method: 'discount-code' as 'discount-code' | 'automatic',
    discountCode: '',
    title: '',
    valueType: 'percentage' as 'percentage' | 'fixed-amount',
    percentage: '',
    fixedAmount: '',
    takeAmountOffEachItem: false,
    appliesTo: 'specific-collections' as 'specific-collections' | 'specific-products',
    searchQuery: '',
    oncePerOrder: false,
    eligibility: 'all-customers' as 'all-customers' | 'specific-customer-segments' | 'specific-customers',
    applyOnPOSPro: false,
    eligibilitySearchQuery: '',
    minimumPurchase: 'no-requirements' as 'no-requirements' | 'minimum-amount' | 'minimum-quantity',
    minimumAmount: '',
    minimumQuantity: '',
    productDiscounts: false,
    orderDiscounts: false,
    shippingDiscounts: false,
    startDate: '',
    startTime: '',
    setEndDate: false,
    endDate: '',
    endTime: '',
    allowDiscountOnChannels: false,
    limitTotalUses: false,
    totalUsesLimit: '',
    limitOneUsePerCustomer: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (activeStoreId) {
        try {
          await Promise.all([
            fetchProductsByStoreId(activeStoreId),
            fetchCollectionsByStoreId(activeStoreId),
            fetchSegmentsByStoreId(activeStoreId),
            fetchCustomersByStoreId(activeStoreId)
          ]);
        } catch (error) {
          console.error('Failed to fetch products, collections, segments, and customers:', error);
        }
      }
    };
    
    fetchData();
  }, [activeStoreId, fetchProductsByStoreId, fetchCollectionsByStoreId, fetchSegmentsByStoreId, fetchCustomersByStoreId]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleProductSelection = useCallback((productId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  }, []);

  const handleCollectionSelection = useCallback((collectionId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCollections(prev => [...prev, collectionId]);
    } else {
      setSelectedCollections(prev => prev.filter(id => id !== collectionId));
    }
  }, []);

  const handleCancel = useCallback(() => {
    navigate('/discounts?createDiscountModal=open');
  }, [navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      const discountData: CreateDiscountRequest = {
        storeId: activeStoreId,
        method: formData.method,
        ...(formData.method === 'discount-code' && { discountCode: formData.discountCode }),
        ...(formData.method === 'automatic' && { title: formData.title }),
        allowDiscountOnChannels: formData.allowDiscountOnChannels,
        limitTotalUses: formData.limitTotalUses,
        totalUsesLimit: formData.totalUsesLimit ? Number(formData.totalUsesLimit) : undefined,
        limitOneUsePerCustomer: formData.limitOneUsePerCustomer,
        valueType: formData.valueType,
        ...(formData.valueType === 'percentage' && { percentage: Number(formData.percentage) }),
        ...(formData.valueType === 'fixed-amount' && { fixedAmount: Number(formData.fixedAmount) }),
        appliesTo: formData.appliesTo,
        oncePerOrder: formData.takeAmountOffEachItem,
        eligibility: formData.eligibility,
        applyOnPOSPro: formData.applyOnPOSPro,
        minimumPurchase: formData.minimumPurchase,
        minimumAmount: formData.minimumAmount ? Number(formData.minimumAmount) : undefined,
        minimumQuantity: formData.minimumQuantity ? Number(formData.minimumQuantity) : undefined,
        productDiscounts: formData.productDiscounts,
        orderDiscounts: formData.orderDiscounts,
        shippingDiscounts: formData.shippingDiscounts,
        startDate: formData.startDate,
        startTime: formData.startTime,
        setEndDate: formData.setEndDate,
        endDate: formData.endDate,
        endTime: formData.endTime,
        status: 'active',
        targetProductIds: selectedProducts,
        targetCollectionIds: selectedCollections,
        targetCustomerSegmentIds: selectedSegments,
        targetCustomerIds: selectedCustomers,
      };

      const result = await createDiscount(discountData);
      
      if (result.success) {
        navigate('/discounts?createDiscountModal=open');
      }
    } catch (error) {
      console.error('Failed to create discount:', error);
    }
  }, [formData, selectedProducts, selectedCollections, selectedSegments, selectedCustomers, activeStoreId, createDiscount, navigate, clearError]);

  // Prepare options for selects
  const appliesToOptions = [
    { value: 'specific-collections', label: 'Specific collections' },
    { value: 'specific-products', label: 'Specific products' },
  ];

  const allProducts = searchResults.length > 0 ? searchResults : products;
  const productOptions = allProducts.map(p => ({
    value: p._id,
    label: p.title,
    secondaryText: p.price > 0 ? `(₹${p.price})` : undefined,
  }));

  const collectionOptions = collections.map(c => ({
    value: c._id,
    label: c.title,
    secondaryText: c.description,
  }));

  const segmentOptions = segments.map(s => ({
    value: s._id,
    label: s.name,
  }));

  const customerOptions = customers.map(c => ({
    value: c._id,
    label: `${c.firstName} ${c.lastName}`,
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
              Amount off products
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 px-4">
          <form onSubmit={handleSubmit}>
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 flex items-center justify-between">
                <p className="text-sm text-red-800">{error}</p>
                <button
                  type="button"
                  onClick={clearError}
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

            {/* Discount Value Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">Discount value</h2>
              
              <fieldset className="mb-3">
                <legend className="text-xs text-gray-600 mb-1.5">Value Type</legend>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="valueType"
                      value="percentage"
                      checked={formData.valueType === 'percentage'}
                      onChange={(e) => handleInputChange('valueType', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Percentage</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="valueType"
                      value="fixed-amount"
                      checked={formData.valueType === 'fixed-amount'}
                      onChange={(e) => handleInputChange('valueType', e.target.value)}
                      className="w-4 h-4 text-gray-900"
                    />
                    <span className="text-sm text-gray-700">Fixed amount</span>
                  </label>
                </div>
              </fieldset>

              {formData.valueType === 'percentage' && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.percentage}
                      onChange={(e) => handleInputChange('percentage', e.target.value)}
                      placeholder="Enter percentage"
                      className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-8 text-base"
                    />
                    <span className="absolute right-3 top-2 text-gray-500 text-sm">%</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">Enter the percentage discount (e.g., 10 for 10%)</p>
                </div>
              )}

              {formData.valueType === 'fixed-amount' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                      <input
                        type="number"
                        value={formData.fixedAmount}
                        onChange={(e) => handleInputChange('fixedAmount', e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-3 py-1.5 pl-8 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Enter the fixed amount in rupees</p>
                  </div>
                  <div className="mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.takeAmountOffEachItem}
                        onChange={(e) => handleInputChange('takeAmountOffEachItem', e.target.checked)}
                        className="w-4 h-4 text-gray-900"
                      />
                      <span className="text-sm text-gray-700">Once per order</span>
                    </label>
                    <p className="mt-1 ml-6 text-xs text-gray-600">
                      If not selected, the amount will be taken off each eligible item in an order
                    </p>
                  </div>
                </>
              )}
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Applies To Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">Applies to</h2>
              
              <div className="mb-3">
                <Select
                  label="Applies to"
                  value={formData.appliesTo}
                  options={appliesToOptions}
                  onChange={(value) => handleInputChange('appliesTo', value)}
                />
              </div>

              {/* Product Selection */}
              {formData.appliesTo === 'specific-products' && (
                <div className="mb-3">
                  <h3 className="text-xs font-medium mb-1.5 text-gray-900">Select Products</h3>
                  
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Search Products
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={productSearchQuery}
                        onChange={(e) => {
                          const query = e.target.value;
                          setProductSearchQuery(query);
                          debouncedSearchProducts(query);
                        }}
                        placeholder="Type to search products..."
                        className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10 text-base"
                      />
                      {productsLoading && (
                        <div className="absolute right-3 top-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <MultiSelect
                    label="Choose Products"
                    value={selectedProducts}
                    options={productOptions}
                    onChange={setSelectedProducts}
                    renderValue={(selected) => {
                      const selectedProducts = allProducts.filter(p => selected.includes(p._id));
                      return selectedProducts.map(p => p.title).join(', ');
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-600">
                    {selectedProducts.length} product(s) selected
                  </p>
                </div>
              )}

              {/* Collection Selection */}
              {formData.appliesTo === 'specific-collections' && (
                <div className="mb-3">
                  <h3 className="text-xs font-medium mb-1.5 text-gray-900">Select Collections</h3>
                  
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Search Collections
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={collectionSearchQuery}
                        onChange={(e) => {
                          const query = e.target.value;
                          setCollectionSearchQuery(query);
                          debouncedSearchCollections(query);
                        }}
                        placeholder="Type to search collections..."
                        className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10 text-base"
                      />
                      {collectionsLoading && (
                        <div className="absolute right-3 top-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <MultiSelect
                    label="Choose Collections"
                    value={selectedCollections}
                    options={collectionOptions}
                    onChange={setSelectedCollections}
                    renderValue={(selected) => {
                      const selectedCollections = collections.filter(c => selected.includes(c._id));
                      return selectedCollections.map(c => c.title).join(', ');
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-600">
                    {selectedCollections.length} collection(s) selected
                  </p>
                </div>
              )}
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

              {formData.eligibility === 'all-customers' && formData.method === 'automatic' && (
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
                        if (formData.eligibility === 'specific-customer-segments') {
                          const query = e.target.value;
                          setSegmentSearchQuery(query);
                          debouncedSearchSegments(query);
                        } else {
                          const query = e.target.value;
                          setCustomerSearchQuery(query);
                          debouncedSearchCustomers(query);
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
                        value={selectedSegments}
                        options={segmentOptions}
                        onChange={setSelectedSegments}
                        renderValue={(selected) => {
                          const selectedSegments = segments.filter(s => selected.includes(s._id));
                          return selectedSegments.map(s => s.name).join(', ');
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-600">
                        {selectedSegments.length} segment(s) selected
                      </p>
                    </div>
                  )}

                  {formData.eligibility === 'specific-customers' && customers.length > 0 && (
                    <div className="mt-3">
                      <MultiSelect
                        label="Choose Customers"
                        value={selectedCustomers}
                        options={customerOptions}
                        onChange={setSelectedCustomers}
                        renderValue={(selected) => {
                          const selectedCustomers = customers.filter(c => selected.includes(c._id));
                          return selectedCustomers.map(c => `${c.firstName} ${c.lastName}`).join(', ');
                        }}
                      />
                      <p className="mt-1 text-xs text-gray-600">
                        {selectedCustomers.length} customer(s) selected
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
                <div>
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
                  <p className="mt-1 text-xs text-gray-600">Enter the minimum purchase amount in rupees</p>
                  <p className="mt-2 ml-2 text-xs text-gray-600">Applies only to selected products</p>
                </div>
              )}

              {formData.minimumPurchase === 'minimum-quantity' && (
                <div>
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
                  <p className="mt-1 text-xs text-gray-600">Enter the minimum quantity of items required</p>
                  <p className="mt-2 ml-2 text-xs text-gray-600">Applies only to selected products</p>
                </div>
              )}
            </div>

            <hr className="my-8 border-gray-200" />

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
                  <p className="mt-1 text-xs text-gray-600">Select the start date for the discount</p>
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
                  <p className="mt-1 text-xs text-gray-600">Select the start time in Indian Standard Time</p>
                </div>

                <div className="col-span-full">
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
                  <>
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
                      <p className="mt-1 text-xs text-gray-600">Select the end date for the discount</p>
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
                      <p className="mt-1 text-xs text-gray-600">Select the end time in Indian Standard Time</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sales Channel Access Section - only shown for discount code */}
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

            {/* Maximum Discount Uses Section - only shown for discount code */}
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
                      <div className="ml-6 mt-2 max-w-xs">
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
                disabled={loading}
                className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? "Creating..." : "Create Discount"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default AmountOffProductsPage;
