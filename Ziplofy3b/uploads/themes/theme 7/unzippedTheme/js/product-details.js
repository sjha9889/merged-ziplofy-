document.addEventListener('DOMContentLoaded', function () {
  if (typeof PRODUCTS === 'undefined') {
    showError('Product data is not available right now.');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    showError('No product was specified.');
    return;
  }

  const product = PRODUCTS.find(function (item) {
    return String(item.id) === productId;
  });

  if (!product) {
    showError('We couldn\'t find the requested product.');
    return;
  }

  hideError();
  renderProduct(product);
});

function showError(message) {
  const errorContainer = document.getElementById('product-error');
  const messageEl = document.getElementById('product-error-message');
  if (messageEl) {
    messageEl.textContent = message;
  }
  if (errorContainer) {
    errorContainer.style.display = 'block';
  }
  const detailsLayout = document.querySelector('.product-details-layout');
  if (detailsLayout) {
    detailsLayout.style.display = 'none';
  }
  const relatedSection = document.querySelector('.related-products-section');
  if (relatedSection) {
    relatedSection.style.display = 'none';
  }
}

function hideError() {
  const errorContainer = document.getElementById('product-error');
  if (errorContainer) {
    errorContainer.style.display = 'none';
  }
  const detailsLayout = document.querySelector('.product-details-layout');
  if (detailsLayout) {
    detailsLayout.style.display = '';
  }
  const relatedSection = document.querySelector('.related-products-section');
  if (relatedSection) {
    relatedSection.style.display = '';
  }
}

function renderProduct(product) {
  document.title = product.title + ' - CosmicStore';

  setBreadcrumbs(product);
  setHeroImages(product);
  setPricing(product);
  setFeatures(product);
  setSpecifications(product);
  setRating(product);
  setColors(product);
  bindButtons(product);
  setDescriptionTab(product);
  renderRelatedProducts(product);
}

function setBreadcrumbs(product) {
  const categoryLink = document.getElementById('breadcrumb-category-link');
  if (categoryLink) {
    categoryLink.textContent = product.category || 'Products';
    const slug = product.category
      ? encodeURIComponent(product.category.toLowerCase().replace(/\s+/g, '-'))
      : 'all';
    categoryLink.href = 'products.html?category=' + slug;
  }
  setText('breadcrumb-product', product.title);
}

function setHeroImages(product) {
  const mainImage = document.getElementById('main-product-image');
  if (mainImage) {
    mainImage.src = product.image;
    mainImage.alt = product.title;
    mainImage.loading = 'lazy';
  }

  const badgeEl = document.getElementById('image-badge');
  if (badgeEl) {
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.style.display = '';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : [product.image];

  const thumbnailsContainer = document.getElementById('thumbnail-images');
  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = '';
    images.forEach(function (imgSrc, index) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = product.title + ' view ' + (index + 1);
      img.className = 'thumbnail' + (index === 0 ? ' active' : '');
      img.loading = 'lazy';
      img.addEventListener('click', function () {
        updateMainImage(imgSrc);
        const siblings = thumbnailsContainer.querySelectorAll('.thumbnail');
        siblings.forEach(function (thumb) {
          thumb.classList.remove('active');
        });
        img.classList.add('active');
      });
      thumbnailsContainer.appendChild(img);
    });
  }

  function updateMainImage(src) {
    if (mainImage) {
      mainImage.src = src;
    }
  }
}

function setPricing(product) {
  setText('product-title', product.title);
  setText('product-description', product.description || product.shortDescription || '');

  const currentPrice = document.getElementById('current-price');
  if (currentPrice) {
    currentPrice.textContent = formatCurrency(product.price);
  }

  const originalPrice = document.getElementById('original-price');
  if (originalPrice) {
    if (product.originalPrice && product.originalPrice > product.price) {
      originalPrice.textContent = formatCurrency(product.originalPrice);
      originalPrice.style.display = '';
    } else {
      originalPrice.style.display = 'none';
    }
  }

  const discountBadge = document.getElementById('discount-badge');
  if (discountBadge) {
    if (product.discount) {
      discountBadge.textContent = product.discount + '% OFF';
      discountBadge.style.display = '';
    } else {
      discountBadge.style.display = 'none';
    }
  }
}

function setFeatures(product) {
  const features = Array.isArray(product.features) && product.features.length
    ? product.features
    : ['Premium build quality', 'Backed by CosmicStore warranty'];

  const list = document.getElementById('features-list');
  if (list) {
    list.innerHTML = '';
    features.forEach(function (feature) {
      const li = document.createElement('li');
      li.textContent = feature;
      list.appendChild(li);
    });
  }
}

function setSpecifications(product) {
  const specGrid = document.getElementById('specs-grid');
  if (!specGrid) return;

  const specs = product.specifications || {};
  const entries = Object.entries(specs);

  if (!entries.length) {
    specGrid.innerHTML = '<p>No additional specifications available.</p>';
    return;
  }

  specGrid.innerHTML = '';
  entries.forEach(function ([label, value]) {
    const item = document.createElement('div');
    item.className = 'spec-item';

    const specLabel = document.createElement('span');
    specLabel.className = 'spec-label';
    specLabel.textContent = label.replace(/([A-Z])/g, ' $1').trim();

    const specValue = document.createElement('span');
    specValue.className = 'spec-value';
    specValue.textContent = value;

    item.appendChild(specLabel);
    item.appendChild(specValue);
    specGrid.appendChild(item);
  });
}

