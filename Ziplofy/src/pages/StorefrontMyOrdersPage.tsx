import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StorefrontNavbar from '../components/StorefrontNavbar';
import { useStorefrontAuth } from '../contexts/storefront/storefront-auth.context';
import { useStorefrontOrder } from '../contexts/storefront/storefront-order.context';

const NAVBAR_HEIGHT = 64;

const StorefrontMyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useStorefrontAuth();
  const { orders, loading, error, getOrdersByCustomerId } = useStorefrontOrder();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?._id) {
      getOrdersByCustomerId(user._id).catch(() => {
        // Error handling is done in context
      });
    }
  }, [user?._id, getOrdersByCustomerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', color: '#111', minHeight: '100vh' }}>
      <StorefrontNavbar />
      
      <Container maxWidth="lg" sx={{ pt: `${NAVBAR_HEIGHT + 16}px`, pb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#111' }}>
          My Orders
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View and track all your orders.
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && orders.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
            }}
          >
            <ShoppingBagIcon
              sx={{
                fontSize: 80,
                color: 'text.secondary',
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't placed any orders. Start shopping to see your orders here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#667eea',
                '&:hover': {
                  bgcolor: '#5568d3',
                },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        )}

        {!loading && !error && orders.length > 0 && (
          <Stack spacing={2}>
            {orders.map((order) => (
              <Card
                key={order._id}
                variant="outlined"
                sx={{
                  '&:hover': {
                    boxShadow: 2,
                    transition: 'box-shadow 0.2s ease',
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    {/* Order Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Placed on {formatDate(order.orderDate)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                        <Chip
                          label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          color={order.paymentStatus === 'paid' ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Divider />

                    {/* Order Items */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        Items ({order.items.length})
                      </Typography>
                      <Stack spacing={1}>
                        {order.items.map((item) => (
                          <Box
                            key={item._id}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 1,
                              px: 2,
                              bgcolor: '#fafafa',
                              borderRadius: 1,
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={500}>
                                {typeof item.productVariantId === 'object' && item.productVariantId
                                  ? item.productVariantId.sku || 'Product'
                                  : 'Product'}
                              </Typography>
                              {typeof item.productVariantId === 'object' &&
                                item.productVariantId &&
                                Object.keys(item.productVariantId.optionValues || {}).length > 0 && (
                                  <Typography variant="caption" color="text.secondary">
                                    {Object.entries(item.productVariantId.optionValues)
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(', ')}
                                  </Typography>
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                              Qty: {item.quantity}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {formatCurrency(item.total)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Order Summary */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Box>
                        {order.shippingAddressId && (
                          <Typography variant="caption" color="text.secondary">
                            Shipping to:{' '}
                            {order.shippingAddressId.city}, {order.shippingAddressId.state}
                          </Typography>
                        )}
                      </Box>
                      <Stack spacing={0.5} sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Typography variant="body2" color="text.secondary">
                            Subtotal:
                          </Typography>
                          <Typography variant="body2">{formatCurrency(order.subtotal)}</Typography>
                        </Box>
                        {order.tax > 0 && (
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Typography variant="body2" color="text.secondary">
                              Tax:
                            </Typography>
                            <Typography variant="body2">{formatCurrency(order.tax)}</Typography>
                          </Box>
                        )}
                        {order.shippingCost > 0 && (
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Typography variant="body2" color="text.secondary">
                              Shipping:
                            </Typography>
                            <Typography variant="body2">{formatCurrency(order.shippingCost)}</Typography>
                          </Box>
                        )}
                        <Divider sx={{ my: 0.5 }} />
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Typography variant="body1" fontWeight={700}>
                            Total:
                          </Typography>
                          <Typography variant="body1" fontWeight={700}>
                            {formatCurrency(order.total)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {order.notes && (
                      <>
                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                          <strong>Note:</strong> {order.notes}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default StorefrontMyOrdersPage;

