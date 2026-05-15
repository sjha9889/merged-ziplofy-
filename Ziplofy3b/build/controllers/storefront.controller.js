"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorefrontThemeRuntime = exports.getStoreData = exports.serveThemeAsset = exports.renderStorefront = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const error_utils_1 = require("../utils/error.utils");
const installed_themes_model_1 = require("../models/installed-themes.model");
const theme_model_1 = require("../models/theme.model");
const custom_theme_model_1 = require("../models/custom-theme.model");
const store_model_1 = require("../models/store/store.model");
const storefront_liquid_util_1 = require("../utils/storefront-liquid.util");
const theme_zip_from_s3_util_1 = require("../utils/theme-zip-from-s3.util");
const installed_themes_query_util_1 = require("../utils/installed-themes-query.util");
// import { Product } from '../models/product.model';
// import { Store } from '../models/store.model';
// Render storefront with theme and products
exports.renderStorefront = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId } = req.params;
    const { themeId } = req.query;
    console.log('🔍 Rendering storefront for store:', storeId, 'theme:', themeId);
    if (!storeId) {
        throw new error_utils_1.CustomError("Store ID is required", 400);
    }
    // Get store information (mock for now)
    const store = {
        _id: storeId,
        name: "My Store",
        description: "Welcome to my online store",
        logo: "",
        domain: `store${storeId}.ziplofy.com`
    };
    const storeDoc = await store_model_1.Store.findById(storeId).select("appliedTheme").lean();
    const appliedThemeId = themeId || (storeDoc?.appliedTheme ? String(storeDoc.appliedTheme) : null);
    if (!appliedThemeId) {
        throw new error_utils_1.CustomError("No applied theme found for this store", 404);
    }
    const installedTheme = await installed_themes_model_1.InstalledThemes.findOne({
        $and: [
            { $or: (0, installed_themes_query_util_1.storeAndUserScopeOr)(String(storeId)) },
            { theme: new mongoose_1.Types.ObjectId(appliedThemeId) },
            { uninstalledAt: null },
        ],
    }).populate('theme');
    const activeTheme = installedTheme?.theme;
    if (!activeTheme) {
        throw new error_utils_1.CustomError("Applied theme is not installed for this store", 404);
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
    const storeThemeDir = path_1.default.join(process.cwd(), 'uploads', 'stores', storeId, 'themes', activeTheme._id.toString());
    // Check if theme files exist
    if (!fs_1.default.existsSync(storeThemeDir)) {
        throw new error_utils_1.CustomError("Theme files not found", 404);
    }
    // Read the main HTML file
    const indexPath = path_1.default.join(storeThemeDir, 'index.html');
    if (!fs_1.default.existsSync(indexPath)) {
        throw new error_utils_1.CustomError("Theme index.html not found", 404);
    }
    let htmlContent = fs_1.default.readFileSync(indexPath, 'utf8');
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
exports.serveThemeAsset = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId, themeId, assetPath } = req.params;
    console.log('🔍 Serving theme asset:', { storeId, themeId, assetPath });
    // Construct the full path to the asset
    const storeThemeDir = path_1.default.join(process.cwd(), 'uploads', 'stores', storeId, 'themes', themeId);
    const fullAssetPath = path_1.default.join(storeThemeDir, assetPath);
    // Security check: ensure the asset is within the store theme directory
    const normalizedPath = path_1.default.normalize(fullAssetPath);
    const normalizedStoreDir = path_1.default.normalize(storeThemeDir);
    if (!normalizedPath.startsWith(normalizedStoreDir)) {
        throw new error_utils_1.CustomError("Access denied", 403);
    }
    // Check if file exists
    if (!fs_1.default.existsSync(fullAssetPath)) {
        throw new error_utils_1.CustomError("Asset not found", 404);
    }
    // Check if it's a file (not a directory)
    const stats = fs_1.default.statSync(fullAssetPath);
    if (!stats.isFile()) {
        throw new error_utils_1.CustomError("Not a file", 400);
    }
    // Set appropriate content type based on file extension
    const ext = path_1.default.extname(fullAssetPath).toLowerCase();
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
    const fileStream = fs_1.default.createReadStream(fullAssetPath);
    fileStream.pipe(res);
    fileStream.on('error', (error) => {
        console.error('❌ Error streaming asset:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error reading asset' });
        }
    });
});
// Get store data for API
exports.getStoreData = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId } = req.params;
    if (!storeId) {
        throw new error_utils_1.CustomError("Store ID is required", 400);
    }
    // Get store information (mock for now)
    const store = {
        _id: storeId,
        name: "My Store",
        description: "Welcome to my online store",
        logo: "",
        domain: `store${storeId}.ziplofy.com`
    };
    const storeDoc = await store_model_1.Store.findById(storeId).select("appliedTheme").lean();
    const appliedThemeId = storeDoc?.appliedTheme ? String(storeDoc.appliedTheme) : null;
    let installedTheme = null;
    if (appliedThemeId && mongoose_1.Types.ObjectId.isValid(appliedThemeId)) {
        installedTheme = await installed_themes_model_1.InstalledThemes.findOne({
            $and: [
                { $or: (0, installed_themes_query_util_1.storeAndUserScopeOr)(String(storeId)) },
                { theme: new mongoose_1.Types.ObjectId(appliedThemeId) },
                { uninstalledAt: null },
            ],
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
            products: products.map((product) => ({
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
exports.getStorefrontThemeRuntime = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const { storeId } = req.params;
    if (!storeId) {
        throw new error_utils_1.CustomError("Store ID is required", 400);
    }
    const resolved = await (0, storefront_liquid_util_1.resolveAppliedStorefrontTheme)(req, storeId);
    if (!resolved) {
        return res.status(200).json({
            success: true,
            data: null,
            message: "Applied theme record is missing",
        });
    }
    const { appliedThemeId: resolvedThemeId, runtimeThemeKey, isCustomTheme, runtimeBaseDir, runtimeBaseUrl, } = resolved;
    const installedTheme = await installed_themes_model_1.InstalledThemes.findOne({
        store: new mongoose_1.Types.ObjectId(storeId),
        theme: new mongoose_1.Types.ObjectId(resolvedThemeId),
        uninstalledAt: null,
    }).lean();
    const theme = await theme_model_1.Theme.findById(resolvedThemeId).lean();
    const customTheme = !theme ? await custom_theme_model_1.CustomTheme.findById(resolvedThemeId).lean() : null;
    let remoteDistDir;
    if (isCustomTheme) {
        const storeThemeDir = path_1.default.join(process.cwd(), "uploads", "stores", storeId, "themes", String(runtimeThemeKey));
        remoteDistDir = path_1.default.join(storeThemeDir, "remoteThemeDist");
    }
    else if (theme) {
        remoteDistDir = await (0, theme_zip_from_s3_util_1.ensureCatalogRemoteDistDir)(theme);
    }
    else {
        remoteDistDir = "";
    }
    const remoteJsDisk = path_1.default.join(remoteDistDir, "theme.js");
    const remoteCssDisk = path_1.default.join(remoteDistDir, "theme.css");
    const remoteDistPublicBase = `/api/themes/installed/${encodeURIComponent(storeId)}/${encodeURIComponent(String(runtimeThemeKey))}/remoteThemeDist`;
    const remoteThemeJsUrl = fs_1.default.existsSync(remoteJsDisk) ? `${remoteDistPublicBase}/theme.js` : null;
    const remoteThemeCssUrl = fs_1.default.existsSync(remoteCssDisk) ? `${remoteDistPublicBase}/theme.css` : null;
    const listFilesRecursive = (dirPath, prefix = "") => {
        if (!fs_1.default.existsSync(dirPath))
            return [];
        const entries = fs_1.default.readdirSync(dirPath, { withFileTypes: true });
        const files = [];
        entries.forEach((entry) => {
            const nextPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
            const absPath = path_1.default.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                files.push(...listFilesRecursive(absPath, nextPrefix));
            }
            else {
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
    const hasAsset = (relativePath) => fs_1.default.existsSync(path_1.default.join(runtimeBaseDir, relativePath));
    const cssAssets = cssCandidates.filter(hasAsset);
    const jsAssets = jsCandidates.filter(hasAsset);
    const allThemeFiles = listFilesRecursive(runtimeBaseDir);
    const htmlAssets = allThemeFiles.filter((file) => file.toLowerCase().endsWith(".html"));
    return res.status(200).json({
        success: true,
        data: {
            storeId,
            themeId: String(resolvedThemeId),
            themeName: resolved.themeName,
            theme: isCustomTheme ? customTheme : theme,
            installedTheme: installedTheme
                ? {
                    _id: String(installedTheme._id),
                    store: String(installedTheme.store),
                    theme: String(installedTheme.theme),
                    installedAt: installedTheme.installedAt || null,
                    uninstalledAt: installedTheme.uninstalledAt || null,
                }
                : null,
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
                enabled: (0, storefront_liquid_util_1.themeHasLiquidTemplates)(runtimeBaseDir),
                /** Relative to API origin; client should prefix VITE_API_URL /api host. */
                renderPagePath: `/storefront/${storeId}/render/page`,
                /** Template basenames that exist under `templates/*.liquid` (client uses this to avoid 404s). */
                templates: (0, storefront_liquid_util_1.listLiquidTemplateNames)(runtimeBaseDir),
            },
            /** Paths under `/api/...` — client resolves with `VITE_API_URL` or same-origin proxy. */
            remoteThemeJsUrl,
            remoteThemeCssUrl,
        },
    });
});
// Helper function to inject store data into HTML
function injectStoreData(html, data) {
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
        products: ${JSON.stringify(products.map((product) => ({
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
function generateProductGrid(products) {
    return `
    <div class="products-grid">
      ${products.map(product => `
        <div class="product-card" data-product-id="${product._id}">
          <div class="product-image">
            ${product.images && product.images.length > 0
        ? `<img src="${product.images[0]}" alt="${product.name}" />`
        : '<div class="no-image">No Image</div>'}
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
