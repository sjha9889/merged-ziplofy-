// Starfield Background Animation
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');
        let stars = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 1000;
                this.prevX = this.x;
                this.prevY = this.y;
            }

            update() {
                this.z -= 2;
                if (this.z <= 0) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.z = 1000;
                    this.prevX = this.x;
                    this.prevY = this.y;
                }

                this.prevX = this.x;
                this.prevY = this.y;

                this.x = (this.x - canvas.width / 2) * (1000 / this.z) + canvas.width / 2;
                this.y = (this.y - canvas.height / 2) * (1000 / this.z) + canvas.height / 2;
            }

            draw() {
                const opacity = Math.max(0, 1 - this.z / 1000);
                const size = Math.max(0, (1000 - this.z) / 1000 * 3);

                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.fillStyle = '#f8fafc';
                ctx.fill();

                // Draw trail
                if (size > 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.prevX, this.prevY);
                    ctx.lineTo(this.x, this.y);
                    ctx.strokeStyle = '#8b5cf6';
                    ctx.lineWidth = size * 0.5;
                    ctx.stroke();
                }
                ctx.restore();
            }
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < 800; i++) {
                stars.push(new Star());
            }
        }

        function animate() {
            ctx.fillStyle = 'rgba(15, 15, 35, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.update();
                star.draw();
            });

            requestAnimationFrame(animate);
        }

        // Create floating cosmic particles
        function createCosmicParticles() {
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'cosmic-particle';
                particle.style.width = Math.random() * 6 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                particle.style.animationDuration = Math.random() * 4 + 6 + 's';
                document.body.appendChild(particle);
            }
        }

        // Mission Tabs Functionality
        const missionTabs = document.querySelectorAll('.mission-tab');
        const missionContents = document.querySelectorAll('.mission-content');

        missionTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                missionTabs.forEach(t => t.classList.remove('active'));
                missionContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Show corresponding content
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Initialize animations
        initStars();
        animate();
        createCosmicParticles();

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (mobileToggle && navMenu) {
            function openDrawer(){
                navMenu.classList.add('active');
                mobileToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
                // add backdrop
                let bd = document.getElementById('drawer-backdrop');
                if (!bd){
                    bd = document.createElement('div');
                    bd.id = 'drawer-backdrop';
                    bd.className = 'drawer-backdrop';
                    document.body.appendChild(bd);
                    bd.addEventListener('click', closeDrawer);
                }
            }
            function closeDrawer(){
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
                const bd = document.getElementById('drawer-backdrop');
                if (bd) bd.remove();
            }

            mobileToggle.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) closeDrawer(); else openDrawer();
            });

            // Close menu when clicking on overlay
            navMenu.addEventListener('click', function(e) {
                if (e.target === navMenu || e.target.classList.contains('nav-menu')) {
                    // ignore clicks inside panel
                }
            });

            // Close menu when clicking on menu links
            const menuLinks = navMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    closeDrawer();
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) closeDrawer();
            });
        }

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });


        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Set active nav link based on URL (works for mobile drawer too)
        (function(){
            const currentPath = location.pathname.split('/').pop() || 'index.html';
            const links = document.querySelectorAll('nav a, .nav-list a');
            links.forEach(a => {
                try {
                    const href = a.getAttribute('href');
                    if (!href) return;
                    const linkPath = href.split('/').pop();
                    if (linkPath === currentPath) {
                        a.classList.add('active');
                    }
                } catch(e){}
            });
        })();

        // Inject drawer header with logo and close button for mobile menu
        (function(){
            const nav = document.getElementById('nav-menu');
            if (!nav) return;
            const header = document.createElement('div');
            header.className = 'drawer-header';
            header.innerHTML = `
                <a href="index.html" class="drawer-logo">
                    <span class="drawer-logo-icon">
                        <svg width="34" height="34" viewBox="0 0 45 45" fill="none" aria-hidden="true">
                            <circle cx="22.5" cy="22.5" r="20" stroke="url(#logoGradient1)" stroke-width="2.5"/>
                            <path d="M15 22.5L21 28.5L30 15" stroke="url(#logoGradient2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <defs>
                                <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#8B5CF6"/>
                                    <stop offset="100%" style="stop-color:#F59E0B"/>
                                </linearGradient>
                                <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#F59E0B"/>
                                    <stop offset="100%" style="stop-color:#EC4899"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                    <span class="drawer-logo-text">
                        <strong>ELECTRO</strong><em>Tech & Electronics</em>
                    </span>
                </a>
                <button class="drawer-close" id="drawer-close" aria-label="Close menu"><i class="fas fa-times"></i></button>`;
            // Insert at top if not already present
            if (!nav.querySelector('.drawer-header')) {
                nav.prepend(header);
            }
            const closeBtn = nav.querySelector('#drawer-close');
            const toggle = document.getElementById('mobile-toggle');
            if (closeBtn && toggle) {
                closeBtn.addEventListener('click', ()=>{
                    nav.classList.remove('active');
                    toggle.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        })();

        // Carousel Controls (Trending Now)
        (function(){
            function getTrack(selector){ return document.querySelector(selector); }
            function scrollByAmount(track, dir){ if(!track) return; const card = track.querySelector('.trend-card'); const step = card ? card.offsetWidth + 18 : 260; track.scrollBy({ left: dir * step, behavior: 'smooth' }); }
            document.querySelectorAll('.carousel-btn').forEach(btn=>{
                btn.addEventListener('click', function(){ const target = this.getAttribute('data-target'); const track = getTrack(target); const dir = this.classList.contains('next') ? 1 : -1; scrollByAmount(track, dir); });
            });
        })();

        // Video Modal (Spotlight)
        (function(){
            const open = document.getElementById('open-video-modal');
            const modal = document.getElementById('video-modal');
            const closeBtn = document.getElementById('close-video-modal');
            const iframe = document.getElementById('spotlight-iframe');
            const defaultEmbed = 'https://www.youtube.com/embed/aqz-KE-bpKQ'; // Big Buck Bunny demo
            if(open && modal && closeBtn && iframe){
                open.addEventListener('click', ()=>{ 
                    const dataUrl = open.getAttribute('data-video') || defaultEmbed;
                    const url = dataUrl.includes('autoplay') ? dataUrl : `${dataUrl}?autoplay=1&rel=0`;
                    modal.classList.add('active'); 
                    iframe.src = url; 
                    modal.setAttribute('aria-hidden','false'); 
                });
                function close(){ modal.classList.remove('active'); iframe.src = ''; modal.setAttribute('aria-hidden','true'); }
                closeBtn.addEventListener('click', close);
                modal.addEventListener('click', (e)=>{ if(e.target === modal) close(); });
                document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && modal.classList.contains('active')) close(); });
            }
        })();

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Fade in sections
            const sections = document.querySelectorAll('.fade-in');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    section.classList.add('visible');
                }
            });
        });

        // E-commerce Functionality
        const SHOP_STORAGE_KEYS = {
            cart: 'cosmic_store_cart',
            wishlist: 'cosmic_store_wishlist'
        };

        let cart = loadCart();
        let wishlist = new Set(loadWishlist());
        updateCartCount();
        updateWishlistCount();
        refreshActionStates();

        window.WishlistActions = {
            add(productId, options = {}) {
                updateWishlistEntry(productId, 'add', options);
            },
            remove(productId, options = {}) {
                updateWishlistEntry(productId, 'remove', options);
            },
            toggle(productId, options = {}) {
                toggleWishlist(productId, options);
            },
            clear(options = {}) {
                clearWishlist(options);
            },
            ids() {
                return Array.from(wishlist);
            },
            has(productId) {
                return wishlist.has(productId);
            }
        };

        document.addEventListener('click', (event) => {
            const addButton = event.target.closest('.add-to-cart-btn');
            if (!addButton) return;
            const productId = addButton.getAttribute('data-product');
            if (!productId) return;
            event.preventDefault();
            addProductToCart(productId);
        });

        document.addEventListener('click', (event) => {
            const actionButton = event.target.closest('[data-product-action], .quick-view-btn, .wishlist-btn');
            if (!actionButton) return;

            let action = actionButton.getAttribute('data-product-action');
            if (!action) {
                if (actionButton.classList.contains('quick-view-btn')) {
                    action = 'quick-view';
                } else if (actionButton.classList.contains('wishlist-btn')) {
                    action = 'wishlist';
                }
            }
            if (!action) return;

            const productId = actionButton.getAttribute('data-product') || actionButton.getAttribute('data-product-id');
            if (!productId) return;

            event.preventDefault();
            event.stopPropagation();

            if (action === 'wishlist') {
                toggleWishlist(productId);
            } else if (action === 'quick-view') {
                window.location.href = `product-details.html?id=${encodeURIComponent(productId)}`;
            }
        });

        document.addEventListener('shop:products-rendered', () => {
            refreshActionStates();
        });

        function loadCart() {
            try {
                const stored = JSON.parse(localStorage.getItem(SHOP_STORAGE_KEYS.cart));
                return Array.isArray(stored) ? stored : [];
            } catch {
                return [];
            }
        }

        function loadWishlist() {
            try {
                const stored = JSON.parse(localStorage.getItem(SHOP_STORAGE_KEYS.wishlist));
                return Array.isArray(stored) ? stored : [];
            } catch {
                return [];
            }
        }

        function saveCart() {
            localStorage.setItem(SHOP_STORAGE_KEYS.cart, JSON.stringify(cart));
        }

        function saveWishlist() {
            localStorage.setItem(SHOP_STORAGE_KEYS.wishlist, JSON.stringify(Array.from(wishlist)));
        }

        function findProduct(productId) {
            if (!Array.isArray(PRODUCTS)) return null;
            return PRODUCTS.find(item => String(item.id) === String(productId));
        }

        function addProductToCart(productId) {
            const product = findProduct(productId);
            if (!product) {
                showNotification('Product not found', 'error');
                return;
            }

            const existingItem = cart.find(item => String(item.id) === String(product.id));
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + 1;
                hydrateCartSnapshot(existingItem, product);
            } else {
                cart.push({
                    id: product.id,
                    quantity: 1,
                    ...buildCartSnapshot(product)
                });
            }

            saveCart();
            updateCartCount();
            document.dispatchEvent(new CustomEvent('shop:cart-updated', { detail: { cart } }));
            showNotification(`${product.title} added to cart!`, 'success');
        }

        function buildCartSnapshot(product) {
            return {
                title: product.title,
                category: product.category,
                image: product.image,
                price: product.price,
                originalPrice: product.originalPrice,
                rating: product.rating,
                reviewCount: product.reviewCount
            };
        }

        function hydrateCartSnapshot(cartItem, product) {
            cartItem.title = product.title;
            cartItem.category = product.category;
            cartItem.image = product.image;
            cartItem.price = product.price;
            cartItem.originalPrice = product.originalPrice;
            cartItem.rating = product.rating;
            cartItem.reviewCount = product.reviewCount;
        }

        function toggleWishlist(productId, options = {}) {
            const targetAction = wishlist.has(productId) ? 'remove' : 'add';
            updateWishlistEntry(productId, targetAction, options);
        }

        function clearWishlist(options = {}) {
            if (!wishlist.size) {
                return;
            }
            wishlist.clear();
            saveWishlist();
            updateWishlistCount();
            refreshActionStates();
            if (!options.silent) {
                showNotification('Wishlist cleared', 'info');
            }
            document.dispatchEvent(new CustomEvent('shop:wishlist-updated'));
        }

        function updateWishlistEntry(productId, action, options = {}) {
            if (!productId) return;
            const silent = Boolean(options.silent);
            if (action === 'add') {
                if (wishlist.has(productId)) return;
                wishlist.add(productId);
                if (!silent) {
                showNotification('Added to wishlist!', 'success');
            }
            } else if (action === 'remove') {
                if (!wishlist.has(productId)) return;
                wishlist.delete(productId);
                if (!silent) {
                    showNotification('Removed from wishlist', 'info');
                }
            }
            saveWishlist();
            updateWishlistCount();
            refreshActionStates();
            document.dispatchEvent(new CustomEvent('shop:wishlist-updated'));
        }

        function updateCartCount() {
            const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
            document.querySelectorAll('.cart-count').forEach(element => {
                element.textContent = count > 0 ? String(count) : '0';
            });
        }

        function updateWishlistCount() {
            document.querySelectorAll('.wishlist-count').forEach(element => {
                element.textContent = wishlist.size > 0 ? String(wishlist.size) : '0';
            });
        }

        window.ShopCounts = {
            updateCartCount,
            updateWishlistCount
        };

        function refreshActionStates() {
            const wishlistButtons = document.querySelectorAll('[data-product-action="wishlist"]');
            wishlistButtons.forEach(button => {
                const productId = button.getAttribute('data-product');
                if (wishlist.has(productId)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }

        function formatCurrency(value) {
            if (typeof value !== 'number') return value || '';
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(value);
        }

        function renderStars(rating) {
            const fullStars = Math.round(rating);
            let stars = '';
            for (let i = 0; i < 5; i += 1) {
                stars += i < fullStars ? '★' : '☆';
            }
            return stars;
        }

        
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
                }
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = searchInput.value.trim();
                    if (searchTerm) {
                        window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
                    }
                }
            });
        }
        
        // Newsletter subscription
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                if (email) {
                    showNotification('Thank you for subscribing!', 'success');
                    newsletterForm.reset();
                }
            });
        }
        
        // Notification system
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // Add styles
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? 'var(--solar-gold)' : type === 'error' ? 'var(--nebula-pink)' : 'var(--galaxy-violet)'};
                color: var(--space-black);
                padding: 15px 25px;
                border-radius: 10px;
                font-family: 'Rajdhani', sans-serif;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
        
        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Initialize cart count on page load
        updateCartCount();
        
        // Account page tab functionality
        const tabBtns = document.querySelectorAll('.tab-btn');
        const formContents = document.querySelectorAll('.form-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabBtns.forEach(t => t.classList.remove('active'));
                formContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                
                // Show corresponding content
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
		
		// Active menu highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul a');
    
    // Create an Intersection Observer
    const observerOptions = {
        root: null, // viewport is the root
        rootMargin: '-30% 0px -70% 0px', // consider section visible when it's 30% from the top and 70% from the bottom
        threshold: 0
    };
    
    function onIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the id of the section that's in view
                const activeId = entry.target.getAttribute('id');
                
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to the link that corresponds to the section in view
                const activeLink = document.querySelector(`nav ul a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    const observer = new IntersectionObserver(onIntersect, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Set home as active by default when page loads
    document.addEventListener('DOMContentLoaded', () => {
        navLinks[0].classList.add('active');
    });
    
    // Update active state when clicking on navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

        // Product Details Page Functionality
        if (document.querySelector('.product-details-section')) {
            // Thumbnail image switching
            const thumbnails = document.querySelectorAll('.thumbnail');
            const mainImage = document.getElementById('main-product-image');

            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', () => {
                    // Remove active class from all thumbnails
                    thumbnails.forEach(t => t.classList.remove('active'));
                    // Add active class to clicked thumbnail
                    thumbnail.classList.add('active');
                    // Update main image
                    const newSrc = thumbnail.getAttribute('data-main');
                    mainImage.src = newSrc;
                });
            });

            // Color option selection
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', () => {
                    colorOptions.forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                });
            });

            // Quantity selector
            const minusBtn = document.querySelector('.qty-btn.minus');
            const plusBtn = document.querySelector('.qty-btn.plus');
            const qtyInput = document.querySelector('.qty-input');

            if (minusBtn && plusBtn && qtyInput) {
                minusBtn.addEventListener('click', () => {
                    let currentValue = parseInt(qtyInput.value);
                    if (currentValue > 1) {
                        qtyInput.value = currentValue - 1;
                    }
                });

                plusBtn.addEventListener('click', () => {
                    let currentValue = parseInt(qtyInput.value);
                    const maxValue = parseInt(qtyInput.getAttribute('max'));
                    if (currentValue < maxValue) {
                        qtyInput.value = currentValue + 1;
                    }
                });
            }

            // Product tabs functionality
            const tabBtns = document.querySelectorAll('.product-tabs .tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetTab = btn.getAttribute('data-tab');
                    
                    // Remove active class from all tabs and contents
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    btn.classList.add('active');
                    document.getElementById(targetTab).classList.add('active');
                });
            });

            // Buy Now button functionality
            const buyNowBtn = document.querySelector('.buy-now-btn');
            if (buyNowBtn) {
                buyNowBtn.addEventListener('click', () => {
                    // Add to cart first
                    const addToCartBtn = document.querySelector('.add-to-cart-btn');
                    if (addToCartBtn) {
                        addToCartBtn.click();
                    }
                    // Redirect to checkout
                    setTimeout(() => {
                        window.location.href = 'checkout.html';
                    }, 500);
                });
            }
        }

        // Remove specific footer items across all pages
        document.addEventListener('DOMContentLoaded', () => {
            try {
                const removeByText = ['Toys & Games', 'Automotive', 'Social Responsibility'];
                document.querySelectorAll('.footer-links a').forEach(a => {
                    const text = a.textContent.trim();
                    const href = a.getAttribute('href') || '';
                    if (removeByText.includes(text) || href.includes('cat=toys') || href.includes('cat=automotive')) {
                        const li = a.closest('li');
                        if (li && li.parentElement) li.parentElement.removeChild(li);
                        else a.remove();
                    }
                });
                // Remove any social icon blocks entirely
                document.querySelectorAll('.social-icons').forEach(el => el.remove());
            } catch (e) { /* noop */ }
        });

    // Dashboard Page Functionality
    if (document.querySelector('.dashboard-section')) {
        // Dashboard navigation
        const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
        const dashboardTabs = document.querySelectorAll('.dashboard-tab');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = item.getAttribute('href').substring(1);
                
                // Remove active class from all nav items and tabs
                navItems.forEach(nav => nav.classList.remove('active'));
                dashboardTabs.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked nav item and corresponding tab
                item.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Wishlist functionality
        const wishlistItems = document.querySelectorAll('.wishlist-item .add-to-cart');
        const removeBtns = document.querySelectorAll('.wishlist-item .remove');

        wishlistItems.forEach(btn => {
            btn.addEventListener('click', () => {
                showNotification('Item added to cart!', 'success');
                // Here you would add the item to cart
            });
        });

        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const wishlistItem = btn.closest('.wishlist-item');
                wishlistItem.style.opacity = '0';
                wishlistItem.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    wishlistItem.remove();
                    showNotification('Item removed from wishlist', 'info');
                }, 300);
            });
        });

        // Order status filter
        const statusFilter = document.querySelector('.status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                const selectedStatus = e.target.value;
                const tableRows = document.querySelectorAll('.table-row');
                
                tableRows.forEach(row => {
                    if (selectedStatus === 'all') {
                        row.style.display = 'grid';
                    } else {
                        const statusElement = row.querySelector('.status');
                        if (statusElement) {
                            const rowStatus = statusElement.classList.contains(selectedStatus);
                            row.style.display = rowStatus ? 'grid' : 'none';
                        }
                    }
                });
            });
        }

        // Profile form submission
        const profileForm = document.querySelector('.profile-form');
        if (profileForm) {
            const saveBtn = profileForm.querySelector('.save-btn');
            const cancelBtn = profileForm.querySelector('.cancel-btn');

            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Profile updated successfully!', 'success');
            });

            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Reset form to original values
                const inputs = profileForm.querySelectorAll('.form-input');
                inputs.forEach(input => {
                    input.value = input.defaultValue;
                });
                showNotification('Changes cancelled', 'info');
            });
        }
    }

    // Checkout Page Functionality
    if (document.querySelector('.checkout-section')) {
        // Payment method selection
        const paymentOptions = document.querySelectorAll('input[name="payment"]');
        const creditCardForm = document.querySelector('.credit-card-form');

        paymentOptions.forEach(option => {
            option.addEventListener('change', () => {
                if (option.value === 'credit-card') {
                    creditCardForm.style.display = 'block';
                } else {
                    creditCardForm.style.display = 'none';
                }
            });
        });

        // Place order button
        const placeOrderBtn = document.querySelector('.place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Validate form
                const requiredFields = document.querySelectorAll('input[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.style.borderColor = '#ef4444';
                    } else {
                        field.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                    }
                });
                
                if (isValid) {
                    showNotification('Order placed successfully!', 'success');
                    // Here you would process the order
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                } else {
                    showNotification('Please fill in all required fields', 'error');
                }
            });
        }

        // Form validation
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                }
            });
        });
    }
