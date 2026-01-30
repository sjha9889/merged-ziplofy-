/* Product Detail Page JavaScript */

$(document).ready(function() {
    // Initialize product detail functionality
    initProductGallery();
    initProductOptions();
    initQuantityControls();
    initProductActions();
    initProductTabs();
    initRelatedProducts();
});

// Product Gallery
function initProductGallery() {
    // Thumbnail click handler
    $('.thumbnail').on('click', function() {
        const newImageSrc = $(this).data('main') || $(this).find('img').attr('src');
        
        // Update main image
        $('#mainImage').attr('src', newImageSrc);
        
        // Update active thumbnail
        $('.thumbnail').removeClass('active');
        $(this).addClass('active');
    });
    
    // Image zoom on hover
    $('#mainImage').on('mouseenter', function() {
        $(this).css('transform', 'scale(1.1)');
    }).on('mouseleave', function() {
        $(this).css('transform', 'scale(1)');
    });
}

// Product Options
function initProductOptions() {
    // Color selection
    $('.color-option').on('click', function() {
        $('.color-option').removeClass('active');
        $(this).addClass('active');
        
        // Update product image based on color
        const color = $(this).data('color');
        updateProductImage(color);
    });
    
    // Size selection
    $('.size-option').on('click', function() {
        $('.size-option').removeClass('active');
        $(this).addClass('active');
    });
}

// Quantity Controls
function initQuantityControls() {
    $('.quantity-btn').on('click', function() {
        const action = $(this).data('action');
        const $input = $(this).siblings('.quantity-input');
        let currentValue = parseInt($input.val()) || 1;
        
        if (action === 'increase') {
            currentValue = Math.min(currentValue + 1, 10);
        } else if (action === 'decrease') {
            currentValue = Math.max(currentValue - 1, 1);
        }
        
        $input.val(currentValue);
    });
    
    // Direct input validation
    $('.quantity-input').on('input', function() {
        let value = parseInt($(this).val());
        if (isNaN(value) || value < 1) {
            $(this).val(1);
        } else if (value > 10) {
            $(this).val(10);
        }
    });
}

// Product Actions
function initProductActions() {
    // Add to cart
    $('.add-to-cart, .btn-add-cart').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        const quantity = parseInt($('.quantity-input').val()) || 1;
        const color = $('.color-option.active').data('color');
        const size = $('.size-option.active').data('size');
        
        addToCart(productId, quantity, color, size);
    });
    
    // Buy now
    $('.buy-now, .btn-buy-now').on('click', function(e) {
        e.preventDefault();
        const productId = $('.add-to-cart').data('product-id');
        const quantity = parseInt($('.quantity-input').val()) || 1;
        
        addToCart(productId, quantity);
        // Redirect to checkout
        setTimeout(function() {
            window.location.href = 'checkout.html';
        }, 1500);
    });
    
    // Add to wishlist
    $('.add-to-wishlist, .wishlist-icon-btn').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        addToWishlist(productId);
    });
}

// Product Tabs
function initProductTabs() {
    // Tab click handler
    $('.nav-tabs .nav-link').on('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all tabs
        $('.nav-tabs .nav-link').removeClass('active');
        $('.tab-pane').removeClass('show active');
        
        // Add active class to clicked tab
        $(this).addClass('active');
        
        // Show corresponding tab content
        const targetTab = $(this).attr('data-bs-target');
        $(targetTab).addClass('show active');
    });
}

// Related Products
function initRelatedProducts() {
    // Add to cart for related products
    $('.related-products-section .add-to-cart').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        addToCart(productId, 1);
    });
    
    // Add to wishlist for related products
    $('.related-products-section .add-to-wishlist').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        addToWishlist(productId);
    });
}

// Helper Functions
function updateProductImage(color) {
    // In a real application, this would fetch different product images
    // For now, we'll just add a visual indicator
    const $mainImage = $('#mainImage');
    $mainImage.css('filter', `hue-rotate(${getColorHue(color)}deg)`);
}

function getColorHue(color) {
    const colorMap = {
        'black': 0,
        'white': 0,
        'blue': 240,
        'red': 0
    };
    return colorMap[color] || 0;
}

// Product Actions
function addToCart(productId, quantity = 1, color = null, size = null) {
    // Show loading state
    const $btn = $('.add-to-cart, .btn-add-cart').first();
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Adding...');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(function() {
        // Use CartSidebar if available
        if (window.CartSidebar) {
            const productName = $('.product-title').text();
            const productPrice = parseFloat($('.current-price').text().replace(/[^0-9.]/g, ''));
            const productImage = $('#mainImage').attr('src');
            
            for (let i = 0; i < quantity; i++) {
                window.CartSidebar.addItem(productId, productName, productPrice, productImage);
            }
        } else {
            // Fallback: Update cart count
            const currentCount = parseInt($('.cart-count').text()) || 0;
            $('.cart-count').text(currentCount + quantity);
        }
        
        // Show success message
        showNotification(`Added ${quantity} item(s) to cart!`, 'success');
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
        
        // Show cart animation
        showCartAnimation();
    }, 1500);
}

function addToWishlist(productId) {
    // Show loading state
    const $btn = $('.add-to-wishlist, .wishlist-icon-btn').first();
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin"></i>');
    $btn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(function() {
        // Use WishlistManager if available
        if (window.WishlistManager) {
            window.WishlistManager.addToWishlist(productId);
        } else {
            // Fallback: Update wishlist count
            const currentCount = parseInt($('.wishlist-count').text()) || 0;
            $('.wishlist-count').text(currentCount + 1);
        }
        
        // Update button icon
        $btn.find('i').removeClass('far fa-heart').addClass('fas fa-heart');
        $btn.css('color', '#dc3545');
        
        // Show success message
        showNotification('Product added to wishlist!', 'success');
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
        
        // Show heart animation
        showHeartAnimation();
    }, 1000);
}

// Animation Functions
function showCartAnimation() {
    const $cartBtn = $('.cart-btn');
    const $productImage = $('#mainImage');
    
    if (!$cartBtn.length || !$productImage.length) return;
    
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

function showHeartAnimation() {
    const $wishlistBtn = $('.wishlist-btn');
    const $productImage = $('#mainImage');
    
    if (!$wishlistBtn.length || !$productImage.length) return;
    
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

// Notification System
function showNotification(message, type = 'info') {
    const notificationHtml = `
        <div class="notification notification-${type}">
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

// Share Product
function shareProduct(platform) {
    const productUrl = window.location.href;
    const productTitle = $('.product-title').text();
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productTitle)}`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&description=${encodeURIComponent(productTitle)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(productTitle + ' ' + productUrl)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Print Product
function printProduct() {
    window.print();
}

// Email Product
function emailProduct() {
    const productUrl = window.location.href;
    const productTitle = $('.product-title').text();
    const subject = `Check out this product: ${productTitle}`;
    const body = `I thought you might be interested in this product: ${productTitle}\n\n${productUrl}`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

