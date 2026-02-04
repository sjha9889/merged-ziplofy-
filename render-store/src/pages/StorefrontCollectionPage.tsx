import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import StorefrontNavbar from '../components/StorefrontNavbar';

const NAVBAR_HEIGHT = 64;

const StorefrontCollectionPage: React.FC = () => {
	const navigate = useNavigate();
	const { collectionId, urlHandle } = useParams();
	const { storeFrontMeta } = useStorefront();
	const { collections, products, fetchCollectionsByStoreId, fetchProductsInCollection, loading } = useStorefrontCollections();
	const { user } = useStorefrontAuth();

	useEffect(() => {
		if (storeFrontMeta?.storeId && collections.length === 0) {
			fetchCollectionsByStoreId(storeFrontMeta.storeId).catch(() => {});
		}
	}, [storeFrontMeta?.storeId]);

	useEffect(() => {
		if (collectionId) {
			fetchProductsInCollection(collectionId).catch(() => {});
		}
	}, [collectionId, fetchProductsInCollection]);

	const collection = collections.find(c => c._id === collectionId);


	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			<StorefrontNavbar showBack />

			<div className="mx-auto max-w-6xl px-4 pb-10" style={{ paddingTop: `${NAVBAR_HEIGHT + 16}px` }}>
				{loading && <div className="text-sm text-gray-600">Loading collection...</div>}

				{!loading && !collection && (
					<div className="py-10 text-center">
						<div className="text-xl font-extrabold">Collection not found</div>
						<button
							type="button"
							onClick={() => navigate('/')}
							className="mt-4 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
						>
							Go to Home
						</button>
					</div>
				)}

				{collection && (
					<div>
						<h1 className="text-3xl font-extrabold">{collection.title}</h1>
						<div className="mt-2 flex flex-wrap items-center gap-2">
							<span className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700">
								{urlHandle}
							</span>
							{collection.onlineStorePublishing && (
								<span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">Online</span>
							)}
							{collection.pointOfSalePublishing && (
								<span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">POS</span>
							)}
						</div>
						<p className="mt-3 max-w-3xl text-sm text-gray-600">
							{collection.metaDescription || collection.description}
						</p>

						<div className="mt-8">
							<h2 className="text-lg font-semibold">Products in this Collection</h2>

							{loading && <div className="mt-3 text-sm text-gray-600">Loading products...</div>}
							{!loading && products.length === 0 && (
								<div className="mt-3 text-sm text-gray-600">No products found in this collection.</div>
							)}

							{!loading && products.length > 0 && (
								<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
									{products.map((product) => (
										<button
											type="button"
											key={product._id}
											onClick={() => navigate(`/products/${product._id}`)}
											className="group rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
										>
											<div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50">
												<img
													src={(product.imageUrls && product.imageUrls[0]) || 'https://via.placeholder.com/600x400?text=Product'}
													alt={product.title}
													className="h-full w-full object-contain transition group-hover:scale-[1.02]"
												/>
											</div>
											<div className="mt-3">
												<div className="truncate text-sm font-semibold text-gray-900">{product.title}</div>
												{product.vendor && <div className="mt-1 text-xs text-gray-600">by {product.vendor.name}</div>}
												{product.category && (
													<div className="mt-2 inline-flex rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700">
														{product.category.name}
													</div>
												)}
												<div className="mt-3 flex items-center gap-2">
													<div className="text-sm font-bold text-indigo-600">${String(product.price)}</div>
													{product.compareAtPrice && product.compareAtPrice > product.price && (
														<div className="text-xs text-gray-500 line-through">${String(product.compareAtPrice)}</div>
													)}
												</div>
												{product.sku && <div className="mt-1 text-[11px] text-gray-500">SKU: {product.sku}</div>}
											</div>
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default StorefrontCollectionPage;
