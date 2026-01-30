// Product Details Page Functionality
(function() {
    'use strict';

    // Get product ID from URL
    function getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Load product data and populate the page
    function loadProductData() {
        const productId = getProductIdFromUrl();
        console.log('Loading product:', productId);
        console.log('Available products:', window.products);
        
        if (!productId) {
            console.error('No product ID in URL');
            return;
        }
        
        if (!window.products) {
            console.error('Products not loaded');
            return;
        }
        
        if (!window.products[productId]) {
            console.error('Product not found:', productId);
            console.log('Available product IDs:', Object.keys(window.products));
            return;
        }

        const product = window.products[productId];
        console.log('Found product:', product);
        hydrateProductDetails(product);
    }

    // Populate product details page
    function hydrateProductDetails(product) {
        // Update breadcrumb
        const breadcrumb = document.querySelector('.pdx-breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `<a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <span>${product.category}</span>`;
        }

        // Update title
        const title = document.getElementById('pdxTitle');
        if (title) title.textContent = product.name;

        // Update rating
        const rating = document.getElementById('pdxStars');
        if (rating) rating.textContent = `${product.rating} ★`;

        const ratingCount = document.getElementById('pdxCount');
        if (ratingCount) ratingCount.textContent = `(${product.reviewCount.toLocaleString()} ratings)`;

        // Update price
        const currentPrice = document.getElementById('pdxNow');
        if (currentPrice) currentPrice.textContent = `₹${product.price.toLocaleString()}`;

        const originalPrice = document.getElementById('pdxWas');
        if (originalPrice) originalPrice.textContent = `₹${product.originalPrice.toLocaleString()}`;

        const discount = document.getElementById('pdxOff');
        if (discount) discount.textContent = `${product.discount}% off`;

        // Update highlights
        const highlights = document.getElementById('pdxHighlights');
        if (highlights) {
            highlights.innerHTML = '';
            product.features.slice(0, 5).forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                highlights.appendChild(li);
            });
        }

        // Update specifications
        const specs = document.getElementById('pdxSpecs');
        if (specs) {
            specs.innerHTML = '';
            Object.entries(product.specifications).forEach(([key, value]) => {
                const label = document.createElement('div');
                label.className = 'spec-label';
                label.textContent = key;

                const valueEl = document.createElement('div');
                valueEl.className = 'spec-value';
                valueEl.textContent = value;

                specs.appendChild(label);
                specs.appendChild(valueEl);
            });
        }

        // Update images
        const thumbsContainer = document.getElementById('pdxThumbs');
        const mainImage = document.getElementById('pdxMain');
        
        console.log('Loading images for product:', product.name);
        console.log('Thumbs container:', thumbsContainer);
        console.log('Main image:', mainImage);
        console.log('Product images:', product.images);
        
        if (thumbsContainer && mainImage && product.images && product.images.length > 0) {
            thumbsContainer.innerHTML = '';
            
            product.images.forEach((imageSrc, index) => {
                // Create thumbnail
                const thumb = document.createElement('img');
                thumb.src = imageSrc;
                thumb.alt = `${product.name} ${index + 1}`;
                thumb.className = index === 0 ? 'active' : '';
                thumb.style.width = '100%';
                thumb.style.height = '60px';
                thumb.style.objectFit = 'cover';
                thumb.style.borderRadius = '8px';
                thumb.style.cursor = 'pointer';
                thumb.style.border = index === 0 ? '2px solid #00ffff' : '2px solid transparent';
                
                // Add error handling for image loading
                thumb.onerror = function() {
                    console.error('Failed to load thumbnail image:', imageSrc);
                    this.src = 'https://via.placeholder.com/80x80/333/fff?text=Image';
                };
                
                thumb.addEventListener('click', () => {
                    // Remove active class from all thumbs
                    thumbsContainer.querySelectorAll('img').forEach(img => {
                        img.classList.remove('active');
                        img.style.border = '2px solid transparent';
                    });
                    // Add active class to clicked thumb
                    thumb.classList.add('active');
                    thumb.style.border = '2px solid #00ffff';
                    // Update main image
                    mainImage.src = imageSrc;
                    mainImage.alt = product.name;
                });
                
                thumbsContainer.appendChild(thumb);
                
                // Set first image as main
                if (index === 0) {
                    mainImage.src = imageSrc;
                    mainImage.alt = product.name;
                    mainImage.style.width = '100%';
                    mainImage.style.height = '500px';
                    mainImage.style.objectFit = 'cover';
                    mainImage.style.borderRadius = '12px';
                    
                    // Add error handling for main image
                    mainImage.onerror = function() {
                        console.error('Failed to load main image:', imageSrc);
                        this.src = 'https://via.placeholder.com/400x500/333/fff?text=Product+Image';
                    };
                }
            });
        } else {
            console.error('Image loading failed:', {
                thumbsContainer: !!thumbsContainer,
                mainImage: !!mainImage,
                images: product.images
            });
        }

        // Update color options
        const colorChips = document.getElementById('pdxColors');
        if (colorChips && product.colors) {
            colorChips.innerHTML = '';
            product.colors.forEach((color, index) => {
                const chip = document.createElement('span');
                chip.className = `chip ${index === 0 ? 'active' : ''}`;
                chip.textContent = color;
                chip.addEventListener('click', () => {
                    colorChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                });
                colorChips.appendChild(chip);
            });
        }

        // Update size options
        const sizeChips = document.getElementById('pdxSizes');
        if (sizeChips && product.sizes) {
            sizeChips.innerHTML = '';
            product.sizes.forEach((size, index) => {
                const chip = document.createElement('span');
                chip.className = `chip ${index === 0 ? 'active' : ''}`;
                chip.textContent = size;
                chip.addEventListener('click', () => {
                    sizeChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                });
                sizeChips.appendChild(chip);
            });
        }

        // Load related products
        loadRelatedProducts(product.id);
        
        // Populate tabs content
        populateTabsContent(product);
    }

    // Load related products
    function loadRelatedProducts(currentProductId) {
        const relatedGrid = document.getElementById('related-products');
        if (!relatedGrid) return;

        let relatedProducts = [];
        if (window.ProductUtils && typeof window.ProductUtils.getRelatedProducts === 'function') {
            relatedProducts = window.ProductUtils.getRelatedProducts(currentProductId, 4);
        } else if (window.products) {
            // Fallback: take first 4 excluding current
            relatedProducts = Object.values(window.products).filter(p => p.id !== currentProductId).slice(0, 4);
        }

        // If still empty, do nothing gracefully
        if (!relatedProducts || relatedProducts.length === 0) return;

        relatedGrid.innerHTML = '';
        relatedProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'related-product-card';
            card.innerHTML = `
                <div class="related-product-image">
                    <img src="${product.images[0]}" alt="${product.name}" />
                    <div class="related-product-badge">${product.discount}% OFF</div>
                </div>
                <div class="related-product-info">
                    <h4 class="related-product-name">${product.name}</h4>
                    <div class="related-product-rating">
                        <span class="stars">${(window.ProductUtils? window.ProductUtils.generateStars(product.rating) : '★'.repeat(product.rating)+'☆'.repeat(5-product.rating))}</span>
                        <span class="rating-count">(${product.reviewCount.toLocaleString()})</span>
                    </div>
                    <div class="related-product-price">
                        <span class="current-price">₹${product.price.toLocaleString()}</span>
                        <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
                    </div>
                    <button class="view-product-btn" onclick="window.location.href='product-detail.html?id=${product.id}'">View Details</button>
                </div>
            `;
            relatedGrid.appendChild(card);
        });
    }

    // Setup quantity controls
    function setupQuantityControls() {
        const qtyInput = document.getElementById('pdxQty');
        const decBtn = document.getElementById('pdxDec');
        const incBtn = document.getElementById('pdxInc');

        if (decBtn) {
            decBtn.addEventListener('click', () => {
                const currentQty = parseInt(qtyInput.value || '1', 10);
                if (currentQty > 1) {
                    qtyInput.value = currentQty - 1;
                }
            });
        }

        if (incBtn) {
            incBtn.addEventListener('click', () => {
                const currentQty = parseInt(qtyInput.value || '1', 10);
                if (currentQty < 10) {
                    qtyInput.value = currentQty + 1;
                }
            });
        }
    }

    // Setup add to cart functionality
    function setupAddToCart() {
        const addToCartBtn = document.getElementById('pdxAdd');
        const buyNowBtn = document.getElementById('pdxBuy');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const productId = getProductIdFromUrl();
                const qty = parseInt(document.getElementById('pdxQty').value || '1', 10);
                if (productId && window.addToCartById) {
                    window.addToCartById(productId, isNaN(qty) ? 1 : qty);
                }
                window.location.href = 'cart.html';
            });
        }

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                const productId = getProductIdFromUrl();
                const qty = parseInt(document.getElementById('pdxQty').value || '1', 10);
                if (productId && window.addToCartById) {
                    window.addToCartById(productId, isNaN(qty) ? 1 : qty);
                }
                window.location.href = 'login.html?redirect=checkout';
            });
        }
    }

    // Populate tabs content
    function populateTabsContent(product) {
        // Description tab
        const descriptionEl = document.getElementById('product-description');
        if (descriptionEl) {
            descriptionEl.textContent = product.description;
        }

        const featuresEl = document.getElementById('description-features');
        if (featuresEl) {
            featuresEl.innerHTML = '';
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresEl.appendChild(li);
            });
        }

        // Specifications tab
        const tabSpecsEl = document.getElementById('tab-specifications');
        if (tabSpecsEl) {
            tabSpecsEl.innerHTML = '';
            Object.entries(product.specifications).forEach(([key, value]) => {
                const specItem = document.createElement('div');
                specItem.className = 'spec-item';
                specItem.innerHTML = `
                    <div class="spec-label">${key}</div>
                    <div class="spec-value">${value}</div>
                `;
                tabSpecsEl.appendChild(specItem);
            });
        }
    }

    // Setup tabs functionality
    function setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        if (!tabBtns.length || !tabPanels.length) return;

        // Ensure only the first tab is active on load
        tabBtns.forEach((btn, idx) => {
            if (idx === 0) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        tabPanels.forEach((panel, idx) => {
            if (idx === 0) panel.classList.add('active');
            else panel.classList.remove('active');
        });

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // Remove active from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));

                // Activate clicked
                btn.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) targetPanel.classList.add('active');
            });
        });
    }

    // Initialize page
    function init() {
        loadProductData();
        setupQuantityControls();
        setupAddToCart();
        setupTabs();
    }

    // Run when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);

    // Make functions available globally
    window.loadProductData = loadProductData;
    window.loadRelatedProducts = loadRelatedProducts;

})();
