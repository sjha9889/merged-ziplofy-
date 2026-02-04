import { createContext, useCallback, useContext, useState } from "react";
import { axiosi } from "../config/axios.config";

export interface StorefrontProductItem {
  _id: string;
  title: string;
  description: string;
  category: { _id: string; name: string } | null;
  price: number;
  compareAtPrice?: number;
  sku: string;
  status: "active" | "draft";
  vendor: { _id: string; name: string } | null;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StorefrontProductsResponse {
  success: boolean;
  data: StorefrontProductItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface StorefrontProductContextType {
  products: StorefrontProductItem[];
  loading: boolean;
  error: string | null;
  pagination: StorefrontProductsResponse["pagination"] | null;
  fetchProductsByStoreId: (args: { storeId: string; page?: number; limit?: number }) => Promise<void>;
  clear: () => void;
}

const StorefrontProductContext = createContext<StorefrontProductContextType | undefined>(undefined);

export const StorefrontProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<StorefrontProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<StorefrontProductsResponse["pagination"] | null>(null);

  const fetchProductsByStoreId = useCallback(async (args: { storeId: string; page?: number; limit?: number }) => {
    const { storeId, page = 1, limit = 10 } = args;
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.get<StorefrontProductsResponse>(`/products/public/store/${storeId}`, {
        params: { page, limit },
      });
      if (!res.data.success) throw new Error("Failed to fetch products");
      setProducts(res.data.data || []);
      setPagination(res.data.pagination || null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string }; message?: string }; message?: string })?.response?.data?.message ?? (err as { message?: string })?.message ?? "Failed to fetch products";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setProducts([]);
    setPagination(null);
    setError(null);
    setLoading(false);
  }, []);

  const value: StorefrontProductContextType = {
    products,
    loading,
    error,
    pagination,
    fetchProductsByStoreId,
    clear,
  };

  return <StorefrontProductContext.Provider value={value}>{children}</StorefrontProductContext.Provider>;
};

export const useStorefrontProducts = (): StorefrontProductContextType => {
  const ctx = useContext(StorefrontProductContext);
  if (!ctx) throw new Error("useStorefrontProducts must be used within a StorefrontProductProvider");
  return ctx;
};

export default StorefrontProductContext;
