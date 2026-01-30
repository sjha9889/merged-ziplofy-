(function () {
    if (!window.liquidjs) {
        console.error('LiquidJS is required to render products.');
        return;
    }
    if (typeof window.getFeaturedProducts !== 'function' || typeof window.getNewProducts !== 'function') {
        console.error('Product helper functions are not available.');
        return;
    }

    var Liquid = window.liquidjs.Liquid;
    var engine = new Liquid({ cache: true });
    var templateCache = {};
    var flashTimer;
    var quickViewCurrentProductId = null;
    var store = window.shopState || (window.shopState = { cart: [], wishlist: [] });

    function loadTemplate(path) {
        if (templateCache[path]) {
            return Promise.resolve(templateCache[path]);
        }
        return fetch(path)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to load template: ' + path);
                }
                return response.text();
            })
            .then(function (source) {
                return engine.parse(source);
            })
            .then(function (template) {
                templateCache[path] = template;
                return template;
            })
            .catch(function (error) {
                console.error(error);
                return null;
            });
    }

    function showFlashMessage(type, message) {
        var el = document.getElementById('flash-message');
        if (!el) {
            return;
        }
        el.textContent = message;
        el.className = 'flash-message flash-' + type + ' show';
        clearTimeout(flashTimer);
        flashTimer = setTimeout(function () {
            el.classList.remove('show');
        }, 2600);
    }

    function updateCountBadges() {
        var cartCount = getCartItemCount();
        var wishlistCount = (store.wishlist || []).length;
        var targets = document.querySelectorAll('[data-count-target="cart"]');
        targets.forEach(function (node) {
            node.textContent = cartCount;
        });
        // Also update cart badges in header/navbar
        document.querySelectorAll('.badge').forEach(function(badge) {
            var parent = badge.closest('a[href*="cart"], button[aria-label*="cart"], .navbar-nav a');
            if (parent && parent.querySelector('i.fa-shopping-cart')) {
                badge.textContent = cartCount;
            }
        });
        targets = document.querySelectorAll('[data-count-target="wishlist"]');
        targets.forEach(function (node) {
            node.textContent = wishlistCount;
        });
    }

    function addProductToCollection(collectionName, product, quantity) {
        quantity = quantity || 1;
        if (!store[collectionName]) {
            store[collectionName] = [];
        }
        
        if (collectionName === 'cart') {
            // For cart, store product objects with quantity
            var existingIndex = store[collectionName].findIndex(function(item) {
                return item.id === product.id;
            });
            
            if (existingIndex !== -1) {
                // Product already in cart, update quantity
                store[collectionName][existingIndex].quantity = (store[collectionName][existingIndex].quantity || 1) + quantity;
                showFlashMessage('info', product.title + ' quantity updated in cart.');
            } else {
                // Add new product to cart
                store[collectionName].push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
                showFlashMessage('success', 'Added ' + product.title + ' to your cart.');
            }
        } else {
            // For wishlist, store just IDs (backward compatible)
            var exists = store[collectionName].indexOf(product.id) !== -1;
            if (exists) {
                showFlashMessage('info', product.title + ' is already in your ' + collectionName + '.');
                return;
            }
            store[collectionName].push(product.id);
            showFlashMessage('success', 'Added ' + product.title + ' to your ' + collectionName + '.');
        }
        
        updateCountBadges();
        
        // Update cart drawer if it's open
        if (collectionName === 'cart' && window.renderCartDrawer) {
            window.renderCartDrawer();
        }
    }
    
    function getCartProducts() {
        if (!store.cart || !Array.isArray(store.cart)) {
            return [];
        }
        // If cart has IDs, convert to product objects
        var cartItems = store.cart.map(function(item) {
            if (typeof item === 'string') {
                // Old format (just ID), convert to object
                var product = window.getProductById(item);
                return product ? {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                } : null;
            }
            return item; // Already in new format
        }).filter(function(item) {
            return item !== null;
        });
        return cartItems;
    }
    
    function getCartTotal() {
        var cartItems = getCartProducts();
        return cartItems.reduce(function(total, item) {
            return total + (item.price * (item.quantity || 1));
        }, 0);
    }
    
    function getCartItemCount() {
        var cartItems = getCartProducts();
        return cartItems.reduce(function(count, item) {
            return count + (item.quantity || 1);
        }, 0);
    }

    function populateQuickView(product) {
        var modal = document.getElementById('quickViewModal');
        if (!modal) {
            return;
        }
        quickViewCurrentProductId = product.id;

        var imageEl = document.getElementById('quickViewImage');
        var titleEl = document.getElementById('quickViewTitle');
        var priceEl = document.getElementById('quickViewPrice');
        var oldPriceEl = document.getElementById('quickViewOldPrice');
        var badgeEl = document.getElementById('quickViewBadge');
        var descEl = document.getElementById('quickViewDescription');
        var featuresEl = document.getElementById('quickViewFeatures');
        var detailLinkEl = document.getElementById('quickViewDetailLink');

        var image = product.image || (product.images && product.images.length ? product.images[0] : '');
        if (imageEl) {
            imageEl.src = image;
            imageEl.alt = product.title;
        }

        if (titleEl) {
            titleEl.textContent = product.title;
        }
        if (priceEl) {
            priceEl.textContent = formatCurrency(product.price);
        }
        if (oldPriceEl) {
            if (product.originalPrice && product.originalPrice > product.price) {
                oldPriceEl.style.display = 'inline';
                oldPriceEl.querySelector('del').textContent = formatCurrency(product.originalPrice);
            } else {
                oldPriceEl.style.display = 'none';
            }
        }
        if (badgeEl) {
            var badgeText = product.badges && product.badges.length ? product.badges[0] : '';
            if (!badgeText && product.discount) {
                badgeText = product.discount + '% OFF';
            }
            if (badgeText) {
                badgeText = badgeText.replace(/\b\w/g, function (char) { return char.toUpperCase(); });
                badgeEl.style.display = 'inline-block';
                badgeEl.textContent = badgeText;
            } else {
                badgeEl.style.display = 'none';
            }
        }
        if (descEl) {
            descEl.textContent = product.shortDescription || product.description || 'Explore more details on the product page.';
        }
        if (featuresEl) {
            featuresEl.innerHTML = '';
            if (product.features && product.features.length) {
                featuresEl.style.display = 'block';
                product.features.slice(0, 5).forEach(function (feature) {
                    var li = document.createElement('li');
                    li.className = 'mb-1';
                    li.innerHTML = '<i class="fa fa-check text-success mr-2"></i>' + feature;
                    featuresEl.appendChild(li);
                });
            } else {
                featuresEl.style.display = 'none';
            }
        }
        if (detailLinkEl) {
            detailLinkEl.href = 'product-detail.html?id=' + encodeURIComponent(product.id);
        }
    }

    function openQuickView(productId) {
        var product = window.getProductById(productId);
        if (!product) {
            showFlashMessage('warning', 'Product not found.');
            return;
        }
        populateQuickView(product);
        $('#quickViewModal').modal('show');
    }

    function formatCurrency(value) {
        try {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(value);
        } catch (error) {
            console.warn('Currency formatting failed, falling back to plain number.', error);
            return '₹' + Number(value || 0).toFixed(0);
        }
    }

    function buildStars(rating) {
        var stars = [];
        for (var i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push('full');
            } else if (rating >= i - 0.5) {
                stars.push('half');
            } else {
                stars.push('empty');
            }
        }
        return stars;
    }

    function buildProductViewModel(product) {
        var badgeText = null;
        if (product.badge) {
            badgeText = product.badge;
        } else if (product.discount) {
            badgeText = product.discount + '% OFF';
        } else if (!product.inStock) {
            badgeText = 'Sold Out';
        }

        return {
            id: product.id,
            title: product.title,
            image: product.image,
            badge: badgeText,
            priceFormatted: formatCurrency(product.price),
            originalPriceFormatted: product.originalPrice ? formatCurrency(product.originalPrice) : null,
            reviewCount: product.reviewCount,
            stars: buildStars(product.rating),
            detailUrl: 'product-detail.html?id=' + encodeURIComponent(product.id)
        };
    }

    function renderProducts(options) {
        var container = document.getElementById(options.containerId);
        if (!container) {
            return;
        }

        loadTemplate(options.templatePath).then(function (template) {
            if (!template) {
                container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
                return;
            }

            var products = (options.getProducts() || []).map(buildProductViewModel);
            if (!products.length) {
                container.innerHTML = '<div class="col-12 text-center text-muted py-4">No products available.</div>';
                return;
            }

            var renderPromises = products.map(function (product) {
                return engine.render(template, { product: product });
            });

            Promise.all(renderPromises)
                .then(function (chunks) {
                    container.innerHTML = chunks.join('');
                    bindProductActionHandlers(container);
                })
                .catch(function (error) {
                    console.error('Failed to render products.', error);
                    container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
                });
        });
    }

    function getCurrentPage() {
        var urlParams = new URLSearchParams(window.location.search);
        var page = parseInt(urlParams.get('page'), 10);
        return (isNaN(page) || page < 1) ? 1 : page;
    }

    function updateURL(page) {
        var url = new URL(window.location);
        if (page === 1) {
            url.searchParams.delete('page');
        } else {
            url.searchParams.set('page', page);
        }
        window.history.pushState({ page: page }, '', url);
    }

    function renderPagination(currentPage, totalPages) {
        var paginationEl = document.getElementById('shop-pagination');
        if (!paginationEl || totalPages <= 1) {
            if (paginationEl) {
                paginationEl.innerHTML = '';
            }
            return;
        }

        var html = '';
        var maxVisible = 5;
        var startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        var endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        // Previous button
        html += '<li class="page-item' + (currentPage === 1 ? ' disabled' : '') + '">';
        html += '<a class="page-link" href="' + (currentPage > 1 ? '?page=' + (currentPage - 1) : '#') + '" data-page="' + (currentPage - 1) + '">Previous</a>';
        html += '</li>';

        // First page
        if (startPage > 1) {
            html += '<li class="page-item"><a class="page-link" href="?page=1" data-page="1">1</a></li>';
            if (startPage > 2) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // Page numbers
        for (var i = startPage; i <= endPage; i++) {
            html += '<li class="page-item' + (i === currentPage ? ' active' : '') + '">';
            html += '<a class="page-link" href="?page=' + i + '" data-page="' + i + '">' + i + '</a>';
            html += '</li>';
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            html += '<li class="page-item"><a class="page-link" href="?page=' + totalPages + '" data-page="' + totalPages + '">' + totalPages + '</a></li>';
        }

        // Next button
        html += '<li class="page-item' + (currentPage === totalPages ? ' disabled' : '') + '">';
        html += '<a class="page-link" href="' + (currentPage < totalPages ? '?page=' + (currentPage + 1) : '#') + '" data-page="' + (currentPage + 1) + '">Next</a>';
        html += '</li>';

        paginationEl.innerHTML = html;

        // Bind click handlers
        paginationEl.querySelectorAll('a.page-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                var page = parseInt(this.getAttribute('data-page'), 10);
                if (!isNaN(page) && page >= 1 && page !== currentPage) {
                    e.preventDefault();
                    updateURL(page);
                    renderShopProductsWithPagination();
                }
            });
        });
    }

    function renderShopProductsWithPagination() {
        var container = document.getElementById('shop-products-grid');
        if (!container) {
            return;
        }

        var allProducts = window.getAllProducts() || [];
        var productsPerPage = 12;
        var currentPage = getCurrentPage();
        var totalPages = Math.ceil(allProducts.length / productsPerPage);
        var startIndex = (currentPage - 1) * productsPerPage;
        var endIndex = startIndex + productsPerPage;
        var pageProducts = allProducts.slice(startIndex, endIndex);

        loadTemplate('templates/product-card.liquid').then(function (template) {
            if (!template) {
                container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
                return;
            }

            if (!pageProducts.length) {
                container.innerHTML = '<div class="col-12 text-center text-muted py-4">No products available.</div>';
                renderPagination(currentPage, totalPages);
                return;
            }

            var products = pageProducts.map(buildProductViewModel);
            var renderPromises = products.map(function (product) {
                return engine.render(template, { product: product });
            });

            Promise.all(renderPromises)
                .then(function (chunks) {
                    container.innerHTML = chunks.join('');
                    bindProductActionHandlers(container);
                    renderPagination(currentPage, totalPages);
                })
                .catch(function (error) {
                    console.error('Failed to render products.', error);
                    container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
                });
        });
    }

    function buildCategoryViewModels() {
        if (typeof window.getAllProducts !== 'function') {
            return [];
        }

        var map = new Map();
        (window.getAllProducts() || []).forEach(function (product) {
            if (!product || !product.category) {
                return;
            }
            var slug = product.category;
            var entry = map.get(slug);
            if (!entry) {
                map.set(slug, {
                    slug: slug,
                    name: product.categoryLabel || (slug.charAt(0).toUpperCase() + slug.slice(1)),
                    image: product.image,
                    count: 1
                });
                return;
            }

            entry.count += 1;
            if (!entry.image && product.image) {
                entry.image = product.image;
            }
        });

        return Array.from(map.values()).map(function (category) {
            if (!category.image) {
                category.image = 'assets/img/cat-1.jpg';
            }
            return category;
        }).sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    function renderCategories(options) {
        var container = document.getElementById(options.containerId);
        if (!container) {
            return;
        }

        loadTemplate(options.templatePath).then(function (template) {
            if (!template) {
                container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load categories right now.</div>';
                return;
            }

            var categories = options.getCategories();
            if (!categories.length) {
                container.innerHTML = '<div class="col-12 text-center text-muted py-4">No categories available.</div>';
                return;
            }

            var renderPromises = categories.map(function (category) {
                return engine.render(template, { category: category });
            });

            Promise.all(renderPromises)
                .then(function (chunks) {
                    container.innerHTML = chunks.join('');
                })
                .catch(function (error) {
                    console.error('Failed to render categories.', error);
                    container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load categories right now.</div>';
                });
        });
    }

    function bindProductActionHandlers(container) {
        if (!container || container.dataset.actionsBound) {
            return;
        }

        container.addEventListener('click', function (event) {
            var button = event.target.closest('.product-action-btn');
            if (!button) {
                return;
            }
            event.preventDefault();
            var action = button.getAttribute('data-action');
            var productId = button.getAttribute('data-product-id');
            if (!productId || !action) {
                return;
            }
            var product = window.getProductById(productId);
            if (!product) {
                showFlashMessage('warning', 'Product not found.');
                return;
            }
            if (action === 'cart') {
                addProductToCollection('cart', product);
            } else if (action === 'wishlist') {
                addProductToCollection('wishlist', product);
            } else if (action === 'compare') {
                showFlashMessage('info', 'Compare feature coming soon!');
            } else if (action === 'quickview') {
                openQuickView(productId);
            }
        });

        container.dataset.actionsBound = 'true';
    }

    document.addEventListener('DOMContentLoaded', function () {
        renderCategories({
            containerId: 'categories-grid',
            templatePath: 'templates/category-card.liquid',
            getCategories: buildCategoryViewModels
        });

        renderProducts({
            containerId: 'featured-products-grid',
            templatePath: 'templates/product-card.liquid',
            getProducts: function () {
                return (window.getFeaturedProducts() || []).slice(0, 4);
            }
        });

        renderProducts({
            containerId: 'recent-products-grid',
            templatePath: 'templates/product-card.liquid',
            getProducts: function () {
                return (window.getNewProducts() || []).slice(0, 4);
            }
        });

        // Shop page with pagination
        renderShopProductsWithPagination();

        // Handle browser back/forward buttons
        window.addEventListener('popstate', function (event) {
            if (document.getElementById('shop-products-grid')) {
                renderShopProductsWithPagination();
            }
        });

        updateCountBadges();

        var quickViewAddToCartBtn = document.getElementById('quickViewAddToCart');
        if (quickViewAddToCartBtn) {
            quickViewAddToCartBtn.addEventListener('click', function () {
                if (!quickViewCurrentProductId) {
                    return;
                }
                var product = window.getProductById(quickViewCurrentProductId);
                if (product) {
                    addProductToCollection('cart', product);
                }
            });
        }
        var quickViewAddToWishlistBtn = document.getElementById('quickViewAddToWishlist');
        if (quickViewAddToWishlistBtn) {
            quickViewAddToWishlistBtn.addEventListener('click', function () {
                if (!quickViewCurrentProductId) {
                    return;
                }
                var product = window.getProductById(quickViewCurrentProductId);
                if (product) {
                    addProductToCollection('wishlist', product);
                }
            });
        }
    });

    // Expose functions globally for use in other scripts
    window.showFlashMessage = showFlashMessage;
    window.addProductToCollection = addProductToCollection;
    window.updateCountBadges = updateCountBadges;
    window.getCartProducts = getCartProducts;
    window.getCartTotal = getCartTotal;
    window.getCartItemCount = getCartItemCount;
    window.openQuickView = function(productId) {
        var product = window.getProductById(productId);
        if (product) {
            populateQuickView(product);
            var modal = document.getElementById('quickViewModal');
            if (modal && window.jQuery) {
                window.jQuery(modal).modal('show');
            }
        }
    };
})();


