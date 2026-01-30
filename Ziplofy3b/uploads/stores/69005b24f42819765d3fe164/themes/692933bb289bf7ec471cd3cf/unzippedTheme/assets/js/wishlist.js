// Wishlist functionality
var WISHLIST_STORAGE_KEY = 'theme6_wishlist_items';

function loadWishlist() {
  try {
    var wishlist = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY));
    return Array.isArray(wishlist) ? wishlist : [];
  } catch (error) {
    console.warn('Unable to parse wishlist from storage', error);
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
}

function addToWishlist(productId) {
  var wishlist = loadWishlist();
  if (!wishlist.some(function(id) { return String(id) === String(productId); })) {
    wishlist.push(productId);
    saveWishlist(wishlist);
  }
}

function removeFromWishlist(productId) {
  var wishlist = loadWishlist();
  wishlist = wishlist.filter(function(id) {
    return String(id) !== String(productId);
  });
  saveWishlist(wishlist);
}

function isInWishlist(productId) {
  var wishlist = loadWishlist();
  return wishlist.some(function(id) {
    return String(id) === String(productId);
  });
}

function renderWishlist() {
  if (!window.liquidjs || typeof PRODUCTS === 'undefined') {
    setTimeout(renderWishlist, 100);
    return;
  }

  var wishlistIds = loadWishlist();
  var countElement = document.getElementById('wishlist-count');
  var clearBtn = document.getElementById('clear-wishlist-btn');
  
  if (wishlistIds.length === 0) {
    document.getElementById('wishlist-items').innerHTML = 
      '<div class="col-12 text-center" style="padding: 80px 20px;"><div class="wishlist-empty"><i class="fa fa-heart-o" style="font-size: 64px; color: #ddd; margin-bottom: 20px;"></i><h3 style="margin-bottom: 12px; color: #666;">Your wishlist is empty</h3><p style="color: #999; margin-bottom: 24px;">Start adding products you love!</p><a href="shop.html" class="btn-browse-watches">Browse Watches</a></div></div>';
    if (countElement) {
      countElement.textContent = '0 items';
    }
    if (clearBtn) {
      clearBtn.style.display = 'none';
    }
    return;
  }
  
  if (countElement) {
    countElement.textContent = wishlistIds.length + (wishlistIds.length === 1 ? ' item' : ' items');
  }
  if (clearBtn) {
    clearBtn.style.display = 'inline-block';
  }

  var wishlistProducts = wishlistIds.map(function(id) {
    return PRODUCTS.find(function(p) {
      return String(p.id) === String(id);
    });
  }).filter(function(p) {
    return p !== undefined;
  });

  if (wishlistProducts.length === 0) {
    document.getElementById('wishlist-items').innerHTML = 
      '<div class="col-12 text-center" style="padding: 80px 20px;"><div class="wishlist-empty"><i class="fa fa-heart-o" style="font-size: 64px; color: #ddd; margin-bottom: 20px;"></i><h3 style="margin-bottom: 12px; color: #666;">Your wishlist is empty</h3><p style="color: #999; margin-bottom: 24px;">Start adding products you love!</p><a href="shop.html" class="btn-browse-watches">Browse Watches</a></div></div>';
    if (countElement) {
      countElement.textContent = '0 items';
    }
    if (clearBtn) {
      clearBtn.style.display = 'none';
    }
    return;
  }

  var currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  var formatted = wishlistProducts.map(function(product) {
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

  var templateNode = document.getElementById('wishlist-items-template');
  var targetNode = document.getElementById('wishlist-items');

  if (templateNode && targetNode) {
    engine
      .parseAndRender(templateNode.textContent, { products: formatted })
      .then(function(html) {
        targetNode.innerHTML = html;
        
        // Attach actions
        if (window.attachProductActions) {
          var productsById = {};
          formatted.forEach(function(p) {
            productsById[p.id] = p;
          });
          attachProductActions(targetNode, productsById);
        }

        // Attach remove handlers
        targetNode.addEventListener('click', function(event) {
          var removeBtn = event.target.closest('.remove-wishlist');
          if (removeBtn) {
            event.preventDefault();
            var productId = removeBtn.getAttribute('data-product-id');
            if (confirm('Remove this item from wishlist?')) {
              removeFromWishlist(productId);
              if (window.updateHeaderBadges) {
                updateHeaderBadges();
              }
              renderWishlist();
            }
          }
        });
      })
      .catch(function(error) {
        console.error('Failed to render wishlist', error);
      });
  }
}

function renderRecentlyViewed() {
  if (!window.liquidjs || typeof PRODUCTS === 'undefined') {
    setTimeout(renderRecentlyViewed, 100);
    return;
  }

  var recentProducts = PRODUCTS.slice(0, 4);

  var currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  var formatted = recentProducts.map(function(product) {
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

  var templateNode = document.getElementById('recently-viewed-template');
  var targetNode = document.getElementById('recently-viewed');

  if (templateNode && targetNode) {
    engine
      .parseAndRender(templateNode.textContent, { products: formatted })
      .then(function(html) {
        targetNode.innerHTML = html;
        
        if (window.attachProductActions) {
          var productsById = {};
          formatted.forEach(function(p) {
            productsById[p.id] = p;
          });
          attachProductActions(targetNode, productsById);
        }
      })
      .catch(function(error) {
        console.error('Failed to render recently viewed', error);
      });
  }
}

// Clear all wishlist
function clearWishlist() {
  if (confirm('Are you sure you want to clear all items from your wishlist?')) {
    saveWishlist([]);
    if (window.updateHeaderBadges) {
      updateHeaderBadges();
    }
    renderWishlist();
  }
}

// Attach clear all button
document.addEventListener('DOMContentLoaded', function() {
  var clearBtn = document.getElementById('clear-wishlist-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.preventDefault();
      clearWishlist();
    });
  }
});

// Initialize on page load
renderWishlist();
renderRecentlyViewed();
if (window.updateHeaderBadges) {
  updateHeaderBadges();
}

