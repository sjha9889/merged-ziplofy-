import React, { useEffect } from 'react';
import { Box, Container, Typography, IconButton, Stack, Chip, Button, Card, CardMedia, CardContent, Badge } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useStorefront } from '../contexts/storefront/store.context';
import { useStorefrontCollections } from '../contexts/storefront/storefront-collections.context';
import { useStorefrontAuth } from '../contexts/storefront/storefront-auth.context';
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
		<Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', color: 'text.primary' }}>
		<StorefrontNavbar showBack />

			<Container maxWidth="lg" sx={{ pt: `${NAVBAR_HEIGHT + 16}px`, pb: 6 }}>
				{loading && (
					<Typography variant="body1" color="text.secondary">Loading collection...</Typography>
				)}
				{!loading && !collection && (
					<Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
						<Typography variant="h5" fontWeight={800}>Collection not found</Typography>
						<Button variant="outlined" onClick={() => navigate('/')}>Go to Home</Button>
					</Stack>
				)}
				{collection && (
					<Box>
						<Typography variant="h3" fontWeight={800}>{collection.title}</Typography>
						<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
							<Chip label={urlHandle} size="small" variant="outlined" />
							{collection.onlineStorePublishing && <Chip label="Online" color="primary" size="small" />}
							{collection.pointOfSalePublishing && <Chip label="POS" color="success" size="small" />}
						</Stack>
						<Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>{collection.metaDescription || collection.description}</Typography>
						
						{/* Products Section */}
						<Box sx={{ mt: 4 }}>
							<Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
								Products in this Collection
							</Typography>
							
							{loading && (
								<Typography variant="body1" color="text.secondary">Loading products...</Typography>
							)}
							
							{!loading && products.length === 0 && (
								<Typography variant="body1" color="text.secondary">No products found in this collection.</Typography>
							)}
							
							{!loading && products.length > 0 && (
								<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
									{products.map((product) => (
										<Box key={product._id}>
											<Card 
												sx={{ 
													height: '100%', 
													display: 'flex', 
													flexDirection: 'column',
													cursor: 'pointer',
													transition: 'all 0.3s ease',
													'&:hover': {
														transform: 'translateY(-4px)',
														boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
													}
												}}
												onClick={() => navigate(`/products/${product._id}`)}
											>
												{product.imageUrls && product.imageUrls.length > 0 && (
													<CardMedia
														component="img"
														height="200"
														image={product.imageUrls[0]}
														alt={product.title}
														sx={{ objectFit: 'contain' }}
													/>
												)}
												<CardContent sx={{ flexGrow: 1 }}>
													<Typography variant="h6" fontWeight={600} noWrap>
														{product.title}
													</Typography>
													{product.vendor && (
														<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
															by {product.vendor.name}
														</Typography>
													)}
													{product.category && (
														<Chip 
															label={product.category.name} 
															size="small" 
															variant="outlined" 
															sx={{ mt: 1 }}
														/>
													)}
													<Stack direction="row" spacing={1} sx={{ mt: 2 }}>
														<Typography variant="h6" fontWeight={600} color="primary">
															${product.price}
														</Typography>
														{product.compareAtPrice && product.compareAtPrice > product.price && (
															<Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
																${product.compareAtPrice}
															</Typography>
														)}
													</Stack>
													{product.sku && (
														<Typography variant="caption" color="text.secondary">
															SKU: {product.sku}
														</Typography>
													)}
												</CardContent>
											</Card>
										</Box>
									))}
								</Box>
							)}
						</Box>
					</Box>
				)}
			</Container>
			
		</Box>
	);
};

export default StorefrontCollectionPage;
