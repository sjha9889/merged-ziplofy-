import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { axiosi } from '../config/axios.config';

export type FS_Method = 'discount-code' | 'automatic';
export type FS_Eligibility = 'all-customers' | 'specific-customer-segments' | 'specific-customers';
export type FS_MinimumPurchase = 'no-requirements' | 'minimum-amount' | 'minimum-quantity';
export type FS_CountrySelection = 'all-countries' | 'selected-countries';

interface CustomerSegmentLite { _id: string; name: string; }
interface CustomerLite { _id: string; firstName?: string; lastName?: string; email?: string; }

export interface FreeShippingDiscount {
	_id: string;
	storeId: string;

	// Method
	method: FS_Method;
	discountCode?: string;
	title?: string;

	// Country
	countrySelection: FS_CountrySelection;
	selectedCountryCodes?: string[];
	excludeShippingRates?: boolean;
	shippingRateLimit?: number;

	// Eligibility
	eligibility: FS_Eligibility;
	applyOnPOSPro?: boolean;

	// Minimum purchase
	minimumPurchase: FS_MinimumPurchase;
	minimumAmount?: number;
	minimumQuantity?: number;

	// Sales channel & limits (discount code only)
	allowDiscountOnChannels?: boolean;
	limitTotalUses?: boolean;
	totalUsesLimit?: number;
	limitOneUsePerCustomer?: boolean;

	// Combinations
	productDiscounts?: boolean;
	orderDiscounts?: boolean;

	// Active dates
	startDate?: string;
	startTime?: string;
	setEndDate?: boolean;
	endDate?: string;
	endTime?: string;

	status?: 'active' | 'draft';
	createdAt?: string;
	updatedAt?: string;

	// Populated eligibility targets (or ids)
	targetCustomerSegmentIds?: (string | CustomerSegmentLite)[];
	targetCustomerIds?: (string | CustomerLite)[];
}

export interface CreateFreeShippingRequest {
	storeId: string;

	method: FS_Method;
	discountCode?: string;
	title?: string;

	countrySelection: FS_CountrySelection;
	selectedCountryCodes?: string[];
	excludeShippingRates?: boolean;
	shippingRateLimit?: number;

	eligibility: FS_Eligibility;
	applyOnPOSPro?: boolean;

	minimumPurchase: FS_MinimumPurchase;
	minimumAmount?: number;
	minimumQuantity?: number;

	allowDiscountOnChannels?: boolean;
	limitTotalUses?: boolean;
	totalUsesLimit?: number;
	limitOneUsePerCustomer?: boolean;

	productDiscounts?: boolean;
	orderDiscounts?: boolean;

	startDate?: string;
	startTime?: string;
	setEndDate?: boolean;
	endDate?: string;
	endTime?: string;

	status?: 'active' | 'draft';

	// Eligibility targets
	targetCustomerSegmentIds?: string[];
	targetCustomerIds?: string[];
}

export interface CreateFreeShippingResponse {
	success: boolean;
	message: string;
	data: FreeShippingDiscount;
}

export interface FetchFreeShippingResponse {
	success: boolean;
	data: FreeShippingDiscount[];
	pagination: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
	};
}

interface FreeShippingContextType {
	discounts: FreeShippingDiscount[];
	loading: boolean;
	error: string | null;
	pagination: FetchFreeShippingResponse['pagination'] | null;

	createDiscount: (payload: CreateFreeShippingRequest) => Promise<CreateFreeShippingResponse>;
	fetchDiscountsByStoreId: (storeId: string, opts?: { page?: number; limit?: number; status?: 'active' | 'draft'; method?: FS_Method; }) => Promise<FetchFreeShippingResponse>;
	clearError: () => void;
	setDiscounts: (items: FreeShippingDiscount[]) => void;
}

const FreeShippingContext = createContext<FreeShippingContextType | undefined>(undefined);

export const FreeShippingDiscountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [discounts, setDiscounts] = useState<FreeShippingDiscount[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<FetchFreeShippingResponse['pagination'] | null>(null);

	const clearError = useCallback(() => setError(null), []);

	const createDiscount = useCallback(async (payload: CreateFreeShippingRequest): Promise<CreateFreeShippingResponse> => {
		try {
			setLoading(true);
			setError(null);
			const res = await axiosi.post<CreateFreeShippingResponse>('/free-shipping-discounts', payload);
			if (res.data?.success && res.data?.data) {
				setDiscounts(prev => [res.data.data, ...prev]);
			}
			return res.data;
		} catch (e: any) {
			const msg = e?.response?.data?.error || e?.message || 'Failed to create Free Shipping discount';
			setError(msg);
			throw new Error(msg);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchDiscountsByStoreId = useCallback(async (storeId: string, opts?: { page?: number; limit?: number; status?: 'active' | 'draft'; method?: FS_Method; }): Promise<FetchFreeShippingResponse> => {
		try {
			setLoading(true);
			setError(null);
			const q = new URLSearchParams();
			if (opts?.page) q.append('page', String(opts.page));
			if (opts?.limit) q.append('limit', String(opts.limit));
			if (opts?.status) q.append('status', opts.status);
			if (opts?.method) q.append('method', opts.method);
			const res = await axiosi.get<FetchFreeShippingResponse>(`/free-shipping-discounts/store/${storeId}${q.toString() ? `?${q.toString()}` : ''}`);
			if (res.data?.success) {
				setDiscounts(res.data.data || []);
				setPagination(res.data.pagination || null);
			}
			return res.data;
		} catch (e: any) {
			const msg = e?.response?.data?.error || e?.message || 'Failed to fetch Free Shipping discounts';
			setError(msg);
			throw new Error(msg);
		} finally {
			setLoading(false);
		}
	}, []);

	const value = useMemo<FreeShippingContextType>(() => ({
		discounts,
		loading,
		error,
		pagination,
		createDiscount,
		fetchDiscountsByStoreId,
		clearError,
		setDiscounts,
	}), [discounts, loading, error, pagination, createDiscount, fetchDiscountsByStoreId, clearError]);

	return (
		<FreeShippingContext.Provider value={value}>{children}</FreeShippingContext.Provider>
	);
};

export const useFreeShippingDiscount = (): FreeShippingContextType => {
	const ctx = useContext(FreeShippingContext);
	if (!ctx) throw new Error('useFreeShippingDiscount must be used within a FreeShippingDiscountProvider');
	return ctx;
};

export default FreeShippingContext;
