// engine init
const engine = new liquidjs.Liquid({
  root: ['templates/'],
  extname: '.liquid' // automatically look for files with the .liquid extension
});

// product list template
const productListTemplate = document.getElementById('product-list');
if (productListTemplate) {
  engine.parseAndRender(productListTemplate.textContent, { products: PRODUCTS }).then(function (html) {
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = html;
    }
  });
}

// user list template
const userListTemplate = document.getElementById('user-list');
if (userListTemplate) {
  engine.parseAndRender(userListTemplate.textContent, { users: USERS }).then(function (html) {
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.insertAdjacentHTML('beforeend', html);
    }
  });
}

// top deals template
const topDealsTemplate = document.getElementById('top-deals-template');
if (topDealsTemplate) {
  engine.parseAndRender(topDealsTemplate.textContent, { products: PRODUCTS }).then(function (html) {
    const topDealsContainer = document.getElementById('top-deals-container');
    if (topDealsContainer) {
      topDealsContainer.innerHTML = html;
    }
  });
}

// featured products (hero products) template
const heroProductsTemplate = document.getElementById('hero-products-template');
if (heroProductsTemplate) {
  engine.parseAndRender(heroProductsTemplate.textContent, { products: PRODUCTS }).then(function (html) {
    const heroProductsContainer = document.getElementById('hero-products-container');
    if (heroProductsContainer) {
      heroProductsContainer.innerHTML = html;
    }
  });
}

// shop products template
const shopProductsTemplate = document.getElementById('shop-products-template');
if (shopProductsTemplate) {
  engine.parseAndRender(shopProductsTemplate.textContent, { products: PRODUCTS }).then(function (html) {
    const shopProductsGrid = document.getElementById('productsGrid');
    if (shopProductsGrid) {
      shopProductsGrid.innerHTML = html;
    }
  });
}

