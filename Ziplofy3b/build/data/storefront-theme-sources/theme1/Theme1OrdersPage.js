"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme1OrdersPage = Theme1OrdersPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const store_context_1 = require("../../contexts/store.context");
const storefront_auth_context_1 = require("../../contexts/storefront-auth.context");
const storefront_order_context_1 = require("../../contexts/storefront-order.context");
const currency_1 = require("../../utils/currency");
const Theme1Header_1 = require("./Theme1Header");
const Theme1Footer_1 = require("./Theme1Footer");
function Theme1OrdersPage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { storeFrontMeta } = (0, store_context_1.useStorefront)();
    const { user, checkAuth, logout } = (0, storefront_auth_context_1.useStorefrontAuth)();
    const { orders, loading, getOrdersByCustomerId } = (0, storefront_order_context_1.useStorefrontOrder)();
    (0, react_1.useEffect)(() => {
        checkAuth().catch(() => { });
    }, [checkAuth]);
    (0, react_1.useEffect)(() => {
        if (!user?._id)
            return;
        getOrdersByCustomerId(user._id).catch(() => { });
    }, [user?._id, getOrdersByCustomerId]);
    if (!user)
        return null;
    return (<div className="min-h-svh bg-slate-50 text-slate-900">
      <Theme1Header_1.Theme1Header storeName={storeFrontMeta?.name ?? 'Store'} userName={`${user.firstName} ${user.lastName}`.trim()} onCartOpen={() => { }} onLogout={() => {
            logout().catch(() => { });
            navigate('/');
        }}/>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-4 text-xl font-semibold">My Orders</h1>
        {loading && orders.length === 0 ? (<p className="text-sm text-slate-500">Loading orders...</p>) : orders.length === 0 ? (<p className="text-sm text-slate-500">No orders yet.</p>) : (<div className="space-y-3">
            {orders.map((o) => (<div key={o._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-500">{new Date(o.createdAt).toLocaleString()}</p>
                  <p className="text-xs font-semibold uppercase text-teal-700">{o.status}</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">Order #{o._id.slice(-8).toUpperCase()}</p>
                <p className="mt-1 text-sm font-bold text-teal-800">{(0, currency_1.formatINR)(o.total)}</p>
              </div>))}
          </div>)}
      </main>
      <Theme1Footer_1.Theme1Footer storeName={storeFrontMeta?.name ?? 'Store'}/>
    </div>);
}