function setRating(product) {
  const ratingValue = typeof product.rating === 'number' ? product.rating : 4.5;
  const reviewCount = product.reviewCount || 0;

  setText('rating-number', ratingValue.toFixed(1));
  setText('product-review-count', '(' + reviewCount + ' reviews)');
  setText('rating-summary-count', 'Based on ' + reviewCount + ' reviews');
  setText('reviews-tab-label', 'Reviews (' + reviewCount + ')');
  setText('reviews-link', 'Read ' + reviewCount + ' reviews');

  const stars = renderStars(ratingValue);
  setText('product-rating-stars', stars);
  setText('reviews-stars', stars);
}

function setColors(product) {
  const container = document.getElementById('color-options');
  if (!container) return;

  const colors = Array.isArray(product.colors) && product.colors.length
    ? product.colors
    : [];

  container.innerHTML = '';

  if (!colors.length) {
    const fallback = document.createElement('span');
    fallback.textContent = 'Available in multiple finishes';
    container.appendChild(fallback);
    return;
  }

  colors.forEach(function (color, index) {
    const button = document.createElement('button');
    button.className = 'color-option' + (index === 0 ? ' active' : '');
    button.title = color;
    button.setAttribute('aria-label', color);
    const colorStyle = resolveColorStyle(color);
    if (colorStyle.startsWith('linear-gradient')) {
      button.style.backgroundImage = colorStyle;
    } else {
      button.style.backgroundColor = colorStyle;
    }
    button.addEventListener('click', function () {
      container.querySelectorAll('.color-option').forEach(function (btn) {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
    container.appendChild(button);
  });
}

function bindButtons(product) {
  const buttons = document.querySelectorAll('[data-product-button]');
  buttons.forEach(function (button) {
    button.setAttribute('data-product', product.id);
  });
}

function setDescriptionTab(product) {
  const descriptionContent = document.querySelector('#description .content-card p');
  if (descriptionContent) {
    descriptionContent.textContent = product.description || descriptionContent.textContent;
  }
}

function renderRelatedProducts(product) {
  const grid = document.getElementById('related-products-grid');
  if (!grid) return;

  const sameCategory = PRODUCTS.filter(function (item) {
    return item.id !== product.id && item.category === product.category;
  });

  const fallback = PRODUCTS.filter(function (item) {
    return item.id !== product.id;
  });

  const related = (sameCategory.length ? sameCategory : fallback).slice(0, 3);

  if (!related.length) {
    grid.innerHTML = '<p>No related products found.</p>';
    return;
  }

  grid.innerHTML = related.map(function (item) {
    return (
      '<div class="product-card">' +
        '<div class="product-image">' +
          '<img src="' + item.image + '" alt="' + item.title + '">' +
          (item.badge ? '<div class="product-badge">' + item.badge + '</div>' : '') +
          '<div class="product-actions">' +
            '<button class="action-btn" type="button" aria-label="Toggle wishlist" data-product="' + item.id + '" data-product-action="wishlist">' +
              '<i class="fa fa-heart"></i>' +
            '</button>' +
            '<button class="action-btn" type="button" aria-label="Quick view" data-product="' + item.id + '" data-product-action="quick-view">' +
              '<i class="fa fa-eye"></i>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="product-info">' +
          '<h3>' + item.title + '</h3>' +
          '<div class="product-rating">' +
            '<div class="stars">' + renderStars(item.rating || 4.5) + '</div>' +
            '<span class="rating-count">(' + (item.reviewCount || 0) + ')</span>' +
          '</div>' +
          '<div class="product-price">' +
            '<span class="current-price">' + formatCurrency(item.price) + '</span>' +
          '</div>' +
          '<a class="add-to-cart-btn" href="product-details.html?id=' + item.id + '">View Details</a>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  document.dispatchEvent(new Event('shop:products-rendered'));
}
function resolveColorStyle(colorName) {
  if (!colorName) {
    return '#9CA3AF';
  }
  const color = colorName.toLowerCase();
  if (color.includes('black')) return '#111827';
  if (color.includes('white')) return '#F3F4F6';
  if (color.includes('silver')) return '#9CA3AF';
  if (color.includes('gray') || color.includes('grey')) return '#6B7280';
  if (color.includes('blue')) return '#2563EB';
  if (color.includes('gold')) return '#F59E0B';
  if (color.includes('rose')) return '#F472B6';
  if (color.includes('green')) return '#16A34A';
  if (color.includes('red')) return '#DC2626';
  if (color.includes('orange')) return '#F97316';
  if (color.includes('purple')) return '#8B5CF6';
  return '#9CA3AF';
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && typeof value !== 'undefined') {
    el.textContent = value;
  }
}

function formatCurrency(value) {
  if (typeof value !== 'number') {
    return value || '';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function renderStars(rating) {
  const maxStars = 5;
  const rounded = Math.round(rating);
  let stars = '';
  for (let i = 0; i < maxStars; i++) {
    stars += i < rounded ? '★' : '☆';
  }
  return stars;
}

