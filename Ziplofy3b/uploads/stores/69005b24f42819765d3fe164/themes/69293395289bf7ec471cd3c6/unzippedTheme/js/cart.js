document.addEventListener('DOMContentLoaded', function () {
  const state = {
    items: []
  };

  initializeCart(state);
  bindCartEvents(state);
});

function initializeCart(state) {
  state.items = getCartItemsFromQuery();
  if (!state.items.length && typeof getAllProducts === 'function') {
    const allProducts = getAllProducts();
    state.items = allProducts.slice(0, 2).map(function (product, index) {
      return {
        product: product,
        quantity: index === 0 ? 1 : 2
      };
    });
  }
  renderCart(state);
}

function getCartItemsFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const ids = params.getAll('id');
  const qtys = params.getAll('qty');
  const items = [];

  if (!ids.length || typeof getProductById !== 'function') {
    return items;
  }

  ids.forEach(function (id, idx) {
    const product = getProductById(id);
    if (!product) return;
    const qty = parseQuantityValue(qtys[idx] || qtys[0]);
    items.push({ product: product, quantity: qty });
  });

  return items;
}

function bindCartEvents(state) {
  const tableBody = document.getElementById('cart-items-body');
  const updateBtn = document.getElementById('cart-update-btn');
  const clearBtn = document.getElementById('cart-clear-btn');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  if (tableBody) {
    tableBody.addEventListener('click', function (event) {
      const row = event.target.closest('tr[data-id]');
      if (!row) return;
      const id = row.getAttribute('data-id');

      if (event.target.closest('.qty-up')) {
        updateItemQuantity(state, id, getItemQuantity(state, id) + 1);
      } else if (event.target.closest('.qty-down')) {
        updateItemQuantity(state, id, getItemQuantity(state, id) - 1);
      } else if (event.target.closest('.cart-remove-btn')) {
        removeCartItem(state, id);
      }
    });

    tableBody.addEventListener('change', function (event) {
      if (event.target.classList.contains('qty-input')) {
        const row = event.target.closest('tr[data-id]');
        if (!row) return;
        const id = row.getAttribute('data-id');
        updateItemQuantity(state, id, parseQuantityValue(event.target.value));
      }
    });
  }

  if (updateBtn) {
    updateBtn.addEventListener('click', function () {
      renderCart(state);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      state.items = [];
      renderCart(state);
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      if (!state.items.length) return;
      const params = new URLSearchParams();
      state.items.forEach(function (entry) {
        params.append('id', entry.product.id);
        params.append('qty', entry.quantity);
      });
      window.location.href = 'checkout.html?' + params.toString();
    });
  }
}

function updateItemQuantity(state, id, value) {
  state.items = state.items.map(function (entry) {
    if (String(entry.product.id) === String(id)) {
      entry.quantity = clampQuantity(value);
    }
    return entry;
  }).filter(function (entry) {
    return entry.quantity > 0;
  });
  renderCart(state);
}

function removeCartItem(state, id) {
  state.items = state.items.filter(function (entry) {
    return String(entry.product.id) !== String(id);
  });
  renderCart(state);
}

function getItemQuantity(state, id) {
  const entry = state.items.find(function (item) {
    return String(item.product.id) === String(id);
  });
  return entry ? entry.quantity : 0;
}

function renderCart(state) {
  const body = document.getElementById('cart-items-body');
  if (!body) return;

  if (!state.items.length) {
    body.innerHTML = '<tr class="cart-empty-state"><td colspan="5"><div class="empty-cart">' +
      '<div class="empty-icon"><i class="fa fa-shopping-bag"></i></div>' +
      '<h4>Your cart is empty</h4>' +
      '<p>Add some products to continue shopping.</p>' +
      '<a href="index.html" class="primary-btn">Start Shopping</a>' +
      '</div></td></tr>';
    updateSummary(state);
    toggleCheckout(false);
    return;
  }

  body.innerHTML = state.items.map(function (entry) {
    var product = entry.product;
    return '<tr data-id="' + product.id + '">' +
      '<td>' +
      '<div class="cart-product">' +
      '<div class="cart-product-img"><img src="' + (product.image || 'assets/img/product01.png') + '" alt="' + product.title + '"></div>' +
      '<div class="cart-product-info">' +
      '<h4 class="cart-product-name">' + product.title + '</h4>' +
      '<p class="cart-product-category">' + (product.categoryLabel || product.category || 'Category') + '</p>' +
      '</div>' +
      '</div>' +
      '</td>' +
      '<td class="cart-price">₹' + formatPrice(product.price) + '</td>' +
      '<td>' +
      '<div class="cart-quantity">' +
      '<div class="quantity">' +
      '<button class="qty-btn qty-down" type="button"><i class="fa fa-minus"></i></button>' +
      '<input type="number" class="qty-input" min="1" max="10" value="' + entry.quantity + '">' +
      '<button class="qty-btn qty-up" type="button"><i class="fa fa-plus"></i></button>' +
      '</div>' +
      '</div>' +
      '</td>' +
      '<td class="cart-total">₹' + formatPrice(product.price * entry.quantity) + '</td>' +
      '<td>' +
      '<button class="cart-remove-btn" type="button"><i class="fa fa-trash"></i></button>' +
      '</td>' +
      '</tr>';
  }).join('');

  updateSummary(state);
  toggleCheckout(true);
}

function updateSummary(state) {
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-total');

  var subtotal = state.items.reduce(function (sum, entry) {
    return sum + entry.product.price * entry.quantity;
  }, 0);

  var shipping = subtotal >= 5000 ? 0 : (state.items.length ? 99 : 0);
  var tax = subtotal * 0.18;
  var total = subtotal + shipping + tax;

  if (subtotalEl) subtotalEl.textContent = '₹' + formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping ? '₹' + formatPrice(shipping) : 'FREE';
  if (taxEl) taxEl.textContent = '₹' + formatPrice(tax);
  if (totalEl) totalEl.textContent = '₹' + formatPrice(total);
}

function toggleCheckout(enabled) {
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (!checkoutBtn) return;
  checkoutBtn.disabled = !enabled;
}

function parseQuantityValue(value) {
  var qty = parseInt(value, 10);
  if (isNaN(qty) || qty < 1) return 1;
  return qty;
}

function clampQuantity(value) {
  return Math.max(1, Math.min(10, value));
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

