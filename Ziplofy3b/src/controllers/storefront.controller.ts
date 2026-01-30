import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';
import { InstalledThemes } from '../models/installed-themes.model';
import { Theme } from '../models/theme.model';
// import { Product } from '../models/product.model';
// import { Store } from '../models/store.model';

// Render storefront with theme and products
export const renderStorefront = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const { themeId } = req.query;

  console.log('🔍 Rendering storefront for store:', storeId, 'theme:', themeId);

  if (!storeId) {
    throw new CustomError("Store ID is required", 400);
  }

  // Get store information (mock for now)
  const store = {
    _id: storeId,
    name: "My Store",
    description: "Welcome to my online store",
    logo: "",
    domain: `store${storeId}.ziplofy.com`
  };

  // Get active theme for this store
  let activeTheme;
  if (themeId) {
    // Get specific theme
    const installedTheme = await InstalledThemes.findOne({
      user: storeId,
      theme: themeId,
      isActive: true
    }).populate('theme');
    
    if (!installedTheme) {
      throw new CustomError("Theme not found or not installed", 404);
    }
    activeTheme = installedTheme.theme;
  } else {
    // Get the first active theme
    const installedTheme = await InstalledThemes.findOne({
      user: storeId,
      isActive: true
    }).populate('theme');
    
    if (!installedTheme) {
      throw new CustomError("No active theme found for this store", 404);
    }
    activeTheme = installedTheme.theme;
  }

  // Get products for this store (mock for now)
  const products = [
    {
      _id: "product1",
      name: "Sample Product 1",
      description: "This is a sample product",
      price: 29.99,
      images: [],
      category: "Electronics",
      inStock: true
    },
    {
      _id: "product2", 
      name: "Sample Product 2",
      description: "Another sample product",
      price: 49.99,
      images: [],
      category: "Clothing",
      inStock: true
    }
  ];
  
  // Get theme files
  const storeThemeDir = path.join(process.cwd(), 'uploads', 'stores', storeId, 'themes', activeTheme._id.toString());
  
  // Check if theme files exist
  if (!fs.existsSync(storeThemeDir)) {
    throw new CustomError("Theme files not found", 404);
  }

  // Read the main HTML file
  const indexPath = path.join(storeThemeDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new CustomError("Theme index.html not found", 404);
  }

  let htmlContent = fs.readFileSync(indexPath, 'utf8');

  // Inject store data and products into the theme
  htmlContent = injectStoreData(htmlContent, {
    store,
    products,
    theme: activeTheme
  });

  // Set appropriate headers
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(htmlContent);
});

// Serve theme assets (CSS, JS, images)
export const serveThemeAsset = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId, themeId, assetPath } = req.params;
  
  console.log('🔍 Serving theme asset:', { storeId, themeId, assetPath });

  // Construct the full path to the asset
  const storeThemeDir = path.join(process.cwd(), 'uploads', 'stores', storeId, 'themes', themeId);
  const fullAssetPath = path.join(storeThemeDir, assetPath);

  // Security check: ensure the asset is within the store theme directory
  const normalizedPath = path.normalize(fullAssetPath);
  const normalizedStoreDir = path.normalize(storeThemeDir);
  
  if (!normalizedPath.startsWith(normalizedStoreDir)) {
    throw new CustomError("Access denied", 403);
  }

  // Check if file exists
  if (!fs.existsSync(fullAssetPath)) {
    throw new CustomError("Asset not found", 404);
  }

  // Check if it's a file (not a directory)
  const stats = fs.statSync(fullAssetPath);
  if (!stats.isFile()) {
    throw new CustomError("Not a file", 400);
  }

  // Set appropriate content type based on file extension
  const ext = path.extname(fullAssetPath).toLowerCase();
  let contentType = 'text/plain';
  
  switch (ext) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  // Stream the file
  const fileStream = fs.createReadStream(fullAssetPath);
  fileStream.pipe(res);
  
  fileStream.on('error', (error) => {
    console.error('❌ Error streaming asset:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error reading asset' });
    }
  });
});

// Get store data for API
export const getStoreData = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;

  if (!storeId) {
    throw new CustomError("Store ID is required", 400);
  }

  // Get store information (mock for now)
  const store = {
    _id: storeId,
    name: "My Store",
    description: "Welcome to my online store",
    logo: "",
    domain: `store${storeId}.ziplofy.com`
  };

  // Get active theme
  const installedTheme = await InstalledThemes.findOne({
    user: storeId,
    isActive: true
  }).populate('theme');
  
  // Get products (mock for now)
  const products = [
    {
      _id: "product1",
      name: "Sample Product 1",
      description: "This is a sample product",
      price: 29.99,
      images: [],
      category: "Electronics",
      inStock: true
    }
  ];

  res.json({
    success: true,
    data: {
      store: {
        _id: store._id,
        name: store.name,
        description: store.description,
        logo: store.logo,
        domain: store.domain
      },
      theme: installedTheme?.theme || null,
      products: products.map((product: any) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        category: product.category,
        inStock: product.inStock
      }))
    }
  });
});

// Helper function to inject store data into HTML
function injectStoreData(html: string, data: any): string {
  const { store, products, theme } = data;

  // Create a script tag with store data
  const storeDataScript = `
    <script>
      window.ZIPLOFY_STORE_DATA = {
        store: ${JSON.stringify({
          _id: store._id,
          name: store.name,
          description: store.description,
          logo: store.logo,
          domain: store.domain
        })},
        products: ${JSON.stringify(products.map((product: any) => ({
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          category: product.category,
          inStock: product.inStock
        })))},
        theme: ${JSON.stringify({
          _id: theme._id,
          name: theme.name,
          description: theme.description,
          category: theme.category
        })}
      };
    </script>
  `;

  // Inject the script before closing head tag
  html = html.replace('</head>', `${storeDataScript}</head>`);

  // Replace common placeholders
  html = html.replace(/\{\{store\.name\}\}/g, store.name || 'My Store');
  html = html.replace(/\{\{store\.description\}\}/g, store.description || '');
  html = html.replace(/\{\{store\.logo\}\}/g, store.logo || '');
  html = html.replace(/\{\{theme\.name\}\}/g, theme.name || 'Default Theme');

  // Add product grid if products exist
  if (products.length > 0) {
    const productGrid = generateProductGrid(products);
    html = html.replace('<!-- PRODUCTS_GRID -->', productGrid);
    html = html.replace(/\{\{products\.grid\}\}/g, productGrid);
  }

  return html;
}

// Helper function to generate product grid HTML
function generateProductGrid(products: any[]): string {
  return `
    <div class="products-grid">
      ${products.map(product => `
        <div class="product-card" data-product-id="${product._id}">
          <div class="product-image">
            ${product.images && product.images.length > 0 
              ? `<img src="${product.images[0]}" alt="${product.name}" />`
              : '<div class="no-image">No Image</div>'
            }
          </div>
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description || ''}</p>
            <div class="product-price">$${product.price || 0}</div>
            <div class="product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
              ${product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
            <button class="add-to-cart-btn" ${!product.inStock ? 'disabled' : ''}>
              Add to Cart
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
