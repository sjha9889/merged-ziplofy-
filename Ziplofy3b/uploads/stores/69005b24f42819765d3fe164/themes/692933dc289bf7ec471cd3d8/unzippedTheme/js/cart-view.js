(() => {
  const STORAGE_KEY = 'cosmic_store_cart';
  const engine = window.liquidjs
    ? new window.liquidjs.Liquid({ root: ['templates/'], extname: '.liquid' })
    : null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartView);
  } else {
    initCartView();
  }

  function initCartView() {
    const itemsList = document.getElementById('cart-items-list');
    if (!itemsList) return;

    const catalogSource = getCatalogSource();
    const dom = {
      itemsList,
      countLabel: document.getElementById('cart-count-label'),
      emptyState: document.getElementById('cart-empty-state'),
      subtotal: document.getElementById('summary-subtotal'),
      shipping: document.getElementById('summary-shipping'),
      tax: document.getElementById('summary-tax'),
      total: document.getElementById('summary-total'),
      suggestionsShell: document.getElementById('cart-suggestions'),
      suggestionsList: document.getElementById('cart-suggestions-list'),
      checkoutBtn: document.getElementById('checkout-btn')
    };

    const catalog = new Map(catalogSource.map(product => [String(product.id), product]));
    let cart = loadCart();

    sanitizeCart();
    bindEvents();
    render();
    if (window.ShopCounts?.updateCartCount) {
      window.ShopCounts.updateCartCount();
    }

    function bindEvents() {
      dom.itemsList.addEventListener('click', handleItemAction);
      if (dom.suggestionsList) {
        dom.suggestionsList.addEventListener('click', handleSuggestionAction);
      }
      if (dom.checkoutBtn) {
        dom.checkoutBtn.addEventListener('click', () => {
          if (!cart.length) {
            notify('Your cart is empty.', 'info');
            return;
          }
          window.location.href = 'checkout.html';
        });
      }
    }

    function handleItemAction(event) {
      const actionBtn = event.target.closest('[data-cart-action]');
      if (!actionBtn) return;
      const productId = actionBtn.getAttribute('data-product-id');
      const action = actionBtn.getAttribute('data-cart-action');
      if (!productId || !action) return;

      if (action === 'increment') {
        adjustQuantity(productId, 1);
      } else if (action === 'decrement') {
        adjustQuantity(productId, -1);
      } else if (action === 'remove') {
        removeItem(productId);
      } else if (action === 'wishlist') {
        moveToWishlist(productId);
      }
    }

    function handleSuggestionAction(event) {
      const addBtn = event.target.closest('[data-suggest-action="add"]');
      if (!addBtn) return;
      const productId = addBtn.getAttribute('data-product-id');
      if (!productId) return;
      addProduct(productId);
    }

    function adjustQuantity(productId, delta) {
      const entry = cart.find(item => String(item.id) === String(productId));
      if (!entry) return;
      entry.quantity = Math.max(1, (entry.quantity || 1) + delta);
      saveCart();
      render();
      dispatchCartUpdated();
    }

    function removeItem(productId) {
      cart = cart.filter(item => String(item.id) !== String(productId));
      saveCart();
      render();
      notify('Item removed from cart', 'info');
      dispatchCartUpdated();
    }

    function moveToWishlist(productId) {
      if (window.WishlistActions?.add) {
        window.WishlistActions.add(productId, { silent: true });
        notify('Moved to wishlist', 'success');
      } else {
        notify('Wishlist is unavailable right now.', 'error');
      }
      removeItem(productId);
    }

    function addProduct(productId) {
      const product = catalog.get(String(productId));
      if (!product) {
        notify('Product not found', 'error');
        return;
      }

      const existing = cart.find(item => String(item.id) === String(productId));
      if (existing) {
        existing.quantity += 1;
        hydrateSnapshot(existing, product);
      } else {
        cart.push({
          id: productId,
          quantity: 1,
          ...buildSnapshot(product)
        });
      }
      saveCart();
      render();
      notify('Added to cart', 'success');
      dispatchCartUpdated();
    }

    function render() {
      const items = buildDisplayItems(cart);
      const hasItems = items.length > 0;

      toggleEmptyState(!hasItems);
      updateCountLabel(items.length);

      if (!hasItems) {
        dom.itemsList.innerHTML = '';
        updateSummary(0, 0, 0, 0);
        renderSuggestions([]);
        return;
      }

      renderItems(items);
      renderSuggestions(items);
      const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
      const shipping = subtotal === 0 || subtotal >= 75000 ? 0 : 499;
      const tax = Math.round(subtotal * 0.18);
      updateSummary(subtotal, shipping, tax, subtotal + shipping + tax);
    }

    function renderItems(items) {
      if (engine) {
        const tasks = items.map(item =>
          engine.renderFile('cart-product-row', {
            item: {
              ...item,
              lineTotalFormatted: formatCurrency(item.lineTotal),
              originalLineTotalFormatted: item.originalLineTotal ? formatCurrency(item.originalLineTotal) : ''
            }
          })
        );
        Promise.all(tasks)
          .then(html => {
            dom.itemsList.innerHTML = html.join('');
          })
          .catch(() => {
            dom.itemsList.innerHTML = buildFallbackRows(items);
          });
      } else {
        dom.itemsList.innerHTML = buildFallbackRows(items);
      }
    }

    function buildFallbackRows(items) {
      return items
        .map(
          item => `
            <div class="product-row" data-product-id="${item.id}">
              <div class="product-thumbnail">
                <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/110x110?text=No+Image'">
              </div>
              <div class="product-info">
                <h3><a href="product-details.html?id=${item.id}">${item.title}</a></h3>
                <p class="product-category-name">${item.category}</p>
                <div class="product-rating-display">
                  <span class="star-icons">${item.ratingStars}</span>
                  <span class="review-number">(${item.reviewCount})</span>
                </div>
              </div>
              <div class="qty-controls">
                <button class="qty-btn minus" data-cart-action="decrement" data-product-id="${item.id}">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn plus" data-cart-action="increment" data-product-id="${item.id}">+</button>
              </div>
              <div class="product-total-price">
                <span class="price-now">${formatCurrency(item.lineTotal)}</span>
                ${
                  item.originalLineTotal
                    ? `<span class="price-old">${formatCurrency(item.originalLineTotal)}</span>`
                    : ''
                }
              </div>
              <div class="product-controls">
                <button class="btn-delete-item" data-cart-action="remove" data-product-id="${item.id}">
                  <i class="fas fa-trash"></i>
                </button>
                <button class="btn-move-wishlist" data-cart-action="wishlist" data-product-id="${item.id}">
                  <i class="far fa-heart"></i>
                </button>
              </div>
            </div>
          `
        )
        .join('');
    }

    function renderSuggestions(itemsInCart) {
      if (!dom.suggestionsList) return;
      const taken = new Set(itemsInCart.map(item => String(item.id)));
      const pool = catalogSource.filter(product => !taken.has(String(product.id)));
      const picks = pool
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);

      if (!picks.length) {
        dom.suggestionsList.innerHTML =
          '<p class="cart-loading">Add more items to see curated recommendations.</p>';
        return;
      }

      if (engine) {
        const tasks = picks.map(product =>
          engine.renderFile('cart-suggestion-card', {
            product: {
              ...product,
              priceFormatted: formatCurrency(product.price || 0)
            }
          })
        );
        Promise.all(tasks)
          .then(html => {
            dom.suggestionsList.innerHTML = html.join('');
          })
          .catch(() => {
            dom.suggestionsList.innerHTML = buildFallbackSuggestions(picks);
          });
      } else {
        dom.suggestionsList.innerHTML = buildFallbackSuggestions(picks);
      }
    }

    function buildFallbackSuggestions(products) {
      return products
        .map(
          product => `
            <div class="suggested-item">
              <img src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/70x70?text=No+Image'">
              <div class="suggested-info">
                <h5>${product.title}</h5>
                <p class="suggested-price">${formatCurrency(product.price || 0)}</p>
                <button class="btn-add-suggested" data-suggest-action="add" data-product-id="${product.id}">Add</button>
              </div>
            </div>
          `
        )
        .join('');
    }

    function toggleEmptyState(isEmpty) {
      if (dom.emptyState) {
        dom.emptyState.hidden = !isEmpty;
      }
      dom.itemsList.style.display = isEmpty ? 'none' : '';
    }

    function updateCountLabel(count) {
      if (dom.countLabel) {
        dom.countLabel.textContent = count ? `${count} ${count === 1 ? 'item' : 'items'}` : '0 items';
      }
    }

    function updateSummary(subtotal, shipping, tax, total) {
      if (dom.subtotal) dom.subtotal.textContent = formatCurrency(subtotal);
      if (dom.shipping) dom.shipping.textContent = shipping === 0 ? 'FREE' : formatCurrency(shipping);
      if (dom.tax) dom.tax.textContent = formatCurrency(tax);
      if (dom.total) dom.total.textContent = formatCurrency(total);
    }

    function buildDisplayItems(entries) {
      return entries
        .map(entry => {
          const product = catalog.get(String(entry.id));
          const source = product || entry || {};
          const quantity = Math.max(1, Number(entry.quantity) || 1);
          const price = source.price || 0;
          const original = source.originalPrice && source.originalPrice > price ? source.originalPrice : null;
          return {
            id: source.id || entry.id,
            title: source.title || `Saved item (${entry.id})`,
            category: source.category || 'Electronics',
            image: source.image || 'https://via.placeholder.com/110x110?text=No+Image',
            ratingStars: renderStars(source.rating || 0),
            reviewCount: source.reviewCount || 0,
            quantity,
            lineTotal: price * quantity,
            originalLineTotal: original ? original * quantity : null
          };
        })
        .filter(Boolean);
    }

    function loadCart() {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(stored) ? stored : [];
      } catch {
        return [];
      }
    }

    function saveCart() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      if (window.ShopCounts?.updateCartCount) {
        window.ShopCounts.updateCartCount();
      } else {
        const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        document.querySelectorAll('.cart-count').forEach(el => {
          el.textContent = count > 0 ? String(count) : '0';
        });
      }
    }

    function sanitizeCart() {
      if (!Array.isArray(cart) || !cart.length) return;
      let changed = false;
      cart = cart.filter(entry => {
        if (!entry || !entry.id) return false;
        const exists = catalog.has(String(entry.id));
        const hasSnapshot = Boolean(entry.title || entry.price || entry.image);
        if (!exists && !hasSnapshot) {
          changed = true;
          return false;
        }
        return true;
      });
      if (changed) {
        saveCart();
      }
    }

    function buildSnapshot(product) {
      return {
        title: product.title,
        category: product.category,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewCount: product.reviewCount
      };
    }

    function hydrateSnapshot(entry, product) {
      entry.title = product.title;
      entry.category = product.category;
      entry.image = product.image;
      entry.price = product.price;
      entry.originalPrice = product.originalPrice;
      entry.rating = product.rating;
      entry.reviewCount = product.reviewCount;
    }

    function dispatchCartUpdated() {
      document.dispatchEvent(new CustomEvent('shop:cart-updated', { detail: { cart, source: 'cart-view' } }));
    }

    function formatCurrency(value) {
      if (typeof value !== 'number' || Number.isNaN(value)) return '₹0';
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(value);
    }

    function renderStars(rating) {
      const rounded = Math.round(rating);
      let stars = '';
      for (let i = 0; i < 5; i += 1) {
        stars += i < rounded ? '★' : '☆';
      }
      return stars;
    }

    function notify(message, type) {
      if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
      } else {
        alert(message);
      }
    }

    function getCatalogSource() {
      if (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) {
        return PRODUCTS;
      }
      if (Array.isArray(window.PRODUCTS)) {
        return window.PRODUCTS;
      }
      return [];
    }
  }
})();

