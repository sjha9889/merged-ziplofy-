document.addEventListener('DOMContentLoaded', function () {
  if (!Array.isArray(PRODUCTS)) {
    renderMessage('Categories data is not available.');
    return;
  }

  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  const categories = buildCategories(PRODUCTS);
  if (!categories.length) {
    renderMessage('No categories found.');
    return;
  }

  grid.innerHTML = categories.map(renderCategoryCard).join('');

  function renderMessage(message) {
    if (grid) {
      grid.innerHTML = `<p class="loading-text">${message}</p>`;
    }
  }
});

function buildCategories(products) {
  const map = {};
  products.forEach(function (product) {
    if (!product.category) return;
    const key = product.category;
    if (!map[key]) {
      map[key] = {
        name: product.category,
        slug: slugify(product.category),
        count: 0
      };
    }
    map[key].count += 1;
  });
  return Object.values(map).sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function renderCategoryCard(category) {
  const description = getCategoryDescription(category.name);
  const image = getCategoryImage(category.name);
  const countLabel = formatCount(category.count);
  return `
    <div class="category-card">
      <div class="category-image">
        <img src="${image}" alt="${category.name}">
        <div class="category-overlay">
          <h3>${category.name}</h3>
          <p>${description}</p>
          <span class="product-count">${countLabel}</span>
        </div>
      </div>
      <div class="category-info">
        <h3>${category.name}</h3>
        <p>${description}</p>
        <a href="products.html?category=${category.slug}" class="category-btn">Shop Now</a>
      </div>
    </div>
  `;
}

function getCategoryDescription(name) {
  const descriptions = {
    'Smartphones': 'Latest smartphones & mobile tech',
    'Laptops': 'Performance laptops for work and play',
    'Audio': 'Headphones, earbuds & portable speakers',
    'Tablets': 'Large-screen tablets & accessories',
    'Gaming': 'Consoles, controllers & gaming gear',
    'TVs': 'Smart TVs, projectors & displays'
  };
  return descriptions[name] || 'Explore our curated collection of ' + name + '.';
}

function getCategoryImage(name) {
  const images = {
    'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    'Gaming': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
    'TVs': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop'
  };
  return images[name] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
}

function formatCount(count) {
  if (!count) return 'New arrivals';
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k+ Products`;
  }
  return `${count}+ Products`;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

