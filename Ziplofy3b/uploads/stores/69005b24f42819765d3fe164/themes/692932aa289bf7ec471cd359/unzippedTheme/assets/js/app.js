'use strict';

function getLiquidEngine() {
    if (window.liquidEngine) {
        return window.liquidEngine;
    }
    if (window.liquidjs) {
        window.liquidEngine = new window.liquidjs.Liquid({
            root: ['templates/'],
            extname: '.liquid'
        });
        return window.liquidEngine;
    }
    return null;
}

function renderWithLiquid(templateName, context) {
    const engine = getLiquidEngine();
    if (!engine) {
        console.warn('Liquid engine is not available. Template rendering skipped for', templateName);
        return Promise.resolve('');
    }
    return engine.renderFile(templateName, context);
}

function getProductsArray() {
    if (Array.isArray(window.PRODUCTS)) {
        return window.PRODUCTS;
    }
    if (window.PRODUCTS && Array.isArray(window.PRODUCTS.items)) {
        return window.PRODUCTS.items;
    }
    if (Array.isArray(window.products)) {
        return window.products;
    }
    return [];
}

// Global product normalization function
function normalizeProductForTemplate(product) {
    if (!product) return null;
    const placeholderImage = 'https://via.placeholder.com/400x300/1a1a1a/FF5E00?text=No+Image';
    const priceValue = typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 0);
    return {
        ...product,
        id: product.id || String(product.id || ''),
        name: product.name || product.title || 'Product',
        title: product.title || product.name || 'Product',
        image: product.image || (Array.isArray(product.images) ? product.images[0] : '') || placeholderImage,
        price: priceValue,
        discount: product.discount || product.discount_percent || 0,
        reviews: product.reviewCount || product.reviews || 0,
        badge: product.badge || '',
        rating: Number(product.rating || 0),
        category: product.category || '',
        brand: product.brand || ''
    };
}

/*

TemplateMo 596 Electric Xtra

https://templatemo.com/tm-596-electric-xtra

*/

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    if (!particlesContainer) return;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';

        // Randomly assign orange or blue color
        if (Math.random() > 0.5) {
            particle.style.setProperty('--particle-color', '#00B2FF');
            particle.style.background = '#00B2FF';
        }

        particlesContainer.appendChild(particle);
    }
}

// Mobile menu toggle (guarded)
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    const overlay = document.getElementById('mobileNavOverlay');
    const mobileSearchBar = document.getElementById('mobileSearchBar');
    const closeSearch = () => {
        if (mobileSearchBar) mobileSearchBar.classList.remove('active');
    };
    const closeDrawer = () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    const openDrawer = () => {
        closeSearch();
        menuToggle.classList.add('active');
        navLinks.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    menuToggle.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', () => { closeDrawer(); closeSearch(); });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });
}

// Mobile search toggle
(function() {
    const trigger = document.querySelector('.mobile-search-trigger');
    const bar = document.getElementById('mobileSearchBar');
    const input = document.getElementById('mobileSearchInput');
    const overlay = document.getElementById('mobileNavOverlay');
    if (!trigger || !bar) return;
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isActive = bar.classList.contains('active');
        if (isActive) {
            bar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        } else {
            // close drawer if open
            const navLinksEl = document.getElementById('navLinks');
            const menuToggleEl = document.getElementById('menuToggle');
            if (navLinksEl && navLinksEl.classList.contains('active')) {
                navLinksEl.classList.remove('active');
                if (menuToggleEl) menuToggleEl.classList.remove('active');
            }
            bar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            setTimeout(() => { if (input) input.focus(); }, 50);
        }
    });
})();

// Active navigation highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => item.classList.remove('active'));
            const currentNav = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (currentNav) currentNav.classList.add('active');
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    updateActiveNav();
});

// Initial active nav update
updateActiveNav();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Feature tabs functionality
const tabs = document.querySelectorAll('.tab-item');
const panels = document.querySelectorAll('.content-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');

        // Remove active class from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        const targetPanel = document.getElementById(tabId);
        if (targetPanel) targetPanel.classList.add('active');
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Message sent! We\'ll get back to you soon.');
        this.reset();
    });
}

// Initialize particles
createParticles();

// Text rotation with character animation
const textSets = document.querySelectorAll('.text-set');
let currentIndex = 0;
let isAnimating = false;

function wrapTextInSpans(element) {
    const text = element.textContent;
    element.innerHTML = text.split('').map((char, i) =>
        `<span class="char" style="animation-delay: ${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
}

function animateTextIn(textSet) {
    const glitchText = textSet.querySelector('.glitch-text');
    const subtitle = textSet.querySelector('.subtitle');

    if (!glitchText || !subtitle) return;

    // Wrap text in spans for animation
    wrapTextInSpans(glitchText);

    // Update data attribute for glitch effect
    glitchText.setAttribute('data-text', glitchText.textContent);

    // Show subtitle after main text
    setTimeout(() => {
        subtitle.classList.add('visible');
    }, 800);
}

function animateTextOut(textSet) {
    const chars = textSet.querySelectorAll('.char');
    const subtitle = textSet.querySelector('.subtitle');

    chars.forEach((char, i) => {
        char.style.animationDelay = `${i * 0.02}s`;
        char.classList.add('out');
    });

    if (subtitle) subtitle.classList.remove('visible');
}

function rotateText() {
    if (isAnimating) return;
    isAnimating = true;

    const currentSet = textSets[currentIndex];
    const nextIndex = (currentIndex + 1) % textSets.length;
    const nextSet = textSets[nextIndex];

    // Animate out current text
    animateTextOut(currentSet);

    // After out animation, switch sets
    setTimeout(() => {
        currentSet.classList.remove('active');
        nextSet.classList.add('active');
        animateTextIn(nextSet);

        currentIndex = nextIndex;
        isAnimating = false;
    }, 600);
}

// Initialize first text set
if (textSets && textSets.length > 0) {
    textSets[0].classList.add('active');
    animateTextIn(textSets[0]);
}

// Start rotation after initial display
if (textSets && textSets.length > 0) {
    setTimeout(() => {
        setInterval(rotateText, 5000); // Change every 5 seconds
    }, 4000);
}

// Add random glitch effect
setInterval(() => {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(text => {
        if (Math.random() > 0.95) {
            text.style.animation = 'none';
            setTimeout(() => {
                text.style.animation = '';
            }, 200);
        }
    });
}, 3000);

/* ========================================================================
   Cart Page Functionality (product-agnostic)
   ======================================================================== */
let cart = [];
let appliedCoupon = null;

function loadCartState() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
}

function persistCartState() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;

    loadCartState();

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }

    cartItemsList.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item-detailed';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image || ''}" alt="${item.name || ''}" onerror="this.src='https://via.placeholder.com/100x100/1a1a1a/FF5E00?text=No+Image'">
            </div>
            <div class="cart-item-details">
                <h3>${item.name || 'Product'}</h3>
                <p class="item-category">${item.category || ''}</p>
                <div class="item-options">
                    ${item.selectedColor ? `<span class="option">Color: ${item.selectedColor}</span>` : ''}
                    ${item.selectedStorage ? `<span class="option">Storage: ${item.selectedStorage}</span>` : ''}
                </div>
                <div class="item-price">$${(item.price || 0).toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateItemQuantity(${item.id}, ${(item.quantity || 1) - 1})">-</button>
                    <input type="number" value="${item.quantity || 1}" min="1" max="10" onchange="updateItemQuantity(${item.id}, parseInt(this.value, 10))">
                    <button class="qty-btn" onclick="updateItemQuantity(${item.id}, ${(item.quantity || 1) + 1})">+</button>
                </div>
                <div class="item-total">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
                <button class="remove-item" onclick="removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsList.appendChild(cartItem);
    });
}

function updateItemQuantity(productId, newQuantity) {
    loadCartState();
    const item = cart.find(entry => String(entry.id) === String(productId));
    if (item) {
        if (newQuantity <= 0) {
            cart = cart.filter(entry => String(entry.id) !== String(productId));
        } else if (newQuantity <= 10) {
            item.quantity = newQuantity;
        }
        persistCartState();
        loadCartItems();
        updateCartSummary();
        updateCartUI();
        renderCartSlider();
    }
}

function removeItem(productId) {
    loadCartState();
    cart = cart.filter(entry => String(entry.id) !== String(productId));
    persistCartState();
    loadCartItems();
    updateCartSummary();
    updateCartUI();
    renderCartSlider();
}

function clearCart() {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    cart = [];
    persistCartState();
    loadCartItems();
    updateCartSummary();
    updateCartUI();
    renderCartSlider();
}

function updateCartSummary() {
    loadCartState();
    const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const totalBeforeDiscount = subtotal + shipping + tax;

    let discount = 0;
    if (appliedCoupon) {
        discount = appliedCoupon.type === 'percentage'
            ? subtotal * (appliedCoupon.value / 100)
            : appliedCoupon.value;
    }

    const finalTotal = Math.max(totalBeforeDiscount - discount, 0);

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;

    const couponContainer = document.querySelector('.summary-row.discount');
    if (couponContainer) couponContainer.remove();

    if (appliedCoupon && discount > 0 && totalEl) {
        const couponRow = document.createElement('div');
        couponRow.className = 'summary-row discount';
        couponRow.innerHTML = `
            <span>Discount (${appliedCoupon.code}):</span>
            <span>-$${discount.toFixed(2)}</span>
        `;
        totalEl.parentNode.insertBefore(couponRow, totalEl.parentNode.lastElementChild);
    }
}

function applyCoupon() {
    const couponInput = document.getElementById('couponCode');
    const couponCode = couponInput ? couponInput.value.trim().toUpperCase() : '';
    if (!couponCode) {
        showCouponMessage('Please enter a coupon code', 'error');
        return;
    }

    const coupons = {
        'WELCOME10': { type: 'percentage', value: 10, description: '10% off your order' },
        'SAVE20': { type: 'percentage', value: 20, description: '20% off your order' },
        'FREESHIP': { type: 'fixed', value: 9.99, description: 'Free shipping' },
        'NEWUSER': { type: 'fixed', value: 50, description: '$50 off your order' }
    };

    if (coupons[couponCode]) {
        appliedCoupon = { ...coupons[couponCode], code: couponCode };
        showCouponMessage(`Coupon applied! ${appliedCoupon.description}`, 'success');
        updateCartSummary();
    } else {
        showCouponMessage('Invalid coupon code', 'error');
    }
}

function showCouponMessage(message, type) {
    const couponMessage = document.getElementById('couponMessage');
    if (!couponMessage) return;

    couponMessage.textContent = message;
    couponMessage.className = `coupon-message ${type}`;

    setTimeout(() => {
        couponMessage.textContent = '';
        couponMessage.className = 'coupon-message';
    }, 3000);
}

function updateCartUI() {
    loadCartState();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    updateCartBadges(totalItems);
}

function updateCartBadges(totalItems) {
    const count = typeof totalItems === 'number'
        ? totalItems
        : cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    document.querySelectorAll('.cart-count').forEach(function(badge) {
        badge.textContent = count;
    });

    const sliderCount = document.querySelector('.electro-cart-count');
    if (sliderCount) {
        sliderCount.textContent = count;
    }
}

function formatCurrencyINR(amount) {
    return Number(amount || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function renderCartSlider() {
    const sliderContainer = document.getElementById('electroCartItems');
    const totalElement = document.getElementById('electroCartTotal');

    loadCartState();

    const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0);
    if (totalElement) {
        totalElement.textContent = formatCurrencyINR(totalAmount);
    }

    if (!sliderContainer) {
        return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
        sliderContainer.innerHTML = `
            <div class="electro-empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started</p>
            </div>
        `;
        return;
    }

    sliderContainer.innerHTML = cart.map(function(item) {
        const options = [
            item.selectedColor ? `Color: ${item.selectedColor}` : '',
            item.selectedStorage ? `Storage: ${item.selectedStorage}` : ''
        ].filter(Boolean).join(' • ');

        const qtyLabel = options ? `Qty: ${item.quantity} • ${options}` : `Qty: ${item.quantity}`;

        return `
            <div class="electro-cart-item" data-item-id="${item.id}">
                <img src="${item.image || 'https://via.placeholder.com/60x60/1a1a1a/FF5E00?text=No+Image'}" alt="${item.name || 'Product'}">
                <div class="electro-cart-details">
                    <p class="electro-cart-item-name">${item.name || 'Product'}</p>
                    <p class="electro-cart-item-qty">${qtyLabel}</p>
                </div>
                <p class="electro-cart-item-price">₹${formatCurrencyINR((item.price || 0) * (item.quantity || 1))}</p>
                <button class="electro-remove-item" data-remove-id="${item.id}" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');

    sliderContainer.querySelectorAll('.electro-remove-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-remove-id');
            if (typeof window.removeItem === 'function') {
                window.removeItem(productId);
            }
        });
    });
}

function addCartItem(cartItem) {
    if (!cartItem || !cartItem.id) return;

    loadCartState();

    const normalizedItem = {
        id: String(cartItem.id),
        name: cartItem.name || 'Product',
        price: Number(cartItem.price || 0),
        image: cartItem.image || 'https://via.placeholder.com/400x300/1a1a1a/FF5E00?text=No+Image',
        quantity: Math.max(1, parseInt(cartItem.quantity, 10) || 1),
        category: cartItem.category || '',
        selectedStorage: cartItem.selectedStorage || '',
        selectedColor: cartItem.selectedColor || ''
    };

    const existingItem = cart.find(entry =>
        String(entry.id) === normalizedItem.id &&
        (entry.selectedStorage || '') === normalizedItem.selectedStorage &&
        (entry.selectedColor || '') === normalizedItem.selectedColor
    );

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + normalizedItem.quantity;
    } else {
        cart.push(normalizedItem);
    }

    persistCartState();
    loadCartItems();
    updateCartSummary();
    updateCartUI();
    renderCartSlider();
}

function addProductToCart(productId, options = {}) {
    const allProducts = getProductsArray();
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
        console.warn('No products available to add to cart.');
        return;
    }

    const product = allProducts.find(function(item) {
        return String(item.id) === String(productId);
    });

    if (!product) {
        console.warn('Product not found for addToCart:', productId);
        return;
    }

    const cartItem = {
        id: product.id,
        name: product.title || product.name || 'Product',
        price: product.price,
        image: product.image,
        quantity: Math.max(1, parseInt(options.quantity, 10) || 1),
        category: product.category || '',
        selectedStorage: options.storage || '',
        selectedColor: options.color || ''
    };

    addCartItem(cartItem);
}

window.addToCart = addProductToCart;

document.addEventListener('DOMContentLoaded', function() {
    loadCartState();
    updateCartUI();
    renderCartSlider();
});

