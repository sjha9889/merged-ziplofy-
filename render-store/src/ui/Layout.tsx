import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import CartDrawer from '../components/CartDrawer';
import { SwissWristHeader } from '../components/SwissWristHeader';
import { SwissWristFooter } from '../components/SwissWristFooter';

export function Layout({ children }: { children: ReactNode }) {
  const { storeFrontMeta } = useStorefront();
  const { user, logout } = useStorefrontAuth();
  const { items, guestItems, isGuest } = useStorefrontCart();
  const [cartOpen, setCartOpen] = useState(false);

  const displayItems = isGuest ? guestItems : items;
  const totalItems = displayItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handler = () => setCartOpen(true);
    window.addEventListener('open-cart-drawer', handler as EventListener);
    return () => window.removeEventListener('open-cart-drawer', handler as EventListener);
  }, []);

  const storeName = storeFrontMeta?.name || 'Store';

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <SwissWristHeader
        storeName={storeName}
        user={user}
        totalItems={totalItems}
        onOpenCart={() => setCartOpen(true)}
        onLogout={handleLogout}
      />

      {children}

      <SwissWristFooter storeName={storeName} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
