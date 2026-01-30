/* Product Listing/Card JavaScript (for shop pages, not product detail) */

/* This file contains JavaScript for product cards and listings on shop/category pages */
/* Product detail page JavaScript is in product-detail.js */

$(document).ready(function() {
    // Product card interactions for shop pages
    initProductCards();
});

function initProductCards() {
    // Add to cart from product card
    $('.product-card .add-to-cart').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        const quantity = 1;
        
        // Use CartSidebar if available
        if (window.CartSidebar) {
            const $card = $(this).closest('.product-card');
            const productName = $card.find('.card-title').text();
            const productPrice = parseFloat($card.find('.price').text().replace(/[^0-9.]/g, ''));
            const productImage = $card.find('img').attr('src');
            
            window.CartSidebar.addItem(productId, productName, productPrice, productImage);
        } else {
            // Fallback: Update cart count
            const currentCount = parseInt($('.cart-count').text()) || 0;
            $('.cart-count').text(currentCount + quantity);
        }
        
        // Show notification
        showProductNotification(`Product added to cart!`, 'success');
    });
    
    // Add to wishlist from product card
    $('.product-card .add-to-wishlist').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        
        // Use WishlistManager if available
        if (window.WishlistManager) {
            window.WishlistManager.addToWishlist(productId);
        } else {
            // Fallback: Update wishlist count
            const currentCount = parseInt($('.wishlist-count').text()) || 0;
            $('.wishlist-count').text(currentCount + 1);
        }
        
        // Show notification
        showProductNotification('Product added to wishlist!', 'success');
    });
}

// Simple notification for shop pages
function showProductNotification(message, type = 'info') {
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
    
    // Auto remove after 2 seconds
    setTimeout(function() {
        $('.notification').fadeOut(function() {
            $(this).remove();
        });
    }, 2000);
}
