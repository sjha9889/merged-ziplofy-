(function(){
    // Wait for dependencies to load
    function waitForDependencies(callback, maxAttempts) {
        maxAttempts = maxAttempts || 50;
        var attempts = 0;
        var check = function() {
            attempts++;
            var hasProducts = typeof window.getProductById === 'function' && typeof window.getAllProducts === 'function';
            
            if (hasProducts) {
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(check, 100);
            } else {
                console.error('Dependencies not loaded after', maxAttempts, 'attempts');
                showError('Unable to load product data. Please refresh the page.');
            }
        };
        check();
    }

    function getProductIdFromURL() {
        var params = new URLSearchParams(window.location.search);
        return params.get('id') || null;
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

    function renderProductImages(product) {
        var carouselInner = document.querySelector('#product-carousel .carousel-inner');
        if (!carouselInner || !product.images || product.images.length === 0) {
            return;
        }

        carouselInner.innerHTML = '';
        product.images.forEach(function(image, index) {
            var item = document.createElement('div');
            item.className = 'carousel-item' + (index === 0 ? ' active' : '');
            item.innerHTML = '<img class="w-100 h-100" src="' + image + '" alt="' + (product.title || 'Product') + '" style="object-fit:cover;height:420px;">';
            carouselInner.appendChild(item);
        });
    }

    function renderProductDetails(product) {
        if (!product) {
            showError('Product not found.');
            return;
        }

        // Update page title
        document.title = (product.title || 'Product') + ' - ShopHub Premium Ecommerce Store';

        // Update breadcrumb and header
        var pageHeaderTitle = document.querySelector('.page-header h2');
        if (pageHeaderTitle) {
            pageHeaderTitle.textContent = product.title || 'Product';
        }

        // Product title
        var titleEl = document.querySelector('.col-lg-7 h3');
        if (titleEl) {
            titleEl.textContent = product.title || 'Product';
        }

        // Rating
        var ratingContainer = document.querySelector('.col-lg-7 .text-primary');
        if (ratingContainer && product.rating) {
            var stars = buildStars(product.rating);
            ratingContainer.innerHTML = '';
            stars.forEach(function(star) {
                var icon = document.createElement('small');
                if (star === 'full') {
                    icon.className = 'fas fa-star';
                } else if (star === 'half') {
                    icon.className = 'fas fa-star-half-alt';
                } else {
                    icon.className = 'far fa-star';
                }
                ratingContainer.appendChild(icon);
            });
        }

        // Review count
        var reviewCountEl = document.querySelector('.col-lg-7 .text-muted small');
        if (reviewCountEl && product.reviewCount) {
            reviewCountEl.textContent = '(' + product.reviewCount + ' ratings)';
        }

        // Stock status
        var stockBadge = document.querySelector('.col-lg-7 .badge-success');
        if (stockBadge) {
            if (product.inStock) {
                stockBadge.textContent = 'In stock';
                stockBadge.style.display = 'inline-block';
            } else {
                stockBadge.textContent = 'Out of stock';
                stockBadge.className = 'badge badge-danger ml-3';
                stockBadge.style.display = 'inline-block';
            }
        }

        // Price
        var priceEl = document.querySelector('.col-lg-7 .font-weight-semi-bold');
        if (priceEl) {
            priceEl.textContent = formatCurrency(product.price || 0);
        }

        // Original price
        var oldPriceEl = document.querySelector('.col-lg-7 h6.text-muted del');
        if (oldPriceEl) {
            if (product.originalPrice && product.originalPrice > product.price) {
                oldPriceEl.textContent = formatCurrency(product.originalPrice);
                oldPriceEl.parentElement.style.display = 'block';
            } else {
                oldPriceEl.parentElement.style.display = 'none';
            }
        }

        // Discount badge
        var discountBadge = document.querySelector('.col-lg-7 .badge-warning');
        if (discountBadge && product.discount) {
            discountBadge.textContent = product.discount + '% OFF';
            discountBadge.style.display = 'inline-block';
        } else if (discountBadge) {
            discountBadge.style.display = 'none';
        }

        // Description
        var descEl = document.querySelector('.col-lg-7 p.mb-4');
        if (descEl) {
            descEl.textContent = product.description || product.shortDescription || 'No description available.';
        }

        // Sizes
        var sizeDivs = document.querySelectorAll('.col-lg-7 .mb-3');
        var sizeDiv = null;
        for (var i = 0; i < sizeDivs.length; i++) {
            var strong = sizeDivs[i].querySelector('strong');
            if (strong && strong.textContent.includes('Select size')) {
                sizeDiv = sizeDivs[i];
                break;
            }
        }
        if (!sizeDiv && sizeDivs.length >= 3) {
            sizeDiv = sizeDivs[2];
        }
        if (sizeDiv && product.sizes && product.sizes.length > 0) {
            var sizeButtons = sizeDiv.querySelector('div');
            if (sizeButtons) {
                sizeButtons.innerHTML = '';
                product.sizes.forEach(function(size) {
                    var label = document.createElement('label');
                    label.className = 'btn btn-outline-secondary btn-sm mr-2 mb-2';
                    label.innerHTML = '<input type="radio" name="size" class="d-none" value="' + size + '"> ' + size;
                    sizeButtons.appendChild(label);
                });
            }
        }

        // Colors
        if (product.colors && product.colors.length > 0) {
            var colorDiv = document.querySelectorAll('.col-lg-7 .mb-3')[3];
            if (colorDiv) {
                var colorContainer = colorDiv.querySelector('.d-flex');
                if (colorContainer) {
                    colorContainer.innerHTML = '';
                    var colorMap = {
                        'Black': '#000',
                        'White': '#fff',
                        'Red': '#c62828',
                        'Blue': '#1565c0',
                        'Green': '#2e7d32',
                        'Silver': '#9e9e9e',
                        'Gold': '#ffd700',
                        'Pink': '#e91e63',
                        'Midnight': '#000',
                        'Starlight': '#f5f5dc'
                    };
                    product.colors.forEach(function(color) {
                        var label = document.createElement('label');
                        label.className = 'btn btn-sm border mr-2 mb-0';
                        label.style.cssText = 'width:32px;height:32px;background:' + (colorMap[color] || '#ccc') + ';';
                        label.innerHTML = '<input type="radio" name="color" class="d-none" value="' + color + '" aria-label="' + color + '">';
                        colorContainer.appendChild(label);
                    });
                }
            }
        }

        // Description tab
        var descTab = document.querySelector('#tab-pane-1 p');
        if (descTab) {
            descTab.textContent = product.description || product.shortDescription || 'No description available.';
        }

        // Information tab (Specifications)
        var infoTab = document.querySelector('#tab-pane-2 ul');
        if (infoTab && product.specifications) {
            infoTab.innerHTML = '';
            Object.keys(product.specifications).forEach(function(key) {
                var li = document.createElement('li');
                li.className = 'list-group-item px-0';
                li.textContent = key + ': ' + product.specifications[key];
                infoTab.appendChild(li);
            });
        }

        // Features
        if (product.features && product.features.length > 0) {
            var featuresList = document.querySelector('#tab-pane-1 ul');
            if (!featuresList) {
                var descTabContent = document.querySelector('#tab-pane-1');
                if (descTabContent) {
                    featuresList = document.createElement('ul');
                    featuresList.className = 'list-unstyled mb-3';
                    descTabContent.appendChild(featuresList);
                }
            }
            if (featuresList) {
                featuresList.innerHTML = '';
                product.features.forEach(function(feature) {
                    var li = document.createElement('li');
                    li.className = 'mb-1';
                    li.innerHTML = '<i class="fa fa-check text-primary mr-2"></i>' + feature;
                    featuresList.appendChild(li);
                });
            }
        }

        // Render images
        renderProductImages(product);

        // Bind action handlers
        bindActionHandlers(product);
    }

    function bindActionHandlers(product) {
        // Quantity controls
        var minusBtn = document.querySelector('.btn-minus');
        var plusBtn = document.querySelector('.btn-plus');
        var quantityInput = document.querySelector('.quantity input[type="text"]');
        
        if (minusBtn && quantityInput) {
            minusBtn.addEventListener('click', function() {
                var current = parseInt(quantityInput.value) || 1;
                if (current > 1) {
                    quantityInput.value = current - 1;
                }
            });
        }

        if (plusBtn && quantityInput) {
            plusBtn.addEventListener('click', function() {
                var current = parseInt(quantityInput.value) || 1;
                quantityInput.value = current + 1;
            });
        }

        // Add to Cart button
        var addToCartBtn = document.querySelector('.btn-theme-primary');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                var quantity = parseInt(quantityInput ? quantityInput.value : 1) || 1;
                addToCart(product, quantity);
            });
        }

        // Buy Now button
        var buyNowBtn = document.querySelector('.btn-dark');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                var quantity = parseInt(quantityInput ? quantityInput.value : 1) || 1;
                addToCart(product, quantity);
                window.location.href = 'checkout.html';
            });
        }
    }

    function addToCart(product, quantity) {
        if (!product) return;
        
        var store = window.shopState || (window.shopState = { cart: [], wishlist: [] });
        var cart = store.cart || [];
        
        // Check if product already exists
        var existingIndex = cart.findIndex(function(item) {
            return String(item.id) === String(product.id);
        });
        
        if (existingIndex >= 0) {
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
        } else {
            var cartItem = Object.assign({}, product, { quantity: quantity });
            cart.push(cartItem);
        }
        
        store.cart = cart;
        
        // Update cart count
        updateCartCount();
        
        // Show success message
        showFlashMessage('success', product.title + ' added to cart!');
    }

    function updateCartCount() {
        var store = window.shopState || { cart: [] };
        var count = store.cart ? store.cart.reduce(function(sum, item) {
            return sum + (item.quantity || 1);
        }, 0) : 0;
        
        var cartElements = document.querySelectorAll('.cart-count, .mh-badge');
        cartElements.forEach(function(el) {
            el.textContent = count;
        });
    }

    function showFlashMessage(type, message) {
        var el = document.getElementById('flash-message');
        if (!el) {
            el = document.createElement('div');
            el.id = 'flash-message';
            el.className = 'flash-message';
            document.body.appendChild(el);
        }
        el.textContent = message;
        el.className = 'flash-message flash-' + type + ' show';
        setTimeout(function () {
            el.classList.remove('show');
        }, 2600);
    }

    function showError(message) {
        var container = document.querySelector('.container-fluid.pb-5');
        if (container) {
            container.innerHTML = '<div class="col-12 text-center text-danger py-5"><h3>' + message + '</h3><a href="shop.html" class="btn btn-primary mt-3">Back to Shop</a></div>';
        }
    }

    function renderRelatedProducts(product) {
        if (!product) return;
        
        var container = document.querySelector('.container-fluid.mb-5 .row');
        if (!container) return;

        // Get related products (same category, excluding current product)
        var allProducts = window.getAllProducts();
        var relatedProducts = allProducts.filter(function(p) {
            return p.category === product.category && p.id !== product.id;
        }).slice(0, 4);

        if (relatedProducts.length === 0) {
            // If no related products, show any products
            relatedProducts = allProducts.filter(function(p) {
                return p.id !== product.id;
            }).slice(0, 4);
        }

        if (relatedProducts.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = '';
        relatedProducts.forEach(function(relatedProduct) {
            var col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-6 mb-4';
            
            var priceFormatted = formatCurrency(relatedProduct.price || 0);
            var oldPriceHtml = '';
            if (relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price) {
                oldPriceHtml = '<span class="old-price" style="font-size: 14px; color: #999; text-decoration: line-through; margin-left: 8px;">' + formatCurrency(relatedProduct.originalPrice) + '</span>';
            }
            
            col.innerHTML = '<div class="product-item"><div class="product-img"><a href="product-detail.html?id=' + encodeURIComponent(relatedProduct.id) + '"><img src="' + (relatedProduct.image || '') + '" alt="' + (relatedProduct.title || '') + '"></a></div><div class="product-content"><h3><a href="product-detail.html?id=' + encodeURIComponent(relatedProduct.id) + '" style="color: inherit; text-decoration: none;">' + (relatedProduct.title || '') + '</a></h3><div class="product-price"><span class="price">' + priceFormatted + '</span>' + oldPriceHtml + '</div></div></div>';
            
            container.appendChild(col);
        });
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function(){
        waitForDependencies(function() {
            var productId = getProductIdFromURL();
            if (!productId) {
                showError('Product ID not found in URL.');
                return;
            }

            var product = window.getProductById(productId);
            if (!product) {
                showError('Product not found.');
                return;
            }

            renderProductDetails(product);
            renderRelatedProducts(product);
        });
    });
})();

