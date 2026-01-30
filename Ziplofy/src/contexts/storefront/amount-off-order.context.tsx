import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { axiosi } from '../../config/axios.config';

// Types
interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface AmountOffOrderDiscount {
  id: string;
  method: string;
  discountCode?: string;
  title?: string;
  valueType: 'percentage' | 'fixed-amount';
  percentage?: number;
  fixedAmount?: number;
  discountAmount: number;
  message: string;
}

interface AmountOffOrderResponse {
  success: boolean;
  data: {
    eligibleDiscounts: AmountOffOrderDiscount[];
    cartTotal: number;
    totalQuantity: number;
  };
  message: string;
}

interface AmountOffOrderContextType {
  // State
  eligibleDiscounts: AmountOffOrderDiscount[];
  cartTotal: number;
  totalQuantity: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchEligibleDiscounts: (storeId: string, customerId: string, cartItems: CartItem[]) => Promise<void>;
  amountOffOrderDiscountCodeCheck: (storeId: string, customerId: string, cartItems: CartItem[], discountCode: string) => Promise<AmountOffOrderDiscount | null>;
  clearDiscounts: () => void;
}

// Create Context
const AmountOffOrderContext = createContext<AmountOffOrderContextType | undefined>(undefined);

// Provider Props
interface AmountOffOrderProviderProps {
  children: ReactNode;
}

// Provider Component
export const AmountOffOrderProvider: React.FC<AmountOffOrderProviderProps> = ({ children }) => {
  // State
  const [eligibleDiscounts, setEligibleDiscounts] = useState<AmountOffOrderDiscount[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch eligible discounts
  const fetchEligibleDiscounts = useCallback(async (
    storeId: string, 
    customerId: string, 
    cartItems: CartItem[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosi.post<AmountOffOrderResponse>(
        '/storefront/discounts/amount-off-order/check',
        {
          storeId,
          customerId,
          cartItems,
        }
      );

      if (response.data.success) {
        setEligibleDiscounts(response.data.data.eligibleDiscounts);
        setCartTotal(response.data.data.cartTotal);
        setTotalQuantity(response.data.data.totalQuantity);
      } else {
        setError('Failed to fetch discounts');
      }
    } catch (err: any) {
      console.error('Error fetching amount off order discounts:', err);
      setError(err.response?.data?.message || 'Failed to fetch discounts');
      setEligibleDiscounts([]);
      setCartTotal(0);
      setTotalQuantity(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate discount code
  const amountOffOrderDiscountCodeCheck = useCallback(async (
    storeId: string,
    customerId: string,
    cartItems: CartItem[],
    discountCode: string
  ): Promise<AmountOffOrderDiscount | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosi.post(
        '/storefront/discounts/amount-off-order/validate-code',
        {
          storeId,
          customerId,
          cartItems,
          discountCode,
        }
      );

      if (response.data.success) {
        return response.data.data.discount;
      } else {
        setError(response.data.message || 'Invalid discount code');
        return null;
      }
    } catch (err: any) {
      console.error('Error validating discount code:', err);
      setError(err.response?.data?.message || 'Failed to validate discount code');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear discounts
  const clearDiscounts = useCallback(() => {
    setEligibleDiscounts([]);
    setCartTotal(0);
    setTotalQuantity(0);
    setError(null);
  }, []);

  // Context value
  const value: AmountOffOrderContextType = {
    // State
    eligibleDiscounts,
    cartTotal,
    totalQuantity,
    loading,
    error,
    
    // Actions
    fetchEligibleDiscounts,
    amountOffOrderDiscountCodeCheck,
    clearDiscounts,
  };

  return (
    <AmountOffOrderContext.Provider value={value}>
      {children}
    </AmountOffOrderContext.Provider>
  );
};

// Custom Hook
export const useAmountOffOrder = (): AmountOffOrderContextType => {
  const context = useContext(AmountOffOrderContext);
  
  if (context === undefined) {
    throw new Error('useAmountOffOrder must be used within an AmountOffOrderProvider');
  }
  
  return context;
};

// Export types for use in other components
export type { AmountOffOrderDiscount, CartItem, AmountOffOrderContextType };
