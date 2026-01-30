// engine init
const engine = new liquidjs.Liquid({
  root: ['templates/'],
  extname: '.liquid'
});

// Expose engine
window.LiquidEngine = engine;

// Helpers
function formatCurrency(value) {
  if (typeof value !== 'number') return '';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
  } catch (e) {
    return '$' + value.toFixed ? value.toFixed(2) : value;
  }
}

function computeStars(rating) {
  const value = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
  const full = Math.floor(value);
  const half = value % 1 !== 0 ? 1 : 0;
  const empty = Math.max(0, 5 - (full + half));
  return { full, half, empty, value };
}

function getBadgeColorSlug(slug) {
  const map = {
    sale: 'danger',
    '50% off': 'danger',
    '30% off': 'warning',
    new: 'success',
    trending: 'primary',
    bestseller: 'primary',
    featured: 'info',
    hot: 'warning',
    limited: 'secondary'
  };
  return map[slug] || 'secondary';
}

function resolveColorStyle(color) {
  if (!color) return '';
  const original = String(color);
  const key = original.trim().toLowerCase();
  const hexMap = {
    'black': '#000000',
    'white': '#ffffff',
    'blue': '#2563eb',
    'red': '#dc2626',
    'silver': '#c0c0c0',
    'midnight': '#0f172a',
    'starlight': '#f8f7f4',
    'pink': '#ec4899',
    'space gray': '#374151',
    'gray': '#6b7280',
    'grey': '#6b7280',
    'green': '#16a34a',
    'yellow': '#facc15',
    'violet': '#7c3aed',
    'titanium black': '#1f2933',
    'titanium gray': '#4b5563',
    'titanium violet': '#7c3aed',
    'titanium yellow': '#facc15',
    'natural titanium': '#b8b7b1',
    'blue titanium': '#1e3a8a',
    'white titanium': '#e5e7eb',
    'black titanium': '#1f2937',
    'bred': '#c1121f',
    'chicago': '#d7263d',
    'royal': '#2563eb',
    'shadow': '#4b5563'
  };

  if (hexMap[key]) {
    return `background-color: ${hexMap[key]};`;
  }

  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(key)) {
    return `background-color: ${original};`;
  }

  // Try to detect basic color words inside the name
  const basicColors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'pink', 'purple', 'violet', 'orange', 'silver', 'gray', 'grey', 'gold'];
  for (const basic of basicColors) {
    if (key.includes(basic)) {
      const style = resolveColorStyle(basic);
      if (style) return style;
    }
  }

  return 'background-image: linear-gradient(135deg, #0ea5e9, #6366f1);';
}

function normalizeProduct(p, options = {}) {
  const image = p.image || (Array.isArray(p.images) && p.images.length ? p.images[0] : '');
  const price = typeof p.price === 'number' ? p.price : 0;
  const originalPrice = typeof p.originalPrice === 'number' ? p.originalPrice : null;
  const hasDiscount = !!(originalPrice && originalPrice > price);
  const stars = computeStars(p.rating || 0);
  const rawBadges = Array.isArray(p.badges) ? p.badges : (p.badge ? [p.badge] : []);
  const badges = rawBadges.map(raw => {
    const label = String(raw).trim();
    const slug = label.toLowerCase().replace(/\s+/g, '-');
    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      slug,
      className: slug,
      colorClass: getBadgeColorSlug(slug)
    };
  });
  const discount = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : (typeof p.discount === 'number' ? Math.round(p.discount) : 0);
  const colors = Array.isArray(p.colors) ? p.colors : [];
  const colorOptions = colors.map((color) => {
    return {
      label: color,
      value: color,
      style: resolveColorStyle(color)
    };
  });

  return {
    id: p.id,
    name: p.name || p.title || '',
    title: p.title || p.name || '',
    image: image,
    category: (p.category || '').toString().toLowerCase(),
    categoryLabel: p.categoryLabel || (p.category ? String(p.category).charAt(0).toUpperCase() + String(p.category).slice(1) : ''),
    categoryLabel: p.category || '',
    rating: stars.value,
    reviewCount: p.reviewCount || 0,
    badge: badges.length ? badges[0].label : '',
    badgeSlug: badges.length ? badges[0].slug : '',
    badges,
    inStock: typeof p.inStock === 'boolean' ? p.inStock : true,
    price,
    originalPrice,
    hasDiscount,
    discount,
    priceDisplay: formatCurrency(price),
    originalPriceDisplay: hasDiscount ? formatCurrency(originalPrice) : '',
    starsFull: stars.full,
    starsHalf: stars.half,
    starsEmpty: stars.empty,
    colClass: options.colClass || null,
    context: options.context || 'default',
    colors,
    colorOptions,
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    description: p.description || '',
    shortDescription: p.shortDescription || '',
    features: Array.isArray(p.features) ? p.features : [],
    specifications: p.specifications || {},
    images: Array.isArray(p.images) ? p.images : (image ? [image] : [])
  };
}

