/* Homepage JavaScript - Trending Design */

(function($) {
    'use strict';

    const Homepage = {
        init: function() {
            // Trending, New, Sale, Featured will be handled by Liquid/DynamicProducts
            this.initTabs();
            this.initCountdown();
            this.initProductActions();
            this.initAnimations();
            this.initCategoryChipsScroll();
        },

        // Load trending products from product data
        loadTrendingProducts: function() {
            const trendingProducts = getTrendingProducts();
            const container = $('#trending-products .row');
            
            if (container.length && trendingProducts.length > 0) {
                let productsHtml = '';
                
                trendingProducts.forEach(product => {
                    const badgeHtml = product.badges.map(badge => 
                        `<span class="badge ${badge}">${badge.charAt(0).toUpperCase() + badge.slice(1)}</span>`
                    ).join('');

                    const originalPriceHtml = product.originalPrice ? 
                        `<span class="original-price">$${product.originalPrice}</span>` : '';

                    const discountHtml = product.discount > 0 ? 
                        `<span class="discount">${product.discount}% OFF</span>` : '';

                    const starsHtml = this.generateStars(product.rating);

                    productsHtml += `
                        <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                            <div class="product-card-modern" data-category="${product.category}">
                                <div class="product-media">
                                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                                    <div class="product-badges">${badgeHtml}</div>
                                    <div class="product-actions">
                                        <button class="action-btn add-to-wishlist" title="Add to Wishlist" data-product-id="${product.id}">
                                            <i class="fas fa-heart"></i>
                                        </button>
                                        <button class="action-btn quick-view" title="Quick View" data-product-id="${product.id}">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="product-body">
                                    <h5 class="product-title"><a href="product-detail.html?id=${product.id}">${product.name}</a></h5>
                                    <div class="product-rating">
                                        <div class="stars">${starsHtml}</div>
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
                        </div>
                    `;
                });
                
                container.html(productsHtml);
            }
        },

        // Load new products
        loadNewProducts: function() {
            const products = getNewProducts();
            const container = $('#new-products .row');
            if (container.length && products.length > 0) {
                this.renderProducts(products, container);
            }
        },

        // Load sale products
        loadSaleProducts: function() {
            const products = getSaleProducts();
            const container = $('#sale-products .row');
            if (container.length && products.length > 0) {
                this.renderProducts(products, container);
            }
        },

        // Load featured products
        loadFeaturedProducts: function() {
            const products = getFeaturedProducts();
            const container = $('#featured-products .row');
            if (container.length && products.length > 0) {
                this.renderProducts(products, container);
            }
        },

        // Generate star rating HTML
        generateStars: function(rating) {
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
        },

        // Initialize category tabs
        initTabs: function() {
            $('.tab-btn').on('click', function() {
                const category = $(this).data('category');
                
                // Update active tab
                $('.tab-btn').removeClass('active');
                $(this).addClass('active');
                
                // Filter products based on category
                this.filterProductsByCategory(category);
            }.bind(this));
        },

        // Filter products by category
        filterProductsByCategory: function(category) {
            // Use Liquid renderer to update trending grid
            if (window.renderTrendingWithLiquid) {
                window.renderTrendingWithLiquid(category || 'all');
            }
        },

        // Render products in container
        renderProducts: function(products, container) {
            if (container.length && products.length > 0) {
                let productsHtml = '';
                
                products.forEach(product => {
                    const badgeHtml = product.badges.map(badge => 
                        `<span class="badge ${badge}">${badge.charAt(0).toUpperCase() + badge.slice(1)}</span>`
                    ).join('');

                    const originalPriceHtml = product.originalPrice ? 
                        `<span class="original-price">$${product.originalPrice}</span>` : '';

                    const discountHtml = product.discount > 0 ? 
                        `<span class="discount">${product.discount}% OFF</span>` : '';

                    const starsHtml = this.generateStars(product.rating);

                    productsHtml += `
                        <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                            <div class="product-card-modern" data-category="${product.category}">
                                <div class="product-media">
                                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                                    <div class="product-badges">${badgeHtml}</div>
                                    <div class="product-actions">
                                        <button class="action-btn add-to-wishlist" title="Add to Wishlist" data-product-id="${product.id}">
                                            <i class="fas fa-heart"></i>
                                        </button>
                                        <button class="action-btn quick-view" title="Quick View" data-product-id="${product.id}">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="product-body">
                                    <h5 class="product-title"><a href="product-detail.html?id=${product.id}">${product.name}</a></h5>
                                    <div class="product-rating">
                                        <div class="stars">${starsHtml}</div>
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
                        </div>
                    `;
                });
                
                container.html(productsHtml);
            }
        },

        // Initialize countdown timer
        initCountdown: function() {
            const endTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
            
            const timer = setInterval(function() {
                const now = new Date().getTime();
                const distance = endTime - now;
                
                if (distance < 0) {
                    clearInterval(timer);
                    $('#hours, #minutes, #seconds').text('00');
                    return;
                }
                
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                $('#hours').text(hours.toString().padStart(2, '0'));
                $('#minutes').text(minutes.toString().padStart(2, '0'));
                $('#seconds').text(seconds.toString().padStart(2, '0'));
            }, 1000);
        },

        // Initialize product actions
        initProductActions: function() {
            // Wishlist functionality
            $(document).on('click', '.add-to-wishlist', function(e) {
                e.preventDefault();
                const btn = $(this);
                const productId = btn.data('product-id');
                const product = getProductById(productId);
                
                if (!product) {
                    Homepage.showNotification('Product not found!', 'error');
                    return;
                }
                
                const icon = btn.find('i');
                
                if (icon.hasClass('fas')) {
                    // Remove from wishlist
                    if (window.WishlistManager) {
                        window.WishlistManager.removeFromWishlist(productId);
                    }
                    icon.removeClass('fas').addClass('far');
                    btn.css('color', '#333');
                    Homepage.showNotification(`${product.name} removed from wishlist`, 'info');
                } else {
                    // Add to wishlist
                    if (window.WishlistManager) {
                        window.WishlistManager.addToWishlist(productId);
                    }
                    icon.removeClass('far').addClass('fas');
                    btn.css('color', '#dc3545');
                    Homepage.showNotification(`${product.name} added to wishlist`, 'success');
                    
                    // Show heart animation
                    Homepage.showHeartAnimation(btn);
                }
            });

            // Quick view - using Liquid template
            $(document).on('click', '.quick-view', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const productId = $(this).data('product-id');
                if (typeof window.renderQuickViewWithLiquid === 'function') {
                    window.renderQuickViewWithLiquid(productId);
                } else {
                    Homepage.showNotification('Quick view not available!', 'error');
                }
            });

            // Add to cart functionality
            $(document).on('click', '.add-to-cart-btn', function(e) {
                e.preventDefault();
                const btn = $(this);
                const productId = btn.data('product-id');
                const product = getProductById(productId);
                
                if (!product) {
                    Homepage.showNotification('Product not found!', 'error');
                    return;
                }
                
                // Show loading state
                const originalHtml = btn.html();
                btn.html('<i class="fas fa-spinner fa-spin me-1"></i>Adding...');
                btn.prop('disabled', true);
                
                // Simulate API call
                setTimeout(() => {
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
                    Homepage.showNotification(`${product.name} added to cart!`, 'success');
                    
                    // Reset button
                    btn.html(originalHtml);
                    btn.prop('disabled', false);
                    
                    // Show cart animation
                    Homepage.showCartAnimation(btn);
                }, 1000);
            });
        },

        // Initialize scroll animations
        initAnimations: function() {
            // Intersection Observer for fade-in animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            document.querySelectorAll('.product-card, .category-card, .sale-product-card').forEach(el => {
                observer.observe(el);
            });
        },

        // Enable horizontal drag/scroll for category chips on mobile
        initCategoryChipsScroll: function() {
            const $menu = $('.category-menu');
            if (!$menu.length) return;

            $menu.each(function() {
                const el = this;
                let isDown = false;
                let startX = 0;
                let scrollLeft = 0;

                // Mouse events
                el.addEventListener('mousedown', (e) => {
                    isDown = true;
                    startX = e.pageX - el.offsetLeft;
                    scrollLeft = el.scrollLeft;
                });
                el.addEventListener('mouseleave', () => { isDown = false; });
                el.addEventListener('mouseup', () => { isDown = false; });
                el.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - el.offsetLeft;
                    const walk = (x - startX);
                    el.scrollLeft = scrollLeft - walk;
                });

                // Touch events
                el.addEventListener('touchstart', (e) => {
                    const t = e.touches[0];
                    isDown = true;
                    startX = t.pageX - el.offsetLeft;
                    scrollLeft = el.scrollLeft;
                }, { passive: true });
                el.addEventListener('touchend', () => { isDown = false; });
                el.addEventListener('touchmove', (e) => {
                    if (!isDown) return;
                    const t = e.touches[0];
                    const x = t.pageX - el.offsetLeft;
                    const walk = (x - startX);
                    el.scrollLeft = scrollLeft - walk;
                }, { passive: true });

                // Pointer events (covers pen/touch/mouse in modern browsers)
                if (window.PointerEvent) {
                    el.addEventListener('pointerdown', (e) => {
                        isDown = true;
                        startX = e.clientX - el.offsetLeft;
                        scrollLeft = el.scrollLeft;
                        el.setPointerCapture(e.pointerId);
                    });
                    el.addEventListener('pointerup', (e) => {
                        isDown = false;
                        if (el.hasPointerCapture && e.pointerId) el.releasePointerCapture(e.pointerId);
                    });
                    el.addEventListener('pointercancel', () => { isDown = false; });
                    el.addEventListener('pointermove', (e) => {
                        if (!isDown) return;
                        const x = e.clientX - el.offsetLeft;
                        const walk = (x - startX);
                        el.scrollLeft = scrollLeft - walk;
                    });
                }

                // Translate vertical wheel to horizontal scroll (desktop UX)
                el.addEventListener('wheel', (e) => {
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                        el.scrollLeft += e.deltaY;
                        e.preventDefault();
                    }
                }, { passive: false });
            });
        },

        // Show enhanced quick view modal
        showQuickViewModal: function(product) {
            const stars = this.generateStars(product.rating);
            const originalPrice = product.originalPrice ? 
                `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : '';
            
            const modal = $(`
                <div class="modal fade" id="homepageQuickViewModal" tabindex="-1">
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
                                            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                            </button>
                                            <button class="btn btn-outline-secondary add-to-wishlist" data-product-id="${product.id}">
                                                <i class="fas fa-heart me-2"></i>Add to Wishlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            
            // Remove existing modal
            $('#homepageQuickViewModal').remove();
            
            // Add new modal
            $('body').append(modal);
            
            // Show modal
            $('#homepageQuickViewModal').modal('show');
            
            // Bind events for modal buttons
            $('#homepageQuickViewModal .add-to-cart').on('click', function() {
                const btn = $(this);
                const productId = btn.data('product-id');
                const product = getProductById(productId);
                
                if (product) {
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
                    
                    Homepage.showNotification(`${product.name} added to cart!`, 'success');
                    $('#homepageQuickViewModal').modal('hide');
                }
            });
            
            $('#homepageQuickViewModal .add-to-wishlist').on('click', function() {
                const btn = $(this);
                const productId = btn.data('product-id');
                const product = getProductById(productId);
                
                if (product) {
                    // Update wishlist count
                    const currentCount = parseInt($('.wishlist-count').text()) || 0;
                    $('.wishlist-count').text(currentCount + 1);
                    
                    Homepage.showNotification(`${product.name} added to wishlist!`, 'success');
                    $('#homepageQuickViewModal').modal('hide');
                }
            });
        },

        // Show cart animation
        showCartAnimation: function($btn) {
            const $cartBtn = $('.cart-btn');
            const $productImage = $btn.closest('.product-card').find('img');
            
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
        },

        // Show heart animation
        showHeartAnimation: function($btn) {
            const $wishlistBtn = $('.wishlist-btn');
            const $productImage = $btn.closest('.product-card').find('img');
            
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
        },

        // Show notification
        showNotification: function(message, type = 'info') {
            const notification = $(`
                <div class="homepage-notification ${type}">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `);
            
            $('body').append(notification);
            
            setTimeout(() => {
                notification.addClass('show');
            }, 10);
            
            setTimeout(() => {
                notification.removeClass('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
    };

    // Initialize when document is ready
    $(document).ready(function() {
        Homepage.init();
    });

    // Add CSS for animations and notifications
    const homepageCSS = `
        .flying-cart,
        .flying-heart {
            transition: all 0.8s ease-out;
        }
        
        .homepage-notification {
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
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .homepage-notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .homepage-notification.success {
            border-left-color: #28a745;
        }
        
        .homepage-notification.error {
            border-left-color: #dc3545;
        }
        
        .homepage-notification.info {
            border-left-color: #17a2b8;
        }
        
        .homepage-notification i {
            margin-right: 10px;
            font-size: 18px;
        }
        
        .homepage-notification.success i {
            color: #28a745;
        }
        
        .homepage-notification.error i {
            color: #dc3545;
        }
        
        .homepage-notification.info i {
            color: #17a2b8;
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
        
        .product-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .product-card-actions {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .product-card:hover .product-card-actions {
            opacity: 1;
        }
        
        .product-action-btn {
            background: white;
            border: 1px solid #ddd;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 5px;
            transition: all 0.3s ease;
        }
        
        .product-action-btn:hover {
            background: #007bff;
            color: white;
            border-color: #007bff;
            transform: scale(1.1);
        }
        
        .add-to-wishlist:hover {
            background: #dc3545 !important;
            border-color: #dc3545 !important;
        }
        
        .quick-view:hover {
            background: #17a2b8 !important;
            border-color: #17a2b8 !important;
        }
    `;
    
    // Add homepage CSS
    $('<style>').text(homepageCSS).appendTo('head');

    // Make Homepage globally available
    window.Homepage = Homepage;

})(jQuery);
