// Drawer Functionality - Fresh Implementation
(function() {
    'use strict';
    
    // Cart Drawer Functions
    function openCartDrawer() {
        console.log('openCartDrawer called');
        var cartDrawer = document.getElementById('cart-drawer');
        var cartOverlay = document.getElementById('cart-drawer-overlay');
        
        console.log('Cart drawer element:', cartDrawer);
        console.log('Cart overlay element:', cartOverlay);
        
        if (cartDrawer && cartOverlay) {
            console.log('Opening cart drawer...');
            // Force positioning
            cartDrawer.style.position = 'fixed';
            cartDrawer.style.top = '0';
            cartDrawer.style.right = '0';
            cartDrawer.style.zIndex = '9999';
            cartDrawer.style.height = '100vh';
            cartDrawer.style.display = 'flex';
            
            cartOverlay.style.position = 'fixed';
            cartOverlay.style.top = '0';
            cartOverlay.style.left = '0';
            cartOverlay.style.width = '100%';
            cartOverlay.style.height = '100vh';
            cartOverlay.style.zIndex = '9998';
            cartOverlay.style.display = 'block';
            
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.classList.add('drawer-open');
            renderCartDrawer();
            console.log('Cart drawer opened successfully');
        } else {
            console.error('Cart drawer elements not found!');
        }
    }
    
    function closeCartDrawer() {
        var cartDrawer = document.getElementById('cart-drawer');
        var cartOverlay = document.getElementById('cart-drawer-overlay');
        
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
            cartDrawer.style.display = 'none';
            cartOverlay.style.display = 'none';
            document.body.classList.remove('drawer-open');
        }
    }
    
    function renderCartDrawer() {
        var cartBody = document.getElementById('cart-drawer-body');
        var cartFooter = document.getElementById('cart-drawer-footer');
        var cartTotal = document.getElementById('cart-drawer-total');
        
        if (!cartBody) return;
        
        // Get cart products
        var cartProducts = window.getCartProducts ? window.getCartProducts() : [];
        
        if (cartProducts.length === 0) {
            cartBody.innerHTML = '<div class="text-center py-5 text-muted"><i class="fas fa-shopping-cart fa-3x mb-3"></i><p>Your cart is empty</p></div>';
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }
        
        // Build cart items HTML
        var itemsHtml = '';
        var total = 0;
        
        cartProducts.forEach(function(item) {
            var quantity = item.quantity || 1;
            var itemTotal = item.price * quantity;
            total += itemTotal;
            
            itemsHtml += '<div class="cart-drawer-item" data-product-id="' + item.id + '">';
            itemsHtml += '<img src="' + (item.image || 'assets/img/product-1.jpg') + '" alt="' + (item.title || 'Product') + '" class="cart-drawer-item-image">';
            itemsHtml += '<div class="cart-drawer-item-details">';
            itemsHtml += '<a href="product-detail.html?id=' + item.id + '" class="cart-drawer-item-title">' + (item.title || 'Product') + '</a>';
            itemsHtml += '<div class="cart-drawer-item-price">₹' + item.price.toLocaleString('en-IN') + ' × ' + quantity + '</div>';
            itemsHtml += '<div class="cart-drawer-item-quantity">';
            itemsHtml += '<button type="button" class="btn btn-sm btn-outline-secondary cart-qty-minus" data-product-id="' + item.id + '">-</button>';
            itemsHtml += '<input type="text" class="form-control form-control-sm text-center" value="' + quantity + '" readonly style="width: 50px;">';
            itemsHtml += '<button type="button" class="btn btn-sm btn-outline-secondary cart-qty-plus" data-product-id="' + item.id + '">+</button>';
            itemsHtml += '<button type="button" class="cart-drawer-item-remove ml-auto" data-product-id="' + item.id + '">Remove</button>';
            itemsHtml += '</div>';
            itemsHtml += '</div>';
            itemsHtml += '</div>';
        });
        
        cartBody.innerHTML = itemsHtml;
        
        // Update footer
        if (cartFooter) {
            cartFooter.style.display = 'block';
            if (cartTotal) {
                cartTotal.textContent = '₹' + total.toLocaleString('en-IN');
            }
        }
        
        // Bind quantity and remove buttons
        bindCartDrawerEvents();
    }
    
    function bindCartDrawerEvents() {
        // Quantity buttons
        var qtyPlusBtns = document.querySelectorAll('.cart-qty-plus');
        var qtyMinusBtns = document.querySelectorAll('.cart-qty-minus');
        var removeBtns = document.querySelectorAll('.cart-drawer-item-remove');
        
        qtyPlusBtns.forEach(function(btn) {
            btn.onclick = function() {
                var productId = this.getAttribute('data-product-id');
                if (window.addProductToCollection && window.getCartProducts) {
                    var cartProducts = window.getCartProducts();
                    var product = cartProducts.find(function(p) { return p.id == productId; });
                    if (product) {
                        var newQty = (product.quantity || 1) + 1;
                        window.addProductToCollection('cart', product, newQty);
                        renderCartDrawer();
                        if (window.updateCountBadges) window.updateCountBadges();
                    }
                }
            };
        });
        
        qtyMinusBtns.forEach(function(btn) {
            btn.onclick = function() {
                var productId = this.getAttribute('data-product-id');
                if (window.addProductToCollection && window.getCartProducts) {
                    var cartProducts = window.getCartProducts();
                    var product = cartProducts.find(function(p) { return p.id == productId; });
                    if (product) {
                        var newQty = Math.max(1, (product.quantity || 1) - 1);
                        window.addProductToCollection('cart', product, newQty);
                        renderCartDrawer();
                        if (window.updateCountBadges) window.updateCountBadges();
                    }
                }
            };
        });
        
        removeBtns.forEach(function(btn) {
            btn.onclick = function() {
                var productId = this.getAttribute('data-product-id');
                if (window.shopState && window.shopState.cart) {
                    window.shopState.cart = window.shopState.cart.filter(function(p) {
                        return p.id != productId;
                    });
                    // Save to localStorage
                    if (window.shopState.cart.length > 0) {
                        localStorage.setItem('cart', JSON.stringify(window.shopState.cart));
                    } else {
                        localStorage.removeItem('cart');
                    }
                    renderCartDrawer();
                    if (window.updateCountBadges) window.updateCountBadges();
                }
            };
        });
    }
    
    // Mobile Navigation Drawer Functions
    function openNavDrawer() {
        console.log('openNavDrawer called');
        var navDrawer = document.getElementById('nav-drawer');
        var navOverlay = document.getElementById('nav-drawer-overlay');
        
        console.log('Nav drawer element:', navDrawer);
        console.log('Nav overlay element:', navOverlay);
        
        if (navDrawer && navOverlay) {
            console.log('Opening nav drawer...');
            // Force positioning
            navDrawer.style.position = 'fixed';
            navDrawer.style.top = '0';
            navDrawer.style.right = '0';
            navDrawer.style.zIndex = '9999';
            navDrawer.style.height = '100vh';
            navDrawer.style.display = 'flex';
            
            navOverlay.style.position = 'fixed';
            navOverlay.style.top = '0';
            navOverlay.style.left = '0';
            navOverlay.style.width = '100%';
            navOverlay.style.height = '100vh';
            navOverlay.style.zIndex = '9998';
            navOverlay.style.display = 'block';
            
            navDrawer.classList.add('active');
            navOverlay.classList.add('active');
            document.body.classList.add('drawer-open');
            console.log('Nav drawer opened successfully');
        } else {
            console.error('Nav drawer elements not found!');
        }
    }
    
    function closeNavDrawer() {
        var navDrawer = document.getElementById('nav-drawer');
        var navOverlay = document.getElementById('nav-drawer-overlay');
        
        if (navDrawer && navOverlay) {
            navDrawer.classList.remove('active');
            navOverlay.classList.remove('active');
            navDrawer.style.display = 'none';
            navOverlay.style.display = 'none';
            document.body.classList.remove('drawer-open');
        }
    }
    
    // Initialize drawers
    function initDrawers() {
        console.log('=== Initializing Drawers ===');
        
        // Cart drawer triggers
        var cartTriggerDesktop = document.getElementById('cart-drawer-trigger');
        var cartTriggerMobile = document.getElementById('cart-drawer-trigger-mobile');
        
        console.log('Cart trigger desktop:', cartTriggerDesktop);
        console.log('Cart trigger mobile:', cartTriggerMobile);
        
        if (cartTriggerDesktop) {
            console.log('Binding desktop cart trigger...');
            cartTriggerDesktop.onclick = function(e) {
                console.log('Desktop cart button clicked!');
                e.preventDefault();
                e.stopPropagation();
                openCartDrawer();
            };
            // Also add event listener as backup
            cartTriggerDesktop.addEventListener('click', function(e) {
                console.log('Desktop cart button clicked (addEventListener)!');
                e.preventDefault();
                e.stopPropagation();
                openCartDrawer();
            });
        } else {
            console.warn('Desktop cart trigger not found!');
        }
        
        if (cartTriggerMobile) {
            console.log('Binding mobile cart trigger...');
            cartTriggerMobile.onclick = function(e) {
                console.log('Mobile cart button clicked!');
                e.preventDefault();
                e.stopPropagation();
                openCartDrawer();
            };
            // Also add event listener as backup
            cartTriggerMobile.addEventListener('click', function(e) {
                console.log('Mobile cart button clicked (addEventListener)!');
                e.preventDefault();
                e.stopPropagation();
                openCartDrawer();
            });
        } else {
            console.warn('Mobile cart trigger not found!');
        }
        
        // Mobile nav drawer trigger
        var navToggler = document.getElementById('mobile-nav-toggler');
        console.log('Nav toggler:', navToggler);
        
        if (navToggler) {
            console.log('Binding nav toggler...');
            navToggler.onclick = function(e) {
                console.log('Nav toggler clicked!');
                e.preventDefault();
                e.stopPropagation();
                openNavDrawer();
            };
            // Also add event listener as backup
            navToggler.addEventListener('click', function(e) {
                console.log('Nav toggler clicked (addEventListener)!');
                e.preventDefault();
                e.stopPropagation();
                openNavDrawer();
            });
        } else {
            console.warn('Nav toggler not found!');
        }
        
        console.log('=== Drawers Initialization Complete ===');
        
        // Close buttons
        var cartClose = document.getElementById('cart-drawer-close');
        if (cartClose) {
            cartClose.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Cart drawer close clicked');
                closeCartDrawer();
            };
        }
        
        var navClose = document.getElementById('nav-drawer-close');
        if (navClose) {
            navClose.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Nav drawer close clicked');
                closeNavDrawer();
            };
        }
        
        // Overlays
        var cartOverlay = document.getElementById('cart-drawer-overlay');
        if (cartOverlay) {
            cartOverlay.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Cart overlay clicked');
                closeCartDrawer();
            };
        }
        
        var navOverlay = document.getElementById('nav-drawer-overlay');
        if (navOverlay) {
            navOverlay.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Nav overlay clicked');
                closeNavDrawer();
            };
        }
        
        // Filter Drawer
        var filterTrigger = document.getElementById('filter-drawer-trigger');
        if (filterTrigger) {
            filterTrigger.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Filter drawer trigger clicked');
                openFilterDrawer();
            };
        }
        
        var filterClose = document.getElementById('filter-drawer-close');
        if (filterClose) {
            filterClose.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Filter drawer close clicked');
                closeFilterDrawer();
            };
        }
        
        var filterOverlay = document.getElementById('filter-drawer-overlay');
        if (filterOverlay) {
            filterOverlay.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Filter overlay clicked');
                closeFilterDrawer();
            };
        }
        
        // Filter Apply/Reset buttons
        var filterApplyBtn = document.getElementById('filter-apply-btn');
        if (filterApplyBtn) {
            filterApplyBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Apply filters clicked');
                // TODO: Implement filter logic
                closeFilterDrawer();
            };
        }
        
        var filterResetBtn = document.getElementById('filter-reset-btn');
        if (filterResetBtn) {
            filterResetBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Reset filters clicked');
                // Reset all checkboxes
                var filterBody = document.getElementById('filter-drawer-body');
                if (filterBody) {
                    var checkboxes = filterBody.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(function(cb) {
                        if (cb.id.includes('all')) {
                            cb.checked = true;
                        } else {
                            cb.checked = false;
                        }
                    });
                }
            };
        }
        
        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                console.log('ESC key pressed');
                closeCartDrawer();
                closeNavDrawer();
                closeFilterDrawer();
            }
        });
        
        console.log('All drawer event listeners bound');
    }
    
    // Wait for DOM and initialize
    console.log('Drawers.js loaded, readyState:', document.readyState);
    
    function startInit() {
        console.log('Starting drawer initialization...');
        setTimeout(function() {
            initDrawers();
        }, 300);
    }
    
    if (document.readyState === 'loading') {
        console.log('DOM still loading, waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', startInit);
    } else {
        console.log('DOM already loaded, initializing immediately...');
        startInit();
    }
    
    // Filter Drawer Functions
    function openFilterDrawer() {
        console.log('openFilterDrawer called');
        var filterDrawer = document.getElementById('filter-drawer');
        var filterOverlay = document.getElementById('filter-drawer-overlay');
        
        if (filterDrawer && filterOverlay) {
            console.log('Opening filter drawer...');
            // Force positioning
            filterDrawer.style.position = 'fixed';
            filterDrawer.style.top = '0';
            filterDrawer.style.left = '0';
            filterDrawer.style.zIndex = '9999';
            filterDrawer.style.height = '100vh';
            filterDrawer.style.display = 'flex';
            
            filterOverlay.style.position = 'fixed';
            filterOverlay.style.top = '0';
            filterOverlay.style.left = '0';
            filterOverlay.style.width = '100%';
            filterOverlay.style.height = '100vh';
            filterOverlay.style.zIndex = '9998';
            filterOverlay.style.display = 'block';
            
            filterDrawer.classList.add('active');
            filterOverlay.classList.add('active');
            document.body.classList.add('drawer-open');
            console.log('Filter drawer opened successfully');
        } else {
            console.error('Filter drawer elements not found!');
        }
    }
    
    function closeFilterDrawer() {
        var filterDrawer = document.getElementById('filter-drawer');
        var filterOverlay = document.getElementById('filter-drawer-overlay');
        
        if (filterDrawer && filterOverlay) {
            filterDrawer.classList.remove('active');
            filterOverlay.classList.remove('active');
            filterDrawer.style.display = 'none';
            filterOverlay.style.display = 'none';
            document.body.classList.remove('drawer-open');
            console.log('Filter drawer closed');
        }
    }
    
    // Expose globally
    window.renderCartDrawer = renderCartDrawer;
    window.openCartDrawer = openCartDrawer;
    window.closeCartDrawer = closeCartDrawer;
    window.openNavDrawer = openNavDrawer;
    window.closeNavDrawer = closeNavDrawer;
    window.openFilterDrawer = openFilterDrawer;
    window.closeFilterDrawer = closeFilterDrawer;
})();

