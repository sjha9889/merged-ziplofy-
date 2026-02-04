import React, { createContext, useCallback, useContext, useState } from 'react';
import { axiosi } from '../config/axios.config';
import type { StorefrontProductItem } from './product.context';

export interface StorefrontCollection {
	_id: string;
	storeId: string;
	title: string;
	description: string;
	pageTitle: string;
	metaDescription: string;
	urlHandle: string;
	onlineStorePublishing: boolean;
	pointOfSalePublishing: boolean;
	createdAt: string;
	updatedAt: string;
}

interface FetchCollectionsApiResponse {
	success: boolean;
	data: StorefrontCollection[];
	count: number;
}

interface FetchProductsInCollectionPagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}

interface FetchProductsInCollectionApiResponse {
	success: boolean;
	data: StorefrontProductItem[];
	pagination: FetchProductsInCollectionPagination;
}

interface StorefrontCollectionsContextType {
	collections: StorefrontCollection[];
	products: StorefrontProductItem[];
	loading: boolean;
	error: string | null;
	fetchCollectionsByStoreId: (storeId: string) => Promise<StorefrontCollection[]>;
	fetchProductsInCollection: (
		collectionId: string,
		params?: { page?: number; limit?: number; q?: string }
	) => Promise<void>;
	clear: () => void;
}

const StorefrontCollectionsContext = createContext<StorefrontCollectionsContextType | undefined>(undefined);

export const StorefrontCollectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [collections, setCollections] = useState<StorefrontCollection[]>([]);
	const [products, setProducts] = useState<StorefrontProductItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCollectionsByStoreId = useCallback(async (storeId: string): Promise<StorefrontCollection[]> => {
		try {
			setLoading(true);
			setError(null);
			const res = await axiosi.get<FetchCollectionsApiResponse>(`/storefront/collections/store/${storeId}`);
			const list = res.data?.data ?? [];
			setCollections(list);
			return list;
		} catch (err: any) {
			const msg = err?.response?.data?.message || err?.message || 'Failed to fetch collections';
			setError(msg);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchProductsInCollection = useCallback(async (
		collectionId: string,
		params?: { page?: number; limit?: number; q?: string }
	): Promise<void> => {
		try {
			setLoading(true);
			setError(null);
			const res = await axiosi.get<FetchProductsInCollectionApiResponse>(`/storefront/collections/${collectionId}/products`, {
				params: {
					page: params?.page,
					limit: params?.limit,
					q: params?.q,
				},
			});
			setProducts(res.data?.data ?? []);
		} catch (err: any) {
			const msg = err?.response?.data?.message || err?.message || 'Failed to fetch products in collection';
			setError(msg);
			setProducts([]);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const clear = useCallback(() => {
		setCollections([]);
		setProducts([]);
		setError(null);
	}, []);

	const value: StorefrontCollectionsContextType = {
		collections,
		products,
		loading,
		error,
		fetchCollectionsByStoreId,
		fetchProductsInCollection,
		clear,
	};

	return (
		<StorefrontCollectionsContext.Provider value={value}>
			{children}
		</StorefrontCollectionsContext.Provider>
	);
};

export const useStorefrontCollections = (): StorefrontCollectionsContextType => {
	const ctx = useContext(StorefrontCollectionsContext);
	if (!ctx) throw new Error('useStorefrontCollections must be used within a StorefrontCollectionsProvider');
	return ctx;
};
