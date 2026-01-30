document.addEventListener('DOMContentLoaded', function () {
  var state = {
    items: []
  };

  initWishlist(state);
  bindWishlistActions(state);
});

function initWishlist(state) {
  state.items = getWishlistItemsFromQuery();
  if (!state.items.length && typeof getAllProducts === 'function') {
    state.items = getAllProducts().slice(0, 6).map(function (product) {
      return { product: product };
    });
  }
  renderWishlist(state);
}

function getWishlistItemsFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const ids = params.getAll('id');
  if (!ids.length || typeof getProductById !== 'function') return [];
  return ids.map(function (id) {
    return { product: getProductById(id) };
  }).filter(function (entry) { return entry.product; });
}

function bindWishlistActions(state) {
  var grid = document.getElementById('wishlist-grid');
  var clearBtn = document.getElementById('wishlist-clear-btn');
  var addAllBtn = document.getElementById('wishlist-add-all-btn');

  if (grid) {
    grid.addEventListener('click', function (event) {
      var card = event.target.closest('.wishlist-item[data-id]');
      if (!card) return;
      var id = card.getAttribute('data-id');

      if (event.target.closest('.wishlist-remove-btn')) {
        state.items = state.items.filter(function (entry) {
          return String(entry.product.id) !== String(id);
        });
        renderWishlist(state);
      } else if (event.target.closest('.wishlist-add-btn')) {
        redirectToCart(id);
      } else if (event.target.closest('.wishlist-quick-view')) {
        window.location.href = 'product.html?id=' + encodeURIComponent(id);
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      state.items = [];
      renderWishlist(state);
    });
  }

  if (addAllBtn) {
    addAllBtn.addEventListener('click', function () {
      if (!state.items.length) return;
      var params = new URLSearchParams();
      state.items.forEach(function (entry) {
        params.append('id', entry.product.id);
        params.append('qty', 1);
      });
      window.location.href = 'cart.html?' + params.toString();
    });
  }
}

function renderWishlist(state) {
  var grid = document.getElementById('wishlist-grid');
  if (!grid) return;

  if (!state.items.length) {
    grid.innerHTML = '<div class="cart-empty-state"><div class="empty-cart">' +
      '<div class="empty-icon"><i class="fa fa-heart-o"></i></div>' +
      '<h4>Your wishlist is empty</h4>' +
      '<p>Save your favourite products to view them later.</p>' +
      '<a href="index.html" class="primary-btn">Browse Products</a>' +
      '</div></div>';
    return;
  }

  grid.innerHTML = state.items.map(function (entry) {
    var product = entry.product;
    return '<div class="wishlist-item" data-id="' + product.id + '">' +
      '<div class="wishlist-item-img">' +
      '<img src="' + (product.image || 'assets/img/product01.png') + '" alt="' + product.title + '">' +
      '<div class="wishlist-item-overlay">' +
      '<button class="wishlist-remove-btn" title="Remove from Wishlist"><i class="fa fa-heart"></i></button>' +
      '</div>' +
      '</div>' +
      '<div class="wishlist-item-info">' +
      '<h4 class="wishlist-item-name">' + product.title + '</h4>' +
      '<p class="wishlist-item-category">' + (product.categoryLabel || product.category || 'Category') + '</p>' +
      '<div class="wishlist-item-rating">' + renderStars(product.rating) + '</div>' +
      '<div class="wishlist-item-price">₹' + formatPrice(product.price) + '</div>' +
      '<div class="wishlist-item-actions">' +
      '<button class="btn btn-primary btn-sm wishlist-add-btn">Add to Cart</button>' +
      '<button class="btn btn-outline-secondary btn-sm wishlist-quick-view">Details</button>' +
      '</div>' +
      '</div>' +
      '</div>';
  }).join('');
}

function redirectToCart(productId) {
  var params = new URLSearchParams();
  params.append('id', productId);
  params.append('qty', 1);
  window.location.href = 'cart.html?' + params.toString();
}

function renderStars(rating) {
  var rounded = Math.round(rating || 0);
  var stars = '';
  for (var i = 1; i <= 5; i++) {
    stars += '<i class="fa ' + (i <= rounded ? 'fa-star' : 'fa-star-o') + '"></i>';
  }
  return stars;
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

