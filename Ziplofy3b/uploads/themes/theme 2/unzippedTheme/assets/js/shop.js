/* Shop Page JavaScript */

$(document).ready(function() {
    // Initialize shop functionality
    initShopFilters();
    initViewToggle();
    initSorting();
    initProductActions();
    initPagination();
    
    // Load products with Liquid JS after a short delay to ensure scripts are loaded
    setTimeout(function() {
        initProductDataIntegration();
    }, 100);
});

// Shop Filters
function initShopFilters() {
    // Category filter
    $('.category-filter a').on('click', function(e) {
        e.preventDefault();
        $('.category-filter a').removeClass('active');
        $(this).addClass('active');
        
        const category = $(this).data('category') || 'all';
        filterProductsByCategory(category);
    });
    
    // Price range filter
    $('#priceRange').on('input', function() {
        const maxPrice = $(this).val();
        $('#maxPrice').text('$' + maxPrice);
        filterProductsByPrice(maxPrice);
    });
    
    // Brand filter
    $('.brand-filter input[type="checkbox"]').on('change', function() {
        const selectedBrands = getSelectedBrands();
        filterProductsByBrand(selectedBrands);
    });
    
    // Rating filter
    $('.rating-filter input[type="checkbox"]').on('change', function() {
        const selectedRatings = getSelectedRatings();
        filterProductsByRating(selectedRatings);
    });
}

// View Toggle
function initViewToggle() {
    $('.view-options button').on('click', function() {
        const view = $(this).data('view');
        
        $('.view-options button').removeClass('active');
        $(this).addClass('active');
        
        if (view === 'grid') {
            $('#productsGrid').removeClass('list-view');
        } else {
            $('#productsGrid').addClass('list-view');
        }
    });
}

// Sorting
function initSorting() {
    $('#sortBy').on('change', function() {
        const sortBy = $(this).val();
        sortProducts(sortBy);
    });
}

// Product Actions
function initProductActions() {
    // Add to cart
    $('.add-to-cart').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        addToCart(productId);
    });
    
    // Add to wishlist
    $('.add-to-wishlist').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        addToWishlist(productId);
    });
    
    // Quick view - using Liquid template
    $(document).on('click', '.quick-view', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const productId = $(this).data('product-id');
        if (typeof window.renderQuickViewWithLiquid === 'function') {
            window.renderQuickViewWithLiquid(productId);
        } else {
            console.error('renderQuickViewWithLiquid function not found!');
        }
    });
}

// Pagination
function initPagination() {
    $('.pagination .page-link').on('click', function(e) {
        e.preventDefault();
        const page = $(this).text();
        if (page !== 'Previous' && page !== 'Next') {
            loadPage(parseInt(page));
        }
    });
}

// Filter Functions - Works with Liquid-rendered products
async function filterProductsByCategory(category) {
    if (typeof getAllProducts !== 'function') {
        console.error('getAllProducts function not found!');
        return;
    }
    
    let products = getAllProducts();
    
    if (category && category !== 'all') {
        const cat = String(category).toLowerCase();
        products = products.filter(p => String(p.category || '').toLowerCase() === cat);
    }
    
    // Re-render filtered products using Liquid JS
    if (typeof window.renderProductGrid === 'function') {
        await window.renderProductGrid('#productsGrid .row', products, {
            variant: 'standard',
            context: 'shop',
            colClass: 'col-lg-4 col-md-6 mb-4'
        });
        
        // Re-bind events
        initProductActions();
        updateResultsCount();
    }
}

async function filterProductsByPrice(maxPrice) {
    if (typeof getAllProducts !== 'function') {
        console.error('getAllProducts function not found!');
        return;
    }
    
    let products = getAllProducts();
    products = products.filter(p => (p.price || 0) <= parseFloat(maxPrice));
    
    // Re-render filtered products using Liquid JS
    if (typeof window.renderProductGrid === 'function') {
        await window.renderProductGrid('#productsGrid .row', products, {
            variant: 'standard',
            context: 'shop',
            colClass: 'col-lg-4 col-md-6 mb-4'
        });
        
        // Re-bind events
        initProductActions();
        updateResultsCount();
    }
}

async function filterProductsByBrand(brands) {
    if (typeof getAllProducts !== 'function') {
        console.error('getAllProducts function not found!');
        return;
    }
    
    let products = getAllProducts();
    
    if (brands.length > 0) {
        // Filter by brand (assuming brand is in product name or we need to add brand field)
        products = products.filter(p => {
            const name = (p.name || p.title || '').toLowerCase();
            return brands.some(brand => name.includes(brand.toLowerCase()));
        });
    }
    
    // Re-render filtered products using Liquid JS
    if (typeof window.renderProductGrid === 'function') {
        await window.renderProductGrid('#productsGrid .row', products, {
            variant: 'standard',
            context: 'shop',
            colClass: 'col-lg-4 col-md-6 mb-4'
        });
        
        // Re-bind events
        initProductActions();
        updateResultsCount();
    }
}

