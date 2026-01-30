/**
 * ShoppingCart - Complete JavaScript Functionality
 * Converted from WordPress theme with all features
 */

(function($) {
    'use strict';

    // Document Ready
    $(document).ready(function() {
        
        // Initialize all functions
        initAppHeader();
        initGoToTop();
        initSmoothScroll();
        initCartFunctionality();
        initWishlistFunctionality();
        initSearchFunctionality();
        initMobileMenu();
        initProductHover();
        initAnimations();
        initStickyHeader();
        initLazyLoading();
        initFormValidation();
        initCarousel();
        initNewsletter();
        initProductFilters();
        initQuantityControls();
        initImageZoom();
        initTooltips();
        initPopovers();
        initTabs();
        initAccordion();
        initProgressBars();
        initNotifications();
        
    });

    // Go to Top Button
    function initGoToTop() {
        const goToTopBtn = $('#goToTop');
        
        // Show/hide button based on scroll position
        $(window).scroll(function() {
            if ($(this).scrollTop() > 300) {
                goToTopBtn.addClass('show');
            } else {
                goToTopBtn.removeClass('show');
            }
        });
        
        // Smooth scroll to top
        goToTopBtn.click(function(e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 800);
        });
    }

    // New App Header: inject across all pages and remove legacy header
    function initAppHeader() {
        try {
            // Ensure new header CSS is loaded
            if (!document.querySelector('link[href*="assets/css/new-header.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'assets/css/new-header.css';
                document.head.appendChild(link);
            }

            // Remove old header if present
            $('.site-header').remove();

            // If already present, skip
            if (document.querySelector('#app-header')) return;

            // Build header HTML
            const headerHtml = `
            <header id="app-header" class="app-header">
                <div class="container">
                    <div class="header-inner">
                        <div class="hamburger">
                            <button id="app-menu-toggle" aria-label="Menu"><i class="fas fa-bars"></i></button>
                        </div>
                        <div class="logo">
                            <a href="index.html"><i class="fas fa-store"></i> ShoppingMart</a>
                        </div>
                        <div class="search-inline d-none d-md-block">
                            <form class="search-form" action="shop.html">
                                <div class="input-group">
                                    <input type="search" class="form-control" placeholder="Search products..." />
                                    <button class="btn btn-primary" type="submit"><i class="fas fa-search"></i></button>
                                </div>
                            </form>
                        </div>
                        <div class="actions">
                            <a class="btn-icon wishlist-btn" href="wishlist.html" title="Wishlist"><i class="fas fa-heart"></i></a>
                            <a class="btn-icon cart-btn" id="app-cart-btn" href="cart.html" title="Cart"><i class="fas fa-shopping-cart"></i></a>
                            <a class="btn btn-primary d-none d-md-inline-block" href="login.html">Login</a>
                        </div>
                    </div>
                    <div class="search-row">
                        <form class="search-form" action="shop.html">
                            <div class="input-group">
                                <input type="search" class="form-control" placeholder="Search products..." />
                                <button class="btn btn-primary" type="submit"><i class="fas fa-search"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="nav-bar">
                    <div class="container">
                        <ul class="nav">
                            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                            <li class="nav-item"><a class="nav-link" href="shop.html">Shop</a></li>
                            <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
                            <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
                            <li class="nav-item"><a class="nav-link" href="blog.html">Blog</a></li>
                        </ul>
                    </div>
                </div>
            </header>`;

            // Prepend to body
            document.body.insertAdjacentHTML('afterbegin', headerHtml);

            // Elevation on scroll and spacer to offset fixed header
            const appHeader = document.getElementById('app-header');
            let headerSpacer = document.getElementById('app-header-spacer');
            if (!headerSpacer) {
                headerSpacer = document.createElement('div');
                headerSpacer.id = 'app-header-spacer';
                appHeader.insertAdjacentElement('afterend', headerSpacer);
            }
            function setHeaderSpacerHeight() {
                // Calculate current header height and clamp to avoid excessive spacing
                const rect = appHeader.getBoundingClientRect();
                const raw = rect.height || appHeader.offsetHeight;
                const max = (window.innerWidth >= 992) ? 120 : 140; // desktop/mobile caps
                const h = Math.min(raw, max);
                headerSpacer.style.height = h + 'px';
            }
            // Initial after CSS loads
            window.addEventListener('load', setHeaderSpacerHeight);
            // Next animation frame to catch async CSS
            requestAnimationFrame(setHeaderSpacerHeight);
            // On resize
            window.addEventListener('resize', setHeaderSpacerHeight);
            // Observe header size changes (safer)
            if (window.ResizeObserver) {
                const ro = new ResizeObserver(setHeaderSpacerHeight);
                ro.observe(appHeader);
            }
            window.addEventListener('scroll', () => {
                if (window.scrollY > 10) appHeader.classList.add('elevated');
                else appHeader.classList.remove('elevated');
            }, { passive: true });

            // Cart icon behavior: open cart sidebar if available
            const appCartBtn = document.getElementById('app-cart-btn');
            if (appCartBtn) {
                appCartBtn.addEventListener('click', function(e) {
                    try {
                        if (window.CartSidebar && typeof window.CartSidebar.open === 'function') {
                            e.preventDefault();
                            window.CartSidebar.open();
                        }
                    } catch (_) { /* noop */ }
                });
            }

            // Inject drawer and overlay for mobile
            const drawerHtml = `
                <div id="app-drawer-overlay" class="app-drawer-overlay"></div>
                <aside id="app-drawer" class="app-drawer" aria-hidden="true" aria-label="Mobile menu">
                    <div class="drawer-header">
                        <span class="title">Menu</span>
                        <button class="drawer-close" id="app-drawer-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="drawer-body">
                        <div class="drawer-section">
                            <div class="drawer-section-title">Navigation</div>
                            <ul class="drawer-nav">
                                <li><a href="index.html">Home</a></li>
                                <li><a href="shop.html">Shop</a></li>
                                <li><a href="about.html">About</a></li>
                                <li><a href="contact.html">Contact</a></li>
                                <li><a href="blog.html">Blog</a></li>
                            </ul>
                        </div>
                        <div class="drawer-section">
                            <div class="drawer-section-title">Categories</div>
                            <div class="chip-row">
                                <a class="chip" href="shop.html">Headphones</a>
                                <a class="chip" href="shop.html">Speakers</a>
                                <a class="chip" href="shop.html">Smartwatch</a>
                                <a class="chip" href="shop.html">Cameras</a>
                                <a class="chip" href="shop.html">Gaming</a>
                                <a class="chip" href="shop.html">Accessories</a>
                            </div>
                        </div>
                    </div>
                    <div class="drawer-footer">
                        <a href="login.html" class="btn btn-outline-secondary w-100 mb-2">Login</a>
                        <a href="register.html" class="btn btn-primary w-100">Create Account</a>
                    </div>
                </aside>`;
            document.body.insertAdjacentHTML('beforeend', drawerHtml);

            const drawer = document.getElementById('app-drawer');
            const overlay = document.getElementById('app-drawer-overlay');
            const btnOpen = document.getElementById('app-menu-toggle');
            const btnClose = document.getElementById('app-drawer-close');

            function openDrawer() {
                drawer.classList.add('open');
                overlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                drawer.setAttribute('aria-hidden', 'false');
            }
            function closeDrawer() {
                drawer.classList.remove('open');
                overlay.classList.remove('open');
                document.body.style.overflow = '';
                drawer.setAttribute('aria-hidden', 'true');
            }
            if (btnOpen) btnOpen.addEventListener('click', openDrawer);
            if (btnClose) btnClose.addEventListener('click', closeDrawer);
            overlay.addEventListener('click', closeDrawer);
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
        } catch (e) {
            console.warn('initAppHeader error', e);
        }
    }

    // Smooth Scroll for Anchor Links
    function initSmoothScroll() {
        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 800);
                    return false;
                }
            }
        });
    }

    // Cart Functionality - Disabled to prevent conflicts with cart-sidebar.js
    function initCartFunctionality() {
        // Cart functionality is now handled by cart-sidebar.js
        // This function is kept for compatibility but disabled
        console.log('Cart functionality handled by cart-sidebar.js');
    }

    // Wishlist Functionality - Disabled to prevent conflicts with wishlist.js
    function initWishlistFunctionality() {
        // Wishlist functionality is now handled by wishlist.js
        // This function is kept for compatibility but disabled
        console.log('Wishlist functionality handled by wishlist.js');
    }

    // Search Functionality
    function initSearchFunctionality() {
        const searchForm = $('.search-form');
        const searchInput = $('.search-form input[type="search"]');
        
        searchForm.submit(function(e) {
            e.preventDefault();
            const searchTerm = searchInput.val().trim();
            
            if (searchTerm.length > 0) {
                // Simulate search
                showNotification('Searching for: ' + searchTerm, 'info');
                
                // Here you would typically make an AJAX call to your search endpoint
                // For demo purposes, we'll just show a message
                setTimeout(function() {
                    showNotification('Search results for "' + searchTerm + '" would be displayed here.', 'info');
                }, 1000);
            }
        });
        
        // Search input focus effects
        searchInput.focus(function() {
            $(this).closest('.search-box').addClass('focused');
        }).blur(function() {
            $(this).closest('.search-box').removeClass('focused');
        });
    }

    // Mobile Menu Toggle
    function initMobileMenu() {
        const navbarToggler = $('.navbar-toggler');
        const navbarCollapse = $('.navbar-collapse');
        
        // Close mobile menu when clicking outside
        $(document).click(function(e) {
            if (!$(e.target).closest('.navbar').length) {
                navbarCollapse.removeClass('show');
            }
        });
        
        // Close mobile menu when clicking on a link
        $('.navbar-nav .nav-link').click(function() {
            navbarCollapse.removeClass('show');
        });
    }

    // Product Hover Effects
    function initProductHover() {
        $('.shoppingcart-grid-product').hover(
            function() {
                $(this).find('.sc-grid-product-img img').css('transform', 'scale(1.05)');
            },
            function() {
                $(this).find('.sc-grid-product-img img').css('transform', 'scale(1)');
            }
        );
        
        $('.promo-category-content').hover(
            function() {
                $(this).find('.promo-category-img img').css('transform', 'scale(1.1)');
            },
            function() {
                $(this).find('.promo-category-img img').css('transform', 'scale(1)');
            }
        );
    }

    // Scroll Animations
    function initAnimations() {
        // Animate elements on scroll
        $(window).scroll(function() {
            $('.fade-in-up').each(function() {
                const elementTop = $(this).offset().top;
                const elementBottom = elementTop + $(this).outerHeight();
                const viewportTop = $(window).scrollTop();
                const viewportBottom = viewportTop + $(window).height();
                
                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    $(this).addClass('fade-in-up');
                }
            });
        });
        
        // Trigger initial animation check
        $(window).trigger('scroll');
    }

    // Sticky Header - CSS sticky by default; force fixed on index page
    function initStickyHeader() {
        const stickyHeader = $('#sticky-header');
        
        if (stickyHeader.length === 0) {
            return; // Exit if header doesn't exist
        }
        
        // Ensure no body padding is added (clean up any existing)
        $('body').css({
            'padding-top': '',
            'margin-top': ''
        });
        
        // Calculate the correct top position based on header elements above
        const siteHeader = $('.site-header');
        if (siteHeader.length > 0) {
            const topBar = $('.top-header');
            const siteBranding = $('#site-branding');
            let topOffset = 0;
            
            if (topBar.length > 0 && topBar.is(':visible')) {
                topOffset += topBar.outerHeight(true);
            }
            if (siteBranding.length > 0 && siteBranding.is(':visible')) {
                topOffset += siteBranding.outerHeight(true);
            }
            
            // Set top position dynamically if needed
            if (topOffset > 0) {
                // For sticky, top should be 0 to stick to viewport top
                // But we can adjust if needed
                stickyHeader.css('top', '0');
            }
        }
        
        // If on index page, force fixed header to guarantee stickiness
        const path = window.location.pathname.toLowerCase();
        const isHome = path.endsWith('/index.html') || path.endsWith('/index.htm') || path === '/' || path.endsWith('/theme-2/') || path.endsWith('theme-2\\') || path.endsWith('theme-2');

        let $spacer = null;
        function applyFixedHeader() {
            const h = stickyHeader.outerHeight();
            if (!$spacer || $spacer.length === 0) {
                $spacer = $('<div id="sticky-header-spacer"></div>');
                $spacer.insertAfter(stickyHeader);
            }
            $spacer.css({ height: h + 'px' });
            stickyHeader.css({
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                'z-index': 1000
            });
        }

        function removeFixedHeader() {
            stickyHeader.attr('style', ''); // reset inline styles to let CSS sticky take over
            if ($spacer && $spacer.length) {
                $spacer.remove();
                $spacer = null;
            }
        }

        if (isHome) {
            // Force fixed behavior on home/index only
            applyFixedHeader();
            // Recalculate on resize (e.g., responsive changes)
            $(window).on('resize.stickyHeader', function() {
                applyFixedHeader();
            });
        }

        // Add/remove class for shadow styling
        $(window).on('scroll.stickyHeader', function() {
            const scrollTop = $(window).scrollTop();
            if (scrollTop > 100) {
                stickyHeader.addClass('sticky');
            } else {
                stickyHeader.removeClass('sticky');
            }
        });
    }

    // Lazy Loading for Images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Form Validation
    function initFormValidation() {
        $('form').submit(function(e) {
            const form = $(this);
            let isValid = true;
            
            // Check required fields
            form.find('[required]').each(function() {
                if (!$(this).val().trim()) {
                    $(this).addClass('is-invalid');
                    isValid = false;
                } else {
                    $(this).removeClass('is-invalid');
                }
            });
            
            // Email validation
            form.find('input[type="email"]').each(function() {
                const email = $(this).val();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (email && !emailRegex.test(email)) {
                    $(this).addClass('is-invalid');
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields correctly.', 'danger');
            }
        });
    }

    // Carousel Initialization
    function initCarousel() {
        // Initialize Bootstrap carousels
        $('.carousel').carousel({
            interval: 5000,
            wrap: true
        });
        
        // Custom carousel controls
        $('.carousel-control-prev').click(function() {
            $(this).closest('.carousel').carousel('prev');
        });
        
        $('.carousel-control-next').click(function() {
            $(this).closest('.carousel').carousel('next');
        });
    }

    // Newsletter Subscription
    function initNewsletter() {
        $('.newsletter-form').submit(function(e) {
            e.preventDefault();
            const email = $(this).find('input[type="email"]').val();
            
            if (email) {
                // Simulate subscription
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                $(this)[0].reset();
            }
        });
    }

    // Product Filters
    function initProductFilters() {
        $('.product-filter').change(function() {
            const filter = $(this).val();
            const products = $('.shoppingcart-grid-product');
            
            if (filter === 'all') {
                products.show();
            } else {
                products.hide();
                products.filter('[data-category="' + filter + '"]').show();
            }
        });
    }

    // Quantity Controls
    function initQuantityControls() {
        $('.quantity-btn').click(function() {
            const input = $(this).siblings('.quantity-input');
            const currentValue = parseInt(input.val()) || 0;
            
            if ($(this).hasClass('quantity-plus')) {
                input.val(currentValue + 1);
            } else if ($(this).hasClass('quantity-minus') && currentValue > 1) {
                input.val(currentValue - 1);
            }
        });
    }

    // Image Zoom (only for non-product-detail pages)
    function initImageZoom() {
        // Skip if on product detail page (handled by product-detail.js)
        if ($('.product-detail-section').length > 0) {
            return;
        }
        
        $('.product-gallery img').click(function() {
            const src = $(this).attr('src');
            const modal = `
                <div class="modal fade" id="imageModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Product Image</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body text-center">
                                <img src="${src}" class="img-fluid" alt="Product Image">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            $('body').append(modal);
            $('#imageModal').modal('show');
            
            $('#imageModal').on('hidden.bs.modal', function() {
                $(this).remove();
            });
        });
    }

    // Tooltips
    function initTooltips() {
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }

    // Popovers
    function initPopovers() {
        if (typeof bootstrap !== 'undefined') {
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl);
            });
        }
    }

    // Tabs
    function initTabs() {
        $('.nav-tabs .nav-link').click(function(e) {
            e.preventDefault();
            const target = $(this).attr('href');
            
            // Remove active class from all tabs and content
            $('.nav-tabs .nav-link').removeClass('active');
            $('.tab-content .tab-pane').removeClass('active show');
            
            // Add active class to clicked tab and corresponding content
            $(this).addClass('active');
            $(target).addClass('active show');
        });
    }

    // Accordion
    function initAccordion() {
        $('.accordion-button').click(function() {
            const target = $(this).attr('data-bs-target');
            const isCollapsed = $(this).hasClass('collapsed');
            
            if (!isCollapsed) {
                $(target).collapse('show');
            }
        });
    }

    // Progress Bars
    function initProgressBars() {
        $('.progress-bar').each(function() {
            const progressBar = $(this);
            const percentage = progressBar.attr('aria-valuenow');
            
            progressBar.css('width', percentage + '%');
        });
    }

    // Notification System
    function initNotifications() {
        // This function is called by other functions
    }

    // Show Notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        $('.notification').remove();
        
        const notification = $(`
            <div class="notification alert alert-${type} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
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

    // Window Load Events
    $(window).on('load', function() {
        // Hide loading spinner if exists
        $('.loading-spinner').fadeOut();
        
        // Initialize any plugins that need full page load
        console.log('ShoppingCart website loaded successfully!');
    });

    // Resize Events
    $(window).on('resize', function() {
        // Handle responsive adjustments
        const windowWidth = $(window).width();
        
        if (windowWidth < 768) {
            // Mobile adjustments
            $('.navbar-collapse').removeClass('show');
        }
    });

})(jQuery);

// Vanilla JavaScript for features that don't need jQuery
document.addEventListener('DOMContentLoaded', function() {
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('loading')) {
                return;
            }
            
            // Add loading state for form submissions
            if (this.type === 'submit' || this.closest('form')) {
                this.classList.add('loading');
                this.innerHTML = '<span class="spinner"></span> Loading...';
            }
        });
    });
    
    // Initialize Bootstrap components
    if (typeof bootstrap !== 'undefined') {
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // Initialize popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const modal = bootstrap.Modal.getInstance(openModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    });
    
    // Add focus management for accessibility
    document.addEventListener('focusin', function(e) {
        if (e.target.matches('.modal')) {
            // Focus management for modals
            const firstFocusable = e.target.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    });
    
});

// Utility Functions
const ShoppingCart = {
    
    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },
    
    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Local storage helpers
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }
        },
        
        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return null;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Error removing from localStorage:', e);
            }
        }
    },
    
    // API helpers
    api: {
        get: function(url) {
            return fetch(url)
                .then(response => response.json())
                .catch(error => console.error('API Error:', error));
        },
        
        post: function(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .catch(error => console.error('API Error:', error));
        }
    }
};

// Export for use in other scripts
window.ShoppingCart = ShoppingCart;