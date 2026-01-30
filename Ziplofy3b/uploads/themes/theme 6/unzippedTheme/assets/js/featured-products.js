/* Render featured products inside the unique-feature section via LiquidJS */
(function renderFeaturedProducts() {
  renderProductGrid({
    templateId: 'unique-products-template',
    targetId: 'unique-products',
    pick: function (products) {
      return products.slice(0, 4);
    },
    afterRender: attachProductActions
  });
  updateHeaderBadges();
})();

(function renderNewArrivals() {
  renderProductGrid({
    templateId: 'new-arrivals-template',
    targetId: 'new-arrivals-grid',
    pick: function (products) {
      return products.slice(-4);
    }
  });
})();

(function renderShopProducts() {
  renderProductGrid({
    templateId: 'shop-products-template',
    targetId: 'shop-products',
    pick: function (products) {
      return products;
    },
    afterRender: attachProductActions
  });
  updateHeaderBadges();
})();

(function renderCheckoutSummary() {
  if (!document.getElementById('checkout-summary-template')) {
    return;
  }
  renderCartSummary({
    templateId: 'checkout-summary-template',
    targetId: 'checkout-summary'
  });
  updateHeaderBadges();
})();

function renderProductGrid(options) {
  if (!window.liquidjs || typeof PRODUCTS === 'undefined') {
    return;
  }

  var templateNode = document.getElementById(options.templateId);
  var targetNode = document.getElementById(options.targetId);
  if (!templateNode || !targetNode) {
    return;
  }

  var currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  var selectedProducts = options.pick(PRODUCTS).map(function (product) {
    var priceValue = typeof product.price === 'number' ? product.price : 0;
    var originalPriceValue =
      typeof product.originalPrice === 'number' ? product.originalPrice : null;

    return Object.assign({}, product, {
      priceFormatted: currencyFormatter.format(priceValue),
      originalPriceFormatted: originalPriceValue
        ? currencyFormatter.format(originalPriceValue)
        : null,
      discountLabel: product.discount ? product.discount + '% OFF' : ''
    });
  });

  var engine = new liquidjs.Liquid({
    root: ['templates/'],
    extname: '.liquid'
  });

  var productsById = PRODUCTS.reduce(function (map, product) {
    map[String(product.id)] = product;
    return map;
  }, {});

  engine
    .parseAndRender(templateNode.textContent, { products: selectedProducts })
    .then(function (html) {
      targetNode.innerHTML = html;
      if (typeof options.afterRender === 'function') {
        options.afterRender(targetNode, productsById);
      }
    })
    .catch(function (error) {
      console.error('Failed to render products via LiquidJS', error);
      targetNode.innerHTML =
        '<div class="col-12 text-center text-white"><p>Unable to load watches.</p></div>';
    });
}

function renderCartSummary(options) {
  if (!window.liquidjs || typeof PRODUCTS === 'undefined') {
    return;
  }

  var templateNode = document.getElementById(options.templateId);
  var targetNode = document.getElementById(options.targetId);
  if (!templateNode || !targetNode) {
    return;
  }

  var currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  var searchParams = new URLSearchParams(window.location.search);
  var requestedId = searchParams.get('product');

  var cartItems;
  if (requestedId) {
    var forcedProduct = PRODUCTS.find(function (product) {
      return String(product.id) === requestedId;
    });

    cartItems = forcedProduct
      ? [createCartEntry(forcedProduct, 1)]
      : [];
  } else {
    cartItems = loadCart();
  }

  var subtotal = 0;

  var items = cartItems.map(function (entry) {
    var product =
      PRODUCTS.find(function (p) {
        return String(p.id) === String(entry.id);
      }) || entry;
    var priceValue = typeof product.price === 'number' ? product.price : 0;
    var quantityValue = entry.quantity || 1;
    var lineTotal = priceValue * quantityValue;

    subtotal += lineTotal;

    return {
      id: product.id,
      title: product.title,
      image: product.image,
      quantity: quantityValue,
      priceFormatted: currencyFormatter.format(priceValue),
      lineTotalFormatted: currencyFormatter.format(lineTotal)
    };
  });

  var summary = {
    subtotal: currencyFormatter.format(subtotal),
    shipping: items.length > 0 ? 'Free' : '-',
    total: currencyFormatter.format(subtotal)
  };

  var engine = new liquidjs.Liquid({
    root: ['templates/'],
    extname: '.liquid'
  });

  engine
    .parseAndRender(templateNode.textContent, {
      items: items,
      summary: summary
    })
    .then(function (html) {
      targetNode.innerHTML = html;
    })
    .catch(function (error) {
      console.error('Failed to render checkout summary via LiquidJS', error);
      targetNode.innerHTML =
        '<div class="nx-summary"><p>Unable to load your cart. <a href="shop.html">Shop again</a>.</p></div>';
    });
}

