import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DiscountNotFound from '../../components/DiscountNotFound';
import DiscountDetailsHeader from '../../components/DiscountDetailsHeader';
import FreeShippingGeneralInfoCard from '../../components/FreeShippingGeneralInfoCard';
import FreeShippingCountryRatesCard from '../../components/FreeShippingCountryRatesCard';
import FreeShippingMinimumPurchaseCard from '../../components/FreeShippingMinimumPurchaseCard';
import FreeShippingSalesChannelLimitsCard from '../../components/FreeShippingSalesChannelLimitsCard';
import FreeShippingCombinationsCard from '../../components/FreeShippingCombinationsCard';
import FreeShippingActiveDatesCard from '../../components/FreeShippingActiveDatesCard';
import FreeShippingTargetSegmentsCard from '../../components/FreeShippingTargetSegmentsCard';
import FreeShippingTargetCustomersCard from '../../components/FreeShippingTargetCustomersCard';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useFreeShippingDiscount } from '../../contexts/free-shipping-discount.context';
import { useStore } from '../../contexts/store.context';

const FreeShippingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const { discounts, fetchDiscountsByStoreId, loading, error } = useFreeShippingDiscount();

  const discount = discounts.find(d => d._id === id);

  useEffect(() => {
    if (activeStoreId && !discounts.length) {
      fetchDiscountsByStoreId(activeStoreId);
    }
  }, [activeStoreId, discounts.length, fetchDiscountsByStoreId]);

  const handleBack = useCallback(() => {
    navigate('/discounts');
  }, [navigate]);

  const renderBoolean = useCallback((v?: boolean) => (v ? 'Yes' : 'No'), []);
  const segmentLabel = useCallback((s: any) => s?.name || s?._id, []);
  const customerLabel = useCallback((c: any) => {
    const fullName = `${c?.firstName || ''} ${c?.lastName || ''}`.trim();
    return fullName || c?.email || c?._id;
  }, []);

  if (loading) {
    return (
      <GridBackgroundWrapper>
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  if (error) {
    return (
      <GridBackgroundWrapper>
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="p-3 bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  if (!discount) {
    return (
      <GridBackgroundWrapper>
        <DiscountNotFound />
      </GridBackgroundWrapper>
    );
  }

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <DiscountDetailsHeader
              method={discount.method}
              discountCode={discount.discountCode}
              title={discount.title}
              value="Free Shipping"
              status={discount.status}
              onBack={handleBack}
            />

            {/* General Information */}
            <FreeShippingGeneralInfoCard
              method={discount.method}
              discountCode={discount.discountCode}
              title={discount.title}
              eligibility={discount.eligibility}
              applyOnPOSPro={discount.applyOnPOSPro}
              status={discount.status}
              createdAt={discount.createdAt}
              updatedAt={discount.updatedAt}
            />

            {/* Country & Rates */}
            <FreeShippingCountryRatesCard
              countrySelection={discount.countrySelection}
              selectedCountryCodes={discount.selectedCountryCodes}
              excludeShippingRates={discount.excludeShippingRates}
              shippingRateLimit={discount.shippingRateLimit}
            />

            {/* Minimum Purchase */}
            <FreeShippingMinimumPurchaseCard
              minimumPurchase={discount.minimumPurchase}
              minimumAmount={discount.minimumAmount}
              minimumQuantity={discount.minimumQuantity}
            />

            {/* Sales Channel & Limits */}
            <FreeShippingSalesChannelLimitsCard
              allowDiscountOnChannels={discount.allowDiscountOnChannels}
              limitTotalUses={discount.limitTotalUses}
              totalUsesLimit={discount.totalUsesLimit}
              limitOneUsePerCustomer={discount.limitOneUsePerCustomer}
            />

            {/* Combinations */}
            <FreeShippingCombinationsCard
              productDiscounts={discount.productDiscounts}
              orderDiscounts={discount.orderDiscounts}
            />

            {/* Active Dates */}
            <FreeShippingActiveDatesCard
              startDate={discount.startDate}
              startTime={discount.startTime}
              setEndDate={discount.setEndDate}
              endDate={discount.endDate}
              endTime={discount.endTime}
            />

            {/* Target Customer Segments */}
            {discount.targetCustomerSegmentIds && discount.targetCustomerSegmentIds.length > 0 && (
              <FreeShippingTargetSegmentsCard
                targetCustomerSegmentIds={discount.targetCustomerSegmentIds}
                segmentLabel={segmentLabel}
              />
            )}

            {/* Target Customers */}
            {discount.targetCustomerIds && discount.targetCustomerIds.length > 0 && (
              <FreeShippingTargetCustomersCard
                targetCustomerIds={discount.targetCustomerIds}
                customerLabel={customerLabel}
              />
            )}
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default FreeShippingDetailsPage;
