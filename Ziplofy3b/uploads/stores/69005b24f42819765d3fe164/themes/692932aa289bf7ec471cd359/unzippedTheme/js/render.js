// engine init
const engine = new liquidjs.Liquid({
  root: ['templates/'],
  extname: '.liquid' // automatically look for files with the .liquid extension
});

window.liquidEngine = engine;

// Normalize product for template
function normalizeProductForTemplate(product) {
  if (!product) return null;
  const placeholderImage = 'https://via.placeholder.com/400x300/1a1a1a/FF5E00?text=No+Image';
  const priceValue = typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 0);
  return {
    ...product,
    id: product.id || String(product.id || ''),
    name: product.name || product.title || 'Product',
    title: product.title || product.name || 'Product',
    image: product.image || (Array.isArray(product.images) ? product.images[0] : '') || placeholderImage,
    price: priceValue,
    discount: product.discount || product.discount_percent || 0,
    reviews: product.reviewCount || product.reviews || 0,
    badge: product.badge || '',
    rating: Number(product.rating || 0),
    category: product.category || '',
    brand: product.brand || ''
  };
}

// Render featured products
document.addEventListener('DOMContentLoaded', function() {
  const featuredProductsContainer = document.getElementById('featuredProducts');
  
  if (featuredProductsContainer && typeof PRODUCTS !== 'undefined') {
    // Get first 8 products as featured (or all if less than 8)
    const featuredProducts = PRODUCTS.slice(0, 8).map(normalizeProductForTemplate);
    
    // Render featured products template
    engine.renderFile('featured-products', { products: featuredProducts })
      .then(function(html) {
        featuredProductsContainer.innerHTML = html;
      })
      .catch(function(err) {
        console.error('Error rendering featured products:', err);
      });
  }
  
  // Render special offers
  const specialOffersContainer = document.getElementById('specialOffersContainer');
  
  if (specialOffersContainer && typeof SPECIAL_OFFERS !== 'undefined' && typeof OFFER_TABS !== 'undefined') {
    // Render special offers template
    engine.renderFile('special-offers', { 
      special_offers: SPECIAL_OFFERS,
      offer_tabs: OFFER_TABS
    })
      .then(function(html) {
        specialOffersContainer.innerHTML = html;
      })
      .catch(function(err) {
        console.error('Error rendering special offers:', err);
      });
  }
});

// Legacy product list template (if needed)
const productListTemplate = document.getElementById('product-list');
if (productListTemplate) {
  engine.parseAndRender(productListTemplate.textContent, { products: PRODUCTS }).then(function (html) {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;
    }
  });
}

// Legacy user list template (if needed)
const userListTemplate = document.getElementById('user-list');
if (userListTemplate) {
  engine.parseAndRender(userListTemplate.textContent, { users: USERS }).then(function (html) {
    const app = document.getElementById('app');
    if (app) {
      app.insertAdjacentHTML('beforeend', html);
    }
  });
}
