// Products Data - Centralized product information
window.products = {
    'sony-wh-1000xm4': {
        id: 'sony-wh-1000xm4',
        name: 'Sony WH-1000XM4',
        category: 'Electronics',
        price: 24990,
        originalPrice: 32990,
        discount: 24,
        rating: 5,
        reviewCount: 2847,
        description: 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.',
        shortDescription: 'Industry-leading noise canceling...',
        features: [
            'Industry-leading noise cancellation',
            '30-hour battery life',
            'Quick charge (10 min = 5 hours)',
            'Touch sensor controls',
            'Speak-to-Chat technology'
        ],
        specifications: {
            'Type': 'Over-ear headphones',
            'Connectivity': 'Bluetooth 5.0, NFC',
            'Battery Life': '30 hours',
            'Weight': '254g',
            'Frequency Response': '4Hz - 40kHz',
            'Driver Unit': '40mm',
            'Noise Cancellation': 'Yes',
            'Warranty': '1 Year'
        },
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=900&fit=crop&crop=center'
        ],
        badge: 'Best Seller',
        inStock: true,
        colors: ['Black', 'Silver', 'Blue'],
        sizes: ['One Size']
    },
    'apple-watch-series-9': {
        id: 'apple-watch-series-9',
        name: 'Apple Watch Series 9',
        category: 'Electronics',
        price: 45900,
        originalPrice: 49900,
        discount: 8,
        rating: 5,
        reviewCount: 1923,
        description: 'Most advanced Apple Watch with health monitoring, fitness tracking, and cellular connectivity.',
        shortDescription: 'Most advanced Apple Watch...',
        features: [
            'Always-on Retina display',
            'Health monitoring',
            'Fitness tracking',
            'Cellular connectivity',
            'Water resistant to 50 meters'
        ],
        specifications: {
            'Display': 'Always-on Retina LTPO OLED',
            'Size': '45mm',
            'Connectivity': 'GPS + Cellular',
            'Battery Life': 'Up to 18 hours',
            'Water Resistance': '50 meters',
            'Materials': 'Aluminum, Stainless Steel',
            'Sensors': 'Heart rate, ECG, Blood oxygen',
            'Warranty': '1 Year'
        },
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&h=900&fit=crop&crop=center'
        ],
        badge: 'New',
        inStock: true,
        colors: ['Midnight', 'Starlight', 'Pink', 'Blue'],
        sizes: ['41mm', '45mm']
    },
    'nike-air-max-270': {
        id: 'nike-air-max-270',
        name: 'Nike Air Max 270',
        category: 'Fashion',
        price: 12495,
        originalPrice: 15995,
        discount: 22,
        rating: 4,
        reviewCount: 3156,
        description: 'Comfortable lifestyle sneakers with Max Air cushioning for all-day comfort.',
        shortDescription: 'Comfortable lifestyle sneakers...',
        features: [
            'Max Air cushioning',
            'Breathable mesh upper',
            'Rubber outsole',
            'Lace-up closure',
            'Lightweight design'
        ],
        specifications: {
            'Type': 'Lifestyle sneakers',
            'Upper': 'Mesh and synthetic',
            'Midsole': 'Max Air cushioning',
            'Outsole': 'Rubber',
            'Closure': 'Lace-up',
            'Weight': '320g',
            'Heel Height': '32mm',
            'Warranty': '6 Months'
        },
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=900&fit=crop&crop=center'
        ],
        badge: 'Trending',
        inStock: true,
        colors: ['Black', 'White', 'Red', 'Blue'],
        sizes: ['7', '8', '9', '10', '11', '12']
    },
    'iphone-15-pro': {
        id: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        price: 134900,
        originalPrice: 139900,
        discount: 4,
        rating: 5,
        reviewCount: 4892,
        description: 'Titanium design with A17 Pro chip, advanced camera system, and USB-C connectivity.',
        shortDescription: 'Titanium design with A17 Pro...',
        features: [
            'Titanium design',
            'A17 Pro chip',
            'Pro camera system',
            'USB-C connectivity',
            'Action Button'
        ],
        specifications: {
            'Display': '6.1-inch Super Retina XDR',
            'Chip': 'A17 Pro',
            'Storage': '128GB, 256GB, 512GB, 1TB',
            'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
            'Battery': 'Up to 23 hours video playback',
            'Materials': 'Titanium',
            'Connectivity': '5G, Wi-Fi 6E, Bluetooth 5.3',
            'Warranty': '1 Year'
        },
        images: [
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=900&fit=crop&crop=center'
        ],
        badge: 'Limited',
        inStock: true,
        colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
        sizes: ['128GB', '256GB', '512GB', '1TB']
    },
    'sony-wh-1000xm5': {
        id: 'sony-wh-1000xm5',
        name: 'Sony WH-1000XM5',
        category: 'Electronics',
        price: 19990,
        originalPrice: 39990,
        discount: 50,
        rating: 5,
        reviewCount: 3247,
        description: 'Premium noise canceling headphones with industry-leading sound quality and comfort.',
        shortDescription: 'Premium noise canceling...',
        features: [
            'Industry-leading noise cancellation',
            '30-hour battery life',
            'Quick charge (3 min = 3 hours)',
            'Speak-to-Chat technology',
            'Multipoint connection'
        ],
        specifications: {
            'Type': 'Over-ear headphones',
            'Connectivity': 'Bluetooth 5.2, NFC',
            'Battery Life': '30 hours',
            'Weight': '250g',
            'Frequency Response': '4Hz - 40kHz',
            'Driver Unit': '30mm',
            'Noise Cancellation': 'Yes',
            'Warranty': '1 Year'
        },
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=900&fit=crop&crop=center'
        ],
        badge: '50% OFF',
        inStock: true,
        colors: ['Black', 'Silver'],
        sizes: ['One Size']
    },
    'macbook-pro-m3': {
        id: 'macbook-pro-m3',
        name: 'MacBook Pro M3',
        category: 'Electronics',
        price: 119900,
        originalPrice: 169900,
        discount: 30,
        rating: 5,
        reviewCount: 1856,
        description: 'Professional performance with M3 chip, stunning Liquid Retina XDR display, and all-day battery life.',
        shortDescription: 'Professional performance...',
        features: [
            'M3 chip with 8-core CPU',
            'Liquid Retina XDR display',
            'Up to 22 hours battery life',
            '1080p FaceTime HD camera',
            'Magic Keyboard with Touch ID'
        ],
        specifications: {
            'Chip': 'Apple M3',
            'Display': '14.2-inch Liquid Retina XDR',
            'Memory': '8GB, 16GB, 24GB',
            'Storage': '512GB, 1TB, 2TB, 4TB, 8TB',
            'Graphics': '8-core GPU',
            'Battery': 'Up to 22 hours',
            'Ports': '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3',
            'Warranty': '1 Year'
        },
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&h=900&fit=crop&crop=center'
        ],
        badge: '30% OFF',
        inStock: true,
        colors: ['Space Gray', 'Silver'],
        sizes: ['14-inch', '16-inch']
    },
    'nike-air-jordan-1': {
        id: 'nike-air-jordan-1',
        name: 'Nike Air Jordan 1',
        category: 'Fashion',
        price: 8997,
        originalPrice: 14995,
        discount: 40,
        rating: 4,
        reviewCount: 2891,
        description: 'Classic basketball sneakers with iconic design and premium materials.',
        shortDescription: 'Classic basketball...',
        features: [
            'Iconic basketball design',
            'Premium leather upper',
            'Air-Sole unit',
            'Rubber outsole',
            'High-top silhouette'
        ],
        specifications: {
            'Type': 'Basketball sneakers',
            'Upper': 'Premium leather',
            'Midsole': 'Air-Sole unit',
            'Outsole': 'Rubber',
            'Closure': 'Lace-up',
            'Weight': '400g',
            'Heel Height': '35mm',
            'Warranty': '6 Months'
        },
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=900&fit=crop&crop=center'
        ],
        badge: '40% OFF',
        inStock: true,
        colors: ['Bred', 'Chicago', 'Royal', 'Shadow'],
        sizes: ['7', '8', '9', '10', '11', '12']
    },
    'samsung-galaxy-s24-ultra': {
        id: 'samsung-galaxy-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        category: 'Electronics',
        price: 89999,
        originalPrice: 119999,
        discount: 25,
        rating: 5,
        reviewCount: 4123,
        description: 'Advanced AI smartphone with S Pen, 200MP camera, and titanium design.',
        shortDescription: 'Advanced AI smartphone...',
        features: [
            'S Pen included',
            '200MP camera system',
            'Titanium design',
            'AI-powered features',
            '5G connectivity'
        ],
        specifications: {
            'Display': '6.8-inch Dynamic AMOLED 2X',
            'Chip': 'Snapdragon 8 Gen 3',
            'Storage': '256GB, 512GB, 1TB',
            'Camera': '200MP Main, 50MP Periscope, 10MP Telephoto, 12MP Ultra Wide',
            'Battery': '5000mAh',
            'Materials': 'Titanium',
            'Connectivity': '5G, Wi-Fi 7, Bluetooth 5.3',
            'Warranty': '1 Year'
        },
        images: [
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=900&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=900&fit=crop&crop=center'
        ],
        badge: '25% OFF',
        inStock: true,
        colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
        sizes: ['256GB', '512GB', '1TB']
    }
};

