/* Wishlist Page JavaScript */

// Global Wishlist Management
const WishlistManager = {
    getWishlist: function() {
        const wishlist = localStorage.getItem('userWishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    },

    saveWishlist: function(wishlist) {
        localStorage.setItem('userWishlist', JSON.stringify(wishlist));
        this.updateWishlistCount();
    },

    addToWishlist: function(productId) {
        const product = getProductById(productId);
        if (!product) {
            console.error('Product not found:', productId);
            this.showNotification('Product not found!', 'error');
            return false;
        }

        const wishlist = this.getWishlist();
        const existingItem = wishlist.find(item => item.id === productId);

        if (!existingItem) {
            wishlist.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                addedDate: new Date().toISOString()
            });
            this.saveWishlist(wishlist);
            this.showNotification(`${product.name} added to wishlist!`, 'success');
            console.log('Added to wishlist:', product.name);
            return true;
        } else {
            this.showNotification(`${product.name} is already in wishlist!`, 'info');
            return false;
        }
    },

    removeFromWishlist: function(productId) {
        const product = getProductById(productId);
        const wishlist = this.getWishlist();
        const updatedWishlist = wishlist.filter(item => item.id !== productId);
        this.saveWishlist(updatedWishlist);
        
        if (product) {
            this.showNotification(`${product.name} removed from wishlist!`, 'info');
        }
        console.log('Removed from wishlist:', productId);
        return true;
    },

    updateWishlistCount: function() {
        const wishlist = this.getWishlist();
        const count = wishlist.length;
        
        // Update all wishlist count elements
        $('.wishlist-count').each(function() {
            $(this).text(count);
        });
        
        // Update wishlist button states
        this.updateWishlistButtonStates();
        
        console.log('Wishlist count updated to:', count);
    },

    updateWishlistButtonStates: function() {
        const wishlist = this.getWishlist();
        
        // Update all wishlist buttons
        $('.add-to-wishlist').each(function() {
            const $btn = $(this);
            const productId = $btn.data('product-id');
            const isInWishlist = wishlist.some(item => item.id === productId);
            
            if (isInWishlist) {
                $btn.addClass('btn-danger').removeClass('btn-outline-secondary');
                $btn.find('i').removeClass('fa-heart').addClass('fa-heart text-white');
            } else {
                $btn.removeClass('btn-danger').addClass('btn-outline-secondary');
                $btn.find('i').removeClass('fa-heart text-white').addClass('fa-heart');
            }
        });
    },

    isInWishlist: function(productId) {
        const wishlist = this.getWishlist();
        return wishlist.some(item => item.id === productId);
    },

    showNotification: function(message, type = 'success') {
        // Remove existing notifications
        $('.wishlist-notification').remove();
        
        // Create notification element
        const iconClass = type === 'error' ? 'fa-exclamation-circle' : 
                         type === 'info' ? 'fa-info-circle' : 'fa-check-circle';
        const notification = $(`
            <div class="wishlist-notification alert alert-${type} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                <i class="fas ${iconClass} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        // Auto remove after 3 seconds
        setTimeout(function() {
            notification.alert('close');
        }, 3000);
    }
};

// Make WishlistManager globally available
window.WishlistManager = WishlistManager;

$(document).ready(function() {
    // Initialize wishlist functionality
    renderWishlistFromStorage();
    initWishlistActions();
    initShareWishlist();
    initClearWishlist();
    initProductActions();
    
    // Update wishlist count on page load
    WishlistManager.updateWishlistCount();
    
    // Force update wishlist count after a short delay to ensure DOM is ready
    setTimeout(function() {
        WishlistManager.updateWishlistCount();
    }, 100);
    
    // Update button states when products are loaded
    setTimeout(function() {
        WishlistManager.updateWishlistButtonStates();
    }, 500);
});

// Test function to verify wishlist functionality
window.testWishlist = function() {
    console.log('=== WISHLIST FUNCTIONALITY TEST ===');
    console.log('Current wishlist:', WishlistManager.getWishlist());
    console.log('Wishlist count elements found:', $('.wishlist-count').length);
    console.log('Wishlist count text:', $('.wishlist-count').text());
    console.log('Wishlist buttons found:', $('.add-to-wishlist').length);
    console.log('=== END TEST ===');
};

// Wishlist Actions
function initWishlistActions() {
    // Add to cart from wishlist
    $('.add-to-cart').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        const $item = $(this).closest('.wishlist-item');
        
        addToCartFromWishlist(productId, $item);
    });
    
    // Remove from wishlist
    $('.remove-from-wishlist').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        const $item = $(this).closest('.wishlist-item');
        
        removeFromWishlist(productId, $item);
    });
    
    // Quick view
    $('.quick-view').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('product-id');
        showQuickView(productId);
    });
}

// Share Wishlist
function initShareWishlist() {
    $('#shareWishlist').on('click', function() {
        showShareModal();
    });
}

// Clear Wishlist
function initClearWishlist() {
    $('#clearWishlist').on('click', function() {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            clearWishlist();
        }
    });
}

// Product Actions
function initProductActions() {
    // Any additional product-specific actions can be added here
}

// Helper Functions
function addToCartFromWishlist(productId, $item) {
    // Show loading state
    const $btn = $item.find('.add-to-cart');
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
        
        // Add visual feedback
        $item.addClass('added-to-cart');
        setTimeout(() => {
            $item.removeClass('added-to-cart');
        }, 2000);
        
        // Reset button
        $btn.html(originalHtml);
        $btn.prop('disabled', false);
        
        // Show cart animation
        showCartAnimation($item);
    }, 1000);
}

function removeFromWishlist(productId, $item) {
    // Show loading state
    $item.addClass('removing');
    
    // Simulate API call
    setTimeout(() => {
        $item.fadeOut(300, function() {
            $(this).remove();
            updateWishlistCount();
            
            // Check if wishlist is empty
            if ($('.wishlist-item').length === 0) {
                showEmptyWishlist();
            }
        });
        
        // Show success message
        showNotification('Product removed from wishlist', 'success');
    }, 500);
}

function clearWishlist() {
    // Show loading state
    $('.wishlist-items').html('<div class="col-12"><div class="text-center py-5"><div class="spinner-border" role="status"><span class="visually-hidden">Clearing wishlist...</span></div><p class="mt-3">Clearing wishlist...</p></div></div>');
    
    // Simulate API call
    setTimeout(() => {
        showEmptyWishlist();
        updateWishlistCount();
    }, 1000);
}

function showEmptyWishlist() {
    const emptyWishlistHtml = `
        <div class="col-12">
            <div class="empty-wishlist">
                <i class="fas fa-heart fa-4x text-muted mb-4"></i>
                <h3>Your wishlist is empty</h3>
                <p class="text-muted mb-4">Save items you love for later by adding them to your wishlist.</p>
                <a href="shop.html" class="btn btn-primary">
                    <i class="fas fa-shopping-bag me-2"></i>Start Shopping
                </a>
            </div>
        </div>
    `;
    
    $('.wishlist-items').html(emptyWishlistHtml);
    $('.wishlist-header').hide();
}

function updateWishlistCount() {
    const itemCount = (WishlistManager.getWishlist() || []).length;
    $('.wishlist-count').text(itemCount);
    $('.wishlist-header h3').text(`My Wishlist (${itemCount} items)`);
}

function renderWishlistFromStorage() {
    const wishlist = WishlistManager.getWishlist();
    const $container = $('#wishlist-products');
    if (!$container.length) return;

    if (!wishlist || wishlist.length === 0) {
        $('.empty-wishlist').show();
        $('.wishlist-items .row').empty();
        return;
    }

    let html = '';
    wishlist.forEach(item => {
        html += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="wishlist-item">
                    <div class="product-image">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid">
                        <div class="product-actions">
                            <button class="btn btn-sm btn-outline-primary add-to-cart" data-product-id="${item.id}"><i class="fas fa-shopping-cart"></i></button>
                            <button class="btn btn-sm btn-outline-danger remove-from-wishlist" data-product-id="${item.id}"><i class="fas fa-heart-broken"></i></button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h5 class="product-title"><a href="product-detail.html?id=${item.id}">${item.name}</a></h5>
                        <div class="product-price"><span class="current-price">$${(item.price || 0).toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
        `;
    });

    $container.html(html);
}

