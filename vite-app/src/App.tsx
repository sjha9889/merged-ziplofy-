import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ContactPage } from './pages/ContactPage'
import { BlogPage } from './pages/BlogPage'
import { BlogDetailPage } from './pages/BlogDetailPage'
import { reinitThemeRuntime } from './theme/themeRuntime'
import { CategoryPage } from './pages/CategoryPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { WishlistPage } from './pages/WishlistPage'
import { AccountPage } from './pages/AccountPage'
import { OrderSuccessPage } from './pages/OrderSuccessPage'
import { Layout } from './ui/Layout'
import { HomePage } from './pages/HomePage'

function ScrollToTopOnNav() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])
  return null
}

function ThemeRuntimeOnRouteChange() {
  const location = useLocation()
  useEffect(() => {
    reinitThemeRuntime()
  }, [location.pathname])
  return null
}

function LayoutShell() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNav />
      <ThemeRuntimeOnRouteChange />
      <Routes>
        <Route element={<LayoutShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog-detail" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Backwards-compatible .html routes */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/category.html" element={<Navigate to="/category" replace />} />
        <Route path="/product.html" element={<Navigate to="/product" replace />} />
        <Route path="/cart.html" element={<Navigate to="/cart" replace />} />
        <Route path="/checkout.html" element={<Navigate to="/checkout" replace />} />
        <Route path="/order-success.html" element={<Navigate to="/order-success" replace />} />
        <Route path="/wishlist.html" element={<Navigate to="/wishlist" replace />} />
        <Route path="/account.html" element={<Navigate to="/account" replace />} />
        <Route path="/blog.html" element={<Navigate to="/blog" replace />} />
        <Route path="/blog-detail.html" element={<Navigate to="/blog-detail" replace />} />
        <Route path="/contact.html" element={<Navigate to="/contact" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
