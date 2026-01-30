import React, { useMemo, useEffect } from 'react';
import { 
  Box, Container, Typography, Stack, Chip, Card, CardMedia, CardContent, Button, Menu, MenuItem,
  Paper, Avatar, IconButton, Badge, Divider, useTheme, useMediaQuery, Fade, Slide,
  Rating, Breadcrumbs, Link, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, TextField, InputAdornment
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import DiscountIcon from '@mui/icons-material/Discount';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
// (avoid duplicate import)
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useStorefrontProducts } from '../contexts/storefront/product.context';
import { useStorefront } from '../contexts/storefront/store.context';
import { useStorefrontProductVariants } from '../contexts/storefront/product-variant.context';
import { useStorefrontCart } from '../contexts/storefront/storefront-cart.context';
import { useStorefrontAuth } from '../contexts/storefront/storefront-auth.context';
import { useCustomerAddresses } from '../contexts/storefront/customer-address-storefront.context';
import { useStorefrontOrder } from '../contexts/storefront/storefront-order.context';
import StorefrontNavbar from '../components/StorefrontNavbar';
import AuthPopup from '../components/AuthPopup';

const NAVBAR_HEIGHT = 64;

const StorefrontProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { products } = useStorefrontProducts();
  const { storeFrontMeta } = useStorefront();
  const { variants, loading: variantsLoading, fetchVariantsByProductId } = useStorefrontProductVariants();
  const { createCartEntry, items, getCartByCustomerId } = useStorefrontCart();
  const { user, checkAuth, logout } = useStorefrontAuth();
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});
  const [pageLoaded, setPageLoaded] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  
  const [search, setSearch] = React.useState<string>('');
  const [authPopupOpen, setAuthPopupOpen] = React.useState<boolean>(false);
  const [quickCheckoutOpen, setQuickCheckoutOpen] = React.useState<boolean>(false);
  const { addresses, fetchCustomerAddressesByCustomerId } = useCustomerAddresses();
  const { createOrder, loading: orderLoading } = useStorefrontOrder();
  const [selectedShippingAddressId, setSelectedShippingAddressId] = React.useState<string>('');
  const [couponCode, setCouponCode] = React.useState<string>('');

  React.useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Check authentication on page load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Ensure cart is loaded so navbar badge reflects count
  useEffect(() => {
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
    }
  }, [user?._id]);

  

  const product = useMemo(() => products.find(p => p._id === id), [products, id]);

  React.useEffect(() => {
    if (product?._id) {
      fetchVariantsByProductId(product._id);
    }
  }, [product?._id]);

  React.useEffect(() => {
    if (variants && variants.length > 0) {
      // Prefer first non-synthetic variant if available
      const firstReal = variants.find(v => !v.isSynthetic) || variants[0];
      setSelectedVariantId(firstReal._id);
      // Initialize selected options from this variant
      const initOpts: Record<string, string> = {};
      const ov = (firstReal.optionValues || {}) as Record<string, string>;
      Object.keys(ov).forEach(k => { initOpts[k] = ov[k]; });
      setSelectedOptions(initOpts);
    } else {
      setSelectedVariantId(null);
      setSelectedOptions({});
    }
  }, [variants]);

  // Build option axes from all variants
  const optionAxes = React.useMemo(() => {
    const axes = new Map<string, Set<string>>();
    for (const v of variants) {
      const ov = (v.optionValues || {}) as Record<string, string>;
      for (const [k, val] of Object.entries(ov)) {
        if (!axes.has(k)) axes.set(k, new Set());
        axes.get(k)!.add(String(val));
      }
    }
    return Array.from(axes.entries()).map(([name, set]) => ({ name, values: Array.from(set) }));
  }, [variants]);

  // When an option changes, find matching variant
  const handleSelectOption = (optionName: string, value: string) => {
    const next = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(next);
    // Try to find the best matching variant
    const match = variants.find(v => {
      const ov = (v.optionValues || {}) as Record<string, string>;
      return Object.entries(next).every(([k, val]) => !ov[k] || String(ov[k]) === String(val));
    }) || variants.find(v => {
      const ov = (v.optionValues || {}) as Record<string, string>;
      return Object.entries(next).every(([k, val]) => String(ov[k]) === String(val));
    });
    if (match) setSelectedVariantId(match._id);
  };

  const handleAddToCart = async () => {
    if (!storeFrontMeta?.storeId || !selectedVariantId) return;
    
    // Check if user is logged in
    if (!user) {
      setAuthPopupOpen(true);
      return;
    }
    
    try {
      await createCartEntry({ storeId: storeFrontMeta.storeId, productVariantId: selectedVariantId, quantity: 1 });
    } catch {}
  };

  const handleBuyNow = async () => {
    if (!storeFrontMeta?.storeId || !selectedVariantId) return;

    if (!user) {
      setAuthPopupOpen(true);
      return;
    }

    try {
      await createCartEntry({ storeId: storeFrontMeta.storeId, productVariantId: selectedVariantId, quantity: 1 });
      // Prefill shipping address and open quick checkout
      if (user.defaultAddress) setSelectedShippingAddressId(user.defaultAddress);
      else if (addresses.length > 0) setSelectedShippingAddressId(addresses[0]._id);
      setQuickCheckoutOpen(true);
    } catch {}
  };

  const handlePlaceOrder = async () => {
    if (!selectedShippingAddressId || !user?._id || !storeFrontMeta?.storeId) {
      return;
    }

    try {
      // Build order items from current cart after Buy Now added
      const orderItems = items.map((item) => {
        const pv = typeof item.productVariantId === 'object' ? item.productVariantId : null;
        const price = pv?.price ?? 0;
        return {
          productVariantId: typeof item.productVariantId === 'object' ? item.productVariantId._id : item.productVariantId,
          quantity: item.quantity,
          price,
          total: price * item.quantity,
        };
      });

      await createOrder({
        storeId: storeFrontMeta.storeId,
        shippingAddressId: selectedShippingAddressId,
        items: orderItems,
        paymentMethod: 'cod',
        subtotal: orderItems.reduce((s, it) => s + it.total, 0),
        tax: 0,
        shippingCost: 0,
        total: orderItems.reduce((s, it) => s + it.total, 0),
      } as any);
      setQuickCheckoutOpen(false);
    } catch (e) {
      // handled upstream
    }
  };

  if (!product) {
    return (
      <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', color: 'text.primary' }}>
        <StorefrontNavbar showBack showSearch searchValue={search} onSearchChange={setSearch} />

        <Container maxWidth="md" sx={{ pt: `${NAVBAR_HEIGHT + 32}px`, pb: 6 }}>
          <Typography variant="h6" color="text.secondary" align="center">Product not found</Typography>
          <Stack alignItems="center" sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Go back</Button>
          </Stack>
        </Container>

        <Box component="footer" sx={{ borderTop: '1px solid #eee', py: 3, bgcolor: '#fff' }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} {storeFrontMeta?.name || ''}. All rights reserved.</Typography>
              <Stack direction="row" spacing={2}>
                <Button size="small">Privacy</Button>
                <Button size="small">Terms</Button>
                <Button size="small">Contact</Button>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    );
  }

  const images = Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls : ['https://via.placeholder.com/800x600?text=Product'];
  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', color: 'text.primary' }}>
      <StorefrontNavbar showBack showSearch searchValue={search} onSearchChange={setSearch} />

      {/* Breadcrumbs */}
      <Container maxWidth="lg" sx={{ pt: `${NAVBAR_HEIGHT + 16}px` }}>
        <Fade in={pageLoaded} timeout={400}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link 
              underline="hover" 
              color="inherit" 
              href="/" 
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Home
            </Link>
            <Link 
              underline="hover" 
              color="inherit" 
              href={`/collections/${product.category?._id}`}
              sx={{ cursor: 'pointer' }}
            >
              {product.category?.name || 'Category'}
            </Link>
            <Typography color="text.primary">{product.title}</Typography>
          </Breadcrumbs>
        </Fade>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
          {/* Product Images */}
          <Fade in={pageLoaded} timeout={600}>
            <Box sx={{ width: { xs: '100%', lg: '50%' }, flexShrink: 0 }}>
              <Card sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                position: 'relative'
              }}>
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: '#ff4757',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    zIndex: 2
                  }}>
                    -{discountPercentage}%
                  </Box>
                )}

                {/* Wishlist Button */}
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    zIndex: 2,
                    '&:hover': { bgcolor: 'white' }
                  }}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <FavoriteIcon sx={{ color: isWishlisted ? '#ff4757' : 'text.secondary' }} />
                </IconButton>

                <CardMedia
                  component="img"
                  image={images[currentImageIndex]}
                  alt={product.title}
                  sx={{ 
                    objectFit: 'contain', 
                    height: { xs: 400, md: 500 },
                    transition: 'all 0.3s ease'
                  }}
                />

                {/* Image Thumbnails */}
                {images.length > 1 && (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    p: 2, 
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' }
                  }}>
                    {images.map((img, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: 'contain',
                          borderRadius: 1,
                          cursor: 'pointer',
                          border: currentImageIndex === index ? '2px solid #667eea' : '2px solid transparent',
                          opacity: currentImageIndex === index ? 1 : 0.7,
                          transition: 'all 0.2s ease',
                          '&:hover': { opacity: 1 }
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </Box>
                )}
              </Card>
            </Box>
          </Fade>

          {/* Product Info */}
          <Fade in={pageLoaded} timeout={800}>
            <Box sx={{ flex: 1 }}>
              <Paper elevation={0} sx={{ 
                p: 4, 
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                bgcolor: 'white'
              }}>
                {/* Product Title & Rating */}
                <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                  {product.title}
                </Typography>
                
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Rating value={4.5} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    (4.5) • 128 reviews
                  </Typography>
                </Stack>

                {/* Vendor & Category */}
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  {product.vendor?.name && (
                    <Chip 
                      label={product.vendor.name} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        fontWeight: 500
                      }}
                    />
                  )}
                  {product.category?.name && (
                    <Chip 
                      label={product.category.name} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                  {product.status && (
                    <Chip 
                      label={product.status} 
                      size="small" 
                      color={product.status === 'active' ? 'success' : 'default'}
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Stack>

                {/* Price */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Typography variant="h4" fontWeight={800} color="primary">
                    ${(product.price / 100).toFixed(2)}
                  </Typography>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      sx={{ 
                        textDecoration: 'line-through',
                        opacity: 0.7
                      }}
                    >
                      ${(product.compareAtPrice / 100).toFixed(2)}
                    </Typography>
                  )}
                  {discountPercentage > 0 && (
                    <Chip 
                      label={`Save ${discountPercentage}%`}
                      size="small"
                      sx={{
                        bgcolor: '#ff4757',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  )}
                </Stack>

                {/* Variants Selection */}
                {!variantsLoading && (
                  variants.length === 1 && variants[0]?.isSynthetic ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      This product has no variants.
                    </Typography>
                  ) : (
                    <Box sx={{ mb: 3 }}>
                      {optionAxes.map(axis => (
                        <Box key={axis.name} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                            {axis.name}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            {axis.values.map(val => (
                              <Chip
                                key={val}
                                label={val}
                                onClick={() => handleSelectOption(axis.name, val)}
                                variant={selectedOptions[axis.name] === val ? 'filled' : 'outlined'}
                                sx={{
                                  fontWeight: 500,
                                  ...(selectedOptions[axis.name] === val && {
                                    bgcolor: '#667eea',
                                    color: 'white',
                                    '&:hover': { bgcolor: '#5a6fd8' }
                                  })
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  )
                )}

                {/* Description */}
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                  {product.description}
                </Typography>

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleAddToCart}
                    sx={{
                      bgcolor: '#667eea',
                      color: 'white',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#5a6fd8',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleBuyNow}
                    sx={{
                      bgcolor: '#2ea44f',
                      color: 'white',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#279a47',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(46, 164, 79, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Buy Now
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate('/cart')}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#5a6fd8',
                        bgcolor: 'rgba(102, 126, 234, 0.05)'
                      }
                    }}
                  >
                    View Cart
                  </Button>
                </Stack>

                {/* Share & Actions */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <IconButton sx={{ color: '#667eea' }}>
                    <ShareIcon />
                  </IconButton>
                  <IconButton 
                    sx={{ color: isWishlisted ? '#ff4757' : '#667eea' }}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Features */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Why Choose This Product?
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)', width: 40, height: 40 }}>
                        <LocalShippingIcon sx={{ color: '#667eea', fontSize: 20 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>Free Shipping</Typography>
                        <Typography variant="body2" color="text.secondary">On orders over $50</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)', width: 40, height: 40 }}>
                        <SecurityIcon sx={{ color: '#667eea', fontSize: 20 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>Secure Payment</Typography>
                        <Typography variant="body2" color="text.secondary">Your data is protected</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)', width: 40, height: 40 }}>
                        <SupportAgentIcon sx={{ color: '#667eea', fontSize: 20 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>24/7 Support</Typography>
                        <Typography variant="body2" color="text.secondary">We're here to help</Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Fade>
        </Stack>
      </Container>

      <Box component="footer" sx={{ 
        borderTop: '1px solid rgba(0, 0, 0, 0.08)', 
        py: 4, 
        bgcolor: 'white',
        mt: 6
      }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} {storeFrontMeta?.name || ''}. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button size="small" sx={{ color: '#667eea', fontWeight: 500 }}>Privacy</Button>
              <Button size="small" sx={{ color: '#667eea', fontWeight: 500 }}>Terms</Button>
              <Button size="small" sx={{ color: '#667eea', fontWeight: 500 }}>Contact</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      
      <AuthPopup 
        open={authPopupOpen} 
        onClose={() => setAuthPopupOpen(false)} 
      />

      {/* Quick Checkout Popup (Buy Now) */}
      <Dialog open={quickCheckoutOpen} onClose={() => setQuickCheckoutOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid #eee' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton size="small" onClick={() => setQuickCheckoutOpen(false)}>
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0.5 }}>{storeFrontMeta?.name || 'Store'}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">100% Secured Payment</Typography>
              <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Stack>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ px: 2, py: 1.5, color: 'text.secondary', fontWeight: 700 }}>DELIVERY DETAILS</Box>

          {/* Order Summary */}
          <Box sx={{ px: 2, pb: 1.5 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocalShippingIcon sx={{ color: 'text.secondary' }} />
                  <Stack>
                    <Typography variant="subtitle1" fontWeight={800}>Order Summary</Typography>
                    <Chip size="small" label={`$${((product.compareAtPrice || product.price) > product.price ? ((product.compareAtPrice! - product.price)/100).toFixed(2) : '0.00')} saved so far`} sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', width: 'fit-content' }} />
                  </Stack>
                </Stack>
                <Stack alignItems="flex-end" spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">1 item</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        ${(product.compareAtPrice/100).toFixed(2)}
                      </Typography>
                    )}
                    <Typography variant="subtitle1" fontWeight={800}>${(product.price/100).toFixed(2)}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Box>

          {/* Address Section */}
          <Box sx={{ px: 2, pb: 1.5 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={0.5} sx={{ pr: 2, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EditLocationAltIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="subtitle1" fontWeight={800}>Deliver To {user?.firstName || ''}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {addresses.find(a => a._id === selectedShippingAddressId)?.address || 'Select a shipping address'}
                  </Typography>
                  {user?.email && (
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  )}
                </Stack>
                <Stack alignItems="flex-end" spacing={1}>
                  <Button variant="outlined" size="small" onClick={() => {}} sx={{ borderRadius: 2 }}>Change</Button>
                  <Chip size="small" label="Tap To Edit Address" sx={{ bgcolor: '#111', color: '#fff' }} />
                </Stack>
              </Stack>

              {/* Address selector */}
              <FormControl fullWidth sx={{ mt: 1.5 }}>
                <InputLabel id="quick-addr">Shipping Address</InputLabel>
                <Select labelId="quick-addr" label="Shipping Address" value={selectedShippingAddressId} onChange={(e) => setSelectedShippingAddressId(e.target.value)}>
                  {addresses.map((a) => (
                    <MenuItem key={a._id} value={a._id}>{a.firstName} {a.lastName} — {a.city}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Paper variant="outlined" sx={{ p: 1.5, mt: 1.5, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                  <Typography variant="body2" fontWeight={700}>Free Shipping</Typography>
                  <Typography variant="body2" color="text.secondary">Get it by 10 Nov, 9 AM</Typography>
                  <Chip size="small" label="Free" color="success" sx={{ height: 22 }} />
                </Stack>
              </Paper>
            </Paper>
          </Box>

          {/* Offers & Rewards */}
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="subtitle1" fontWeight={800} color="text.secondary" sx={{ mb: 1 }}>OFFERS & REWARDS</Typography>
            <Paper variant="outlined" sx={{ borderRadius: 2, mb: 1 }}>
              <Box sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', fontWeight: 700, px: 2, py: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                You saved $0.00
              </Box>
              <Box sx={{ p: 2 }}>
                <TextField fullWidth size="small" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><DiscountIcon sx={{ color: 'text.secondary' }} /></InputAdornment>) }} />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small"><DiscountIcon fontSize="small" /></IconButton>
                    <Typography variant="body2">8 coupons available</Typography>
                  </Stack>
                  <Button size="small">View All</Button>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={() => setQuickCheckoutOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePlaceOrder} disabled={!selectedShippingAddressId || orderLoading} sx={{ bgcolor: '#2ea44f', '&:hover': { bgcolor: '#279a47' } }}>
            {orderLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StorefrontProductDetailPage;


