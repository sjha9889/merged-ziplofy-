import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import StorefrontNavbar from '../components/StorefrontNavbar';
import { formatINR } from '../utils/currency';
import type { StorefrontProductItem } from '../contexts/product.context';

const NAVBAR_HEIGHT = 64;

const StorefrontCollectionPage: React.FC = () => {
	const navigate = useNavigate();
	const { collectionId, urlHandle } = useParams();
	const { storeFrontMeta } = useStorefront();
	const { collections, products, orderDiscount, fetchCollectionsByStoreId, fetchProductsInCollection, loading } = useStorefrontCollections();
	const { createCartEntry } = useStorefrontCart();
	const { fetchVariantsByProductId } = useStorefrontProductVariants();

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
	}, [storeFrontMeta?.storeId]);

	useEffect(() => {
		if (collectionId) {
			fetchProductsInCollection(collectionId).catch(() => {});
		}
	}, [collectionId, fetchProductsInCollection]);

	const collection = collections.find(c => c._id === collectionId);

	const handleAddToCart = async (product: StorefrontProductItem, e: React.MouseEvent) => {
		e.stopPropagation();
		if (!storeFrontMeta?.storeId) return;
		try {
			const variants = await fetchVariantsByProductId(product._id);
			const realVariants = variants.filter((v) => !v.isSynthetic);
			const variantToAdd = realVariants.length === 1 ? realVariants[0] : variants[0];
			if (variantToAdd) {
				await createCartEntry(
					{
						storeId: storeFrontMeta.storeId,
						productVariantId: variantToAdd._id,
						quantity: 1,
					},
					variantToAdd // Pass variant for guest cart
				);
			} else {
				navigate(`/products/${product._id}`);
			}
		} catch {
			navigate(`/products/${product._id}`);
		}
	};

	return (
		<div className="min-h-screen bg-[#fafafa]">
			<StorefrontNavbar showBack />

			{/* Order Discount Banner */}
			{orderDiscount && (
				<div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 px-4 text-center shadow-md">
					<div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
						<span className="text-lg font-bold">{orderDiscountText}</span>
						<span className="text-sm opacity-90">{orderDiscountCondition}</span>
						{orderDiscount.title && (
							<span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs font-medium">
								{orderDiscount.title}
							</span>
						)}
					</div>
				</div>
			)}

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16" style={{ paddingTop: `${orderDiscount ? NAVBAR_HEIGHT + 56 : NAVBAR_HEIGHT + 24}px` }}>
				{loading && (
					<div className="flex items-center justify-center py-20">
						<div className="h-10 w-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
					</div>
				)}

				{!loading && !collection && (
					<div className="py-20 text-center">
						<div className="text-2xl font-bold text-gray-900 mb-2">Collection not found</div>
						<p className="text-gray-500 mb-6">The collection you're looking for doesn't exist.</p>
						<button
							type="button"
							onClick={() => navigate('/')}
							className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
						>
							Back to Home
						</button>
					</div>
				)}

				{collection && (
					<div>
						{/* Collection Header */}
						<div className="mb-10">
							<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{collection.title}</h1>
							<p className="text-gray-500 max-w-2xl">
								{collection.metaDescription || collection.description || 'Explore our curated collection of premium products.'}
							</p>
							<div className="mt-4 flex items-center gap-3">
								<span className="text-sm text-gray-400">{products.length} products</span>
							</div>
						</div>

						{/* Products Grid */}
						{loading && <div className="text-center py-10 text-gray-500">Loading products...</div>}
						
						{!loading && products.length === 0 && (
							<div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
								<div className="text-gray-400 mb-2">No products found</div>
								<p className="text-sm text-gray-400">This collection is empty.</p>
							</div>
						)}

						{!loading && products.length > 0 && (
							<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
								{products.map((product) => (
									<CollectionProductCard
										key={product._id}
										product={product}
										onClick={() => navigate(`/products/${product._id}`)}
										onAddToCart={handleAddToCart}
									/>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

// Minimal Product Card Component with Gold Theme
const CollectionProductCard: React.FC<{
	product: StorefrontProductItem;
	onClick: () => void;
	onAddToCart: (product: StorefrontProductItem, e: React.MouseEvent) => void;
}> = ({ product, onClick, onAddToCart }) => {
	const images = Array.isArray(product.imageUrls) && product.imageUrls.length > 0 
		? product.imageUrls 
		: ['https://via.placeholder.com/600x400?text=Product'];
	const [idx, setIdx] = useState(0);

	useEffect(() => {
		if (images.length <= 1) return;
		const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3000);
		return () => clearInterval(t);
	}, [images.length]);

	const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
		? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
		: 0;

	const productOfferText = product.productDiscount
		? product.productDiscount.valueType === 'fixed-amount'
			? `Extra ${formatINR(product.productDiscount.fixedAmount || 0)} off`
			: `Extra ${product.productDiscount.percentage || 0}% off`
		: null;

	const isCodeBased = product.productDiscount?.method === 'discount-code';
	const discountCode = product.productDiscount?.discountCode;

	return (
		<div 
			className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-[#d4af37]/30 hover:shadow-md transition-all duration-300 cursor-pointer"
			onClick={onClick}
		>
			{/* Image Section */}
			<div className="relative aspect-square overflow-hidden bg-gray-50">
				{images.map((src, i) => (
					<img
						key={i}
						className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
							i === idx ? 'opacity-100' : 'opacity-0'
						} group-hover:scale-105`}
						src={src}
						alt={product.title}
					/>
				))}

				{/* Discount Badge */}
				{productOfferText && (
					<span className="absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded text-[11px] font-semibold bg-[#d4af37] text-white">
						{productOfferText}
					</span>
				)}

				{/* Sale Badge */}
				{discountPercentage > 0 && !productOfferText && (
					<span className="absolute top-2 left-2 px-2 py-1 rounded text-[11px] font-semibold bg-[#d4af37] text-white">
						{discountPercentage}% OFF
					</span>
				)}

				{/* Image Dots */}
				{images.length > 1 && (
					<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
						{images.map((_, i) => (
							<span
								key={i}
								className={`w-1.5 h-1.5 rounded-full transition-all ${
									i === idx ? 'bg-[#d4af37]' : 'bg-white/60'
								}`}
							/>
						))}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-3">
				{/* Vendor */}
				{product.vendor?.name && (
					<p className="text-[10px] font-medium text-[#d4af37] uppercase tracking-wide mb-1">
						{product.vendor.name}
					</p>
				)}

				{/* Title */}
				<h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] leading-tight">
					{product.title}
				</h3>

				{/* Price */}
				<div className="flex items-baseline gap-2 mb-2">
					<span className="text-base font-bold text-gray-900">
						{formatINR(product.price)}
					</span>
					{product.compareAtPrice && product.compareAtPrice > product.price && (
						<>
							<span className="text-xs text-gray-400 line-through">
								{formatINR(product.compareAtPrice)}
							</span>
							<span className="text-xs font-medium text-[#d4af37]">
								{discountPercentage}% off
							</span>
						</>
					)}
				</div>

				{/* Discount Code */}
				{isCodeBased && discountCode && (
					<p className="text-[10px] text-gray-500 mb-2">
						Use code: <span className="font-semibold text-[#d4af37]">{discountCode}</span>
					</p>
				)}

				{/* Add to Cart */}
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onAddToCart(product, e);
					}}
					className="w-full py-2 rounded bg-[#1a1a1a] text-white text-xs font-medium hover:bg-[#d4af37] transition-colors duration-200"
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default StorefrontCollectionPage;
