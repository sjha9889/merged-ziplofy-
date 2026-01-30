import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DiscountDetailsHeader from '../../components/DiscountDetailsHeader';
import DiscountNotFound from '../../components/DiscountNotFound';
import BuyXGetYSummaryCard from '../../components/BuyXGetYSummaryCard';
import BuyXGetYTargetsCard from '../../components/BuyXGetYTargetsCard';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useBuyXGetYDiscount } from '../../contexts/buy-x-get-y-discount.context';

const BuyXGetYDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { discounts } = useBuyXGetYDiscount();

  const discount = useMemo(() => discounts.find(d => d._id === id), [discounts, id]);

  const handleBack = useCallback(() => {
    navigate('/discounts');
  }, [navigate]);

  if (!discount) {
    return (
      <GridBackgroundWrapper>
        <DiscountNotFound />
      </GridBackgroundWrapper>
    );
  }

  const value = discount.discountedValue === 'percentage'
    ? `${discount.discountedPercentage ?? 0}%`
    : discount.discountedValue === 'amount'
      ? `₹${discount.discountedAmount ?? 0}`
      : 'Free';

  // Normalize targets for display
  const buysProducts = (discount.buysProductIds || []).map((p: any) => typeof p === 'string' ? { _id: p, title: p } : { _id: p._id, title: p.title || p._id });
  const buysCollections = (discount.buysCollectionIds || []).map((c: any) => typeof c === 'string' ? { _id: c, title: c } : { _id: c._id, title: c.title || c._id });
  const getsProducts = (discount.getsProductIds || []).map((p: any) => typeof p === 'string' ? { _id: p, title: p } : { _id: p._id, title: p.title || p._id });
  const getsCollections = (discount.getsCollectionIds || []).map((c: any) => typeof c === 'string' ? { _id: c, title: c } : { _id: c._id, title: c.title || c._id });
  const segments = (discount.targetCustomerSegmentIds || []).map((s: any) => typeof s === 'string' ? { _id: s, name: s } : { _id: s._id, name: s.name || s._id });
  const customers = (discount.targetCustomerIds || []).map((c: any) => typeof c === 'string' ? { _id: c, name: c } : { _id: c._id, name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email || c._id });

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex flex-col gap-4">
            {/* Header Card */}
            <DiscountDetailsHeader
              method={discount.method}
              discountCode={discount.discountCode}
              title={discount.title}
              value={value}
              status={discount.status}
              onBack={handleBack}
            />

            {/* Summary Card */}
            <BuyXGetYSummaryCard
              customerBuys={discount.customerBuys}
              quantity={discount.quantity}
              amount={discount.amount}
              anyItemsFrom={discount.anyItemsFrom}
              customerGetsQuantity={discount.customerGetsQuantity}
              customerGetsAnyItemsFrom={discount.customerGetsAnyItemsFrom}
              value={value}
              eligibility={discount.eligibility}
              allowDiscountOnChannels={discount.allowDiscountOnChannels}
              limitTotalUses={discount.limitTotalUses}
              totalUsesLimit={discount.totalUsesLimit}
              limitOneUsePerCustomer={discount.limitOneUsePerCustomer}
              productDiscounts={discount.productDiscounts}
              orderDiscounts={discount.orderDiscounts}
              shippingDiscounts={discount.shippingDiscounts}
              startDate={discount.startDate}
              startTime={discount.startTime}
              setEndDate={discount.setEndDate}
              endDate={discount.endDate}
              endTime={discount.endTime}
              createdAt={discount.createdAt}
              updatedAt={discount.updatedAt}
            />

            {/* Targets Card */}
            <BuyXGetYTargetsCard
              buysProducts={buysProducts}
              buysCollections={buysCollections}
              getsProducts={getsProducts}
              getsCollections={getsCollections}
              segments={segments}
              customers={customers}
            />
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default BuyXGetYDetailsPage;
