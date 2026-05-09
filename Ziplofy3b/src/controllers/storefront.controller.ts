import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';
import { InstalledThemes } from '../models/installed-themes.model';
import { Theme } from '../models/theme.model';
import { CustomTheme } from '../models/custom-theme.model';
import { Store } from '../models/store/store.model';
import { listLiquidTemplateNames, themeHasLiquidTemplates } from '../utils/storefront-theme-runtime.util';
// import { Product } from '../models/product.model';
// import { Store } from '../models/store.model';

// Render storefront with theme and products
export const renderStorefront = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const { themeId } = req.query as { themeId?: string };

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

  const storeDoc = await Store.findById(storeId).select("appliedTheme").lean();
  const appliedThemeId = themeId || (storeDoc?.appliedTheme ? String(storeDoc.appliedTheme) : null);
  if (!appliedThemeId) {
    throw new CustomError("No applied theme found for this store", 404);
  }

  const installedTheme = await InstalledThemes.findOne({
    $or: [{ store: storeId }, { user: storeId }],
    theme: new Types.ObjectId(appliedThemeId),
    uninstalledAt: null
  }).populate('theme');

  const activeTheme = installedTheme?.theme as any;
  if (!activeTheme) {
    throw new CustomError("Applied theme is not installed for this store", 404);
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

  const storeDoc = await Store.findById(storeId).select("appliedTheme").lean();
  const appliedThemeId = storeDoc?.appliedTheme ? String(storeDoc.appliedTheme) : null;

  let installedTheme: any = null;
  if (appliedThemeId && Types.ObjectId.isValid(appliedThemeId)) {
    installedTheme = await InstalledThemes.findOne({
      $or: [{ store: storeId }, { user: storeId }],
      theme: new Types.ObjectId(appliedThemeId),
      uninstalledAt: null
    }).populate('theme');
  }
  
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

export const getStorefrontThemeRuntime = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };

  if (!storeId) {
    throw new CustomError("Store ID is required", 400);
  }

  const storeDoc = await Store.findById(storeId).select("appliedTheme").lean();
  const appliedThemeId = storeDoc?.appliedTheme ? String(storeDoc.appliedTheme) : null;
  if (!appliedThemeId) {
    return res.status(200).json({
      success: true,
      data: null,
      message: "No applied theme for this store",
    });
  }

  const installedTheme = await InstalledThemes.findOne({
    $or: [{ store: storeId }, { user: storeId }],
    theme: new Types.ObjectId(appliedThemeId),
    uninstalledAt: null,
  }).lean();

  const theme = await Theme.findById(appliedThemeId).lean();
  const customTheme = !theme ? await CustomTheme.findById(appliedThemeId).lean() : null;

  if (!theme && !customTheme) {
    return res.status(200).json({
      success: true,
      data: null,
      message: "Applied theme record is missing",
    });
  }

  const isCustomTheme = Boolean(!theme && customTheme);
  const runtimeThemeKey = isCustomTheme ? `custom-${appliedThemeId}` : appliedThemeId;

  const canonicalStoreThemeDir = path.join(
    process.cwd(),
    "uploads",
    "stores",
    storeId,
    "themes",
    String(runtimeThemeKey)
  );
  const storeThemeDir =
    installedTheme?.storePath && fs.existsSync(installedTheme.storePath)
      ? installedTheme.storePath
      : canonicalStoreThemeDir;
  const unzippedThemeDir = path.join(storeThemeDir, "unzippedTheme");
  const runtimeBaseDir = fs.existsSync(unzippedThemeDir) ? unzippedThemeDir : storeThemeDir;
  const runtimeBaseUrl = `${req.protocol}://${req.get("host")}/api/themes/installed/${encodeURIComponent(
    storeId
  )}/${encodeURIComponent(String(runtimeThemeKey))}/unzippedTheme`;

  const listFilesRecursive = (dirPath: string, prefix = ""): string[] => {
    if (!fs.existsSync(dirPath)) return [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files: string[] = [];
    entries.forEach((entry) => {
      const nextPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        files.push(...listFilesRecursive(absPath, nextPrefix));
      } else {
        files.push(nextPrefix);
      }
    });
    return files;
  };

  const cssCandidates = [
    "assets/css/style.css",
    "assets/css/category.css",
    "assets/css/product.css",
    "assets/css/cart.css",
    "assets/css/checkout.css",
    "assets/css/account.css",
    "assets/css/order.css",
    "assets/css/contact.css",
    "assets/css/blog.css",
    "assets/css/blog-detail.css",
  ];
  const jsCandidates = [
    "assets/js/main.js",
    "assets/js/add-to-cart.js",
    "assets/js/cart.js",
    "assets/js/checkout.js",
    "assets/js/account.js",
    "assets/js/order.js",
    "assets/js/contact.js",
    "assets/js/blog.js",
    "assets/js/blog-detail.js",
    "assets/js/products-carousel.js",
    "assets/js/wishlist.js",
  ];

  const hasAsset = (relativePath: string) => fs.existsSync(path.join(runtimeBaseDir, relativePath));
  const cssAssets = cssCandidates.filter(hasAsset);
  const jsAssets = jsCandidates.filter(hasAsset);
  const allThemeFiles = listFilesRecursive(runtimeBaseDir);
  const htmlAssets = allThemeFiles.filter((file) => file.toLowerCase().endsWith(".html"));

  return res.status(200).json({
    success: true,
    data: {
      storeId,
      themeId: String(appliedThemeId),
      themeName: isCustomTheme ? (customTheme as any).name : (theme as any).name,
      theme: isCustomTheme ? customTheme : theme,
      installedTheme: {
        _id: installedTheme?._id ? String(installedTheme._id) : null,
        store: installedTheme ? String((installedTheme as any).store || (installedTheme as any).user) : storeId,
        theme: String(appliedThemeId),
        installedAt: installedTheme?.installedAt || null,
        uninstalledAt: installedTheme?.uninstalledAt || null,
        storePath: installedTheme?.storePath || storeThemeDir,
      },
      storeThemeDir,
      runtimeBaseUrl,
      entryHtml: htmlAssets.includes("index.html") ? "index.html" : htmlAssets[0] || null,
      allThemeFiles,
      cssAssets,
      jsAssets,
      htmlUrls: htmlAssets.map((asset) => `${runtimeBaseUrl}/${asset}`),
      cssUrls: cssAssets.map((asset) => `${runtimeBaseUrl}/${asset}`),
      jsUrls: jsAssets.map((asset) => `${runtimeBaseUrl}/${asset}`),
      fileUrls: allThemeFiles.map((asset) => `${runtimeBaseUrl}/${asset}`),
      liquid: {
        enabled: themeHasLiquidTemplates(runtimeBaseDir),
        /** Relative to API origin; client should prefix VITE_API_URL /api host. */
        renderPagePath: `/storefront/${storeId}/render/page`,
        /** Template basenames that exist under `templates/*.liquid` (client uses this to avoid 404s). */
        templates: listLiquidTemplateNames(runtimeBaseDir),
      },
    },
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