// Product utility functions
window.ProductUtils = {
    // Get product by ID
    getProduct: function(id) {
        return (window.products && window.products[id]) || null;
    },
    
    // Get all products
    getAllProducts: function() {
        return window.products ? Object.values(window.products) : [];
    },
    
    // Get products by category
    getProductsByCategory: function(category) {
        return window.products ? Object.values(window.products).filter(product => product.category === category) : [];
    },
    
    // Get featured products (first 4)
    getFeaturedProducts: function() {
        return window.products ? Object.values(window.products).slice(0, 4) : [];
    },
    
    // Get top deals (products with discount > 20%)
    getTopDeals: function() {
        return window.products ? Object.values(window.products).filter(product => product.discount > 20).slice(0, 4) : [];
    },
    
    // Get related products (exclude current product)
    getRelatedProducts: function(currentId, limit = 4) {
        return window.products ? Object.values(window.products)
            .filter(product => product.id !== currentId)
            .slice(0, limit) : [];
    },
    
    // Format price with currency
    formatPrice: function(price) {
        return `₹${price.toLocaleString()}`;
    },
    
    // Generate star rating HTML
    generateStars: function(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    },
    
    // Generate product card HTML
    generateProductCard: function(product, cardClass = 'product-card') {
        return `
            <div class="${cardClass}">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.name}" />
                    <div class="product-badge">${product.badge}</div>
                    <div class="product-overlay">
                        <button class="product-quick-view" data-product-id="${product.id}">Quick View</button>
                    </div>
                </div>
                <div class="product-content">
                    <div class="product-rating">
                        <span class="stars">${this.generateStars(product.rating)}</span>
                        <span class="rating-count">(${product.reviewCount.toLocaleString()})</span>
                    </div>
                    <h3 class="product-name" data-product-id="${product.id}">${product.name}</h3>
                    <p class="product-description">${product.shortDescription}</p>
                    <div class="product-price">
                        <span class="current-price">${this.formatPrice(product.price)}</span>
                        <span class="original-price">${this.formatPrice(product.originalPrice)}</span>
                        <span class="discount">${product.discount}% OFF</span>
                    </div>
                    <div class="product-actions">
                        <button class="product-btn">Add to Cart</button>
                        <button class="product-wishlist">♡</button>
                    </div>
                </div>
            </div>
        `;
    }
};

// Make products available globally
window.products = window.products;
