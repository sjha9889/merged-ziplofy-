import React, { useEffect } from 'react';
import { 
  Box, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, 
  Card, CardActionArea, CardContent, Chip, Stack, Button, Grid, Paper, 
  Avatar, IconButton, Badge, Fade, Slide, useTheme, useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useStorefront } from '../contexts/storefront/store.context';
import { useStorefrontProducts } from '../contexts/storefront/product.context';
import { useStorefrontCart } from '../contexts/storefront/storefront-cart.context';
import { useStorefrontAuth } from '../contexts/storefront/storefront-auth.context';
import type { StorefrontProductItem } from '../contexts/storefront/product.context';
import { useStorefrontCollections } from '../contexts/storefront/storefront-collections.context';
import StorefrontNavbar from '../components/StorefrontNavbar';

const NAVBAR_HEIGHT = 64;

const StorefrontApp: React.FC = () => {
  const { storeFrontMeta } = useStorefront();
  const { products, loading, error, pagination, fetchProductsByStoreId } = useStorefrontProducts();
  const { user, logout, checkAuth } = useStorefrontAuth();
  const { items, getCartByCustomerId } = useStorefrontCart();
  const { collections, loading: collectionsLoading, error: collectionsError, fetchCollectionsByStoreId } = useStorefrontCollections();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [search, setSearch] = React.useState<string>('');
  const [confirmLogoutOpen, setConfirmLogoutOpen] = React.useState(false);
  const [heroLoaded, setHeroLoaded] = React.useState(false);

  useEffect(() => {
    if (storeFrontMeta?.storeId) {
      fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 12 });
    }
  }, [storeFrontMeta?.storeId]);

  // Fetch collections for this store
  useEffect(() => {
    if (storeFrontMeta?.storeId) {
      fetchCollectionsByStoreId(storeFrontMeta.storeId);
    }
  }, [storeFrontMeta?.storeId]);

  // Check authentication on page load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Load cart for logged-in user so navbar badge stays in sync
  useEffect(() => {
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
    }
  }, [user?._id]);

  // Trigger hero animation
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    'All', 'Apparel', 'Shoes', 'Accessories', 'Electronics', 'Home', 'Beauty'
  ];

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', color: 'text.primary' }}>
      {/* Navbar */}
      <StorefrontNavbar showSearch searchValue={search} onSearchChange={setSearch} />

      {/* Confirm Logout Modal */}
      <Dialog open={confirmLogoutOpen} onClose={() => setConfirmLogoutOpen(false)}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogoutOpen(false)}>No</Button>
          <Button color="error" variant="contained" onClick={() => { logout(); setConfirmLogoutOpen(false); }}>Yes</Button>
        </DialogActions>
      </Dialog>

      {/* Hero Section */}
      <Box sx={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        overflow: 'hidden',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={heroLoaded} timeout={800}>
            <Box>
              <Typography 
                variant={isMobile ? "h3" : "h2"} 
                fontWeight={900} 
                sx={{ 
                  mb: 2,
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {storeFrontMeta?.name || 'Our Store'}
              </Typography>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                sx={{ 
                  opacity: 0.9,
                  maxWidth: isMobile ? '100%' : '70%',
                  lineHeight: 1.6
                }}
              >
                {storeFrontMeta?.description || 'Discover amazing products at unbeatable prices'}
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>


      {/* Collections Section */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
              Shop by Collections
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Discover our curated collections featuring the latest trends and timeless classics
            </Typography>
          </Box>

          {collectionsLoading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">Loading collections...</Typography>
            </Box>
          )}
          {collectionsError && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="error">{collectionsError}</Typography>
            </Box>
          )}

          {!collectionsLoading && collections.length > 0 && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3
            }}>
              {collections.map((c, index) => (
                <Slide direction="up" in={heroLoaded} timeout={600 + index * 100} key={c._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardActionArea 
                      sx={{ height: '100%', p: 0 }} 
                      onClick={() => navigate(`/collections/${c._id}/${c.urlHandle}`)}
                    >
                      <Box sx={{ 
                        height: 200, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <Typography variant="h4" fontWeight={800} color="white" sx={{ opacity: 0.9 }}>
                          {c.title.charAt(0)}
                        </Typography>
                        <Box sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          display: 'flex',
                          gap: 1
                        }}>
                          {c.onlineStorePublishing && (
                            <Chip size="small" label="Online" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                          )}
                          {c.pointOfSalePublishing && (
                            <Chip size="small" label="POS" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                          )}
                        </Box>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                          {c.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden',
                            mb: 2
                          }}
                        >
                          {c.metaDescription || c.description}
                        </Typography>
                        <Chip 
                          size="small" 
                          variant="outlined" 
                          label={c.urlHandle}
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Slide>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
              Featured Products
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Handpicked products that our customers love
            </Typography>
          </Box>

          {loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">Loading products...</Typography>
            </Box>
          )}
          {error && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="error">{error}</Typography>
            </Box>
          )}

          {!loading && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3
            }}>
              {products
                .filter((p) => {
                  if (!search) return true;
                  const q = search.toLowerCase();
                  const inTitle = p.title?.toLowerCase().includes(q);
                  const inVendor = (p.vendor?.name || '').toLowerCase().includes(q);
                  return inTitle || inVendor;
                })
                .map((p, index) => (
                  <Slide direction="up" in={heroLoaded} timeout={800 + index * 100} key={p._id}>
                    <Box>
                      <ProductCard product={p} onClick={() => navigate(`/products/${p._id}`)} />
                    </Box>
                  </Slide>
                ))}
            </Box>
          )}

          {pagination?.hasNext && (
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => storeFrontMeta?.storeId && fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: (pagination?.page || 1) + 1, limit: pagination?.limit || 12 })}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Load More Products
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ 
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 2fr' },
            gap: 4
          }}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {storeFrontMeta?.name || 'Our Store'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                {storeFrontMeta?.description || 'Your trusted online shopping destination for quality products at great prices.'}
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" sx={{ color: 'white', opacity: 0.8 }}>
                  <TrendingUpIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: 'white', opacity: 0.8 }}>
                  <ShoppingCartIcon />
                </IconButton>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Button size="small" sx={{ color: 'white', opacity: 0.8, justifyContent: 'flex-start', p: 0 }}>
                  About Us
                </Button>
                <Button size="small" sx={{ color: 'white', opacity: 0.8, justifyContent: 'flex-start', p: 0 }}>
                  Contact
                </Button>
                <Button size="small" sx={{ color: 'white', opacity: 0.8, justifyContent: 'flex-start', p: 0 }}>
                  FAQ
                </Button>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Support
              </Typography>
              <Stack spacing={1}>
                <Button size="small" sx={{ color: 'white', opacity: 0.8, justifyContent: 'flex-start', p: 0 }}>
                  Help Center
                </Button>
                <Button size="small" sx={{ color: 'white', opacity: 0.8, justifyContent: 'flex-start', p: 0 }}>
                  Shipping Info
                </Button>
                <Button size="small" sx={{ color: 'white', opacity: 0.8, justifyContent: 'flex-start', p: 0 }}>
                  Returns
                </Button>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Newsletter
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                Subscribe to get updates on new products and exclusive offers.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)', 
                    color: 'white',
                    '&:hover': { borderColor: 'white' }
                  }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Box>
          </Box>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © {new Date().getFullYear()} {storeFrontMeta?.name || 'Our Store'}. All rights reserved.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button size="small" sx={{ color: 'white', opacity: 0.8 }}>
                  Privacy Policy
                </Button>
                <Button size="small" sx={{ color: 'white', opacity: 0.8 }}>
                  Terms of Service
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default StorefrontApp;



