import { useState, useCallback } from "react";
import { ArrowLeftIcon, HashtagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../contexts/store.context";
import { useCustomerSegments } from "../../contexts/customer-segment.context";
import { useCustomers } from "../../contexts/customer.context";
import { useAmountOffOrderDiscount } from "../../contexts/amount-off-order-discount.context";
import GridBackgroundWrapper from "../../components/GridBackgroundWrapper";
import MultiSelect from "../../components/MultiSelect";

const AmountOffOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const { segments, searchCustomerSegments, fetchSegmentsByStoreId, loading: segmentsLoading } = useCustomerSegments();
  const { customers, searchCustomers, fetchCustomersByStoreId, loading: customersLoading } = useCustomers();
  const { createDiscount, loading: creating, error: createError } = useAmountOffOrderDiscount();
  
  const [formData, setFormData] = useState({
    method: 'discount-code' as 'discount-code' | 'automatic',
    discountCode: '',
    title: '',
    valueType: 'percentage' as 'percentage' | 'fixed-amount',
    percentage: '',
    fixedAmount: '',
    eligibility: 'all-customers' as 'all-customers' | 'specific-customer-segments' | 'specific-customers',
    eligibilitySearchQuery: '',
    applyOnPOSPro: false,
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

  const handleCancel = useCallback(() => {
    navigate('/discounts?createDiscountModal=open');
  }, [navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStoreId) return;
    try {
      const payload = {
        storeId: activeStoreId,
        method: formData.method as 'discount-code' | 'automatic',
        ...(formData.method === 'discount-code' ? { discountCode: formData.discountCode } : {}),
        ...(formData.method === 'automatic' ? { title: formData.title } : {}),
        valueType: formData.valueType as 'percentage' | 'fixed-amount',
        ...(formData.valueType === 'percentage' ? { percentage: Number(formData.percentage) || 0 } : {}),
        ...(formData.valueType === 'fixed-amount' ? { fixedAmount: Number(formData.fixedAmount) || 0 } : {}),
        eligibility: formData.eligibility as 'all-customers' | 'specific-customer-segments' | 'specific-customers',
        applyOnPOSPro: formData.applyOnPOSPro,
        minimumPurchase: formData.minimumPurchase as 'no-requirements' | 'minimum-amount' | 'minimum-quantity',
        ...(formData.minimumPurchase === 'minimum-amount' ? { minimumAmount: Number(formData.minimumAmount) || 0 } : {}),
        ...(formData.minimumPurchase === 'minimum-quantity' ? { minimumQuantity: Number(formData.minimumQuantity) || 0 } : {}),
        productDiscounts: formData.productDiscounts,
        orderDiscounts: formData.orderDiscounts,
        shippingDiscounts: formData.shippingDiscounts,
        allowDiscountOnChannels: formData.allowDiscountOnChannels,
        limitTotalUses: formData.limitTotalUses,
        ...(formData.limitTotalUses ? { totalUsesLimit: Number(formData.totalUsesLimit) || 0 } : {}),
        limitOneUsePerCustomer: formData.limitOneUsePerCustomer,
        startDate: formData.startDate || undefined,
        startTime: formData.startTime || undefined,
        setEndDate: formData.setEndDate,
        endDate: formData.endDate || undefined,
        endTime: formData.endTime || undefined,
        status: 'active' as const,
        targetCustomerSegmentIds: selectedSegmentIds,
        targetCustomerIds: selectedCustomerIds,
      };

      const res = await createDiscount(payload);
      if (res.success) {
        navigate('/discounts');
      }
    } catch (err) {
      // handled by context error state
    }
  }, [formData, selectedSegmentIds, selectedCustomerIds, activeStoreId, createDiscount, navigate]);

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
              Amount off order
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

            {/* Discount Value Section */}
            <div className="mb-6 border border-gray-200 p-4 bg-white/95">
              <h2 className="text-base font-medium mb-3 text-gray-900">Discount value</h2>
              
              <fieldset className="mb-3">
                <legend className="text-xs text-gray-600 mb-1.5">Discount Type</legend>
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
                <div className="mt-3">
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
                  <p className="mt-1 text-xs text-gray-600">Enter the percentage discount to apply</p>
                </div>
              )}

              {formData.valueType === 'fixed-amount' && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Fixed amount
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
                  <p className="mt-1 text-xs text-gray-600">Enter the fixed amount discount in rupees</p>
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
                    Eligible product discounts will apply first.
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
                    All eligible order discounts will apply.
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
                    The largest eligible shipping discount will apply in addition to eligible order discounts.
                  </p>
                )}
              </div>

              {(formData.productDiscounts || formData.orderDiscounts || formData.shippingDiscounts) && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200">
                  <p className="text-xs text-yellow-800 font-medium">
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

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-3 py-1.5 text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
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

export default AmountOffOrderPage;
