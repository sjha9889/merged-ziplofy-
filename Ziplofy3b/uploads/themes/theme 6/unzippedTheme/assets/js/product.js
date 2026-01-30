(function($){
  // Swap main image
  $(document).on('click', '.pd-thumbs img', function(){
    $('.pd-thumbs img').removeClass('active');
    $(this).addClass('active');
    $('.pd-gallery .main-image').attr('src', $(this).attr('src'));
  });

  // Size/Color selection
  $(document).on('click', '.pd-size .chip, .pd-color .chip', function(){
    var group = $(this).closest('.chips');
    group.find('.chip').removeClass('active');
    $(this).addClass('active');
  });

  // Accordion
  $(document).on('click', '.pd-accordion .item .head', function(){
    var body = $(this).next('.body');
    body.slideToggle(150);
    $(this).parent().siblings().find('.body').slideUp(150);
  });

  // Tabs
  $(document).on('click', '.pd-tabs .tab', function(){
    var key = $(this).data('tab');
    $('.pd-tabs .tab').removeClass('active');
    $(this).addClass('active');
    $('.pd-tabs .tab-pane').removeClass('active');
    $('#tab-' + key).addClass('active');
  });
})(jQuery);

// Dynamic product page rendering
(function renderProductPage() {
  if (!window.liquidjs || typeof PRODUCTS === 'undefined') {
    setTimeout(renderProductPage, 100);
    return;
  }

  function getProductIdFromURL() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  var productId = getProductIdFromURL();
  if (!productId) {
    document.getElementById('product-detail-container').innerHTML = 
      '<div class="text-center"><p>Product not found. <a href="shop.html">Browse all watches</a>.</p></div>';
    return;
  }

  var product = PRODUCTS.find(function(p) {
    return String(p.id) === String(productId);
  });

  if (!product) {
    document.getElementById('product-detail-container').innerHTML = 
      '<div class="text-center"><p>Product not found. <a href="shop.html">Browse all watches</a>.</p></div>';
    return;
  }

  var currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  var priceValue = typeof product.price === 'number' ? product.price : 0;
  var originalPriceValue = typeof product.originalPrice === 'number' ? product.originalPrice : null;

  var formattedProduct = Object.assign({}, product, {
    priceFormatted: currencyFormatter.format(priceValue),
    originalPriceFormatted: originalPriceValue ? currencyFormatter.format(originalPriceValue) : null,
    discountLabel: product.discount ? product.discount + '% OFF' : ''
  });

  // Convert specifications object to array for LiquidJS
  if (formattedProduct.specifications && typeof formattedProduct.specifications === 'object') {
    formattedProduct.specifications = Object.entries(formattedProduct.specifications);
  }

  var engine = new liquidjs.Liquid({
    root: ['templates/'],
    extname: '.liquid'
  });

  var templateNode = document.getElementById('product-detail-template');
  var targetNode = document.getElementById('product-detail-container');

  if (templateNode && targetNode) {
    engine
      .parseAndRender(templateNode.textContent, { product: formattedProduct })
      .then(function(html) {
        targetNode.innerHTML = html;
        
        // Update banner subtitle
        var bannerSubtitle = document.getElementById('product-banner-subtitle');
        if (bannerSubtitle) {
          bannerSubtitle.textContent = formattedProduct.title;
        }

        // Update page title
        document.title = formattedProduct.title + ' - Watch';

        // Update description tab
        var descContent = document.getElementById('product-description-content');
        if (descContent) {
          descContent.innerHTML = '<p>' + (formattedProduct.description || 'No description available.') + '</p>';
          if (formattedProduct.shortDescription) {
            descContent.innerHTML += '<p>' + formattedProduct.shortDescription + '</p>';
          }
        }

        // Update specs tab
        var specsContent = document.getElementById('product-specs-content');
        if (specsContent && formattedProduct.specifications) {
          var specsHtml = '';
          formattedProduct.specifications.forEach(function(spec) {
            specsHtml += '<li><strong>' + spec[0] + ':</strong> ' + spec[1] + '</li>';
          });
          specsContent.innerHTML = specsHtml;
        }

        // Update specs accordion
        var specsAccordion = document.getElementById('product-specs-accordion');
        if (specsAccordion && formattedProduct.specifications) {
          var specsHtml = '';
          formattedProduct.specifications.forEach(function(spec) {
            specsHtml += '<li><strong>' + spec[0] + ':</strong> ' + spec[1] + '</li>';
          });
          specsAccordion.querySelector('ul').innerHTML = specsHtml;
        }

        // Update buybar buttons
        var buybarActions = document.getElementById('buybar-actions');
        if (buybarActions) {
          var buttons = buybarActions.querySelectorAll('button[data-product-id]');
          buttons.forEach(function(btn) {
            btn.setAttribute('data-product-id', formattedProduct.id);
          });
        }

        // Attach product actions
        if (window.attachProductActions) {
          var productsById = {};
          productsById[formattedProduct.id] = formattedProduct;
          attachProductActions(document.body, productsById);
        }

        // Render related products (exclude current product)
        renderRelatedProducts(formattedProduct.id);
        
        // Update header badges
        if (window.updateHeaderBadges) {
          updateHeaderBadges();
        }
      })
      .catch(function(error) {
        console.error('Failed to render product details', error);
        targetNode.innerHTML = '<div class="text-center"><p>Unable to load product details.</p></div>';
      });
  }
  
  // Update badges on initial load
  if (window.updateHeaderBadges) {
    updateHeaderBadges();
  }
})();

function renderRelatedProducts(excludeId) {
  if (!window.liquidjs || typeof PRODUCTS === 'undefined') {
    return;
  }

  var relatedProducts = PRODUCTS.filter(function(p) {
    return String(p.id) !== String(excludeId);
  }).slice(0, 4);

  if (relatedProducts.length === 0) {
    document.getElementById('related-products').innerHTML = 
      '<div class="col-12 text-center"><p>No related products found.</p></div>';
    return;
  }

  var currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  var formatted = relatedProducts.map(function(product) {
    var priceValue = typeof product.price === 'number' ? product.price : 0;
    var originalPriceValue = typeof product.originalPrice === 'number' ? product.originalPrice : null;
    return Object.assign({}, product, {
      priceFormatted: currencyFormatter.format(priceValue),
      originalPriceFormatted: originalPriceValue ? currencyFormatter.format(originalPriceValue) : null,
      discountLabel: product.discount ? product.discount + '% OFF' : ''
    });
  });

  var engine = new liquidjs.Liquid({
    root: ['templates/'],
    extname: '.liquid'
  });

  var templateNode = document.getElementById('related-products-template');
  var targetNode = document.getElementById('related-products');

  if (templateNode && targetNode) {
    engine
      .parseAndRender(templateNode.textContent, { products: formatted })
      .then(function(html) {
        targetNode.innerHTML = html;
        
        // Attach actions to related products
        if (window.attachProductActions) {
          var productsById = {};
          formatted.forEach(function(p) {
            productsById[p.id] = p;
          });
          attachProductActions(targetNode, productsById);
        }
      })
      .catch(function(error) {
        console.error('Failed to render related products', error);
      });
  }
}

