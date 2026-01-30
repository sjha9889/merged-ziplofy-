// engine init
const engine = new liquidjs.Liquid({
  root: ['templates/'],
  extname: '.liquid' // automatically look for files with the .liquid extension
});

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if PRODUCTS is available
  if (typeof PRODUCTS === 'undefined') {
    console.error('PRODUCTS constant is not defined. Make sure products.js is loaded.');
    return;
  }

  // Featured Products - Get products with badge "Best Seller" or high rating (first 4)
  const featuredProducts = PRODUCTS
    .filter(product => product.badge === 'Best Seller' || product.rating >= 4.7)
    .slice(0, 4);
  
  // If not enough featured products, take top rated products
  if (featuredProducts.length < 4) {
    const topRated = PRODUCTS
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    featuredProducts.length = 0;
    featuredProducts.push(...topRated);
  }

  // Render Featured Products
  if (featuredProducts.length > 0) {
    const featuredPromises = featuredProducts.map(product => 
      engine.renderFile('featured-product-card', { product: product })
    );
    
    Promise.all(featuredPromises)
      .then(function(htmlArray) {
        const allHtml = htmlArray.join('');
        const container = document.getElementById('featured-products-grid');
        if (container) {
          container.innerHTML = allHtml;
        }
      })
      .catch(function(err) {
        console.error('Error rendering featured products:', err);
      });
  }

  // Trending Products - Get products with high reviewCount or trending badge (first 5)
  const trendingProducts = PRODUCTS
    .filter(product => product.badge === 'Trending' || product.reviewCount >= 1000)
    .slice(0, 5);
  
  // If not enough trending products, take products with highest reviewCount
  if (trendingProducts.length < 5) {
    const topReviewed = PRODUCTS
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5);
    trendingProducts.length = 0;
    trendingProducts.push(...topReviewed);
  }

  // Render Trending Products
  if (trendingProducts.length > 0) {
    const trendingPromises = trendingProducts.map(product => 
      engine.renderFile('trending-product-card', { product: product })
    );
    
    Promise.all(trendingPromises)
      .then(function(htmlArray) {
        const trendingHtml = htmlArray.join('');
        const container = document.getElementById('trending-track');
        if (container) {
          container.innerHTML = trendingHtml;
        }
      })
      .catch(function(err) {
        console.error('Error rendering trending products:', err);
      });
  }

  // Helper function to get category description
  function getCategoryDescription(category) {
    const descriptions = {
      'Smartphones': 'Latest smartphones & mobile tech',
      'Laptops': 'Premium laptops & computers',
      'Audio': 'Headphones, speakers & audio gear',
      'Tablets': 'Tablets & portable devices',
      'Gaming': 'Gaming consoles & accessories',
      'TVs': 'Smart TVs & displays'
    };
    return descriptions[category] || 'Explore our collection';
  }

  // Helper function to get category image
  function getCategoryImage(category) {
    const images = {
      'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
      'Gaming': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      'TVs': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop'
    };
    return images[category] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
  }

  // Categories - Extract unique categories from products
  const categoryMap = {};
  PRODUCTS.forEach(product => {
    if (product.category && !categoryMap[product.category]) {
      categoryMap[product.category] = {
        name: product.category,
        slug: product.category.toLowerCase().replace(/\s+/g, '-'),
        description: getCategoryDescription(product.category),
        image: getCategoryImage(product.category)
      };
    }
  });
  const categories = Object.values(categoryMap);

  // Render Categories
  if (categories.length > 0) {
    const categoryPromises = categories.map(category => 
      engine.renderFile('category-card', { category: category })
    );
    
    Promise.all(categoryPromises)
      .then(function(htmlArray) {
        const categoriesHtml = htmlArray.join('');
        const container = document.getElementById('categories-grid');
        if (container) {
          container.innerHTML = categoriesHtml;
        }
      })
      .catch(function(err) {
        console.error('Error rendering categories:', err);
      });
  }

  // Deals - Create deals based on products with high discounts or special badges
  const deals = [];
  
  // Deal 1: Flash Sale - Products with highest discount
  const highDiscountProducts = PRODUCTS
    .filter(p => p.discount && p.discount >= 10)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 1);
  
  if (highDiscountProducts.length > 0) {
    const maxDiscount = Math.max(...PRODUCTS.filter(p => p.discount).map(p => p.discount));
    deals.push({
      title: 'Electronics Mega Sale',
      description: `Up to ${maxDiscount}% off on selected items`,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
      badge: 'Flash Sale',
      timer: { hours: '02', minutes: '45', seconds: '30' },
      link: 'products.html',
      buttonText: 'Shop Now'
    });
  }

  // Deal 2: New Arrivals - Products with "New Arrival" badge
  const newArrivalProducts = PRODUCTS.filter(p => p.badge === 'New Arrival');
  if (newArrivalProducts.length > 0) {
    deals.push({
      title: 'Latest Tech Collection',
      description: 'Discover the newest innovations',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop',
      badge: 'New Arrivals',
      link: 'products.html?filter=new',
      buttonText: 'Explore'
    });
  }

  // If not enough deals, add a default deal
  if (deals.length === 0) {
    deals.push({
      title: 'Special Offers',
      description: 'Check out our amazing deals',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
      badge: 'Sale',
      link: 'products.html',
      buttonText: 'Shop Now'
    });
  }

  // Render Deals
  if (deals.length > 0) {
    const dealPromises = deals.map(deal => 
      engine.renderFile('deal-card', { deal: deal })
    );
    
    Promise.all(dealPromises)
      .then(function(htmlArray) {
        const dealsHtml = htmlArray.join('');
        const container = document.getElementById('deals-grid');
        if (container) {
          container.innerHTML = dealsHtml;
        }
      })
      .catch(function(err) {
        console.error('Error rendering deals:', err);
      });
  }

  // Legacy product list template (if exists)
  const productListTemplate = document.getElementById('product-list');
  if (productListTemplate) {
    engine.parseAndRender(productListTemplate.textContent, { products: PRODUCTS }).then(function (html) {
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = html;
      }
    });
  }

  // Legacy user list template (if exists)
  const userListTemplate = document.getElementById('user-list');
  if (userListTemplate && typeof USERS !== 'undefined') {
    engine.parseAndRender(userListTemplate.textContent, { users: USERS }).then(function (html) {
      const app = document.getElementById('app');
      if (app) {
        app.insertAdjacentHTML('beforeend', html);
      }
    });
  }
});

