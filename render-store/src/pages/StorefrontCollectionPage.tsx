import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import { formatINR } from '../utils/currency';
import type { StorefrontProductItem } from '../contexts/product.context';

function useCategoryMobileFilters() {
	useEffect(() => {
		const filterToggle = document.getElementById('filter-toggle');
		const filterDrawer = document.getElementById('filter-drawer');
		const filterOverlay = document.getElementById('filter-drawer-overlay');
		const filterClose = document.getElementById('filter-drawer-close');

		if (!filterToggle || !filterDrawer || !filterOverlay || !filterClose) return;

		const drawerEl = filterDrawer;
		const overlayEl = filterOverlay;

		function openFilter() {
			drawerEl.classList.add('is-open');
			overlayEl.classList.add('is-open');
			document.body.style.overflow = 'hidden';
		}

		function closeFilter() {
			drawerEl.classList.remove('is-open');
			overlayEl.classList.remove('is-open');
			document.body.style.overflow = '';
		}

		filterToggle.addEventListener('click', openFilter);
		filterClose.addEventListener('click', closeFilter);
		overlayEl.addEventListener('click', closeFilter);

		return () => {
			filterToggle.removeEventListener('click', openFilter);
			filterClose.removeEventListener('click', closeFilter);
			overlayEl.removeEventListener('click', closeFilter);
		};
	}, []);
}

function CategoryProductCard({
	product,
	onAddToCart,
}: {
	product: StorefrontProductItem;
	onAddToCart: (product: StorefrontProductItem, e: React.MouseEvent) => void;
}) {
	const img = Array.isArray(product.imageUrls) && product.imageUrls.length > 0
		? product.imageUrls[0]
		: '/assets/img/watch-1.jpg';
	const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price
		? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
		: 0;

	return (
		<article className="product-card">
			<Link to={`/products/${product._id}`} className="product-card-link">
				<div className="product-card-image">
					<img src={img} alt={product.title} />
				</div>
				<h3 className="product-card-title">{product.title}</h3>
				<div className="product-card-rating">
					<span className="stars">★★★★☆</span>
					<span className="count">(0)</span>
				</div>
				<div className="product-card-price">
					<span className="current">{formatINR(product.price)}</span>
					{product.compareAtPrice && product.compareAtPrice > product.price && (
						<>
							<span className="old">{formatINR(product.compareAtPrice)}</span>
							{discountPercentage > 0 && (
								<span className="discount">{discountPercentage}% OFF</span>
							)}
						</>
					)}
				</div>
			</Link>
			<div className="product-card-actions">
				<button type="button" className="btn-wishlist" aria-label="Wishlist">
					<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
					</svg>
				</button>
				<button
					type="button"
					className="btn-add-cart"
					onClick={(e) => onAddToCart(product, e)}
				>
					<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>{' '}
					Add to Cart
				</button>
			</div>
		</article>
	);
}

