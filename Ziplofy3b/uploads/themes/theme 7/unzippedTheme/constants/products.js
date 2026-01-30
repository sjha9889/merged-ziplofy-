// Product data constants (electronics catalog)
const PRODUCTS = [
  {
    id: 'pro-phone-x',
    title: 'ProPhone X',
    category: 'Smartphones',
    price: 79900,
    originalPrice: 89900,
    discount: 11,
    rating: 4.8,
    reviewCount: 2847,
    description: 'Flagship smartphone with 6.7" AMOLED display, triple camera system, and 5G connectivity.',
    shortDescription: 'Flagship phone with 6.7" AMOLED and triple camera.',
    features: [
      '6.7" Super AMOLED 120Hz display',
      'Triple 108MP camera system',
      'Snapdragon 8 Gen 3 processor',
      '5000mAh battery with 65W fast charging'
    ],
    specifications: {
      Display: '6.7" Super AMOLED, 120Hz',
      Processor: 'Snapdragon 8 Gen 3',
      RAM: '12GB',
      Storage: '256GB',
      Camera: '108MP + 50MP + 12MP',
      Battery: '5000mAh',
      Warranty: '1 Year'
    },
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
    badge: 'Best Seller',
    inStock: true,
    colors: ['Midnight Black', 'Arctic Silver', 'Ocean Blue'],
    sizes: ['256GB', '512GB']
  },
  {
    id: 'ultra-laptop-pro',
    title: 'UltraLaptop Pro',
    category: 'Laptops',
    price: 129900,
    originalPrice: 149900,
    discount: 13,
    rating: 4.7,
    reviewCount: 1234,
    description: 'Premium laptop with 14" OLED display, Intel Core i9, and dedicated graphics card.',
    shortDescription: '14" OLED laptop with Intel i9 and dedicated GPU.',
    features: [
      '14" OLED 2.8K touchscreen display',
      'Intel Core i9-13900H processor',
      'NVIDIA RTX 4060 8GB graphics',
      '32GB RAM + 1TB SSD storage'
    ],
    specifications: {
      Display: '14" OLED 2.8K, 90Hz',
      Processor: 'Intel Core i9-13900H',
      Graphics: 'NVIDIA RTX 4060 8GB',
      RAM: '32GB DDR5',
      Storage: '1TB NVMe SSD',
      Battery: '75Wh',
      Warranty: '2 Years'
    },
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
    badge: 'Trending',
    inStock: true,
    colors: ['Space Gray', 'Silver'],
    sizes: ['1TB', '2TB']
  },
  {
    id: 'wireless-headphones-max',
    title: 'Wireless Headphones Max',
    category: 'Audio',
    price: 24900,
    originalPrice: 29900,
    discount: 17,
    rating: 4.9,
    reviewCount: 3456,
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    shortDescription: 'ANC headphones with 30-hour battery life.',
    features: [
      'Active Noise Cancellation (ANC)',
      '30-hour battery life',
      'Hi-Res Audio certified',
      'Comfortable memory foam ear cups'
    ],
    specifications: {
      Driver: '40mm dynamic drivers',
      ANC: 'Active Noise Cancellation',
      Battery: '30 hours (ANC on)',
      Connectivity: 'Bluetooth 5.3, 3.5mm jack',
      Weight: '280g',
      Warranty: '1 Year'
    },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    badge: 'Limited',
    inStock: true,
    colors: ['Black', 'White', 'Blue'],
    sizes: ['Standard']
  },
  {
    id: 'smart-tab-ultra',
    title: 'SmartTab Ultra',
    category: 'Tablets',
    price: 59900,
    originalPrice: 69900,
    discount: 14,
    rating: 4.6,
    reviewCount: 1876,
    description: '12.9" tablet with M2 chip, 120Hz ProMotion display, and Apple Pencil support.',
    shortDescription: '12.9" tablet with M2 chip and ProMotion.',
    features: [
      '12.9" Liquid Retina XDR display',
      'M2 chip with 8-core CPU',
      '120Hz ProMotion technology',
      'Apple Pencil 2 support'
    ],
    specifications: {
      Display: '12.9" Liquid Retina XDR, 120Hz',
      Processor: 'M2 chip',
      RAM: '8GB',
      Storage: '256GB',
      Camera: '12MP + 10MP',
      Battery: '40.88 Wh',
      Warranty: '1 Year'
    },
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
    badge: 'New Arrival',
    inStock: true,
    colors: ['Space Gray', 'Silver'],
    sizes: ['256GB', '512GB', '1TB']
  },
  {
    id: 'gaming-console-pro',
    title: 'Gaming Console Pro',
    category: 'Gaming',
    price: 49900,
    originalPrice: 54900,
    discount: 9,
    rating: 4.8,
    reviewCount: 2134,
    description: 'Next-gen gaming console with 4K gaming, ray tracing, and 1TB SSD storage.',
    shortDescription: '4K gaming console with ray tracing support.',
    features: [
      '4K gaming at 60fps',
      'Ray tracing support',
      '1TB NVMe SSD storage',
      'Backward compatibility with previous gen'
    ],
    specifications: {
      CPU: 'Custom 8-core Zen 2',
      GPU: 'Custom RDNA 2',
      RAM: '16GB GDDR6',
      Storage: '1TB NVMe SSD',
      Output: '4K UHD, HDR',
      Warranty: '1 Year'
    },
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
    badge: "Editor's Pick",
    inStock: true,
    colors: ['Black', 'White'],
    sizes: ['1TB']
  },
  {
    id: 'smart-tv-4k',
    title: 'Smart TV 4K Ultra',
    category: 'TVs',
    price: 89900,
    originalPrice: 99900,
    discount: 10,
    rating: 4.7,
    reviewCount: 1654,
    description: '65" 4K QLED smart TV with HDR10+, Dolby Vision, and built-in voice assistant.',
    shortDescription: '65" 4K QLED TV with HDR10+ and Dolby Vision.',
    features: [
      '65" QLED 4K display',
      'HDR10+ and Dolby Vision',
      'Built-in voice assistant',
      '120Hz refresh rate'
    ],
    specifications: {
      Display: '65" QLED 4K',
      Resolution: '3840 x 2160',
      HDR: 'HDR10+, Dolby Vision',
      RefreshRate: '120Hz',
      SmartPlatform: 'Android TV',
      Warranty: '2 Years'
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
    badge: 'Pro Series',
    inStock: true,
    colors: ['Black'],
    sizes: ['55"', '65"', '75"']
  }
];