function showQuickView(productId) {
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
                                <img src="assets/images/products/product-${productId}.jpg" alt="Product" class="img-fluid">
                            </div>
                            <div class="col-md-6">
                                <h4>Product Name</h4>
                                <div class="product-rating mb-3">
                                    <div class="stars">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                    <span class="rating-text">4.5 (24 reviews)</span>
                                </div>
                                <div class="product-price mb-3">
                                    <span class="current-price">$99.99</span>
                                    <span class="original-price">$129.99</span>
                                </div>
                                <p>Product description goes here...</p>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-primary add-to-cart" data-product-id="${productId}">
                                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                    </button>
                                    <button class="btn btn-outline-danger remove-from-wishlist" data-product-id="${productId}">
                                        <i class="fas fa-heart-broken me-2"></i>Remove from Wishlist
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
        const $item = $('.wishlist-item').first(); // Get first item for reference
        addToCartFromWishlist(productId, $item);
        $('#quickViewModal').modal('hide');
    });
    
    $('#quickViewModal .remove-from-wishlist').on('click', function() {
        const $item = $('.wishlist-item').first(); // Get first item for reference
        removeFromWishlist(productId, $item);
        $('#quickViewModal').modal('hide');
    });
}

function showShareModal() {
    const shareModalHtml = `
        <div class="modal fade" id="shareWishlistModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Share Your Wishlist</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="share-options">
                            <div class="share-option" data-platform="facebook">
                                <i class="fab fa-facebook"></i>
                                <span>Facebook</span>
                            </div>
                            <div class="share-option" data-platform="twitter">
                                <i class="fab fa-twitter"></i>
                                <span>Twitter</span>
                            </div>
                            <div class="share-option" data-platform="pinterest">
                                <i class="fab fa-pinterest"></i>
                                <span>Pinterest</span>
                            </div>
                            <div class="share-option" data-platform="whatsapp">
                                <i class="fab fa-whatsapp"></i>
                                <span>WhatsApp</span>
                            </div>
                        </div>
                        <div class="share-link">
                            <div class="d-flex">
                                <input type="text" class="form-control" value="${window.location.href}" readonly>
                                <button class="copy-btn" onclick="copyToClipboard(this)">
                                    <i class="fas fa-copy me-1"></i>Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    $('#shareWishlistModal').remove();
    
    // Add new modal
    $('body').append(shareModalHtml);
    
    // Show modal
    $('#shareWishlistModal').modal('show');
    
    // Bind share option clicks
    $('.share-option').on('click', function() {
        const platform = $(this).data('platform');
        shareWishlist(platform);
    });
}

function shareWishlist(platform) {
    const wishlistUrl = window.location.href;
    const title = 'Check out my wishlist!';
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(wishlistUrl)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(wishlistUrl)}&text=${encodeURIComponent(title)}`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(wishlistUrl)}&description=${encodeURIComponent(title)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + wishlistUrl)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyToClipboard(button) {
    const input = button.previousElementSibling;
    input.select();
    input.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        button.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy me-1"></i>Copy';
            button.style.background = '#007bff';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

function showCartAnimation($item) {
    const $cartBtn = $('.cart-btn');
    const $productImage = $item.find('.product-image img');
    
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

// CSS for wishlist animations
const wishlistCSS = `
    .flying-cart {
        transition: all 0.8s ease-out;
    }
    
    .wishlist-item.removing {
        opacity: 0.5;
        transform: translateX(-20px);
        transition: all 0.3s ease;
    }
    
    .wishlist-item.added-to-cart {
        background: rgba(0,123,255,0.1);
        border: 2px solid #007bff;
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
`;

// Add wishlist CSS
$('<style>').text(wishlistCSS).appendTo('head');