// Render a grid of products into a container using templates/product-grid.liquid
async function renderProductGrid(containerSelector, products, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const normalized = (products || []).map(product => normalizeProduct(product, options)).map(product => ({
    ...product,
    colClass: product.colClass || options.colClass || (options.variant === 'standard' ? 'col-lg-4 col-md-6 mb-4' : 'col-lg-3 col-md-4 col-sm-6 col-6 mb-4')
  }));
  const templateOptions = {
    variant: options.variant || 'modern',
    context: options.context || 'default',
    col_class: options.colClass || null
  };
  const html = await engine.renderFile('product-grid', { products: normalized, options: templateOptions });
  container.innerHTML = html;
}

// Expose renderer
window.renderProductGrid = renderProductGrid;

// Public API: render trending products into #trending-products .row
// category: optional string, 'all' or category key (case-insensitive)
window.renderTrendingWithLiquid = async function (category) {
  try {
    if (typeof PRODUCTS === 'undefined' || !Array.isArray(PRODUCTS)) return;
    let list = PRODUCTS.slice(0);
    if (category && category !== 'all') {
      const cat = String(category).toLowerCase();
      list = list.filter(p => String(p.category || '').toLowerCase() === cat);
    }
    // Pick top 8 as "trending"
    const trending = list.slice(0, 8);
    await renderProductGrid('#trending-products .row', trending, {
      context: 'trending',
      variant: 'modern',
      colClass: 'col-lg-3 col-md-4 col-sm-6 col-6 mb-4'
    });
  } catch (e) {
    console.error('Failed to render trending with Liquid:', e);
  }
};

// Helpers for product detail
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  return idParam;
}

function findProductByIdFlexible(id) {
  if (typeof PRODUCTS === 'undefined' || !Array.isArray(PRODUCTS)) return null;
  const byString = PRODUCTS.find(p => String(p.id) === String(id));
  if (byString) return byString;
  const byNumber = PRODUCTS.find(p => Number(p.id) === Number(id));
  return byNumber || null;
}

// Render product detail using templates/product-detail.liquid
window.renderProductDetailWithLiquid = async function (product) {
  try {
    let sourceProduct = product;
    if (!sourceProduct) {
      const id = getProductIdFromUrl();
      if (!id) return;
      sourceProduct = findProductByIdFlexible(id);
    }
    if (!sourceProduct) return;

    const normalized = normalizeProduct(sourceProduct, { context: 'detail' });
    const images = Array.isArray(sourceProduct.images) && sourceProduct.images.length ? sourceProduct.images : (sourceProduct.image ? [sourceProduct.image] : []);
    const container = document.querySelector('#product-detail-root') || document.querySelector('#content') || document.body;
    if (!container) return;

    const html = await engine.renderFile('product-detail', {
      product: normalized,
      images: images,
      specifications: normalized.specifications
    });

    // If #product-detail-root exists, replace its innerHTML; otherwise append into #content
    if (container === document.body) {
      const wrapper = document.createElement('div');
      wrapper.id = 'product-detail-root';
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
    } else {
      container.innerHTML = html;
    }

    // Update document title and breadcrumbs
    if (normalized.title) {
      document.title = `${normalized.title} - ShoppingMart`;
    }
    const breadcrumbItems = document.querySelectorAll('.breadcrumb .breadcrumb-item');
    if (breadcrumbItems.length > 0) {
      const lastItem = breadcrumbItems[breadcrumbItems.length - 1];
      if (lastItem) {
        lastItem.textContent = normalized.title || normalized.name;
      }
      if (breadcrumbItems.length >= 3 && normalized.category) {
        const categoryItem = breadcrumbItems[breadcrumbItems.length - 2];
        if (categoryItem && categoryItem.querySelector('a')) {
          const link = categoryItem.querySelector('a');
          const categoryLabel = normalized.categoryLabel || (normalized.category ? normalized.category.charAt(0).toUpperCase() + normalized.category.slice(1) : '');
          link.textContent = categoryLabel || 'Category';
          link.setAttribute('href', `shop.html?category=${normalized.category}`);
        }
      }
    }

    return normalized;
  } catch (e) {
    console.error('Failed to render product detail with Liquid:', e);
    return null;
  }
};

