document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initProductPage, 100);
});

const DEFAULT_ASSURANCES = [
  { icon: 'fa-check-circle', title: '10-Day Replacement', subtitle: 'No questions asked' },
  { icon: 'fa-shield', title: '1 Year Warranty', subtitle: 'Brand Authorized Service' },
  { icon: 'fa-truck', title: 'Free Delivery', subtitle: 'Across India' }
];

const DEFAULT_OFFERS = [
  'Bank Offer: 10% off with ICICI Credit Cards',
  'Extra ₹2000 off on exchange'
];

const DEFAULT_DELIVERY = {
  pincode: '110001',
  eta: 'Get it by Tue, 5 Mar',
  shipping: 'Free Delivery'
};

const DEFAULT_SELLER = {
  name: 'Ectasell Retail',
  rating: 4.6,
  assurance: 'GST Invoice available'
};

const COLOR_HEX_MAP = {
  Black: '#111111',
  White: '#F4F4F4',
  Red: '#D72638',
  Blue: '#2563EB',
  Silver: '#E5E7EB',
  'Space Gray': '#4B5563',
  Green: '#22C55E',
  Pink: '#EC4899',
  Gold: '#F5C451'
};

const DEFAULT_FAQS = [
  {
    question: 'Does this product support quick delivery?',
    answer: 'Yes, most pin codes get priority delivery with doorstep updates just like boAt Rockerz 650 Pro.'
  },
  {
    question: 'Is there a manufacturer warranty?',
    answer: 'All products sold on Ectasell include official brand warranty. Claim it anytime through our support portal.'
  },
  {
    question: 'Can I club bank offers with reward points?',
    answer: 'Absolutely. Apply coupon codes first, then redeem reward points—mirroring boAt’s combo offer flow.'
  }
];

