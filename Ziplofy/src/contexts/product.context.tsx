import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { axiosi } from '../config/axios.config';

// Product interface (matches API shape at creation and list)
export interface Product {
  _id: string;
  storeId: string;
  title: string;
  description: string;
  category: {
    _id: string;
    name: string;
    parent: string | null;
    hasChildren: boolean;
    createdAt: string;
    updatedAt: string;
  };
  price: number;
  chargeTax: boolean;
  compareAtPrice?: number;
  cost: number;
  inventoryTrackingEnabled: boolean;
  quantity?: number;
  sku: string;
  barcode: string;
  continueSellingWhenOutOfStock: boolean;
  isPhysicalProduct: boolean;
  package: {
    _id: string;
    storeId: string;
    packageName: string;
    packageType: 'box' | 'envelope' | 'soft_package';
    length: number;
    width: number;
    height: number;
    dimensionsUnit: 'cm' | 'in';
    weight: number;
    weightUnit: 'g' | 'kg' | 'oz' | 'lb';
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  };
  productWeight: number;
  productWeightUnit: string;
  countryOfOrigin: string;
  harmonizedSystemCode: string;
  variants: {
    optionName: string;
    values: string[];
    _id: string;
  }[];
  pageTitle: string;
  metaDescription: string;
  urlHandle: string;
  profit: number;
  marginPercent: number;
  unitPriceTotalAmount?: number;
  unitPriceTotalAmountMetric?: string;
  unitPriceBaseMeasure?: number;
  unitPriceBaseMeasureMetric?: string;
  status: 'active' | 'draft';
  onlineStorePublishing: boolean;
  pointOfSalePublishing: boolean;
  productType: {
    _id: string;
    storeId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  vendor: {
    _id: string;
    storeId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  tagIds: {
    _id: string;
    storeId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

// API responses
interface CreateProductResponse {
  success: boolean;
  data: Product;
  message: string;
}

interface GetProductsByStoreResponse {
  success: boolean;
  data: Product[];
  count: number;
}

// Search products + variants availability (matches server response)
// Search responses from various controllers
export interface ProductSearchVariantAvailability {
  origin: number;
  destination: number;
}

export interface ProductSearchVariant {
  _id: string;
  sku: string;
  optionValues: Record<string, string>;
  price: number;
  images: string[];
  availability?: ProductSearchVariantAvailability;
  compareAtPrice?: number;
}

export interface ProductSearchProductSummary {
  _id: string;
  title: string;
  sku: string;
  imageUrl: string | null;
  productType?: string;
  vendor?: string;
  status?: string;
}

export interface ProductSearchWithVariantsItem {
  product: ProductSearchProductSummary;
  variants: ProductSearchVariant[];
}

export interface ProductSearchPagination {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

export interface ProductSearchResponse {
  success: boolean;
  data: ProductSearchWithVariantsItem[];
  pagination: ProductSearchPagination;
}

export interface ProductSearchBasicItem {
  _id: string;
  title: string;
  imageUrl: string | null;
}

// Create payload interface matching API expectations
export interface CreateProductPayload {
  title: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  chargeTax: boolean;
  cost: number;
  profit: number;
  marginPercent: number;
  storeId: string;
  unitPriceTotalAmount?: number;
  unitPriceTotalAmountMetric?: string;
  unitPriceBaseMeasure?: number;
  unitPriceBaseMeasureMetric?: string;
  inventoryTrackingEnabled: boolean;
  quantity?: number;
  continueSellingWhenOutOfStock: boolean;
  sku: string;
  barcode: string;
  isPhysicalProduct: boolean;
  package?: string;
  productWeight?: number;
  productWeightUnit?: string;
  countryOfOrigin?: string;
  harmonizedSystemCode?: string;
  variants: Array<{
    optionName: string;
    values: string[];
  }>;
  pageTitle: string;
  metaDescription: string;
  urlHandle: string;
  status: 'active' | 'draft';
  onlineStorePublishing: boolean;
  pointOfSalePublishing: boolean;
  imageUrls?: string[];
  productType: string;
  vendor: string;
  tagIds: string[];
}

export interface SearchProductsWithVariantsArgs {
  storeId: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface SearchProductsForTransferArgs extends SearchProductsWithVariantsArgs {
  originLocationId?: string;
  destinationLocationId?: string;
}

export interface SearchProductsWithDestinationArgs extends SearchProductsWithVariantsArgs {
  destinationLocationId: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  transferProductSearchResult: ProductSearchWithVariantsItem[];
  transferProductSearchPagination: ProductSearchPagination | null;
  createProduct: (payload: CreateProductPayload) => Promise<Product>;
  fetchProductsByStoreId: (storeId: string) => Promise<void>;
  clearProducts: () => void;
  addVariantsToProduct: (productId: string, variants: Array<{ optionName: string; values: string[] }>) => Promise<{ _id: string }[]>;
  deleteVariantFromProduct: (productId: string, dimensionName: string) => Promise<void>;
  addOptionToProduct: (productId: string, optionName: string, values: string[]) => Promise<{ _id: string }[]>;
  searchProductForTransfer: (args: SearchProductsForTransferArgs) => Promise<ProductSearchResponse>;
  searchProductsWithVariants: (args: SearchProductsWithVariantsArgs) => Promise<ProductSearchResponse>;
  searchBasic: (args: { q: string; storeId?: string }) => Promise<ProductSearchBasicItem[]>;
  searchProductWithVariantAndDestination: (args: SearchProductsWithDestinationArgs) => Promise<ProductSearchResponse>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transferProductSearchResult, setTransferProductSearchResult] = useState<ProductSearchWithVariantsItem[]>([]);
  const [transferProductSearchPagination, setTransferProductSearchPagination] = useState<ProductSearchPagination | null>(null);

  const createProduct = useCallback(async (payload: CreateProductPayload) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.post<CreateProductResponse>('/products', payload);
      const { success, data } = res.data;
      if (!success) throw new Error('Failed to create product');
      // prepend to list
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create product';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsByStoreId = useCallback(async (storeId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.get<GetProductsByStoreResponse>(`/products/store/${storeId}`);
      const { success, data } = res.data;
      if (!success) throw new Error('Failed to fetch products');
      setProducts(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch products';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProducts = useCallback(() => {
    setProducts([]);
    setError(null);
    setLoading(false);
  }, []);

  const addVariantsToProduct = useCallback(async (
    productId: string,
    variants: Array<{ optionName: string; values: string[] }>
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.post<{ success: boolean; data: any[]; count: number; message?: string }>(
        `/products/${productId}/variants`,
        { variants }
      );
      const { success, data } = res.data;
      if (!success) throw new Error('Failed to add variants');
      return data as { _id: string }[];
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add variants';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVariantFromProduct = useCallback(async (
    productId: string,
    dimensionName: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.delete<{ success: boolean; data: any[]; count: number; message?: string }>(
        `/products/${productId}/variants`,
        { data: { dimensionName } }
      );
      const { success } = res.data;
      if (!success) throw new Error('Failed to delete variant dimension');
      // No return value - this function just performs the deletion
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete variant dimension';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addOptionToProduct = useCallback(async (
    productId: string,
    optionName: string,
    values: string[]
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.post<{ success: boolean; data: any[]; count: number; message?: string }>(
        `/products/${productId}/variants/${optionName}/options`,
        { optionName, values }
      );
      const { success, data } = res.data;
      if (!success) throw new Error('Failed to add option values');
      return data as { _id: string }[];
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add option values';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProductForTransfer = useCallback(async (args: SearchProductsForTransferArgs): Promise<ProductSearchResponse> => {
    const { storeId, q = '', originLocationId, destinationLocationId, page = 1, limit = 20 } = args;
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.get<ProductSearchResponse>(
        `/products/search`,
        {
          params: {
            storeId,
            q,
            originLocationId,
            destinationLocationId,
            page,
            limit,
          }
        }
      );
      // Persist results in context for transfer UI
      setTransferProductSearchResult(res.data.data || []);
      setTransferProductSearchPagination(res.data.pagination || null);
      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to search products';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchBasic = useCallback(async (args: { q: string; storeId?: string }) => {
    const { q, storeId } = args;
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.get<{ success: boolean; data: ProductSearchBasicItem[] }>(
        `/products/search-basic`,
        { params: { q, storeId } }
      );
      return res.data.data || [];
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to search products';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProductsWithVariants = useCallback(async (args: SearchProductsWithVariantsArgs): Promise<ProductSearchResponse> => {
    const { storeId, q = '', page = 1, limit = 20 } = args;
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.get<ProductSearchResponse>(`/products/search-with-variants`, {
        params: { storeId, q, page, limit },
      });
      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to search products with variants';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProductWithVariantAndDestination = useCallback(async (args: SearchProductsWithDestinationArgs) => {
    const { storeId, q = '', destinationLocationId, page = 1, limit = 20 } = args;
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.get<ProductSearchResponse>(
        `/products/search-product-with-variant-and-destination`,
        { params: { storeId, q, destinationLocationId, page, limit } }
      );
      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to search products with destination availability';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<ProductContextType>(
    () => ({
      products,
      loading,
      error,
      transferProductSearchResult,
      transferProductSearchPagination,
      createProduct,
      fetchProductsByStoreId,
      clearProducts,
      addVariantsToProduct,
      deleteVariantFromProduct,
      addOptionToProduct,
      searchProductForTransfer,
      searchProductsWithVariants,
      searchBasic,
      searchProductWithVariantAndDestination,
    }),
    [
      products,
      loading,
      error,
      transferProductSearchResult,
      transferProductSearchPagination,
      createProduct,
      fetchProductsByStoreId,
      clearProducts,
      addVariantsToProduct,
      deleteVariantFromProduct,
      addOptionToProduct,
      searchProductForTransfer,
      searchProductsWithVariants,
      searchBasic,
      searchProductWithVariantAndDestination,
    ]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
};

export default ProductContext;


