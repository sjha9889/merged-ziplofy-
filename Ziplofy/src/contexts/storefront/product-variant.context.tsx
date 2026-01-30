import { createContext, useCallback, useContext, useState } from 'react';
import { axiosi } from '../../config/axios.config';

export interface StorefrontProductVariant {
  _id: string;
  productId: string;
  optionValues: Record<string, string> | {};
  sku: string;
  barcode: string | null;
  price: number;
  compareAtPrice?: number | null;
  chargeTax: boolean;
  weightValue?: number | null;
  weightUnit?: string | null;
  package?: string | null;
  countryOfOrigin?: string | null;
  images: string[];
  outOfStockContinueSelling?: boolean;
  isSynthetic?: boolean;
  isPhysicalProduct?: boolean;
  depricated?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VariantsResponse {
  success: boolean;
  data: StorefrontProductVariant[];
  count: number;
}

interface StorefrontProductVariantContextType {
  variants: StorefrontProductVariant[];
  count: number;
  loading: boolean;
  error: string | null;
  fetchVariantsByProductId: (productId: string) => Promise<StorefrontProductVariant[]>;
  clear: () => void;
}

const StorefrontProductVariantContext = createContext<StorefrontProductVariantContextType | undefined>(undefined);

export const StorefrontProductVariantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [variants, setVariants] = useState<StorefrontProductVariant[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariantsByProductId = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.get<VariantsResponse>(`/product-variants/public/product/${productId}`);
      if (!res.data.success) throw new Error('Failed to fetch product variants');
      setVariants(res.data.data || []);
      setCount(res.data.count || 0);
      return res.data.data || [];
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch product variants';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setVariants([]);
    setCount(0);
    setError(null);
    setLoading(false);
  }, []);

  const value: StorefrontProductVariantContextType = {
    variants,
    count,
    loading,
    error,
    fetchVariantsByProductId,
    clear,
  };

  return (
    <StorefrontProductVariantContext.Provider value={value}>{children}</StorefrontProductVariantContext.Provider>
  );
};

export const useStorefrontProductVariants = (): StorefrontProductVariantContextType => {
  const ctx = useContext(StorefrontProductVariantContext);
  if (!ctx) throw new Error('useStorefrontProductVariants must be used within a StorefrontProductVariantProvider');
  return ctx;
};

export default StorefrontProductVariantContext;


