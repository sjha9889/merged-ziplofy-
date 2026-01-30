/* Cart Page JavaScript */

$(document).ready(function() {
    // Load items from localStorage and replace dummy items
    loadCartFromStorage();

    // Initialize cart functionality
    initQuantityControls();
    initCartActions();
    initCouponCode();
    initCartSummary();
    initRecentlyViewed();
});

// Quantity Controls
function initQuantityControls() {
    $('.quantity-btn').on('click', function() {
        const action = $(this).data('action');
        const $input = $(this).siblings('.quantity-input');
        let currentValue = parseInt($input.val());
        
        if (action === 'increase') {
            currentValue = Math.min(currentValue + 1, 10);
        } else if (action === 'decrease') {
            currentValue = Math.max(currentValue - 1, 1);
        }
        
        $input.val(currentValue);
        updateCartItem($(this).closest('.cart-item'), currentValue);
    });
    
    // Direct input validation
    $('.quantity-input').on('input', function() {
        let value = parseInt($(this).val());
        if (isNaN(value) || value < 1) {
            $(this).val(1);
            value = 1;
        } else if (value > 10) {
            $(this).val(10);
            value = 10;
        }
        
        updateCartItem($(this).closest('.cart-item'), value);
    });
}

// Cart Actions
function initCartActions() {
    // Remove item
    $('.remove-item').on('click', function() {
        const $item = $(this).closest('.cart-item');
        const itemId = $(this).data('item-id');
        
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            removeCartItem($item, itemId);
        }
    });
    
    // Move to wishlist
    $('.move-to-wishlist').on('click', function() {
        const $item = $(this).closest('.cart-item');
        const itemId = $(this).data('item-id');
        
        moveToWishlist($item, itemId);
    });
    
    // Clear cart
    $('#clearCart').on('click', function() {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            clearCart();
        }
    });
}

// Coupon Code
function initCouponCode() {
    $('#applyCoupon').on('click', function(e) {
        e.preventDefault();
        const couponCode = $('#couponCode').val().trim();
        
        if (couponCode) {
            applyCoupon(couponCode);
        } else {
            showNotification('Please enter a coupon code', 'error');
        }
    });
}

// Cart Summary
function initCartSummary() {
    updateCartTotals();
}

// Load cart from localStorage (CartSidebar storage)
function loadCartFromStorage() {
    try {
        const cartRaw = localStorage.getItem('shoppingCart');
        const cart = cartRaw ? JSON.parse(cartRaw) : [];
        const $container = $('.cart-items');

        if (!cart || cart.length === 0) {
            showEmptyCart();
            return;
        }

        // Build header with count
        const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
        const headerHtml = `
            <div class="cart-header mb-4">
                <h3>Shopping Cart (${totalItems} items)</h3>
            </div>
        `;

        let itemsHtml = headerHtml;
        cart.forEach((item, idx) => {
            const quantity = parseInt(item.quantity) || 1;
            const price = parseFloat(item.price) || 0;
            itemsHtml += `
                <div class="cart-item mb-4" data-item-id="${item.id}">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}" class="img-fluid">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="cart-item-info">
                                <h5 class="cart-item-title"><a href="product-detail.html?id=${item.id}">${item.name}</a></h5>
                                <div class="cart-item-options">
                                    <span class="option">Item #${idx + 1}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="cart-item-price"><span class="price">$${price.toFixed(2)}</span></div>
                        </div>
                        <div class="col-md-2">
                            <div class="cart-item-quantity">
                                <div class="quantity-controls">
                                    <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="decrease">-</button>
                                    <input type="number" class="quantity-input" value="${quantity}" min="1" max="10">
                                    <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="increase">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="cart-item-total"><span class="total-price">$${(price * quantity).toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div class="cart-item-actions mt-3">
                        <button class="btn btn-sm btn-outline-danger remove-item" data-item-id="${item.id}"><i class="fas fa-trash me-1"></i>Remove</button>
                        <button class="btn btn-sm btn-outline-secondary move-to-wishlist" data-item-id="${item.id}"><i class="fas fa-heart me-1"></i>Move to Wishlist</button>
                    </div>
                </div>
            `;
        });

        $container.html(itemsHtml);
        updateCartTotals();
    } catch (e) {
        console.error('Failed to load cart from storage', e);
    }
}

// Recently Viewed
function initRecentlyViewed() {
    // Add to cart for recently viewed products
    $('.recently-viewed-section .add-to-cart').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        addToCartFromRecentlyViewed(productId);
    });
    
    // Add to wishlist for recently viewed products
    $('.recently-viewed-section .add-to-wishlist').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        addToWishlistFromRecentlyViewed(productId);
    });
}

// Helper Functions
function updateCartItem($item, quantity) {
    const price = parseFloat($item.find('.cart-item-price .price').text().replace('$', ''));
    const total = price * quantity;
    
    // Update item total
    $item.find('.cart-item-total .total-price').text('$' + total.toFixed(2));
    
    // Update cart totals
    updateCartTotals();
    
    // Show animation
    $item.addClass('updated');
    setTimeout(() => $item.removeClass('updated'), 300);
}

function removeCartItem($item, itemId) {
    // Show loading state
    $item.addClass('removing');
    
    // Simulate API call
    setTimeout(() => {
        $item.fadeOut(300, function() {
            $(this).remove();
            updateCartTotals();
            updateCartCount();
            
            // Check if cart is empty
            if ($('.cart-item').length === 0) {
                showEmptyCart();
            }
        });
    }, 500);
}

