// Category Page Functionality
(function() {
    'use strict';
    
    // Category mapping - maps URL category params to product categories
    const categoryMapping = {
        'dresses': ['fashion', 'dresses', 'men-dresses', 'women-dresses', 'baby-dresses'],
        'men-dresses': ['fashion', 'men-dresses'],
        'women-dresses': ['fashion', 'women-dresses'],
        'baby-dresses': ['fashion', 'baby-dresses'],
        'shirts': ['fashion', 'shirts'],
        'jeans': ['fashion', 'jeans'],
        'swimwear': ['fashion', 'swimwear'],
        'sleepwear': ['fashion', 'sleepwear'],
        'sportswear': ['fashion', 'sportswear'],
        'jumpsuits': ['fashion', 'jumpsuits'],
        'blazers': ['fashion', 'blazers'],
        'jackets': ['fashion', 'jackets'],
        'shoes': ['fashion', 'shoes'],
        'electronics': ['electronics'],
        'fashion': ['fashion'],
        'home-kitchen': ['home & kitchen', 'home', 'kitchen'],
        'toys': ['toys'],
        'furniture': ['furniture']
    };
    
    // Category display names
    const categoryNames = {
        'dresses': 'Dresses Collection',
        'men-dresses': "Men's Dresses",
        'women-dresses': "Women's Dresses",
        'baby-dresses': "Baby's Dresses",
        'shirts': 'Shirts Collection',
        'jeans': 'Jeans Collection',
        'swimwear': 'Swimwear Collection',
        'sleepwear': 'Sleepwear Collection',
        'sportswear': 'Sportswear Collection',
        'jumpsuits': 'Jumpsuits Collection',
        'blazers': 'Blazers Collection',
        'jackets': 'Jackets Collection',
        'shoes': 'Shoes Collection'
    };
    
    // Category descriptions
    const categoryDescriptions = {
        'dresses': 'Discover our stunning collection of dresses for every occasion. From casual day dresses to elegant evening wear, find the perfect dress that matches your style.',
        'men-dresses': "Browse our collection of men's dresses and formal wear. Perfect for special occasions and professional settings.",
        'women-dresses': "Explore our beautiful collection of women's dresses. From casual to elegant, find the perfect dress for any occasion.",
        'baby-dresses': "Adorable collection of baby dresses. Comfortable, stylish, and perfect for your little one.",
        'shirts': 'Browse our wide range of shirts for men and women. From casual t-shirts to formal dress shirts, find the perfect shirt for any occasion.',
        'jeans': 'Find the perfect pair of jeans from our extensive collection. From skinny to straight fit, we have jeans for every style and preference.',
        'swimwear': 'Dive into style with our swimwear collection. From bikinis to one-pieces, find the perfect swimwear for your beach vacation.',
        'sleepwear': 'Comfortable and stylish sleepwear collection. Perfect for a good night\'s sleep.',
        'sportswear': 'Activewear and sportswear for your fitness journey. Comfortable, durable, and stylish.',
        'jumpsuits': 'One-piece wonders! Browse our collection of jumpsuits and rompers for every occasion.',
        'blazers': 'Professional and stylish blazers for men and women. Perfect for office wear and formal occasions.',
        'jackets': 'Stay warm and stylish with our jacket collection. From denim to leather, find your perfect outerwear.',
        'shoes': 'Step out in style with our collection of shoes. From sneakers to heels, find the perfect footwear for any occasion.'
    };
    
    // Get URL parameter
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // Get current page from URL
    function getCurrentPage() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('page')) || 1;
    }
    
    // Update URL with page parameter
    function updateURL(page) {
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        window.history.pushState({page: page}, '', url);
    }
    
    // Filter products by category
    function getCategoryProducts(categoryParam) {
        if (typeof window.getAllProducts !== 'function') {
            console.log('getAllProducts function not available');
            return [];
        }
        
        const allProducts = window.getAllProducts() || [];
        console.log('Total products:', allProducts.length);
        
        const categories = categoryMapping[categoryParam] || [];
        console.log('Category param:', categoryParam, 'Mapped categories:', categories);
        
        if (categories.length === 0) {
            console.log('No category mapping found, returning all products');
            return allProducts; // Return all products if category not found
        }
        
        const filtered = allProducts.filter(function(product) {
            const productCategory = (product.category || '').toLowerCase();
            const matches = categories.some(function(cat) {
                return productCategory.includes(cat.toLowerCase());
            });
            if (matches) {
                console.log('Product matched:', product.title, 'Category:', productCategory);
            }
            return matches;
        });
        
        console.log('Filtered products count:', filtered.length);
        return filtered;
    }
    
    // Render products with pagination
    function renderCategoryProducts(categoryParam, page) {
        console.log('renderCategoryProducts called with:', categoryParam, page);
        
        // Wait for products.js and LiquidJS to be ready
        if (typeof window.getAllProducts !== 'function') {
            console.log('Waiting for getAllProducts...', typeof window.getAllProducts);
            setTimeout(function() {
                renderCategoryProducts(categoryParam, page);
            }, 200);
            return;
        }
        
        // Check for LiquidJS - it might be window.liquidjs or window.Liquid
        let Liquid;
        if (window.liquidjs && window.liquidjs.Liquid) {
            Liquid = window.liquidjs.Liquid;
        } else if (window.Liquid) {
            Liquid = window.Liquid;
        } else {
            console.log('Waiting for LiquidJS...', typeof window.liquidjs, typeof window.Liquid);
            setTimeout(function() {
                renderCategoryProducts(categoryParam, page);
            }, 200);
            return;
        }
        
        const products = getCategoryProducts(categoryParam);
        console.log('Products to render:', products.length);
        
        const productsPerPage = 12;
        const totalPages = Math.ceil(products.length / productsPerPage);
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const pageProducts = products.slice(startIndex, endIndex);
        
        console.log('Page products:', pageProducts.length);
        
        const container = document.getElementById('category-products-grid');
        if (!container) {
            console.error('Container not found!');
            return;
        }
        
        // Load template using fetch and LiquidJS
        const engine = new Liquid({ cache: true });
        
        console.log('Loading template...');
        fetch('templates/product-card.liquid')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to load template: ' + response.status);
                }
                console.log('Template loaded successfully');
                return response.text();
            })
            .then(function(source) {
                console.log('Parsing template...');
                return engine.parse(source);
            })
            .then(function(template) {
                console.log('Template parsed successfully');
                if (!template) {
                    container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
                    return;
                }
                
                if (!pageProducts.length) {
                    container.innerHTML = '<div class="col-12 text-center text-muted py-4">No products found in this category.</div>';
                    renderPagination(page, totalPages);
                    return;
                }
                
                console.log('Building product view models...');
                // Build product view models using products.js function
                const productsData = pageProducts.map(function(product) {
                    if (window.buildProductViewModel) {
                        return window.buildProductViewModel(product);
                    }
                    // Fallback if buildProductViewModel not available
                    const rating = product.rating || 0;
                    const stars = [];
                    for (let i = 1; i <= 5; i++) {
                        if (rating >= i) stars.push('full');
                        else if (rating >= i - 0.5) stars.push('half');
                        else stars.push('empty');
                    }
                    return {
                        id: product.id,
                        title: product.title,
                        image: product.image,
                        badge: product.badge || '',
                        priceFormatted: '₹' + (product.price || 0).toLocaleString('en-IN'),
                        originalPriceFormatted: product.originalPrice ? '₹' + product.originalPrice.toLocaleString('en-IN') : null,
                        reviewCount: product.reviewCount || 0,
                        stars: stars,
                        detailUrl: 'product-detail.html?id=' + encodeURIComponent(product.id)
                    };
                });
                
                console.log('Rendering products with LiquidJS...', productsData.length);
                // Render using LiquidJS engine
                const renderPromises = productsData.map(function(product) {
                    return engine.render(template, { product: product });
                });
                
                Promise.all(renderPromises)
                    .then(function(chunks) {
                        console.log('Products rendered successfully!', chunks.length);
                        container.innerHTML = chunks.join('');
                        // Bind product action handlers
                        if (window.bindProductActionHandlers) {
                            window.bindProductActionHandlers(container);
                        }
                        // Render pagination
                        renderPagination(page, totalPages);
                    })
                    .catch(function(error) {
                        console.error('Failed to render products.', error);
                        container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
                    });
            })
            .catch(function(error) {
                console.error('Error loading template:', error);
                container.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load products right now.</div>';
            });
    }
    
    // Render pagination
    function renderPagination(currentPage, totalPages) {
        const paginationContainer = document.getElementById('category-pagination');
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }
        
        let html = '';
        const categoryParam = getUrlParameter('cat') || 'dresses';
        
        // Previous button
        if (currentPage > 1) {
            html += '<li class="page-item"><a class="page-link" href="?cat=' + categoryParam + '&page=' + (currentPage - 1) + '">Previous</a></li>';
        } else {
            html += '<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>';
        }
        
        // Page numbers
        const maxPages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPages, startPage + maxPages - 1);
        
        if (endPage - startPage < maxPages - 1) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }
        
        if (startPage > 1) {
            html += '<li class="page-item"><a class="page-link" href="?cat=' + categoryParam + '&page=1">1</a></li>';
            if (startPage > 2) {
                html += '<li class="page-item disabled"><a class="page-link" href="#">...</a></li>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                html += '<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>';
            } else {
                html += '<li class="page-item"><a class="page-link" href="?cat=' + categoryParam + '&page=' + i + '">' + i + '</a></li>';
            }
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += '<li class="page-item disabled"><a class="page-link" href="#">...</a></li>';
            }
            html += '<li class="page-item"><a class="page-link" href="?cat=' + categoryParam + '&page=' + totalPages + '">' + totalPages + '</a></li>';
        }
        
        // Next button
        if (currentPage < totalPages) {
            html += '<li class="page-item"><a class="page-link" href="?cat=' + categoryParam + '&page=' + (currentPage + 1) + '">Next</a></li>';
        } else {
            html += '<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>';
        }
        
        paginationContainer.innerHTML = html;
        
        // Bind pagination click handlers
        paginationContainer.querySelectorAll('a.page-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                if (this.closest('.disabled') || this.closest('.active')) {
                    e.preventDefault();
                    return;
                }
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    const url = new URL(href, window.location.origin);
                    const page = parseInt(url.searchParams.get('page')) || 1;
                    updateURL(page);
                    renderCategoryProducts(categoryParam, page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }
    
    // Initialize category page
    function initCategoryPage() {
        console.log('initCategoryPage called');
        const categoryParam = getUrlParameter('cat') || 'dresses';
        const page = getCurrentPage();
        console.log('Category param:', categoryParam, 'Page:', page);
        
        // Update page title and meta
        const categoryName = categoryNames[categoryParam] || 'Category Collection';
        const categoryDesc = categoryDescriptions[categoryParam] || 'Browse our collection of fashion items.';
        
        document.title = categoryName + ' - Shop Top';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', categoryDesc);
        }
        
        // Update breadcrumb
        const breadcrumbCategory = document.getElementById('breadcrumb-category');
        if (breadcrumbCategory) {
            breadcrumbCategory.textContent = categoryName;
        }
        
        // Update header
        const categoryTitle = document.getElementById('category-title');
        const categoryDescription = document.getElementById('category-description');
        if (categoryTitle) {
            categoryTitle.textContent = categoryName;
        }
        if (categoryDescription) {
            categoryDescription.textContent = categoryDesc;
        }
        
        // Render products
        renderCategoryProducts(categoryParam, page);
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        initCategoryPage();
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Wait for products.js to load
            setTimeout(initCategoryPage, 300);
        });
    } else {
        setTimeout(initCategoryPage, 300);
    }
    
})();

