// Cart page functionality
function renderCart() {
  if (!window.liquidjs || typeof PRODUCTS === 'undefined') {
    setTimeout(renderCart, 100);
    return;
  }

  var cartItems = loadCart();
  if (cartItems.length === 0) {
    document.getElementById('cart-items-container').innerHTML = 
      '<div class="text-center" style="padding: 40px;"><p>Your cart is empty. <a href="shop.html">Continue shopping</a>.</p></div>';
    document.getElementById('cart-subtotal').textContent = '£0.00';
    document.getElementById('cart-total').textContent = '£0.00';
    return;
  }

  var currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  var subtotal = 0;
  var items = cartItems.map(function(entry) {
    var product = PRODUCTS.find(function(p) {
      return String(p.id) === String(entry.id);
    }) || entry;

    var priceValue = typeof product.price === 'number' ? product.price : 0;
    var quantityValue = entry.quantity || 1;
    var lineTotal = priceValue * quantityValue;
    subtotal += lineTotal;

    return {
      id: product.id,
      title: product.title,
      image: product.image || entry.image,
      quantity: quantityValue,
      priceFormatted: currencyFormatter.format(priceValue),
      lineTotalFormatted: currencyFormatter.format(lineTotal)
    };
  });

  var engine = new liquidjs.Liquid({
    root: ['templates/'],
    extname: '.liquid'
  });

  var templateNode = document.getElementById('cart-items-template');
  var targetNode = document.getElementById('cart-items-container');

  if (templateNode && targetNode) {
    engine
      .parseAndRender(templateNode.textContent, { items: items })
      .then(function(html) {
        targetNode.innerHTML = html;
        
        // Update totals
        document.getElementById('cart-subtotal').textContent = currencyFormatter.format(subtotal);
        document.getElementById('cart-total').textContent = currencyFormatter.format(subtotal);

        // Attach cart controls
        attachCartControls();
      })
      .catch(function(error) {
        console.error('Failed to render cart', error);
      });
  }
}

function attachCartControls() {
  var container = document.getElementById('cart-items-container');
  
  container.addEventListener('click', function(event) {
    var target = event.target.closest('[data-action]');
    if (!target) return;

    var action = target.getAttribute('data-action');
    var productId = target.getAttribute('data-product-id');
    var cart = loadCart();

    if (action === 'remove') {
      cart = cart.filter(function(item) {
        return String(item.id) !== String(productId);
      });
      saveCart(cart);
      updateHeaderBadges();
      renderCart();
    } else if (action === 'increase') {
      var item = cart.find(function(i) {
        return String(i.id) === String(productId);
      });
      if (item) {
        item.quantity = (item.quantity || 1) + 1;
        saveCart(cart);
        renderCart();
      }
    } else if (action === 'decrease') {
      var item = cart.find(function(i) {
        return String(i.id) === String(productId);
      });
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart(cart);
        updateHeaderBadges();
        renderCart();
      }
    }
  });

  container.addEventListener('change', function(event) {
    if (event.target.classList.contains('cart-qty-input')) {
      var productId = event.target.getAttribute('data-product-id');
      var newQty = parseInt(event.target.value, 10) || 1;
      
      var cart = loadCart();
      var item = cart.find(function(i) {
        return String(i.id) === String(productId);
      });
      
      if (item && newQty > 0) {
        item.quantity = newQty;
        saveCart(cart);
        updateHeaderBadges();
        renderCart();
      }
    }
  });
}

function renderRecentlyViewed() {
  if (!window.liquidjs || typeof PRODUCTS === 'undefined') {
    setTimeout(renderRecentlyViewed, 100);
    return;
  }

  var recentProducts = PRODUCTS.slice(0, 2);

  var currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  var formatted = recentProducts.map(function(product) {
    var priceValue = typeof product.price === 'number' ? product.price : 0;
    var originalPriceValue = typeof product.originalPrice === 'number' ? product.originalPrice : null;
    return Object.assign({}, product, {
      priceFormatted: currencyFormatter.format(priceValue),
      originalPriceFormatted: originalPriceValue ? currencyFormatter.format(originalPriceValue) : null,
      discountLabel: product.discount ? product.discount + '% OFF' : ''
    });
  });

  var engine = new liquidjs.Liquid({
    root: ['templates/'],
    extname: '.liquid'
  });

  var templateNode = document.getElementById('recently-viewed-template');
  var targetNode = document.getElementById('recently-viewed');

  if (templateNode && targetNode) {
    engine
      .parseAndRender(templateNode.textContent, { products: formatted })
      .then(function(html) {
        targetNode.innerHTML = html;
        
        if (window.attachProductActions) {
          var productsById = {};
          formatted.forEach(function(p) {
            productsById[p.id] = p;
          });
          attachProductActions(targetNode, productsById);
        }
      })
      .catch(function(error) {
        console.error('Failed to render recently viewed', error);
      });
  }
}

// Initialize on page load
renderCart();
renderRecentlyViewed();
updateHeaderBadges();

