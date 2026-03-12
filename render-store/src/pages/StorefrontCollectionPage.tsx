import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiGrid, FiList, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
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
	const { collectionId, urlHandle: _urlHandle } = useParams();
	void _urlHandle;
	const { storeFrontMeta } = useStorefront();
	const { collections, products, orderDiscount, fetchCollectionsByStoreId, fetchProductsInCollection, loading } = useStorefrontCollections();
	const { createCartEntry } = useStorefrontCart();
	const { fetchVariantsByProductId } = useStorefrontProductVariants();
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
		<div className="min-h-screen bg-white">
			<StorefrontNavbar showBack showSearch />

			{/* Order Discount Banner */}
			<AnimatePresence>
				{orderDiscount && (
					<motion.div
						initial={{ y: -40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -40, opacity: 0 }}
						className="fixed top-16 left-0 right-0 z-40 bg-gray-900 text-white py-2.5 px-4"
					>
						<div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
							<span className="font-semibold">{orderDiscountText}</span>
							<span className="opacity-70">{orderDiscountCondition}</span>
							{orderDiscount.title && (
								<span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
									{orderDiscount.title}
								</span>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20" style={{ paddingTop: `${orderDiscount ? NAVBAR_HEIGHT + 56 : NAVBAR_HEIGHT + 24}px` }}>
				{/* Loading State */}
				{loading && (
					<div className="flex flex-col items-center justify-center py-32">
						<div className="h-12 w-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4" />
						<p className="text-sm text-gray-500">Loading collection...</p>
					</div>
				)}

				{/* Not Found State */}
				{!loading && !collection && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col items-center justify-center py-32"
					>
						<div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
							<FiShoppingBag className="w-10 h-10 text-gray-300" />
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Collection not found</h2>
						<p className="text-gray-500 mb-8">The collection you're looking for doesn't exist.</p>
						<button
							type="button"
							onClick={() => navigate('/')}
							className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
						>
							Back to Home
							<FiArrowRight className="w-4 h-4" />
						</button>
					</motion.div>
				)}

				{collection && (
					<>
						{/* Collection Hero */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="mb-12"
						>
							{/* Breadcrumb */}
							<div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
								<button onClick={() => navigate('/')} className="hover:text-gray-900 transition-colors">Home</button>
								<span>/</span>
								<button onClick={() => navigate('/')} className="hover:text-gray-900 transition-colors">Collections</button>
								<span>/</span>
								<span className="text-gray-900">{collection.title}</span>
							</div>

							<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
								<div>
									<motion.h1
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1 }}
										className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4"
									>
										{collection.title}
									</motion.h1>
									<motion.p
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className="text-gray-500 text-lg max-w-2xl leading-relaxed"
									>
										{collection.metaDescription || collection.description || 'Explore our curated collection of premium products.'}
									</motion.p>
								</div>

								{/* Controls */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
									className="flex items-center gap-4"
								>
									<span className="text-sm text-gray-500">{products.length} products</span>
									<div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
										<button
											onClick={() => setViewMode('grid')}
											className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
										>
											<FiGrid className="w-4 h-4" />
										</button>
										<button
											onClick={() => setViewMode('list')}
											className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
										>
											<FiList className="w-4 h-4" />
										</button>
									</div>
								</motion.div>
							</div>
						</motion.div>

						{/* Empty State */}
						{!loading && products.length === 0 && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl"
							>
								<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
									<FiShoppingBag className="w-8 h-8 text-gray-300" />
								</div>
								<p className="text-gray-500 mb-2">No products in this collection yet</p>
								<p className="text-sm text-gray-400">Check back soon for new arrivals!</p>
							</motion.div>
						)}

						{/* Products Grid */}
						{!loading && products.length > 0 && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								className={viewMode === 'grid' 
									? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" 
									: "flex flex-col gap-4"
								}
							>
								{products.map((product, index) => (
									<CollectionProductCard
										key={product._id}
										product={product}
										index={index}
										viewMode={viewMode}
										onClick={() => navigate(`/products/${product._id}`)}
										onAddToCart={handleAddToCart}
									/>
								))}
							</motion.div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

const CollectionProductCard: React.FC<{
	product: StorefrontProductItem;
	index: number;
	viewMode: 'grid' | 'list';
	onClick: () => void;
	onAddToCart: (product: StorefrontProductItem, e: React.MouseEvent) => void;
}> = ({ product, index, viewMode, onClick, onAddToCart }) => {
	const images = Array.isArray(product.imageUrls) && product.imageUrls.length > 0 
		? product.imageUrls 
		: ['https://via.placeholder.com/600x400?text=Product'];
	const [idx, setIdx] = useState(0);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		if (images.length <= 1 || !isHovered) return;
		const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 1500);
		return () => clearInterval(t);
	}, [images.length, isHovered]);

	const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
		? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
		: 0;

	const productOfferText = product.productDiscount
		? product.productDiscount.valueType === 'fixed-amount'
			? `${formatINR(product.productDiscount.fixedAmount || 0)} off`
			: `${product.productDiscount.percentage || 0}% off`
		: null;

	const isCodeBased = product.productDiscount?.method === 'discount-code';
	const discountCode = product.productDiscount?.discountCode;

	if (viewMode === 'list') {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: index * 0.05 }}
				className="group flex gap-6 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer"
				onClick={onClick}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => { setIsHovered(false); setIdx(0); }}
			>
				<div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
					{images.map((src, i) => (
						<img
							key={i}
							className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
							src={src}
							alt={product.title}
						/>
					))}
					{discountPercentage > 0 && (
						<span className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold bg-black text-white">
							-{discountPercentage}%
						</span>
					)}
				</div>

				<div className="flex-1 flex flex-col justify-between py-1">
					<div>
						{product.vendor?.name && (
							<p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.vendor.name}</p>
						)}
						<h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
							{product.title}
						</h3>
						{productOfferText && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 mb-2">
								{productOfferText}
								{isCodeBased && discountCode && <span className="ml-1 opacity-70">• {discountCode}</span>}
							</span>
						)}
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-baseline gap-2">
							<span className="text-xl font-bold text-gray-900">{formatINR(product.price)}</span>
							{product.compareAtPrice && product.compareAtPrice > product.price && (
								<span className="text-sm text-gray-400 line-through">{formatINR(product.compareAtPrice)}</span>
							)}
						</div>
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); onAddToCart(product, e); }}
							className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
						>
							Add to Cart
						</button>
					</div>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.05 }}
			className="group cursor-pointer"
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => { setIsHovered(false); setIdx(0); }}
		>
			{/* Image */}
			<div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4">
				{images.map((src, i) => (
					<img
						key={i}
						className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
							i === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
						}`}
						src={src}
						alt={product.title}
					/>
				))}

				{/* Overlay on hover */}
				<div className={`absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300`} />

				{/* Badges */}
				<div className="absolute top-3 left-3 flex flex-col gap-2">
					{discountPercentage > 0 && (
						<span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black text-white">
							-{discountPercentage}%
						</span>
					)}
					{productOfferText && (
						<span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-900">
							{productOfferText}
						</span>
					)}
				</div>

				{/* Quick Add Button */}
				<motion.button
					type="button"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
					transition={{ duration: 0.2 }}
					onClick={(e) => { e.stopPropagation(); onAddToCart(product, e); }}
					className="absolute bottom-3 left-3 right-3 py-3 rounded-xl bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-medium hover:bg-white transition-colors shadow-lg"
				>
					Add to Cart
				</motion.button>

				{/* Image Indicators */}
				{images.length > 1 && (
					<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
						{images.map((_, i) => (
							<span
								key={i}
								className={`h-1 rounded-full transition-all duration-300 ${
									i === idx ? 'w-4 bg-white' : 'w-1 bg-white/50'
								}`}
							/>
						))}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="px-1">
				{product.vendor?.name && (
					<p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">{product.vendor.name}</p>
				)}
				<h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-snug group-hover:text-gray-600 transition-colors">
					{product.title}
				</h3>
				<div className="flex items-baseline gap-2">
					<span className="text-base font-bold text-gray-900">{formatINR(product.price)}</span>
					{product.compareAtPrice && product.compareAtPrice > product.price && (
						<span className="text-xs text-gray-400 line-through">{formatINR(product.compareAtPrice)}</span>
					)}
				</div>
				{isCodeBased && discountCode && (
					<p className="mt-1.5 text-[10px] text-gray-500">
						Code: <span className="font-semibold text-amber-600">{discountCode}</span>
					</p>
				)}
			</div>
		</motion.div>
	);
};

export default StorefrontCollectionPage;
