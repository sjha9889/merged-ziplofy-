// Product data constants
const PRODUCTS = [
  {
    id: 'sony-wh-1000xm4',
    title: 'Sony WH-1000XM4',
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
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=900&fit=crop&crop=center',
    badge: 'Best Seller',
    inStock: true,
    colors: ['Black', 'Silver', 'Blue'],
    sizes: ['One Size']
  },
  {
    id: 'apple-watch-series-9',
    title: 'Apple Watch Series 9',
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
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=900&fit=crop&crop=center',
    badge: 'New',
    inStock: true,
    colors: ['Midnight', 'Starlight', 'Pink', 'Blue'],
    sizes: ['41mm', '45mm']
  },
  {
    id: 'nike-air-max-270',
    title: 'Nike Air Max 270',
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
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=900&fit=crop&crop=center',
    badge: 'Trending',
    inStock: true,
    colors: ['Black', 'White', 'Red', 'Blue'],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: 'iphone-15-pro',
    title: 'iPhone 15 Pro',
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
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=900&fit=crop&crop=center',
    badge: 'Limited',
    inStock: true,
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    sizes: ['128GB', '256GB', '512GB', '1TB']
  },
  {
    id: 'sony-wh-1000xm5',
    title: 'Sony WH-1000XM5',
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
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=900&fit=crop&crop=center',
    badge: '50% OFF',
    inStock: true,
    colors: ['Black', 'Silver'],
    sizes: ['One Size']
  },
  {
    id: 'macbook-pro-m3',
    title: 'MacBook Pro M3',
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
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=900&fit=crop&crop=center',
    badge: '30% OFF',
    inStock: true,
    colors: ['Space Gray', 'Silver'],
    sizes: ['14-inch', '16-inch']
  },
  {
    id: 'nike-air-jordan-1',
    title: 'Nike Air Jordan 1',
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
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=900&fit=crop&crop=center',
    badge: '40% OFF',
    inStock: true,
    colors: ['Bred', 'Chicago', 'Royal', 'Shadow'],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra',
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
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=900&fit=crop&crop=center',
    badge: '25% OFF',
    inStock: true,
    colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
    sizes: ['256GB', '512GB', '1TB']
  }
];

// Category data constants
const CATEGORIES = {
  smartphones: {
    name: 'Smartphones',
    description: 'Discover the latest smartphones with cutting-edge technology, advanced cameras, and powerful processors.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop',
    icon: 'fas fa-mobile-alt'
  },
  laptops: {
    name: 'Laptops',
    description: 'High-performance laptops for work, gaming, and creative projects. From ultrabooks to gaming rigs.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop',
    icon: 'fas fa-laptop'
  },
  gaming: {
    name: 'Gaming',
    description: 'Ultimate gaming gear including consoles, accessories, and high-performance gaming equipment.',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=400&fit=crop',
    icon: 'fas fa-gamepad'
  },
  audio: {
    name: 'Audio',
    description: 'Premium audio equipment including headphones, speakers, and sound systems for the ultimate listening experience.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop',
    icon: 'fas fa-headphones'
  },
  wearables: {
    name: 'Wearables',
    description: 'Smart watches, fitness trackers, and wearable technology to enhance your daily life.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=400&fit=crop',
    icon: 'fas fa-watch'
  },
  accessories: {
    name: 'Accessories',
    description: 'Essential tech accessories including cases, chargers, cables, and peripherals.',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=400&fit=crop',
    icon: 'fas fa-keyboard'
  }
};

// Special Offers data
const SPECIAL_OFFERS = [
  {
    id: 1,
    productId: 'sony-wh-1000xm4',
    title: 'Cricket Bat Double Blade bat for Tennis Ball (Black)',
    category: 'Cricket',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&q=80',
    discount: 57,
    original_price: '1,149.00',
    discounted_price: '499.00'
  },
  {
    id: 2,
    productId: 'nike-air-max-270',
    title: 'Professional Abs Workout 4 Wheel Abs Roller',
    category: 'Gym',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&q=80',
    discount: 80,
    original_price: '1,999.00',
    discounted_price: '399.00'
  },
  {
    id: 3,
    productId: 'apple-watch-series-9',
    title: 'Smiley Face Stress Reliever Soft Ball | Pack of 12 Smileys',
    category: 'Other Games',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=300&fit=crop&q=80',
    discount: 58,
    original_price: '599.00',
    discounted_price: '249.00'
  },
  {
    id: 4,
    productId: 'macbook-pro-m3',
    title: 'U-N-O Playing Cards Fun Game, Set of 108 Cards',
    category: 'Board Games',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=300&fit=crop&q=80',
    discount: 11,
    original_price: '100.00',
    discounted_price: '89.00'
  },
  {
    id: 5,
    productId: 'sony-wh-1000xm4',
    title: 'Wooden Carrom Coins, Strike, Powder',
    category: 'Board Games',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=300&fit=crop&q=80',
    discount: 34,
    original_price: '375.00',
    discounted_price: '249.00'
  },
  {
    id: 6,
    productId: 'nike-air-max-270',
    title: 'Badminton Nylon Net',
    category: 'Badminton',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=300&fit=crop&q=80',
    discount: 58,
    original_price: '599.00',
    discounted_price: '249.00'
  }
];

// Offer tabs data
const OFFER_TABS = [
  { key: 'special', label: 'SPECIAL OFFER' },
  { key: 'new', label: 'NEW' },
  { key: 'featured', label: 'FEATURED' },
  { key: 'top', label: 'TOP SELLERS' }
];

window.PRODUCTS = PRODUCTS;
window.SPECIAL_OFFERS = SPECIAL_OFFERS;
window.OFFER_TABS = OFFER_TABS;

