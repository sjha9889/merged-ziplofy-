import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AmountOffOrderProvider } from './contexts/amount-off-order.context';
import { CustomerAddressProvider } from './contexts/customer-address-storefront.context';
import { StorefrontProductVariantProvider } from './contexts/product-variant.context';
import { StorefrontProvider, useStorefront } from './contexts/store.context';
import { StorefrontAuthProvider, useStorefrontAuth } from './contexts/storefront-auth.context';
import { StorefrontCartProvider } from './contexts/storefront-cart.context';
import { StorefrontCollectionsProvider } from './contexts/storefront-collections.context';
import { FreeShippingProvider } from './contexts/storefront-free-shipping.context';
import { StorefrontOrderProvider } from './contexts/storefront-order.context';
import ScrollToTop from './components/ScrollToTop';
import "./index.css";
import StorefrontApp from './pages/StorefrontApp';
import StorefrontCollectionPage from './pages/StorefrontCollectionPage';
import StorefrontForgotPasswordPage from './pages/StorefrontForgotPasswordPage';
import StorefrontLoginPage from './pages/StorefrontLoginPage';
import StorefrontMyOrdersPage from './pages/StorefrontMyOrdersPage.tsx';
import StorefrontProductDetailPage from './pages/StorefrontProductDetailPage';
import StorefrontProfilePage from './pages/StorefrontProfilePage';
import StorefrontResetPasswordPage from './pages/StorefrontResetPasswordPage';
import StorefrontSignupPage from './pages/StorefrontSignupPage';

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, checkAuth, loading } = useStorefrontAuth();
  
  // Check auth on mount to ensure user state is initialized
  useEffect(() => {
    checkAuth().catch(() => {});
  }, [checkAuth]);
  
  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fefcf8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e8e0d5] border-t-[#d4af37]" />
      </div>
    );
  }
  
  // If user is logged in, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, show the auth page (login/signup)
  return <>{children}</>;
};

const RedirectToHome: React.FC = () => {
  return <Navigate to="/" replace />;
};

const StorefrontRoutes: React.FC = () => (
  <Router>
    <ScrollToTop />
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

const StorefrontEntry: React.FC = () => {
  const { isStoreFront, storeFrontChecked, storeFrontMeta } = useStorefront();

  if (!storeFrontChecked) {
    return null;
  }

  if (!isStoreFront || !storeFrontMeta) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white px-6 py-4 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Store not found</h1>
          <p className="mt-1 text-sm text-gray-500">This store URL is not connected to any storefront.</p>
        </div>
      </div>
    );
  }

  return <StorefrontRoutes />;
};

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
                      <StorefrontEntry />
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
