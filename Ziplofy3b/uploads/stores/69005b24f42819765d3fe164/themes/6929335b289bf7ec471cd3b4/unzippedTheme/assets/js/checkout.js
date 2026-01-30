(function() {
    'use strict';

    // Format price
    function formatPrice(price) {
        return '₹' + price.toLocaleString('en-IN');
    }

    // Check if coming from Buy Now
    function isBuyNowMode() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('buyNow') === 'true';
    }

    // Get products for checkout (either buy now product or cart items)
    function getCheckoutProducts() {
        var buyNowMode = isBuyNowMode();
        
        if (buyNowMode) {
            // Get product from sessionStorage
            var buyNowProductStr = sessionStorage.getItem('buyNowProduct');
            if (buyNowProductStr) {
                try {
                    var buyNowProduct = JSON.parse(buyNowProductStr);
                    console.log('Checkout: Buy Now mode - showing product:', buyNowProduct);
                    return [buyNowProduct];
                } catch(e) {
                    console.error('Error parsing buyNowProduct:', e);
                }
            } else {
                console.warn('Checkout: Buy Now mode but no product in sessionStorage');
            }
            // If no buyNow product found, return empty (don't fall back to cart)
            return [];
        } else {
            // Normal checkout from cart
            var cartProducts = window.getCartProducts ? (window.getCartProducts() || []) : [];
            console.log('Checkout: Normal mode - showing cart items:', cartProducts.length);
            return cartProducts;
        }
    }

    // Render order summary
    function renderOrderSummary() {
        var checkoutProducts = getCheckoutProducts();
        var orderSummaryEl = document.getElementById('order-summary-products');
        
        if (!orderSummaryEl) {
            return;
        }

        if (checkoutProducts.length === 0) {
            // Empty - redirect to shop
            orderSummaryEl.innerHTML = '<h6 class="mb-3">Products</h6><div class="d-flex justify-content-between"><p class="text-muted">No items to checkout.</p></div>';
            if (window.showFlashMessage) {
                window.showFlashMessage('warning', 'No items to checkout. Redirecting to shop...');
            }
            setTimeout(function() {
                window.location.href = 'shop.html';
            }, 2000);
            return;
        }

        // Build products HTML
        var productsHtml = '<h6 class="mb-3">Products</h6>';
        checkoutProducts.forEach(function(item) {
            var quantity = item.quantity || 1;
            var itemTotal = item.price * quantity;
            productsHtml += '<div class="d-flex justify-content-between mb-2">';
            productsHtml += '<p class="mb-0">' + item.title;
            if (quantity > 1) {
                productsHtml += ' <small class="text-muted">(x' + quantity + ')</small>';
            }
            productsHtml += '</p>';
            productsHtml += '<p class="mb-0">' + formatPrice(itemTotal) + '</p>';
            productsHtml += '</div>';
        });

        orderSummaryEl.innerHTML = productsHtml;

        // Update totals
        updateOrderTotals();
    }

    // Update order totals
    function updateOrderTotals() {
        var checkoutProducts = getCheckoutProducts();
        var subtotal = checkoutProducts.reduce(function(total, item) {
            return total + (item.price * (item.quantity || 1));
        }, 0);
        var shipping = subtotal > 0 ? (subtotal >= 50000 ? 0 : 100) : 0; // Free shipping over ₹50,000
        var total = subtotal + shipping;

        // Update subtotal
        var subtotalEl = document.getElementById('order-subtotal');
        if (subtotalEl) {
            subtotalEl.textContent = formatPrice(subtotal);
        }

        // Update shipping
        var shippingEl = document.getElementById('order-shipping');
        if (shippingEl) {
            shippingEl.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
        }

        // Update total
        var totalEl = document.getElementById('order-total');
        if (totalEl) {
            totalEl.textContent = formatPrice(total);
        }
    }

    // Handle payment method selection
    function initPaymentMethods() {
        var paymentRadios = document.querySelectorAll('input[name="payment"]');
        var creditCardDetails = document.getElementById('credit-card-details');
        
        if (!creditCardDetails) {
            return;
        }

        // Show/hide credit card details based on selection
        function toggleCreditCardDetails() {
            var selectedPayment = document.querySelector('input[name="payment"]:checked');
            if (selectedPayment && selectedPayment.value === 'creditcard') {
                creditCardDetails.style.display = 'block';
            } else {
                creditCardDetails.style.display = 'none';
            }
        }

        paymentRadios.forEach(function(radio) {
            radio.addEventListener('change', toggleCreditCardDetails);
        });

        // Initial state
        toggleCreditCardDetails();
    }

    // Format card number input
    function formatCardNumber() {
        var cardNumberInput = document.getElementById('cardNumber');
        if (!cardNumberInput) {
            return;
        }

        cardNumberInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\s/g, '');
            var formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length <= 19) {
                e.target.value = formattedValue;
            }
        });
    }

    // Format expiry date input
    function formatExpiryDate() {
        var expiryInput = document.getElementById('expiryDate');
        if (!expiryInput) {
            return;
        }

        expiryInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Handle form submission
    function initCheckoutForm() {
        var form = document.getElementById('checkout-form');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Validate form
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            // Check if checkout products are available
            var checkoutProducts = getCheckoutProducts();
            if (checkoutProducts.length === 0) {
                if (window.showFlashMessage) {
                    window.showFlashMessage('warning', 'No items to checkout. Please add items first.');
                }
                return;
            }

            // Check terms checkbox
            var termsCheckbox = document.getElementById('terms');
            if (termsCheckbox && !termsCheckbox.checked) {
                if (window.showFlashMessage) {
                    window.showFlashMessage('warning', 'Please agree to the terms and conditions.');
                }
                return;
            }

            // Get form data
            var formData = {
                billing: {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('email').value,
                    mobile: document.getElementById('mobile').value,
                    address1: document.getElementById('address1').value,
                    address2: document.getElementById('address2').value,
                    country: document.getElementById('country').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zipCode: document.getElementById('zipCode').value
                },
                payment: {
                    method: document.querySelector('input[name="payment"]:checked').value,
                    cardNumber: document.getElementById('cardNumber')?.value || '',
                    expiryDate: document.getElementById('expiryDate')?.value || '',
                    cvv: document.getElementById('cvv')?.value || '',
                    cardName: document.getElementById('cardName')?.value || ''
                },
                cart: checkoutProducts,
                total: checkoutProducts.reduce(function(total, item) {
                    return total + (item.price * (item.quantity || 1));
                }, 0),
                shipping: checkoutProducts.reduce(function(total, item) {
                    return total + (item.price * (item.quantity || 1));
                }, 0) >= 50000 ? 0 : 100,
                buyNow: isBuyNowMode(),
                timestamp: new Date().toISOString()
            };

            // Disable submit button
            var submitBtn = document.getElementById('place-order-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
            }

            // Simulate order processing
            setTimeout(function() {
                // Store order in localStorage (for demo purposes)
                var orders = JSON.parse(localStorage.getItem('orders') || '[]');
                orders.push({
                    id: 'ORD-' + Date.now(),
                    ...formData
                });
                localStorage.setItem('orders', JSON.stringify(orders));

                // Clear buyNow product from sessionStorage if exists
                if (isBuyNowMode()) {
                    sessionStorage.removeItem('buyNowProduct');
                } else {
                    // Clear cart only if not buy now
                    if (window.shopState) {
                        window.shopState.cart = [];
                    }
                }
                if (window.updateCountBadges) {
                    window.updateCountBadges();
                }

                // Show success message
                if (window.showFlashMessage) {
                    window.showFlashMessage('success', 'Order placed successfully! Redirecting...');
                }

                // Redirect to order confirmation page (or track-order page)
                setTimeout(function() {
                    window.location.href = 'track-order.html?order=' + orders[orders.length - 1].id;
                }, 1500);
            }, 2000);
        });
    }

    // Initialize checkout page
    function initCheckout() {
        var buyNowMode = isBuyNowMode();
        
        // Wait for products.js to load (only needed for cart mode, not buy now)
        if (!buyNowMode) {
            if (typeof window.getCartProducts !== 'function') {
                setTimeout(initCheckout, 100);
                return;
            }
        }

        // Render order summary first
        renderOrderSummary();
        
        // Initialize other features
        initPaymentMethods();
        formatCardNumber();
        formatExpiryDate();
        initCheckoutForm();

        // Update count badges (only if products.js is loaded and not in buy now mode)
        if (!buyNowMode && window.updateCountBadges) {
            window.updateCountBadges();
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initCheckout, 50);
        });
    } else {
        setTimeout(initCheckout, 50);
    }
})();