function initProductPage() {
  if (typeof PRODUCTS === 'undefined' || !PRODUCTS.length) {
    showProductError('Products data not available.');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  let productId = params.get('id');

  let product = null;
  if (productId && typeof getProductById === 'function') {
    product = getProductById(productId);
  }

  if (!product) {
    product = PRODUCTS[0];
    productId = product ? product.id : null;
    if (productId) {
      const newUrl = window.location.pathname + '?id=' + encodeURIComponent(productId);
      window.history.replaceState({}, '', newUrl);
    }
  }

  if (!product) {
    showProductError('Product not found.');
    return;
  }

  document.title = (product.title || 'Product') + ' - Ectasell';

  const normalizedProduct = normalizeProductDetail(product);
  const relatedProducts = getRelatedProducts(product);

  updateBreadcrumb(normalizedProduct);
  updateProductDetails(normalizedProduct);
  updateProductTabs(normalizedProduct);
  renderRelatedProducts(relatedProducts);

  initProductGalleries();
  initGalleryStickLimits();
}

function normalizeProductDetail(product) {
  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : (product.image ? [product.image] : []);

  const specs = [];
  if (product.specifications) {
    Object.keys(product.specifications).forEach(function (key) {
      specs.push([key, product.specifications[key]]);
    });
  }

  return {
    id: product.id,
    title: product.title || product.name || 'Product',
    description: product.description || product.shortDescription || '',
    image: product.image || (images.length ? images[0] : ''),
    images: images,
    price: typeof product.price === 'number' ? product.price : 0,
    originalPrice: typeof product.originalPrice === 'number' ? product.originalPrice : null,
    discount: typeof product.discount === 'number' ? product.discount : 0,
    inStock: typeof product.inStock === 'boolean' ? product.inStock : true,
    rating: typeof product.rating === 'number' ? product.rating : 0,
    reviewCount: typeof product.reviewCount === 'number' ? product.reviewCount : 0,
    category: product.category || '',
    categoryLabel: product.categoryLabel || (product.category ? capitalize(product.category) : ''),
    features: Array.isArray(product.features) ? product.features : [],
    specifications: specs,
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    assurances: Array.isArray(product.assurances) && product.assurances.length ? product.assurances : DEFAULT_ASSURANCES,
    offers: Array.isArray(product.offers) && product.offers.length ? product.offers : DEFAULT_OFFERS,
    delivery: product.delivery || DEFAULT_DELIVERY,
    seller: product.seller || DEFAULT_SELLER
  };
}

function getRelatedProducts(product) {
  let related = [];
  if (typeof getProductsByCategory === 'function' && product.category) {
    related = getProductsByCategory(product.category);
  } else {
    related = PRODUCTS.filter(function (p) {
      return p.category === product.category;
    });
  }

  related = related.filter(function (p) {
    return String(p.id) !== String(product.id);
  }).slice(0, 4);

  return related.map(normalizeCardProduct);
}

function normalizeCardProduct(product) {
  const image = product.image || (Array.isArray(product.images) && product.images.length ? product.images[0] : '');
  const categoryLabel = product.categoryLabel || (product.category ? capitalize(product.category) : '');
  return {
    id: product.id,
    title: product.title || product.name || '',
    image: image,
    category: product.category || '',
    categoryLabel: categoryLabel,
    price: typeof product.price === 'number' ? product.price : 0,
    originalPrice: typeof product.originalPrice === 'number' ? product.originalPrice : null,
    discount: typeof product.discount === 'number' ? product.discount : 0
  };
}

function updateBreadcrumb(product) {
  const list = document.getElementById('breadcrumb-list');
  if (!list) return;
  let html = '<li><a href="index.html">Home</a></li><li><a href="category.html">All Categories</a></li>';
  if (product.category) {
    html += '<li><a href="category.html?category=' + encodeURIComponent(product.category) + '">' + product.categoryLabel + '</a></li>';
  }
  html += '<li class="active">' + product.title + '</li>';
  list.innerHTML = html;
}

function updateProductDetails(product) {
  const nameEl = document.getElementById('product-name');
  if (nameEl) nameEl.textContent = product.title;

  const ratingValueEl = document.getElementById('product-rating-value');
  if (ratingValueEl) ratingValueEl.textContent = (product.rating || 0).toFixed(1);

  const reviewSummaryEl = document.getElementById('product-review-summary');
  if (reviewSummaryEl) {
    reviewSummaryEl.textContent = (product.reviewCount || 0) + ' verified review(s)';
  }

  const badgeEl = document.getElementById('product-badge');
  if (badgeEl) {
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.style.display = 'inline-flex';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  const priceValueEl = document.getElementById('product-price-value');
  if (priceValueEl) {
    priceValueEl.textContent = formatPrice(product.price);
  }

  const discountEl = document.getElementById('product-discount-chip');
  if (discountEl) {
    if (product.discount) {
      discountEl.textContent = product.discount + '% OFF';
      discountEl.style.display = 'inline-flex';
    } else {
      discountEl.style.display = 'none';
    }
  }

  const oldPriceEl = document.getElementById('product-old-price');
  if (oldPriceEl) {
    if (product.originalPrice && product.originalPrice > product.price) {
      oldPriceEl.textContent = '₹' + formatPrice(product.originalPrice);
      oldPriceEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
    }
  }

  const priceNoteEl = document.getElementById('product-price-note');
  if (priceNoteEl) {
    priceNoteEl.textContent = 'Inclusive of all taxes';
  }

  const availabilityEl = document.getElementById('product-availability');
  if (availabilityEl) {
    availabilityEl.textContent = product.inStock ? 'In Stock' : 'Out of Stock';
    availabilityEl.style.color = product.inStock ? '' : '#D10024';
  }

  const descEl = document.getElementById('product-description');
  if (descEl) descEl.textContent = product.description || 'No description available.';

  const reviewLink = document.getElementById('review-link');
  if (reviewLink) {
    reviewLink.textContent = (product.reviewCount || 0) + ' Review(s) | Add your review';
    reviewLink.href = '#tab3';
  }

  const ratingEl = document.getElementById('product-rating');
  if (ratingEl) {
    ratingEl.innerHTML = renderStars(product.rating);
  }

  updateAssurances(product.assurances);
  updateOffers(product.offers);
  updateDelivery(product.delivery);
  updateSeller(product.seller);
  renderOfferBadges(product.offers);
  renderColorSwatches(product.colors);
  renderSizeChips(product.sizes);

  updateCategoryLinks(product);
  updateGallery(product);
  renderHighlights(product);
  renderFaqs(product);
  bindPrimaryCTAs(product);
}

function updateCategoryLinks(product) {
  const container = document.getElementById('product-category-links');
  if (!container) return;
  let html = '<li>Category:</li>';
  if (product.category) {
    html += '<li><a href="category.html?category=' + encodeURIComponent(product.category) + '">' + product.categoryLabel + '</a></li>';
  }
  container.innerHTML = html;
}

function updateGallery(product) {
  const main = document.getElementById('product-main-img');
  const thumbs = document.getElementById('product-imgs');
  if (!main || !thumbs) return;
  const images = product.images.length ? product.images : [product.image];
  const mainHtml = images.map(function (img) {
    return '<div class="product-preview"><img src="' + img + '" alt="' + product.title + '"></div>';
  }).join('');
  const thumbHtml = images.map(function (img) {
    return '<div class="product-preview"><img src="' + img + '" alt="' + product.title + '"></div>';
  }).join('');
  main.innerHTML = mainHtml;
  thumbs.innerHTML = thumbHtml;
}

function renderOfferBadges(offers) {
  const container = document.getElementById('product-offer-badges');
  if (!container) return;
  if (!offers || !offers.length) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }
  container.style.display = 'flex';
  container.innerHTML = offers.slice(0, 3).map(function (offer) {
    return '<span class="offer-chip"><i class="fa fa-tag"></i> ' + offer + '</span>';
  }).join('');
}

function renderColorSwatches(colors) {
  const wrapper = document.getElementById('product-color-swatches');
  const group = document.getElementById('color-option');
  if (!wrapper || !group) return;
  if (!colors || !colors.length) {
    group.style.display = 'none';
    wrapper.innerHTML = '';
    return;
  }
  group.style.display = '';
  wrapper.innerHTML = colors.map(function (color, index) {
    var hex = COLOR_HEX_MAP[color] || color || '#CCCCCC';
    return '<button type="button" class="color-swatch ' + (index === 0 ? 'active' : '') + '" data-color="' + color + '" style="background:' + hex + ';"></button>';
  }).join('');

  Array.from(wrapper.querySelectorAll('.color-swatch')).forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      Array.from(wrapper.querySelectorAll('.color-swatch')).forEach(function (btn) {
        btn.classList.remove('active');
      });
      swatch.classList.add('active');
    });
  });
}

