# ORNATIVA - Premium Jewelry Website Theme

A minimal, elegant, and classic homepage layout for a luxury jewelry website built with modern web technologies.

## 🎨 Design Features

### Color Palette

- **Ivory White** (#FEFCF8) - Primary background
- **Champagne Beige** (#F5F1E8) - Secondary background
- **Charcoal Black** (#2C2C2C) - Primary text
- **Gold** (#D4AF37) - Accent color and highlights
- **Warm Beige** (#E8E0D5) - Supporting elements

### Typography

- **Headings**: Playfair Display (serif) - Elegant and luxurious
- **Body Text**: Inter (sans-serif) - Clean and modern

## 🏗️ Homepage Sections

### 1. Hero Section

- Left: Tagline "Timeless Luxury, Crafted for You"
- Right: Hero jewelry image
- Two CTAs: "Shop Now" and "Explore Collections"
- Responsive design with smooth animations

### 2. Featured Collections

- 4 clickable category cards (Rings, Necklaces, Earrings, Bracelets)
- Hover effects with subtle zoom and overlay
- Links to Shop page with category filtering

### 3. About Brand Highlight

- Two-column layout (image + text)
- "About ORNATIVA" section
- CTA button linking to About page

### 4. Bestsellers / Featured Products

- Grid of 6 product cards
- Product image, name, and price
- Add to cart functionality
- Hover effects with gold border glow

### 5. Testimonials

- 3 customer review cards
- 5-star gold ratings
- Light beige background section

### 6. Why Choose Us (Trust Badges)

- 4 trust indicators with icons:
  - Hallmarked Jewelry
  - Free Shipping
  - Easy Returns
  - Premium Packaging

### 7. Newsletter Signup

- Email subscription form
- "Join our community & get exclusive offers" messaging
- Responsive form design

### 8. Instagram Feed / Jewelry Gallery

- Grid of 6 jewelry images
- Hover overlay with "Shop This Look"
- Clickable to product/collection pages

### 9. Exclusive Offers / Seasonal Banner

- Full-width promotional banner
- "Festive Collection – Up to 30% Off" messaging
- CTA button to Shop page

### 10. Footer

- Classic 3-column layout
- Quick Links, Policies, Social Media
- Copyright information

## 🚀 Features

### Interactive Elements

- Smooth scrolling navigation
- Hover animations and effects
- Clickable cards and buttons
- Newsletter subscription with validation
- Add to cart functionality
- Mobile-responsive design

### Animations

- Subtle hover zoom effects
- Soft shadow and glow transitions
- Fade-in animations on scroll
- Smooth button interactions

### Performance

- Optimized CSS with CSS variables
- Efficient JavaScript with debouncing
- Lazy loading support
- Mobile-first responsive design

## 📁 File Structure

```
Theme5/
├── index.html                 # Main homepage
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── js/
│   │   └── script.js         # JavaScript functionality
│   └── images/               # Image assets (placeholder images)
├── generate_placeholders.html # Image generator utility
└── README.md                 # This file
```

## 🛠️ Setup Instructions

### 1. Basic Setup

1. Place all files in your web server directory
2. Ensure the folder structure matches the above layout
3. Open `index.html` in a web browser

### 2. Images

The website now uses high-resolution jewelry images from Unsplash:

- **Hero Section**: Premium jewelry collection image
- **Collections**: Real jewelry category images (rings, necklaces, earrings, bracelets)
- **Products**: High-quality jewelry product photos
- **Gallery**: Professional jewelry photography

All images are optimized for web with proper sizing and quality settings.

### 3. Customization

- **Colors**: Modify CSS variables in `:root` section of `style.css`
- **Typography**: Change font imports in `index.html` head section
- **Content**: Update text content directly in `index.html`
- **Images**: Replace placeholder images with your jewelry photos

### 4. Integration

- **Shop Page**: Update links to point to your actual shop page
- **Product Pages**: Modify product card click handlers in `script.js`
- **Backend**: Integrate with your e-commerce backend for cart functionality

## 📱 Responsive Design

The website is fully responsive and optimized for:

- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (adjusted grid layouts)
- **Mobile**: 320px - 767px (stacked layout, simplified navigation)

## 🎯 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🔧 Customization Guide

### Changing Colors

```css
:root {
  --ivory-white: #fefcf8; /* Change primary background */
  --champagne-beige: #f5f1e8; /* Change secondary background */
  --gold: #d4af37; /* Change accent color */
  --charcoal-black: #2c2c2c; /* Change text color */
}
```

### Adding New Sections

1. Add HTML structure in `index.html`
2. Add corresponding CSS in `style.css`
3. Add JavaScript functionality in `script.js` if needed

### Modifying Animations

- Adjust transition durations in CSS `--transition` variable
- Modify hover effects in individual section CSS
- Update JavaScript animation functions as needed

## 📞 Support

For customization help or questions about this theme, please refer to the code comments or create an issue in your project repository.

## 📄 License

This theme is created for the ORNATIVA jewelry website project. Please ensure you have the right to use any included fonts and images in your commercial projects.

---

**Created with ❤️ for luxury jewelry brands**
