(function(){
    'use strict';
    
    // Wait for dependencies to load
    function waitForDependencies(callback, maxAttempts) {
        maxAttempts = maxAttempts || 100;
        var attempts = 0;
        var check = function() {
            attempts++;
            
            // Check for LiquidJS (can be window.Liquid, liquidjs.Liquid, or global Liquid)
            var hasLiquid = typeof window.Liquid !== 'undefined' || 
                           typeof Liquid !== 'undefined' ||
                           (typeof window.liquidjs !== 'undefined' && typeof window.liquidjs.Liquid !== 'undefined') ||
                           (typeof liquidjs !== 'undefined' && typeof liquidjs.Liquid !== 'undefined');
            
            // Check for product helper functions
            var hasProducts = typeof window.getAllProducts === 'function' && 
                             typeof window.getProductsByCategory === 'function' &&
                             typeof window.getProductById === 'function';
            
            console.log('Dependency check attempt', attempts, '- Liquid:', hasLiquid, 'Products:', hasProducts);
            
            if (hasLiquid && hasProducts) {
                console.log('All dependencies loaded successfully');
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(check, 100);
            } else {
                console.error('Dependencies not loaded after', maxAttempts, 'attempts');
                console.error('LiquidJS available:', hasLiquid);
                console.error('getAllProducts available:', typeof window.getAllProducts);
                console.error('getProductsByCategory available:', typeof window.getProductsByCategory);
                console.error('getProductById available:', typeof window.getProductById);
                
                var container = document.getElementById('catProductsRow');
                if (container) {
                    container.innerHTML = '<div class="col-12 text-center text-danger py-4"><h4>Unable to load products</h4><p>Please check that all scripts are loaded correctly and refresh the page.</p></div>';
                }
            }
        };
        check();
    }

    function getCategoryFromURL(){
        var params = new URLSearchParams(window.location.search);
        var category = params.get('category');
        if (!category) {
            return 'All';
        }
        // Decode URL-encoded values
        try {
            category = decodeURIComponent(category);
        } catch (e) {
            // If decoding fails, use original value
        }
        return category.trim();
    }

    function setPageHeader(category){
        var titleEl = document.getElementById('categoryTitle');
        var breadcrumbEl = document.getElementById('breadcrumbCategory');
        
        var displayName = category === 'All' ? 'All Products' : category;
        
        if (titleEl) {
            titleEl.textContent = displayName;
        }
        if (breadcrumbEl) {
            breadcrumbEl.textContent = category;
            breadcrumbEl.href = 'category.html?category=' + encodeURIComponent(category);
        }
    }

    function formatCurrency(value) {
        try {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(value);
        } catch (e) {
            return '₹' + Math.round(value).toLocaleString('en-IN');
        }
    }

    function buildStars(rating) {
        var stars = [];
        var fullStars = Math.floor(rating);
        var hasHalfStar = rating % 1 >= 0.5;
        
        for (var i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push('full');
            } else if (i === fullStars && hasHalfStar) {
                stars.push('half');
            } else {
                stars.push('empty');
            }
        }
        return stars;
    }

    function buildProductViewModel(product) {
        if (!product) return null;
        
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
            title: product.title || product.name || 'Product',
            image: product.image || '',
            badge: badgeText,
            priceFormatted: formatCurrency(product.price || 0),
            originalPriceFormatted: product.originalPrice && product.originalPrice > product.price ? formatCurrency(product.originalPrice) : null,
            reviewCount: product.reviewCount || 0,
            stars: buildStars(product.rating || 0),
            detailUrl: 'product-detail.html?id=' + encodeURIComponent(product.id),
            colClassLg: '4', // 3 per row on desktop (col-lg-4)
            colClassMd: '4', // 3 per row on tablet (col-md-4)
            colClassXs: '6'  // 2 per row on mobile (col-6)
        };
    }

    // Embedded template as fallback (works with file:// protocol)
    var embeddedTemplate = '<div class="col-lg-{{ product.colClassLg | default: \'4\' }} col-md-{{ product.colClassMd | default: \'4\' }} col-sm-{{ product.colClassXs | default: \'6\' }} col-{{ product.colClassXs | default: \'6\' }}"><div class="team-item product-item"><div class="team-img product-img"><a href="{{ product.detailUrl }}"><img src="{{ product.image }}" alt="{{ product.title }}" loading="lazy"></a><div class="product-overlay"><button type="button" class="btn btn-cart product-action-btn" data-action="cart" data-product-id="{{ product.id }}" title="Add to Cart"><i class="fas fa-shopping-cart"></i></button><button type="button" class="btn btn-wishlist product-action-btn" data-action="wishlist" data-product-id="{{ product.id }}" title="Add to Wishlist"><i class="fas fa-heart"></i></button><button type="button" class="btn btn-view product-action-btn" data-action="quickview" data-product-id="{{ product.id }}" title="Quick View"><i class="fas fa-eye"></i></button></div>{% if product.badge %}<div class="product-badge">{{ product.badge }}</div>{% endif %}</div><div class="team-text product-content"><h2><a href="{{ product.detailUrl }}">{{ product.title }}</a></h2><div class="product-rating" style="margin: 10px 0;">{% for star in product.stars %}{% if star == \'full\' %}<i class="fas fa-star" style="color: #ffc107;"></i>{% elsif star == \'half\' %}<i class="fas fa-star-half-alt" style="color: #ffc107;"></i>{% else %}<i class="far fa-star" style="color: #ddd;"></i>{% endif %}{% endfor %}{% if product.reviewCount %}<span style="margin-left: 5px; color: #666;">({{ product.reviewCount }})</span>{% endif %}</div><div class="product-price-info"><p class="price" style="font-size: 20px; font-weight: 600; color: #aa9166; margin: 0;">{{ product.priceFormatted }}</p>{% if product.originalPriceFormatted %}<p class="old-price" style="font-size: 16px; color: #999; text-decoration: line-through; margin: 5px 0 0 0;">{{ product.originalPriceFormatted }}</p>{% endif %}</div></div></div></div>';

    function loadTemplate(path) {
        // First try embedded template
        if (path === 'templates/product-card.liquid' && embeddedTemplate) {
            return Promise.resolve(embeddedTemplate);
        }
        
        // Fallback to fetch
        return fetch(path)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Template not found');
                }
                return response.text();
            })
            .catch(function(error) {
                console.warn('Failed to load template from', path, 'using embedded template');
                if (path === 'templates/product-card.liquid') {
                    return embeddedTemplate;
                }
                throw error;
            });
    }

    function renderCategoryProducts(category) {
        var container = document.getElementById('catProductsRow');
        if (!container) {
            console.error('Container #catProductsRow not found');
            return;
        }

        // Show loading state
        container.innerHTML = '<div class="col-12 text-center"><div class="loading-spinner" style="padding: 40px;"><i class="fas fa-spinner fa-spin fa-2x" style="color: #aa9166;"></i><p style="margin-top: 15px; color: #666;">Loading products...</p></div></div>';

        // Get products by category
        var products = [];
        if (category === 'All') {
            products = window.getAllProducts();
            console.log('Loading all products:', products.length);
        } else {
            // Normalize category to lowercase for matching
            var normalizedCategory = category.toLowerCase().trim();
            console.log('Loading products for category:', category, 'normalized:', normalizedCategory);
            products = window.getProductsByCategory(normalizedCategory);
            console.log('Found products:', products.length);
            
            // If no products found, try to find by name match
            if (products.length === 0) {
                console.log('No products found with exact match, trying name search...');
                var allProducts = window.getAllProducts();
                products = allProducts.filter(function(p) {
                    var productCategory = (p.category || '').toLowerCase();
                    var productCategoryLabel = (p.categoryLabel || '').toLowerCase();
                    return productCategory === normalizedCategory || 
                           productCategoryLabel === normalizedCategory ||
                           productCategory.indexOf(normalizedCategory) !== -1 ||
                           normalizedCategory.indexOf(productCategory) !== -1;
                });
                console.log('Found products after name search:', products.length);
            }
        }

        if (!products || products.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-4"><h4>No products found</h4><p>No products available in this category.</p></div>';
            return;
        }

        // Load template and render
        loadTemplate('templates/product-card.liquid')
            .then(function(templateStr) {
                if (!templateStr) {
                    throw new Error('Template is empty');
                }
                
                // Get LiquidJS engine - try different ways it might be exposed
                var Liquid = window.Liquid || 
                            (window.liquidjs && window.liquidjs.Liquid) ||
                            (typeof liquidjs !== 'undefined' && liquidjs.Liquid) ||
                            (typeof Liquid !== 'undefined' ? Liquid : null);
                
                if (!Liquid) {
                    throw new Error('LiquidJS not available');
                }
                
                var engine = new Liquid({ cache: true });
                
                var template = engine.parse(templateStr);
                console.log('Template loaded and parsed successfully');

                // Build view models
                var viewModels = products.map(buildProductViewModel).filter(function(vm) {
                    return vm !== null;
                });
                console.log('View models built:', viewModels.length);

                if (viewModels.length === 0) {
                    container.innerHTML = '<div class="col-12 text-center text-muted py-4">No products to display.</div>';
                    return;
                }

                // Render all products
                var renderPromises = viewModels.map(function(product) {
                    return engine.render(template, { product: product });
                });

                Promise.all(renderPromises)
                    .then(function(chunks) {
                        console.log('Products rendered, updating DOM');
                        container.innerHTML = chunks.join('');
                        // Bind action handlers after rendering
                        bindProductActionHandlers(container);
                        console.log('Products displayed successfully');
                    })
                    .catch(function(error) {
                        console.error('Failed to render products:', error);
                        container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to render products right now. Error: ' + error.message + '</div>';
                    });
            })
            .catch(function(error) {
                console.error('Failed to load template:', error);
                container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now. Error: ' + error.message + '</div>';
            });
    }

    // Bind product action handlers (Add to Cart, Wishlist, Quick View)
    function bindProductActionHandlers(container) {
        if (!container || container.dataset.actionsBound === 'true') {
            return;
        }

        container.addEventListener('click', function (event) {
            var button = event.target.closest('.product-action-btn');
            if (!button) {
                return;
            }
            
            event.preventDefault();
            event.stopPropagation();
            
            var action = button.getAttribute('data-action');
            var productId = button.getAttribute('data-product-id');
            
            if (!productId || !action) {
                return;
            }
            
            var product = window.getProductById(productId);
            if (!product) {
                console.warn('Product not found:', productId);
                showFlashMessage('warning', 'Product not found.');
                return;
            }
            
            // Handle different actions
            if (action === 'cart') {
                addProductToCollection('cart', product);
            } else if (action === 'wishlist') {
                addProductToCollection('wishlist', product);
            } else if (action === 'quickview') {
                if (typeof window.openQuickView === 'function') {
                    window.openQuickView(productId);
                } else {
                    console.warn('Quick View function not available');
                    showFlashMessage('info', 'Quick View feature not available.');
                }
            }
        });

        container.dataset.actionsBound = 'true';
    }

    // Add product to cart or wishlist
    function addProductToCollection(collection, product) {
        if (!product) return;
        
        var store = window.shopState || (window.shopState = { cart: [], wishlist: [] });
        var collectionArray = store[collection] || [];
        
        // Check if product already exists
        var exists = collectionArray.some(function(item) {
            return String(item.id) === String(product.id);
        });
        
        if (exists) {
            showFlashMessage('info', product.title + ' is already in your ' + collection + '.');
            return;
        }
        
        collectionArray.push(product);
        store[collection] = collectionArray;
        
        // Update cart count if it's cart
        if (collection === 'cart') {
            updateCartCount();
        }
        
        var message = product.title + ' added to ' + collection + '!';
        showFlashMessage('success', message);
    }

    function updateCartCount() {
        var store = window.shopState || { cart: [] };
        var count = store.cart ? store.cart.length : 0;
        var cartElements = document.querySelectorAll('.cart-count, .mh-badge');
        cartElements.forEach(function(el) {
            el.textContent = count;
        });
    }

    function showFlashMessage(type, message) {
        var el = document.getElementById('flash-message');
        if (!el) {
            console.log('Flash message:', type, message);
            return;
        }
        el.textContent = message;
        el.className = 'flash-message flash-' + type + ' show';
        setTimeout(function () {
            el.classList.remove('show');
        }, 3000);
    }

    // Initialize when DOM is ready and dependencies are loaded
    function initializeCategoryPage() {
        console.log('Category page DOM ready');
        waitForDependencies(function() {
            console.log('Dependencies loaded, initializing category page');
            var category = getCategoryFromURL();
            console.log('Category from URL:', category);
            setPageHeader(category);
            renderCategoryProducts(category);
        });
    }

    // Try to initialize immediately if DOM is already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCategoryPage);
    } else {
        // DOM is already ready
        setTimeout(initializeCategoryPage, 100);
    }
})();
