import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AmountOffOrderTable from "../components/AmountOffOrderTable";
import AmountOffProductsTable from "../components/AmountOffProductsTable";
import BuyXGetYTable from "../components/BuyXGetYTable";
import DiscountsPageHeader from "../components/DiscountsPageHeader";
import FreeShippingTable from "../components/FreeShippingTable";
import GridBackgroundWrapper from "../components/GridBackgroundWrapper";
import Tabs from "../components/Tabs";
import { useAmountOffOrderDiscount } from "../contexts/amount-off-order-discount.context";
import { useAmountOffProductsDiscount } from "../contexts/amount-off-products-discount.context";
import { useBuyXGetYDiscount } from "../contexts/buy-x-get-y-discount.context";
import { useFreeShippingDiscount } from "../contexts/free-shipping-discount.context";
import { useStore } from "../contexts/store.context";

const DiscountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { discounts, error, fetchDiscountsByStoreId } = useAmountOffProductsDiscount();
  const { discounts: bxgyDiscounts, loading: bxgyLoading, error: bxgyError, fetchDiscountsByStoreId: fetchBxgyByStoreId } = useBuyXGetYDiscount();
  const { discounts: aooDiscounts, loading: aooLoading, error: aooError, fetchDiscountsByStoreId: fetchAooByStoreId } = useAmountOffOrderDiscount();
  const { discounts: fsDiscounts, loading: fsLoading, error: fsError, fetchDiscountsByStoreId: fetchFsByStoreId } = useFreeShippingDiscount();
  const { activeStoreId } = useStore();
  
  // Tab state: amount-off-products | buy-x-get-y | amount-off-order | free-shipping
  const [tab, setTab] = useState<string>('amount-off-products');
 
  // Initial load based on default tab
  useEffect(() => {
    const load = async () => {
      if (!activeStoreId) return;
      try {
        if (tab === 'amount-off-products') {
          await fetchDiscountsByStoreId(activeStoreId, { page: 1, limit: 10 });
        } else if (tab === 'buy-x-get-y') {
          await fetchBxgyByStoreId(activeStoreId, { page: 1, limit: 10 });
        } else if (tab === 'amount-off-order') {
          await fetchAooByStoreId(activeStoreId, { page: 1, limit: 10 });
        } else if (tab === 'free-shipping') {
          await fetchFsByStoreId(activeStoreId, { page: 1, limit: 10 });
        }
      } catch {}
    };
    load();
  }, [activeStoreId, tab, fetchDiscountsByStoreId, fetchBxgyByStoreId, fetchAooByStoreId, fetchFsByStoreId]);
 
  const handleCreateDiscount = useCallback(() => {
    navigate("/discounts/select-discount-to-create");
  }, [navigate]);


  const handleTabChange = useCallback((newTab: string) => {
    setTab(newTab);
  }, []);

  const tabs = [
    { id: 'amount-off-products', label: 'Amount off products' },
    { id: 'buy-x-get-y', label: 'Buy X Get Y' },
    { id: 'amount-off-order', label: 'Amount off order' },
    { id: 'free-shipping', label: 'Free shipping' },
  ];

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Page Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <DiscountsPageHeader onCreateDiscount={handleCreateDiscount} />
            <div className="mt-3">
              <Tabs
                tabs={tabs}
                activeTab={tab}
                onTabChange={handleTabChange}
              />
            </div>
          </div>
        </div>

        {/* Error banner */}
        {(tab === 'amount-off-products' && error) && (
          <div className="max-w-7xl mx-auto mt-3 px-4">
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-sm">
              {error}
            </div>
          </div>
        )}
        {(tab === 'buy-x-get-y' && bxgyError) && (
          <div className="max-w-7xl mx-auto mt-3 px-4">
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-sm">
              {bxgyError}
            </div>
          </div>
        )}
        {(tab === 'amount-off-order' && aooError) && (
          <div className="max-w-7xl mx-auto mt-3 px-4">
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-sm">
              {aooError}
            </div>
          </div>
        )}
        {(tab === 'free-shipping' && fsError) && (
          <div className="max-w-7xl mx-auto mt-3 px-4">
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-sm">
              {fsError}
            </div>
          </div>
        )}

      {/* Amount Off Products Table */}
      {tab === 'amount-off-products' && discounts.length > 0 && (
        <AmountOffProductsTable discounts={discounts} />
      )}

      {/* Buy X Get Y Table */}
      {tab === 'buy-x-get-y' && bxgyDiscounts.length > 0 && (
        <BuyXGetYTable discounts={bxgyDiscounts} />
      )}

      {/* Amount Off Order Table */}
      {tab === 'amount-off-order' && aooDiscounts.length > 0 && (
        <AmountOffOrderTable discounts={aooDiscounts} />
      )}

      {/* Free Shipping Table */}
      {tab === 'free-shipping' && fsDiscounts.length > 0 && (
        <FreeShippingTable discounts={fsDiscounts} />
      )}

        {/* Empty State Content */}
        {tab === 'amount-off-products' && discounts.length === 0 && (
          <div className="max-w-7xl mx-auto py-6 px-4">
            <p className="text-sm text-gray-600">No amount off products discount yet</p>
          </div>
        )}

        {tab === 'buy-x-get-y' && bxgyDiscounts.length === 0 && (
          <div className="max-w-7xl mx-auto py-6 px-4">
            <p className="text-sm text-gray-600">No buy x get y discounts yet</p>
          </div>
        )}

        {tab === 'amount-off-order' && aooDiscounts.length === 0 && (
          <div className="max-w-7xl mx-auto py-6 px-4">
            <p className="text-sm text-gray-600">No amount off order discounts yet</p>
          </div>
        )}

        {tab === 'free-shipping' && fsDiscounts.length === 0 && (
          <div className="max-w-7xl mx-auto py-6 px-4">
            <p className="text-sm text-gray-600">No free shipping discounts yet</p>
          </div>
        )}
      </div>
    </GridBackgroundWrapper>
  );
};

export default DiscountsPage;
