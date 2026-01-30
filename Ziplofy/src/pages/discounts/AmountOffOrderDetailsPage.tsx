import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAmountOffOrderDiscount } from "../../contexts/amount-off-order-discount.context";
import { useStore } from "../../contexts/store.context";
import DiscountNotFound from "../../components/DiscountNotFound";
import DiscountDetailsHeader from "../../components/DiscountDetailsHeader";
import ChipList from "../../components/ChipList";
import GridBackgroundWrapper from "../../components/GridBackgroundWrapper";

const AmountOffOrderDetailsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { activeStoreId } = useStore();
	const { discounts, fetchDiscountsByStoreId, loading, error } = useAmountOffOrderDiscount();

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
	const customerSegmentLabel = useCallback((s: any) => s?.name || s?._id, []);
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

	const targetCustomerSegmentDetails = (discount as any).targetCustomerSegmentDetails || [];
	const targetCustomerDetails = (discount as any).targetCustomerDetails || [];

	const value = discount.valueType === 'percentage' 
		? `${discount.percentage ?? 0}%` 
		: `₹${discount.fixedAmount ?? 0}`;

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
							value={value}
							status={discount.status}
							onBack={handleBack}
						/>

						{/* General Information */}
						<div className="bg-white border border-gray-200 p-4">
							<h2 className="text-base font-medium mb-3 text-gray-900">General Information</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div>
									<p className="text-xs text-gray-600 mb-1">Method</p>
									<p className="text-sm text-gray-900">{discount.method}</p>
								</div>
								{discount.method === 'discount-code' && (
									<div>
										<p className="text-xs text-gray-600 mb-1">Code</p>
										<p className="text-sm text-gray-900">{discount.discountCode}</p>
									</div>
								)}
								{discount.method === 'automatic' && (
									<div>
										<p className="text-xs text-gray-600 mb-1">Title</p>
										<p className="text-sm text-gray-900">{discount.title}</p>
									</div>
								)}
								<div>
									<p className="text-xs text-gray-600 mb-1">Value Type</p>
									<p className="text-sm text-gray-900">{discount.valueType}</p>
								</div>
								{discount.valueType === 'percentage' && (
									<div>
										<p className="text-xs text-gray-600 mb-1">Percentage</p>
										<p className="text-sm text-gray-900">{discount.percentage}%</p>
									</div>
								)}
								{discount.valueType === 'fixed-amount' && (
									<div>
										<p className="text-xs text-gray-600 mb-1">Fixed Amount</p>
										<p className="text-sm text-gray-900">₹{discount.fixedAmount}</p>
									</div>
								)}
								<div>
									<p className="text-xs text-gray-600 mb-1">Eligibility</p>
									<p className="text-sm text-gray-900">{discount.eligibility}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Status</p>
									<p className="text-sm text-gray-900">{discount.status}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Created At</p>
									<p className="text-sm text-gray-900">{new Date(discount.createdAt).toLocaleDateString()}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Last Updated</p>
									<p className="text-sm text-gray-900">{new Date(discount.updatedAt).toLocaleDateString()}</p>
								</div>
							</div>
						</div>

						{/* Usage & Channel */}
						<div className="bg-white border border-gray-200 p-4">
							<h2 className="text-base font-medium mb-3 text-gray-900">Usage & Channel Limits</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div>
									<p className="text-xs text-gray-600 mb-1">Allow on Channels</p>
									<p className="text-sm text-gray-900">{renderBoolean(discount.allowDiscountOnChannels)}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Limit Total Uses</p>
									<p className="text-sm text-gray-900">{renderBoolean(discount.limitTotalUses)}</p>
								</div>
								{discount.limitTotalUses && (
									<div>
										<p className="text-xs text-gray-600 mb-1">Total Uses Limit</p>
										<p className="text-sm text-gray-900">{discount.totalUsesLimit}</p>
									</div>
								)}
								<div>
									<p className="text-xs text-gray-600 mb-1">One Use Per Customer</p>
									<p className="text-sm text-gray-900">{renderBoolean(discount.limitOneUsePerCustomer)}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Apply on POS Pro</p>
									<p className="text-sm text-gray-900">{renderBoolean(discount.applyOnPOSPro)}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Once Per Order</p>
									<p className="text-sm text-gray-900">{renderBoolean(discount.oncePerOrder)}</p>
								</div>
							</div>
						</div>

						{/* Minimum Purchase */}
						<div className="bg-white border border-gray-200 p-4">
							<h2 className="text-base font-medium mb-3 text-gray-900">Minimum Purchase</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div>
									<p className="text-xs text-gray-600 mb-1">Requirement</p>
									<p className="text-sm text-gray-900">{discount.minimumPurchase}</p>
								</div>
								{discount.minimumPurchase === 'minimum-amount' && (
									<div>
										<p className="text-xs text-gray-600 mb-1">Amount</p>
										<p className="text-sm text-gray-900">₹{discount.minimumAmount}</p>
									</div>
								)}
								{discount.minimumPurchase === 'minimum-quantity' && (
									<div>
										<p className="text-xs text-gray-600 mb-1">Quantity</p>
										<p className="text-sm text-gray-900">{discount.minimumQuantity}</p>
									</div>
								)}
							</div>
						</div>

						{/* Combinations */}
						<div className="bg-white border border-gray-200 p-4">
							<h2 className="text-base font-medium mb-3 text-gray-900">Combinations</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div>
									<p className="text-xs text-gray-600 mb-1">Product Discounts</p>
									<p className="text-sm text-gray-900">{renderBoolean(discount.productDiscounts)}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Order Discounts</p>
									<p className="text-sm text-gray-900">{renderBoolean(discount.orderDiscounts)}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Shipping Discounts</p>
									<p className="text-sm text-gray-900">{renderBoolean(discount.shippingDiscounts)}</p>
								</div>
							</div>
						</div>

						{/* Active Dates */}
						<div className="bg-white border border-gray-200 p-4">
							<h2 className="text-base font-medium mb-3 text-gray-900">Active Dates</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div>
									<p className="text-xs text-gray-600 mb-1">Start Date</p>
									<p className="text-sm text-gray-900">{discount.startDate} {discount.startTime ? `at ${discount.startTime}` : ''}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Set End Date</p>
									<p className="text-sm text-gray-900">{renderBoolean(discount.setEndDate)}</p>
								</div>
								{discount.setEndDate && (
									<div>
										<p className="text-xs text-gray-600 mb-1">End Date</p>
										<p className="text-sm text-gray-900">{discount.endDate} {discount.endTime ? `at ${discount.endTime}` : ''}</p>
									</div>
								)}
							</div>
						</div>

						{/* Eligibility: Customer Segments */}
						{Array.isArray(targetCustomerSegmentDetails) && targetCustomerSegmentDetails.length > 0 && (
							<div className="bg-white border border-gray-200 p-4">
								<h2 className="text-base font-medium mb-3 text-gray-900">Target Customer Segments</h2>
								<ChipList items={targetCustomerSegmentDetails.map((s: any, idx: number) => ({
									key: s?._id || idx.toString(),
									label: customerSegmentLabel(s)
								}))} />
							</div>
						)}

						{/* Eligibility: Customers */}
						{Array.isArray(targetCustomerDetails) && targetCustomerDetails.length > 0 && (
							<div className="bg-white border border-gray-200 p-4">
								<h2 className="text-base font-medium mb-3 text-gray-900">Target Customers</h2>
								<ChipList items={targetCustomerDetails.map((c: any, idx: number) => ({
									key: c?._id || idx.toString(),
									label: customerLabel(c)
								}))} />
							</div>
						)}
					</div>
				</div>
			</div>
		</GridBackgroundWrapper>
	);
};

export default AmountOffOrderDetailsPage;
