import { createContext, useCallback, useContext, useState } from 'react';
import { axiosi } from '../../config/axios.config';
import type { StorefrontProductVariant } from './product-variant.context';

export interface StorefrontCartItem {
  _id: string;
  storeId: string;
  productVariantId: StorefrontProductVariant; // populated in create/update/list; string on delete
  customerId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface CreateCartPayload {
  storeId: string;
  productVariantId: string;
  quantity?: number;
}

interface UpdateCartPayload {
  id: string;
  quantity: number;
}

interface StorefrontCartContextType {
  items: StorefrontCartItem[];
  loading: boolean;
  error: string | null;
  createCartEntry: (payload: CreateCartPayload) => Promise<StorefrontCartItem>;
  getCartByCustomerId: (customerId: string) => Promise<StorefrontCartItem[]>;
  updateCartEntry: (payload: UpdateCartPayload) => Promise<StorefrontCartItem>;
  deleteCartEntry: (id: string) => Promise<StorefrontCartItem>;
  setItems: (items: StorefrontCartItem[]) => void;
  clear: () => void;
}

const StorefrontCartContext = createContext<StorefrontCartContextType | undefined>(undefined);

export const StorefrontCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<StorefrontCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCartEntry = useCallback(async (payload: CreateCartPayload): Promise<StorefrontCartItem> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.post<{ success: boolean; data: StorefrontCartItem }>(`/storefront/cart`, payload);
      if (!res.data.success) throw new Error('Create cart entry failed');
      const created = res.data.data;
      // Merge or add in local state
      setItems(prev => {
        const idx = prev.findIndex(i => i._id === created._id);
        if (idx >= 0) {
          const next = prev.slice();
          next[idx] = created;
          return next;
        }
        return [created, ...prev];
      });
      return created;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Create cart entry failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCartByCustomerId = useCallback(async (customerId: string): Promise<StorefrontCartItem[]> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.get<{ success: boolean; data: StorefrontCartItem[]; count: number }>(`/storefront/cart/customer/${customerId}`);
      if (!res.data.success) throw new Error('Fetch cart failed');
      setItems(res.data.data || []);
      return res.data.data || [];
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Fetch cart failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartEntry = useCallback(async (payload: UpdateCartPayload): Promise<StorefrontCartItem> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.patch<{ success: boolean; data: StorefrontCartItem }>(`/storefront/cart/${payload.id}`, { quantity: payload.quantity });
      if (!res.data.success) throw new Error('Update cart entry failed');
      const updated = res.data.data;
      setItems(prev => prev.map(i => (i._id === updated._id ? updated : i)));
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Update cart entry failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCartEntry = useCallback(async (id: string): Promise<StorefrontCartItem> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosi.delete<{ success: boolean; data: StorefrontCartItem }>(`/storefront/cart/${id}`);
      if (!res.data.success) throw new Error('Delete cart entry failed');
      const deleted = res.data.data;
      setItems(prev => prev.filter(i => i._id !== deleted._id));
      return deleted;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Delete cart entry failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setError(null);
    setLoading(false);
  }, []);

  const value: StorefrontCartContextType = {
    items,
    loading,
    error,
    createCartEntry,
    getCartByCustomerId,
    updateCartEntry,
    deleteCartEntry,
    setItems,
    clear,
  };

  return (
    <StorefrontCartContext.Provider value={value}>{children}</StorefrontCartContext.Provider>
  );
};

export const useStorefrontCart = (): StorefrontCartContextType => {
  const ctx = useContext(StorefrontCartContext);
  if (!ctx) throw new Error('useStorefrontCart must be used within a StorefrontCartProvider');
  return ctx;
};

export default StorefrontCartContext;


