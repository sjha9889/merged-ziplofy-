// Header badges update utility
// This file can be included on pages that don't load featured-products.js

function updateHeaderBadges() {
  var CART_STORAGE_KEY = 'theme6_cart_items';
  var WISHLIST_STORAGE_KEY = 'theme6_wishlist_items';
  
  // Update cart badge
  var cartBadge = document.querySelector('a[href="cart.html"] .badge');
  if (cartBadge) {
    try {
      var cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
      cart = Array.isArray(cart) ? cart : [];
      var cartCount = cart.length > 0 ? cart.reduce(function(sum, item) {
        return sum + (item.quantity || 1);
      }, 0) : 0;
      cartBadge.textContent = cartCount;
      cartBadge.style.display = 'inline';
    } catch (error) {
      cartBadge.textContent = '0';
      cartBadge.style.display = 'inline';
    }
  }

  // Update wishlist badge
  var wishlistBadge = document.querySelector('a[href="wishlist.html"] .badge');
  if (wishlistBadge) {
    try {
      var wishlist = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY));
      var wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
      wishlistBadge.textContent = wishlistCount;
      wishlistBadge.style.display = 'inline';
    } catch (error) {
      wishlistBadge.textContent = '0';
      wishlistBadge.style.display = 'inline';
    }
  }
}

// Auto-update on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateHeaderBadges);
} else {
  updateHeaderBadges();
}