function buildRecommendedProductCard(product) {
    if (!product) return '';

    const discountBadge = product.discount
        ? `<div class="discount-badge">${product.discount}% OFF</div>`
        : '';
    const productName = product.name || product.title || 'Product';
    const productImage = product.image || 'https://via.placeholder.com/400x300/1a1a1a/FF5E00?text=No+Image';
    const price = Number(product.price || 0).toLocaleString();

    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${productImage}" alt="${productName}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/1a1a1a/FF5E00?text=No+Image'">
                ${discountBadge}
                <div class="wishlist-icon">
                    <i class="fas fa-heart"></i>
                </div>
            </div>
            <h3 class="product-title">${productName}</h3>
            <div class="product-price">₹${price}</div>
            <div class="product-actions">
                <button class="add-to-cart-btn">ADD TO CART</button>
            </div>
        </div>
    `;
}

function enhanceRecommendedProductCards(container) {
    if (!container) return;

    const cards = container.querySelectorAll('.product-card');
    cards.forEach(function(card) {
        const productId = card.getAttribute('data-product-id');
        if (!productId) return;

        const productTitle = card.querySelector('.product-title');
        const productName = productTitle ? productTitle.textContent.trim() : 'Product';

        const addButton = card.querySelector('.add-to-cart-btn');
        if (addButton) {
            addButton.removeAttribute('onclick');
            addButton.dataset.productId = productId;
            addButton.dataset.productName = productName;
            addButton.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (typeof window.addToCart === 'function') {
                    window.addToCart(productId);
                }
                if (typeof window.showCartNotification === 'function') {
                    window.showCartNotification(`${productName} added to cart!`);
                }
            });
        }

        const wishlistIcon = card.querySelector('.wishlist-icon');
        if (wishlistIcon) {
            wishlistIcon.dataset.productId = productId;
            wishlistIcon.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (typeof window.toggleWishlist === 'function') {
                    window.toggleWishlist(productId);
                }
            });
        }
    });
}

function renderRecommendedProducts() {
    const container = document.getElementById('recommendedProducts');
    if (!container) return;

    const allProducts = getProductsArray();
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
        container.innerHTML = '';
        return;
    }

    const recommended = allProducts.slice(0, 3).map(normalizeProductForTemplate);

    renderWithLiquid('featured-products', { products: recommended })
        .then(function(html) {
            if (html && html.trim()) {
                container.innerHTML = html;
            } else {
                container.innerHTML = recommended.map(buildRecommendedProductCard).join('');
            }
            enhanceRecommendedProductCards(container);
        })
        .catch(function(err) {
            console.error('Error rendering recommended products:', err);
            container.innerHTML = recommended.map(buildRecommendedProductCard).join('');
            enhanceRecommendedProductCards(container);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const cartRoot = document.querySelector('.cart-content');
    if (!cartRoot) return;

    loadCartState();
    loadCartItems();
    updateCartSummary();
    updateCartUI();
    renderRecommendedProducts();
});

window.updateItemQuantity = updateItemQuantity;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.applyCoupon = applyCoupon;

/*
==========================================
CHECKOUT PAGE FUNCTIONALITY
==========================================
*/

// Checkout Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if on checkout page
    if (document.getElementById('checkoutForm')) {
        initializeCheckout();
        loadCheckoutCartItems();
        updateCheckoutOrderSummary();
        setupCheckoutFormValidation();
        setupCheckoutPaymentHandlers();
        setupCheckoutProgressTracking();
    }
});

// Initialize Checkout
function initializeCheckout() {
    setDefaultShipping();
    setDefaultPayment();
    setupShippingOptions();
    setupPaymentOptions();
    setupCheckoutFormHandlers();
}

// Load Cart Items for Checkout
function loadCheckoutCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (!orderItemsContainer) return;
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-options">${item.storage || ''} ${item.color || ''}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">₹${formatPriceCheckout(item.price * item.quantity)}</div>
        </div>
    `).join('');
}

// Update Order Summary
function updateCheckoutOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = getShippingCost();
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = formatPriceCheckout(subtotal);
    if (shippingEl) shippingEl.textContent = formatPriceCheckout(shipping);
    if (taxEl) taxEl.textContent = formatPriceCheckout(tax);
    if (totalEl) totalEl.textContent = formatPriceCheckout(total);
    
    if (window.updateCartUI) {
        window.updateCartUI();
    }
}

// Get Shipping Cost
function getShippingCost() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (selectedShipping) {
        return selectedShipping.value === 'express' ? 199 : 99;
    }
    return 99;
}

// Set Default Shipping
function setDefaultShipping() {
    const standardShipping = document.querySelector('input[name="shipping"][value="standard"]');
    if (standardShipping) {
        standardShipping.checked = true;
    }
}

// Set Default Payment
function setDefaultPayment() {
    const cardPayment = document.querySelector('input[name="payment"][value="card"]');
    if (cardPayment) {
        cardPayment.checked = true;
    }
}

// Setup Shipping Options
function setupShippingOptions() {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateCheckoutOrderSummary();
            updateCheckoutProgressStep(2);
        });
    });
}

// Setup Payment Options
function setupPaymentOptions() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            toggleCardDetails(this.value === 'card');
            updateCheckoutProgressStep(3);
        });
    });
}

// Toggle Card Details
function toggleCardDetails(show) {
    const cardDetails = document.getElementById('cardDetails');
    if (cardDetails) {
        cardDetails.style.display = show ? 'block' : 'none';
    }
}

// Setup Form Handlers
function setupCheckoutFormHandlers() {
    const formInputs = document.querySelectorAll('#checkoutForm input, #checkoutForm select');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateCheckoutField);
        input.addEventListener('input', clearCheckoutFieldError);
    });
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutFormSubmission);
    }
    
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
}

// Setup Form Validation
function setupCheckoutFormValidation() {
    const validationRules = {
        firstName: { required: true, minLength: 2 },
        lastName: { required: true, minLength: 2 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        phone: { required: true, pattern: /^[0-9]{10}$/ },
        address: { required: true, minLength: 10 },
        city: { required: true, minLength: 2 },
        state: { required: true },
        zipCode: { required: true, pattern: /^[0-9]{6}$/ },
        country: { required: true }
    };
    
    window.checkoutValidationRules = validationRules;
}

// Validate Field
function validateCheckoutField(event) {
    const field = event.target;
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = window.checkoutValidationRules && window.checkoutValidationRules[fieldName];
    
    if (!rules) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    if (rules.required && !value) {
        isValid = false;
        errorMessage = `${getCheckoutFieldLabel(fieldName)} is required`;
    }
    
    if (isValid && rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = `${getCheckoutFieldLabel(fieldName)} must be at least ${rules.minLength} characters`;
    }
    
    if (isValid && rules.pattern && !rules.pattern.test(value)) {
        isValid = false;
        errorMessage = `${getCheckoutFieldLabel(fieldName)} format is invalid`;
    }
    
    if (isValid) {
        clearCheckoutFieldError(event);
    } else {
        showCheckoutFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Get Field Label
function getCheckoutFieldLabel(fieldName) {
    const labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        address: 'Street Address',
        city: 'City',
        state: 'State',
        zipCode: 'ZIP Code',
        country: 'Country',
        cardNumber: 'Card Number',
        expiryDate: 'Expiry Date',
        cvv: 'CVV',
        cardName: 'Name on Card'
    };
    return labels[fieldName] || fieldName;
}

// Show Field Error
function showCheckoutFieldError(field, message) {
    clearCheckoutFieldError({ target: field });
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    if (field.parentNode) {
        field.parentNode.appendChild(errorDiv);
    }
}

// Clear Field Error
function clearCheckoutFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode && field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Setup Payment Handlers
function setupCheckoutPaymentHandlers() {
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
    }
    
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', formatExpiryDate);
    }
    
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', formatCVV);
    }
}

// Format Card Number
function formatCardNumber(event) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    event.target.value = formattedValue;
}

// Format Expiry Date
function formatExpiryDate(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
}

// Format CVV
function formatCVV(event) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = value.substring(0, 3);
}

// Setup Progress Tracking
function setupCheckoutProgressTracking() {
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach((section, index) => {
        const inputs = section.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                updateCheckoutProgressStep(index + 1);
            });
        });
    });
}

// Update Progress Step
function updateCheckoutProgressStep(step) {
    const steps = document.querySelectorAll('.step-number');
    const connectors = document.querySelectorAll('.step-connector');
    
    steps.forEach((stepElement, index) => {
        if (index < step) {
            stepElement.classList.add('completed');
            stepElement.classList.remove('active');
        } else if (index === step - 1) {
            stepElement.classList.add('active');
            stepElement.classList.remove('completed');
        } else {
            stepElement.classList.remove('active', 'completed');
        }
    });
    
    connectors.forEach((connector, index) => {
        if (index < step - 1) {
            connector.classList.add('active');
        } else {
            connector.classList.remove('active');
        }
    });
}

// Handle Form Submission
function handleCheckoutFormSubmission(event) {
    event.preventDefault();
    
    if (validateCheckoutForm()) {
        processCheckoutOrder();
    }
}

// Handle Place Order
function handlePlaceOrder() {
    if (validateCheckoutForm()) {
        processCheckoutOrder();
    }
}

// Validate Form
function validateCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateCheckoutField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Process Order
function processCheckoutOrder() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (!placeOrderBtn) return;
    
    const originalText = placeOrderBtn.innerHTML;
    
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    placeOrderBtn.disabled = true;
    
    setTimeout(() => {
        const totalEl = document.getElementById('total');
        const paymentMethodEl = document.querySelector('input[name="payment"]:checked');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (totalEl) {
            const orderTotal = totalEl.textContent.replace('₹', '').replace(/,/g, '');
            localStorage.setItem('lastOrderTotal', orderTotal);
        }
        
        if (paymentMethodEl) {
            localStorage.setItem('lastPaymentMethod', paymentMethodEl.value);
        }
        
        localStorage.setItem('lastOrderItems', JSON.stringify(cart));
        localStorage.removeItem('cart');
        
        showCheckoutOrderSuccess();
        
        placeOrderBtn.innerHTML = originalText;
        placeOrderBtn.disabled = false;
        
        setTimeout(() => {
            window.location.href = 'order-success.html';
        }, 2000);
    }, 2000);
}

// Show Order Success
function showCheckoutOrderSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'order-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Order Placed Successfully!</h3>
            <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
        </div>
    `;
    
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #00B2FF, #4facfe);
        color: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: successPop 0.5s ease-out;
    `;
    
    document.body.appendChild(successMessage);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successPop {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Format Price for Checkout
function formatPriceCheckout(price) {
    return new Intl.NumberFormat('en-IN').format(price);
}

// Export checkout functions
window.checkoutFunctions = {
    loadCheckoutCartItems,
    updateCheckoutOrderSummary,
    validateCheckoutForm,
    processCheckoutOrder
};

/*
==========================================
CONTACT PAGE FUNCTIONALITY
==========================================
*/

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('contactForm')) {
        setupContactForm();
    }
    if (document.querySelectorAll('.faq-item').length > 0) {
        setupFAQ();
    }
});

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleContactFormSubmission();
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateContactField);
        input.addEventListener('input', clearContactFieldError);
    });
}

// Validate individual field
function validateContactField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    clearContactFieldError(event);
    
    if (field.hasAttribute('required') && !value) {
        showContactFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showContactFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showContactFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

// Show field error
function showContactFieldError(field, message) {
    clearContactFieldError({ target: field });
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.classList.add('error');
    if (field.parentNode) {
        field.parentNode.appendChild(errorDiv);
    }
}

// Clear field error
function clearContactFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const existingError = field.parentNode && field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Handle form submission
function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formData = new FormData(form);
    
    // Validate form
    if (!validateContactForm()) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Create contact message object
        const message = {
            id: generateMessageId(),
            date: new Date().toISOString(),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on',
            status: 'new'
        };
        
        // Save message to localStorage
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(message);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Show success message
        showContactSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Validate entire form
function validateContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateContactField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show success message
function showContactSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
        </div>
    `;
    
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid #FF5E00;
        border-radius: 10px;
        padding: 30px;
        z-index: 3000;
        text-align: center;
        max-width: 400px;
        width: 90%;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Generate message ID
function generateMessageId() {
    return 'MSG' + Date.now().toString(36).toUpperCase();
}

// Setup FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-question i');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
    
    // Add FAQ styles if not already added
    if (!document.getElementById('faq-styles')) {
        const faqStyles = `
            .faq-item {
                border: 1px solid rgba(255, 94, 0, 0.2);
                border-radius: 10px;
                margin-bottom: 15px;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .faq-item.active {
                border-color: #FF5E00;
                box-shadow: 0 0 20px rgba(255, 94, 0, 0.2);
            }
            
            .faq-question {
                padding: 20px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.03);
                transition: all 0.3s ease;
            }
            
            .faq-question:hover {
                background: rgba(255, 94, 0, 0.1);
            }
            
            .faq-question h3 {
                margin: 0;
                color: #ffffff;
                font-size: 1.1rem;
            }
            
            .faq-question i {
                color: #FF5E00;
                transition: transform 0.3s ease;
            }
            
            .faq-answer {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
            }
            
            .faq-answer p {
                padding: 20px;
                margin: 0;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.6;
            }
            
            .field-error {
                color: #ff4444;
                font-size: 0.9rem;
                margin-top: 5px;
            }
            
            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: #ff4444;
                box-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
            }
            
            .success-message {
                animation: fadeIn 0.3s ease;
            }
            
            .success-content i {
                color: #00B2FF;
                font-size: 3rem;
                margin-bottom: 15px;
            }
            
            .success-content h3 {
                color: #FF5E00;
                margin-bottom: 10px;
            }
            
            .success-content p {
                color: rgba(255, 255, 255, 0.8);
                margin: 0;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'faq-styles';
        styleSheet.textContent = faqStyles;
        document.head.appendChild(styleSheet);
    }
}

/*
==========================================
ORDER SUCCESS PAGE FUNCTIONALITY
==========================================
*/

// Order Success Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if on order success page
    if (document.getElementById('orderNumber')) {
        initializeOrderSuccess();
        loadOrderSuccessDetails();
        setupOrderSuccessEventListeners();
        startOrderSuccessAnimation();
    }
});

// Initialize Order Success
function initializeOrderSuccess() {
    setCurrentOrderDate();
    generateOrderNumber();
    loadOrderSuccessSummary();
}

// Set Current Date
function setCurrentOrderDate() {
    const orderDateElement = document.getElementById('orderDate');
    if (orderDateElement) {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        orderDateElement.textContent = formattedDate;
    }
}

// Generate Order Number
function generateOrderNumber() {
    const orderNumberElement = document.getElementById('orderNumber');
    if (orderNumberElement) {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        const orderNumber = `#EST-2024-${randomNum.toString().padStart(3, '0')}`;
        orderNumberElement.textContent = orderNumber;
        localStorage.setItem('lastOrderNumber', orderNumber);
    }
}

// Load Order Details
function loadOrderSuccessDetails() {
    const orderTotal = localStorage.getItem('lastOrderTotal') || '0';
    const paymentMethod = localStorage.getItem('lastPaymentMethod') || 'Credit Card';
    
    const orderTotalElement = document.getElementById('orderTotal');
    if (orderTotalElement) {
        orderTotalElement.textContent = `₹${formatPriceOrderSuccess(parseInt(orderTotal))}`;
    }
    
    const paymentMethodElement = document.getElementById('paymentMethod');
    if (paymentMethodElement) {
        paymentMethodElement.textContent = paymentMethod;
    }
}

