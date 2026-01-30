var storeCurrentPage = 1;
var storeProductsPerPage = 9;
var storeAllFilteredProducts = [];

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initStorePage, 100);
});

function initStorePage() {
  if (typeof PRODUCTS === 'undefined' || typeof liquidjs === 'undefined') {
    console.error('Store page dependencies missing (PRODUCTS or LiquidJS).');
    return;
  }

  const engine = new liquidjs.Liquid({
    root: ['templates/'],
    extname: '.liquid'
  });

  const allProducts = (typeof getAllProducts === 'function'
    ? getAllProducts()
    : PRODUCTS).map(normalizeProduct).filter(Boolean);

  const params = new URLSearchParams(window.location.search);
  const categoryFilter = (params.get('category') || '').toLowerCase();
  const pageParam = parseInt(params.get('page')) || 1;
  storeCurrentPage = pageParam;

  let filteredProducts = allProducts;
  if (categoryFilter) {
    filteredProducts = allProducts.filter(function (product) {
      return product.category && product.category.toLowerCase() === categoryFilter;
    });
  }

  storeAllFilteredProducts = filteredProducts;
  renderStorePage(engine, filteredProducts);

  const topSelling = (typeof getBestsellerProducts === 'function'
    ? getBestsellerProducts()
    : PRODUCTS.filter(function (p) { return p.rating >= 4.8; }).slice(0, 6))
    .map(normalizeProduct).filter(Boolean);

  renderTemplate(engine, 'store-top-selling-template', { topSelling: topSelling }, 'store-top-selling');
}

function renderStorePage(engine, allProducts) {
  const totalPages = Math.ceil(allProducts.length / storeProductsPerPage);
  const startIndex = (storeCurrentPage - 1) * storeProductsPerPage;
  const endIndex = startIndex + storeProductsPerPage;
  const pageProducts = allProducts.slice(startIndex, endIndex);

  renderTemplate(engine, 'store-products-template', { products: pageProducts }, 'store-products-container');
  updateStoreMeta(allProducts.length, pageProducts.length, storeCurrentPage, totalPages);
  renderStorePagination(totalPages);
}

function renderTemplate(engine, templateId, data, targetId) {
  const template = document.getElementById(templateId);
  const target = document.getElementById(targetId);
  if (!template || !target) return;

  engine.parseAndRender(template.textContent, data)
    .then(function (html) {
      target.innerHTML = html;
    })
    .catch(function (error) {
      console.error('Liquid render error:', error);
      target.innerHTML = '<p class="text-center" style="color:#D10024;">Unable to load items.</p>';
    });
}

function normalizeProduct(product) {
  if (!product) return null;
  return {
    id: product.id,
    title: product.title || product.name || '',
    image: product.image || (Array.isArray(product.images) && product.images.length ? product.images[0] : ''),
    category: product.category || '',
    categoryLabel: product.categoryLabel || (product.category ? capitalize(product.category) : ''),
    price: typeof product.price === 'number' ? product.price : 0,
    originalPrice: typeof product.originalPrice === 'number' ? product.originalPrice : null,
    discount: typeof product.discount === 'number' ? product.discount : 0,
    rating: typeof product.rating === 'number' ? product.rating : 0,
    badge: product.badge || ''
  };
}

function updateStoreMeta(totalProducts, showingProducts, currentPage, totalPages) {
  const qtyEl = document.getElementById('store-qty');
  if (!qtyEl) return;
  if (totalProducts === 0) {
    qtyEl.textContent = 'No products found';
  } else {
    qtyEl.textContent = 'Showing ' + showingProducts + ' of ' + totalProducts + ' products (Page ' + currentPage + ' of ' + totalPages + ')';
  }
}

function renderStorePagination(totalPages) {
  const paginationEl = document.getElementById('store-pagination');
  if (!paginationEl) return;

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  var html = '<ul class="store-pagination">';
  
  // Previous button
  if (storeCurrentPage > 1) {
    html += '<li><a href="?page=' + (storeCurrentPage - 1) + getCategoryParam() + '"><i class="fa fa-angle-left"></i></a></li>';
  } else {
    html += '<li class="disabled"><span><i class="fa fa-angle-left"></i></span></li>';
  }

  // Page numbers
  var lastEllipsis = false;
  for (var i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= storeCurrentPage - 1 && i <= storeCurrentPage + 1)) {
      if (i === storeCurrentPage) {
        html += '<li class="active"><span>' + i + '</span></li>';
      } else {
        html += '<li><a href="?page=' + i + getCategoryParam() + '">' + i + '</a></li>';
      }
      lastEllipsis = false;
    } else if (!lastEllipsis && (i === storeCurrentPage - 2 || i === storeCurrentPage + 2)) {
      html += '<li class="disabled"><span>...</span></li>';
      lastEllipsis = true;
    }
  }

  // Next button
  if (storeCurrentPage < totalPages) {
    html += '<li><a href="?page=' + (storeCurrentPage + 1) + getCategoryParam() + '"><i class="fa fa-angle-right"></i></a></li>';
  } else {
    html += '<li class="disabled"><span><i class="fa fa-angle-right"></i></span></li>';
  }

  html += '</ul>';
  paginationEl.innerHTML = html;
}

function getCategoryParam() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  return category ? '&category=' + encodeURIComponent(category) : '';
}

function capitalize(text) {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

