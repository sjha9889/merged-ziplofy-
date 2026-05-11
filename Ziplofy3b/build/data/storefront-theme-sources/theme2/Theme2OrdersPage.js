"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme2OrdersPage = Theme2OrdersPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const store_context_1 = require("../../contexts/store.context");
const storefront_auth_context_1 = require("../../contexts/storefront-auth.context");
const storefront_order_context_1 = require("../../contexts/storefront-order.context");
const currency_1 = require("../../utils/currency");
const Theme2Header_1 = require("./Theme2Header");
const Theme2Footer_1 = require("./Theme2Footer");
function Theme2OrdersPage() {
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
    return (<div className="min-h-svh bg-[#FFEB00] font-mono text-black">
      <div className="border-b-4 border-black bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FFEB00]">
        ORDERS // {(storeFrontMeta?.name ?? 'STORE').toUpperCase()}
      </div>
      <Theme2Header_1.Theme2Header userName={`${user.firstName} ${user.lastName}`.trim()} onCartOpen={() => { }} onLogout={() => {
            logout().catch(() => { });
            navigate('/');
        }}/>
      <main className="mx-auto max-w-5xl px-3 py-8">
        <h1 className="mb-4 text-xl font-black uppercase">My Orders</h1>
        {loading && orders.length === 0 ? (<p className="text-sm font-bold uppercase">LOADING…</p>) : orders.length === 0 ? (<p className="text-sm font-bold uppercase">NO_ORDERS</p>) : (<div className="space-y-3">
            {orders.map((o) => (<div key={o._id} className="border-4 border-black bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-bold">{new Date(o.createdAt).toLocaleString()}</p>
                  <p className="border-2 border-black px-2 py-1 text-[10px] font-black uppercase">{o.status}</p>
                </div>
                <p className="mt-2 text-xs font-black uppercase">ORDER #{o._id.slice(-8).toUpperCase()}</p>
                <p className="mt-1 text-sm font-black">{(0, currency_1.formatINR)(o.total)}</p>
              </div>))}
          </div>)}
      </main>
      <Theme2Footer_1.Theme2Footer />
    </div>);
}