async function filterProductsByRating(ratings) {
    if (typeof getAllProducts !== 'function') {
        console.error('getAllProducts function not found!');
        return;
    }
    
    let products = getAllProducts();
    
    if (ratings.length > 0) {
        products = products.filter(p => {
            const rating = Math.floor(p.rating || 0);
            return ratings.some(r => rating >= parseInt(r));
        });
    }
    
    // Re-render filtered products using Liquid JS
    if (typeof window.renderProductGrid === 'function') {
        await window.renderProductGrid('#productsGrid .row', products, {
            variant: 'standard',
            context: 'shop',
            colClass: 'col-lg-4 col-md-6 mb-4'
        });
        
        // Re-bind events
        initProductActions();
        updateResultsCount();
    }
}

// Helper Functions
function getSelectedBrands() {
    const brands = [];
    $('.brand-filter input[type="checkbox"]:checked').each(function() {
        brands.push($(this).val());
    });
    return brands;
}

function getSelectedRatings() {
    const ratings = [];
    $('.rating-filter input[type="checkbox"]:checked').each(function() {
        ratings.push($(this).val());
    });
    return ratings;
}

function updateResultsCount() {
    // Count products in the grid (works with Liquid-rendered products)
    const visibleProducts = $('#productsGrid .row > div').length;
    $('.results-count').text(`Showing 1-${visibleProducts} of ${visibleProducts} products`);
}

// Sorting Function - Works with Liquid-rendered products
async function sortProducts(sortBy) {
    if (typeof getAllProducts !== 'function') {
        console.error('getAllProducts function not found!');
        return;
    }
    
    // Get all products
    let products = getAllProducts();
    
    // Apply sorting
    products.sort(function(a, b) {
        switch(sortBy) {
            case 'price-low':
                return (a.price || 0) - (b.price || 0);
            case 'price-high':
                return (b.price || 0) - (a.price || 0);
            case 'name-asc':
                return (a.name || a.title || '').localeCompare(b.name || b.title || '');
            case 'name-desc':
                return (b.name || b.title || '').localeCompare(a.name || a.title || '');
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'newest':
                // For newest, we'll use the order in the array (first = newest)
                return 0; // Keep original order for now
            default:
                return 0;
        }
    });
    
    // Re-render with sorted products using Liquid JS
    if (typeof window.renderProductGrid === 'function') {
        await window.renderProductGrid('#productsGrid .row', products, {
            variant: 'standard',
            context: 'shop',
            colClass: 'col-lg-4 col-md-6 mb-4'
        });
        
        // Re-bind events
        initProductActions();
        updateResultsCount();
    }
}


// Pagination
function loadPage(page) {
    // Show loading state
    $('#productsGrid').html('<div class="col-12"><div class="products-loading"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-3">Loading products...</p></div></div>');
    
    // Simulate API call
    setTimeout(function() {
        // Reload products (in real app, this would be an AJAX call)
        location.reload();
    }, 1000);
}

// Notification System
function showNotification(message, type = 'info') {
    const notificationHtml = `
        <div class="notification notification-${type}">
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        </div>
    `;
    
    // Remove existing notifications
    $('.notification').remove();
    
    // Add new notification
    $('body').append(notificationHtml);
    
    // Auto remove after 3 seconds
    setTimeout(function() {
        $('.notification').fadeOut(function() {
            $(this).remove();
        });
    }, 3000);
}

// CSS for notifications
const notificationCSS = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        padding: 15px 20px;
        border-left: 4px solid #007bff;
        animation: slideInRight 0.3s ease-out;
    }
    
    .notification-success {
        border-left-color: #28a745;
    }
    
    .notification-error {
        border-left-color: #dc3545;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 18px;
    }
    
    .notification-success .notification-content i {
        color: #28a745;
    }
    
    .notification-error .notification-content i {
        color: #dc3545;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Product Data Integration - Uses Liquid JS for rendering
function initProductDataIntegration() {
    // Load products using Liquid JS renderer
    loadProductsWithLiquid();
}

async function loadProductsWithLiquid() {
    console.log('Loading products with Liquid JS...');
    
    // Check if getAllProducts function exists
    if (typeof getAllProducts !== 'function') {
        console.error('getAllProducts function not found! Make sure constants/products.js is loaded.');
        return;
    }
    
    // Check if renderProductGrid function exists
    if (typeof window.renderProductGrid !== 'function') {
        console.error('renderProductGrid function not found! Make sure js/render.js is loaded.');
        return;
    }
    
    // Get all products from the centralized data
    const products = getAllProducts();
    console.log('Found products:', products.length);
    
    if (products.length === 0) {
        console.warn('No products found in data');
        return;
    }
    
    // Render products using Liquid JS
    await window.renderProductGrid('#productsGrid .row', products, {
        variant: 'standard',
        context: 'shop',
        colClass: 'col-lg-4 col-md-6 mb-4'
    });
    
    console.log('Products loaded successfully with Liquid JS');
    
    // Re-bind events for new products
    initProductActions();
    updateResultsCount();
}

// Enhanced Product Actions
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    // Show loading state
    const $btn = $(`.add-to-cart[data-product-id="${productId}"]`);
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin"></i>');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(function() {
        // Use CartSidebar to add item properly
        if (window.CartSidebar) {
            window.CartSidebar.addItem(
                product.id,
                product.name,
                product.price,
                product.image
            );
        } else {
            // Fallback: Update cart count manually
            const currentCount = parseInt($('.cart-count').text()) || 0;
            $('.cart-count').text(currentCount + 1);
        }
        
        // Show success message
        showNotification(`${product.name} added to cart!`, 'success');
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
        
        // Show cart animation
        showCartAnimation($btn);
    }, 1000);
}

