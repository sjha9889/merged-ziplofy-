import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { StorefrontProvider } from './contexts/store.context';
import { StorefrontAuthProvider, useStorefrontAuth } from './contexts/storefront-auth.context';
import { StorefrontProductVariantProvider } from './contexts/product-variant.context';
import { StorefrontCartProvider } from './contexts/storefront-cart.context';
import { StorefrontOrderProvider } from './contexts/storefront-order.context';
import { CustomerAddressProvider } from './contexts/customer-address-storefront.context';
import { StorefrontCollectionsProvider } from './contexts/storefront-collections.context';
import { AmountOffOrderProvider } from './contexts/amount-off-order.context';
import { FreeShippingProvider } from './contexts/storefront-free-shipping.context';
import StorefrontApp from './pages/StorefrontApp';
import StorefrontCollectionPage from './pages/StorefrontCollectionPage';
import StorefrontForgotPasswordPage from './pages/StorefrontForgotPasswordPage';
import StorefrontLoginPage from './pages/StorefrontLoginPage';
import StorefrontMyOrdersPage from './pages/StorefrontMyOrdersPage';
import StorefrontProductDetailPage from './pages/StorefrontProductDetailPage';
import StorefrontProfilePage from './pages/StorefrontProfilePage';
import StorefrontResetPasswordPage from './pages/StorefrontResetPasswordPage';
import StorefrontSignupPage from './pages/StorefrontSignupPage';

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStorefrontAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);
  return user ? null : <>{children}</>;
};

const RedirectToHome: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  return null;
};

const StorefrontRoutes: React.FC = () => (
  <Router>
    <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#363636', color: '#fff' } }} />
    <Routes>
      <Route path="/" element={<StorefrontApp />} />
      <Route path="/products/:id" element={<StorefrontProductDetailPage />} />
      <Route path="/auth/login" element={<AuthRoute><StorefrontLoginPage /></AuthRoute>} />
      <Route path="/auth/signup" element={<AuthRoute><StorefrontSignupPage /></AuthRoute>} />
      <Route path="/auth/forgot-password" element={<AuthRoute><StorefrontForgotPasswordPage /></AuthRoute>} />
      <Route path="/auth/reset-password" element={<AuthRoute><StorefrontResetPasswordPage /></AuthRoute>} />
      <Route path="/profile" element={<StorefrontProfilePage />} />
      <Route path="/my-orders" element={<StorefrontMyOrdersPage />} />
      <Route path="/collections/:collectionId/:urlHandle" element={<StorefrontCollectionPage />} />
      <Route path="*" element={<RedirectToHome />} />
    </Routes>
  </Router>
);

function App() {
  return (
    <StorefrontProvider>
      <StorefrontAuthProvider>
        <StorefrontProductVariantProvider>
          <StorefrontCartProvider>
            <StorefrontOrderProvider>
              <CustomerAddressProvider>
                <StorefrontCollectionsProvider>
                  <AmountOffOrderProvider>
                    <FreeShippingProvider>
                      <StorefrontRoutes />
                    </FreeShippingProvider>
                  </AmountOffOrderProvider>
                </StorefrontCollectionsProvider>
              </CustomerAddressProvider>
            </StorefrontOrderProvider>
          </StorefrontCartProvider>
        </StorefrontProductVariantProvider>
      </StorefrontAuthProvider>
    </StorefrontProvider>
  );
}

export default App;
