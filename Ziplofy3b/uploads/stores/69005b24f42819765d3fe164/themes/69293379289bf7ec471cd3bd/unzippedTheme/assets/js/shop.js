/* ==============================================
   Shop Page JavaScript
   ============================================== */

$(document).ready(function() {
    var isShopPage = $('.shop').length > 0;
    
    // Helpers to close drawers exclusively (only on shop page)
    function closeMobileMenu(){
        if(!isShopPage) return;
        $('#mobileDrawer').removeClass('open');
        $('#mobileBackdrop').removeClass('show');
        $('body').removeClass('menu-open');
    }

    function closeFilter(){
        if(!isShopPage) return;
        $('.shop-sidebar').removeClass('show');
        $('#sidebarOverlay').removeClass('show');
        $('body').removeClass('filter-open');
    }

    // Filter only on shop page (mobile header handled globally in main.js)
    if (isShopPage) {
        // Mobile Filter Toggle (closes menu if open)
        $(document).on('click', '#mobileFilterBtn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
            $('.shop-sidebar').addClass('show');
            $('#sidebarOverlay').addClass('show');
            $('body').addClass('filter-open');
        });

        $(document).on('click', '#sidebarOverlay', function() {
            closeFilter();
        });

        // ESC to close any open drawer (filter or menu)
        $(document).on('keydown', function(e){
            if(e.key === 'Escape'){
                closeMobileMenu();
                closeFilter();
            }
        });
    }
    
    // Price Range Slider
    const priceSlider = document.getElementById('priceRange');
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            const value = this.value;
            const priceValues = document.querySelectorAll('.price-values span');
            if (priceValues.length >= 2) {
                priceValues[1].textContent = '$' + value;
            }
        });
    }
    
    // View Toggle (Grid/List)
    $('.view-btn').click(function() {
        $('.view-btn').removeClass('active');
        $(this).addClass('active');
        
        const view = $(this).data('view');
        const productsGrid = $('#productsGrid');
        
        if (view === 'list') {
            productsGrid.addClass('list-view');
        } else {
            productsGrid.removeClass('list-view');
        }
    });
    
    // Category Filter
    $('.category-item').click(function(e) {
        e.preventDefault();
        $('.category-item').removeClass('active');
        $(this).addClass('active');
        
        // Here you would typically filter products
        // For demo purposes, we'll just show a message
        const category = $(this).text().trim();
        console.log('Filtering by category:', category);
    });
    
    // Brand Filter
    $('.brand-item input[type="checkbox"]').change(function() {
        const brand = $(this).parent().text().trim();
        const isChecked = $(this).is(':checked');
        
        console.log('Brand filter:', brand, isChecked);
        
        // Update product count or filter products
        updateProductCount();
    });
    
    // Size Filter
    $('.size-btn').click(function() {
        $('.size-btn').removeClass('active');
        $(this).addClass('active');
        
        const size = $(this).text().trim();
        console.log('Size filter:', size);
    });
    
    // Color Filter
    $('.color-btn').click(function() {
        $('.color-btn').removeClass('active');
        $(this).addClass('active');
        
        const color = $(this).css('background-color');
        console.log('Color filter:', color);
    });
    
    // Product Actions
    $('.btn-cart').click(function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-item').find('h3').text();
        addToCart(productName);
    });
    
    $('.btn-wishlist').click(function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-item').find('h3').text();
        addToWishlist(productName);
    });
    
    $('.btn-view').click(function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-item').find('h3').text();
        viewProduct(productName);
    });
    
    $('.btn-share').click(function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-item').find('h3').text();
        shareProduct(productName);
    });
    
    // Sort Products
    $('.sort-by select').change(function() {
        const sortBy = $(this).val();
        sortProducts(sortBy);
    });
    
    // Search Functionality
    $('.search-box .btn-search').click(function() {
        const searchTerm = $('.search-box input').val();
        if (searchTerm.trim()) {
            searchProducts(searchTerm);
        }
    });
    
    $('.search-box input').keypress(function(e) {
        if (e.which === 13) {
            const searchTerm = $(this).val();
            if (searchTerm.trim()) {
                searchProducts(searchTerm);
            }
        }
    });
    
    // Pagination
    $('.pagination .page-link').click(function(e) {
        e.preventDefault();
        const page = $(this).text();
        if (page !== 'Previous' && page !== 'Next') {
            loadPage(parseInt(page));
        }
    });
    
    // Initialize Isotope for filtering/layout (target grid columns)
    if (typeof $.fn.isotope !== 'undefined' && $('#productsGrid .row').length) {
        $('#productsGrid .row').isotope({
            itemSelector: '#productsGrid .row > [class*="col-"]',
            layoutMode: 'fitRows'
        });
    }

    // Product page: enable Bootstrap carousel if present
    if ($('#product-carousel').length) {
        $('#product-carousel').carousel({ interval: 0 });
    }

    // Make product cards clickable to product page (avoid buttons/links)
    $(document).on('click', '.product-item, .team-item', function(e) {
        if ($(e.target).closest('a, button, .btn, .product-overlay').length) return;
        window.location.href = 'product.html';
    });
    
    // Smooth scrolling for anchor links (exclude tabs/collapse/FAQ headers)
    $('a[href^="#"]').on('click', function(e) {
        const $link = $(this);
        const isTab = $link.is('[data-toggle="tab"]');
        const isCollapse = $link.is('[data-toggle="collapse"]') || $link.closest('.faqs .card-header').length > 0;
        if (isTab || isCollapse) {
            return; // let dedicated handlers manage
        }
        const targetSel = this.getAttribute('href');
        if (!targetSel || targetSel === '#') return;
        const target = $(targetSel);
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: target.offset().top - 100 }, 500);
        }
    });
    
    // Lazy loading for product images
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
    
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
    
    // Initialize popovers
    $('[data-toggle="popover"]').popover();
    
});

