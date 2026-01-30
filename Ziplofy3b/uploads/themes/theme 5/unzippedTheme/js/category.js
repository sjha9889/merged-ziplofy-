var categoryCurrentPage = 1;
var categoryProductsPerPage = 9;
var categoryAllProducts = [];

document.addEventListener('DOMContentLoaded', function () {
  if (typeof PRODUCTS === 'undefined' && typeof getAllProducts !== 'function') {
    console.error('Product data not found for category page.');
    return;
  }

  initializeCategoryPage();
});

function initializeCategoryPage() {
  var products = typeof getAllProducts === 'function' ? getAllProducts() : PRODUCTS;
  var normalizedProducts = products.map(normalizeProduct).filter(Boolean);
  categoryAllProducts = normalizedProducts;

  var params = new URLSearchParams(window.location.search);
  var pageParam = parseInt(params.get('page')) || 1;
  categoryCurrentPage = pageParam;

  applyCategoryFromURL(normalizedProducts);
  bindFilters(normalizedProducts);
}

function normalizeProduct(product) {
  if (!product) return null;
  return {
    id: product.id,
    title: product.title || product.name || 'Product',
    image: product.image || (product.images && product.images[0]) || 'assets/img/product01.png',
    category: product.category || '',
    categoryLabel: product.categoryLabel || capitalize(product.category),
    price: typeof product.price === 'number' ? product.price : 0,
    originalPrice: product.originalPrice,
    discount: product.discount,
    badge: product.badge,
    rating: product.rating
  };
}

function renderProducts(products) {
  var grid = document.getElementById('productsGrid');
  var qty = document.getElementById('storeQty');
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = '<div class="col-md-12 text-center" style="color:#8D99AE;">No products available.</div>';
    if (qty) qty.textContent = '0 product(s) shown';
    renderCategoryPagination(0);
    return;
  }

  // Pagination logic
  var totalPages = Math.ceil(products.length / categoryProductsPerPage);
  var startIndex = (categoryCurrentPage - 1) * categoryProductsPerPage;
  var endIndex = startIndex + categoryProductsPerPage;
  var pageProducts = products.slice(startIndex, endIndex);

  grid.innerHTML = pageProducts.map(function (product) {
    return renderProductCard(product);
  }).join('');

  if (qty) {
    qty.textContent = 'Showing ' + pageProducts.length + ' of ' + products.length + ' product(s) (Page ' + categoryCurrentPage + ' of ' + totalPages + ')';
  }

  renderCategoryPagination(totalPages);
}

function renderProductCard(product) {
  var disk = product.discount ? '<span class="sale">-' + product.discount + '%</span>' : '';
  var badge = product.badge ? '<span class="new">' + product.badge + '</span>' : '';
  var oldPrice = product.originalPrice && product.originalPrice > product.price
    ? '<del class="product-old-price">₹' + formatPrice(product.originalPrice) + '</del>'
    : '';
  var ratingHtml = renderStars(product.rating);
  return '' +
    '<div class="col-md-4 col-xs-6 product-card" data-category="' + product.category + '" data-price="' + product.price + '">' +
      '<div class="product">' +
        '<div class="product-img">' +
          '<img src="' + product.image + '" alt="' + product.title + '">' +
          '<div class="product-label">' + disk + badge + '</div>' +
        '</div>' +
        '<div class="product-body">' +
          '<p class="product-category">' + (product.categoryLabel || 'Category') + '</p>' +
          '<h3 class="product-name"><a href="product.html?id=' + product.id + '">' + product.title + '</a></h3>' +
          '<h4 class="product-price">₹' + formatPrice(product.price) + ' ' + oldPrice + '</h4>' +
          '<div class="product-rating">' + ratingHtml + '</div>' +
          '<div class="product-btns">' +
            '<button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>' +
            '<button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>' +
            '<button class="quick-view" data-product-id="' + product.id + '"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="add-to-cart">' +
          '<button class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i> add to cart</button>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function bindFilters(products) {
  document.querySelectorAll('.checkbox-filter input[type="checkbox"]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      filterAndRender(products);
    });
  });

  var sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      filterAndRender(products);
    });
  }
}

