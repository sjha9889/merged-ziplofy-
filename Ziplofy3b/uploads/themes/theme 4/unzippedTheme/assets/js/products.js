(function () {
    // Wait for dependencies to be available
    function waitForDependencies(callback, maxAttempts) {
        maxAttempts = maxAttempts || 50; // Try for 5 seconds (50 * 100ms)
        var attempts = 0;
        
        function check() {
            attempts++;
            
            // Check for LiquidJS - it might be exposed as liquidjs or window.liquidjs
            var Liquid;
            if (typeof window.liquidjs !== 'undefined' && window.liquidjs.Liquid) {
                Liquid = window.liquidjs.Liquid;
            } else if (typeof liquidjs !== 'undefined' && liquidjs.Liquid) {
                Liquid = liquidjs.Liquid;
            } else if (attempts < maxAttempts) {
                setTimeout(check, 100);
                return;
            } else {
                console.error('LiquidJS is required to render products. Please ensure liquid.browser.min.js is loaded.');
                return;
            }
            
            // Check for product helper functions
            if (typeof window.getFeaturedProducts !== 'function' || typeof window.getNewProducts !== 'function') {
                if (attempts < maxAttempts) {
                    setTimeout(check, 100);
                    return;
                } else {
                    console.error('Product helper functions are not available. Make sure constants/products.js is loaded before this script.');
                    return;
                }
            }
            
            // All dependencies loaded, proceed
            callback(Liquid);
        }
        
        check();
    }
    
    waitForDependencies(function(Liquid) {
        if (!Liquid) return;
        
        var engine = new Liquid({ cache: true });
    var templateCache = {};
    var flashTimer;
    var quickViewCurrentProductId = null;
    var store = window.shopState || (window.shopState = { cart: [], wishlist: [] });

    // Embedded templates as fallback (works with file:// protocol)
    var embeddedTemplates = {
        'templates/product-card.liquid': '<div class="col-lg-{{ product.colClassLg | default: \'3\' }} col-md-{{ product.colClassMd | default: \'6\' }} col-{{ product.colClassXs | default: \'6\' }} col-sm-{{ product.colClassXs | default: \'6\' }}"><div class="team-item product-item"><div class="team-img product-img"><a href="{{ product.detailUrl }}"><img src="{{ product.image }}" alt="{{ product.title }}" loading="lazy"></a><div class="product-overlay"><button type="button" class="btn btn-cart product-action-btn" data-action="cart" data-product-id="{{ product.id }}" title="Add to Cart"><i class="fas fa-shopping-cart"></i></button><button type="button" class="btn btn-wishlist product-action-btn" data-action="wishlist" data-product-id="{{ product.id }}" title="Add to Wishlist"><i class="fas fa-heart"></i></button><button type="button" class="btn btn-view product-action-btn" data-action="quickview" data-product-id="{{ product.id }}" title="Quick View"><i class="fas fa-eye"></i></button></div>{% if product.badge %}<div class="product-badge">{{ product.badge }}</div>{% endif %}</div><div class="team-text product-content"><h2><a href="{{ product.detailUrl }}">{{ product.title }}</a></h2><div class="product-rating" style="margin: 10px 0;">{% for star in product.stars %}{% if star == \'full\' %}<i class="fas fa-star" style="color: #ffc107;"></i>{% elsif star == \'half\' %}<i class="fas fa-star-half-alt" style="color: #ffc107;"></i>{% else %}<i class="far fa-star" style="color: #ddd;"></i>{% endif %}{% endfor %}{% if product.reviewCount %}<span style="margin-left: 5px; color: #666;">({{ product.reviewCount }})</span>{% endif %}</div><div class="product-price-info"><p class="price" style="font-size: 20px; font-weight: 600; color: #aa9166; margin: 0;">{{ product.priceFormatted }}</p>{% if product.originalPriceFormatted %}<p class="old-price" style="font-size: 16px; color: #999; text-decoration: line-through; margin: 5px 0 0 0;">{{ product.originalPriceFormatted }}</p>{% endif %}</div></div></div></div>',
        'templates/category-card.liquid': '<div class="col-4 col-sm-4 col-md-4 col-lg-2"><a href="category.html?category={{ category.slug }}" class="category-card"><img src="{{ category.image }}" alt="{{ category.name }}" loading="lazy"><span>{{ category.name }}</span></a></div>'
    };

    function loadTemplate(path) {
        if (templateCache[path]) {
            return Promise.resolve(templateCache[path]);
        }
        
        // First try embedded template (works with file:// protocol)
        if (embeddedTemplates[path]) {
            console.log('Using embedded template for:', path);
            try {
                var template = engine.parse(embeddedTemplates[path]);
                templateCache[path] = template;
                console.log('Embedded template parsed successfully:', path);
                return Promise.resolve(template);
            } catch (error) {
                console.error('Failed to parse embedded template:', error);
            }
        }
        
        // Fallback to fetch (works with http:// protocol)
        console.log('Loading template from file:', path);
        return fetch(path)
            .then(function (response) {
                if (!response.ok) {
                    console.error('Template fetch failed:', response.status, response.statusText, 'for path:', path);
                    throw new Error('Failed to load template: ' + path + ' (Status: ' + response.status + ')');
                }
                return response.text();
            })
            .then(function (source) {
                if (!source || source.trim().length === 0) {
                    console.error('Template file is empty:', path);
                    throw new Error('Template file is empty: ' + path);
                }
                console.log('Template loaded, parsing...', path);
                return engine.parse(source);
            })
            .then(function (template) {
                templateCache[path] = template;
                console.log('Template parsed successfully:', path);
                return template;
            })
            .catch(function (error) {
                console.error('Template loading error:', error);
                console.error('Failed to load template from path:', path);
                // If fetch fails and no embedded template, return null
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

    function buildProductViewModel(product, colClasses) {
        var badgeText = null;
        if (product.badge) {
            badgeText = product.badge;
        } else if (product.discount) {
            badgeText = product.discount + '% OFF';
        } else if (!product.inStock) {
            badgeText = 'Sold Out';
        }

        // Default: 4 per row on lg (col-lg-3), 2 per row on md (col-md-6), 2 per row on xs (col-6)
        var defaultClasses = { lg: '3', md: '6', xs: '6' };
        var classes = colClasses || defaultClasses;

        return {
            id: product.id,
            title: product.title,
            image: product.image,
            badge: badgeText,
            priceFormatted: formatCurrency(product.price),
            originalPriceFormatted: product.originalPrice ? formatCurrency(product.originalPrice) : null,
            reviewCount: product.reviewCount,
            stars: buildStars(product.rating),
            detailUrl: 'product-detail.html?id=' + encodeURIComponent(product.id),
            colClassLg: classes.lg,
            colClassMd: classes.md,
            colClassXs: classes.xs
        };
    }

    function renderProducts(options) {
        var container = document.getElementById(options.containerId);
        if (!container) {
            console.error('Container not found:', options.containerId);
            return;
        }

        console.log('Rendering products for container:', options.containerId);
        
        // Determine column classes based on container ID
        var colClasses = { lg: '3', md: '6', xs: '6' }; // Default: 4 per row on lg, 2 per row on md/xs
        if (options.containerId === 'shop-products-grid') {
            colClasses = { lg: '4', md: '4', xs: '6' }; // Shop page: 3 per row on lg/md, 2 per row on mobile
        }
        
        loadTemplate(options.templatePath).then(function (template) {
            if (!template) {
                console.error('Template is null for:', options.templatePath);
                container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now. Check console for details.</div>';
                return;
            }

            var products = (options.getProducts() || []).map(function(p) {
                return buildProductViewModel(p, colClasses);
            });
            console.log('Products to render:', products.length, 'for container:', options.containerId);
            
            if (!products.length) {
                console.warn('No products available for:', options.containerId);
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
                e.preventDefault();
                var page = parseInt(this.getAttribute('data-page'), 10);
                if (!isNaN(page) && page >= 1 && page !== currentPage && page <= totalPages) {
                    // Update URL without page reload
                    window.history.pushState({ page: page }, '', '?page=' + page);
                    // Scroll to top smoothly
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Render products
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

        // Show loading state
        container.innerHTML = '<div class="col-12 text-center"><div class="loading-spinner" style="padding: 40px;"><i class="fas fa-spinner fa-spin fa-2x" style="color: #aa9166;"></i><p style="margin-top: 15px; color: #666;">Loading products...</p></div></div>';

        var allProducts = window.getAllProducts() || [];
        var productsPerPage = 12;
        var currentPage = getCurrentPage();
        var totalPages = Math.ceil(allProducts.length / productsPerPage);
        var startIndex = (currentPage - 1) * productsPerPage;
        var endIndex = startIndex + productsPerPage;
        var pageProducts = allProducts.slice(startIndex, endIndex);

        // Use cached template if available
        var templatePath = 'templates/product-card.liquid';
        var template = templateCache[templatePath];
        
        if (template) {
            renderProductsDirectly(container, pageProducts, template, currentPage, totalPages);
        } else {
            loadTemplate(templatePath).then(function (template) {
                if (!template) {
                    container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
                    return;
                }
                renderProductsDirectly(container, pageProducts, template, currentPage, totalPages);
            }).catch(function (error) {
                console.error('Failed to load template:', error);
                container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
            });
        }
    }

    function renderProductsDirectly(container, pageProducts, template, currentPage, totalPages) {
        if (!pageProducts.length) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-4">No products available.</div>';
            renderPagination(currentPage, totalPages);
            return;
        }

        // Shop page uses col-lg-4 col-md-4 col-6 (3 per row on lg/md, 2 per row on mobile)
        var colClasses = { lg: '4', md: '4', xs: '6' };
        var products = pageProducts.map(function(p) {
            return buildProductViewModel(p, colClasses);
        });
        var renderPromises = products.map(function (product) {
            return engine.render(template, { product: product });
        });

        Promise.all(renderPromises)
            .then(function (chunks) {
                // Clear container and set innerHTML - container already has row class
                container.innerHTML = chunks.join('');
                // Re-bind action handlers for new products
                bindProductActionHandlers(container);
                // Update pagination
                renderPagination(currentPage, totalPages);
            })
            .catch(function (error) {
                console.error('Failed to render products.', error);
                container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
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
                // Use category name with proper capitalization
                var categoryName = product.categoryLabel || (slug.charAt(0).toUpperCase() + slug.slice(1).replace(/\b\w/g, function(l) { return l.toUpperCase(); }));
                map.set(slug, {
                    slug: slug,
                    name: categoryName,
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
            // Ensure slug is properly formatted for URL (use name if slug is not available)
            if (!category.slug) {
                category.slug = category.name.toLowerCase().replace(/\s+/g, '-');
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

        // Use event delegation on the container
        container.addEventListener('click', function (event) {
            // Check if clicked element or its parent is a product-action-btn
            var button = event.target.closest('.product-action-btn');
            if (!button) {
                // Also check if clicked on icon inside button
                var icon = event.target;
                if (icon && icon.tagName === 'I') {
                    button = icon.closest('.product-action-btn');
                }
            }
            
            if (!button) {
                return;
            }
            
            // Stop all event propagation immediately
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            
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
                // Open quick view modal
                openQuickView(productId);
                // Prevent any default behavior or navigation
                return false;
            }
            
            // Prevent any further event handling
            return false;
        }, true); // Use capture phase to catch event early

        container.dataset.actionsBound = 'true';
    }

    function initProductRendering() {
        console.log('Initializing product rendering...');
        
        renderCategories({
            containerId: 'categories-grid',
            templatePath: 'templates/category-card.liquid',
            getCategories: buildCategoryViewModels
        });

        renderProducts({
            containerId: 'featured-products-grid',
            templatePath: 'templates/product-card.liquid',
            getProducts: function () {
                var products = (window.getFeaturedProducts() || []).slice(0, 4);
                console.log('Featured products:', products.length);
                return products;
            }
        });

        renderProducts({
            containerId: 'recent-products-grid',
            templatePath: 'templates/product-card.liquid',
            getProducts: function () {
                var products = (window.getNewProducts() || []).slice(0, 4);
                console.log('New products:', products.length);
                return products;
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

        // Also bind handlers directly to buttons to ensure they work
        document.addEventListener('click', function(event) {
            var btn = event.target.closest('.btn-view.product-action-btn[data-action="quickview"]');
            if (btn) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                var productId = btn.getAttribute('data-product-id');
                if (productId) {
                    openQuickView(productId);
                }
                return false;
            }
        }, true); // Use capture phase
        
        // Quick view buttons
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
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductRendering);
    } else {
        // DOM already loaded, call immediately
        initProductRendering();
    }

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
    
    }); // End of waitForDependencies callback
})();