// Modern Product Card with enhanced design
const ProductCard: React.FC<{ product: StorefrontProductItem; onClick: () => void }> = ({ product, onClick }) => {
  const images = Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls : ['https://via.placeholder.com/600x400?text=Product'];
  const [idx, setIdx] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(t);
  }, [images.length]);

  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: 3,
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          '& .product-image': {
            transform: 'scale(1.05)'
          }
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardActionArea 
        onClick={onClick} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch',
          p: 0
        }}
      >
        <Box sx={{ 
          position: 'relative', 
          height: 240,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
          {images.map((src, i) => (
            <Box
              key={i}
              component="img"
              className="product-image"
              src={src}
              alt={product.title}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: i === idx ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          ))}
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Box sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: '#ff4757',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 700,
              zIndex: 2
            }}>
              -{discountPercentage}%
            </Box>
          )}

          {/* Wishlist Button */}
          <Box sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 2
          }}>
            <IconButton 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: 'white' }
              }}
            >
              <StarIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Quick View Overlay */}
          {isHovered && (
            <Box sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              zIndex: 2
            }}>
              <Button
                variant="contained"
                size="small"
                fullWidth
                sx={{
                  bgcolor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.9)'
                  }
                }}
              >
                Quick View
              </Button>
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography 
            variant="h6" 
            fontWeight={700} 
            sx={{ 
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3
            }}
          >
            {product.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Box sx={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              bgcolor: '#667eea' 
            }} />
            {product.vendor?.name || 'Brand'}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight={800} color="primary">
              ${(product.price / 100).toFixed(2)}
            </Typography>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  textDecoration: 'line-through',
                  opacity: 0.7
                }}
              >
                ${(product.compareAtPrice / 100).toFixed(2)}
              </Typography>
            )}
          </Stack>

          {/* Rating */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
            <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
            <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
            <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
            <StarIcon sx={{ fontSize: 16, color: '#e0e0e0' }} />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              (4.0)
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