var CART_STORAGE_KEY = 'theme6_cart_items';
var WISHLIST_STORAGE_KEY = 'theme6_wishlist_items';

function updateHeaderBadges() {
  // Update cart badge
  var cartBadge = document.querySelector('a[href="cart.html"] .badge');
  if (cartBadge) {
    var cart = loadCart();
    var cartCount = cart.length > 0 ? cart.reduce(function(sum, item) {
      return sum + (item.quantity || 1);
    }, 0) : 0;
      cartBadge.textContent = cartCount;
      cartBadge.style.display = 'inline';
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

function loadCart() {
  try {
    var cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    console.warn('Unable to parse cart from storage', error);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function createCartEntry(product, quantity) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    quantity: quantity
  };
}

function addProductToCart(product, quantity) {
  if (!product) return;
  var cart = loadCart();
  var existing = cart.find(function (item) {
    return item.id === product.id;
  });

  var qty = Math.max(1, quantity || 1);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push(createCartEntry(product, qty));
  }

  saveCart(cart);
  updateHeaderBadges();
}

function toggleWishlist(productId) {
  var wishlist = loadWishlist();
  var index = wishlist.findIndex(function(id) {
    return String(id) === String(productId);
  });
  
  if (index > -1) {
    // Remove from wishlist
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    return false; // Removed
  } else {
    // Add to wishlist
    wishlist.push(productId);
    saveWishlist(wishlist);
    return true; // Added
  }
}

function loadWishlist() {
  try {
    var wishlist = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY));
    return Array.isArray(wishlist) ? wishlist : [];
  } catch (error) {
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
}

function isInWishlist(productId) {
  var wishlist = loadWishlist();
  return wishlist.some(function(id) {
    return String(id) === String(productId);
  });
}

function updateWishlistIcon(iconElement, productId) {
  if (!iconElement) return;
  var icon = iconElement.querySelector('i');
  if (!icon) return;
  
  if (isInWishlist(productId)) {
    icon.classList.remove('fa-heart-o');
    icon.classList.add('fa-heart');
    // Set red color for filled heart
    if (icon.style) {
      icon.style.color = '#e74c3c';
    }
  } else {
    icon.classList.remove('fa-heart');
    icon.classList.add('fa-heart-o');
    // Remove inline color to use CSS white color
    if (icon.style) {
      icon.style.removeProperty('color');
    }
    if (iconElement.style) {
      iconElement.style.removeProperty('color');
    }
  }
}

function attachProductActions(root, productsById) {
  root.addEventListener('click', function (event) {
    var target = event.target.closest('[data-action][data-product-id]');
    if (!target) {
      return;
    }

    var productId = target.getAttribute('data-product-id');
    var action = target.getAttribute('data-action');
    
    if (action === 'toggle-wishlist') {
      event.preventDefault();
      var wasAdded = toggleWishlist(productId);
      var product = productsById[productId] || (typeof PRODUCTS !== 'undefined' ? PRODUCTS.find(function(p) { return String(p.id) === String(productId); }) : null);
      
      if (wasAdded) {
        alert((product ? product.title : 'Product') + ' added to wishlist!');
      } else {
        alert((product ? product.title : 'Product') + ' removed from wishlist!');
      }
      
      updateWishlistIcon(target, productId);
      if (window.updateHeaderBadges) {
        updateHeaderBadges();
      }
      return;
    }

    var product = productsById[productId];
    if (!product) {
      console.warn('Product not found for id:', productId);
      return;
    }

    if (action === 'add-to-cart') {
      addProductToCart(product, 1);
      alert(product.title + ' added to cart.');
    }

    if (action === 'buy-now') {
      saveCart([createCartEntry(product, 1)]);
      updateHeaderBadges();
      window.location.href =
        'checkout.html?product=' + encodeURIComponent(product.id);
    }
  });
  
  // Update wishlist icons on page load
  var wishlistIcons = root.querySelectorAll('.wishlist-toggle');
  wishlistIcons.forEach(function(icon) {
    var productId = icon.getAttribute('data-product-id');
    if (productId) {
      updateWishlistIcon(icon, productId);
    }
  });
}


