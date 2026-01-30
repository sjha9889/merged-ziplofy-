/* Wishlist page interactions */
(function () {
  const STORAGE_KEY = 'cosmic_store_wishlist';
  const engine = window.liquidjs
    ? new window.liquidjs.Liquid({
        root: ['templates/'],
        extname: '.liquid'
      })
    : null;

  document.addEventListener('DOMContentLoaded', initWishlistPage);

  function initWishlistPage() {
    const catalog = getCatalog();
    if (!Array.isArray(catalog) || !catalog.length || !document.getElementById('wishlist-grid')) {
      return;
    }

    const dom = {
      grid: document.getElementById('wishlist-grid'),
      layout: document.getElementById('wishlist-layout'),
      emptyState: document.getElementById('wishlist-empty-state'),
      countLabel: document.getElementById('wishlist-count-label'),
      summary: document.getElementById('wishlist-summary'),
      totalValue: document.getElementById('wishlist-total-value'),
      savings: document.getElementById('wishlist-savings'),
      rating: document.getElementById('wishlist-rating'),
      deliveryNote: document.getElementById('wishlist-delivery-note'),
      moveAllBtn: document.getElementById('wishlist-move-all'),
      clearBtn: document.getElementById('wishlist-clear'),
      recommendationList: document.getElementById('wishlist-recommendation-list')
    };

    let wishlistIds = getWishlistSnapshot();
    let wishlistProducts = resolveProducts(wishlistIds, catalog);

    renderAll();
    bindEvents();

    function bindEvents() {
      if (dom.grid) {
        dom.grid.addEventListener('click', handleGridAction);
      }
      if (dom.moveAllBtn) {
        dom.moveAllBtn.addEventListener('click', moveAllToCart);
      }
      if (dom.clearBtn) {
        dom.clearBtn.addEventListener('click', clearWishlist);
      }
      if (dom.recommendationList) {
        dom.recommendationList.addEventListener('click', handleRecommendationAction);
      }
      document.addEventListener('shop:wishlist-updated', handleExternalWishlistUpdate);
    }

    function handleExternalWishlistUpdate() {
      wishlistIds = getWishlistSnapshot();
      wishlistProducts = resolveProducts(wishlistIds, catalog);
      renderAll();
    }

    function handleGridAction(event) {
      const actionBtn = event.target.closest('[data-wishlist-action]');
      if (!actionBtn) return;
      const productId = actionBtn.getAttribute('data-product-id');
      const action = actionBtn.getAttribute('data-wishlist-action');
      if (!productId || !action) return;

      if (action === 'remove') {
        removeFromWishlist(productId);
      } else if (action === 'add-to-cart') {
        moveSingleToCart(productId);
      }
    }

    function handleRecommendationAction(event) {
      const actionBtn = event.target.closest('[data-recommend-action]');
      if (!actionBtn) return;
      const productId = actionBtn.getAttribute('data-product-id');
      const action = actionBtn.getAttribute('data-recommend-action');
      if (!productId || !action) return;

      if (action === 'add-to-wishlist') {
        addToWishlist(productId);
      } else if (action === 'add-to-cart') {
        if (typeof window.addProductToCart === 'function') {
          window.addProductToCart(productId);
        }
      }
    }

    function moveSingleToCart(productId) {
      if (typeof window.addProductToCart === 'function') {
        window.addProductToCart(productId);
      }
      removeFromWishlist(productId);
    }

    function moveAllToCart() {
      if (!wishlistProducts.length) {
        return;
      }
      wishlistProducts.forEach((product) => {
        if (typeof window.addProductToCart === 'function') {
          window.addProductToCart(product.id);
        }
      });
      if (window.WishlistActions && typeof window.WishlistActions.clear === 'function') {
        window.WishlistActions.clear({ silent: true });
      } else {
        clearWishlistStorage();
      }
      wishlistIds = getWishlistSnapshot();
      wishlistProducts = resolveProducts(wishlistIds, catalog);
      renderAll();
      showToast('All wishlist items moved to cart!', 'success');
    }

    function clearWishlist() {
      if (!wishlistIds.length) {
        return;
      }
      if (window.WishlistActions && typeof window.WishlistActions.clear === 'function') {
        window.WishlistActions.clear({ silent: true });
      } else {
        clearWishlistStorage();
      }
      wishlistIds = getWishlistSnapshot();
      wishlistProducts = resolveProducts(wishlistIds, catalog);
      renderAll();
      showToast('Wishlist cleared', 'info');
    }

    function addToWishlist(productId, options = {}) {
      const silent = Boolean(options.silent);
      if (window.WishlistActions && typeof window.WishlistActions.add === 'function') {
        window.WishlistActions.add(productId, { silent });
      } else {
        const ids = new Set(loadWishlistIds());
        ids.add(productId);
        saveWishlistIds(Array.from(ids));
      }
      wishlistIds = getWishlistSnapshot();
      wishlistProducts = resolveProducts(wishlistIds, catalog);
      renderAll();
      if (!silent) {
        showToast('Added to wishlist', 'success');
      }
    }

    function removeFromWishlist(productId, options = {}) {
      const silent = Boolean(options.suppressNotification);
      if (window.WishlistActions && typeof window.WishlistActions.remove === 'function') {
        window.WishlistActions.remove(productId, { silent });
      } else {
        const ids = new Set(loadWishlistIds());
        ids.delete(productId);
        saveWishlistIds(Array.from(ids));
      }
      wishlistIds = getWishlistSnapshot();
      wishlistProducts = resolveProducts(wishlistIds, catalog);
      renderAll();
      if (!silent) {
        showToast('Removed from wishlist', 'info');
      }
    }

    function renderAll() {
      updateCounts();
      renderWishlistCards();
      renderSummary();
      renderRecommendations();
    }

    function updateCounts() {
      if (dom.countLabel) {
        const count = wishlistProducts.length;
        dom.countLabel.textContent = `${count} ${count === 1 ? 'product' : 'products'}`;
      }
      const hasItems = wishlistProducts.length > 0;
      toggleElement(dom.layout, hasItems);
      toggleElement(dom.emptyState, !hasItems);
    }

    function renderWishlistCards() {
      if (!dom.grid) return;
      if (!wishlistProducts.length) {
        dom.grid.innerHTML = '';
        document.dispatchEvent(new Event('shop:products-rendered'));
        return;
      }

      const renderTasks = wishlistProducts.map((product) => {
        const model = buildTemplateModel(product);
        if (engine) {
          return engine.renderFile('wishlist-card', { product: model });
        }
        return Promise.resolve(buildFallbackMarkup(model));
      });

      Promise.all(renderTasks)
        .then((htmlBlocks) => {
          dom.grid.innerHTML = htmlBlocks.join('');
          document.dispatchEvent(new Event('shop:products-rendered'));
        })
        .catch((error) => {
          console.error('Wishlist render error:', error);
          dom.grid.innerHTML = '<p class="loading-text">Unable to render wishlist items.</p>';
        });
    }

    function renderSummary() {
      const totals = wishlistProducts.reduce(
        (acc, product) => {
          const current = product.price || 0;
          const original = product.originalPrice && product.originalPrice > current ? product.originalPrice : current;
          acc.value += current;
          acc.savings += Math.max(0, original - current);
          acc.ratingSum += product.rating || 0;
          return acc;
        },
        { value: 0, savings: 0, ratingSum: 0 }
      );

      const averageRating = wishlistProducts.length ? totals.ratingSum / wishlistProducts.length : 0;

      if (dom.totalValue) {
        dom.totalValue.textContent = formatCurrency(totals.value);
      }
      if (dom.savings) {
        dom.savings.textContent = totals.savings ? `-${formatCurrency(totals.savings)}` : '₹0';
      }
      if (dom.rating) {
        dom.rating.textContent = `${averageRating.toFixed(1)} ★`;
      }
      if (dom.deliveryNote) {
        dom.deliveryNote.textContent =
          totals.value >= 75000
            ? 'Great news! These items qualify for complimentary premium delivery.'
            : 'Add items worth ₹75,000 to unlock complimentary premium delivery.';
      }
    }

    function renderRecommendations() {
      if (!dom.recommendationList) return;
      const wishlistSet = new Set(wishlistIds.map(String));
      const candidates = catalog.filter((product) => !wishlistSet.has(String(product.id)));
      const topPicks = candidates
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);

      if (!topPicks.length) {
        dom.recommendationList.innerHTML = '<p class="loading-text">Add products to see recommendations.</p>';
        return;
      }

      dom.recommendationList.innerHTML = topPicks
        .map(
          (product) => `
          <div class="recommendation-card">
            <div class="recommendation-thumb">
              <img src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
            </div>
            <div class="recommendation-info">
              <h5>${product.title}</h5>
              <p class="price">${formatCurrency(product.price)}</p>
              <div class="recommendation-actions">
                <button class="mini-btn" data-recommend-action="add-to-wishlist" data-product-id="${product.id}">
                  <i class="fas fa-heart"></i>
                </button>
                <button class="mini-btn" data-recommend-action="add-to-cart" data-product-id="${product.id}">
                  <i class="fas fa-cart-plus"></i>
                </button>
              </div>
            </div>
          </div>
        `
        )
        .join('');
    }

    function buildTemplateModel(product) {
      return {
        id: product.id,
        title: product.title,
        category: product.category || 'Electronics',
        image: product.image,
        badge: product.badge || '',
        badgeClass: getBadgeClass(product.badge),
        ratingStars: renderStars(product.rating || 0),
        reviewCount: product.reviewCount || 0,
        availability: product.inStock ? 'Ships in 24h' : 'Backorder',
        shortDescription: product.shortDescription || product.description || '',
        priceFormatted: formatCurrency(product.price),
        originalPriceFormatted:
          product.originalPrice && product.originalPrice > product.price
            ? formatCurrency(product.originalPrice)
            : '',
        discountLabel:
          product.originalPrice && product.originalPrice > product.price
            ? `-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`
            : ''
      };
    }

    function buildFallbackMarkup(model) {
      return `
        <div class="wishlist-card" data-product-id="${model.id}">
          <div class="wishlist-thumb">
            <a href="product-details.html?id=${model.id}">
              <img src="${model.image}" alt="${model.title}" loading="lazy">
            </a>
            ${model.badge ? `<span class="wishlist-badge ${model.badgeClass}">${model.badge}</span>` : ''}
          </div>
          <div class="wishlist-info">
            <div class="wishlist-row">
              <div>
                <a href="product-details.html?id=${model.id}" class="wishlist-title">${model.title}</a>
                <p class="wishlist-category">${model.category}</p>
              </div>
              <button class="icon-btn remove" type="button" aria-label="Remove from wishlist" data-wishlist-action="remove" data-product-id="${model.id}">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="wishlist-meta">
              <div class="wishlist-rating">
                <span class="stars">${model.ratingStars}</span>
                <span class="rating-count">(${model.reviewCount})</span>
              </div>
              <span class="wishlist-availability">${model.availability}</span>
            </div>
            ${model.shortDescription ? `<p class="wishlist-description">${model.shortDescription}</p>` : ''}
            <div class="wishlist-footer">
              <div class="wishlist-price">
                <span class="current">${model.priceFormatted}</span>
                ${model.originalPriceFormatted ? `<span class="original">${model.originalPriceFormatted}</span>` : ''}
                ${model.discountLabel ? `<span class="discount">${model.discountLabel}</span>` : ''}
              </div>
              <div class="wishlist-actions">
                <button class="cta-btn primary" type="button" data-wishlist-action="add-to-cart" data-product-id="${model.id}">
                  <i class="fas fa-shopping-cart"></i>
                  Add to cart
                </button>
                <a class="cta-btn ghost" href="product-details.html?id=${model.id}">
                  <i class="fas fa-arrow-right"></i>
                  View details
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function resolveProducts(ids, catalog) {
    const idSet = new Set(ids.map(String));
    return Array.isArray(catalog)
      ? catalog.filter((product) => idSet.has(String(product.id)))
      : [];
  }

  function getWishlistSnapshot() {
    if (window.WishlistActions && typeof window.WishlistActions.ids === 'function') {
      return window.WishlistActions.ids().map(String);
    }
    return loadWishlistIds();
  }

  function loadWishlistIds() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(stored) ? stored.map(String) : [];
    } catch {
      return [];
    }
  }

  function saveWishlistIds(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Set(ids.map(String)))));
  }

  function clearWishlistStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  function formatCurrency(value) {
    if (typeof value !== 'number') return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  function renderStars(rating) {
    const fullStars = Math.round(rating);
    let stars = '';
    for (let i = 0; i < 5; i += 1) {
      stars += i < fullStars ? '★' : '☆';
    }
    return stars;
  }

  function getBadgeClass(badge) {
    if (!badge) return '';
    const lower = badge.toLowerCase();
    if (lower.includes('sale') || lower.includes('deal')) return 'sale';
    if (lower.includes('new')) return 'new';
    if (lower.includes('limited')) return 'limited';
    if (lower.includes('trend')) return 'trending';
    return 'default';
  }

  function toggleElement(element, show) {
    if (!element) return;
    const preferred = element.getAttribute('data-display') || '';
    element.style.display = show ? preferred : 'none';
  }

  function showToast(message, type) {
    if (typeof window.showNotification === 'function') {
      window.showNotification(message, type);
      return;
    }
    console.log(`[${type}] ${message}`); // fallback
  }

  function getCatalog() {
    if (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) {
      return PRODUCTS;
    }
    if (Array.isArray(window.PRODUCTS)) {
      return window.PRODUCTS;
    }
    return [];
  }
})();

