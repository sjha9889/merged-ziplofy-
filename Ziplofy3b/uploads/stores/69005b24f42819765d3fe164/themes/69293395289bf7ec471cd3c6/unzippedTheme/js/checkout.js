document.addEventListener('DOMContentLoaded', function () {
  var items = buildCheckoutItems();
  renderCheckoutSummary(items);
  bindPlaceOrder();
});

function buildCheckoutItems() {
  var params = new URLSearchParams(window.location.search);
  var ids = params.getAll('id');
  var qtys = params.getAll('qty');
  var items = [];

  if (ids.length && typeof getProductById === 'function') {
    ids.forEach(function (id, index) {
      var product = getProductById(id);
      if (!product) {
        return;
      }
      var qty = parseQuantity(qtys[index] || qtys[0]);
      items.push({ product: product, quantity: qty });
    });
  }

  if (!items.length && typeof getAllProducts === 'function') {
    var fallback = getAllProducts()[0];
    if (fallback) {
      items.push({ product: fallback, quantity: 1 });
    }
  }

  return items;
}

function parseQuantity(raw) {
  var qty = parseInt(raw, 10);
  if (isNaN(qty) || qty < 1) return 1;
  return Math.min(qty, 10);
}

function renderCheckoutSummary(items) {
  var productsContainer = document.getElementById('checkout-order-products');
  var itemsCountEl = document.getElementById('checkout-items-count');
  var subtotalEl = document.getElementById('checkout-subtotal');
  var totalEl = document.getElementById('checkout-total');
  var shippingEl = document.getElementById('checkout-shipping');

  if (!items.length) {
    if (productsContainer) {
      productsContainer.innerHTML = '<div class="order-col"><div>Your cart is empty.</div><div>₹0</div></div>';
    }
    if (itemsCountEl) itemsCountEl.textContent = '0 Items';
    if (subtotalEl) subtotalEl.textContent = 'Subtotal: ₹0';
    if (totalEl) totalEl.textContent = '₹0';
    if (shippingEl) shippingEl.textContent = 'FREE';
    return;
  }

  var subtotal = items.reduce(function (sum, item) {
    return sum + item.product.price * item.quantity;
  }, 0);
  var shippingCost = 0;

  if (productsContainer) {
    productsContainer.innerHTML = items.map(function (item) {
      return '<div class="order-col">' +
        '<div>' + item.quantity + 'x ' + item.product.title + '</div>' +
        '<div>₹' + formatPrice(item.product.price * item.quantity) + '</div>' +
        '</div>';
    }).join('');
  }

  if (itemsCountEl) {
    var totalUnits = items.reduce(function (sum, entry) { return sum + entry.quantity; }, 0);
    itemsCountEl.textContent = totalUnits + (totalUnits === 1 ? ' Item' : ' Items');
  }

  if (subtotalEl) subtotalEl.textContent = 'Subtotal: ₹' + formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shippingCost ? '₹' + formatPrice(shippingCost) : 'FREE';
  if (totalEl) totalEl.textContent = '₹' + formatPrice(subtotal + shippingCost);

  renderReviewCard(items[0]);
}

function renderReviewCard(item) {
  if (!item) return;
  var product = item.product;
  var qty = item.quantity;

  var imageEl = document.getElementById('checkout-product-image');
  var titleEl = document.getElementById('checkout-product-title');
  var descEl = document.getElementById('checkout-product-desc');
  var badgeEl = document.getElementById('checkout-product-badge');
  var tagsEl = document.getElementById('checkout-review-tags');

  if (imageEl) imageEl.src = product.image || 'assets/img/product01.png';
  if (titleEl) titleEl.textContent = product.title || 'Selected product';
  if (descEl) {
    descEl.textContent = product.shortDescription || product.description || 'Ready to ship.';
  }
  if (badgeEl) {
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.style.display = 'inline-block';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  if (tagsEl) {
    var tags = [];
    tags.push('Qty: ' + qty);
    if (product.colors && product.colors.length) {
      tags.push('Color: ' + product.colors[0]);
    }
    if (product.sizes && product.sizes.length) {
      tags.push('Size: ' + product.sizes[0]);
    }
    tags.push('Price: ₹' + formatPrice(product.price));
    tagsEl.innerHTML = tags.map(function (tag) {
      return '<span class="review-tag">' + tag + '</span>';
    }).join('');
  }
}

function bindPlaceOrder() {
  var termsCheckbox = document.getElementById('terms');
  var placeOrderBtn = document.getElementById('checkout-place-order');
  var paymentRadios = document.querySelectorAll('input[name="payment"]');
  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (termsCheckbox && !termsCheckbox.checked) {
      alert('Please accept the terms & conditions to place the order.');
      return;
    }
    var selectedPayment = Array.from(paymentRadios).find(function (radio) {
      return radio.checked;
    });
    if (!selectedPayment) {
      alert('Please choose a payment method.');
      return;
    }

    placeOrderBtn.classList.add('loading');
    placeOrderBtn.textContent = 'Processing...';
    setTimeout(function () {
      window.location.href = 'dashboard/orders.html?payment=' + encodeURIComponent(selectedPayment.value);
    }, 800);
  });
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