// Load Order Summary
function loadOrderSuccessSummary() {
    const orderSummaryContent = document.getElementById('orderSummaryContent');
    if (!orderSummaryContent) return;
    
    const cart = JSON.parse(localStorage.getItem('lastOrderItems')) || [];
    
    if (cart.length === 0) {
        orderSummaryContent.innerHTML = `
            <div class="empty-order">
                <i class="fas fa-shopping-cart"></i>
                <p>No items in this order</p>
            </div>
        `;
        return;
    }
    
    orderSummaryContent.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-options">${item.storage || ''} ${item.color || ''}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">₹${formatPriceOrderSuccess(item.price * item.quantity)}</div>
        </div>
    `).join('');
}

// Setup Event Listeners
function setupOrderSuccessEventListeners() {
    const trackOrderBtn = document.getElementById('trackOrderBtn');
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', handleTrackOrder);
    }
    
    const downloadInvoiceBtn = document.getElementById('downloadInvoiceBtn');
    if (downloadInvoiceBtn) {
        downloadInvoiceBtn.addEventListener('click', handleDownloadInvoice);
    }
}

// Handle Track Order
function handleTrackOrder(event) {
    event.preventDefault();
    
    const orderNumberElement = document.getElementById('orderNumber');
    if (!orderNumberElement) return;
    
    const orderNumber = orderNumberElement.textContent;
    showTrackingModal(orderNumber);
}

// Show Tracking Modal
function showTrackingModal(orderNumber) {
    const modal = document.createElement('div');
    modal.className = 'tracking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Track Your Order</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tracking-info">
                    <div class="tracking-number">
                        <strong>Order Number:</strong> ${orderNumber}
                    </div>
                    <div class="tracking-status">
                        <div class="status-item active">
                            <div class="status-icon">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="status-content">
                                <h4>Order Confirmed</h4>
                                <p>Your order has been confirmed and is being processed</p>
                                <span class="status-time">Just now</span>
                            </div>
                        </div>
                        <div class="status-item">
                            <div class="status-icon">
                                <i class="fas fa-box"></i>
                            </div>
                            <div class="status-content">
                                <h4>Preparing for Shipment</h4>
                                <p>Your order is being prepared for shipment</p>
                                <span class="status-time">Estimated: 2-3 hours</span>
                            </div>
                        </div>
                        <div class="status-item">
                            <div class="status-icon">
                                <i class="fas fa-shipping-fast"></i>
                            </div>
                            <div class="status-content">
                                <h4>Shipped</h4>
                                <p>Your order is on its way</p>
                                <span class="status-time">Estimated: 1-2 days</span>
                            </div>
                        </div>
                        <div class="status-item">
                            <div class="status-icon">
                                <i class="fas fa-home"></i>
                            </div>
                            <div class="status-content">
                                <h4>Delivered</h4>
                                <p>Your order has been delivered</p>
                                <span class="status-time">Estimated: 3-5 days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.closest('.tracking-modal').remove()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: modalFadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
    
    const closeModal = modal.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => modal.remove());
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    addTrackingModalStyles();
}

// Add Tracking Modal Styles
function addTrackingModalStyles() {
    if (document.getElementById('tracking-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'tracking-modal-styles';
    style.textContent = `
        @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .tracking-modal .modal-content {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        
        .tracking-modal .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tracking-modal .modal-header h3 {
            color: #00B2FF;
            font-family: 'Orbitron', monospace;
            font-size: 1.3rem;
            font-weight: 700;
        }
        
        .tracking-modal .close-modal {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 1.5rem;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .tracking-modal .close-modal:hover {
            color: white;
        }
        
        .tracking-modal .status-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0.5;
            transition: opacity 0.3s ease;
        }
        
        .tracking-modal .status-item.active {
            opacity: 1;
        }
        
        .tracking-modal .status-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #00B2FF, #4facfe);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1rem;
            flex-shrink: 0;
        }
    `;
    document.head.appendChild(style);
}

// Handle Download Invoice
function handleDownloadInvoice(event) {
    event.preventDefault();
    
    const orderNumberElement = document.getElementById('orderNumber');
    const orderDateElement = document.getElementById('orderDate');
    const orderTotalElement = document.getElementById('orderTotal');
    
    if (!orderNumberElement || !orderDateElement || !orderTotalElement) return;
    
    const orderNumber = orderNumberElement.textContent;
    const orderDate = orderDateElement.textContent;
    const orderTotal = orderTotalElement.textContent;
    
    createInvoice(orderNumber, orderDate, orderTotal);
}

// Create Invoice
function createInvoice(orderNumber, orderDate, orderTotal) {
    const invoiceContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ${orderNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .invoice-details { margin-bottom: 30px; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                .items-table th { background-color: #f2f2f2; }
                .total { text-align: right; font-weight: bold; font-size: 1.2rem; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>ElectroStore</h1>
                <h2>Invoice</h2>
            </div>
            <div class="invoice-details">
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Total Amount:</strong> ${orderTotal}</p>
            </div>
            <p>Thank you for your purchase!</p>
        </body>
        </html>
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderNumber.replace('#', '')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showOrderSuccessNotification('Invoice downloaded successfully!', 'success');
}

// Start Success Animation
function startOrderSuccessAnimation() {
    const successContent = document.querySelector('.success-content');
    if (successContent) {
        successContent.style.opacity = '0';
        successContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            successContent.style.transition = 'all 0.8s ease-out';
            successContent.style.opacity = '1';
            successContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    const orderSummaryCard = document.querySelector('.order-summary-card');
    if (orderSummaryCard) {
        orderSummaryCard.style.opacity = '0';
        orderSummaryCard.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            orderSummaryCard.style.transition = 'all 0.8s ease-out';
            orderSummaryCard.style.opacity = '1';
            orderSummaryCard.style.transform = 'translateX(0)';
        }, 600);
    }
}

// Format Price for Order Success
function formatPriceOrderSuccess(price) {
    return new Intl.NumberFormat('en-IN').format(price);
}

// Show Notification
function showOrderSuccessNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00FF88, #4facfe)' : 'linear-gradient(135deg, #FF5E00, #FF8C42)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/*
==========================================
PRODUCT PAGE FUNCTIONALITY
==========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    const productDetailContainer = document.getElementById('productDetailContainer');
    if (!productDetailContainer) return;

    let productMainImage = null;
    let qtyInput = null;
    let addToCartBtn = null;
    let buyNowBtn = null;
    let wishlistBtn = null;

    const allProducts = getProductsArray();
    const urlParams = new URLSearchParams(window.location.search);
    const requestedProductId = urlParams.get('id');

    let currentProductData = null;
    if (requestedProductId) {
        currentProductData = allProducts.find(function(item) {
            return String(item.id) === String(requestedProductId);
        });
    }
    if (!currentProductData && allProducts.length > 0) {
        currentProductData = allProducts[0];
    }
    if (!currentProductData) {
        productDetailContainer.innerHTML = `
            <section class="product-error">
                <div class="container">
                    <h2>Product not found</h2>
                    <p>The product you are looking for is unavailable right now.</p>
                    <a href="shop.html" class="btn btn-primary">Browse Products</a>
                </div>
            </section>`;
        return;
    }

    const currencyFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

    function formatCurrency(value) {
        const numericValue = typeof value === 'number' ? value : Number(value) || 0;
        return `₹${currencyFormatter.format(numericValue)}`;
    }

    function buildRatingStarsHTML(rating, totalStars = 5) {
        const safeRating = Math.max(0, Math.min(Number(rating) || 0, totalStars));
        const fullStars = Math.floor(safeRating);
        const hasHalfStar = safeRating - fullStars >= 0.5 && fullStars < totalStars;
        let markup = '';
        for (let i = 0; i < fullStars; i++) markup += '<i class="fas fa-star"></i>';
        if (hasHalfStar) markup += '<i class="fas fa-star-half-alt"></i>';
        const starsRendered = fullStars + (hasHalfStar ? 1 : 0);
        for (let i = starsRendered; i < totalStars; i++) markup += '<i class="far fa-star"></i>';
        return markup;
    }

    function buildRatingStarArray(rating, totalStars = 5) {
        const stars = [];
        const safeRating = Math.max(0, Math.min(Number(rating) || 0, totalStars));
        const fullStars = Math.floor(safeRating);
        const hasHalfStar = safeRating - fullStars >= 0.5 && fullStars < totalStars;
        for (let i = 0; i < fullStars; i++) stars.push('full');
        if (hasHalfStar) stars.push('half');
        while (stars.length < totalStars) stars.push('empty');
        return stars;
    }

    function resolveColorValue(colorName) {
        if (!colorName) return '#FF5E00';
        const key = colorName.trim().toLowerCase();
        const palette = {
            'black': '#1C1C1E',
            'silver': '#C0C0C0',
            'blue': '#007AFF',
            'red': '#FF3B30',
            'white': '#F5F5F5',
            'pink': '#FF2D55',
            'green': '#34C759',
            'gold': '#FFD700',
            'midnight': '#0f172a',
            'starlight': '#f6f0e4',
            'natural titanium': '#8E8E93',
            'blue titanium': '#4C6EF5',
            'white titanium': '#F2F2F7',
            'black titanium': '#1F1F21',
            'space gray': '#3A3A3C',
            'silver stainless steel': '#D4D4D4'
        };
        return palette[key] || '#6C5CE7';
    }

    const fallbackImage = 'https://via.placeholder.com/600x600/1a1a1a/FF5E00?text=No+Image';
    const defaultShippingOptions = [
        { icon: 'fas fa-truck', title: 'Standard Shipping', description: 'Free shipping on orders above ₹5,000', time: '3-5 business days' },
        { icon: 'fas fa-rocket', title: 'Express Shipping', description: '₹299 for orders below ₹5,000', time: '1-2 business days' }
    ];
    const defaultReviews = [
        { name: 'Rajesh Kumar', rating: 5, date: '2 days ago', text: 'Amazing phone! The camera quality is outstanding and the titanium build feels premium. Worth every rupee!' },
        { name: 'Priya Sharma', rating: 5, date: '1 week ago', text: 'Excellent battery life and the ProRAW photos are incredible. The Action Button is very useful.' },
        { name: 'Vikram Singh', rating: 4, date: '1 month ago', text: 'Good phone but the heating issue is still there during heavy usage. Camera quality is excellent though.' },
        { name: 'Sneha Reddy', rating: 5, date: '3 weeks ago', text: 'Love the new titanium design! It is much lighter than previous models. The USB-C port is a welcome change.' }
    ];

    function buildProductTemplateContext(product) {
        const imageSources = Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : (product.image ? [product.image] : [fallbackImage]);

        const hasDiscount = product.originalPrice && product.originalPrice > product.price;

        const specifications = [];
        if (product.specifications && typeof product.specifications === 'object') {
            Object.entries(product.specifications).forEach(([label, value]) => {
                specifications.push({ label, value });
            });
        }

        const storageOptions = Array.isArray(product.sizes) ? product.sizes : [];
        const colors = Array.isArray(product.colors) ? product.colors : [];

        let suggestedPool = allProducts.filter(item => String(item.id) !== String(product.id));
        const sameCategory = suggestedPool.filter(item => item.category && item.category === product.category);
        if (sameCategory.length >= 3) {
            suggestedPool = sameCategory;
        }

        const suggestedProducts = suggestedPool.slice(0, 3).map(item => {
            const productHasDiscount = item.originalPrice && item.originalPrice > item.price;
            return {
                id: item.id,
                title: item.title || item.name || 'Product',
                badge: item.badge || '',
                image: item.image || fallbackImage,
                priceFormatted: formatCurrency(item.price),
                originalPriceFormatted: productHasDiscount ? formatCurrency(item.originalPrice) : '',
                ratingText: Number(item.rating || 0).toFixed(1),
                ratingStars: buildRatingStarArray(item.rating || 0)
            };
        });

        const reviews = defaultReviews.map(review => ({
            name: review.name,
            rating: review.rating,
            ratingStars: buildRatingStarArray(review.rating),
            date: review.date,
            text: review.text
        }));

        return {
            product: {
                id: product.id,
                title: product.title || product.name || 'Product',
                badge: product.badge || '',
                ratingValue: Number(product.rating || 0).toFixed(1),
                ratingStars: buildRatingStarArray(product.rating || 0),
                ratingText: `(${Number(product.rating || 0).toFixed(1)}) ${product.reviewCount || 0} reviews`,
                reviewCount: product.reviewCount || 0,
                priceFormatted: formatCurrency(product.price),
                originalPriceFormatted: hasDiscount ? formatCurrency(product.originalPrice) : '',
                savingsFormatted: hasDiscount ? `Save ${formatCurrency(product.originalPrice - product.price)}` : '',
                description: product.description || product.shortDescription || '',
                features: Array.isArray(product.features) ? product.features : [],
                specifications,
                images: imageSources,
                primaryImage: imageSources[0] || fallbackImage,
                storageOptions,
                colors: colors.map(color => ({ name: color, hex: resolveColorValue(color) })),
                shippingOptions: defaultShippingOptions,
                reviews,
                suggestedProducts
            }
        };
    }

    function renderProduct(product) {
        const templateContext = buildProductTemplateContext(product);

        renderWithLiquid('product-detail', templateContext)
            .then(function(html) {
                productDetailContainer.innerHTML = html;

                productMainImage = document.getElementById('productMainImage');
                qtyInput = document.querySelector('.qty-input');
                addToCartBtn = document.getElementById('addToCartBtn');
                buyNowBtn = document.getElementById('buyNowBtn');
                wishlistBtn = document.getElementById('wishlistBtn');

                document.title = `${product.title} - ELECTRO`;

                initializeProductInteractions();
            })
            .catch(function(err) {
                console.error('Error rendering product detail template:', err);
                productDetailContainer.innerHTML = `
                    <section class="product-error">
                        <div class="container">
                            <h2>Unable to load product</h2>
                            <p>Please refresh the page or try again later.</p>
                            <a href="shop.html" class="btn btn-primary">Back to Shop</a>
                        </div>
                    </section>`;
            });
    }

    renderProduct(currentProductData);

    if (window.history && requestedProductId && currentProductData.id && requestedProductId !== currentProductData.id) {
        const updatedParams = new URLSearchParams(window.location.search);
        updatedParams.set('id', currentProductData.id);
        const newUrl = `${window.location.pathname}?${updatedParams.toString()}`;
        window.history.replaceState({}, document.title, newUrl);
    }

    function bindThumbnailHandlers() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const list = this.parentElement ? this.parentElement.querySelectorAll('.thumbnail') : [];
                list.forEach(node => node.classList.remove('active'));
                this.classList.add('active');
                const largeSrc = this.dataset.large || this.src;
                if (productMainImage) {
                    productMainImage.src = largeSrc;
                }
            });
        });
    }

    function bindOptionHandlers() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const container = this.parentElement;
                if (container) {
                    container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                }
                this.classList.add('active');
            });
        });

        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const container = this.parentElement;
                if (container) {
                    container.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                }
                this.classList.add('active');
            });
        });
    }

    function getSelectedOptions() {
        const storageBtn = document.querySelector('.option-btn.active');
        const colorBtn = document.querySelector('.color-btn.active');
        return {
            storage: storageBtn ? storageBtn.dataset.value : '',
            color: colorBtn ? colorBtn.dataset.color : ''
        };
    }

    function handleAddToCart(action) {
        const quantity = parseInt(qtyInput ? qtyInput.value : '1', 10) || 1;
        const options = getSelectedOptions();
        const cartItem = {
            id: currentProductData.id,
            name: currentProductData.title,
            price: currentProductData.price,
            image: productMainImage ? productMainImage.src : currentProductData.image,
            quantity, 
            category: currentProductData.category,
            selectedStorage: options.storage,
            selectedColor: options.color
        };
        addCartItem(cartItem);
        const cartSlider = document.getElementById('electroCartSlider');
        if (cartSlider) {
            cartSlider.classList.add('active');
        }
        if (typeof showCartNotification === 'function') {
            showCartNotification(`${currentProductData.title} added to cart!`);
        }
        if (action === 'buy-now') {
            window.location.href = 'checkout.html';
        }
    }

    function initializeProductInteractions() {
        bindThumbnailHandlers();
        bindOptionHandlers();

        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');

        if (minusBtn && qtyInput) {
            minusBtn.addEventListener('click', function() {
                const currentValue = parseInt(qtyInput.value, 10);
                if (currentValue > 1) {
                    qtyInput.value = currentValue - 1;
                }
            });
        }

        if (plusBtn && qtyInput) {
            plusBtn.addEventListener('click', function() {
                const currentValue = parseInt(qtyInput.value, 10);
                if (currentValue < 10) {
                    qtyInput.value = currentValue + 1;
                }
            });
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                handleAddToCart('add');
                addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
                addToCartBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                setTimeout(() => {
                    addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                    addToCartBtn.style.background = 'linear-gradient(135deg, #FF5E00, #FF8C00)';
                }, 2000);
            });
        }

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function() {
                handleAddToCart('buy-now');
            });
        }

        if (wishlistBtn) {
            let isWishlisted = false;
            wishlistBtn.addEventListener('click', function() {
                isWishlisted = !isWishlisted;
                if (isWishlisted) {
                    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                    wishlistBtn.style.color = '#FF5E00';
                    wishlistBtn.style.borderColor = '#FF5E00';
                } else {
                    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
                    wishlistBtn.style.color = 'rgba(255, 255, 255, 0.7)';
                    wishlistBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
            });
        }

        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetTab = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) targetPanel.classList.add('active');
            });
        });

        const suggestedActionBtns = document.querySelectorAll('.suggested-action-btn');
        suggestedActionBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const productId = btn.getAttribute('data-product-id');
                const productName = btn.getAttribute('data-product-name') || 'Product';

                if (productId && typeof window.addToCart === 'function') {
                    window.addToCart(productId);
                }

                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Added';
                btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

                const cartSlider = document.getElementById('electroCartSlider');
                if (cartSlider) {
                    cartSlider.classList.add('active');
                }

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 2000);

                if (typeof showCartNotification === 'function') {
                    showCartNotification(`${productName} added to cart!`);
                }
            });
        });

        const writeReviewBtn = document.querySelector('.btn-write-review');
        if (writeReviewBtn) {
            writeReviewBtn.addEventListener('click', function() {
                if (document.querySelector('.review-modal')) return;

                const reviewModal = document.createElement('div');
                reviewModal.className = 'review-modal';
                reviewModal.innerHTML = `
                    <div class="review-modal-content">
                        <div class="review-modal-header">
                            <h3>Write a Review</h3>
                            <button class="close-review-modal">&times;</button>
                        </div>
                        <div class="review-modal-body">
                            <div class="review-form">
                                <div class="form-group">
                                    <label>Your Name</label>
                                    <input type="text" id="reviewerName" placeholder="Enter your name" required>
                                </div>
                                <div class="form-group">
                                    <label>Rating</label>
                                    <div class="rating-input">
                                        <span class="star" data-rating="1">★</span>
                                        <span class="star" data-rating="2">★</span>
                                        <span class="star" data-rating="3">★</span>
                                        <span class="star" data-rating="4">★</span>
                                        <span class="star" data-rating="5">★</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Your Review</label>
                                    <textarea id="reviewText" placeholder="Share your experience with this product..." rows="4" required></textarea>
                                </div>
                                <div class="form-actions">
                                    <button class="btn-cancel-review">Cancel</button>
                                    <button class="btn-submit-review">Submit Review</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                if (!document.getElementById('review-modal-styles')) {
                    const modalStyles = document.createElement('style');
                    modalStyles.id = 'review-modal-styles';
                    modalStyles.textContent = `
                        .review-modal {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.8);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 10000;
                            animation: fadeIn 0.3s ease;
                        }
                        .review-modal-content {
                            background: linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(40, 40, 40, 0.95));
                            border-radius: 20px;
                            padding: 30px;
                            max-width: 500px;
                            width: 90%;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            backdrop-filter: blur(20px);
                            animation: slideInUp 0.3s ease;
                        }
                        .review-modal-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 25px;
                        }
                        .review-modal-header h3 {
                            color: #ffffff;
                            font-size: 1.5rem;
                            font-weight: 700;
                            margin: 0;
                        }
                        .close-review-modal {
                            background: transparent;
                            border: none;
                            color: rgba(255, 255, 255, 0.7);
                            font-size: 1.5rem;
                            cursor: pointer;
                        }
                        .review-form {
                            display: flex;
                            flex-direction: column;
                            gap: 15px;
                        }
                        .review-form .form-group label {
                            color: rgba(255, 255, 255, 0.8);
                            font-weight: 600;
                        }
                        .review-form .form-group input,
                        .review-form .form-group textarea {
                            width: 100%;
                            padding: 12px;
                            border-radius: 12px;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            background: rgba(255, 255, 255, 0.05);
                            color: #ffffff;
                        }
                        .rating-input {
                            display: flex;
                            gap: 5px;
                            font-size: 1.5rem;
                            color: rgba(255, 255, 255, 0.3);
                            cursor: pointer;
                        }
                        .rating-input .star.active,
                        .rating-input .star:hover,
                        .rating-input .star:hover ~ .star {
                            color: #FFD700;
                        }
                        .form-actions {
                            display: flex;
                            justify-content: flex-end;
                            gap: 10px;
                            margin-top: 10px;
                        }
                        .btn-cancel-review,
                        .btn-submit-review {
                            padding: 10px 18px;
                            border-radius: 8px;
                            border: none;
                            cursor: pointer;
                            font-weight: 600;
                        }
                        .btn-cancel-review {
                            background: rgba(255, 255, 255, 0.1);
                            color: rgba(255, 255, 255, 0.7);
                        }
                        .btn-submit-review {
                            background: linear-gradient(135deg, #FF5E00, #FF8C00);
                            color: #ffffff;
                        }
                    `;
                    document.head.appendChild(modalStyles);
                }

                let selectedRating = 0;

                document.body.appendChild(reviewModal);

                const stars = reviewModal.querySelectorAll('.rating-input .star');
                stars.forEach(star => {
                    star.addEventListener('click', function() {
                        selectedRating = parseInt(this.dataset.rating, 10);
                        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.rating, 10) <= selectedRating));
                    });
                });

                function closeModal() {
                    reviewModal.remove();
                }

                reviewModal.querySelector('.close-review-modal').addEventListener('click', closeModal);
                reviewModal.querySelector('.btn-cancel-review').addEventListener('click', closeModal);

                reviewModal.querySelector('.btn-submit-review').addEventListener('click', function() {
                    const nameInput = reviewModal.querySelector('#reviewerName');
                    const reviewInput = reviewModal.querySelector('#reviewText');

                    if (!nameInput.value.trim() || !reviewInput.value.trim() || selectedRating === 0) {
                        alert('Please fill in all fields and select a rating.');
                        return;
                    }

                    const reviewsContainer = document.querySelector('#reviews .tab-panel');
                    if (reviewsContainer) {
                        const newReview = document.createElement('div');
                        newReview.className = 'review-item';
                        newReview.innerHTML = `
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <h4>${nameInput.value.trim()}</h4>
                                    <div class="review-rating">
                                        ${buildRatingStarsHTML(selectedRating)}
                                    </div>
                                </div>
                                <span class="review-date">Just now</span>
                            </div>
                            <p>${reviewInput.value.trim()}</p>
                        `;
                        reviewsContainer.appendChild(newReview);
                    }

                    closeModal();
                    if (typeof showCartNotification === 'function') {
                        showCartNotification('Thank you for submitting your review!');
                    }
                });
            });
        }
    }

});