const StorefrontCollectionPage: React.FC = () => {
	useCategoryMobileFilters();
	const navigate = useNavigate();
	const { collectionId, urlHandle: _urlHandle } = useParams();
	void _urlHandle;
	const { storeFrontMeta } = useStorefront();
	const { collections, products: collectionProducts, orderDiscount: collectionOrderDiscount, fetchCollectionsByStoreId, fetchProductsInCollection, loading: collectionsLoading } = useStorefrontCollections();
	const { products: allProducts, loading: productsLoading, orderDiscount: productsOrderDiscount, fetchProductsByStoreId } = useStorefrontProducts();
	const { createCartEntry } = useStorefrontCart();
	const { fetchVariantsByProductId } = useStorefrontProductVariants();

	const products = collectionId ? collectionProducts : allProducts;
	const loading = collectionId ? collectionsLoading : productsLoading;
	const orderDiscount = collectionId ? collectionOrderDiscount : productsOrderDiscount;
	const collection = collectionId ? collections.find(c => c._id === collectionId) : null;

	const orderDiscountText = orderDiscount
		? orderDiscount.valueType === 'fixed-amount'
			? `${formatINR(orderDiscount.fixedAmount || 0)} off`
			: `${orderDiscount.percentage || 0}% off`
		: null;

	const orderDiscountCondition = orderDiscount?.minimumPurchase === 'minimum-amount' && orderDiscount.minimumAmount
		? `on orders above ${formatINR(orderDiscount.minimumAmount)}`
		: orderDiscount?.minimumPurchase === 'minimum-quantity' && orderDiscount.minimumQuantity
			? `on orders with ${orderDiscount.minimumQuantity}+ items`
			: 'on all orders';

	useEffect(() => {
		if (storeFrontMeta?.storeId && collections.length === 0) {
			fetchCollectionsByStoreId(storeFrontMeta.storeId).catch(() => {});
		}
	}, [storeFrontMeta?.storeId, collections.length, fetchCollectionsByStoreId]);

	useEffect(() => {
		if (collectionId) {
			fetchProductsInCollection(collectionId).catch(() => {});
		} else if (storeFrontMeta?.storeId) {
			fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 24 }).catch(() => {});
		}
	}, [collectionId, storeFrontMeta?.storeId, fetchProductsInCollection, fetchProductsByStoreId]);

	const handleAddToCart = async (product: StorefrontProductItem, e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		if (!storeFrontMeta?.storeId) return;
		try {
			const variants = await fetchVariantsByProductId(product._id);
			const realVariants = variants.filter((v) => !v.isSynthetic);
			const variantToAdd = realVariants.length === 1 ? realVariants[0] : variants[0];
			if (variantToAdd) {
				await createCartEntry(
					{ storeId: storeFrontMeta.storeId, productVariantId: variantToAdd._id, quantity: 1 },
					variantToAdd
				);
			} else {
				navigate(`/products/${product._id}`);
			}
		} catch {
			navigate(`/products/${product._id}`);
		}
	};

	return (
		<>
			{orderDiscount && (
				<div className="bg-gray-900 text-white py-2.5 px-4">
					<div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
						<span className="font-semibold">{orderDiscountText}</span>
						<span className="opacity-70">{orderDiscountCondition}</span>
						{orderDiscount.title && (
							<span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">{orderDiscount.title}</span>
						)}
					</div>
				</div>
			)}

			<main className="category-main">
				<div className="category-inner">
					<nav className="category-breadcrumb" aria-label="Breadcrumb">
						<Link to="/">
							<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
							</svg>{' '}
							Home
						</Link>
						<span className="breadcrumb-sep">•</span>
						{collectionId && collection ? (
							<>
								<Link to="/category">Categories</Link>
								<span className="breadcrumb-sep">•</span>
								<span>{collection.title}</span>
							</>
						) : (
							<span>Categories</span>
						)}
					</nav>

					<button type="button" id="filter-toggle" className="filter-toggle">
						<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
						</svg>
						Filters
					</button>

					{loading && (
						<div className="flex flex-col items-center justify-center py-32">
							<div className="h-12 w-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4" />
							<p className="text-sm text-gray-500">Loading...</p>
						</div>
					)}

					{!loading && collectionId && !collection && (
						<div className="flex flex-col items-center justify-center py-32">
							<div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
								<FiShoppingBag className="w-10 h-10 text-gray-300" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Collection not found</h2>
							<p className="text-gray-500 mb-8">The collection you&apos;re looking for doesn&apos;t exist.</p>
							<button
								type="button"
								onClick={() => navigate('/')}
								className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
							>
								Back to Home
							</button>
						</div>
					)}

					{!loading && (collection || !collectionId) && products.length === 0 && (
						<div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl">
							<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
								<FiShoppingBag className="w-8 h-8 text-gray-300" />
							</div>
							<p className="text-gray-500 mb-2">No products in this collection yet</p>
							<p className="text-sm text-gray-400">Check back soon for new arrivals!</p>
						</div>
					)}

					{!loading && (collection || !collectionId) && products.length > 0 && (
						<div className="category-layout">
							<aside className="filter-sidebar">
								<div className="filter-panel">
									<div className="filter-header">
										<h3>Filters</h3>
										<button type="button" className="filter-clear">Clear All</button>
									</div>
									<div className="filter-section">
										<div className="filter-section-header">
											<span>Category</span>
											<button type="button" className="filter-reset">Reset</button>
										</div>
										<div className="filter-search">
											<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
											</svg>
											<input type="search" placeholder="Search" />
										</div>
										<ul className="filter-list">
											<li>
												<label>
													<span><input type="checkbox" /> All Products</span>
													<span className="count">({products.length})</span>
												</label>
											</li>
										</ul>
									</div>
									<div className="filter-section">
										<div className="filter-section-header">
											<span>Price Range</span>
											<button type="button" className="filter-reset">Reset</button>
										</div>
										<input type="range" min={0} max={100} defaultValue={100} className="filter-slider" />
										<div className="filter-price-inputs">
											<input type="text" defaultValue="₹ 0" />
											<span className="to">To</span>
											<input type="text" defaultValue="₹ 100000" />
										</div>
									</div>
								</div>
							</aside>

							<div className="product-area">
								<div className="product-topbar">
									<div className="product-topbar-left">
										<div className="view-toggle">
											<button type="button" aria-label="List view">
												<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
												</svg>
											</button>
											<button type="button" className="active" aria-label="Grid view">
												<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
												</svg>
											</button>
										</div>
										<span className="product-results">Showing 1–{products.length} of {products.length} results</span>
									</div>
									<select className="product-sort" defaultValue="Sorting">
										<option>Sorting</option>
									</select>
								</div>

								<div className="product-grid">
									{products.map((product) => (
										<CategoryProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</main>

			<div id="filter-drawer-overlay" className="filter-drawer-overlay" aria-hidden="true" />
			<aside id="filter-drawer" className="filter-drawer">
				<div className="filter-panel">
					<div className="filter-header">
						<h3>Filters</h3>
						<button type="button" id="filter-drawer-close" className="filter-drawer-close" aria-label="Close filters">
							<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<div className="filter-section">
						<div className="filter-section-header">
							<span>Category</span>
							<button type="button" className="filter-reset">Reset</button>
						</div>
						<ul className="filter-list">
							<li>
								<label>
									<span><input type="checkbox" /> All Products</span>
									<span className="count">({products.length})</span>
								</label>
							</li>
						</ul>
					</div>
				</div>
			</aside>
		</>
	);
};

export default StorefrontCollectionPage;
