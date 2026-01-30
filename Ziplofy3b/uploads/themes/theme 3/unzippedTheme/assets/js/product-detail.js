(function() {
    'use strict';

    // Get product ID from URL
    function getProductIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || null;
    }

    // Format price
    function formatPrice(price) {
        return '₹' + price.toLocaleString('en-IN');
    }

    // Generate rating stars HTML
    function generateRatingStars(rating) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<small class="fas fa-star"></small>';
        }
        if (hasHalfStar) {
            starsHTML += '<small class="fas fa-star-half-alt"></small>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<small class="far fa-star"></small>';
        }
        return starsHTML;
    }

    // Populate product images carousel
    function populateProductImages(product) {
        const carouselInner = document.getElementById('product-carousel-inner');
        if (!carouselInner || !product.images || product.images.length === 0) {
            return;
        }

        carouselInner.innerHTML = '';
        product.images.forEach((image, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');
            carouselItem.innerHTML = `<img class="w-100 h-100" src="${image}" alt="${product.title}" loading="lazy">`;
            carouselInner.appendChild(carouselItem);
        });
    }

    // Populate product details
    function populateProductDetails(product) {
        // Badge
        const badgeEl = document.getElementById('product-badge');
        if (badgeEl && product.badge) {
            badgeEl.textContent = product.badge;
            badgeEl.style.display = 'inline-block';
        }

        // Title
        const titleEl = document.getElementById('product-title');
        if (titleEl) {
            titleEl.textContent = product.title;
        }

        // Update page title
        document.title = product.title + ' - Shop Top';

        // Rating
        const ratingEl = document.getElementById('product-rating');
        if (ratingEl) {
            ratingEl.innerHTML = generateRatingStars(product.rating || 0);
        }

        // Review count
        const reviewCountEl = document.getElementById('product-review-count');
        if (reviewCountEl) {
            reviewCountEl.textContent = `(${product.reviewCount || 0} ${product.reviewCount === 1 ? 'rating' : 'ratings'})`;
        }

        // Stock status
        const stockEl = document.getElementById('product-stock');
        if (stockEl) {
            if (product.inStock) {
                stockEl.style.display = 'inline-block';
            } else {
                stockEl.style.display = 'none';
            }
        }

        // Price
        const priceEl = document.getElementById('product-price');
        if (priceEl) {
            priceEl.textContent = formatPrice(product.price);
        }

        // Original price
        const originalPriceEl = document.getElementById('product-original-price');
        if (originalPriceEl && product.originalPrice && product.originalPrice > product.price) {
            originalPriceEl.innerHTML = `<del>${formatPrice(product.originalPrice)}</del>`;
            originalPriceEl.style.display = 'block';
        } else if (originalPriceEl) {
            originalPriceEl.style.display = 'none';
        }

        // Discount badge
        const discountBadgeEl = document.getElementById('product-discount-badge');
        if (discountBadgeEl && product.discount) {
            discountBadgeEl.textContent = product.discount + '% OFF';
            discountBadgeEl.style.display = 'inline-block';
        } else if (discountBadgeEl) {
            discountBadgeEl.style.display = 'none';
        }

        // Description
        const descriptionEl = document.getElementById('product-description');
        if (descriptionEl) {
            descriptionEl.textContent = product.description || product.shortDescription || '';
        }

        // Full description
        const fullDescriptionEl = document.getElementById('product-full-description');
        if (fullDescriptionEl) {
            if (product.description) {
                const paragraphs = product.description.split('\n').filter(p => p.trim());
                fullDescriptionEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
            } else {
                fullDescriptionEl.innerHTML = `<p>${product.shortDescription || 'No description available.'}</p>`;
            }
        }

        // Specifications
        const specificationsEl = document.getElementById('product-specifications');
        if (specificationsEl && product.specifications) {
            const specs = product.specifications;
            const keys = Object.keys(specs);
            const midPoint = Math.ceil(keys.length / 2);
            
            let html = '<div class="row">';
            html += '<div class="col-md-6"><ul class="list-group list-group-flush">';
            keys.slice(0, midPoint).forEach(key => {
                html += `<li class="list-group-item px-0"><strong>${key}:</strong> ${specs[key]}</li>`;
            });
            html += '</ul></div>';
            html += '<div class="col-md-6"><ul class="list-group list-group-flush">';
            keys.slice(midPoint).forEach(key => {
                html += `<li class="list-group-item px-0"><strong>${key}:</strong> ${specs[key]}</li>`;
            });
            html += '</ul></div></div>';
            specificationsEl.innerHTML = html;
        }

        // Reviews heading
        const reviewsHeadingEl = document.getElementById('reviews-heading');
        if (reviewsHeadingEl) {
            const reviewCount = product.reviewCount || 0;
            reviewsHeadingEl.textContent = `${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'} for "${product.title}"`;
        }

        // Update breadcrumb
        const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
        if (breadcrumbActive) {
            breadcrumbActive.textContent = product.title;
        }
    }

    // Load related products
    function loadRelatedProducts(currentProductId) {
        const carouselEl = document.getElementById('related-products-carousel');
        if (!carouselEl || !window.getAllProducts) {
            return;
        }

        const allProducts = window.getAllProducts();
        const relatedProducts = allProducts
            .filter(p => p.id !== currentProductId)
            .slice(0, 5);

        if (relatedProducts.length === 0) {
            carouselEl.innerHTML = '<p class="text-center text-muted">No related products found.</p>';
            return;
        }

        // Render products using simple HTML
        let html = '';
        relatedProducts.forEach(product => {
            const badgeHTML = product.badge ? `<span class="badge badge-discount position-absolute" style="top: 10px; left: 10px;">${product.badge}</span>` : '';
            const originalPriceHTML = product.originalPrice && product.originalPrice > product.price 
                ? `<h6 class="text-muted ml-2"><del>${formatPrice(product.originalPrice)}</del></h6>` 
                : '';
            
            html += `
                <div class="product-item bg-light">
                    <div class="product-img position-relative overflow-hidden">
                        ${badgeHTML}
                        <img class="img-fluid w-100" src="${product.image}" alt="${product.title}" loading="lazy">
                        <div class="product-action">
                            <button type="button" class="btn btn-outline-dark btn-square product-action-btn" data-action="cart" data-product-id="${product.id}" aria-label="Add ${product.title} to cart">
                                <i class="fa fa-shopping-cart"></i>
                            </button>
                            <button type="button" class="btn btn-outline-dark btn-square product-action-btn" data-action="wishlist" data-product-id="${product.id}" aria-label="Add ${product.title} to wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                            <button type="button" class="btn btn-outline-dark btn-square product-action-btn" data-action="compare" data-product-id="${product.id}" aria-label="Compare ${product.title}">
                                <i class="fa fa-sync-alt"></i>
                            </button>
                            <button type="button" class="btn btn-outline-dark btn-square product-action-btn" data-action="quickview" data-product-id="${product.id}" aria-label="Quick view ${product.title}">
                                <i class="fa fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="text-center py-4">
                        <a class="h6 text-decoration-none text-truncate" href="product-detail.html?id=${product.id}">${product.title}</a>
                        <div class="d-flex align-items-center justify-content-center mt-2">
                            <h5>${formatPrice(product.price)}</h5>
                            ${originalPriceHTML}
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            ${generateRatingStars(product.rating || 0)}
                            <small>(${product.reviewCount || 0})</small>
                        </div>
                    </div>
                </div>
            `;
        });
        carouselEl.innerHTML = html;
        
        // Initialize Owl Carousel after ensuring main.js has run
        // Destroy existing carousel if any to avoid conflicts
        setTimeout(function() {
            if (window.jQuery && window.jQuery.fn.owlCarousel) {
                // Destroy existing carousel if initialized (from main.js)
                var $carousel = window.jQuery(carouselEl);
                if ($carousel.data('owl.carousel')) {
                    try {
                        $carousel.trigger('destroy.owl.carousel');
                    } catch(e) {
                        // Ignore if already destroyed
                    }
                    $carousel.removeClass('owl-carousel owl-theme');
                    $carousel.find('.owl-stage-outer').remove();
                    $carousel.find('.owl-nav').remove();
                    $carousel.find('.owl-dots').remove();
                }
                
                // Clear any existing owl classes
                $carousel.removeClass('owl-carousel owl-theme');
                
                // Initialize new carousel
                $carousel.addClass('owl-carousel owl-theme').owlCarousel({
                    loop: relatedProducts.length > 4,
                    margin: 29,
                    nav: true,
                    dots: false,
                    autoplay: false,
                    smartSpeed: 1000,
                    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
                    responsive: {
                        0: {
                            items: 1,
                            margin: 10
                        },
                        600: {
                            items: 2,
                            margin: 20
                        },
                        1000: {
                            items: 4,
                            margin: 29
                        }
                    }
                });
            }
        }, 800);
        
        // Bind action handlers
        setTimeout(function() {
            const actionButtons = carouselEl.querySelectorAll('.product-action-btn');
            actionButtons.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const action = this.getAttribute('data-action');
                    const productId = this.getAttribute('data-product-id');
                    const product = window.getProductById(productId);
                    
                    if (!product) return;
                    
                    if (action === 'cart') {
                        if (window.addProductToCollection) {
                            window.addProductToCollection('cart', product);
                        }
                    } else if (action === 'wishlist') {
                        if (window.addProductToCollection) {
                            window.addProductToCollection('wishlist', product);
                        }
                    } else if (action === 'compare') {
                        if (window.showFlashMessage) {
                            window.showFlashMessage('info', 'Compare feature coming soon!');
                        }
                    } else if (action === 'quickview') {
                        if (window.openQuickView) {
                            window.openQuickView(productId);
                        }
                    }
                });
            });
        }, 200);
    }

    // Initialize product detail page
    function initProductDetail() {
        const productId = getProductIdFromURL();
        if (!productId) {
            console.error('Product ID not found in URL');
            return;
        }

        if (!window.getProductById) {
            console.error('getProductById function not available');
            return;
        }

        const product = window.getProductById(productId);
        if (!product) {
            console.error('Product not found:', productId);
            // Show error message
            const titleEl = document.getElementById('product-title');
            if (titleEl) {
                titleEl.textContent = 'Product Not Found';
            }
            return;
        }

        // Populate product details
        populateProductDetails(product);
        populateProductImages(product);
        loadRelatedProducts(productId);

        // Handle Add to Cart button
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                if (window.addProductToCollection) {
                    // Get quantity from input if available
                    const quantityInput = document.querySelector('.quantity input[type="text"]');
                    const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;
                    
                    // Add product to cart with quantity
                    window.addProductToCollection('cart', product, quantity);
                }
            });
        }

        // Handle Buy Now button
        const buyNowBtn = document.getElementById('buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function() {
                // Get quantity from input if available
                const quantityInput = document.querySelector('.quantity input[type="text"]');
                const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;
                
                // Store product for buy now (temporary, not in cart)
                var buyNowProduct = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                };
                
                // Store in sessionStorage for checkout page
                try {
                    sessionStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
                    console.log('Buy Now product stored:', buyNowProduct);
                } catch(e) {
                    console.error('Error storing buyNowProduct:', e);
                }
                
                // Redirect to checkout with buyNow parameter
                window.location.href = 'checkout.html?buyNow=true';
            });
        }

        // Update count badges
        if (window.updateCountBadges) {
            window.updateCountBadges();
        }
    }

    // Wait for DOM and product data to be ready
    // Also wait for main.js to load to avoid conflicts
    function startInit() {
        // Wait a bit more to ensure all scripts are loaded
        setTimeout(initProductDetail, 200);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startInit);
    } else {
        // DOM already loaded, wait for scripts
        startInit();
    }
})();

