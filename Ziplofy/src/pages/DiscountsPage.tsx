import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TagIcon } from "@heroicons/react/24/outline";
import AmountOffOrderTable from "../components/AmountOffOrderTable";
import AmountOffProductsTable from "../components/AmountOffProductsTable";
import BuyXGetYTable from "../components/BuyXGetYTable";
import DiscountsPageHeader from "../components/DiscountsPageHeader";
import FreeShippingTable from "../components/FreeShippingTable";
import Tabs from "../components/Tabs";
import { useAmountOffOrderDiscount } from "../contexts/amount-off-order-discount.context";
import { useAmountOffProductsDiscount } from "../contexts/amount-off-products-discount.context";
import { useBuyXGetYDiscount } from "../contexts/buy-x-get-y-discount.context";
import { useFreeShippingDiscount } from "../contexts/free-shipping-discount.context";
import { useStore } from "../contexts/store.context";

const EmptyState = ({ message, onCreate }: { message: string; onCreate: () => void }) => (
  <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm min-h-[320px] flex justify-center items-center p-12">
    <div className="flex flex-col justify-center items-center text-center gap-4 max-w-md">
      <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
        <TagIcon className="w-7 h-7 text-blue-600" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm"
      >
        Create discount
      </button>
    </div>
  </div>
);

const DiscountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { discounts, error, fetchDiscountsByStoreId } = useAmountOffProductsDiscount();
  const { discounts: bxgyDiscounts, error: bxgyError, fetchDiscountsByStoreId: fetchBxgyByStoreId } = useBuyXGetYDiscount();
  const { discounts: aooDiscounts, error: aooError, fetchDiscountsByStoreId: fetchAooByStoreId } = useAmountOffOrderDiscount();
  const { discounts: fsDiscounts, error: fsError, fetchDiscountsByStoreId: fetchFsByStoreId } = useFreeShippingDiscount();
  const { activeStoreId } = useStore();
  
  const [tab, setTab] = useState<string>('amount-off-products');
 
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
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        <DiscountsPageHeader onCreateDiscount={handleCreateDiscount} />
        
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={tab} onTabChange={handleTabChange} />
        </div>

        {/* Error banner */}
        {(tab === 'amount-off-products' && error) && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {(tab === 'buy-x-get-y' && bxgyError) && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
            {bxgyError}
          </div>
        )}
        {(tab === 'amount-off-order' && aooError) && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
            {aooError}
          </div>
        )}
        {(tab === 'free-shipping' && fsError) && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
            {fsError}
          </div>
        )}

        {tab === 'amount-off-products' && discounts.length > 0 && (
          <AmountOffProductsTable discounts={discounts} />
        )}
        {tab === 'buy-x-get-y' && bxgyDiscounts.length > 0 && (
          <BuyXGetYTable discounts={bxgyDiscounts} />
        )}
        {tab === 'amount-off-order' && aooDiscounts.length > 0 && (
          <AmountOffOrderTable discounts={aooDiscounts} />
        )}
        {tab === 'free-shipping' && fsDiscounts.length > 0 && (
          <FreeShippingTable discounts={fsDiscounts} />
        )}

        {tab === 'amount-off-products' && discounts.length === 0 && (
          <EmptyState message="No amount off products discount yet" onCreate={handleCreateDiscount} />
        )}
        {tab === 'buy-x-get-y' && bxgyDiscounts.length === 0 && (
          <EmptyState message="No buy x get y discounts yet" onCreate={handleCreateDiscount} />
        )}
        {tab === 'amount-off-order' && aooDiscounts.length === 0 && (
          <EmptyState message="No amount off order discounts yet" onCreate={handleCreateDiscount} />
        )}
        {tab === 'free-shipping' && fsDiscounts.length === 0 && (
          <EmptyState message="No free shipping discounts yet" onCreate={handleCreateDiscount} />
        )}
      </div>
    </div>
  );
};

export default DiscountsPage;
