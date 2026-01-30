// JavaScript Document

/*

TemplateMo 597 Neural Glass

https://templatemo.com/tm-597-neural-glass

*/

// Product Data (use global if provided by product-data.js)
var products = window.products || {
    'sony-wh-1000xm4': {
        id: 'sony-wh-1000xm4',
        name: 'Sony WH-1000XM4',
        category: 'Electronics',
        price: 24990,
        originalPrice: 32990,
        discount: 24,
        rating: 5,
        reviewCount: 2847,
        description: 'Industry-leading noise canceling with 30-hour battery life. Experience premium sound quality with Sony\'s most advanced wireless headphones.',
        features: [
            'Industry-leading noise canceling',
            '30-hour battery life',
            'Quick charge (10 min = 5 hours)',
            'Touch sensor controls',
            'Speak-to-Chat technology'
        ],
        specifications: {
            'Driver': '40mm dome type',
            'Frequency Response': '4Hz-40kHz',
            'Battery Life': '30 hours (NC on)',
            'Weight': '254g',
            'Connectivity': 'Bluetooth 5.0',
            'Charging': 'USB-C'
        },
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center'
        ]
    },
    'apple-watch-series-9': {
        id: 'apple-watch-series-9',
        name: 'Apple Watch Series 9',
        category: 'Electronics',
        price: 45900,
        originalPrice: 49900,
        discount: 8,
        rating: 5,
        reviewCount: 1923,
        description: 'Most advanced Apple Watch with health monitoring. Track your fitness, monitor your health, and stay connected with the latest technology.',
        features: [
            'Health monitoring',
            'Fitness tracking',
            'Water resistant',
            'Always-on display',
            'Siri integration'
        ],
        specifications: {
            'Display': 'Always-On Retina display',
            'Water Resistance': '50 meters',
            'Battery Life': '18 hours',
            'Processor': 'S9 SiP',
            'Connectivity': 'GPS + Cellular',
            'Compatibility': 'iPhone 6s or later'
        },
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center'
        ]
    },
    'nike-air-max-270': {
        id: 'nike-air-max-270',
        name: 'Nike Air Max 270',
        category: 'Fashion',
        price: 12495,
        originalPrice: 15995,
        discount: 22,
        rating: 4,
        reviewCount: 3156,
        description: 'Comfortable lifestyle sneakers with Max Air cushioning. Perfect for everyday wear with maximum comfort and style.',
        features: [
            'Max Air cushioning',
            'Breathable upper',
            'Durable rubber outsole',
            'Lightweight design',
            'Modern styling'
        ],
        specifications: {
            'Upper': 'Mesh and synthetic',
            'Midsole': 'Max Air unit',
            'Outsole': 'Rubber',
            'Weight': 'Approx. 300g',
            'Style': 'Lifestyle',
            'Colors': 'Multiple options'
        },
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center'
        ]
    },
    'iphone-15-pro': {
        id: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        price: 134900,
        originalPrice: 139900,
        discount: 4,
        rating: 5,
        reviewCount: 4892,
        description: 'Titanium design with A17 Pro chip and Pro camera system. The most advanced iPhone with professional-grade features.',
        features: [
            'Titanium design',
            'A17 Pro chip',
            'Pro camera system',
            'Action Button',
            'USB-C connectivity'
        ],
        specifications: {
            'Display': '6.1-inch Super Retina XDR',
            'Chip': 'A17 Pro',
            'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
            'Storage': '128GB, 256GB, 512GB, 1TB',
            'Battery': 'Up to 23 hours video playback',
            'Connectivity': '5G, Wi-Fi 6E, Bluetooth 5.3'
        },
        images: [
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop&crop=center'
        ]
    },
    'sony-wh-1000xm5': {
        id: 'sony-wh-1000xm5',
        name: 'Sony WH-1000XM5',
        category: 'Electronics',
        price: 19990,
        originalPrice: 39990,
        discount: 50,
        rating: 5,
        reviewCount: 3247,
        description: 'Next-gen noise canceling with premium sound. Experience the latest in wireless audio technology with Sony\'s most advanced headphones.',
        features: [
            'Next-gen noise canceling',
            'Premium sound quality',
            '30-hour battery life',
            'Quick charge technology',
            'Touch sensor controls'
        ],
        specifications: {
            'Driver': '30mm dome type',
            'Frequency Response': '4Hz-40kHz',
            'Battery Life': '30 hours (NC on)',
            'Weight': '250g',
            'Connectivity': 'Bluetooth 5.2',
            'Charging': 'USB-C'
        },
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center'
        ]
    },
    'macbook-pro-m3': {
        id: 'macbook-pro-m3',
        name: 'MacBook Pro M3',
        category: 'Electronics',
        price: 119900,
        originalPrice: 169900,
        discount: 30,
        rating: 5,
        reviewCount: 1856,
        description: 'Powerful performance for professionals. The M3 chip delivers incredible speed and efficiency for demanding tasks.',
        features: [
            'M3 chip performance',
            'Retina display',
            'All-day battery life',
            'Professional apps',
            'Thunderbolt connectivity'
        ],
        specifications: {
            'Chip': 'Apple M3',
            'Display': '14.2-inch Liquid Retina XDR',
            'Memory': '8GB unified memory',
            'Storage': '512GB SSD',
            'Battery': 'Up to 18 hours',
            'Weight': '1.6 kg'
        },
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center'
        ]
    },
    'nike-air-jordan-1': {
        id: 'nike-air-jordan-1',
        name: 'Nike Air Jordan 1',
        category: 'Fashion',
        price: 8997,
        originalPrice: 14995,
        discount: 40,
        rating: 4,
        reviewCount: 2891,
        description: 'Classic basketball sneakers with timeless style. The Air Jordan 1 combines heritage design with modern comfort.',
        features: [
            'Classic basketball design',
            'Premium leather upper',
            'Air-Sole unit',
            'Rubber outsole',
            'Iconic colorways'
        ],
        specifications: {
            'Upper': 'Premium leather',
            'Midsole': 'Air-Sole unit',
            'Outsole': 'Rubber',
            'Weight': 'Approx. 400g',
            'Style': 'Basketball',
            'Colors': 'Multiple options'
        },
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center'
        ]
    },
    'samsung-galaxy-s24-ultra': {
        id: 'samsung-galaxy-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        category: 'Electronics',
        price: 89999,
        originalPrice: 119999,
        discount: 25,
        rating: 5,
        reviewCount: 4123,
        description: 'Advanced smartphone with AI features. The Galaxy S24 Ultra delivers cutting-edge technology and premium performance.',
        features: [
            'AI-powered features',
            '200MP camera system',
            'S Pen included',
            '5G connectivity',
            'All-day battery life'
        ],
        specifications: {
            'Display': '6.8-inch Dynamic AMOLED 2X',
            'Processor': 'Snapdragon 8 Gen 3',
            'Camera': '200MP + 50MP + 10MP + 12MP',
            'Storage': '256GB/512GB/1TB',
            'Battery': '5000mAh',
            'Connectivity': '5G, Wi-Fi 7, Bluetooth 5.3'
        },
        images: [
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop&crop=center'
        ]
    }
};