function renderSizeChips(sizes) {
  const wrapper = document.getElementById('product-size-chips');
  const group = document.getElementById('size-option');
  if (!wrapper || !group) return;
  if (!sizes || !sizes.length) {
    group.style.display = 'none';
    wrapper.innerHTML = '';
    return;
  }
  group.style.display = '';
  wrapper.innerHTML = sizes.map(function (size, index) {
    return '<button type="button" class="size-chip ' + (index === 0 ? 'active' : '') + '" data-size="' + size + '">' + size + '</button>';
  }).join('');

  Array.from(wrapper.querySelectorAll('.size-chip')).forEach(function (chip) {
    chip.addEventListener('click', function () {
      Array.from(wrapper.querySelectorAll('.size-chip')).forEach(function (btn) {
        btn.classList.remove('active');
      });
      chip.classList.add('active');
    });
  });
}

function renderHighlights(product) {
  const container = document.getElementById('product-highlights');
  if (!container) return;
  const icons = ['fa-bolt', 'fa-shield', 'fa-headphones', 'fa-battery-full', 'fa-magic'];
  const features = (product.features && product.features.length ? product.features : [product.description])
    .filter(Boolean)
    .slice(0, 4);
  if (!features.length) {
    container.innerHTML = '<div class="col-md-12"><p class="text-center" style="color:#8D99AE;">Highlights coming soon.</p></div>';
    return;
  }
  container.innerHTML = features.map(function (feature, index) {
    var icon = icons[index % icons.length];
    var title = feature.split(':')[0];
    return '<div class="col-md-3 col-sm-6">' +
      '<div class="highlight-card">' +
      '<div class="highlight-icon"><i class="fa ' + icon + '"></i></div>' +
      '<h4>' + title + '</h4>' +
      '<p>' + feature + '</p>' +
      '</div>' +
      '</div>';
  }).join('');
}

