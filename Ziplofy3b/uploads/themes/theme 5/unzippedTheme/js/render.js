// Wait for DOM and all scripts to load
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit more to ensure PRODUCTS is loaded
  setTimeout(initLiquidJS, 100);
});

function initLiquidJS() {
  // Check if PRODUCTS is available
  if (typeof PRODUCTS === 'undefined') {
    console.error('PRODUCTS constant not found. Make sure constants/products.js is loaded.');
    return;
  }

// engine init
const engine = new liquidjs.Liquid({
  root: ['templates/'],
  extname: '.liquid' // automatically look for files with the .liquid extension
});

  // Helper function to render templates with error handling
  function renderTemplate(templateId, data, targetElement, method = 'innerHTML') {
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Template with id "${templateId}" not found`);
      return;
    }

    const target = document.getElementById(targetElement);
    if (!target) {
      console.error(`Target element with id "${targetElement}" not found`);
      return;
    }

    engine.parseAndRender(template.textContent, data)
      .then(function (html) {
        if (method === 'innerHTML') {
          target.innerHTML = html;
        } else if (method === 'beforeend') {
          target.insertAdjacentHTML('beforeend', html);
        }
        
        // Initialize slick slider after rendering
        if (typeof $ !== 'undefined' && $.fn.slick) {
          setTimeout(function() {
            // Find the products-slick container that was just rendered
            var $target = $(target);
            var $slickContainer = $target.find('.products-slick');
            
            $slickContainer.each(function() {
              var $this = $(this);
              var $nav = $this.attr('data-nav');
              
              // Destroy existing slick if any
              if ($this.hasClass('slick-initialized')) {
                $this.slick('unslick');
              }
              
              // Initialize slick
              $this.slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                autoplay: true,
                infinite: true,
                speed: 300,
                dots: false,
                arrows: true,
                appendArrows: $nav ? $nav : false,
                responsive: [{
                  breakpoint: 991,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  }
                }]
              });
            });
          }, 200);
        }
      })
      .catch(function (error) {
        console.error('Template rendering error:', error);
        target.innerHTML = '<p style="color: red;">Error loading content. Please refresh the page.</p>';
      });
  }

  // Get products using helper functions from products.js
  let newProducts = [];
  let topSellingProducts = [];

  if (typeof getNewProducts === 'function') {
    newProducts = getNewProducts();
  } else {
    // Fallback: use first 8 products
    newProducts = PRODUCTS.slice(0, 8);
  }

  if (typeof getBestsellerProducts === 'function') {
    topSellingProducts = getBestsellerProducts();
  } else {
    // Fallback: use products with high rating
    topSellingProducts = PRODUCTS.filter(p => p.rating >= 4.5).slice(0, 8);
  }

  // Normalize products to ensure consistent structure
  function normalizeProduct(p) {
    if (!p) return null;
    return {
      id: p.id,
      title: p.title || p.name || '',
      image: p.image || (Array.isArray(p.images) && p.images.length ? p.images[0] : ''),
      category: p.category || '',
      categoryLabel: p.categoryLabel || (p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : ''),
      price: typeof p.price === 'number' ? p.price : 0,
      originalPrice: typeof p.originalPrice === 'number' ? p.originalPrice : null,
      discount: typeof p.discount === 'number' ? p.discount : 0,
      rating: typeof p.rating === 'number' ? p.rating : 0,
      badge: p.badge || ''
    };
  }

  newProducts = newProducts.map(normalizeProduct).filter(p => p !== null);
  topSellingProducts = topSellingProducts.map(normalizeProduct).filter(p => p !== null);

  // Get widget products
  let widgetProducts1 = []; // Top selling
  let widgetProducts2 = []; // Hot Deals
  let widgetProducts3 = []; // New Arrivals

  if (typeof getBestsellerProducts === 'function') {
    widgetProducts1 = getBestsellerProducts().slice(0, 6);
  } else {
    widgetProducts1 = PRODUCTS.filter(p => p.rating >= 4.8).slice(0, 6);
  }

  if (typeof getHotProducts === 'function') {
    widgetProducts2 = getHotProducts().slice(0, 6);
  } else {
    widgetProducts2 = PRODUCTS.filter(p => p.discount >= 20).slice(0, 6);
  }

  if (typeof getNewProducts === 'function') {
    widgetProducts3 = getNewProducts().slice(0, 6);
  } else {
    widgetProducts3 = PRODUCTS.slice(2, 8);
  }

  // Normalize widget products
  widgetProducts1 = widgetProducts1.map(normalizeProduct).filter(p => p !== null);
  widgetProducts2 = widgetProducts2.map(normalizeProduct).filter(p => p !== null);
  widgetProducts3 = widgetProducts3.map(normalizeProduct).filter(p => p !== null);

  // Split into slides (3 products per slide)
  var widgetProducts1Slide1 = widgetProducts1.slice(0, 3);
  var widgetProducts1Slide2 = widgetProducts1.slice(3, 6);
  var widgetProducts2Slide1 = widgetProducts2.slice(0, 3);
  var widgetProducts2Slide2 = widgetProducts2.slice(3, 6);
  var widgetProducts3Slide1 = widgetProducts3.slice(0, 3);
  var widgetProducts3Slide2 = widgetProducts3.slice(3, 6);

  // Render New Products section
  renderTemplate('new-products-template', { newProducts: newProducts }, 'new-products-container', 'innerHTML');

  // Render Top Selling section
  renderTemplate('top-selling-template', { topSellingProducts: topSellingProducts }, 'top-selling-container', 'innerHTML');

  // Render Widget Products sections
  renderTemplate('widget-products-1-template', {
    widgetProducts1: widgetProducts1Slide1,
    widgetProducts1Slide2: widgetProducts1Slide2
  }, 'widget-products-1', 'innerHTML');

  renderTemplate('widget-products-2-template', {
    widgetProducts2: widgetProducts2Slide1,
    widgetProducts2Slide2: widgetProducts2Slide2
  }, 'widget-products-2', 'innerHTML');

  renderTemplate('widget-products-3-template', {
    widgetProducts3: widgetProducts3Slide1,
    widgetProducts3Slide2: widgetProducts3Slide2
  }, 'widget-products-3', 'innerHTML');

  // Render Categories section
  var categoryCards = getCategoriesFromProducts(PRODUCTS);
  renderCategoriesSection(categoryCards);

  // Initialize widget slick sliders after rendering
  setTimeout(function() {
    if (typeof $ !== 'undefined' && $.fn.slick) {
      $('.products-widget-slick').each(function() {
        var $this = $(this);
        var $nav = $this.attr('data-nav');
        
        // Destroy existing slick if any
        if ($this.hasClass('slick-initialized')) {
          $this.slick('unslick');
        }
        
        // Initialize slick for widget
        $this.slick({
          infinite: true,
          autoplay: true,
          speed: 300,
          dots: false,
          arrows: true,
          appendArrows: $nav ? $nav : false,
        });
      });
    }
  }, 400);
}

function getCategoriesFromProducts(products) {
  var map = {};
  (products || []).forEach(function (product) {
    var category = (product.category || 'Others').toString();
    if (!map[category]) {
      map[category] = {
        name: category,
        label: product.categoryLabel || capitalize(category),
        image: product.image || (product.images && product.images[0]) || 'assets/img/product01.png',
        count: 0
      };
    }
    map[category].count += 1;
    if (product.image && map[category].image.indexOf('product') !== -1) {
      map[category].image = product.image;
    }
  });

  return Object.keys(map).map(function (key) {
    return map[key];
  }).slice(0, 4);
}

function renderCategoriesSection(categories) {
  var container = document.getElementById('categories-container');
  if (!container) return;
  if (!categories.length) {
    container.innerHTML = '<div class="col-md-12 text-center" style="color:#8D99AE;">No categories found.</div>';
    return;
  }
  container.innerHTML = categories.map(function (category) {
    return '<div class="col-md-3 col-sm-6">' +
      '<a href="category.html?category=' + encodeURIComponent(category.label) + '" class="category-card">' +
      '<div class="category-thumb" style="background-image:url(\'' + category.image + '\');">' +
      '<div class="category-badge">' + category.count + ' Products</div>' +
      '</div>' +
      '<div class="category-content">' +
      '<h4>' + category.label + '</h4>' +
      '<p>Shop now</p>' +
      '</div>' +
      '</a>' +
      '</div>';
  }).join('');
}

function capitalize(text) {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

