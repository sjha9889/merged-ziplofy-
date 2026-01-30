document.addEventListener('DOMContentLoaded', function () {
  if (!Array.isArray(PRODUCTS)) {
    showGridMessage('Products data is not available.');
    return;
  }

  const productsGrid = document.getElementById('products-grid');
  const countLabel = document.getElementById('products-count');
  const sortSelect = document.getElementById('sort-select');
  const categoryFilterList = document.getElementById('category-filter-list');
  const clearFiltersBtn = document.querySelector('.clear-filters-btn');

  const state = {
    selectedCategories: new Set(),
    sort: 'featured'
  };

  const categoryData = buildCategoryData(PRODUCTS);
  renderCategoryFilters(categoryData, categoryFilterList, state, renderProducts);
  hydrateStateFromQuery(state, categoryFilterList);

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function () {
      state.selectedCategories.clear();
      if (categoryFilterList) {
        categoryFilterList.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
          checkbox.checked = false;
        });
      }
      renderProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function (event) {
      state.sort = event.target.value;
      renderProducts();
    });
  }

  renderProducts();

  function renderProducts() {
    if (!productsGrid || !countLabel) return;

    const filtered = applyFilters(PRODUCTS.slice(), state);
    const sorted = applySort(filtered, state.sort);

    countLabel.textContent = `Showing ${sorted.length} of ${PRODUCTS.length} products`;

    if (!sorted.length) {
      showGridMessage('No products found for the selected filters.');
      document.dispatchEvent(new Event('shop:products-rendered'));
      return;
    }

    productsGrid.innerHTML = sorted.map(renderProductCard).join('');
    document.dispatchEvent(new Event('shop:products-rendered'));
  }

  function showGridMessage(message) {
    const grid = document.getElementById('products-grid');
    if (grid) {
      grid.innerHTML = `<p class="loading-text">${message}</p>`;
    }
    document.dispatchEvent(new Event('shop:products-rendered'));
  }
});

function buildCategoryData(products) {
  const map = {};
  products.forEach(function (product) {
    if (!product.category) return;
    const slug = slugify(product.category);
    if (!map[slug]) {
      map[slug] = { name: product.category, slug: slug, count: 0 };
    }
    map[slug].count += 1;
  });
  return Object.values(map).sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function renderCategoryFilters(categories, container, state, onChange) {
  if (!container) return;
  if (!categories.length) {
    container.innerHTML = '<p>No categories available.</p>';
    return;
  }
  container.innerHTML = '';
  categories.forEach(function (category) {
    const label = document.createElement('label');
    label.className = 'filter-option';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = category.slug;
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        state.selectedCategories.add(category.slug);
      } else {
        state.selectedCategories.delete(category.slug);
      }
      if (typeof onChange === 'function') {
        onChange();
      }
    });
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${category.name} (${category.count})`));
    container.appendChild(label);
  });
}

function hydrateStateFromQuery(state, categoryFilterList) {
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');
  if (categoryParam) {
    const slug = slugify(categoryParam);
    state.selectedCategories.add(slug);
    if (categoryFilterList) {
      const checkbox = categoryFilterList.querySelector(`input[value="${slug}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    }
  }
}

function applyFilters(products, state) {
  let results = products;
  if (state.selectedCategories && state.selectedCategories.size) {
    results = results.filter(function (product) {
      return state.selectedCategories.has(slugify(product.category || ''));
    });
  }
  return results;
}

function applySort(products, sort) {
  const sorted = products.slice();
  switch (sort) {
    case 'price-low':
      sorted.sort(function (a, b) {
        return (a.price || 0) - (b.price || 0);
      });
      break;
    case 'price-high':
      sorted.sort(function (a, b) {
        return (b.price || 0) - (a.price || 0);
      });
      break;
    case 'rating':
      sorted.sort(function (a, b) {
        return (b.rating || 0) - (a.rating || 0);
      });
      break;
    case 'newest':
      sorted.sort(function (a, b) {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      });
      break;
    default:
      sorted.sort(function (a, b) {
        const badgeA = a.badge ? 1 : 0;
        const badgeB = b.badge ? 1 : 0;
        if (badgeA !== badgeB) return badgeB - badgeA;
        return (b.rating || 0) - (a.rating || 0);
      });
  }
  return sorted;
}

function renderProductCard(product) {
  const badgeClass = product.badge
    ? product.badge.toLowerCase().includes('sale')
      ? 'sale'
      : product.badge.toLowerCase().includes('new')
        ? 'new'
        : ''
    : '';

  return `
    <a href="product-details.html?id=${encodeURIComponent(product.id)}" class="product-card-link">
      <div class="product-card" data-category="${slugify(product.category || '')}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}">
          ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
          <div class="product-actions">
            <button class="action-btn" type="button" aria-label="Toggle wishlist" data-product="${product.id}" data-product-action="wishlist">
              <i class="fa fa-heart"></i>
            </button>
            <button class="action-btn" type="button" aria-label="Quick view" data-product="${product.id}" data-product-action="quick-view">
              <i class="fa fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3>${product.title}</h3>
          <div class="product-rating">
            <div class="stars">${renderStars(product.rating || 0)}</div>
            <span class="rating-count">(${product.reviewCount || 0})</span>
          </div>
          <div class="product-price">
            <span class="current-price">${formatCurrency(product.price)}</span>
            ${product.originalPrice && product.originalPrice > product.price
              ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>`
              : ''
            }
          </div>
          <button class="add-to-cart-btn" data-product="${product.id}">Add to Cart</button>
        </div>
      </div>
    </a>
  `;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function formatCurrency(value) {
  if (typeof value !== 'number') return value || '';
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

