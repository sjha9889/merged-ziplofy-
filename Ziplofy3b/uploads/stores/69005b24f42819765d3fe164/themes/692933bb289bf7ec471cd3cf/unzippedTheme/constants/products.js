// Product data constants (watch catalog only)
const PRODUCTS = [
  {
    id: 'ax-chrono',
    title: 'Axiom Chrono',
    category: 'Luxury Watches',
    price: 34900,
    originalPrice: 39900,
    discount: 13,
    rating: 4.8,
    reviewCount: 1284,
    description: 'Premium chronograph with sapphire crystal, Swiss movement, and interchangeable straps.',
    shortDescription: 'Swiss-made chrono with sapphire crystal.',
    features: [
      'Swiss Ronda 5030.D quartz movement',
      'Anti-reflective sapphire crystal',
      '50m water resistance',
      'Quick-release leather + steel straps'
    ],
    specifications: {
      Movement: 'Swiss Quartz',
      Case: '42mm stainless steel',
      WaterResistance: '5 ATM',
      Crystal: 'Sapphire',
      Strap: 'Italian leather + steel bracelet',
      Warranty: '2 Years'
    },
    images: [
      'assets/img/u1.jpg',
      'assets/img/p1.jpg',
      'assets/img/p2.jpg'
    ],
    image: 'assets/img/u1.jpg',
    badge: 'Best Seller',
    inStock: true,
    colors: ['Steel', 'Midnight Black'],
    sizes: ['42mm']
  },
  {
    id: 'nova-sport',
    title: 'Nova Sport Watch',
    category: 'Smart Watches',
    price: 28900,
    originalPrice: 32900,
    discount: 12,
    rating: 4.6,
    reviewCount: 987,
    description: 'Performance-focused AMOLED smartwatch with multisport tracking and LTE connectivity.',
    shortDescription: 'AMOLED fitness watch with LTE + GPS.',
    features: [
      '1.6" AMOLED always-on display',
      'Dual-frequency GPS + LTE',
      'Advanced VO₂ max analytics',
      'Wireless charging (5-day battery)'
    ],
    specifications: {
      Display: '1.6" AMOLED, 450ppi',
      Connectivity: 'LTE, GPS, Bluetooth 5.3, NFC',
      BatteryLife: 'Up to 5 days',
      Sensors: 'SpO₂, ECG, accelerometer, barometer',
      Durability: '5 ATM + MIL-STD-810H',
      Warranty: '1 Year'
    },
    images: [
      'assets/img/u2.jpg',
      'assets/img/p3.jpg',
      'assets/img/p4.jpg'
    ],
    image: 'assets/img/u2.jpg',
    badge: 'Trending',
    inStock: true,
    colors: ['Obsidian', 'Arctic White', 'Sunset Orange'],
    sizes: ['44mm']
  },
  {
    id: 'luna-classic',
    title: 'Luna Classic Steel',
    category: 'Heritage Watches',
    price: 41900,
    originalPrice: 45900,
    discount: 9,
    rating: 4.9,
    reviewCount: 623,
    description: 'Dress watch with moonphase complication, Guilloché dial, and hand-applied indices.',
    shortDescription: 'Moonphase dress watch with Guilloché dial.',
    features: [
      'Automatic Miyota 6P80 movement',
      'Open-heart moonphase window',
      'Hand-polished dauphine hands',
      'Butterfly deployant clasp'
    ],
    specifications: {
      Movement: 'Automatic 6P80',
      Case: '40mm polished steel',
      WaterResistance: '3 ATM',
      Crystal: 'Domed sapphire',
      PowerReserve: '42 Hours',
      Warranty: '3 Years'
    },
    images: [
      'assets/img/u3.jpg',
      'assets/img/p5.jpg',
      'assets/img/p6.jpg'
    ],
    image: 'assets/img/u3.jpg',
    badge: 'Limited',
    inStock: true,
    colors: ['Steel', 'Rose Gold'],
    sizes: ['40mm']
  },
  {
    id: 'eclipse-smart-4',
    title: 'Eclipse Smart 4',
    category: 'Smart Watches',
    price: 45900,
    originalPrice: 49900,
    discount: 8,
    rating: 4.7,
    reviewCount: 1520,
    description: 'Flagship smart watch with sapphire glass, LTE calling, and AI health coach.',
    shortDescription: 'Flagship LTE smartwatch with sapphire.',
    features: [
      'Sapphire + titanium construction',
      'Dual-chip architecture for 7-day battery',
      'AI Coach for stress + recovery insights',
      'ECG + temperature sensor suite'
    ],
    specifications: {
      Processor: 'Dual-core wearable chipset',
      Storage: '32GB onboard',
      Connectivity: 'LTE, Wi-Fi, Bluetooth 5.3, NFC',
      BatteryLife: 'Up to 7 days',
      Strap: 'Fluoroelastomer + titanium links',
      Warranty: '2 Years'
    },
    images: [
      'assets/img/u4.jpg',
      'assets/img/c1.png',
      'assets/img/c2.jpg'
    ],
    image: 'assets/img/u4.jpg',
    badge: 'New Arrival',
    inStock: true,
    colors: ['Titanium Gray', 'Polar Silver'],
    sizes: ['46mm']
  },
  {
    id: 'orbit-hybrid',
    title: 'Orbit Hybrid',
    category: 'Hybrid Watches',
    price: 37900,
    originalPrice: 42900,
    discount: 12,
    rating: 4.5,
    reviewCount: 864,
    description: 'Analog hybrid watch with hidden AMOLED indicators and 2-week battery life.',
    shortDescription: 'Analog face with hidden smart indicators.',
    features: [
      'Hidden AMOLED notification arcs',
      'Dual-time + activity tracking',
      'Solar-assisted charging',
      '2-week battery life'
    ],
    specifications: {
      Case: '41mm brushed steel',
      Connectivity: 'Bluetooth 5.0, NFC',
      BatteryLife: '14 days + solar assist',
      WaterResistance: '5 ATM',
      Strap: 'Vegan leather',
      Warranty: '18 Months'
    },
    images: [
      'assets/img/p5.jpg',
      'assets/img/p2.jpg',
      'assets/img/p3.jpg'
    ],
    image: 'assets/img/p5.jpg',
    badge: 'Editor’s Pick',
    inStock: true,
    colors: ['Graphite', 'Indigo'],
    sizes: ['41mm']
  },
  {
    id: 'voyager-diver-pro',
    title: 'Voyager Diver Pro',
    category: 'Tool Watches',
    price: 49900,
    originalPrice: 54900,
    discount: 9,
    rating: 4.9,
    reviewCount: 1342,
    description: 'Professional-grade diver with ceramic bezel, helium escape valve, and chronometer certification.',
    shortDescription: '1000m diver with ceramic bezel + COSC.',
    features: [
      'COSC-certified automatic movement',
      'Ceramic bezel with lume markers',
      'Helium escape valve',
      '1000m (100 ATM) water resistance'
    ],
    specifications: {
      Movement: 'Automatic Cal. VX-1000',
      Case: '44mm titanium',
      Bracelet: 'Titanium with glide-lock clasp',
      WaterResistance: '100 ATM',
      Crystal: 'Sapphire (AR-coated)',
      Warranty: '5 Years'
    },
    images: [
      'assets/img/p6.jpg',
      'assets/img/p4.jpg',
      'assets/img/p1.jpg'
    ],
    image: 'assets/img/p6.jpg',
    badge: 'Pro Series',
    inStock: false,
    colors: ['Titanium Blue'],
    sizes: ['44mm']
  }
];