function renderFaqs(product) {
  const container = document.getElementById('product-faqs');
  if (!container) return;
  const faqs = Array.isArray(product.faqs) && product.faqs.length ? product.faqs : DEFAULT_FAQS;
  container.innerHTML = faqs.map(function (faq) {
    return '<div class="faq-item">' +
      '<h4 class="faq-question">' + faq.question + '</h4>' +
      '<p class="faq-answer">' + faq.answer + '</p>' +
      '</div>';
  }).join('');
}

function bindPrimaryCTAs(product) {
  const addToCartBtn = document.querySelector('.product-details .add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.onclick = function (event) {
      event.preventDefault();
      const qtyInput = document.querySelector('.product-details .qty-label input[type="number"]');
      const quantity = qtyInput ? Number(qtyInput.value) || 1 : 1;
      const params = new URLSearchParams({
        id: product.id || '',
        qty: quantity
      });
      window.location.href = 'cart.html?' + params.toString();
    };
  }

  const buyNowBtn = document.querySelector('.product-details .buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.onclick = function (event) {
      event.preventDefault();
      const qtyInput = document.querySelector('.product-details .qty-label input[type="number"]');
      const quantity = qtyInput ? Number(qtyInput.value) || 1 : 1;
      const params = new URLSearchParams({
        id: product.id || '',
        qty: quantity
      });
      window.location.href = 'checkout.html?' + params.toString();
    };
  }
}

function updateProductTabs(product) {
  const descEl = document.getElementById('tab-description-text');
  if (descEl) descEl.textContent = product.description || 'No description available.';

  const featureList = document.getElementById('tab-features-list');
  if (featureList) {
    featureList.innerHTML = (product.features && product.features.length)
      ? product.features.map(function (f) { return '<li>' + f + '</li>'; }).join('')
      : '';
  }

  const specsTable = document.getElementById('product-specs-table');
  if (specsTable) {
    if (product.specifications && product.specifications.length) {
      specsTable.innerHTML = '<tbody>' + product.specifications.map(function (spec) {
        return '<tr><th>' + spec[0] + '</th><td>' + spec[1] + '</td></tr>';
      }).join('') + '</tbody>';
    } else {
      specsTable.innerHTML = '<tbody><tr><td colspan="2">No additional details.</td></tr></tbody>';
    }
  }

  const reviewsText = document.getElementById('tab-reviews-text');
  if (reviewsText) {
    reviewsText.textContent = 'Average Rating: ' + (product.rating || 0) + '/5 (' + (product.reviewCount || 0) + ' reviews).';
  }
}

function initGalleryStickLimits() {
  const sticky = document.querySelector('.product-gallery-sticky');
  const details = document.querySelector('.product-details-column');
  const galleryColumn = document.querySelector('.product-gallery-column');
  if (!sticky || !details || !galleryColumn) return;
  const topOffset = 120;

  function getAbsoluteTop(el) {
    let top = 0;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent;
    }
    return top;
  }

  function update() {
    const isDesktop = window.innerWidth >= 992;
    syncColumnHeight(isDesktop);
    if (!isDesktop) {
      sticky.classList.remove('stopped');
      return;
    }
    const galleryHeight = sticky.offsetHeight;
    const detailBottom = getAbsoluteTop(details) + details.offsetHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop + topOffset + galleryHeight >= detailBottom) {
      sticky.classList.add('stopped');
    } else {
      sticky.classList.remove('stopped');
    }
  }

  function syncColumnHeight(isDesktop) {
    if (!isDesktop) {
      galleryColumn.style.minHeight = '';
      galleryColumn.style.height = '';
      return;
    }
    const targetHeight = Math.max(details.offsetHeight, sticky.offsetHeight);
    galleryColumn.style.minHeight = targetHeight + 'px';
    galleryColumn.style.height = targetHeight + 'px';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  syncColumnHeight(window.innerWidth >= 992);
  update();
}