function moveToWishlist($item, itemId) {
    // Show loading state
    const $btn = $item.find('.move-to-wishlist');
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin me-1"></i>Moving...');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        // Update wishlist count
        const currentCount = parseInt($('.wishlist-count').text()) || 0;
        $('.wishlist-count').text(currentCount + 1);
        
        // Remove from cart
        $item.fadeOut(300, function() {
            $(this).remove();
            updateCartTotals();
            updateCartCount();
        });
        
        // Show success message
        showNotification('Item moved to wishlist!', 'success');
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
    }, 1000);
}

function clearCart() {
    // Show loading state
    $('.cart-items').html('<div class="col-12"><div class="text-center py-5"><div class="spinner-border" role="status"><span class="visually-hidden">Clearing cart...</span></div><p class="mt-3">Clearing cart...</p></div></div>');
    
    // Simulate API call
    setTimeout(() => {
        showEmptyCart();
        updateCartCount();
    }, 1000);
}

function showEmptyCart() {
    const emptyCartHtml = `
        <div class="col-12">
            <div class="empty-cart text-center py-5">
                <i class="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
                <h3>Your cart is empty</h3>
                <p class="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
                <a href="shop.html" class="btn btn-primary">
                    <i class="fas fa-shopping-bag me-2"></i>Start Shopping
                </a>
            </div>
        </div>
    `;
    
    $('.cart-items').html(emptyCartHtml);
    $('.cart-actions').hide();
    $('.coupon-section').hide();
}

function applyCoupon(couponCode) {
    // Show loading state
    const $btn = $('#applyCoupon');
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Applying...');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        // Check if coupon is valid (in real app, this would be server-side validation)
        const validCoupons = {
            'SAVE10': { discount: 10, type: 'percentage' },
            'SAVE20': { discount: 20, type: 'percentage' },
            'FREESHIP': { discount: 9.99, type: 'fixed' }
        };
        
        if (validCoupons[couponCode.toUpperCase()]) {
            const coupon = validCoupons[couponCode.toUpperCase()];
            applyCouponDiscount(coupon);
            showNotification('Coupon applied successfully!', 'success');
        } else {
            showNotification('Invalid coupon code', 'error');
        }
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
    }, 1000);
}

function applyCouponDiscount(coupon) {
    // Update discount in summary
    const discountAmount = coupon.type === 'percentage' ? 
        (parseFloat($('.subtotal').text().replace('$', '')) * coupon.discount / 100) : 
        coupon.discount;
    
    $('.discount').text('-$' + discountAmount.toFixed(2));
    
    // Recalculate total
    updateCartTotals();
    
    // Disable coupon input
    $('#couponCode').prop('disabled', true);
    $('#applyCoupon').text('Applied').prop('disabled', true);
}

function updateCartTotals() {
    let subtotal = 0;
    
    // Calculate subtotal from all items
    $('.cart-item').each(function() {
        const price = parseFloat($(this).find('.cart-item-price .price').text().replace('$', ''));
        const quantity = parseInt($(this).find('.quantity-input').val());
        subtotal += price * quantity;
    });
    
    // Update subtotal
    $('.subtotal').text('$' + subtotal.toFixed(2));
    
    // Calculate shipping
    const shipping = subtotal > 50 ? 0 : 9.99;
    $('.shipping').text('$' + shipping.toFixed(2));
    
    // Calculate tax (8%)
    const tax = subtotal * 0.08;
    $('.tax').text('$' + tax.toFixed(2));
    
    // Calculate discount
    const discount = parseFloat($('.discount').text().replace('-$', '')) || 0;
    
    // Calculate total
    const total = subtotal + shipping + tax - discount;
    $('.total').text('$' + total.toFixed(2));
}

function updateCartCount() {
    let totalItems = 0;
    
    $('.cart-item').each(function() {
        const quantity = parseInt($(this).find('.quantity-input').val());
        totalItems += quantity;
    });
    
    $('.cart-count').text(totalItems);
}

function addToCartFromRecentlyViewed(productId) {
    // Show loading state
    const $btn = $(`.recently-viewed-section .add-to-cart[data-product-id="${productId}"]`);
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin"></i>');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        // Update cart count
        const currentCount = parseInt($('.cart-count').text()) || 0;
        $('.cart-count').text(currentCount + 1);
        
        // Show success message
        showNotification('Product added to cart!', 'success');
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
    }, 1000);
}

function addToWishlistFromRecentlyViewed(productId) {
    // Show loading state
    const $btn = $(`.recently-viewed-section .add-to-wishlist[data-product-id="${productId}"]`);
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin"></i>');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        // Update wishlist count
        const currentCount = parseInt($('.wishlist-count').text()) || 0;
        $('.wishlist-count').text(currentCount + 1);
        
        // Show success message
        showNotification('Product added to wishlist!', 'success');
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
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
    setTimeout(() => {
        $('.notification').fadeOut(() => {
            $(this).remove();
        });
    }, 3000);
}

// CSS for cart animations and notifications
const cartCSS = `
    .cart-item.updated {
        background: rgba(0,123,255,0.1);
        transition: background 0.3s ease;
    }
    
    .cart-item.removing {
        opacity: 0.5;
        transform: translateX(-20px);
        transition: all 0.3s ease;
    }
    
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
    
    .empty-cart {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 40px;
    }
    
    .empty-cart i {
        color: #dee2e6;
    }
    
    .empty-cart h3 {
        color: #333;
        margin-bottom: 10px;
    }
    
    .empty-cart p {
        color: #666;
        margin-bottom: 20px;
    }
`;

// Add cart CSS
$('<style>').text(cartCSS).appendTo('head');
