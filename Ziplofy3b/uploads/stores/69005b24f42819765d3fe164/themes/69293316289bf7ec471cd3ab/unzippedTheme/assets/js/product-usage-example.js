/**
 * Product Data Usage Examples
 * This file shows how to use the product data array in different scenarios
 */

// Example 1: Display trending products on homepage
function displayTrendingProducts() {
    const trendingProducts = getTrendingProducts();
    console.log('Trending Products:', trendingProducts);
    
    // Use in HTML
    trendingProducts.forEach(product => {
        console.log(`${product.name} - $${product.price}`);
    });
}

// Example 2: Display products by category
function displayElectronicsProducts() {
    const electronics = getProductsByCategory('electronics');
    console.log('Electronics Products:', electronics);
}

// Example 3: Search functionality
function searchProductsExample() {
    const searchResults = searchProducts('wireless');
    console.log('Search Results:', searchResults);
}

// Example 4: Display sale products
function displaySaleProducts() {
    const saleProducts = getSaleProducts();
    console.log('Sale Products:', saleProducts);
}

// Example 5: Get product details for product page
function getProductDetails(productId) {
    const product = getProductById(productId);
    if (product) {
        console.log('Product Details:', product);
        return product;
    }
    return null;
}

// Example 6: Display related products
function displayRelatedProducts(productId) {
    const relatedProducts = getRelatedProducts(productId);
    console.log('Related Products:', relatedProducts);
}

// Example 7: Filter products by price range
function displayProductsInPriceRange(min, max) {
    const products = getProductsByPriceRange(min, max);
    console.log(`Products between $${min} - $${max}:`, products);
}

// Example 8: Display flash sale products
function displayFlashSaleProducts() {
    const flashSaleProducts = getFlashSaleProducts();
    console.log('Flash Sale Products:', flashSaleProducts);
}

// Example 9: Get product statistics for admin
function displayProductStats() {
    const stats = getProductStats();
    console.log('Product Statistics:', stats);
}

// Example 10: Display random products for recommendations
function displayRandomProducts() {
    const randomProducts = getRandomProducts(4);
    console.log('Random Products:', randomProducts);
}

// Example 11: Create product card HTML
function createProductCard(product) {
    const badgeHtml = product.badges.map(badge => 
        `<span class="badge ${badge}">${badge.charAt(0).toUpperCase() + badge.slice(1)}</span>`
    ).join('');

    const originalPriceHtml = product.originalPrice ? 
        `<span class="original-price">$${product.originalPrice}</span>` : '';

    const discountHtml = product.discount > 0 ? 
        `<span class="discount">${product.discount}% OFF</span>` : '';

    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badges">
                    ${badgeHtml}
                </div>
                <div class="product-card-actions">
                    <button class="product-action-btn" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="product-action-btn" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${originalPriceHtml}
                    ${discountHtml}
                </div>
                <button class="btn btn-primary add-to-cart-btn" 
                        data-product-id="${product.id}" 
                        data-product-name="${product.name}" 
                        data-product-price="${product.price}" 
                        data-product-image="${product.image}">
                    <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Helper function to generate star rating HTML
function generateStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Example 12: Populate products grid
function populateProductsGrid(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Example 13: Initialize homepage with trending products
function initializeHomepage() {
    const trendingProducts = getTrendingProducts();
    populateProductsGrid('trending-products-grid', trendingProducts);
}

// Example 14: Initialize shop page with all products
function initializeShopPage() {
    const allProducts = getAllProducts();
    populateProductsGrid('shop-products-grid', allProducts);
}

// Example 15: Initialize category page
function initializeCategoryPage(category) {
    const categoryProducts = getProductsByCategory(category);
    populateProductsGrid('category-products-grid', categoryProducts);
}

// Usage Examples:
console.log('=== Product Data Usage Examples ===');

// Get all products
console.log('All Products:', getAllProducts());

// Get trending products
console.log('Trending Products:', getTrendingProducts());

// Get electronics products
console.log('Electronics:', getProductsByCategory('electronics'));

// Search products
console.log('Search "wireless":', searchProducts('wireless'));

// Get product by ID
console.log('Product ID 1:', getProductById(1));

// Get sale products
console.log('Sale Products:', getSaleProducts());

// Get product statistics
console.log('Product Stats:', getProductStats());
