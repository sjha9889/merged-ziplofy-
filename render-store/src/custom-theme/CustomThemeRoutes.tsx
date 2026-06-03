import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { StorefrontCollectionByUrlHandleLoader } from '../components/StorefrontCollectionByUrlHandleLoader.tsx';
import { CustomThemeTemplatePage } from '@ziplofy/create-theme/runtime';

const CustomThemeHomeRoute = () => <CustomThemeTemplatePage templateId="index" />;

const CustomThemeProductRoute = () => (
  <CustomThemeTemplatePage templateId="product" fallbackSectionIds={['product_main']} />
);

const CustomThemeCartRoute = () => (
  <CustomThemeTemplatePage templateId="cart" fallbackSectionIds={['cart_main']} />
);

const CustomThemeAuthRoute = () => (
  <CustomThemeTemplatePage templateId="login" fallbackSectionIds={['login_main']} />
);

export function CustomThemeRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomThemeHomeRoute />} />
        <Route path="/products" element={<CustomThemeHomeRoute />} />
        <Route path="/products/:id" element={<CustomThemeProductRoute />} />
        <Route path="/collection" element={<CustomThemeHomeRoute />} />
        <Route
          path="/collections/:urlHandle"
          element={
            <>
              <StorefrontCollectionByUrlHandleLoader />
              <CustomThemeHomeRoute />
            </>
          }
        />
        <Route path="/auth/login" element={<CustomThemeAuthRoute />} />
        <Route path="/auth/signup" element={<CustomThemeAuthRoute />} />
        <Route path="/auth/forgot" element={<CustomThemeAuthRoute />} />
        <Route path="/profile" element={<CustomThemeAuthRoute />} />
        <Route path="/my-orders" element={<CustomThemeAuthRoute />} />
        <Route path="/preferences" element={<CustomThemeAuthRoute />} />
        <Route path="/cart" element={<CustomThemeCartRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