// Render Quick View Modal using Liquid template
window.renderQuickViewWithLiquid = async function (productId) {
  try {
    // Prevent multiple simultaneous calls
    if (window._quickViewLoading) {
      return;
    }
    window._quickViewLoading = true;
    
    if (typeof getProductById !== 'function') {
      console.error('getProductById function not found!');
      window._quickViewLoading = false;
      return;
    }
    
    const sourceProduct = getProductById(productId);
    if (!sourceProduct) {
      console.error('Product not found:', productId);
      window._quickViewLoading = false;
      return;
    }
    
    // Remove ALL existing modals and backdrop
    const existingModals = document.querySelectorAll('#quickViewModal');
    existingModals.forEach(modal => {
      // Hide and remove Bootstrap modal instances
      if (window.bootstrap && window.bootstrap.Modal) {
        const modalInstance = window.bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          modalInstance.dispose();
        }
      } else if (window.$ && window.$.fn.modal) {
        $(modal).modal('hide');
      }
      modal.remove();
    });
    
    // Remove backdrop if exists
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    const normalized = normalizeProduct(sourceProduct, { context: 'quickview' });
    const html = await engine.renderFile('quick-view', { product: normalized });
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Show modal using Bootstrap
    const modalElement = document.getElementById('quickViewModal');
    if (modalElement) {
      // Try Bootstrap 5 first, then fallback to jQuery
      if (window.bootstrap && window.bootstrap.Modal) {
        const modal = new window.bootstrap.Modal(modalElement, {
          backdrop: true,
          keyboard: true
        });
        modal.show();
      } else if (window.$ && window.$.fn.modal) {
        $(modalElement).modal('show');
      } else {
        // Fallback: just show it
        modalElement.style.display = 'block';
        modalElement.classList.add('show');
        document.body.classList.add('modal-open');
      }
      
      // Bind events for modal buttons
      const addToCartBtn = modalElement.querySelector('.add-to-cart');
      if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
          const btn = this;
          const pid = btn.getAttribute('data-product-id');
          if (window.CartSidebar && pid) {
            const product = getProductById(pid);
            if (product) {
              window.CartSidebar.addItem(pid, product.name || product.title, product.price, product.image);
              // Hide modal
              if (window.bootstrap && window.bootstrap.Modal) {
                const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
              } else if (window.$ && window.$.fn.modal) {
                $(modalElement).modal('hide');
              }
            }
    }
  });
}

      // Wishlist button in product title
      const addToWishlistBtn = modalElement.querySelector('.modal-body .add-to-wishlist');
      if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const btn = this;
          const pid = btn.getAttribute('data-product-id');
          if (window.WishlistManager && pid) {
            window.WishlistManager.addToWishlist(pid);
            // Update icon to filled heart
            const icon = btn.querySelector('i');
            if (icon) {
              icon.classList.remove('far', 'fa-heart');
              icon.classList.add('fas', 'fa-heart');
              btn.style.color = '#dc3545';
            }
    }
  });
}

      // Checkout button
      const checkoutBtn = modalElement.querySelector('.checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
          const btn = this;
          const pid = btn.getAttribute('data-product-id');
          if (pid) {
            const product = getProductById(pid);
            if (product) {
              // Add to cart first
              if (window.CartSidebar) {
                window.CartSidebar.addItem(pid, product.name || product.title, product.price, product.image);
              }
              // Redirect to checkout
              window.location.href = 'checkout.html';
            }
          }
        });
      }

      // Clean up when modal is hidden
      modalElement.addEventListener('hidden.bs.modal', function() {
        modalElement.remove();
        // Remove backdrop
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window._quickViewLoading = false;
      }, { once: true });
      
      // Also handle when modal is closed via backdrop or ESC
      modalElement.addEventListener('hide.bs.modal', function() {
        window._quickViewLoading = false;
      }, { once: true });
    }
    
    window._quickViewLoading = false;
    return normalized;
  } catch (e) {
    console.error('Failed to render quick view with Liquid:', e);
    window._quickViewLoading = false;
    return null;
  }
};
