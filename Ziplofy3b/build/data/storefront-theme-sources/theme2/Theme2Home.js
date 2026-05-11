"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme2Home = Theme2Home;
const react_1 = require("react");
const store_context_1 = require("../../contexts/store.context");
const storefront_auth_context_1 = require("../../contexts/storefront-auth.context");
const product_context_1 = require("../../contexts/product.context");
const storefront_collections_context_1 = require("../../contexts/storefront-collections.context");
const Theme2CartDrawer_1 = require("./Theme2CartDrawer");
const Theme2Header_1 = require("./Theme2Header");
const Theme2HeroSection_1 = require("./Theme2HeroSection");
const Theme2CategorySection_1 = require("./Theme2CategorySection");
const Theme2TrendingNowSection_1 = require("./Theme2TrendingNowSection");
const Theme2NewArrivalsSection_1 = require("./Theme2NewArrivalsSection");
const Theme2BannerSection_1 = require("./Theme2BannerSection");
const Theme2Footer_1 = require("./Theme2Footer");
/**
 * Theme2 — brutalist / constructivist: harsh black×yellow, mono type, zero radius,
 * horizontal product “tape”, full-width collection slabs. Same hooks as theme1.
 */
function Theme2Home() {
    const { storeFrontMeta } = (0, store_context_1.useStorefront)();
    const { user, logout } = (0, storefront_auth_context_1.useStorefrontAuth)();
    const { products, loading: productsLoading } = (0, product_context_1.useStorefrontProducts)();
    const { collections, loading: collectionsLoading } = (0, storefront_collections_context_1.useStorefrontCollections)();
    const [cartOpen, setCartOpen] = (0, react_1.useState)(false);
    const name = (storeFrontMeta?.name ?? 'STORE').toUpperCase();
    return (<div className="min-h-svh bg-[#FFEB00] font-mono text-black selection:bg-black selection:text-[#FFEB00]">
      {/* Top strip — raw utility bar */}
      <div className="border-b-4 border-black bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFEB00]">
        <span className="inline-block w-[8ch]">SYS_OK</span>
        <span className="opacity-80"> :: </span>
        <span>THEME2_BRUTAL // SAME_RUNTIME</span>
      </div>

      <div className="grid min-h-[calc(100svh-2.25rem)] grid-cols-1 md:grid-cols-[1fr_280px]">
        {/* Main chaos column */}
        <div className="flex flex-col border-b-4 border-black md:border-b-0 md:border-r-4">
          <Theme2HeroSection_1.Theme2HeroSection storeName={name} description={storeFrontMeta?.description}/>
          <Theme2Header_1.Theme2Header userName={user ? `${user.firstName} ${user.lastName}`.trim() : undefined} onCartOpen={() => setCartOpen(true)} onLogout={() => {
            logout().catch(() => { });
        }}/>
          <Theme2TrendingNowSection_1.Theme2TrendingNowSection products={products} loading={productsLoading}/>
          <Theme2NewArrivalsSection_1.Theme2NewArrivalsSection products={products.slice(0, 8)}/>
          <Theme2BannerSection_1.Theme2BannerSection />
        </div>

        <Theme2CategorySection_1.Theme2CategorySection collections={collections} loading={collectionsLoading}/>
      </div>
      <Theme2Footer_1.Theme2Footer />

      <Theme2CartDrawer_1.Theme2CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}/>
    </div>);
}
