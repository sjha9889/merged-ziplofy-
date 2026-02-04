import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { axiosi } from '../config/axios.config';

// Types
export interface FreeShippingDiscount {
  id: string;
  method: 'automatic' | 'discount-code';
  discountCode?: string;
  title?: string;
  message: string;
  countrySelection: 'all-countries' | 'selected-countries';
  selectedCountryCodes?: string[];
  excludeShippingRates: boolean;
  shippingRateLimit?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  country: string;
  state?: string;
  city?: string;
}

export interface CheckEligibleFreeShippingRequest {
  storeId: string;
  customerId: string;
  cartItems: CartItem[];
  shippingAddress?: ShippingAddress;
  currentShippingRate?: number;
}

export interface ValidateFreeShippingCodeRequest {
  storeId: string;
  customerId: string;
  cartItems: CartItem[];
  discountCode: string;
  shippingAddress?: ShippingAddress;
  currentShippingRate?: number;
}

export interface FreeShippingContextType {
  // State
  eligibleDiscounts: FreeShippingDiscount[];
  discountCodeResult: FreeShippingDiscount | null;
  loading: boolean;
  error: string | null;
  discountCodeLoading: boolean;
  discountCodeError: string | null;

  // Functions
  checkEligibleFreeShippingDiscounts: (request: CheckEligibleFreeShippingRequest) => Promise<void>;
  validateFreeShippingDiscountCode: (request: ValidateFreeShippingCodeRequest) => Promise<void>;
  clearDiscountCodeResult: () => void;
  clearError: () => void;
}

const FreeShippingContext = createContext<FreeShippingContextType | undefined>(undefined);

export const useFreeShipping = () => {
  const context = useContext(FreeShippingContext);
  if (context === undefined) {
    throw new Error('useFreeShipping must be used within a FreeShippingProvider');
  }
  return context;
};

interface FreeShippingProviderProps {
  children: ReactNode;
}

export const FreeShippingProvider: React.FC<FreeShippingProviderProps> = ({ children }) => {
  // State
  const [eligibleDiscounts, setEligibleDiscounts] = useState<FreeShippingDiscount[]>([]);
  const [discountCodeResult, setDiscountCodeResult] = useState<FreeShippingDiscount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCodeLoading, setDiscountCodeLoading] = useState(false);
  const [discountCodeError, setDiscountCodeError] = useState<string | null>(null);

  // Check eligible free shipping discounts (automatic)
  const checkEligibleFreeShippingDiscounts = async (request: CheckEligibleFreeShippingRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosi.post('/storefront/discounts/free-shipping/check', request);

      if (response.data.success) {
        setEligibleDiscounts(response.data.data.eligibleDiscounts || []);
      } else {
        setError(response.data.message || 'Failed to fetch eligible discounts');
        setEligibleDiscounts([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch eligible discounts';
      setError(errorMessage);
      setEligibleDiscounts([]);
      console.error('Error checking eligible free shipping discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Validate free shipping discount code
  const validateFreeShippingDiscountCode = async (request: ValidateFreeShippingCodeRequest) => {
    try {
      setDiscountCodeLoading(true);
      setDiscountCodeError(null);

      const response = await axiosi.post('/storefront/discounts/free-shipping/validate-code', request);

      if (response.data.success) {
        setDiscountCodeResult(response.data.data.discount);
      } else {
        setDiscountCodeError(response.data.message || 'Invalid discount code');
        setDiscountCodeResult(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid discount code';
      setDiscountCodeError(errorMessage);
      setDiscountCodeResult(null);
      console.error('Error validating free shipping discount code:', err);
    } finally {
      setDiscountCodeLoading(false);
    }
  };

  // Clear discount code result
  const clearDiscountCodeResult = () => {
    setDiscountCodeResult(null);
    setDiscountCodeError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value: FreeShippingContextType = {
    // State
    eligibleDiscounts,
    discountCodeResult,
    loading,
    error,
    discountCodeLoading,
    discountCodeError,

    // Functions
    checkEligibleFreeShippingDiscounts,
    validateFreeShippingDiscountCode,
    clearDiscountCodeResult,
    clearError,
  };

  return (
    <FreeShippingContext.Provider value={value}>
      {children}
    </FreeShippingContext.Provider>
  );
};