function updateAssurances(assurances) {
  const container = document.getElementById('product-assurances');
  if (!container) return;
  if (!assurances || !assurances.length) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';
  container.innerHTML = assurances.map(function (item) {
    return '<div class="assurance-item">' +
      '<i class="fa ' + (item.icon || 'fa-check-circle') + '"></i>' +
      '<div><p class="assurance-title">' + item.title + '</p>' +
      '<p class="assurance-subtitle">' + (item.subtitle || '') + '</p></div></div>';
  }).join('');
}

function updateOffers(offers) {
  const container = document.getElementById('product-offers');
  if (!container) return;
  if (!offers || !offers.length) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';
  container.innerHTML = offers.map(function (offer) {
    return '<div class="offer-chip"><i class="fa fa-tag"></i> ' + offer + '</div>';
  }).join('');
}

function updateDelivery(delivery) {
  const container = document.getElementById('product-delivery');
  if (!container) return;
  if (!delivery) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';
  container.innerHTML = '<div class="delivery-icon"><i class="fa fa-map-marker"></i></div>' +
    '<div><p class="delivery-destination">Deliver to <strong>' + (delivery.pincode || '110001') + '</strong></p>' +
    '<p class="delivery-info">' + (delivery.eta || '') + (delivery.shipping ? ' | ' + delivery.shipping : '') + '</p></div>';
}

function updateSeller(seller) {
  const container = document.getElementById('product-seller');
  if (!container) return;
  if (!seller) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.innerHTML = '<p>Sold by <strong>' + seller.name + '</strong>' +
    (seller.rating ? ' <span class="seller-rating">' + seller.rating + ' ★</span>' : '') + '</p>' +
    (seller.assurance ? '<p class="seller-assurance">' + seller.assurance + '</p>' : '');
}

function renderRelatedProducts(products) {
  const container = document.getElementById('related-products');
  if (!container) return;
  if (!products.length) {
    container.innerHTML = '<div class="col-md-12"><p class="text-center" style="color:#8D99AE;">No related products available.</p></div>';
    return;
  }
  container.innerHTML = products.map(renderRelatedCard).join('');
}

function renderRelatedCard(product) {
  const saleLabel = product.discount > 0 ? '<span class="sale">-' + product.discount + '%</span>' : '';
  return '<div class="col-md-3 col-xs-6">' +
    '<div class="product">' +
    '<div class="product-img">' +
    '<img src="' + product.image + '" alt="' + product.title + '">' +
    (saleLabel ? '<div class="product-label">' + saleLabel + '</div>' : '') +
    '</div>' +
    '<div class="product-body">' +
    '<p class="product-category">' + (product.categoryLabel || '') + '</p>' +
    '<h3 class="product-name"><a href="product.html?id=' + encodeURIComponent(product.id) + '">' + product.title + '</a></h3>' +
    '<h4 class="product-price">₹' + formatPrice(product.price) +
    (product.originalPrice && product.originalPrice > product.price ? ' <del class="product-old-price">₹' + formatPrice(product.originalPrice) + '</del>' : '') +
    '</h4>' +
    '<div class="product-rating">' + renderStars(product.rating) + '</div>' +
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

function initProductGalleries() {
  if (typeof $ === 'undefined' || !$.fn.slick) {
    return;
  }

  var $main = $('#product-main-img');
  var $thumbs = $('#product-imgs');

  if ($main.length) {
    if ($main.hasClass('slick-initialized')) {
      $main.slick('unslick');
    }
    $main.slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs'
    });
  }

  if ($thumbs.length) {
    if ($thumbs.hasClass('slick-initialized')) {
      $thumbs.slick('unslick');
    }
    $thumbs.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true
        }
      }]
    });
  }

  if ($main.length && $.fn.zoom) {
    $('#product-main-img .product-preview').zoom();
  }
}

function showProductError(message) {
  var container = document.getElementById('product-name');
  if (container) {
    container.textContent = message;
  }
}

function capitalize(text) {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

function renderStars(rating) {
  var stars = '';
  var rounded = Math.round(rating || 0);
  for (var i = 1; i <= 5; i++) {
    stars += i <= rounded ? '<i class="fa fa-star"></i>' : '<i class="fa fa-star-o"></i>';
  }
  return stars;
}

