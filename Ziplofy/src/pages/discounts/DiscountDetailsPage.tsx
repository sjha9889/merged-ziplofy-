import { useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAmountOffProductsDiscount } from "../../contexts/amount-off-products-discount.context";
import DiscountNotFound from "../../components/DiscountNotFound";
import DiscountDetailsHeader from "../../components/DiscountDetailsHeader";
import DiscountSummaryCard from "../../components/DiscountSummaryCard";
import DiscountValueLimitsCard from "../../components/DiscountValueLimitsCard";
import DiscountActiveDatesCard from "../../components/DiscountActiveDatesCard";
import DiscountTargetsCard from "../../components/DiscountTargetsCard";
import GridBackgroundWrapper from "../../components/GridBackgroundWrapper";

const DiscountDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { discounts } = useAmountOffProductsDiscount();

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

  const value = discount.valueType === 'percentage' ? `${discount.percentage ?? 0}%` : `₹${discount.fixedAmount ?? 0}`;

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
            <DiscountSummaryCard
              appliesTo={discount.appliesTo}
              eligibility={discount.eligibility}
              minimumPurchase={discount.minimumPurchase}
              minimumQuantity={discount.minimumQuantity}
            />

            {/* Value & Limits Card */}
            <DiscountValueLimitsCard
              valueType={discount.valueType}
              value={value}
              oncePerOrder={discount.oncePerOrder}
              allowDiscountOnChannels={discount.allowDiscountOnChannels}
              limitTotalUses={discount.limitTotalUses}
              totalUsesLimit={discount.totalUsesLimit}
              limitOneUsePerCustomer={discount.limitOneUsePerCustomer}
              productDiscounts={discount.productDiscounts}
              orderDiscounts={discount.orderDiscounts}
              shippingDiscounts={discount.shippingDiscounts}
            />

            {/* Active Dates Card */}
            <DiscountActiveDatesCard
              startDate={discount.startDate}
              startTime={discount.startTime}
              setEndDate={discount.setEndDate}
              endDate={discount.endDate}
              endTime={discount.endTime}
              createdAt={discount.createdAt}
              updatedAt={discount.updatedAt}
            />

            {/* Targets Card */}
            <DiscountTargetsCard
              targetProductDetails={discount.targetProductDetails}
              targetProductIds={discount.targetProductIds}
              targetCollectionDetails={discount.targetCollectionDetails}
              targetCollectionIds={discount.targetCollectionIds}
              targetCustomerSegmentDetails={discount.targetCustomerSegmentDetails}
              targetCustomerSegmentIds={discount.targetCustomerSegmentIds}
              targetCustomerDetails={discount.targetCustomerDetails}
              targetCustomerIds={discount.targetCustomerIds}
            />
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default DiscountDetailsPage;