// Ensure global reference for other pages
window.products = products;

// Modern Header Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect removed - using CSS sticky instead

    // Search suggestions removed

    // Dropdown menus
    const actionItems = document.querySelectorAll('.action-item');
    actionItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown-menu');
        if (dropdown) {
            item.addEventListener('mouseenter', () => {
                dropdown.style.display = 'block';
            });
            
            item.addEventListener('mouseleave', () => {
                dropdown.style.display = 'none';
            });
        }
    });

    // Cart functionality
    const cartCount = document.querySelector('.cart-count');
    const wishlistCount = document.querySelector('.wishlist-count');
    const cartTotal = document.querySelector('.cart-total');
    
    // Initialize cart
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    
    function updateCartDisplay() {
        if (cartCount) {
            cartCount.textContent = cartItems.length;
        }
        if (wishlistCount) {
            wishlistCount.textContent = wishlistItems.length;
        }
        if (cartTotal) {
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `₹${total.toFixed(2)}`;
        }
    }
    
    updateCartDisplay();

    // ===== Add To Cart (global helper) =====
    function addToCartById(productId, qty = 1){
        if(!window.products || !productId) return;
        const p = window.products[productId];
        if(!p) return;
        let items = [];
        try { items = JSON.parse(localStorage.getItem('cartItems')||'[]') } catch {}
        const found = items.find(i => i.id === productId);
        if(found){ found.qty = Math.min(10, (found.qty||found.quantity||1) + qty); }
        else { items.push({ id: productId, name: p.name, price: p.price, qty: qty, image: (p.images&&p.images[0])||'' }); }
        localStorage.setItem('cartItems', JSON.stringify(items));
        // update badge
        if (cartCount) cartCount.textContent = items.length;
        // notify mini-cart to re-render on next open
        document.dispatchEvent(new CustomEvent('cart:updated'));
    }

    // Mini Cart (hover on header cart icon)
    const cartItemEl = document.querySelector('.action-item.cart-item');
    if (cartItemEl) {
        cartItemEl.style.position = 'relative';
        let panel = cartItemEl.querySelector('.mini-cart-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.className = 'mini-cart-panel';
            panel.innerHTML = '<div class="mini-cart-list"></div><div class="mini-cart-footer"><a class="mini-cart-view" href="cart.html">Show more →</a></div>';
            cartItemEl.appendChild(panel);
        }

        function renderMiniCart() {
            const list = panel.querySelector('.mini-cart-list');
            const items = JSON.parse(localStorage.getItem('cartItems')||'[]');
            list.innerHTML = '';
            (items || []).slice(0,3).forEach(it => {
                const row = document.createElement('div');
                row.className = 'mini-cart-row';
                row.innerHTML = `
                    <div class="mini-thumb"><img src="${it.image||''}" alt="${it.name||''}"></div>
                    <div class="mini-info">
                        <div class="mini-name">${it.name||''}</div>
                        <div class="mini-meta">Qty ${(it.qty||it.quantity||1)} · ₹${(it.price||0).toLocaleString()}</div>
                    </div>
                    <div class="mini-line">₹${(((it.price||0)*(it.qty||it.quantity||1))||0).toLocaleString()}</div>`;
                list.appendChild(row);
            });
        }

        cartItemEl.addEventListener('mouseenter', () => { renderMiniCart(); panel.classList.add('open'); });
        cartItemEl.addEventListener('mouseleave', () => { panel.classList.remove('open'); });
        // For touch/click
        cartItemEl.addEventListener('click', (e) => {
            const isLink = e.target.closest('a');
            if (!isLink) { e.preventDefault(); renderMiniCart(); panel.classList.toggle('open'); }
        });
    }
});

