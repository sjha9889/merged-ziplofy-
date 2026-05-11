import { Link } from 'react-router-dom';
import { useStorefrontAuth, useStorefrontCart } from '@render-store/sdk';

export const GamingHeader = () => {
  const { user, logout } = useStorefrontAuth();
  const { getAllItems } = useStorefrontCart();
  const cartCount = getAllItems().reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header style={{ borderBottom: '1px solid #2a2a2a', background: '#090909', color: '#f3f3f3', padding: '12px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ color: '#7cf7b1', textDecoration: 'none', fontWeight: 800 }}>
          ZIPLOFY GAMING
        </Link>
        <nav style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Link to="/" style={{ color: '#f3f3f3' }}>
            Home
          </Link>
          <Link to="/my-orders" style={{ color: '#f3f3f3' }}>
            Orders
          </Link>
          <Link to="/profile" style={{ color: '#f3f3f3' }}>
            Profile
          </Link>
          <Link to="/preferences" style={{ color: '#f3f3f3' }}>
            Preferences
          </Link>
          <Link to="/cart" style={{ color: '#f9d66e', textDecoration: 'none', fontWeight: 700 }}>
            Cart: {cartCount}
          </Link>
          {user ? (
            <button
              type="button"
              onClick={() => void logout()}
              style={{ background: '#7cf7b1', border: 0, padding: '8px 10px', cursor: 'pointer' }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/auth/login" style={{ color: '#7cf7b1' }}>
                Login
              </Link>
              <Link to="/auth/signup" style={{ color: '#7cf7b1' }}>
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
