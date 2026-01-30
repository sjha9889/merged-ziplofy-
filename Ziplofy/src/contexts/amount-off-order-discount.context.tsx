import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { axiosi } from '../config/axios.config';

export type AOO_Method = 'discount-code' | 'automatic';
export type AOO_ValueType = 'percentage' | 'fixed-amount';
export type AOO_Eligibility = 'all-customers' | 'specific-customer-segments' | 'specific-customers';
export type AOO_MinimumPurchase = 'no-requirements' | 'minimum-amount' | 'minimum-quantity';

// Lite populated types from server for eligibility
interface CustomerSegmentLite { _id: string; name: string; }
interface CustomerLite { _id: string; firstName?: string; lastName?: string; email?: string; }

export interface AmountOffOrderDiscount {
  _id: string;
  storeId: string;

  method: AOO_Method;
  discountCode?: string;
  title?: string;

  valueType: AOO_ValueType;
  percentage?: number;
  fixedAmount?: number;

  eligibility: AOO_Eligibility;
  applyOnPOSPro?: boolean;

  minimumPurchase?: AOO_MinimumPurchase;
  minimumAmount?: number;
  minimumQuantity?: number;

  productDiscounts?: boolean;
  orderDiscounts?: boolean;
  shippingDiscounts?: boolean;

  allowDiscountOnChannels?: boolean;
  limitTotalUses?: boolean;
  totalUsesLimit?: number;
  limitOneUsePerCustomer?: boolean;

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

export interface CreateAmountOffOrderRequest {
  storeId: string;

  method: AOO_Method;
  discountCode?: string;
  title?: string;

  valueType: AOO_ValueType;
  percentage?: number;
  fixedAmount?: number;

  eligibility: AOO_Eligibility;
  applyOnPOSPro?: boolean;

  minimumPurchase?: AOO_MinimumPurchase;
  minimumAmount?: number;
  minimumQuantity?: number;

  productDiscounts?: boolean;
  orderDiscounts?: boolean;
  shippingDiscounts?: boolean;

  allowDiscountOnChannels?: boolean;
  limitTotalUses?: boolean;
  totalUsesLimit?: number;
  limitOneUsePerCustomer?: boolean;

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

export interface CreateAmountOffOrderResponse {
  success: boolean;
  message: string;
  data: AmountOffOrderDiscount;
}

export interface FetchAmountOffOrderResponse {
  success: boolean;
  data: AmountOffOrderDiscount[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface AmountOffOrderContextType {
  discounts: AmountOffOrderDiscount[];
  loading: boolean;
  error: string | null;
  pagination: FetchAmountOffOrderResponse['pagination'] | null;

  createDiscount: (payload: CreateAmountOffOrderRequest) => Promise<CreateAmountOffOrderResponse>;
  fetchDiscountsByStoreId: (storeId: string, opts?: { page?: number; limit?: number; status?: 'active' | 'draft'; method?: AOO_Method; }) => Promise<FetchAmountOffOrderResponse>;
  clearError: () => void;
  setDiscounts: (items: AmountOffOrderDiscount[]) => void;
}

const AmountOffOrderContext = createContext<AmountOffOrderContextType | undefined>(undefined);

export const AmountOffOrderDiscountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [discounts, setDiscounts] = useState<AmountOffOrderDiscount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<FetchAmountOffOrderResponse['pagination'] | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const createDiscount = useCallback(async (payload: CreateAmountOffOrderRequest): Promise<CreateAmountOffOrderResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.post<CreateAmountOffOrderResponse>('/amount-off-order-discounts', payload);
      if (res.data?.success && res.data?.data) {
        setDiscounts(prev => [res.data.data, ...prev]);
      }
      return res.data;
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Failed to create Amount Off Order discount';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscountsByStoreId = useCallback(async (storeId: string, opts?: { page?: number; limit?: number; status?: 'active' | 'draft'; method?: AOO_Method; }): Promise<FetchAmountOffOrderResponse> => {
    try {
      setLoading(true);
      setError(null);
      const q = new URLSearchParams();
      if (opts?.page) q.append('page', String(opts.page));
      if (opts?.limit) q.append('limit', String(opts.limit));
      if (opts?.status) q.append('status', opts.status);
      if (opts?.method) q.append('method', opts.method);
      const res = await axiosi.get<FetchAmountOffOrderResponse>(`/amount-off-order-discounts/store/${storeId}${q.toString() ? `?${q.toString()}` : ''}`);
      if (res.data?.success) {
        setDiscounts(res.data.data || []);
        setPagination(res.data.pagination || null);
      }
      return res.data;
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Failed to fetch Amount Off Order discounts';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AmountOffOrderContextType>(() => ({
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
    <AmountOffOrderContext.Provider value={value}>{children}</AmountOffOrderContext.Provider>
  );
};

export const useAmountOffOrderDiscount = (): AmountOffOrderContextType => {
  const ctx = useContext(AmountOffOrderContext);
  if (!ctx) throw new Error('useAmountOffOrderDiscount must be used within an AmountOffOrderDiscountProvider');
  return ctx;
};

export default AmountOffOrderContext;
