// engine init
const engine = new liquidjs.Liquid({
  root: ['templates/'],
  extname: '.liquid' // automatically look for files with the .liquid extension
});

// product list template
const productListTemplate = document.getElementById('product-list').textContent;
engine.parseAndRender(productListTemplate, { products: PRODUCTS }).then(function (html) {
  document.getElementById('app').innerHTML = html;
});

// user list template
const userListTemplate = document.getElementById('user-list').textContent;
engine.parseAndRender(userListTemplate, { users: USERS }).then(function (html) {
  document.getElementById('app').insertAdjacentHTML('beforeend', html);
});