// ===========================================
// NEW MOBILE HEADER FUNCTIONALITY
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Header Elements
    const mobileHamburger = document.getElementById('mobileHamburger');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');

    // Mobile Hamburger Toggle
    if (mobileHamburger && mobileNavOverlay) {
        mobileHamburger.addEventListener('click', () => {
            mobileNavOverlay.classList.add('active');
            mobileHamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Mobile Nav Close
    if (mobileNavClose && mobileNavOverlay) {
        mobileNavClose.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            if (mobileHamburger) mobileHamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNavOverlay && mobileNavOverlay.classList.contains('active')) {
            if (!mobileNavOverlay.contains(e.target) && mobileHamburger && !mobileHamburger.contains(e.target)) {
                mobileNavOverlay.classList.remove('active');
                mobileHamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavOverlay && mobileNavOverlay.classList.contains('active')) {
            mobileNavOverlay.classList.remove('active');
            if (mobileHamburger) mobileHamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile nav when clicking on navigation links
    document.querySelectorAll('.mobile-nav-item').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
            if (mobileHamburger) mobileHamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

// ===========================================
// NEW FOOTER FUNCTIONALITY
// ===========================================

    // Newsletter subscription
    const nsEmailInput = document.getElementById('nsEmailInput');
    const nsSubscribeBtn = document.getElementById('nsSubscribeBtn');

    if (nsEmailInput && nsSubscribeBtn) {
        nsSubscribeBtn.addEventListener('click', function() {
            const email = nsEmailInput.value.trim();
            if (email && isValidEmail(email)) {
                alert('Thank you for subscribing to our newsletter!');
                nsEmailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });

        nsEmailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                nsSubscribeBtn.click();
            }
        });
    }

    // Social media buttons
    const socialButtons = ['nsTwitterBtn', 'nsFacebookBtn', 'nsLinkedinBtn', 'nsInstagramBtn'];
    socialButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = btnId.replace('ns', '').replace('Btn', '').toLowerCase();
                alert(`Redirecting to ${platform}...`);
            });
        }
    });

    // Payment badges hover effect
    const paymentBadges = ['nsVisaBadge', 'nsMcBadge', 'nsPpBadge', 'nsAeBadge', 'nsDcBadge'];
    paymentBadges.forEach(badgeId => {
        const badge = document.getElementById(badgeId);
        if (badge) {
            badge.addEventListener('mouseenter', function() {
                this.style.background = '#00bfff';
                this.style.borderColor = '#00bfff';
            });
            badge.addEventListener('mouseleave', function() {
                this.style.background = '#333333';
                this.style.borderColor = '#444444';
            });
        }
    });

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===========================================
    // HERO SLIDER FUNCTIONALITY
    // ===========================================

    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.hero-indicator');
    const heroPrevBtn = document.getElementById('heroPrevBtn');
    const heroNextBtn = document.getElementById('heroNextBtn');
    let currentHeroSlide = 0;
    let heroSlideInterval;

    function showHeroSlide(index) {
        // Remove active class from all slides and indicators
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        heroSlides[index].classList.add('active');
        heroIndicators[index].classList.add('active');
        
        currentHeroSlide = index;
    }

    function nextHeroSlide() {
        const nextIndex = (currentHeroSlide + 1) % heroSlides.length;
        showHeroSlide(nextIndex);
    }

    function prevHeroSlide() {
        const prevIndex = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
        showHeroSlide(prevIndex);
    }

    function startHeroAutoSlide() {
        heroSlideInterval = setInterval(nextHeroSlide, 6000); // Change slide every 6 seconds
    }

    function stopHeroAutoSlide() {
        clearInterval(heroSlideInterval);
    }

    // Event listeners for hero slider
    if (heroNextBtn) {
        heroNextBtn.addEventListener('click', () => {
            nextHeroSlide();
            stopHeroAutoSlide();
            startHeroAutoSlide();
        });
    }

    if (heroPrevBtn) {
        heroPrevBtn.addEventListener('click', () => {
            prevHeroSlide();
            stopHeroAutoSlide();
            startHeroAutoSlide();
        });
    }

    // Hero indicator click events
    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showHeroSlide(index);
            stopHeroAutoSlide();
            startHeroAutoSlide();
        });
    });

    // Pause auto-slide on hover for hero slider
    const heroSliderContainer = document.querySelector('.hero-slider-container');
    if (heroSliderContainer) {
        heroSliderContainer.addEventListener('mouseenter', stopHeroAutoSlide);
        heroSliderContainer.addEventListener('mouseleave', startHeroAutoSlide);
    }

    // Start hero auto-slide
    if (heroSlides.length > 0) {
        startHeroAutoSlide();
    }

        // Enhanced smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                // Skip if href is just "#"
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
        });
        }
    });
});

