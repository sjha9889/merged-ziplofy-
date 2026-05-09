import { Link } from 'react-router-dom';

export function WishlistPage() {
  return (
    <main className="wishlist-page">
      <div className="wishlist-inner">
        <nav className="wishlist-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="wishlist-breadcrumb-sep">•</span>
          <span className="wishlist-breadcrumb-current">Wishlist</span>
        </nav>
        <div className="wishlist-header-row">
          <h1 className="wishlist-title">Product Wishlist</h1>
        </div>
        <div className="wishlist-table-wrap">
          <table className="wishlist-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock Status</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Buy Action</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr className="wishlist-row">
                <td data-label="Product">
                  <div className="wishlist-product">
                    <Link to="/products" className="wishlist-product-link">
                      <div
                        className="wishlist-product-img flex items-center justify-center bg-neutral-100 text-xs text-neutral-500"
                        aria-hidden
                      >
                        —
                      </div>
                      <div className="wishlist-product-details">
                        <span className="wishlist-product-name">Add items from the shop to your wishlist</span>
                      </div>
                    </Link>
                  </div>
                </td>
                <td data-label="Stock"><span className="wishlist-product-stock">—</span></td>
                <td data-label="Price">—</td>
                <td data-label="Quantity">—</td>
                <td data-label="Buy Action">—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="wishlist-empty-msg">
          <p>Your wishlist is empty. <Link to="/products">Continue shopping</Link></p>
        </div>
      </div>
    </main>
  );
}
