/**
 * Cart Sidebar Functionality
 * Handles cart sidebar open/close and cart operations
 */

(function($) {
    'use strict';

    // Cart Sidebar Object
    const CartSidebar = {
        init: function() {
            this.bindEvents();
            this.loadCartData();
            this.updateCartCount();
        },

        bindEvents: function() {
            // Cart button click
            $(document).on('click', '.cart-btn', function(e) {
                e.preventDefault();
                CartSidebar.openSidebar();
            });

            // Close button click
            $(document).on('click', '#cart-close-btn', function(e) {
                e.preventDefault();
                CartSidebar.closeSidebar();
            });

            // Overlay click
            $(document).on('click', '.cart-sidebar-overlay', function(e) {
                e.preventDefault();
                CartSidebar.closeSidebar();
            });

            // Quantity change
            $(document).on('click', '.quantity-btn', function(e) {
                e.preventDefault();
                const action = $(this).data('action');
                const itemId = $(this).closest('.cart-item').data('item-id');
                CartSidebar.updateQuantity(itemId, action);
            });

            // Quantity input change
            $(document).on('change', '.quantity-input', function() {
                const itemId = $(this).closest('.cart-item').data('item-id');
                const quantity = parseInt($(this).val());
                CartSidebar.setQuantity(itemId, quantity);
            });

            // Remove item
            $(document).on('click', '.cart-item-remove', function(e) {
                e.preventDefault();
                const itemId = $(this).closest('.cart-item').data('item-id');
                CartSidebar.removeItem(itemId);
            });

            // Add to cart from product pages
            $(document).on('click', '.add-to-cart', function(e) {
                e.preventDefault();
                const productId = $(this).data('product-id');
                const productName = $(this).data('product-name');
                const productPrice = parseFloat($(this).data('product-price'));
                const productImage = $(this).data('product-image');
                CartSidebar.addItem(productId, productName, productPrice, productImage);
            });

            // ESC key to close
            $(document).on('keydown', function(e) {
                if (e.keyCode === 27) { // ESC key
                    CartSidebar.closeSidebar();
                }
            });
        },

        openSidebar: function() {
            $('body').addClass('cart-sidebar-open');
            $('#cart-sidebar').addClass('active');
            $('.cart-sidebar-overlay').addClass('active');
            
            // Force reload cart data when opening
            setTimeout(() => {
                this.loadCartData();
            }, 50);
        },

        closeSidebar: function() {
            $('body').removeClass('cart-sidebar-open');
            $('#cart-sidebar').removeClass('active');
            $('.cart-sidebar-overlay').removeClass('active');
        },

        loadCartData: function() {
            const cart = this.getCart();
            console.log('Loading cart data:', cart);
            this.renderCart(cart);
            this.updateCartCount();
        },

        getCart: function() {
            const cart = localStorage.getItem('shoppingCart');
            const parsedCart = cart ? JSON.parse(cart) : [];
            
            // Validate and clean cart data
            return parsedCart.filter(item => {
                return item && 
                       item.id && 
                       item.name && 
                       typeof item.price === 'number' && 
                       typeof item.quantity === 'number' &&
                       item.quantity > 0;
            });
        },

        saveCart: function(cart) {
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            this.updateCartCount();
        },

        addItem: function(id, name, price, image) {
            // Validate input parameters
            if (!id || !name || typeof price !== 'number' || !image) {
                console.error('Invalid item data:', { id, name, price, image });
                this.showNotification('Invalid product data!', 'error');
                return;
            }

            const cart = this.getCart();
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: id,
                    name: name,
                    price: parseFloat(price) || 0,
                    image: image,
                    quantity: 1
                });
            }

            this.saveCart(cart);
            this.renderCart(cart);
            this.showNotification(`${name} added to cart!`);
            
            // Debug: Log cart contents
            console.log('Cart updated:', cart);
        },

        updateQuantity: function(itemId, action) {
            const cart = this.getCart();
            const item = cart.find(item => item.id === itemId);

            if (item) {
                if (action === 'increase') {
                    item.quantity += 1;
                } else if (action === 'decrease' && item.quantity > 1) {
                    item.quantity -= 1;
                }
                this.saveCart(cart);
                this.renderCart(cart);
            }
        },

        setQuantity: function(itemId, quantity) {
            if (quantity < 1) {
                this.removeItem(itemId);
                return;
            }

            const cart = this.getCart();
            const item = cart.find(item => item.id === itemId);

            if (item) {
                item.quantity = quantity;
                this.saveCart(cart);
                this.renderCart(cart);
            }
        },

        removeItem: function(itemId) {
            const cart = this.getCart();
            const updatedCart = cart.filter(item => item.id !== itemId);
            this.saveCart(updatedCart);
            this.renderCart(updatedCart);
            this.showNotification('Item removed from cart!');
        },

        renderCart: function(cart) {
            const cartItems = $('#cart-items');
            
            console.log('Rendering cart with items:', cart);
            
            if (cart.length === 0) {
                cartItems.html(`
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                `);
            } else {
                let html = '';
                cart.forEach((item, index) => {
                    html += `
                        <div class="cart-item" data-item-id="${item.id}">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;">
                            </div>
                            <div class="cart-item-details">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">$${(item.price || 0).toFixed(2)}</div>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn" data-action="decrease">-</button>
                                    <input type="number" class="quantity-input" value="${item.quantity || 1}" min="1">
                                    <button class="quantity-btn" data-action="increase">+</button>
                                </div>
                            </div>
                            <button class="cart-item-remove">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                });
                cartItems.html(html);
            }

            this.updateTotals(cart);
        },

        updateTotals: function(cart) {
            const subtotal = cart.reduce((sum, item) => {
                const price = parseFloat(item.price) || 0;
                const quantity = parseInt(item.quantity) || 1;
                return sum + (price * quantity);
            }, 0);
            const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
            const total = subtotal + shipping;

            $('#cart-subtotal').text('$' + subtotal.toFixed(2));
            $('#cart-shipping').text('$' + shipping.toFixed(2));
            $('#cart-total').text('$' + total.toFixed(2));
        },

        updateCartCount: function() {
            const cart = this.getCart();
            const totalItems = cart.reduce((sum, item) => {
                const quantity = parseInt(item.quantity) || 1;
                return sum + quantity;
            }, 0);
            
            // Update all cart count elements
            $('.cart-count').each(function() {
                $(this).text(totalItems);
            });
            
            // Debug: Log cart count update
            console.log('Cart count updated to:', totalItems);
        },

        showNotification: function(message, type = 'success') {
            // Create notification element
            const iconClass = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
            const notification = $(`
                <div class="cart-notification ${type}">
                    <i class="fas ${iconClass}"></i>
                    <span>${message}</span>
                </div>
            `);

            // Add to body
            $('body').append(notification);

            // Show notification
            setTimeout(() => {
                notification.addClass('show');
            }, 100);

            // Hide notification
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
        console.log('Initializing CartSidebar...');
        CartSidebar.init();
        
        // Also initialize when window loads to ensure all elements are ready
        $(window).on('load', function() {
            console.log('Window loaded, updating cart count...');
            CartSidebar.updateCartCount();
        });
        
        // Force update cart count after a short delay to ensure DOM is ready
        setTimeout(function() {
            console.log('Force updating cart count...');
            CartSidebar.updateCartCount();
        }, 100);
        
        // Additional force update after longer delay
        setTimeout(function() {
            console.log('Final cart count update...');
            CartSidebar.updateCartCount();
        }, 500);
    });

    // Make CartSidebar globally available
    window.CartSidebar = CartSidebar;
    
    // Test function to verify cart functionality
    window.testCart = function() {
        console.log('=== CART FUNCTIONALITY TEST ===');
        console.log('Current cart:', CartSidebar.getCart());
        console.log('Cart count elements found:', $('.cart-count').length);
        console.log('Cart count text:', $('.cart-count').text());
        console.log('Wishlist count elements found:', $('.wishlist-count').length);
        console.log('Wishlist count text:', $('.wishlist-count').text());
        console.log('Cart sidebar element found:', $('#cart-sidebar').length);
        console.log('Cart items container found:', $('#cart-items').length);
        console.log('=== END TEST ===');
    };
    
    // Force cart update function
    window.forceCartUpdate = function() {
        console.log('Forcing cart update...');
        CartSidebar.updateCartCount();
        CartSidebar.loadCartData();
    };
    
    // Clear corrupted cart data function
    window.clearCartData = function() {
        console.log('Clearing cart data...');
        localStorage.removeItem('shoppingCart');
        CartSidebar.updateCartCount();
        CartSidebar.loadCartData();
    };

})(jQuery);