// Product Interaction Functions
function setupProductInteractions() {
    // Quick View functionality
    document.querySelectorAll('.hero-product-quick-view').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.hero-product-card');
            const productName = productCard.querySelector('.hero-product-name').textContent;
            const productId = getProductIdFromName(productName);
            
            if (productId) {
                showQuickViewModal(productId);
            }
        });
    });
    
    // Product name click to navigate to detail page
    document.querySelectorAll('.hero-product-name').forEach(nameElement => {
        nameElement.style.cursor = 'pointer';
        nameElement.addEventListener('click', function() {
            const productName = this.textContent;
            const productId = getProductIdFromName(productName);
            
            if (productId) {
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    });
    
    // Add to cart for Hero cards
    document.querySelectorAll('.hero-product-btn').forEach(btn => {
        btn.addEventListener('click', function(){
            const card = this.closest('.hero-product-card');
            const name = card?.querySelector('.hero-product-name')?.textContent || '';
            const id = getProductIdFromName(name);
            if(id) addToCartById(id, 1);
        });
    });

    // Top Deals Quick View functionality
    document.querySelectorAll('.deal-quick-view').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.deal-product-card');
            const productName = productCard.querySelector('.deal-product-name').textContent;
            const productId = getDealProductIdFromName(productName);
            
            if (productId) {
                showQuickViewModal(productId);
            }
        });
    });
    
    // Top Deals product name click to navigate to detail page
    document.querySelectorAll('.deal-product-name').forEach(nameElement => {
        nameElement.style.cursor = 'pointer';
        nameElement.addEventListener('click', function() {
            const productName = this.textContent;
            const productId = getDealProductIdFromName(productName);
            
            if (productId) {
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    });

    // Add to cart for Top Deals cards
    document.querySelectorAll('.deal-product-btn').forEach(btn => {
        btn.addEventListener('click', function(){
            const card = this.closest('.deal-product-card');
            const name = card?.querySelector('.deal-product-name')?.textContent || '';
            const id = getDealProductIdFromName(name) || getProductIdFromName(name);
            if(id) addToCartById(id, 1);
        });
    });
}

function getProductIdFromName(productName) {
    const nameToIdMap = {
        'Sony WH-1000XM4': 'sony-wh-1000xm4',
        'Apple Watch Series 9': 'apple-watch-series-9',
        'Nike Air Max 270': 'nike-air-max-270',
        'iPhone 15 Pro': 'iphone-15-pro'
    };
    return nameToIdMap[productName];
}

function getDealProductIdFromName(productName) {
    const nameToIdMap = {
        'Sony WH-1000XM5': 'sony-wh-1000xm5',
        'MacBook Pro M3': 'macbook-pro-m3',
        'Nike Air Jordan 1': 'nike-air-jordan-1',
        'Samsung Galaxy S24 Ultra': 'samsung-galaxy-s24-ultra'
    };
    return nameToIdMap[productName];
}

function showQuickViewModal(productId) {
    const product = products[productId];
    if (!product) return;
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'quick-view-modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'quick-view-modal-content';
    modalContent.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        padding: 50px 30px;
        max-width: 750px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; gap: 20px; align-items: flex-start;">
            <div style="flex: 1;">
                <img src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px;">
            </div>
            <div style="flex: 1;">
                <h3 style="color: #e0a3ff; margin-bottom: 10px; font-size: 1.5rem;">${product.name}</h3>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <span style="color: #ffd700;">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</span>
                    <span style="color: #ccc; font-size: 0.9rem;">(${product.reviewCount})</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <span style="color: #00ff88; font-weight: 700; font-size: 1.5rem;">₹${product.price.toLocaleString()}</span>
                    <span style="color: #999; text-decoration: line-through;">₹${product.originalPrice.toLocaleString()}</span>
                    <span style="background: linear-gradient(135deg, #ff69b4, #e0a3ff); color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.9rem;">${product.discount}% OFF</span>
                </div>
                <p style="color: #ccc; line-height: 1.6; margin-bottom: 20px;">${product.description}</p>
                <div style="display: flex; gap: 10px;">
                    <button onclick="window.location.href='product-detail.html?id=${product.id}'" style="flex: 1; padding: 12px 20px; background: linear-gradient(135deg, #e0a3ff, #ff69b4); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 600;">View Details</button>
                    <button onclick="closeQuickViewModal()" style="padding: 12px 20px; background: rgba(255, 255, 255, 0.1); color: #e0a3ff; border: 1px solid rgba(224, 163, 255, 0.3); border-radius: 25px; cursor: pointer;">Close</button>
                </div>
            </div>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Animate modal in
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close modal on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeQuickViewModal();
        }
    });
    
    // Store modal reference for closing
    window.currentQuickViewModal = modalOverlay;
}