function filterAndRender(products, resetPage) {
  var categories = getSelectedCategories();
  var filtered = products.filter(function (product) {
    return !categories.length || categories.indexOf(product.categoryLabel) !== -1 || categories.indexOf(product.category) !== -1;
  });

  var sort = document.getElementById('sortSelect');
  if (sort) {
    if (sort.value === 'priceLow') filtered.sort(function (a, b) { return a.price - b.price; });
    if (sort.value === 'priceHigh') filtered.sort(function (a, b) { return b.price - a.price; });
  }

  // Reset to page 1 when filtering (user action), but not when loading from URL
  if (resetPage !== false) {
    categoryCurrentPage = 1;
    updateURLPage(1);
  }
  
  // Validate page number - if current page is beyond total pages, reset to 1
  var totalPages = Math.ceil(filtered.length / categoryProductsPerPage);
  if (categoryCurrentPage > totalPages && totalPages > 0) {
    categoryCurrentPage = 1;
    updateURLPage(1);
  }
  
  renderProducts(filtered);
}

function renderCategoryPagination(totalPages) {
  var paginationEl = document.getElementById('category-pagination');
  if (!paginationEl) return;

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  var html = '<ul class="store-pagination">';
  
  // Previous button
  if (categoryCurrentPage > 1) {
    html += '<li><a href="?page=' + (categoryCurrentPage - 1) + getCategoryURLParam() + '"><i class="fa fa-angle-left"></i></a></li>';
  } else {
    html += '<li class="disabled"><span><i class="fa fa-angle-left"></i></span></li>';
  }

  // Page numbers
  var lastEllipsis = false;
  for (var i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= categoryCurrentPage - 1 && i <= categoryCurrentPage + 1)) {
      if (i === categoryCurrentPage) {
        html += '<li class="active"><span>' + i + '</span></li>';
      } else {
        html += '<li><a href="?page=' + i + getCategoryURLParam() + '">' + i + '</a></li>';
      }
      lastEllipsis = false;
    } else if (!lastEllipsis && (i === categoryCurrentPage - 2 || i === categoryCurrentPage + 2)) {
      html += '<li class="disabled"><span>...</span></li>';
      lastEllipsis = true;
    }
  }

  // Next button
  if (categoryCurrentPage < totalPages) {
    html += '<li><a href="?page=' + (categoryCurrentPage + 1) + getCategoryURLParam() + '"><i class="fa fa-angle-right"></i></a></li>';
  } else {
    html += '<li class="disabled"><span><i class="fa fa-angle-right"></i></span></li>';
  }

  html += '</ul>';
  paginationEl.innerHTML = html;
}

function getCategoryURLParam() {
  var params = new URLSearchParams(window.location.search);
  var category = params.get('category');
  return category ? '&category=' + encodeURIComponent(category) : '';
}

function updateURLPage(page) {
  var url = new URL(window.location);
  url.searchParams.set('page', page);
  window.history.replaceState({}, '', url);
}

function getSelectedCategories() {
  var selected = [];
  document.querySelectorAll('.checkbox-filter input[type="checkbox"]').forEach(function (cb) {
    if (cb.checked) selected.push(cb.getAttribute('data-cat'));
  });
  return selected;
}

function applyCategoryFromURL(products) {
  var params = new URLSearchParams(window.location.search);
  var category = params.get('category');
  var map = {
    'Laptops': 'cat-laptops',
    'Smartphones': 'cat-smartphones',
    'Cameras': 'cat-cameras',
    'Accessories': 'cat-accessories'
  };

  if (category && map[category]) {
    var checkbox = document.getElementById(map[category]);
    if (checkbox) checkbox.checked = true;
    setBreadcrumb(category);
    // Don't reset page when loading from URL - respect the page parameter
    filterAndRender(products, false);
  } else {
    setBreadcrumb(null);
    // Initial load without category - render all products
    filterAndRender(products, false);
  }
}

function setBreadcrumb(category) {
  var active = document.getElementById('breadcrumbActive');
  if (active) active.textContent = category || 'All Categories';
}

function renderStars(rating) {
  var stars = '';
  var rounded = Math.round(rating || 0);
  for (var i = 1; i <= 5; i++) {
    stars += '<i class="fa ' + (i <= rounded ? 'fa-star' : 'fa-star-o') + '"></i>';
  }
  return stars;
}

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