/*
==========================================
SHOP PAGE FUNCTIONALITY
==========================================
*/

function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF5E00, #FF8C00);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(255, 94, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        font-size: 14px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

window.showCartNotification = showCartNotification;

document.addEventListener('DOMContentLoaded', function() {
    if (!document.body.classList.contains('shop-page')) return;

    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    let allProducts = getProductsArray();
    let filteredProducts = [...allProducts];
    let currentPage = 1;
    const productsPerPage = 6;

    function loadProducts() {
        const productsCount = document.getElementById('productsCount');
        const totalProductsToShow = currentPage * productsPerPage;
        const productsToShow = filteredProducts.slice(0, totalProductsToShow).map(normalizeProductForTemplate);

        return renderWithLiquid('shop-products', { products: productsToShow })
            .then(function(html) {
                if (html && html.trim().length > 0) {
                    productsGrid.innerHTML = html;
                } else {
                    productsGrid.innerHTML = productsToShow.map(buildShopProductFallback).join('');
                }
                bindShopCardEvents();
                updateShopMeta(productsCount, totalProductsToShow);
            })
            .catch(function(err) {
                console.error('Error rendering shop products:', err);
                productsGrid.innerHTML = productsToShow.map(buildShopProductFallback).join('');
                bindShopCardEvents();
                updateShopMeta(productsCount, totalProductsToShow);
            });
    }

    function buildShopProductFallback(product) {
        const badgeMarkup = product.badge ? `<div class="shop-product-badge">${product.badge}</div>` : '';
        const stars = '★'.repeat(Math.floor(product.rating || 0)) + '☆'.repeat(5 - Math.floor(product.rating || 0));
        return `
            <div class="shop-product-card" data-product-id="${product.id}">
                <div class="shop-product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300/1a1a1a/FF5E00?text=No+Image'">
                    ${badgeMarkup}
                </div>
                <div class="shop-product-info">
                    <h3 class="shop-product-title">${product.name}</h3>
                    <div class="shop-product-price-rating">
                        <div class="shop-product-price">₹${Number(product.price || 0).toFixed(2)}</div>
                        <div class="shop-product-rating">
                            <div class="stars">${stars}</div>
                            <span class="rating-count">(${product.reviews || 0})</span>
                        </div>
                    </div>
                    <div class="shop-product-actions">
                        <button class="shop-btn-add-cart" data-add-cart-id="${product.id}" data-product-name="${product.name}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <a href="product.html?id=${product.id}" class="shop-btn-buy-now" data-buy-now-id="${product.id}">
                            <i class="fas fa-bolt"></i> Buy Now
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    function bindShopCardEvents() {
        const cards = productsGrid.querySelectorAll('.shop-product-card');
        cards.forEach(function(card) {
            const productId = card.getAttribute('data-product-id');
            card.addEventListener('click', function(event) {
                if (event.target.closest('.shop-product-actions')) {
                    return;
                }
                window.location.href = `product.html?id=${productId}`;
            });
        });

        const addCartButtons = productsGrid.querySelectorAll('[data-add-cart-id]');
        addCartButtons.forEach(function(btn) {
            btn.addEventListener('click', function(event) {
                event.stopPropagation();
                const productId = parseInt(btn.getAttribute('data-add-cart-id'), 10);
                if (typeof window.addToCart === 'function') {
                    window.addToCart(productId);
                }
                const productName = btn.getAttribute('data-product-name') || 'Product';
                showCartNotification(`${productName} added to cart!`);
            });
        });
    }

    function updateShopMeta(productsCountEl, totalProductsToShow) {
        if (productsCountEl) {
            productsCountEl.textContent = `${filteredProducts.length} products found`;
        }

        const loadMoreBtn = document.querySelector('.shop-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = totalProductsToShow >= filteredProducts.length ? 'none' : 'block';
        }
    }

    function applyFilters() {
        const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(filter => filter.value);
        const priceRangeInput = document.getElementById('priceRange');
        const maxPrice = priceRangeInput ? parseInt(priceRangeInput.value, 10) : Infinity;
        const selectedRatings = Array.from(document.querySelectorAll('.rating-filter:checked'))
            .map(filter => parseInt(filter.value, 10));

        filteredProducts = allProducts.filter(product => {
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
                return false;
            }

            if (product.price > maxPrice) {
                return false;
            }

            if (selectedRatings.length > 0) {
                const productRating = Math.floor(product.rating || 0);
                if (!selectedRatings.some(rating => productRating >= rating)) {
                    return false;
                }
            }

            return true;
        });

        currentPage = 1;
        loadProducts();
    }

    function clearFilters() {
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.checked = false;
        });

        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = priceRange.max || priceRange.value;
        }

        document.querySelectorAll('.rating-filter').forEach(filter => {
            filter.checked = false;
        });

        filteredProducts = [...allProducts];
        currentPage = 1;
        loadProducts();
    }

    function setupFilters() {
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        const priceRange = document.getElementById('priceRange');
        const maxPrice = document.getElementById('maxPrice');
        if (priceRange) {
            priceRange.addEventListener('input', function() {
                const maxValue = parseInt(this.value, 10);
                if (maxPrice) {
                    maxPrice.textContent = `$${maxValue}`;
                }
                applyFilters();
            });
        }

        document.querySelectorAll('.rating-filter').forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
    }

    function setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                sortProducts(this.value);
                currentPage = 1;
                loadProducts();
            });
        }
    }

    function sortProducts(sortBy) {
        switch (sortBy) {
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }
    }

    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();

                if (query === '') {
                    filteredProducts = [...allProducts];
                } else {
                    filteredProducts = allProducts.filter(product =>
                        (product.name || '').toLowerCase().includes(query) ||
                        (product.description || '').toLowerCase().includes(query) ||
                        (product.category || '').toLowerCase().includes(query)
                    );
                }

                currentPage = 1;
                loadProducts();
            });
        }
    }

    function loadMoreProducts() {
        currentPage++;
        loadProducts();
    }

    function initializeShopPage() {
        allProducts = getProductsArray();
        filteredProducts = [...allProducts];
        currentPage = 1;

        loadProducts();
        setupFilters();
        setupSorting();
        setupSearch();
    }

    initializeShopPage();

    window.clearFilters = clearFilters;
    window.loadMoreProducts = loadMoreProducts;
});

/*
==========================================
WISHLIST PAGE FUNCTIONALITY
==========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyWishlist = document.getElementById('emptyWishlist');
    const wishlistSummary = document.getElementById('wishlistSummary');
    if (!wishlistGrid || !emptyWishlist || !wishlistSummary) return;

    if (!document.getElementById('wishlist-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'wishlist-notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.8); }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    initializeWishlist();
    setupEventListeners();
    loadWishlistItems();
    updateWishlistStats();

    function initializeWishlist() {
        if (!localStorage.getItem('wishlist')) {
            localStorage.setItem('wishlist', JSON.stringify([]));
        }
        if (!localStorage.getItem('cart')) {
            localStorage.setItem('cart', JSON.stringify([]));
        }
    }

    function setupEventListeners() {
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', sortWishlist);
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterByCategory);
        }

        const priceFilter = document.getElementById('priceFilter');
        if (priceFilter) {
            priceFilter.addEventListener('change', filterByPrice);
        }
    }

    function loadWishlistItems() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        if (wishlist.length === 0) {
            wishlistGrid.style.display = 'none';
            emptyWishlist.style.display = 'block';
            wishlistSummary.style.display = 'none';
            updateWishlistCount(0);
            return;
        }

        emptyWishlist.style.display = 'none';
        wishlistGrid.style.display = 'grid';
        wishlistSummary.style.display = 'block';

        renderWishlistItems(wishlist).then(function() {
            updateWishlistCount(wishlist.length);
            updateWishlistStats();
        });
    }

    function renderWishlistItems(items) {
        return renderWithLiquid('wishlist-items', { items: items })
            .then(function(html) {
                if (html && html.trim().length > 0) {
                    wishlistGrid.innerHTML = html;
                } else {
                    wishlistGrid.innerHTML = items.map(buildWishlistItemFallback).join('');
                }
                bindWishlistEvents();
            })
            .catch(function(err) {
                console.error('Error rendering wishlist items:', err);
                wishlistGrid.innerHTML = items.map(buildWishlistItemFallback).join('');
                bindWishlistEvents();
            });
    }

    function buildWishlistItemFallback(item) {
        const stars = '<i class="fas fa-star"></i>'.repeat(Math.floor(item.rating || 0)) + '<i class="far fa-star"></i>'.repeat(5 - Math.floor(item.rating || 0));
        return `
            <div class="wishlist-item" data-product-id="${item.id}">
                <div class="wishlist-item-header">
                    <div class="wishlist-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <button class="wishlist-item-remove" data-wishlist-remove-id="${item.id}" title="Remove from wishlist">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="wishlist-item-content">
                    <h3>${item.name}</h3>
                    <div class="wishlist-item-category">${item.category || ''}</div>
                    <div class="wishlist-item-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-text">(${item.rating || 0})</span>
                    </div>
                    <div class="wishlist-item-price">₹${Number(item.price || 0).toLocaleString()}</div>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-item-btn secondary" data-wishlist-view-id="${item.id}">
                            <i class="fas fa-eye"></i>
                            <span>View</span>
                        </button>
                        <button class="wishlist-item-btn primary" data-wishlist-add-cart-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function bindWishlistEvents() {
        wishlistGrid.querySelectorAll('[data-wishlist-remove-id]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const productId = parseInt(btn.getAttribute('data-wishlist-remove-id'), 10);
                removeFromWishlist(productId);
            });
        });

        wishlistGrid.querySelectorAll('[data-wishlist-add-cart-id]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const productId = parseInt(btn.getAttribute('data-wishlist-add-cart-id'), 10);
                addToCartFromWishlist(productId);
            });
        });

        wishlistGrid.querySelectorAll('[data-wishlist-view-id]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const productId = parseInt(btn.getAttribute('data-wishlist-view-id'), 10);
                viewProduct(productId);
            });
        });
    }

    function sortWishlist() {
        const sortBy = document.getElementById('sortFilter').value;
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        let sortedWishlist = [...wishlist];

        switch (sortBy) {
            case 'name':
                sortedWishlist.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'price-low':
                sortedWishlist.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high':
                sortedWishlist.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'rating':
                sortedWishlist.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'date':
            default:
                break;
        }

        localStorage.setItem('wishlist', JSON.stringify(sortedWishlist));
        renderWishlistItems(sortedWishlist).then(updateWishlistStats);
    }

    function filterByCategory() {
        const category = document.getElementById('categoryFilter').value;
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        if (category === 'all') {
            renderWishlistItems(wishlist).then(updateWishlistStats);
            return;
        }

        const filteredWishlist = wishlist.filter(item =>
            (item.category || '').toLowerCase() === category.toLowerCase()
        );

        renderWishlistItems(filteredWishlist).then(updateWishlistStats);
    }

    function filterByPrice() {
        const priceRange = document.getElementById('priceFilter').value;
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        if (priceRange === 'all') {
            renderWishlistItems(wishlist).then(updateWishlistStats);
            return;
        }

        let filteredWishlist = [];

        switch (priceRange) {
            case '0-10000':
                filteredWishlist = wishlist.filter(item => (item.price || 0) < 10000);
                break;
            case '10000-25000':
                filteredWishlist = wishlist.filter(item => (item.price || 0) >= 10000 && (item.price || 0) <= 25000);
                break;
            case '25000-50000':
                filteredWishlist = wishlist.filter(item => (item.price || 0) >= 25000 && (item.price || 0) <= 50000);
                break;
            case '50000+':
                filteredWishlist = wishlist.filter(item => (item.price || 0) > 50000);
                break;
        }

        renderWishlistItems(filteredWishlist).then(updateWishlistStats);
    }

    function removeFromWishlist(productId) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const updatedWishlist = wishlist.filter(item => item.id !== productId);

        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));

        renderWishlistItems(updatedWishlist).then(function() {
            updateWishlistCount(updatedWishlist.length);
            updateWishlistStats();
            wishlistNotification('Item removed from wishlist', 'success');
        });
    }

    function addToCartFromWishlist(productId) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const item = wishlist.find(entry => String(entry.id) === String(productId));
        if (!item) return;

        addCartItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            category: item.category || '',
            selectedStorage: item.selectedStorage || '',
            selectedColor: item.selectedColor || ''
        });

        wishlistNotification('Item added to cart!', 'success');
    }

    function addAllToCart() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        if (wishlist.length === 0) {
            wishlistNotification('Wishlist is empty!', 'error');
            return;
        }

        wishlist.forEach(wishlistItem => {
            addCartItem({
                id: wishlistItem.id,
                name: wishlistItem.name,
                price: wishlistItem.price,
                image: wishlistItem.image,
                quantity: 1,
                category: wishlistItem.category || '',
                selectedStorage: wishlistItem.selectedStorage || '',
                selectedColor: wishlistItem.selectedColor || ''
            });
        });

        wishlistNotification(`${wishlist.length} items added to cart!`, 'success');
    }

    function clearAllWishlist() {
        if (confirm('Are you sure you want to clear all items from your wishlist?')) {
            localStorage.setItem('wishlist', JSON.stringify([]));
            loadWishlistItems();
            updateWishlistStats();
            wishlistNotification('Wishlist cleared!', 'success');
        }
    }

    function updateWishlistCount(count) {
        const wishlistCount = document.getElementById('wishlistCount');
        const wishlistCountText = document.getElementById('wishlistCountText');

        if (wishlistCount) {
            wishlistCount.textContent = count;
        }

        if (wishlistCountText) {
            wishlistCountText.textContent = `${count} item${count !== 1 ? 's' : ''} in your wishlist`;
        }
    }

    function updateWishlistStats() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        if (wishlist.length === 0) {
            document.getElementById('totalWishlistItems').textContent = '0';
            document.getElementById('totalWishlistValue').textContent = '₹0';
            document.getElementById('avgRating').textContent = '0.0';
            document.getElementById('summaryItemCount').textContent = '0';
            document.getElementById('summaryTotalValue').textContent = '₹0';
            document.getElementById('summaryAvgRating').textContent = '0.0';
            return;
        }

        const totalValue = wishlist.reduce((sum, item) => sum + (item.price || 0), 0);
        const avgRating = wishlist.reduce((sum, item) => sum + (item.rating || 0), 0) / wishlist.length;

        document.getElementById('totalWishlistItems').textContent = wishlist.length;
        document.getElementById('totalWishlistValue').textContent = `₹${totalValue.toLocaleString()}`;
        document.getElementById('avgRating').textContent = avgRating.toFixed(1);
        document.getElementById('summaryItemCount').textContent = wishlist.length;
        document.getElementById('summaryTotalValue').textContent = `₹${totalValue.toLocaleString()}`;
        document.getElementById('summaryAvgRating').textContent = avgRating.toFixed(1);
    }

    function viewProduct(productId) {
        window.location.href = `product.html?id=${productId}`;
    }

    function wishlistNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    window.removeFromWishlist = removeFromWishlist;
    window.addToCartFromWishlist = addToCartFromWishlist;
    window.addAllToCart = addAllToCart;
    window.clearAllWishlist = clearAllWishlist;
    window.sortWishlist = sortWishlist;
    window.filterByCategory = filterByCategory;
    window.filterByPrice = filterByPrice;
    window.viewProduct = viewProduct;
});