// Helper Functions

function addToCart(productName) {
    // Show success message
    showNotification('Added to cart: ' + productName, 'success');
    
    // Update cart count
    updateCartCount();
    
    // Add to cart animation
    animateAddToCart();
}

function addToWishlist(productName) {
    showNotification('Added to wishlist: ' + productName, 'info');
}

function viewProduct(productName) {
    // Navigate to product detail page
    window.location.href = 'product-detail.html?product=' + encodeURIComponent(productName);
}

function shareProduct(productName) {
    if (navigator.share) {
        navigator.share({
            title: productName,
            text: 'Check out this product: ' + productName,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Product link copied to clipboard!', 'success');
        });
    }
}

function sortProducts(sortBy) {
    const products = $('.product-item');
    const productsArray = products.toArray();
    
    productsArray.sort((a, b) => {
        switch(sortBy) {
            case 'Price: Low to High':
                return getPrice(a) - getPrice(b);
            case 'Price: High to Low':
                return getPrice(b) - getPrice(a);
            case 'Newest':
                return getDate(b) - getDate(a);
            case 'Popular':
                return getRating(b) - getRating(a);
            default:
                return 0;
        }
    });
    
    const container = $('.products-grid .row');
    container.empty();
    
    productsArray.forEach(product => {
        container.append(product);
    });
    
    // Re-initialize isotope if available
    if (typeof $.fn.isotope !== 'undefined') {
        $('.products-grid').isotope('reloadItems');
    }
}

function getPrice(element) {
    const priceText = $(element).find('.price').text();
    return parseFloat(priceText.replace('$', ''));
}

function getDate(element) {
    // Mock date based on product position
    return Math.random() * 1000000;
}

function getRating(element) {
    const ratingText = $(element).find('.product-rating span').text();
    return parseInt(ratingText.replace(/[()]/g, ''));
}

function searchProducts(searchTerm) {
    const products = $('.product-item');
    const term = searchTerm.toLowerCase();
    
    products.each(function() {
        const productName = $(this).find('h3').text().toLowerCase();
        const productDesc = $(this).find('.product-content p').text().toLowerCase();
        
        if (productName.includes(term) || productDesc.includes(term)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
    
    showNotification('Search results for: ' + searchTerm, 'info');
}

function loadPage(pageNumber) {
    // Simulate page loading
    showNotification('Loading page ' + pageNumber + '...', 'info');
    
    // Update pagination
    $('.pagination .page-item').removeClass('active');
    $('.pagination .page-item').eq(pageNumber).addClass('active');
}

function updateProductCount() {
    const visibleProducts = $('.product-item:visible').length;
    $('.shop-header p').text('Showing 1-' + visibleProducts + ' of ' + visibleProducts + ' products');
}

function updateCartCount() {
    const currentCount = parseInt($('.mh-badge').text()) || 0;
    $('.mh-badge').text(currentCount + 1);
}

function animateAddToCart() {
    // Create flying cart animation
    const cartIcon = $('.mh-action[aria-label="Cart"]');
    const cartPosition = cartIcon.offset();
    
    // Create temporary element
    const flyingItem = $('<div class="flying-item">🛒</div>').css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        zIndex: 9999,
        fontSize: '20px',
        pointerEvents: 'none'
    });
    
    $('body').append(flyingItem);
    
    // Animate to cart
    flyingItem.animate({
        top: cartPosition.top + 20,
        left: cartPosition.left + 20
    }, 500, function() {
        flyingItem.remove();
    });
}

function showNotification(message, type = 'info') {
    const notification = $(`
        <div class="notification notification-${type}">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `);
    
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

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// CSS for notifications (injected dynamically)
const notificationCSS = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        border-radius: 8px;
        padding: 15px 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border-left: 4px solid #3498db;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: #2ecc71;
    }
    
    .notification-error {
        border-left-color: #e74c3c;
    }
    
    .notification-warning {
        border-left-color: #f39c12;
    }
    
    .flying-item {
        animation: fly 0.5s ease-out;
    }
    
    @keyframes fly {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(0.8); }
    }
`;

// Inject notification CSS
$('<style>').text(notificationCSS).appendTo('head');
