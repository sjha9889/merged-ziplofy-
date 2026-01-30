// Product data constants
// const PRODUCTS = [
//   { id: 1, title: 'T-Shirt', price: 19.99, image: 'https://picsum.photos/seed/tshirt/400/300' },
//   { id: 2, title: 'Mug', price: 9.99, image: 'https://picsum.photos/seed/mug/400/300' },
//   { id: 3, title: 'Cap', price: 14.99, image: 'https://picsum.photos/seed/cap/400/300' }
// ];


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
  },
  {
    id: 'adidas-ultraboost-22',
    title: 'Adidas Ultraboost 22',
    category: 'Fashion',
    price: 14999,
    originalPrice: 18999,
    discount: 21,
    rating: 4.5,
    reviewCount: 2456,
    description: 'Premium running shoes with Boost midsole technology for maximum energy return and comfort.',
    shortDescription: 'Premium running shoes with Boost technology...',
    features: [
      'Boost midsole technology',
      'Primeknit upper',
      'Continental rubber outsole',
      'Responsive cushioning',
      'Breathable design'
    ],
    specifications: {
      'Type': 'Running Shoes',
      'Upper Material': 'Primeknit',
      'Midsole': 'Boost',
      'Outsole': 'Continental Rubber',
      'Weight': '310g',
      'Drop': '10mm',
      'Warranty': '6 Months'
    },
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=900&fit=crop&crop=center',
    badge: 'Best Seller',
    inStock: true,
    colors: ['Black', 'White', 'Core Black', 'Solar Red'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']
  },
  {
    id: 'dyson-v15-detect',
    title: 'Dyson V15 Detect Vacuum',
    category: 'Home & Kitchen',
    price: 54900,
    originalPrice: 64900,
    discount: 15,
    rating: 4.8,
    reviewCount: 1876,
    description: 'Powerful cordless vacuum with laser technology that reveals microscopic dust and advanced filtration system.',
    shortDescription: 'Powerful cordless vacuum with laser technology...',
    features: [
      'Laser dust detection',
      '60 minutes runtime',
      'HEPA filtration',
      '5 cleaning modes',
      'LCD screen display'
    ],
    specifications: {
      'Type': 'Cordless Vacuum',
      'Power': '230 AW',
      'Runtime': '60 minutes',
      'Dustbin Capacity': '0.77L',
      'Weight': '3.1kg',
      'Filtration': 'HEPA',
      'Warranty': '2 Years'
    },
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=900&fit=crop&crop=center',
    badge: 'New',
    inStock: true,
    colors: ['Yellow', 'Nickel'],
    sizes: ['Standard']
  },
  {
    id: 'canon-eos-r6',
    title: 'Canon EOS R6 Camera',
    category: 'Electronics',
    price: 189900,
    originalPrice: 219900,
    discount: 14,
    rating: 4.7,
    reviewCount: 923,
    description: 'Professional mirrorless camera with 20.1MP full-frame sensor, 4K video, and advanced autofocus system.',
    shortDescription: 'Professional mirrorless camera...',
    features: [
      '20.1MP full-frame sensor',
      '4K 60p video recording',
      'Dual Pixel CMOS AF II',
      'In-body image stabilization',
      '12fps continuous shooting'
    ],
    specifications: {
      'Sensor': '20.1MP Full-Frame CMOS',
      'Video': '4K 60p, Full HD 120p',
      'ISO Range': '100-102400',
      'AF Points': '6072',
      'Battery Life': '510 shots',
      'Weight': '680g',
      'Warranty': '1 Year'
    },
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=900&fit=crop&crop=center',
    badge: 'Hot',
    inStock: true,
    colors: ['Black'],
    sizes: ['Body Only', 'With 24-105mm Lens']
  },
  {
    id: 'lego-star-wars-millennium-falcon',
    title: 'LEGO Star Wars Millennium Falcon',
    category: 'Toys',
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    rating: 5,
    reviewCount: 3456,
    description: 'Iconic Star Wars spaceship building set with 1,329 pieces, detailed interior, and 7 minifigures.',
    shortDescription: 'Iconic Star Wars spaceship building set...',
    features: [
      '1,329 pieces',
      '7 minifigures included',
      'Detailed interior',
      'Ages 9+',
      'Collectible set'
    ],
    specifications: {
      'Pieces': '1,329',
      'Minifigures': '7',
      'Age Range': '9+',
      'Dimensions': '54cm x 34cm x 8cm',
      'Weight': '2.5kg',
      'Warranty': 'Manufacturer Warranty'
    },
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=900&fit=crop&crop=center',
    badge: 'Best Seller',
    inStock: true,
    colors: ['Multi-color'],
    sizes: ['Standard']
  },
  {
    id: 'macbook-pro-16-m3',
    title: 'MacBook Pro 16" M3',
    category: 'Electronics',
    price: 249900,
    originalPrice: 269900,
    discount: 7,
    rating: 4.9,
    reviewCount: 1234,
    description: 'Powerful laptop with M3 chip, 16-inch Liquid Retina XDR display, and up to 22 hours battery life.',
    shortDescription: 'Powerful laptop with M3 chip...',
    features: [
      'M3 Pro or M3 Max chip',
      '16.2-inch Liquid Retina XDR display',
      'Up to 22 hours battery',
      'Up to 8TB storage',
      '1080p FaceTime HD camera'
    ],
    specifications: {
      'Chip': 'M3 Pro / M3 Max',
      'Display': '16.2-inch Liquid Retina XDR',
      'Memory': '18GB - 128GB unified',
      'Storage': '512GB - 8TB SSD',
      'Battery': 'Up to 22 hours',
      'Weight': '2.15kg',
      'Warranty': '1 Year'
    },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=900&fit=crop&crop=center',
    badge: 'New',
    inStock: true,
    colors: ['Space Gray', 'Silver'],
    sizes: ['M3 Pro 18GB/512GB', 'M3 Pro 36GB/1TB', 'M3 Max 48GB/1TB']
  },
  {
    id: 'nike-dri-fit-training-shirt',
    title: 'Nike Dri-FIT Training Shirt',
    category: 'Fashion',
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    rating: 4.3,
    reviewCount: 4567,
    description: 'Moisture-wicking training shirt with breathable fabric and comfortable fit for active workouts.',
    shortDescription: 'Moisture-wicking training shirt...',
    features: [
      'Dri-FIT technology',
      'Moisture-wicking',
      'Breathable fabric',
      'Comfortable fit',
      'Machine washable'
    ],
    specifications: {
      'Material': '100% Polyester',
      'Fit': 'Regular',
      'Care': 'Machine Wash',
      'Technology': 'Dri-FIT',
      'Weight': 'Lightweight',
      'Warranty': '30 Days'
    },
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=900&fit=crop&crop=center',
    badge: 'Sale',
    inStock: true,
    colors: ['Black', 'White', 'Navy Blue', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'instant-pot-duo-plus',
    title: 'Instant Pot Duo Plus',
    category: 'Home & Kitchen',
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    rating: 4.6,
    reviewCount: 6789,
    description: '9-in-1 electric pressure cooker with 11 cooking functions including pressure cook, slow cook, and yogurt maker.',
    shortDescription: '9-in-1 electric pressure cooker...',
    features: [
      '9-in-1 functionality',
      '11 cooking programs',
      '10 safety features',
      'Stainless steel pot',
      'Easy to clean'
    ],
    specifications: {
      'Capacity': '6 Quart',
      'Functions': '9-in-1',
      'Material': 'Stainless Steel',
      'Power': '1000W',
      'Dimensions': '33cm x 30cm x 30cm',
      'Weight': '5.2kg',
      'Warranty': '1 Year'
    },
    images: [
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=900&fit=crop&crop=center',
    badge: '25% OFF',
    inStock: true,
    colors: ['Stainless Steel', 'Black'],
    sizes: ['6 Quart', '8 Quart']
  },
  {
    id: 'sony-playstation-5',
    title: 'Sony PlayStation 5',
    category: 'Electronics',
    price: 54990,
    originalPrice: 59990,
    discount: 8,
    rating: 4.8,
    reviewCount: 9876,
    description: 'Next-generation gaming console with ultra-high-speed SSD, ray tracing, and 3D Audio support.',
    shortDescription: 'Next-generation gaming console...',
    features: [
      'Ultra-high-speed SSD',
      'Ray tracing support',
      '3D Audio technology',
      '4K gaming at 120fps',
      'Backward compatible'
    ],
    specifications: {
      'CPU': 'AMD Zen 2, 8-core',
      'GPU': 'AMD RDNA 2, 10.28 TFLOPS',
      'Memory': '16GB GDDR6',
      'Storage': '825GB SSD',
      'Output': '4K UHD, HDR',
      'Weight': '4.5kg',
      'Warranty': '1 Year'
    },
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&h=900&fit=crop&crop=center',
    badge: 'Hot',
    inStock: true,
    colors: ['White', 'Black'],
    sizes: ['Standard', 'Digital Edition']
  },
  {
    id: 'fitbit-charge-6',
    title: 'Fitbit Charge 6',
    category: 'Electronics',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    rating: 4.4,
    reviewCount: 3456,
    description: 'Advanced fitness tracker with built-in GPS, heart rate monitoring, and 7-day battery life.',
    shortDescription: 'Advanced fitness tracker...',
    features: [
      'Built-in GPS',
      'Heart rate monitoring',
      '7-day battery life',
      'Water resistant',
      'Sleep tracking'
    ],
    specifications: {
      'Display': 'Color touchscreen',
      'Battery Life': 'Up to 7 days',
      'Water Resistance': '50 meters',
      'Sensors': 'Heart rate, GPS, Accelerometer',
      'Weight': '28g',
      'Warranty': '1 Year'
    },
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&h=900&fit=crop&crop=center',
    badge: 'Sale',
    inStock: true,
    colors: ['Black', 'Blue', 'Pink'],
    sizes: ['Small', 'Large']
  },
  {
    id: 'ikea-hemnes-bookcase',
    title: 'IKEA HEMNES Bookcase',
    category: 'Furniture',
    price: 12999,
    originalPrice: 15999,
    discount: 19,
    rating: 4.5,
    reviewCount: 2345,
    description: 'Classic bookcase with 6 shelves, made from solid pine wood with a natural finish.',
    shortDescription: 'Classic bookcase with 6 shelves...',
    features: [
      'Solid pine wood',
      '6 adjustable shelves',
      'Natural finish',
      'Easy assembly',
      'Durable construction'
    ],
    specifications: {
      'Material': 'Solid Pine Wood',
      'Shelves': '6 adjustable',
      'Dimensions': '149cm x 40cm x 30cm',
      'Weight': '35kg',
      'Finish': 'Natural',
      'Assembly': 'Required',
      'Warranty': '10 Years'
    },
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=900&fit=crop&crop=center'
    ],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=900&fit=crop&crop=center',
    badge: 'Sale',
    inStock: true,
    colors: ['Natural Pine', 'White', 'Black-Brown'],
    sizes: ['149cm x 40cm x 30cm']
  }
];

// ==== Product helpers (single source) ====
// Normalize a product to shape used across the site
function normalizeProductShape(p) {
  if (!p) return null;
  const image = p.image || (Array.isArray(p.images) && p.images.length ? p.images[0] : '');
  const name = p.name || p.title || '';
  const category = (p.category || '').toString().toLowerCase();
  const badges = [];
  if (p.badge) {
    badges.push(p.badge.toString().toLowerCase());
  }
  const categoryLabel = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
  return {
    id: p.id,
    name: name,
    title: p.title || name,
    image: image,
    images: Array.isArray(p.images) ? p.images : (image ? [image] : []),
    category: category,
    categoryLabel: p.categoryLabel || categoryLabel,
    price: typeof p.price === 'number' ? p.price : 0,
    originalPrice: typeof p.originalPrice === 'number' ? p.originalPrice : null,
    discount: typeof p.discount === 'number' ? p.discount : 0,
    rating: typeof p.rating === 'number' ? p.rating : 0,
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : 0,
    inStock: typeof p.inStock === 'boolean' ? p.inStock : true,
    badges: badges,
    description: p.description || '',
    shortDescription: p.shortDescription || '',
    features: Array.isArray(p.features) ? p.features : [],
    specifications: p.specifications || {},
    colors: Array.isArray(p.colors) ? p.colors : [],
    sizes: Array.isArray(p.sizes) ? p.sizes : []
  };
}

function getAllProducts() {
  return (PRODUCTS || []).map(normalizeProductShape);
}

function getProductById(id) {
  const list = getAllProducts();
  return list.find(p => String(p.id) === String(id));
}

function getProductsByCategory(category) {
  const cat = (category || '').toString().toLowerCase();
  return getAllProducts().filter(p => p.category === cat);
}

function getTrendingProducts() {
  return getAllProducts().slice(0, 8);
}

function getNewProducts() {
  return getAllProducts().slice(2, 10);
}

function getSaleProducts() {
  return getAllProducts().filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 8);
}

function getFeaturedProducts() {
  return getAllProducts().filter(p => p.rating >= 4.5).slice(0, 8);
}

function getBestsellerProducts() {
  return getAllProducts().filter(p => p.rating >= 4.8).slice(0, 8);
}

function getHotProducts() {
  return getAllProducts().filter(p => p.discount >= 20).slice(0, 8);
}

// Expose globally for existing scripts
window.getAllProducts = getAllProducts;
window.getProductById = getProductById;
window.getProductsByCategory = getProductsByCategory;
window.getTrendingProducts = getTrendingProducts;
window.getNewProducts = getNewProducts;
window.getSaleProducts = getSaleProducts;
window.getFeaturedProducts = getFeaturedProducts;
window.getBestsellerProducts = getBestsellerProducts;
window.getHotProducts = getHotProducts;