/*
==========================================
MODERN CATEGORY PAGE FUNCTIONALITY
==========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    const categoryContent = document.querySelector('.modern-category-content');
    if (!categoryContent) return;

    let currentPage = 1;
    let productsPerPage = 12;
    let allProducts = [];
    let filteredProducts = [];
    let isLoading = false;

    const sampleProducts = [
        { id: 1, name: 'iPhone 15 Pro Max', price: 129999, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', rating: 4.8, brand: 'Apple', features: ['wireless', 'bluetooth', 'fast-charging'], category: 'smartphones' },
        { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 124999, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', rating: 4.7, brand: 'Samsung', features: ['wireless', 'bluetooth', 'waterproof'], category: 'smartphones' },
        { id: 3, name: 'MacBook Pro M3', price: 199999, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', rating: 4.9, brand: 'Apple', features: ['wireless', 'bluetooth'], category: 'laptops' },
        { id: 4, name: 'Dell XPS 15', price: 149999, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', rating: 4.6, brand: 'Dell', features: ['wireless', 'bluetooth'], category: 'laptops' },
        { id: 5, name: 'Sony WH-1000XM5', price: 29999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', rating: 4.8, brand: 'Sony', features: ['wireless', 'bluetooth', 'noise-cancelling'], category: 'audio' },
        { id: 6, name: 'AirPods Pro 2', price: 24999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', rating: 4.7, brand: 'Apple', features: ['wireless', 'bluetooth', 'noise-cancelling'], category: 'audio' },
        { id: 7, name: 'PlayStation 5', price: 49999, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop', rating: 4.9, brand: 'Sony', features: ['wireless', 'bluetooth'], category: 'gaming' },
        { id: 8, name: 'Xbox Series X', price: 44999, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop', rating: 4.8, brand: 'Microsoft', features: ['wireless', 'bluetooth'], category: 'gaming' },
        { id: 9, name: 'Apple Watch Series 9', price: 39999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', rating: 4.6, brand: 'Apple', features: ['wireless', 'bluetooth', 'waterproof'], category: 'wearables' },
        { id: 10, name: 'Samsung Galaxy Watch 6', price: 29999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', rating: 4.5, brand: 'Samsung', features: ['wireless', 'bluetooth', 'waterproof'], category: 'wearables' },
        { id: 11, name: 'Magic Keyboard', price: 12999, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop', rating: 4.4, brand: 'Apple', features: ['wireless', 'bluetooth'], category: 'accessories' },
        { id: 12, name: 'Logitech MX Master 3', price: 8999, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop', rating: 4.7, brand: 'Logitech', features: ['wireless', 'bluetooth'], category: 'accessories' }
    ];

    function initializeCategoryPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('cat') || 'smartphones';

        updateCategoryInfo(category);

        allProducts = sampleProducts.filter(product => product.category === category);
        filteredProducts = [...allProducts];

        updateHeroStats();
    }

    function updateCategoryInfo(category) {
        const categoryNames = {
            smartphones: 'Smartphones',
            laptops: 'Laptops',
            audio: 'Audio Devices',
            gaming: 'Gaming',
            wearables: 'Wearables',
            accessories: 'Accessories'
        };

        const categoryDescriptions = {
            smartphones: 'Latest smartphones with cutting-edge technology',
            laptops: 'High-performance laptops for work and play',
            audio: 'Premium audio devices for music lovers',
            gaming: 'Ultimate gaming gear for gamers',
            wearables: 'Smart watches and fitness trackers',
            accessories: 'Essential tech accessories'
        };

        const titleEl = document.getElementById('categoryTitle');
        const descEl = document.getElementById('categoryDescription');
        if (titleEl) titleEl.textContent = categoryNames[category] || 'Category';
        if (descEl) descEl.textContent = categoryDescriptions[category] || 'Discover amazing products';
    }

    function updateHeroStats() {
        const productCount = allProducts.length;
        const avgRating = allProducts.length > 0
            ? (allProducts.reduce((sum, product) => sum + product.rating, 0) / allProducts.length).toFixed(1)
            : 0;
        const prices = allProducts.map(product => product.price);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

        const productCountEl = document.getElementById('productCount');
        const avgRatingEl = document.getElementById('avgRating');
        const priceRangeEl = document.getElementById('priceRange');
        if (productCountEl) productCountEl.textContent = productCount;
        if (avgRatingEl) avgRatingEl.textContent = avgRating;
        if (priceRangeEl) priceRangeEl.textContent = `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`;
    }

    function displayProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        if (currentPage === 1) {
            productsGrid.innerHTML = '';
        }

        const totalProductsToShow = currentPage * productsPerPage;
        const productsToShow = filteredProducts.slice(0, totalProductsToShow);

        const displayedIds = Array.from(document.querySelectorAll('.modern-product-card'))
            .map(card => parseInt(card.getAttribute('data-product-id'), 10));

        const newProducts = productsToShow.filter(product => !displayedIds.includes(product.id));

        newProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });

        updateProductsCount();
        updateLoadMoreButton();
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'modern-product-card';
        card.setAttribute('data-product-id', product.id);
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-badge">New</div>
                <div class="product-actions">
                    <button class="wishlist-btn" data-wishlist-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="quick-view-btn" data-quickview-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-content">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <div class="product-features">
                    ${product.features.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="product-price">
                    <span class="current-price">₹${product.price.toLocaleString()}</span>
                    <span class="original-price">₹${(product.price * 1.2).toLocaleString()}</span>
                </div>
                <button class="add-to-cart-btn" data-addcart-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Add to Cart</span>
                </button>
            </div>
        `;

        card.querySelector('[data-wishlist-id]').addEventListener('click', function(event) {
            event.stopPropagation();
            const productId = parseInt(this.getAttribute('data-wishlist-id'), 10);
            toggleWishlist(productId);
        });

        card.querySelector('[data-quickview-id]').addEventListener('click', function(event) {
            event.stopPropagation();
            const productId = parseInt(this.getAttribute('data-quickview-id'), 10);
            quickView(productId);
        });

        card.querySelector('[data-addcart-id]').addEventListener('click', function(event) {
            event.stopPropagation();
            const productId = this.getAttribute('data-addcart-id');
            if (typeof window.addToCart === 'function') {
                window.addToCart(productId);
            }
            if (typeof window.showCartNotification === 'function') {
                const productName = product.name || product.title || 'Product';
                window.showCartNotification(`${productName} added to cart!`);
            }
        });

        return card;
    }

    function generateStars(rating) {
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
    }

    function loadMoreProducts() {
        if (isLoading) return;

        const totalProducts = filteredProducts.length;
        const currentProducts = document.querySelectorAll('.modern-product-card').length;

        if (currentProducts >= totalProducts) {
            hideLoadMoreButton();
            return;
        }

        showLoadingSpinner();
        isLoading = true;

        setTimeout(() => {
            currentPage++;
            displayProducts();
            hideLoadingSpinner();
            isLoading = false;
        }, 1000);
    }

    function showLoadingSpinner() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
    }

    function hideLoadingSpinner() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (loadMoreBtn) loadMoreBtn.style.display = 'flex';
    }

    function hideLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }

    function updateProductsCount() {
        const productsCount = document.getElementById('productsCount');
        if (!productsCount) return;
        const currentProducts = document.querySelectorAll('.modern-product-card').length;
        const totalProducts = filteredProducts.length;
        productsCount.textContent = `${currentProducts} of ${totalProducts} products`;
    }

    function updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        const currentProducts = document.querySelectorAll('.modern-product-card').length;
        const totalProducts = filteredProducts.length;

        if (currentProducts >= totalProducts) {
            hideLoadMoreButton();
        } else {
            const remainingProducts = totalProducts - currentProducts;
            loadMoreBtn.style.display = 'flex';
            const buttonText = loadMoreBtn.querySelector('span');
            if (buttonText) {
                buttonText.textContent = `Load More Products (${remainingProducts} remaining)`;
            }
        }
    }

    function applyFilters() {
        const priceRange = document.getElementById('priceRange');
        const maxPrice = priceRange ? parseInt(priceRange.value, 10) : Infinity;
        const selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(cb => cb.value);
        const selectedRatings = Array.from(document.querySelectorAll('.rating-filter:checked')).map(cb => parseInt(cb.value, 10));
        const selectedFeatures = Array.from(document.querySelectorAll('.feature-filter:checked')).map(cb => cb.value);

        filteredProducts = allProducts.filter(product => {
            if (product.price > maxPrice) return false;
            if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand.toLowerCase())) return false;
            if (selectedRatings.length > 0 && !selectedRatings.some(rating => product.rating >= rating)) return false;
            if (selectedFeatures.length > 0 && !selectedFeatures.some(feature => product.features.includes(feature))) return false;
            return true;
        });

        currentPage = 1;
        displayProducts();
    }

    function applySorting() {
        const sortSelect = document.getElementById('sortSelect');
        const sortBy = sortSelect ? sortSelect.value : 'name';

        switch (sortBy) {
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }

        currentPage = 1;
        displayProducts();
    }

    function clearFilters() {
        const priceRange = document.getElementById('priceRange');
        const maxPrice = document.getElementById('maxPrice');
        if (priceRange && priceRange.max) {
            priceRange.value = priceRange.max;
        }
        if (maxPrice) {
            maxPrice.textContent = '₹3,00,000';
        }

        document.querySelectorAll('.brand-filter, .rating-filter, .feature-filter').forEach(cb => {
            cb.checked = false;
        });

        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.value = 'name';

        filteredProducts = [...allProducts];
        currentPage = 1;
        displayProducts();
    }

    function toggleWishlist(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            console.log('Added to wishlist:', product.name);
        }
    }

    function quickView(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            console.log('Quick view:', product.name);
        }
    }

    function scrollToProducts() {
        const content = document.querySelector('.modern-category-content');
        if (content) {
            content.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function toggleFilters() {
        const sidebar = document.querySelector('.modern-filters-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    function handleResize() {
        if (window.innerWidth <= 768) {
            productsPerPage = 8;
        } else {
            productsPerPage = 12;
        }
    }

    function setupEventListeners() {
        const priceSlider = document.getElementById('priceRange');
        if (priceSlider) {
            priceSlider.addEventListener('input', function() {
                const maxPriceEl = document.getElementById('maxPrice');
                const value = parseInt(this.value, 10);
                if (maxPriceEl) {
                    maxPriceEl.textContent = `₹${value.toLocaleString()}`;
                }
                applyFilters();
            });
        }

        document.querySelectorAll('.brand-filter').forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        document.querySelectorAll('.rating-filter').forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        document.querySelectorAll('.feature-filter').forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', applySorting);
        }
    }

    function loadInitialProducts() {
        currentPage = 1;
        displayProducts();
    }

    function initialize() {
        initializeCategoryPage();
        loadInitialProducts();
        setupEventListeners();
        handleResize();
        window.addEventListener('resize', handleResize);
    }

    initialize();

    window.loadMoreProducts = loadMoreProducts;
    window.clearFilters = clearFilters;
    window.toggleWishlist = toggleWishlist;
    window.quickView = quickView;
    window.scrollToProducts = scrollToProducts;
    window.toggleFilters = toggleFilters;
});

/*
==========================================
ACCOUNT DASHBOARD FUNCTIONALITY
==========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    const accountSection = document.querySelector('.user-dashboard-section');
    if (!accountSection) return;

    if (!document.getElementById('account-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'account-notification-styles';
        style.textContent = `
            @keyframes accountSlideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes accountSlideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes accountFadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    checkAccountLoginStatus();
    initializeAccountPage();
    setupAccountEventListeners();
    loadAccountUserData();

    window.handleLogout = handleLogout;

    function checkAccountLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'login.html';
        }
    }

    function initializeAccountPage() {
        const hash = window.location.hash;
        if (hash) {
            showAccountTab(hash.substring(1));
        } else {
            showAccountTab('overview');
        }
    }

    function setupAccountEventListeners() {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                if (tabId) {
                    showAccountTab(tabId);
                    updateAccountActiveTab(this);
                }
            });
        });

        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterAccountOrders(filter);
                updateAccountActiveFilter(this);
            });
        });

        const profileForm = document.querySelector('.profile-form-modern');
        if (profileForm) {
            profileForm.addEventListener('submit', handleProfileUpdate);
        }
    }

    function loadAccountUserData() {
        const userName = localStorage.getItem('userName') || 'John Doe';
        const userEmail = localStorage.getItem('userEmail') || 'john.doe@email.com';

        const userInfo = document.querySelector('.user-info h3');
        const userEmailEl = document.querySelector('.user-info p');
        if (userInfo) userInfo.textContent = userName;
        if (userEmailEl) userEmailEl.textContent = userEmail;

        const heroTitle = document.querySelector('.account-hero-text h1');
        if (heroTitle) {
            heroTitle.textContent = `Welcome Back, ${userName.split(' ')[0]}!`;
        }

        loadAccountDashboardData();
        loadAccountOrdersData();
        loadAccountWishlistData();
        loadAccountAddressesData();
        bindAccountWishlistActions();
        bindAccountAddressActions();
    }

    function loadAccountDashboardData() {
        const stats = { orders: 5, wishlist: 12, rating: 4.8 };
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers[0]) statNumbers[0].textContent = stats.orders;
        if (statNumbers[1]) statNumbers[1].textContent = stats.wishlist;
        if (statNumbers[2]) statNumbers[2].textContent = stats.rating;
    }

    function loadAccountOrdersData() {
        const ordersData = [
            {
                id: 'ORD-001',
                date: 'Dec 15, 2024',
                status: 'delivered',
                total: '₹45,999',
                items: [
                    {
                        name: 'iPhone 15 Pro Max',
                        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=80&h=80&fit=crop',
                        price: '₹45,999',
                        quantity: 1
                    }
                ]
            },
            {
                id: 'ORD-002',
                date: 'Dec 10, 2024',
                status: 'shipped',
                total: '₹29,999',
                items: [
                    {
                        name: 'Samsung Galaxy S24 Ultra',
                        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop',
                        price: '₹29,999',
                        quantity: 1
                    }
                ]
            }
        ];

        updateAccountOrdersList(ordersData);
    }

    function updateAccountOrdersList(orders) {
        const ordersList = document.querySelector('.orders-list');
        if (!ordersList) return;
        ordersList.innerHTML = '';
        orders.forEach(order => {
            const orderCard = createAccountOrderCard(order);
            ordersList.appendChild(orderCard);
        });
    }

    function createAccountOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">#${order.id}</div>
                    <div class="order-date">Placed on ${order.date}</div>
                </div>
                <div class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>Quantity: ${item.quantity}</p>
                        </div>
                        <div class="item-price">${item.price}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-total">Total: ${order.total}</div>
                <div class="order-actions">
                    <button class="btn-secondary">View Details</button>
                    <button class="btn-primary">Reorder</button>
                </div>
            </div>
        `;
        return card;
    }

    function loadAccountWishlistData() {
        const wishlistData = [
            {
                id: 1,
                name: 'iPhone 15 Pro Max',
                price: '₹45,999',
                image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop'
            },
            {
                id: 2,
                name: 'MacBook Pro M3',
                price: '₹199,999',
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop'
            },
            {
                id: 3,
                name: 'Sony WH-1000XM5',
                price: '₹29,999',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'
            }
        ];

        updateAccountWishlistGrid(wishlistData);
    }

    function updateAccountWishlistGrid(items) {
        const wishlistGrid = document.querySelector('.wishlist-grid');
        if (!wishlistGrid) return;
        wishlistGrid.innerHTML = '';
        items.forEach(item => {
            const wishlistItem = createAccountWishlistItem(item);
            wishlistGrid.appendChild(wishlistItem);
        });
    }

    function createAccountWishlistItem(item) {
        const itemEl = document.createElement('div');
        itemEl.className = 'wishlist-item';
        itemEl.setAttribute('data-item-id', item.id);
        itemEl.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
                <button class="remove-btn account-remove-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">${item.price}</p>
                <button class="add-to-cart-btn account-add-cart-btn">Add to Cart</button>
            </div>
        `;
        return itemEl;
    }

    function bindAccountWishlistActions() {
        document.querySelectorAll('.account-remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const wishlistItem = this.closest('.wishlist-item');
                if (wishlistItem) {
                    accountRemoveFromWishlist(wishlistItem);
                }
            });
        });

        document.querySelectorAll('.account-add-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const wishlistItem = this.closest('.wishlist-item');
                if (wishlistItem) {
                    accountAddToCartFromWishlist(wishlistItem);
                }
            });
        });
    }

    function loadAccountAddressesData() {
        const addressesData = [
            {
                id: 1,
                title: 'Home Address',
                address: '123 Tech Street, Mumbai, Maharashtra 400001',
                phone: '+91 98765 43210'
            },
            {
                id: 2,
                title: 'Office Address',
                address: '456 Business Park, Mumbai, Maharashtra 400002',
                phone: '+91 98765 43211'
            }
        ];

        updateAccountAddressesGrid(addressesData);
    }

    function updateAccountAddressesGrid(addresses) {
        const addressesGrid = document.querySelector('.addresses-grid');
        if (!addressesGrid) return;
        addressesGrid.innerHTML = '';
        addresses.forEach(address => {
            const addressCard = createAccountAddressCard(address);
            addressesGrid.appendChild(addressCard);
        });
    }

    function createAccountAddressCard(address) {
        const card = document.createElement('div');
        card.className = 'address-card';
        card.setAttribute('data-address-id', address.id);
        card.innerHTML = `
            <div class="address-header">
                <h4>${address.title}</h4>
                <div class="address-actions">
                    <button class="edit-btn account-edit-address-btn">Edit</button>
                    <button class="delete-btn account-delete-address-btn">Delete</button>
                </div>
            </div>
            <div class="address-content">
                <p>${address.address}</p>
                <p>Phone: ${address.phone}</p>
            </div>
        `;
        return card;
    }

    function bindAccountAddressActions() {
        document.querySelectorAll('.account-edit-address-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const addressCard = this.closest('.address-card');
                if (addressCard) {
                    accountEditAddress(addressCard);
                }
            });
        });

        document.querySelectorAll('.account-delete-address-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const addressCard = this.closest('.address-card');
                if (addressCard) {
                    accountDeleteAddress(addressCard);
                }
            });
        });
    }

    function showAccountTab(tabId) {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.remove('active'));
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
            window.location.hash = tabId;
        }
    }

    function updateAccountActiveTab(activeTab) {
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }

    function filterAccountOrders(status) {
        const orderCards = document.querySelectorAll('.order-card-modern');
        orderCards.forEach(card => {
            const orderStatus = card.querySelector('.order-status-modern');
            if (status === 'all' || (orderStatus && orderStatus.classList.contains(status))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function updateAccountActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    function handleProfileUpdate(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const phone = formData.get('phone');

        showAccountLoadingState();

        setTimeout(() => {
            hideAccountLoadingState();
            accountShowSuccess('Profile updated successfully!');
            localStorage.setItem('userName', `${firstName} ${lastName}`);
            localStorage.setItem('userEmail', email);
            loadAccountUserData();
        }, 1500);
    }

    function accountRemoveFromWishlist(wishlistItem) {
        if (confirm('Are you sure you want to remove this item from your wishlist?')) {
            wishlistItem.style.animation = 'accountFadeOut 0.3s ease';
            setTimeout(() => {
                wishlistItem.remove();
                accountShowSuccess('Item removed from wishlist');
            }, 300);
        }
    }

    function accountAddToCartFromWishlist(wishlistItem) {
        const itemName = wishlistItem.querySelector('h4')?.textContent || 'Product';
        accountShowSuccess(`${itemName} added to cart!`);
        wishlistItem.style.animation = 'accountFadeOut 0.3s ease';
        setTimeout(() => wishlistItem.remove(), 300);
    }

    function accountEditAddress(addressCard) {
        accountShowSuccess('Edit address functionality would open here');
    }

    function accountDeleteAddress(addressCard) {
        if (confirm('Are you sure you want to delete this address?')) {
            addressCard.style.animation = 'accountFadeOut 0.3s ease';
            setTimeout(() => {
                addressCard.remove();
                accountShowSuccess('Address deleted successfully');
            }, 300);
        }
    }

    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            accountShowSuccess('Logged out successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }

    function showAccountLoadingState() {
        const submitBtn = document.querySelector('.profile-form-modern .btn-primary-modern, .profile-form-modern .btn-primary');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        }
    }

    function hideAccountLoadingState() {
        const submitBtn = document.querySelector('.profile-form-modern .btn-primary-modern, .profile-form-modern .btn-primary');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Update Profile';
        }
    }

    function accountShowSuccess(message) {
        showAccountNotification(message, 'success');
    }

    function accountShowError(message) {
        showAccountNotification(message, 'error');
    }

    function showAccountNotification(message, type) {
        document.querySelectorAll('.account-notification').forEach(el => el.remove());

        const notification = document.createElement('div');
        notification.className = `notification account-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            max-width: 400px;
            animation: accountSlideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'accountSlideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
});

/*
==========================================
LOGIN PAGE FUNCTIONALITY
==========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    if (!document.getElementById('login-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'login-notification-styles';
        style.textContent = `
            @keyframes loginSlideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes loginSlideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    initializeLoginPage();
    setupLoginEventListeners();
    checkLoginStatus();

    window.togglePassword = togglePasswordVisibility;

    function initializeLoginPage() {
        console.log('Login page initialized');
    }

    function setupLoginEventListeners() {
        const googleBtn = document.querySelector('.google-btn');
        const facebookBtn = document.querySelector('.facebook-btn');

        loginForm.addEventListener('submit', handleLoginSubmit);

        if (googleBtn) {
            googleBtn.addEventListener('click', handleGoogleLogin);
        }

        if (facebookBtn) {
            facebookBtn.addEventListener('click', handleFacebookLogin);
        }

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('blur', validateEmailField);
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', validatePasswordField);
        }
    }

    function handleLoginSubmit(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!validateEmailInput(email)) {
            loginShowError('Please enter a valid email address');
            return;
        }

        if (!validatePasswordInput(password)) {
            loginShowError('Password must be at least 6 characters long');
            return;
        }

        showLoginLoadingState();

        setTimeout(() => {
            hideLoginLoadingState();

            if (email === 'demo@electro.com' && password === 'password') {
                loginShowSuccess('Login successful! Redirecting...');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', 'John Doe');
                setTimeout(() => {
                    window.location.href = 'my-account.html';
                }, 1500);
            } else {
                loginShowError('Invalid email or password. Try demo@electro.com / password');
            }
        }, 2000);
    }

    function handleGoogleLogin() {
        showLoginLoadingState();

        setTimeout(() => {
            hideLoginLoadingState();
            loginShowSuccess('Google login successful! Redirecting...');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', 'john.doe@gmail.com');
            localStorage.setItem('userName', 'John Doe');
            setTimeout(() => {
                window.location.href = 'my-account.html';
            }, 1500);
        }, 2000);
    }

    function handleFacebookLogin() {
        showLoginLoadingState();

        setTimeout(() => {
            hideLoginLoadingState();
            loginShowSuccess('Facebook login successful! Redirecting...');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', 'john.doe@facebook.com');
            localStorage.setItem('userName', 'John Doe');
            setTimeout(() => {
                window.location.href = 'my-account.html';
            }, 1500);
        }, 2000);
    }

    function togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('.password-toggle i');

        if (!passwordInput || !toggleIcon) return;

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    function validateEmailField(event) {
        const email = event.target.value;
        if (email && !validateEmailInput(email)) {
            loginShowFieldError(event.target, 'Please enter a valid email address');
        } else {
            loginClearFieldError(event.target);
        }
    }

    function validatePasswordField(event) {
        const password = event.target.value;
        if (password && !validatePasswordInput(password)) {
            loginShowFieldError(event.target, 'Password must be at least 6 characters long');
        } else {
            loginClearFieldError(event.target);
        }
    }

    function validateEmailInput(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePasswordInput(password) {
        return password.length >= 6;
    }

    function loginShowFieldError(field, message) {
        loginClearFieldError(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#dc3545';
    }

    function loginClearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '#e9ecef';
    }

    function showLoginLoadingState() {
        const loginBtn = document.querySelector('.login-btn');
        if (!loginBtn) return;
        const originalText = loginBtn.innerHTML;
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Signing in...</span>';
        loginBtn.style.opacity = '0.7';
        loginBtn.setAttribute('data-original-text', originalText);
    }

    function hideLoginLoadingState() {
        const loginBtn = document.querySelector('.login-btn');
        if (!loginBtn) return;
        const originalText = loginBtn.getAttribute('data-original-text');
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalText;
        loginBtn.style.opacity = '1';
    }

    function loginShowSuccess(message) {
        loginShowNotification(message, 'success');
    }

    function loginShowError(message) {
        loginShowNotification(message, 'error');
    }

    function loginShowNotification(message, type) {
        document.querySelectorAll('.login-notification').forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification login-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            max-width: 400px;
            animation: loginSlideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'loginSlideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            window.location.href = 'my-account.html';
        }
    }
});

/*
==========================================
REGISTER PAGE FUNCTIONALITY
==========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    if (!document.getElementById('register-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'register-notification-styles';
        style.textContent = `
            @keyframes registerSlideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes registerSlideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    initializeRegisterPage();
    setupRegisterEventListeners();

    window.togglePasswordVisibility = registerTogglePasswordVisibility;
    window.toggleConfirmPasswordVisibility = registerToggleConfirmPasswordVisibility;
    window.handleSocialRegister = handleSocialRegister;

    function initializeRegisterPage() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            registerShowNotification('You are already logged in!', 'info');
            setTimeout(() => {
                window.location.href = 'my-account.html';
            }, 2000);
        }
    }

    function setupRegisterEventListeners() {
        registerForm.addEventListener('submit', handleRegisterSubmit);
        const inputs = registerForm.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateRegisterField);
            input.addEventListener('input', registerClearFieldError);
        });
    }

    function handleRegisterSubmit(event) {
        event.preventDefault();
        clearRegisterErrors();

        const formData = {
            firstName: registerForm.querySelector('#firstName')?.value.trim() || '',
            lastName: registerForm.querySelector('#lastName')?.value.trim() || '',
            email: registerForm.querySelector('#email')?.value.trim() || '',
            phone: registerForm.querySelector('#phone')?.value.trim() || '',
            password: registerForm.querySelector('#password')?.value || '',
            confirmPassword: registerForm.querySelector('#confirmPassword')?.value || '',
            dateOfBirth: registerForm.querySelector('#dateOfBirth')?.value || '',
            gender: registerForm.querySelector('#gender')?.value || '',
            agreeTerms: registerForm.querySelector('#agreeTerms')?.checked || false,
            subscribeNewsletter: registerForm.querySelector('#subscribeNewsletter')?.checked || false
        };

        if (!validateRegisterForm(formData)) {
            return;
        }

        showRegisterLoadingState();

        setTimeout(() => {
            hideRegisterLoadingState();
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('userPhone', formData.phone);
            localStorage.setItem('userGender', formData.gender);
            localStorage.setItem('userDOB', formData.dateOfBirth);
            localStorage.setItem('newsletterSubscribed', formData.subscribeNewsletter);
            registerShowSuccess('Account created successfully! Redirecting to your account...');
            setTimeout(() => {
                window.location.href = 'my-account.html';
            }, 2000);
        }, 1500);
    }

    function validateRegisterForm(data) {
        let isValid = true;

        if (!data.firstName || data.firstName.length < 2) {
            registerShowFieldError('firstName', 'First name must be at least 2 characters');
            isValid = false;
        }

        if (!data.lastName || data.lastName.length < 2) {
            registerShowFieldError('lastName', 'Last name must be at least 2 characters');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            registerShowFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            registerShowFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        if (!data.password || data.password.length < 8) {
            registerShowFieldError('password', 'Password must be at least 8 characters');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
            registerShowFieldError('password', 'Password must contain uppercase, lowercase, and number');
            isValid = false;
        }

        if (data.password !== data.confirmPassword) {
            registerShowFieldError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        if (!data.dateOfBirth) {
            registerShowFieldError('dateOfBirth', 'Please select your date of birth');
            isValid = false;
        } else {
            const dob = new Date(data.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 13) {
                registerShowFieldError('dateOfBirth', 'You must be at least 13 years old');
                isValid = false;
            }
        }

        if (!data.gender) {
            registerShowFieldError('gender', 'Please select your gender');
            isValid = false;
        }

        if (!data.agreeTerms) {
            registerShowNotification('Please agree to the Terms of Use and Privacy Policy', 'error');
            isValid = false;
        }

        return isValid;
    }

    function validateRegisterField(event) {
        const field = event.target;
        const value = field.value.trim();
        const fieldName = field.id;

        registerClearFieldError(event);

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    registerShowFieldError(fieldName, 'Must be at least 2 characters');
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    registerShowFieldError(fieldName, 'Please enter a valid email address');
                }
                break;
            case 'phone':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                    registerShowFieldError(fieldName, 'Please enter a valid phone number');
                }
                break;
            case 'password':
                if (value && value.length < 8) {
                    registerShowFieldError(fieldName, 'Password must be at least 8 characters');
                } else if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    registerShowFieldError(fieldName, 'Password must contain uppercase, lowercase, and number');
                }
                break;
            case 'confirmPassword':
                const password = registerForm.querySelector('#password')?.value || '';
                if (value && value !== password) {
                    registerShowFieldError(fieldName, 'Passwords do not match');
                }
                break;
            default:
                break;
        }
    }

    function registerShowFieldError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        const field = document.getElementById(fieldName);
        if (field) {
            field.style.borderColor = '#dc3545';
        }
    }

    function registerClearFieldError(event) {
        const field = event.target;
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        field.style.borderColor = '#e9ecef';
    }

    function clearRegisterErrors() {
        registerForm.querySelectorAll('.error-message').forEach(element => {
            element.classList.remove('show');
        });
        registerForm.querySelectorAll('input, select').forEach(input => {
            input.style.borderColor = '#e9ecef';
        });
    }

    function registerTogglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#password + .password-toggle i');
        if (!passwordInput || !toggleIcon) return;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    function registerToggleConfirmPasswordVisibility() {
        const passwordInput = document.getElementById('confirmPassword');
        const toggleIcon = document.querySelector('#confirmPassword + .password-toggle i');
        if (!passwordInput || !toggleIcon) return;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    function handleSocialRegister(provider) {
        registerShowNotification(`Registering with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`, 'info');
        setTimeout(() => {
            registerShowSuccess(`Registration with ${provider.charAt(0).toUpperCase() + provider.slice(1)} successful!`);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', 'Social User');
            localStorage.setItem('userEmail', `user@${provider}.com`);
            localStorage.setItem('socialProvider', provider);
            setTimeout(() => {
                window.location.href = 'my-account.html';
            }, 2000);
        }, 1500);
    }

    function showRegisterLoadingState() {
        const submitBtn = document.querySelector('.register-btn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
        }
    }

    function hideRegisterLoadingState() {
        const submitBtn = document.querySelector('.register-btn');
        if (submitBtn) {
            submitBtn.innerHTML = '<span>Create Account</span><i class="fas fa-user-plus"></i>';
            submitBtn.disabled = false;
        }
    }

    function registerShowSuccess(message) {
        registerShowNotification(message, 'success');
    }

    function registerShowError(message) {
        registerShowNotification(message, 'error');
    }

    function registerShowNotification(message, type = 'info') {
        document.querySelectorAll('.register-notification').forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification register-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: registerSlideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'registerSlideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
});

/*
==========================================
POLICY PAGES FUNCTIONALITY
==========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    const policySections = document.querySelectorAll('.policy-section');
    const navLinksWrapper = document.querySelector('.policy-nav-links');
    if (!policySections.length && !navLinksWrapper) return;

    initializePolicyPage();

    if (document.title.includes('Warranty')) {
        setupWarrantyFeatures();
        setupWarrantyPlans();
    }

    window.printPolicy = printPolicy;
    window.sharePolicy = sharePolicy;

    function initializePolicyPage() {
        setupSmoothScrolling();
        setupNavigationHighlight();
        setupBackToTop();
        setupNewsletterForm();
        setupInteractiveElements();
    }

    function setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.policy-nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    updateActiveNavigation(this);
                }
            });
        });
    }

    function updateActiveNavigation(activeLink) {
        document.querySelectorAll('.policy-nav-links a').forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    function setupNavigationHighlight() {
        const sections = document.querySelectorAll('.policy-section');
        const navLinks = document.querySelectorAll('.policy-nav-links a');

        function updateActiveSection() {
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSection) {
                    link.classList.add('active');
                }
            });
        }

        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection);
    }

    function setupBackToTop() {
        if (document.querySelector('.back-to-top')) return;
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        Object.assign(backToTopBtn.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            background: 'linear-gradient(45deg, #FF5E00, #00B2FF)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            zIndex: '1000'
        });

        document.body.appendChild(backToTopBtn);

        window.addEventListener('scroll', function() {
            backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        backToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 8px 25px rgba(255, 94, 0, 0.3)';
        });

        backToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
    }

    function setupNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        const newsletterInput = document.querySelector('.newsletter-input');
        const newsletterBtn = document.querySelector('.newsletter-btn');

        if (!newsletterForm || !newsletterInput || !newsletterBtn) return;

        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = newsletterInput.value.trim();
            if (validatePolicyEmail(email)) {
                showNewsletterSuccess();
                newsletterInput.value = '';
            } else {
                showNewsletterError();
            }
        });

        newsletterBtn.addEventListener('click', function() {
            if (this.classList.contains('loading')) return;
            this.classList.add('loading');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = 'Subscribe';
            }, 2000);
        });
    }

    function validatePolicyEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNewsletterSuccess() {
        const newsletterBtn = document.querySelector('.newsletter-btn');
        if (!newsletterBtn) return;
        const originalText = newsletterBtn.innerHTML;
        newsletterBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        newsletterBtn.style.background = '#28a745';
        setTimeout(() => {
            newsletterBtn.innerHTML = originalText;
            newsletterBtn.style.background = '';
        }, 3000);
    }

    function showNewsletterError() {
        const newsletterBtn = document.querySelector('.newsletter-btn');
        if (!newsletterBtn) return;
        const originalText = newsletterBtn.innerHTML;
        newsletterBtn.innerHTML = '<i class="fas fa-times"></i> Invalid Email';
        newsletterBtn.style.background = '#dc3545';
        setTimeout(() => {
            newsletterBtn.innerHTML = originalText;
            newsletterBtn.style.background = '';
        }, 3000);
    }

    function setupInteractiveElements() {
        const cards = document.querySelectorAll('.highlight-box, .guideline-item, .requirement-item');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });

        const buttons = document.querySelectorAll('button, .btn, .action-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });

        const stepItems = document.querySelectorAll('.step-item');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.1 });

        stepItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    function setupWarrantyFeatures() {
        const periodDurations = document.querySelectorAll('.period-duration');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = entry.target.textContent;
                    const number = parseInt(text, 10);
                    if (!isNaN(number)) {
                        animateCounter(entry.target, number);
                    }
                }
            });
        }, { threshold: 0.5 });

        periodDurations.forEach(duration => {
            observer.observe(duration);
        });
    }

    function setupWarrantyPlans() {
        const planCards = document.querySelectorAll('.plan-card');
        planCards.forEach(card => {
            card.addEventListener('click', function() {
                planCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                const planName = this.querySelector('h3')?.textContent || 'Plan';
                console.log(`Selected plan: ${planName}`);
            });
        });
    }

    function printPolicy() {
        window.print();
    }

    function sharePolicy() {
        if (navigator.share) {
            navigator.share({ title: document.title, url: window.location.href });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Global Cart Drawer (header cart icon works on all pages)
    const cartIcon = document.getElementById('cartIcon');
    const cartSlider = document.getElementById('electroCartSlider');
    const closeCartBtn = document.getElementById('electroCloseCart');

    if (cartIcon && cartSlider) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSlider.classList.add('active');
        });
    }
    if (closeCartBtn && cartSlider) {
        closeCartBtn.addEventListener('click', function() {
            cartSlider.classList.remove('active');
        });
    }
    if (cartSlider) {
        cartSlider.addEventListener('click', function(e) {
            if (e.target === cartSlider) {
                cartSlider.classList.remove('active');
            }
        });
    }

    // Banner Slider (index hero)
    const sliderWrapper = document.querySelector('.banner-slider .slider-wrapper');
    const slides = sliderWrapper ? Array.from(sliderWrapper.querySelectorAll('.slide')) : [];
    if (sliderWrapper && slides.length) {
        sliderWrapper.style.display = 'flex';
        sliderWrapper.style.transition = 'transform 0.6s ease';
        slides.forEach(function(slide) {
            slide.style.flex = '0 0 100%';
        });
    }
    const dotsContainer = document.querySelector('.banner-slider .slider-dots');
    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot')) : [];
    const sliderPrev = document.getElementById('sliderPrev');
    const sliderNext = document.getElementById('sliderNext');
    let currentSlide = slides.findIndex(s => s.classList.contains('active'));
    if (currentSlide < 0) currentSlide = 0;

    function goToSlide(index, options) {
        if (!slides.length) return;
        currentSlide = (index + slides.length) % slides.length;
        if (sliderWrapper) {
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        const activeSlide = slides[currentSlide];
        if (activeSlide) activeSlide.classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');

        if (!options || !options.auto) {
            resetAutoplay();
        }
    }

    if (slides.length) {
        if (currentSlide < 0) currentSlide = 0;
        if (sliderWrapper) {
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        if (slides[currentSlide]) slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    if (sliderPrev) sliderPrev.addEventListener('click', function() { goToSlide(currentSlide - 1, { auto: false }); });
    if (sliderNext) sliderNext.addEventListener('click', function() { goToSlide(currentSlide + 1, { auto: false }); });
    if (dots.length) {
        dots.forEach(function(dot, idx) {
            dot.addEventListener('click', function() { goToSlide(idx, { auto: false }); });
        });
    }

    // autoplay
    let sliderInterval = null;
    function startAutoplay() {
        if (sliderInterval || slides.length === 0) return;
        sliderInterval = setInterval(function() {
            goToSlide(currentSlide + 1, { auto: true });
        }, 5000);
    }
    function stopAutoplay() {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }
    }
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    startAutoplay();

    const sliderContainer = document.querySelector('.banner-slider .slider-container');
    const hoverTarget = sliderContainer || sliderWrapper;
    if (hoverTarget) {
        hoverTarget.addEventListener('mouseenter', stopAutoplay);
        hoverTarget.addEventListener('mouseleave', startAutoplay);
    }

    // Fashion Collection Banner Slider (banner-slider-section)
    const bannerSlidesContainer = document.getElementById('bannerSlides');
    const bannerPrev = document.getElementById('bannerPrev');
    const bannerNext = document.getElementById('bannerNext');
    
    if (bannerSlidesContainer) {
        const bannerSlides = Array.from(bannerSlidesContainer.querySelectorAll('.banner-slide'));
        const bannerDots = Array.from(document.querySelectorAll('.banner-dot'));
        let bannerCurrentSlide = bannerSlides.findIndex(s => s.classList.contains('active'));
        if (bannerCurrentSlide < 0) bannerCurrentSlide = 0;
        let bannerInterval = null;

        // Ensure slides container has proper styling
        bannerSlidesContainer.style.display = 'flex';
        bannerSlidesContainer.style.transition = 'transform 0.6s ease-in-out';
        bannerSlides.forEach(function(slide) {
            slide.style.flex = '0 0 100%';
            slide.style.minWidth = '100%';
        });

        function goToBannerSlide(index) {
            if (!bannerSlides.length) return;
            bannerCurrentSlide = (index + bannerSlides.length) % bannerSlides.length;
            
            // Use transform to slide
            bannerSlidesContainer.style.transform = `translateX(-${bannerCurrentSlide * 100}%)`;
            
            // Update active classes
            bannerSlides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === bannerCurrentSlide);
            });
            
            bannerDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === bannerCurrentSlide);
            });

            resetBannerAutoplay();
        }

        // Initialize position
        if (bannerSlides.length) {
            goToBannerSlide(bannerCurrentSlide);
        }

        function startBannerAutoplay() {
            if (bannerInterval || bannerSlides.length === 0) return;
            bannerInterval = setInterval(function() {
                goToBannerSlide(bannerCurrentSlide + 1);
            }, 5000);
        }

        function stopBannerAutoplay() {
            if (bannerInterval) {
                clearInterval(bannerInterval);
                bannerInterval = null;
            }
        }

        function resetBannerAutoplay() {
            stopBannerAutoplay();
            startBannerAutoplay();
        }

        if (bannerPrev) {
            bannerPrev.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                goToBannerSlide(bannerCurrentSlide - 1);
            });
        }

        if (bannerNext) {
            bannerNext.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                goToBannerSlide(bannerCurrentSlide + 1);
            });
        }

        if (bannerDots.length) {
            bannerDots.forEach(function(dot, idx) {
                dot.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    goToBannerSlide(idx);
                });
            });
        }

        startBannerAutoplay();

        const bannerSliderSection = document.querySelector('.banner-slider-section');
        if (bannerSliderSection) {
            bannerSliderSection.addEventListener('mouseenter', stopBannerAutoplay);
            bannerSliderSection.addEventListener('mouseleave', startBannerAutoplay);
        }
    }

    // Top Categories scroll
    const categoriesScroll = document.getElementById('categoriesScroll');
    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');

    if (categoriesScroll) {
        function updateScrollButtons() {
            if (!scrollLeft || !scrollRight) return;
            const isAtStart = categoriesScroll.scrollLeft <= 0;
            const isAtEnd = categoriesScroll.scrollLeft >= categoriesScroll.scrollWidth - categoriesScroll.clientWidth - 1;
            
            scrollLeft.style.opacity = isAtStart ? '0.5' : '1';
            scrollLeft.style.pointerEvents = isAtStart ? 'none' : 'auto';
            
            scrollRight.style.opacity = isAtEnd ? '0.5' : '1';
            scrollRight.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        }

        function scrollCategories(direction) {
            if (!categoriesScroll) return;
            const categoryItems = categoriesScroll.querySelectorAll('.category-item');
            if (categoryItems.length === 0) return;

            const firstItem = categoryItems[0];
            const itemWidth = firstItem.getBoundingClientRect().width;
            const sliderStyle = window.getComputedStyle(categoriesScroll);
            const gapValue = parseFloat(sliderStyle.gap || sliderStyle.columnGap || '15px') || 15;
            const scrollAmount = itemWidth + gapValue;

            const currentScroll = categoriesScroll.scrollLeft;
            const newScroll = currentScroll + (direction * scrollAmount);
            const maxScroll = categoriesScroll.scrollWidth - categoriesScroll.clientWidth;

            categoriesScroll.scrollTo({
                left: Math.max(0, Math.min(newScroll, maxScroll)),
                behavior: 'smooth'
            });
        }

        if (scrollLeft) {
            scrollLeft.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scrollCategories(-1);
            });
        }

        if (scrollRight) {
            scrollRight.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scrollCategories(1);
            });
        }

        categoriesScroll.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', function() {
            setTimeout(updateScrollButtons, 100);
        });
        
        // Initial check
        setTimeout(updateScrollButtons, 100);
    }

    // Special Offers carousel
    const offersCarousel = document.getElementById('offersCarousel');
    const offersSlider = document.getElementById('offersSlider');
    const offersPrev = document.getElementById('offersPrev');
    const offersNext = document.getElementById('offersNext');

    if (offersCarousel && offersSlider) {
        let offset = 0;
        const card = offersSlider.querySelector('.offer-card');
        const cardWidth = card ? (card.getBoundingClientRect().width + 16) : 300; // 16px gap fallback

        function scrollByCards(direction) {
            offset += direction * cardWidth;
            const maxOffset = Math.max(0, offersSlider.scrollWidth - offersCarousel.clientWidth);
            if (offset < 0) offset = 0;
            if (offset > maxOffset) offset = maxOffset;
            offersCarousel.scrollTo({ left: offset, behavior: 'smooth' });
        }

        if (offersPrev) offersPrev.addEventListener('click', function() { scrollByCards(-1); });
        if (offersNext) offersNext.addEventListener('click', function() { scrollByCards(1); });
    }

    // Blog carousel
    const blogCarousel = document.getElementById('blogCarousel');
    const blogSlider = document.getElementById('blogSlider');
    const blogPrev = document.getElementById('blogPrev');
    const blogNext = document.getElementById('blogNext');

    if (blogCarousel && blogSlider) {
        const blogCards = Array.from(blogSlider.querySelectorAll('.blog-card'));
        let blogOffset = 0;
        let blogInterval = null;

        function getCardWidth() {
            if (blogCards.length === 0) return 300;
            const firstCard = blogCards[0];
            const cardRect = firstCard.getBoundingClientRect();
            const sliderStyle = window.getComputedStyle(blogSlider);
            const gapValue = parseFloat(sliderStyle.gap || sliderStyle.columnGap || '30px') || 30;
            return cardRect.width + gapValue;
        }

        function getVisibleCount() {
            if (blogCards.length === 0) return 1;
            const cardWidth = getCardWidth();
            const availableWidth = blogCarousel.clientWidth;
            return Math.max(1, Math.floor(availableWidth / cardWidth));
        }

        function getMaxOffset() {
            const cardWidth = getCardWidth();
            const visibleCount = getVisibleCount();
            const totalWidth = blogCards.length * cardWidth;
            const maxOffset = Math.max(0, totalWidth - blogCarousel.clientWidth);
            return maxOffset;
        }

        function updateBlogPosition() {
            const maxOffset = getMaxOffset();
            if (blogOffset < 0) blogOffset = 0;
            if (blogOffset > maxOffset) blogOffset = maxOffset;
            blogSlider.style.transform = `translateX(-${blogOffset}px)`;
        }

        function moveBlog(direction) {
            const cardWidth = getCardWidth();
            blogOffset += direction * cardWidth;
            updateBlogPosition();
            resetBlogAutoplay();
        }

        if (blogPrev) {
            blogPrev.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                moveBlog(-1);
            });
        }

        if (blogNext) {
            blogNext.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                moveBlog(1);
            });
        }

        function startBlogAutoplay() {
            if (blogInterval || blogCards.length <= getVisibleCount()) return;
            blogInterval = setInterval(function() {
                const maxOffset = getMaxOffset();
                const cardWidth = getCardWidth();
                if (blogOffset >= maxOffset) {
                    blogOffset = 0;
                } else {
                    blogOffset += cardWidth;
                }
                updateBlogPosition();
            }, 5000);
        }

        function stopBlogAutoplay() {
            if (blogInterval) {
                clearInterval(blogInterval);
                blogInterval = null;
            }
        }

        function resetBlogAutoplay() {
            stopBlogAutoplay();
            startBlogAutoplay();
        }

        // Initialize
        updateBlogPosition();
        startBlogAutoplay();

        // Pause on hover
        if (blogCarousel) {
            blogCarousel.addEventListener('mouseenter', stopBlogAutoplay);
            blogCarousel.addEventListener('mouseleave', startBlogAutoplay);
        }

        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                blogOffset = 0;
                updateBlogPosition();
                resetBlogAutoplay();
            }, 250);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Global product-card navigation to product detail page and category navigation
    document.addEventListener('click', function(e) {
        const interactive = e.target.closest('button, a, [role="button"], .shop-btn-add-cart, .wishlist-icon');
        if (interactive) {
            // Special handling for flash-btn and offer-btn - allow navigation
            if (interactive.classList.contains('flash-btn') || interactive.classList.contains('offer-btn')) {
                const card = interactive.closest('[data-product-id]');
                if (card) {
                    const productId = card.getAttribute('data-product-id');
                    if (productId) {
                        e.preventDefault();
                        window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
                    }
                }
            }
            return; // respect other intentional button/link interactions
        }

        // Check for category navigation first
        const categoryEl = e.target.closest('[data-category-key]');
        if (categoryEl) {
            const categoryKey = categoryEl.getAttribute('data-category-key');
            if (categoryKey) {
                window.location.href = `category.html?cat=${encodeURIComponent(categoryKey)}`;
                return;
            }
        }

        // Check for product navigation
        const productEl = e.target.closest('[data-product-id]');
        if (!productEl) return;

        const productId = productEl.getAttribute('data-product-id');
        if (!productId) return;

        window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
    });
});

/*
==========================================
CATEGORY PAGE FUNCTIONALITY
==========================================
*/

