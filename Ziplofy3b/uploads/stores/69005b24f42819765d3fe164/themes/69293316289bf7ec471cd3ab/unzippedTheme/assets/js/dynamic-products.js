/**
 * Dynamic Product System - Universal product loading for entire website
 * This system will make all pages dynamic using product-data.js
 */

// Global Dynamic Product Manager
const DynamicProducts = {
    
    // Initialize dynamic products on any page
    init: function() {
        console.log('Initializing Dynamic Products...');
        this.loadProductsOnPage();
        this.bindGlobalEvents();
    },
    
    // Load products based on current page
    loadProductsOnPage: function() {
        const currentPage = this.getCurrentPage();
        console.log('Current page:', currentPage);
        
        switch(currentPage) {
            case 'index':
                this.loadHomepageProducts();
                break;
            case 'shop':
                this.loadShopProducts();
                break;
            case 'products':
                this.loadProductsPage();
                break;
            case 'product-detail':
                this.loadProductDetail();
                break;
            case 'wishlist':
                this.loadWishlistProducts();
                break;
            case 'cart':
                this.loadCartProducts();
                break;
            default:
                console.log('No specific product loading for page:', currentPage);
        }
    },
    
    // Get current page name
    getCurrentPage: function() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        return filename || 'index';
    },
    
    // Load products for homepage
    loadHomepageProducts: function() {
        // Get all products
        const allProducts = getAllProducts();
        
        // Load trending products (with trending badge)
        const trendingProducts = getTrendingProducts();
        this.loadProductsInContainer('#trending-products .row', trendingProducts, 'trending');
        
        // Load new products (with new badge)
        const newProducts = getNewProducts().slice(0, 4);
        this.loadProductsInContainer('#new-products .row', newProducts, 'new');
        
        // Load sale products (with discount > 0)
        const saleProducts = getSaleProducts();
        this.loadProductsInContainer('#sale-products .row', saleProducts, 'sale');
        
        // Load featured products (bestseller or hot products)
        let featuredProducts = getBestsellerProducts();
        if (featuredProducts.length === 0) {
            // Fallback to hot products or high-rated products
            featuredProducts = getHotProducts();
            if (featuredProducts.length === 0) {
                // Fallback to top-rated products
                featuredProducts = allProducts
                    .filter(p => p.rating >= 4.5)
                    .slice(0, 4);
            }
        }
        // Limit to 4 products for better layout
        featuredProducts = featuredProducts.slice(0, 4);
        this.loadProductsInContainer('#featured-products .row', featuredProducts, 'featured');
    },
    
    // Load products for shop page
    loadShopProducts: function() {
        console.log('Loading shop products...');
        
        // Clear existing static products
        $('#productsGrid .row').empty();
        
        // Load all products
        this.loadProductsInContainer('#productsGrid .row', getAllProducts(), 'shop');
        
        // Update results count
        this.updateResultsCount();
    },
    
    // Load products for products page
    loadProductsPage: function() {
        console.log('Loading products page...');
        
        // Check for category filter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        let products = getAllProducts();
        
        // Filter by category if specified
        if (category && category !== 'all') {
            products = getProductsByCategory(category);
            console.log(`Filtering products by category: ${category}`);
        }
        
        // Load products in container
        this.loadProductsInContainer('#products-grid', products, 'products');
        
        // Update page title if category is specified
        if (category && category !== 'all') {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            document.title = `${categoryName} Products - ShoppingCart`;
            $('.page-title').text(`${categoryName} Products`);
        }
    },
    
    // Load product detail page
    loadProductDetail: function() {
        console.log('Loading product detail...');
        
        const productId = this.getProductIdFromUrl();
        if (!productId) {
            console.warn('Product ID not found in URL');
            return;
        }

        const product = getProductById(productId);
        if (!product) {
            console.warn('Product not found for id:', productId);
            return;
        }

        // Prefer Liquid template if available
        if (typeof window.renderProductDetailWithLiquid === 'function') {
            const result = window.renderProductDetailWithLiquid(product);
            if (result && typeof result.then === 'function') {
                result.then(() => {
                    this.loadRelatedProducts(product);
                });
            } else {
                this.loadRelatedProducts(product);
            }
        } else {
            this.renderProductDetail(product);
            this.loadRelatedProducts(product);
        }
    },
    
    // Load wishlist products
    loadWishlistProducts: function() {
        console.log('Loading wishlist products...');
        
        if (window.WishlistManager) {
            const wishlist = window.WishlistManager.getWishlist();
            this.loadProductsInContainer('#wishlist-products .row', wishlist, 'wishlist');
        }
    },
    
    // Load cart products
    loadCartProducts: function() {
        console.log('Loading cart products...');
        
        if (window.CartSidebar) {
            const cart = window.CartSidebar.getCart();
            this.loadProductsInContainer('#cart-products .row', cart, 'cart');
        }
    },
    
    // Universal product container loader
    loadProductsInContainer: function(containerSelector, products, context = 'default') {
        const $container = $(containerSelector);
        if ($container.length === 0) {
            console.warn('Container not found:', containerSelector);
            return;
        }
        if (!products || products.length === 0) {
            console.warn('No products to load for:', containerSelector);
            $container.html('<div class="col-12"><p class="text-center">No products found</p></div>');
            return;
        }
        const useLiquid = typeof window.renderProductGrid === 'function' && this.shouldUseLiquidTemplate(context, containerSelector);
        
        if (useLiquid) {
            const variant = this.getTemplateVariantForContext(context);
            const colClass = this.getColumnClassForContext(context, variant);
            window.renderProductGrid(containerSelector, products, {
                context,
                variant,
                colClass
            }).then(() => {
                this.bindProductEvents();
            }).catch(err => {
                console.error('Liquid render failed, falling back to JS templates:', err);
                this.renderWithJsTemplate($container, products, context);
            });
            return;
        }
        
        this.renderWithJsTemplate($container, products, context);
    },
    
    renderWithJsTemplate: function($container, products, context) {
        $container.empty();
        products.forEach(product => {
            const productCard = this.generateProductCard(product, context);
            $container.append(productCard);
        });
        this.bindProductEvents();
    },
    
    shouldUseLiquidTemplate: function(context, containerSelector) {
        if (!containerSelector) return false;
        const modernContexts = ['trending', 'new', 'sale', 'featured'];
        if (modernContexts.includes(context)) return true;
        // Prefer Liquid for any products-grid containers
        return containerSelector.indexOf('.products-grid') !== -1;
    },
    
    getTemplateVariantForContext: function(context) {
        const standardContexts = ['shop', 'products', 'related', 'wishlist', 'cart'];
        return standardContexts.includes(context) ? 'standard' : 'modern';
    },
    
    getColumnClassForContext: function(context, variant) {
        if (variant === 'standard') {
            if (context === 'wishlist' || context === 'cart') {
                return 'col-12 mb-3';
            }
            return 'col-lg-3 col-md-4 col-sm-6 mb-4';
        }
        return 'col-lg-3 col-md-4 col-sm-6 col-6 mb-4';
    },
    
    // Universal product card generator - Bootstrap neutral markup
    generateProductCard: function(product, context = 'default') {
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        const originalPrice = hasDiscount ? `<span class="original-price text-muted text-decoration-line-through">$${product.originalPrice.toFixed(2)}</span>` : '';
        const stars = this.generateStars(product.rating);
        const badges = (product.badges || []).map(badge => `<span class="badge bg-${this.getBadgeColor(badge)} me-1">${badge.toUpperCase()}</span>`).join('');


        // For other contexts, use full card layout
        let colClass = 'col-lg-4 col-md-6 mb-4';
        if (context === 'products' || context === 'shop' || context === 'related') {
            colClass = 'col-lg-3 col-md-4 col-sm-6 mb-4';
        } else if (context === 'wishlist' || context === 'cart') {
            colClass = 'col-12 mb-3';
        }

        return `
            <div class="${colClass}">
                <div class="card h-100" data-category="${product.category}" data-price="${product.price}" data-rating="${product.rating}">
                    <div class="position-relative">
                        <img src="${product.image}" alt="${product.name}" class="card-img-top">
                        <div class="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">${badges}</div>
                        ${hasDiscount ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>` : ''}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h6 class="mb-2"><a href="product-detail.html?id=${product.id}" class="text-decoration-none text-dark">${product.name}</a></h6>
                        <div class="d-flex align-items-center mb-2">
                            <span class="me-2 text-warning">${stars}</span>
                            <small class="text-muted">(${product.reviewCount})</small>
                        </div>
                        <div class="mb-2 d-flex align-items-center gap-2">
                            <span class="fw-bold">$${product.price.toFixed(2)}</span>
                            ${originalPrice}
                        </div>
                        <div class="mb-3">
                            ${product.inStock ? `<span class="text-success"><i class="fas fa-check me-1"></i>In Stock</span>` : `<span class="text-danger"><i class="fas fa-times me-1"></i>Out of Stock</span>`}
                        </div>
                        <div class="mt-auto d-flex gap-2">
                            <button class="btn btn-sm btn-primary add-to-cart" data-product-id="${product.id}"><i class="fas fa-shopping-cart me-1"></i>Add</button>
                            <button class="btn btn-sm btn-outline-secondary add-to-wishlist" data-product-id="${product.id}"><i class="fas fa-heart me-1"></i>Wish</button>
                            <button class="btn btn-sm btn-outline-info quick-view" data-product-id="${product.id}"><i class="fas fa-eye me-1"></i>View</button>
                        </div>
                    </div>
                </div>
            </div>`;
    },
    
    // Generate star rating
    generateStars: function(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    },
    
    // Get badge color based on type
    getBadgeColor: function(badge) {
        const colors = {
            'sale': 'danger',
            'new': 'success',
            'trending': 'primary',
            'hot': 'warning',
            'featured': 'info'
        };
        return colors[badge] || 'secondary';
    },
    
    // Render product detail page
    renderProductDetail: function(product) {
        console.log('Rendering product detail for:', product.name);
        
        // Update page title
        document.title = `${product.name} - ShoppingCart`;
        
        // Update breadcrumb
        $('.breadcrumb-item:last').text(product.name);
        
        // Update product images
        $('#mainImage').attr('src', product.image).attr('alt', product.name);
        
        // Update product info
        $('.product-title').text(product.name);
        $('.current-price').text(`$${product.price.toFixed(2)}`);
        if (product.originalPrice) {
            $('.original-price').text(`$${product.originalPrice.toFixed(2)}`).show();
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            $('.discount').text(`Save ${discount}%`).show();
        } else {
            $('.original-price').hide();
            $('.discount').hide();
        }
        
        // Update product description
        $('.product-description p').text(product.description);
        
        // Update product features
        if (product.features && product.features.length > 0) {
            const featuresList = product.features.map(feature => `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`).join('');
            $('.product-features ul').html(featuresList);
        }
        
        // Update stock status
        if (product.inStock) {
            $('.stock-status').html('<span class="text-success"><i class="fas fa-check"></i> In Stock</span>');
        } else {
            $('.stock-status').html('<span class="text-danger"><i class="fas fa-times"></i> Out of Stock</span>');
        }
        
        // Update rating
        $('.product-rating .stars').html(this.generateStars(product.rating));
        $('.rating-text').text(`${product.rating} (${product.reviewCount} reviews)`);
        
        // Update badges
        const badges = product.badges ? product.badges.map(badge => 
            `<span class="badge bg-${this.getBadgeColor(badge)} me-2">${badge.toUpperCase()}</span>`
        ).join('') : '';
        $('.product-badges').html(badges);
        
        // Update add to cart buttons
        $('.add-to-cart').attr('data-product-id', product.id);
        $('.add-to-wishlist').attr('data-product-id', product.id);
        
        // Update product specifications if available
        if (product.specifications) {
            const specsList = Object.entries(product.specifications).map(([key, value]) => 
                `<tr><td>${key}</td><td>${value}</td></tr>`
            ).join('');
            $('.product-specifications tbody').html(specsList);
        }
        
        console.log('Product detail rendered successfully');
    },
    
    // Load related products
    loadRelatedProducts: function(product) {
        console.log('Loading related products for:', product.name);
        
        // Get products from same category
        const relatedProducts = getProductsByCategory(product.category)
            .filter(p => p.id !== product.id)
            .slice(0, 4); // Show max 4 related products
        
        if (relatedProducts.length === 0) {
            console.log('No related products found');
            return;
        }
        
        // Generate related products HTML
        const relatedProductsHTML = relatedProducts.map(p => 
            this.generateProductCard(p, 'related')
        ).join('');
        
        // Update related products section
        $('#related-products').html(relatedProductsHTML);
        
        // Bind events for related products
        this.bindProductEvents();
        
        console.log(`Loaded ${relatedProducts.length} related products`);
    },
    
    // Get product ID from URL
    getProductIdFromUrl: function() {
		const urlParams = new URLSearchParams(window.location.search);
		const idParam = urlParams.get('id');
        // Support both numeric IDs and string slugs
        if (!idParam) return null;
        return idParam;
    },
    
    // Update results count
    updateResultsCount: function() {
        const visibleProducts = $('.product-card:visible').length;
        $('.results-count').text(`Showing 1-${visibleProducts} of ${visibleProducts} products`);
    },
    
    // Bind global product events
    bindProductEvents: function() {
        // Add to cart
        $(document).off('click', '.add-to-cart').on('click', '.add-to-cart', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            DynamicProducts.addToCart(productId);
        });
        
        // Add to wishlist
        $(document).off('click', '.add-to-wishlist').on('click', '.add-to-wishlist', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            DynamicProducts.addToWishlist(productId);
        });
        
        // Quick view - using Liquid template
        $(document).off('click', '.quick-view').on('click', '.quick-view', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const productId = $(this).data('product-id');
            if (typeof window.renderQuickViewWithLiquid === 'function') {
                window.renderQuickViewWithLiquid(productId);
            } else {
                DynamicProducts.showNotification('Quick view not available!', 'error');
            }
        });
        
        // Category filter
        $(document).off('change', '.product-filter').on('change', '.product-filter', function(e) {
            const category = $(this).val();
            DynamicProducts.filterByCategory(category);
        });
        
        // Category links
        $(document).off('click', '.category-link').on('click', '.category-link', function(e) {
            e.preventDefault();
            const category = $(this).data('category');
            DynamicProducts.filterByCategory(category);
        });
    },
    
    // Add to cart functionality
    addToCart: function(productId) {
        const product = getProductById(productId);
        if (!product) {
            this.showNotification('Product not found!', 'error');
            return;
        }
        
        if (window.CartSidebar) {
            window.CartSidebar.addItem(
                product.id,
                product.name,
                product.price,
                product.image
            );
        } else {
            this.showNotification('Cart system not available!', 'error');
        }
    },
    
    // Add to wishlist functionality
    addToWishlist: function(productId) {
        const product = getProductById(productId);
        if (!product) {
            this.showNotification('Product not found!', 'error');
            return;
        }
        
        if (window.WishlistManager) {
            window.WishlistManager.addToWishlist(productId);
        } else {
            this.showNotification('Wishlist system not available!', 'error');
        }
    },
    
    // Show quick view
    showQuickView: function(productId) {
        const product = getProductById(productId);
        if (!product) {
            this.showNotification('Product not found!', 'error');
            return;
        }
        
        // Populate quick view modal
        $('#quickViewModal .modal-title').text(product.name);
        $('#quickViewModal .product-image').attr('src', product.image);
        $('#quickViewModal .product-price').text(`$${product.price.toFixed(2)}`);
        $('#quickViewModal .product-description').text(product.description);
        $('#quickViewModal .add-to-cart').attr('data-product-id', product.id);
        $('#quickViewModal .add-to-wishlist').attr('data-product-id', product.id);
        
        // Show modal
        $('#quickViewModal').modal('show');
    },
    
    // Filter products by category
    filterByCategory: function(category) {
        console.log('Filtering products by category:', category);
        
        let products = getAllProducts();
        
        if (category && category !== 'all') {
            products = getProductsByCategory(category);
        }
        
        // Update URL without page reload
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
        
        // Update page title
        if (category && category !== 'all') {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            document.title = `${categoryName} Products - ShoppingCart`;
            $('.page-title').text(`${categoryName} Products`);
        } else {
            document.title = 'All Products - ShoppingCart';
            $('.page-title').text('All Products');
        }
        
        // Reload products
        this.loadProductsInContainer('#products-grid', products, 'products');
        this.updateResultsCount();
    },
    
    // Show notification
    showNotification: function(message, type = 'success') {
        // Remove existing notifications
        $('.dynamic-notification').remove();
        
        const iconClass = type === 'error' ? 'fa-exclamation-circle' : 
                         type === 'info' ? 'fa-info-circle' : 'fa-check-circle';
        
        const notification = $(`
            <div class="dynamic-notification alert alert-${type} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                <i class="fas ${iconClass} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(function() {
            notification.alert('close');
        }, 3000);
    },
    
    // Bind global events
    bindGlobalEvents: function() {
        // This will be called after products are loaded
        console.log('Binding global product events...');
    }
};

// Initialize when document is ready
$(document).ready(function() {
        // Initialize only if product-data.js is available
        if (typeof getAllProducts === 'function') {
            DynamicProducts.init();
        } else {
            console.error('product-data.js not loaded! Dynamic products cannot initialize.');
        }
});

// Make DynamicProducts globally available
window.DynamicProducts = DynamicProducts;

// (Debug helpers removed during revert)