function addToWishlist(productId) {
    const product = getProductById(productId);
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    // Show loading state
    const $btn = $(`.add-to-wishlist[data-product-id="${productId}"]`);
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin"></i>');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(function() {
        // Use WishlistManager to add item properly
        if (window.WishlistManager) {
            window.WishlistManager.addToWishlist(productId);
        } else {
            // Fallback: Update wishlist count manually
            const currentCount = parseInt($('.wishlist-count').text()) || 0;
            $('.wishlist-count').text(currentCount + 1);
            showNotification(`${product.name} added to wishlist!`, 'success');
        }
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
        
        // Show heart animation
        showHeartAnimation($btn);
    }, 1000);
}

function showQuickView(productId) {
    const product = getProductById(productId);
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    const stars = generateStars(product.rating);
    const originalPrice = product.originalPrice ? 
        `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : '';
    
    // Create quick view modal
    const modalHtml = `
        <div class="modal fade" id="quickViewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Quick View</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${product.image}" alt="${product.name}" class="img-fluid">
                            </div>
                            <div class="col-md-6">
                                <h4>${product.name}</h4>
                                <div class="product-rating mb-3">
                                    <div class="stars">
                                        ${stars}
                                    </div>
                                    <span class="rating-text">${product.rating} (${product.reviewCount} reviews)</span>
                                </div>
                                <div class="product-price mb-3">
                                    <span class="current-price">$${product.price.toFixed(2)}</span>
                                    ${originalPrice}
                                </div>
                                <p>${product.description}</p>
                                <div class="product-features mb-3">
                                    <h6>Key Features:</h6>
                                    <ul>
                                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-primary add-to-cart" data-product-id="${productId}">
                                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                    </button>
                                    <button class="btn btn-outline-secondary add-to-wishlist" data-product-id="${productId}">
                                        <i class="fas fa-heart me-2"></i>Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    $('#quickViewModal').remove();
    
    // Add new modal
    $('body').append(modalHtml);
    
    // Show modal
    $('#quickViewModal').modal('show');
    
    // Bind events for modal buttons
    $('#quickViewModal .add-to-cart').on('click', function() {
        addToCart(productId);
        $('#quickViewModal').modal('hide');
    });
    
    $('#quickViewModal .add-to-wishlist').on('click', function() {
        addToWishlist(productId);
        $('#quickViewModal').modal('hide');
    });
}

// Animation Functions
function showCartAnimation($btn) {
    const $cartBtn = $('.cart-btn');
    const $productImage = $btn.closest('.product-card').find('.product-image img');
    
    // Create flying cart icon
    const $flyingCart = $('<i class="fas fa-shopping-cart flying-cart"></i>');
    $('body').append($flyingCart);
    
    // Get positions
    const productPos = $productImage.offset();
    const cartPos = $cartBtn.offset();
    
    // Set initial position
    $flyingCart.css({
        position: 'absolute',
        left: productPos.left + $productImage.width() / 2,
        top: productPos.top + $productImage.height() / 2,
        fontSize: '24px',
        color: '#007bff',
        zIndex: 9999,
        pointerEvents: 'none'
    });
    
    // Animate to cart
    $flyingCart.animate({
        left: cartPos.left + $cartBtn.width() / 2,
        top: cartPos.top + $cartBtn.height() / 2,
        fontSize: '16px'
    }, 800, function() {
        $flyingCart.remove();
    });
}

function showHeartAnimation($btn) {
    const $wishlistBtn = $('.wishlist-btn');
    const $productImage = $btn.closest('.product-card').find('.product-image img');
    
    // Create flying heart icon
    const $flyingHeart = $('<i class="fas fa-heart flying-heart"></i>');
    $('body').append($flyingHeart);
    
    // Get positions
    const productPos = $productImage.offset();
    const wishlistPos = $wishlistBtn.offset();
    
    // Set initial position
    $flyingHeart.css({
        position: 'absolute',
        left: productPos.left + $productImage.width() / 2,
        top: productPos.top + $productImage.height() / 2,
        fontSize: '24px',
        color: '#dc3545',
        zIndex: 9999,
        pointerEvents: 'none'
    });
    
    // Animate to wishlist
    $flyingHeart.animate({
        left: wishlistPos.left + $wishlistBtn.width() / 2,
        top: wishlistPos.top + $wishlistBtn.height() / 2,
        fontSize: '16px'
    }, 800, function() {
        $flyingHeart.remove();
    });
}

// Add notification CSS
$('<style>').text(notificationCSS).appendTo('head');
