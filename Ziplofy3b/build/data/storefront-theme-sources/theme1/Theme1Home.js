"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme1Home = Theme1Home;
const react_1 = require("react");
const store_context_1 = require("../../contexts/store.context");
const storefront_auth_context_1 = require("../../contexts/storefront-auth.context");
const product_context_1 = require("../../contexts/product.context");
const storefront_collections_context_1 = require("../../contexts/storefront-collections.context");
const Theme1CartDrawer_1 = require("./Theme1CartDrawer");
const Theme1Header_1 = require("./Theme1Header");
const Theme1HeroSection_1 = require("./Theme1HeroSection");
const Theme1CategorySection_1 = require("./Theme1CategorySection");
const Theme1TrendingNowSection_1 = require("./Theme1TrendingNowSection");
const Theme1NewArrivalsSection_1 = require("./Theme1NewArrivalsSection");
const Theme1BannerSection_1 = require("./Theme1BannerSection");
const Theme1Footer_1 = require("./Theme1Footer");
/**
 * Theme1 — magazine layout: gradient hero, numbered collections rail, bento product grid.
 * Same render-store hooks as other React packs; UI only.
 */
function Theme1Home() {
    const { storeFrontMeta } = (0, store_context_1.useStorefront)();
    const { user, logout } = (0, storefront_auth_context_1.useStorefrontAuth)();
    const { products, loading: productsLoading } = (0, product_context_1.useStorefrontProducts)();
    const { collections, loading: collectionsLoading } = (0, storefront_collections_context_1.useStorefrontCollections)();
    const [cartOpen, setCartOpen] = (0, react_1.useState)(false);
    const name = storeFrontMeta?.name ?? 'Store';
    const featured = products[0];
    const rest = products.slice(1);
    return (<div className="min-h-svh bg-slate-50 text-slate-900">
      <Theme1Header_1.Theme1Header storeName={name} userName={user ? `${user.firstName} ${user.lastName}`.trim() : undefined} onCartOpen={() => setCartOpen(true)} onLogout={() => {
            logout().catch(() => { });
        }}/>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Theme1HeroSection_1.Theme1HeroSection storeName={name} description={storeFrontMeta?.description}/>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <Theme1CategorySection_1.Theme1CategorySection collections={collections} loading={collectionsLoading}/>
          <section className="space-y-8 lg:col-span-8" aria-label="Products">
            <Theme1TrendingNowSection_1.Theme1TrendingNowSection featured={featured}/>
            <Theme1NewArrivalsSection_1.Theme1NewArrivalsSection products={rest} loading={productsLoading}/>
          </section>
        </div>
        <Theme1BannerSection_1.Theme1BannerSection />
      </main>

      <Theme1Footer_1.Theme1Footer storeName={name}/>

      <Theme1CartDrawer_1.Theme1CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}/>
    </div>);
}
