document.addEventListener('DOMContentLoaded', bindQuickView);

function bindQuickView() {
  if (typeof $ === 'undefined') return;

  $(document).on('click', '.quick-view', function (e) {
    e.preventDefault();
    var productId = $(this).data('product-id');
    if (!productId) return;

    var product = null;
    if (typeof getProductById === 'function') {
      product = getProductById(productId);
    } else if (typeof PRODUCTS !== 'undefined') {
      product = PRODUCTS.find(function (p) {
        return String(p.id) === String(productId);
      });
    }

    if (!product) {
      alert('Product not found');
      return;
    }

    populateQuickView(product);
    $('#quick-view-modal').modal('show');
  });
}

function populateQuickView(product) {
  var content = $('#quick-view-content');

  var rating = Math.round(product.rating || 0);
  var starsHtml = '';
  for (var i = 1; i <= 5; i++) {
    starsHtml += '<i class="fa ' + (i <= rating ? 'fa-star' : 'fa-star-o') + '"></i>';
  }

  var featuresHtml = '';
  if (product.features && Array.isArray(product.features)) {
    featuresHtml = '<ul class="list-unstyled">';
    product.features.forEach(function (feature) {
      featuresHtml += '<li><i class="fa fa-check text-success"></i> ' + feature + '</li>';
    });
    featuresHtml += '</ul>';
  }

  var colorsHtml = '';
  if (product.colors && Array.isArray(product.colors)) {
    colorsHtml = '<div class="product-colors" style="margin-top: 10px; display: inline-block;">';
    var colorMap = getColorMap();
    product.colors.forEach(function (color) {
      var colorHex = colorMap[color] || '#CCCCCC';
      colorsHtml += '<span class="color-swatch" style="display: inline-block; width: 30px; height: 30px; border-radius: 50%; background-color: ' + colorHex + '; border: 2px solid #ddd; margin-right: 8px; cursor: pointer; vertical-align: middle;" title="' + color + '"></span>';
    });
    colorsHtml += '</div>';
  }

  var sizesHtml = '';
  if (product.sizes && Array.isArray(product.sizes)) {
    sizesHtml = '<div class="product-sizes" style="margin-top: 10px; display: inline-block;">';
    product.sizes.forEach(function (size) {
      sizesHtml += '<span class="size-chip" style="display: inline-block; padding: 6px 12px; margin-right: 8px; margin-bottom: 5px; border: 2px solid #E4E7ED; border-radius: 4px; background-color: #FFF; color: #333; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; vertical-align: middle;" onmouseover="this.style.borderColor=\'#D10024\'; this.style.color=\'#D10024\';" onmouseout="this.style.borderColor=\'#E4E7ED\'; this.style.color=\'#333\';">' + size + '</span>';
    });
    sizesHtml += '</div>';
  }

  var priceHtml = '<h3 class="product-price" style="color: #D10024; font-size: 24px;">₹' + (product.price || 0);
  if (product.originalPrice && product.originalPrice > product.price) {
    priceHtml += ' <del class="product-old-price" style="font-size: 70%; color: #8D99AE;">₹' + product.originalPrice + '</del>';
    if (product.discount) {
      priceHtml += ' <span class="label label-danger">-' + product.discount + '% OFF</span>';
    }
  }
  priceHtml += '</h3>';

  var html = '<div class="row">';
  html += '<div class="col-md-6">';
  html += '<div class="product-img" style="margin-bottom: 10px;">';
  html += '<img src="' + (product.image || '') + '" alt="' + (product.title || '') + '" class="img-responsive" style="width: 100%;">';
  if (product.discount > 0 || product.badge) {
    html += '<div class="product-label" style="position: absolute; top: 15px; right: 15px;">';
    if (product.discount > 0) {
      html += '<span class="label label-danger">-' + product.discount + '%</span> ';
    }
    if (product.badge === 'New' || product.badge === 'NEW') {
      html += '<span class="label label-success">NEW</span>';
    }
    html += '</div>';
  }
  html += '</div>';
  html += '</div>';

  html += '<div class="col-md-6">';
  html += '<div class="product-details">';
  html += '<p class="product-category" style="text-transform: uppercase; font-size: 12px; color: #8D99AE; margin-bottom: 5px;">' + (product.categoryLabel || product.category || '') + '</p>';
  html += '<h3 class="product-name" style="text-transform: uppercase; font-size: 20px;">' + (product.title || '') + '</h3>';
  html += priceHtml;
  html += '<div class="product-rating">' + starsHtml;
  if (product.reviewCount) {
    html += ' <span style="color: #8D99AE; font-size: 12px;">(' + product.reviewCount + ' reviews)</span>';
  }
  html += '</div>';

  if (product.description) {
    html += '<div class="product-description" style="margin: 10px 0;"><p style="margin-bottom: 0;">' + product.description + '</p></div>';
  }

  if (featuresHtml) {
    html += '<div class="product-features" style="margin: 10px 0;"><h4 style="font-size: 16px; margin-bottom: 8px;">Key Features:</h4>' + featuresHtml + '</div>';
  }

  html += colorsHtml + sizesHtml;
  html += '<div class="product-actions" style="margin-top: 15px;">' +
    '<button class="primary-btn" style="margin-right: 10px;"><i class="fa fa-shopping-cart"></i> Add to Cart</button>' +
    '<a href="product.html?id=' + product.id + '" class="primary-btn" style="background-color: #1e1f29;"><i class="fa fa-eye"></i> View Details</a>' +
    '</div>';
  html += '</div></div></div>';

  content.html(html);
}

function getColorMap() {
  return {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Yellow': '#FFFF00',
    'Pink': '#FFC0CB',
    'Gray': '#808080',
    'Grey': '#808080',
    'Silver': '#C0C0C0',
    'Gold': '#FFD700',
    'Brown': '#A52A2A',
    'Orange': '#FFA500',
    'Purple': '#800080',
    'Navy Blue': '#000080',
    'Midnight': '#191970',
    'Starlight': '#E6E6FA',
    'Natural Titanium': '#878681',
    'Blue Titanium': '#4A90A4',
    'White Titanium': '#E8E8E8',
    'Black Titanium': '#1C1C1C',
    'Titanium Black': '#1C1C1C',
    'Titanium Gray': '#878681',
    'Titanium Violet': '#8B7FA8',
    'Titanium Yellow': '#F5DEB3',
    'Space Gray': '#717378',
    'Core Black': '#000000',
    'Solar Red': '#FF4500',
    'Bred': '#000000',
    'Chicago': '#FFFFFF',
    'Royal': '#0000FF',
    'Shadow': '#808080',
    'Multi-color': '#FFD700'
  };
}