document.addEventListener('DOMContentLoaded', function() {
    if (!document.body.classList.contains('category-page')) return;

    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = (urlParams.get('cat') || '').toLowerCase();

    const heroTitleEl = document.getElementById('categoryTitle');
    const heroDescriptionEl = document.getElementById('categoryDescription');
    const heroCountEl = document.getElementById('categoryProductCount');
    const heroRatingEl = document.getElementById('categoryAverageRating');
    const heroPriceRangeEl = document.getElementById('categoryPriceRange');
    const productsCountEl = document.getElementById('productsCount');
    const loadMoreButton = document.querySelector('.shop-load-more button');

    const currencyFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
    const placeholderImage = 'https://via.placeholder.com/400x300/1a1a1a/FF5E00?text=No+Image';

    const allProducts = getProductsArray();
    const matchedProducts = allProducts.filter(product => (product.category || '').toLowerCase() === categoryParam);
    const baseProducts = (categoryParam ? matchedProducts : allProducts).map(product => ({ ...product }));

    const friendlyName = categoryParam ? formatCategoryName(categoryParam) : 'All Products';
    const categoryDescriptions = {
        smartphones: 'Latest smartphones with cutting-edge technology and blazing performance.',
        laptops: 'High-performance laptops engineered for professionals and creators.',
        gaming: 'Elite gaming gear to elevate every battle and quest.',
        audio: 'Immersive audio devices that bring your soundscape to life.',
        wearables: 'Smart wearables to keep you connected, healthy, and active.',
        accessories: 'Essential accessories to personalize and power your tech ecosystem.'
    };

    document.title = `${friendlyName} - ELECTRO`;
    if (heroTitleEl) heroTitleEl.textContent = friendlyName;
    if (heroDescriptionEl) {
        heroDescriptionEl.textContent = categoryDescriptions[categoryParam] || 'Discover the best products curated just for you.';
    }

    document.querySelectorAll('.category-filter').forEach(checkbox => {
        if (categoryParam && checkbox.value.toLowerCase() === categoryParam) {
            checkbox.checked = true;
        }
    });

    let filteredProducts = [...baseProducts];
    let currentPage = 1;
    const productsPerPage = 6;

    function formatCategoryName(slug) {
        return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    function parsePrice(value) {
        if (typeof value === 'number') return value;
        if (!value) return 0;
        const numeric = Number(String(value).replace(/[^0-9.]/g, ''));
        return Number.isFinite(numeric) ? numeric : 0;
    }

    function normalizeProduct(product) {
        return normalizeProductForTemplate(product);
    }

    function buildProductFallback(product) {
        const badgeMarkup = product.badge ? `<div class="shop-product-badge">${product.badge}</div>` : '';
        const stars = '★'.repeat(Math.floor(product.rating || 0)) + '☆'.repeat(5 - Math.floor(product.rating || 0));
        return `
            <div class="shop-product-card" data-product-id="${product.id}">
                <div class="shop-product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='${placeholderImage}'">
                    ${badgeMarkup}
                </div>
                <div class="shop-product-info">
                    <h3 class="shop-product-title">${product.name}</h3>
                    <div class="shop-product-price-rating">
                        <div class="shop-product-price">₹${currencyFormatter.format(product.price || 0)}</div>
                        <div class="shop-product-rating">
                            <div class="stars">${stars}</div>
                            <span class="rating-count">(${product.reviews || 0})</span>
                        </div>
                    </div>
                    <div class="shop-product-actions">
                        <button class="shop-btn-add-cart" data-add-cart-id="${product.id}" data-product-name="${product.name}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <a href="product.html?id=${product.id}" class="shop-btn-buy-now" data-buy-now-id="${product.id}">
                            <i class="fas fa-bolt"></i> Buy Now
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    function updateHeroStats(products) {
        const count = products.length;
        if (heroCountEl) heroCountEl.textContent = count;

        const ratings = products
            .map(product => Number(product.rating || 0))
            .filter(value => Number.isFinite(value) && value > 0);
        const averageRating = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length) : 0;
        if (heroRatingEl) heroRatingEl.textContent = averageRating.toFixed(1);

        const priceValues = products
            .map(product => parsePrice(product.price ?? product.discounted_price ?? product.originalPrice))
            .filter(value => Number.isFinite(value) && value >= 0);
        if (heroPriceRangeEl) {
            if (priceValues.length) {
                const minPrice = Math.min(...priceValues);
                const maxPrice = Math.max(...priceValues);
                heroPriceRangeEl.textContent = `₹${currencyFormatter.format(minPrice)} - ₹${currencyFormatter.format(maxPrice)}`;
            } else {
                heroPriceRangeEl.textContent = '₹0 - ₹0';
            }
        }
    }

    function updateProductsMeta() {
        if (productsCountEl) {
            productsCountEl.textContent = `${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} found`;
        }
        updateHeroStats(filteredProducts);
    }

    function updateLoadMoreVisibility(forceHide = false) {
        if (!loadMoreButton) return;
        if (forceHide) {
            loadMoreButton.style.display = 'none';
            return;
        }
        const canLoadMore = filteredProducts.length > currentPage * productsPerPage;
        loadMoreButton.style.display = canLoadMore ? 'block' : 'none';
    }

    function bindProductCardEvents() {
        const cards = productsGrid.querySelectorAll('.shop-product-card');
        cards.forEach(card => {
            const productId = card.getAttribute('data-product-id');
            card.addEventListener('click', function(event) {
                if (event.target.closest('.shop-product-actions')) {
                    return;
                }
                window.location.href = `product.html?id=${productId}`;
            });
        });

        const addCartButtons = productsGrid.querySelectorAll('[data-add-cart-id]');
        addCartButtons.forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.stopPropagation();
                const productId = btn.getAttribute('data-add-cart-id');
                if (typeof window.addToCart === 'function') {
                    window.addToCart(productId);
                }
                const productName = btn.getAttribute('data-product-name') || 'Product';
                if (typeof showCartNotification === 'function') {
                    showCartNotification(`${productName} added to cart!`);
                }
            });
        });
    }

    function renderProducts(clear = true) {
        const productsToShow = filteredProducts.slice(0, currentPage * productsPerPage).map(normalizeProduct);

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="shop-empty-state">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or explore other categories.</p>
                    <a href="shop.html">
                        <i class="fas fa-store"></i>
                        <span>Browse All Products</span>
                    </a>
                </div>
            `;
            updateProductsMeta();
            updateLoadMoreVisibility(true);
            return Promise.resolve();
        }

        return renderWithLiquid('shop-products', { products: productsToShow })
            .then(html => {
                if (html && html.trim()) {
                    productsGrid.innerHTML = html;
                } else {
                    productsGrid.innerHTML = productsToShow.map(buildProductFallback).join('');
                }
                bindProductCardEvents();
                updateProductsMeta();
                updateLoadMoreVisibility();
            })
            .catch(err => {
                console.error('Error rendering category products:', err);
                productsGrid.innerHTML = productsToShow.map(buildProductFallback).join('');
                bindProductCardEvents();
                updateProductsMeta();
                updateLoadMoreVisibility();
            });
    }

    function applyFilters() {
        const selectedCategories = Array
            .from(document.querySelectorAll('.category-filter:checked'))
            .map(filter => filter.value.toLowerCase());
        const priceRangeInput = document.getElementById('priceRange');
        const maxPrice = priceRangeInput ? parseInt(priceRangeInput.value, 10) : Infinity;
        const selectedRatings = Array
            .from(document.querySelectorAll('.rating-filter:checked'))
            .map(filter => parseInt(filter.value, 10));

        filteredProducts = baseProducts.filter(product => {
            const normalized = normalizeProduct(product);
            const productCategory = (product.category || '').toLowerCase();
            if (selectedCategories.length && !selectedCategories.includes(productCategory)) {
                return false;
            }
            if (normalized.price > maxPrice) {
                return false;
            }
            if (selectedRatings.length) {
                const productRating = Math.floor(normalized.rating || 0);
                if (!selectedRatings.some(rating => productRating >= rating)) {
                    return false;
                }
            }
            return true;
        });

        currentPage = 1;
        renderProducts();
    }

    function clearFilters() {
        document.querySelectorAll('.category-filter, .rating-filter').forEach(filter => {
            filter.checked = false;
        });

        if (categoryParam) {
            document.querySelectorAll('.category-filter').forEach(filter => {
                if (filter.value.toLowerCase() === categoryParam) {
                    filter.checked = true;
                }
            });
        }

        const priceRangeInput = document.getElementById('priceRange');
        const maxPriceDisplay = document.getElementById('maxPrice');
        if (priceRangeInput) {
            priceRangeInput.value = priceRangeInput.max || priceRangeInput.value;
            if (maxPriceDisplay) {
                maxPriceDisplay.textContent = `${priceRangeInput.max ? `₹${Number(priceRangeInput.max).toLocaleString('en-IN')}` : '₹3,00,000'}`;
            }
        }

        filteredProducts = [...baseProducts];
        currentPage = 1;
        renderProducts();
    }

    function sortProducts(sortBy) {
        const sorters = {
            name: (a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''),
            'price-low': (a, b) => normalizeProduct(a).price - normalizeProduct(b).price,
            'price-high': (a, b) => normalizeProduct(b).price - normalizeProduct(a).price,
            rating: (a, b) => normalizeProduct(b).rating - normalizeProduct(a).rating,
            newest: (a, b) => (b.id || 0) - (a.id || 0)
        };
        const sorter = sorters[sortBy] || sorters.name;
        filteredProducts.sort(sorter);
    }

    function setupFilters() {
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        const priceRangeInput = document.getElementById('priceRange');
        const maxPriceDisplay = document.getElementById('maxPrice');
        if (priceRangeInput) {
            priceRangeInput.addEventListener('input', function() {
                if (maxPriceDisplay) {
                    maxPriceDisplay.textContent = `₹${Number(this.value).toLocaleString('en-IN')}`;
                }
                applyFilters();
            });
        }

        document.querySelectorAll('.rating-filter').forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        const clearFiltersBtn = document.querySelector('.shop-clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function(event) {
                event.preventDefault();
                clearFilters();
            });
        }
    }

    function setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        if (!sortSelect) return;
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
            currentPage = 1;
            renderProducts();
        });
    }

    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            if (query) {
                filteredProducts = baseProducts.filter(product => {
                    const normalized = normalizeProduct(product);
                    return (
                        (normalized.name || '').toLowerCase().includes(query) ||
                        (normalized.title || '').toLowerCase().includes(query) ||
                        (product.description || '').toLowerCase().includes(query)
                    );
                });
            } else {
                filteredProducts = [...baseProducts];
            }
            currentPage = 1;
            renderProducts();
        });
    }

    function loadMoreProducts() {
        currentPage++;
        renderProducts(false);
    }

    renderProducts();
    setupFilters();
    setupSorting();
    setupSearch();
    updateHeroStats(filteredProducts);
    updateLoadMoreVisibility();

    window.clearFilters = clearFilters;
    window.loadMoreProducts = loadMoreProducts;
});