function closeQuickViewModal() {
    const modal = window.currentQuickViewModal;
    if (modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('.quick-view-modal-content');
        content.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            modal.remove();
            window.currentQuickViewModal = null;
        }, 300);
    }
}

        // Header functionality removed - using CSS sticky instead

        // Active menu item highlighting
        function updateActiveMenuItem() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link, .mobile-nav a');
            
            let currentSection = '';
            const scrollPos = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveMenuItem);
        window.addEventListener('load', updateActiveMenuItem);

        // Parallax effect for geometric shapes
        window.addEventListener('scroll', () => {
            const shapes = document.querySelectorAll('.shape');
            const scrolled = window.pageYOffset;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.3;
                shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });

        // Neural lines pulse effect
        const neuralLines = document.querySelectorAll('.neural-line');
        setInterval(() => {
            neuralLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'scaleX(1.2)';
                    setTimeout(() => {
                        line.style.opacity = '0.2';
                        line.style.transform = 'scaleX(0.5)';
                    }, 200);
                }, index * 300);
            });
        }, 2000);

        // Enhanced particle generation
        function createQuantumParticle() {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = Math.random() * 4 + 1 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = ['#00ffff', '#ff0080', '#8000ff'][Math.floor(Math.random() * 3)];
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100vh';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '-1';
            particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
            
            document.body.appendChild(particle);
            
            const duration = Math.random() * 3000 + 2000;
            const drift = (Math.random() - 0.5) * 200;
            
            particle.animate([
                { transform: 'translateY(0px) translateX(0px)', opacity: 0 },
                { transform: `translateY(-100vh) translateX(${drift}px)`, opacity: 1 }
            ], {
                duration: duration,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }

        // Generate quantum particles
        setInterval(createQuantumParticle, 1500);

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe timeline items and hexagons
        document.querySelectorAll('.timeline-content, .hexagon').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });

        // Navigation functionality is now handled by nav-link styles

        // E-commerce functionality
        let cartCount = 0;
        const cartCountElement = document.querySelector('.cart-count');
        
        // Product functionality
        setupProductInteractions();
        
        // Add to cart functionality
        document.querySelectorAll('.product-card').forEach(card => {
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart-btn';
            addToCartBtn.innerHTML = 'Add to Cart';
            addToCartBtn.style.cssText = `
                width: 100%;
                padding: 12px;
                background: linear-gradient(45deg, #e0a3ff, #ff69b4);
                border: none;
                border-radius: 10px;
                color: #000;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 15px;
            `;
            
            addToCartBtn.addEventListener('click', function() {
                cartCount++;
                cartCountElement.textContent = cartCount;
                this.innerHTML = 'Added!';
                this.style.background = 'linear-gradient(45deg, #00ff00, #00ffff)';
                
                setTimeout(() => {
                    this.innerHTML = 'Add to Cart';
                    this.style.background = 'linear-gradient(45deg, #e0a3ff, #ff69b4)';
                }, 1500);
            });
            
            card.querySelector('.product-info').appendChild(addToCartBtn);
        });

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log('Searching for:', searchTerm);
                // Add search functionality here
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });

        // Newsletter subscription
        const newsletterBtn = document.querySelector('.newsletter-btn');
        const newsletterInput = document.querySelector('.newsletter-input');
        
        if (newsletterBtn && newsletterInput) {
            newsletterBtn.addEventListener('click', function() {
                const email = newsletterInput.value.trim();
                if (email) {
                    this.innerHTML = 'Subscribed!';
                    this.style.background = 'linear-gradient(45deg, #00ff00, #00ffff)';
                    
                    setTimeout(() => {
                        this.innerHTML = 'Subscribe';
                        this.style.background = 'linear-gradient(45deg, #e0a3ff, #ff69b4)';
                        newsletterInput.value = '';
                    }, 2000);
                }
            });
        }

        // Form submission effect
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            this.innerHTML = 'TRANSMITTING...';
            this.style.background = 'linear-gradient(45deg, #8000ff, #00ffff)';
            
            setTimeout(() => {
                this.innerHTML = 'TRANSMISSION COMPLETE';
                this.style.background = 'linear-gradient(45deg, #00ff00, #00ffff)';
                
                setTimeout(() => {
                    this.innerHTML = 'TRANSMIT TO MATRIX';
                    this.style.background = 'linear-gradient(45deg, #00ffff, #ff0080)';
                }, 2000);
            }, 1500);
        });
        }